import { useContext } from 'react';
import update from 'immutability-helper';
import { formatISO } from 'date-fns'

import AppStore from 'containers/App/context'
import { useApp, getSql, saveToDisk, request } from 'containers/App/actions'
import { InputForm } from 'containers/ModalForm'
import { useSql } from 'containers/Controller/Sql'

export const useReport = (props) => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const sql = useSql()
  const showInput =  InputForm()

  const reportPath = (params) => {
    let query = new URLSearchParams()
    query.append("reportkey", params.template)
    query.append("orientation", params.orient)
    query.append("size", params.size)
    query.append("output", params.type)
    if(params.filters){
      return `/report?${query.toString()}&${params.filters}`  
    }
    query.append("nervatype", params.nervatype||data.edit.current.type)
    return `/report?${query.toString()}&filters[@id]=${params.id||data.edit.current.item.id}`
  }

  const setPreviewPage = (options) => {
    const module = options.module || "edit"
    let pageNumber = options.pageNumber || 1
    pageNumber = pageNumber < 1 ? 1 : pageNumber
    pageNumber = pageNumber > options.pdf.numPages ? options.pdf.numPages : pageNumber
    options.pdf.getPage(pageNumber).then((page) => {
      let preview = update({}, {$merge: {
        type: "pdf",
        template: options.template,
        size: options.size,
        orient: options.orient,
        pdf: options.pdf,
        page: page,
        scale: options.scale || 1,
        pageNumber: pageNumber,
        totalPages: options.pdf.numPages
      }})
      if((options.id || options.refnumber) && options.nervatype){
        preview = update(preview, {$merge: {
          id: options.id,
          refnumber: options.refnumber,
          nervatype: options.nervatype
        }})
      }
      setData(module, {preview: preview})
    })
  }

  const loadPreview = (params) => {
    setData("current", { "request": true })
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = process.env.REACT_APP_PDFJS_PATH+'/pdf.worker.min.js';
    const pdata = (params.template === "template") ? params.pdf : {
      url: data.login.server+reportPath(params),
      httpHeaders: { Authorization: `Bearer ${data.login.data.token}` }
    }
    window.pdfjsLib.getDocument(pdata).promise.then((pdf) => {
      setData("current", { "request": false })
      setPreviewPage(update(params, {$merge: {
        pdf: pdf
      }}))
    }, (error) => {
      setData("current", { "request": false })
      return app.resultError(error)
    })
  }

  const addPrintQueue = async (reportkey, copy) => {
    const report = data.edit.dataset.report.filter((item)=>(item.reportkey === reportkey))[0]
    const ntype = data.login.data.groups.filter(
      (item)=>((item.groupname === "nervatype") && (item.groupvalue === data.edit.current.type)))[0]
    const values = {
      "nervatype": ntype.id, 
      "ref_id": data.edit.current.item.id, 
      "qty": parseInt(copy), 
      "employee_id": data.login.data.employee.id, 
      "report_id": report.id
    }
    const options = { method: "POST", data: [values] }
    const result = await app.requestData("/ui_printqueue", options)
    if(result.error){
      return app.resultError(result)
    }
    app.showToast({ type: "success", autoClose: true,
      title: app.getText("msg_successful"), 
      message: app.getText("report_add_groups") })
  }

  const reportOutput = async (params) => {
    if(params.type === "printqueue"){
      return addPrintQueue(params.template, params.copy)
    }
    if(params.type === "preview"){
      return loadPreview(params)
    }
    const result = await app.requestData(reportPath(params), {})
    if(result && result.error){
      app.resultError(result)
      return false
    }
    const resultUrl = URL.createObjectURL(result, {type : (params.type === "pdf") ? "application/pdf" : "application/xml; charset=UTF-8"})
    let filename = params.title+"_"+formatISO(new Date(), { representation: 'date' })+"."+params.type
    filename = filename.split("/").join("_")
    saveToDisk(resultUrl, filename)
    return true
  }

  const searchQueue = async () => {
    let edit = update(data.edit, {})
    const params = { 
      method: "POST", 
      data: [{ 
        key: "items",
        text: getSql(data.login.data.engine, sql.printqueue.items(edit.printqueue)).sql,
        values: [edit.current.item.customer_id]
      }]
    }
    let view = await app.requestData("/view", params)
    if(view.error){
      return app.resultError(view)
    }
    edit = update(edit, {dataset: {$merge: {
      items: view.items
    }}})
    setData("edit", edit)
  }

  const exportQueueAll = () => {
    const options = data.edit.current.item
    if (data.edit.dataset.items.length > 0){
      if (options.mode === "preview") {
        return app.showToast({ type: "error",
          title: app.getText("msg_warning"), 
          message: app.getText("ms_export_invalid")+" "+app.getText("printqueue_mode_preview") })
      }
      showInput({
        title: app.getText("msg_warning"), message: app.getText("label_export_all_selected"),
        infoText: app.getText("msg_delete_info")+" "+app.getText("ms_continue_warning"), 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, async () => {
            for (let index = 0; index < data.edit.dataset.items.length; index++) {
              const item = data.edit.dataset.items[index];
              let result = await reportOutput({
                type: options.mode, 
                template: item.reportkey, 
                title: item.refnumber,
                orient: options.orientation, 
                size: options.size, 
                copy: item.copies,
                nervatype: item.typename,
                id: item.ref_id
              })
              if(result){
                result = await app.requestData(
                  "/ui_printqueue", { method: "DELETE", query: { id: item.id } })
                if(result && result.error){
                  return app.resultError(result)
                }
              }
            }
            searchQueue()
          })
        }
      })
    }
  }

  const createReport = async (output) => {
    let _filters = [];
    data.edit.current.fieldvalue.forEach((rfdata) => {
      if (rfdata.selected) {
        if(rfdata.fieldtype === "bool"){
          _filters.push(`filters[${rfdata.name}]=${(rfdata.fieldtype)?"1":"0"}`)
        } else {
          _filters.push(`filters[${rfdata.name}]=${rfdata.value}`)
        }
      }
    })
    const report = data.edit.current.item
    const params = {
      type: "auto",
      template: report.reportkey, 
      title: report.reportkey,
      orient: report.orientation, 
      size: report.size,
      filters: _filters.join("&")
    }
    switch (output) {
      case "preview":
        return loadPreview(params)
      
      case "xml":
        params.type = "xml"
        params.ctype = "application/xml; charset=UTF-8"
        break;
      
      case "csv":
        params.ctype = "text/csv; charset=UTF-8"
        break;

      default:
        params.ctype = "application/pdf"
        break;
    }
    const result = await app.requestData(reportPath(params), {})
    if(result && result.error){
      return app.resultError(result)
    }
    let resultUrl
    if(output === "csv"){
      var blob = new Blob([result], { type: 'text/csv;charset=utf-8;' })
      resultUrl = URL.createObjectURL(blob)
      output = "csv"
    } else {
      resultUrl = URL.createObjectURL(result, {type : params.ctype})
    }
    let filename = params.title+"_"+formatISO(new Date(), { representation: 'date' })+"."+output
    filename = filename.split("/").join("_")
    return saveToDisk(resultUrl, filename)
  }

  const printQueue = () => {
    const options = data.edit.current.item
    if (data.edit.dataset.items.length > 0){
      const server = data.edit.dataset.server_printers.filter(item => (item.menukey === options.server))[0]
      if (!server) {
        return app.showToast({ type: "error",
          title: app.getText("msg_warning"), 
          message: app.getText("msg_required")+" "+app.getText("printqueue_server_printer") })
      }
      if(!server.address || (server.address === "")){
        return app.showToast({ type: "error",
          title: app.getText("msg_warning"), 
          message: app.getText("msg_required")+" "+server.description+" - "+app.getText("menucmd_address") })
      }
      showInput({
        title: app.getText("msg_warning"), message: app.getText("label_print"),
        infoText: app.getText("msg_delete_info")+" "+app.getText("ms_continue_warning"), 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, async () => {
            const items = data.edit.dataset.items.map(item => item.id)
            let params = { method: "POST", 
              data: {
                key: server.funcname || server.menukey,
                values: { 
                  items: items, 
                  orientation: options.orientation, 
                  size: options.size
                }
              }
            }
            try {
              let result = await request(server.address, params)
              if(result.error){
                app.resultError(result)
                return null
              }
              searchQueue()
            } catch (error) {
              app.resultError(error)
            }
          })
        }
      })
    }
  }

  return {
    loadPreview: loadPreview,
    setPreviewPage: setPreviewPage,
    createReport: createReport,
    exportQueueAll: exportQueueAll,
    searchQueue: searchQueue,
    printQueue: printQueue,
    reportOutput: reportOutput
  }
}