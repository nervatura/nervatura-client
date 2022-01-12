import update from 'immutability-helper';
import { formatISO } from 'date-fns'
import printJS from 'print-js'

import { appActions, getSql, saveToDisk } from 'containers/App/actions'
import InputBox from 'components/Modal/InputBox'
import { Sql } from 'containers/Controller/Sql'

export const reportActions = (data, setData) => {
  const app = appActions(data, setData)
  const sql = Sql({ getText: app.getText })

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
    const result = await app.requestData(reportPath(params), {})
    if(result && result.error){
      app.resultError(result)
      return false
    }
    const resultUrl = URL.createObjectURL(result, {type : (params.type === "pdf") ? "application/pdf" : "application/xml; charset=UTF-8"})
    if(params.type === "print"){
      printJS({
        printable: resultUrl,
        type: 'pdf',
        base64: false,
      })
    } else {
      let filename = params.title+"_"+formatISO(new Date(), { representation: 'date' })+"."+params.type
      filename = filename.split("/").join("_")
      saveToDisk(resultUrl, filename)
    }
    return true
  }

  const searchQueue = async () => {
    let edit = update(data.edit, {})
    const params = { 
      method: "POST", 
      data: [{ 
        key: "items",
        text: getSql(data.login.data.engine, sql.printqueue.items(edit.printqueue)).sql,
        values: []
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
      if (options.mode === "print") {
        return app.showToast({ type: "error",
          title: app.getText("msg_warning"), 
          message: app.getText("ms_export_invalid")+" "+app.getText("printqueue_mode_print") })
      }
      setData("current", { modalForm: 
        <InputBox 
          title={app.getText("msg_warning")}
          message={app.getText("label_export_all_selected")}
          infoText={app.getText("msg_delete_info")+" "+app.getText("ms_continue_warning")}
          defaultOK={true}
          labelOK={app.getText("msg_ok")}
          labelCancel={app.getText("msg_cancel")}
          onCancel={() => {
            setData("current", { modalForm: null })
          }}
          onOK={(value) => {
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
          }}
        /> 
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
    if(output === "print"){
      printJS({
        printable: resultUrl,
        type: 'pdf',
        base64: false,
      })
    } else {
      let filename = params.title+"_"+formatISO(new Date(), { representation: 'date' })+"."+output
      filename = filename.split("/").join("_")
      return saveToDisk(resultUrl, filename)
    }
  }

  return {
    createReport: createReport,
    exportQueueAll: exportQueueAll,
    searchQueue: searchQueue,
    reportOutput: reportOutput
  }
}