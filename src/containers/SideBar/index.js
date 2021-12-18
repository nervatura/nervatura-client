/* eslint-disable import/no-anonymous-default-export */
import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSearch } from 'containers/Search/actions'
import { useEditor } from 'containers/Editor/actions'
import { useSetting } from 'containers/Setting/actions'
import { useTemplate } from 'containers/Controller/Template'
import { useForm } from 'containers/Controller/Forms'
import { useReport } from 'containers/Report/actions'
import { useQueries } from 'containers/Controller/Queries'
import Selector from 'components/Modal/Selector'
import InputBox from 'components/Modal/InputBox'

import { Search, SideBar, Edit, Preview, Setting as SettingBar } from './SideBar';

export default (props) => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const search = useSearch()
  const editor = useEditor()
  const setting = useSetting()
  const queries = useQueries()
  const template = useTemplate()
  const report = useReport()
  
  const [state] = useState({
    username: data.login.username,
    login: data.login.data,
    forms: useForm(),
    showHelp: app.showHelp,
    getText: app.getText
  })

  state.editState = () => {
    setData("current", { edit: !state.data.edit })
  }
  
  state.changeData = (key, value) => {
    setData(state.data.module, { [key]: value })
  }

  state.quickView = (qview) => {
    setData(state.data.module, { 
      result: [], vkey: null, qview: qview, qfilter: "" })
    setData("current", { side: app.getSideBar() })
  }

  state.showBrowser = (vkey, view) => {
    search.showBrowser(vkey, view)
  }
  
  state.editorNew = (params) =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      if(params.ttype === "shipping"){
        let formProps = {
          view: "transitem_delivery", 
          columns: queries.quick["transitem_delivery"]().columns,
          result: [],
          filter: "",
          getText: app.getText, 
          onClose: ()=>setData("current", { modalForm: null }), 
          onSelect: (row, filter) => {
            setData("current", { modalForm: null }, ()=>{
              const params = row.id.split("/")
              editor.checkEditor({ 
                ntype: params[0], ttype: params[1], id: parseInt(params[2],10), 
                shipping: true
              }, 'LOAD_EDITOR')
            })
          },
          onSearch: async (filter)=>{
            const view = await search.quickSearch("transitem_delivery", filter)
            if(view.error){
              return app.resultError(view)
            }
            formProps.result = view.result
            setData("current", { modalForm: <Selector {...formProps} /> })
          }
        }
        setData("current", { modalForm: <Selector {...formProps} /> })
      } else if(data.edit.current.form){
        editor.checkEditor({
          fkey: params.fkey || data.edit.current.form_type, 
          id: null}, 'SET_EDITOR_ITEM')
      } else {
        editor.checkEditor({
          ntype: params.ntype || data.edit.current.type, 
          ttype: params.ttype || data.edit.current.transtype, 
          id: null}, 'LOAD_EDITOR')
      }
    })
  }

  state.editorDelete = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      if(data.edit.current.form){
        editor.deleteEditorItem({
          fkey: data.edit.current.form_type, 
          table: data.edit.current.form_datatype, 
          id: data.edit.current.form.id
        })
      } else {
        editor.deleteEditor()
      }
    })
  }

  state.reportSettings = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.checkEditor({}, 'REPORT_SETTINGS')
    })
  }

  state.transCopy = (ctype) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      if (ctype === "create") {
        editor.checkEditor({}, "CREATE_TRANS_OPTIONS");
      } else {
        setData("current", { modalForm: 
          <InputBox 
            title={app.getText("msg_warning")}
            message={app.getText("msg_copy_text")}
            infoText={app.getText("msg_delete_info")}
            defaultOK={true}
            labelOK={app.getText("msg_ok")}
            labelCancel={app.getText("msg_cancel")}
            onCancel={() => {
              setData("current", { modalForm: null })
            }}
            onOK={(value) => {
              setData("current", { modalForm: null }, () => {
                editor.checkEditor({ cmdtype: "copy", transcast: ctype }, "CREATE_TRANS");
              })
            }}
          /> 
        })
      }
    })
  };

  state.loadFormula = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.checkEditor({}, 'LOAD_FORMULA')
    })
  }
  
  state.setLink = (type, field) =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      let link_id = (data.edit.current.transtype === "cash") ? 
      data.edit.current.extend.id : data.edit.current.form.id;
      editor.checkEditor(
        { fkey: type, id: null, link_field: field, link_id: link_id }, 'SET_EDITOR_ITEM')
    })    
  }

  state.shippingAddAll = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      let edit = update({}, {$set: data.edit})
      edit.dataset.shipping_items_.forEach(sitem => {
        if (sitem.diff !== 0 && sitem.edited !== true) {
          edit = update(edit, {dataset: { shiptemp: {$push: [{ 
            "id": sitem.item_id+"-"+sitem.product_id,
            "item_id": sitem.item_id, 
            "product_id": sitem.product_id,  
            "product": sitem.product, 
            "partnumber": sitem.partnumber,
            "partname": sitem.partname, 
            "unit": sitem.unit, 
            "batch_no":"", 
            "qty":sitem.diff, 
            "diff":0,
            "oqty": sitem.qty, 
            "tqty": sitem.tqty
          }]}}})
        }
      });
      editor.setEditor({shipping: true, form:"shiptemp_items"}, edit.template, edit)
    })
  }

  state.shippingCreate = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.createShipping()
    })
  }

  state.checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    editor.checkEditor(options, cbKeyTrue, cbKeyFalse)
  }

  state.editorBack = () =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      if(data.edit.current.form){
        editor.checkEditor({
          ntype: data.edit.current.type, 
          ttype: data.edit.current.transtype, 
          id: data.edit.current.item.id,
          form: data.edit.current.form_type}, 'LOAD_EDITOR')
      } else {
        if(data.edit.current.form_type === "transitem_shipping"){
          editor.checkEditor({
            ntype: data.edit.current.type, 
            ttype: data.edit.current.transtype, 
            id: data.edit.current.item.id,
            form: data.edit.current.form_type}, 'LOAD_EDITOR')
        } else {
          let reftype = state.login.groups.filter((item)=> {
            return (item.id === data.edit.current.item.nervatype)
          })[0].groupvalue
          editor.checkEditor({ntype: reftype, 
            ttype: null, id: data.edit.current.item.ref_id,
            form: data.edit.current.type}, 'LOAD_EDITOR')
        }
      }
    })
  }

  state.settingBack = (back_type) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      if(data.setting.type === "password"){
        return setData(state.data.module, { group_key: "group_admin" }, ()=>{
          setting.loadSetting({ type: 'setting' })
        })
      }
      setting.checkSetting({ type: back_type || data.setting.type }, 'LOAD_SETTING')
    })
  }

  state.closePreview = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      const preview = update(data[state.data.module], {$merge: {
        preview: null
      }})
      setData(state.data.module, preview)
    })
  }

  state.changeOrientation = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      const orient = (state.preview.orient === "portrait") ? "landscape" : "portrait"
      if(state.preview.template === "template"){
        template.showPreview(orient)
      } else {
        const options = update(state.preview, {$merge: {
          orient: orient,
          module: state.data.module
        }})
        report.loadPreview(options)
      }
    })
  }

  state.prevPage = () => {
    if(state.preview.pageNumber > 1){
      setData("current", { side: app.getSideBar() }, ()=>{
        const options = update(state.preview, {$merge: {
          pageNumber: state.preview.pageNumber - 1,
          module: state.data.module
        }})
        report.setPreviewPage(options)
      })
    }
  }

  state.nextPage = () => {
    if(state.preview.pageNumber < state.preview.totalPages){
      setData("current", { side: app.getSideBar() }, ()=>{
        const options = update(state.preview, {$merge: {
          pageNumber: state.preview.pageNumber + 1,
          module: state.data.module
        }})
        report.setPreviewPage(options)
      })
    }
  }
  
  state.setScale = (value) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      const options = update(state.preview, {$merge: {
        scale: value,
        module: state.data.module
      }})
      report.setPreviewPage(options)
    })
  }

  state.prevTransNumber = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.prevTransNumber()
    })
  }

  state.nextTransNumber = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.nextTransNumber()
    })
  }

  state.saveEditor = () => {
    setData("current", { side: app.getSideBar() }, async ()=>{
      let edit = null
      if(data.edit.current.form){
        edit = await editor.saveEditorForm()
      } else {
        edit = await editor.saveEditor()
      }
      if(edit){
        editor.loadEditor({
          ntype: edit.current.type, 
          ttype: edit.current.transtype, 
          id: edit.current.item.id,
          form: edit.current.form_type
        })
      }
    })
  }

  state.searchItems = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      report.searchQueue()
    })
  }

  state.createReport = (output) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      report.createReport(output)
    })
  }

  state.exportAll = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      report.exportQueueAll()
    })
  }

  state.eventExport = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.exportEvent()
    })
  }

  state.printReport = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      report.printQueue()
    })
  }

  state.bookmarkSave = (params) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      app.saveBookmark(params)
    })
  }

  state.settingLoad = (options) =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.loadSetting(options)
    })
  }

  state.setPassword = (username) =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      if(!username && data.edit.current){
        username = data.edit.dataset[data.edit.current.type][0].username
      }
      setting.setPasswordForm(username)
    })
  }

  state.loadCompany = () =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      editor.checkEditor({ ntype: "customer", ttype: null, id: 1}, 'LOAD_EDITOR')
    })
  }

  state.setProgram = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.setProgramForm()
    })
  }

  state.settingSave = () => {
    setData("current", { side: app.getSideBar() }, async ()=>{
      if(data.setting.type === "password"){
        setting.changePassword()
      } else {
        const result = await setting.saveSetting()
        if(result){
          setting.loadSetting({type: result.type, id: result.current.form.id})
        }
      }
    })
  }

  state.settingDelete = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.deleteSetting(data.setting.current.form)
    })
  }

  state.settingNew = () =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.checkSetting({ type: data.setting.type, id: null }, 'LOAD_SETTING')
    })
  }

  state.templatePrint = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      template.showPreview()
    })
  }

  state.templateSave = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      template.saveTemplate(true)
    })
  }

  state.templateCreate = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.createTemplate(data.setting)
    })
  }

  state.templateNewBlank = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.checkSetting({ type: "template" }, 'NEW_BLANK')
    })
  }

  state.templateNewSample = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      setting.checkSetting({ type: "template" }, 'NEW_SAMPLE')
    })
  }

  state.template2json = () => {
    setData("current", { side: app.getSideBar() }, ()=>{
      template.exportTemplate()
    })
  }

  state.data = data.current
  state.module = data[state.data.module]
  state.preview = data[state.data.module].preview

  switch (state.data.module) {
    case "search":
      return <Search {...state} />
    case "edit":
      if(data.edit.preview){
        return <Preview {...state} />
      }
      return <Edit {...state} />
    case "setting":
      if(data.setting.preview){
        return <Preview {...state} />
      }
      return <SettingBar {...state} />
    case "help":
      return <SideBar {...state} />
    default:
      return <SideBar {...state} />
  }
}