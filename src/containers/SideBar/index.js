import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSearch } from 'containers/Search/actions'
import { useEditor } from 'containers/Editor/actions'
import { useForm } from 'containers/Editor/forms'
import { SelectorForm, InputForm } from 'containers/ModalForm'

import { Search, SideBar, Edit, Preview } from './SideBar';

export default (props) => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const search = useSearch()
  const editor = useEditor()
  const showSelector = SelectorForm()
  const showInput =  InputForm()
  
  const [state] = useState({
    login: data.login.data,
    theme: data.session.theme,
    forms: useForm()
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
    if(state.data.side === "show"){
      app.setSideBar()
    }
  }

  state.showBrowser = (vkey, view) => {
    search.showBrowser(vkey, view)
  }
  
  state.editorNew = (params) =>{
    app.setSideBar()
    if(params.ttype === "shipping"){
      showSelector({
        type: "transitem_delivery", filter: "", 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        onSelect: (row, filter) => {
          setData("current", { modalForm: null }, ()=>{
            const params = row.id.split("/")
            editor.checkEditor({ 
              ntype: params[0], ttype: params[1], id: parseInt(params[2],10), 
              shipping: true
            }, 'LOAD_EDITOR')
          })
        }
      })
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
  }

  state.editorDelete = () => {
    app.setSideBar()
    if(data.edit.current.form){
      editor.deleteEditorItem({
        fkey: data.edit.current.form_type, 
        table: data.edit.current.form_datatype, 
        id: data.edit.current.form.id
      })
    } else {
      editor.deleteEditor()
    }
  }

  state.reportSettings = () => {
    app.setSideBar()
    editor.checkEditor({}, 'REPORT_SETTINGS')
  }

  state.transCopy = (ctype) => {
    app.setSideBar();
    if (ctype === "create") {
      editor.checkEditor({}, "CREATE_TRANS_OPTIONS");
    } else {
      showInput({
        title: app.getText("msg_warning"), message: app.getText("msg_copy_text"),
        infoText: app.getText("msg_delete_info"), 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, () => {
            editor.checkEditor({ cmdtype: "copy", transcast: ctype }, "CREATE_TRANS");
          })
        }
      })
    }
  };

  state.loadFormula = () => {
    app.setSideBar()
    editor.checkEditor({}, 'LOAD_FORMULA')
  }
  
  state.setLink = (type, field) =>{
    app.setSideBar()
    let link_id = (data.edit.current.transtype === "cash") ? 
      data.edit.current.extend.id : data.edit.current.form.id;
    editor.checkEditor(
      { fkey: type, id: null, link_field: field, link_id: link_id }, 'SET_EDITOR_ITEM')
  }

  state.shippingAddAll = () => {
    app.setSideBar()
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
  }

  state.shippingCreate = () => {
    app.setSideBar()
    editor.createShipping()
  }

  state.checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    editor.checkEditor(options, cbKeyTrue, cbKeyFalse)
  }

  state.editorBack = () =>{
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
    if(state.data.side === "show"){
      app.setSideBar()
    }
  }

  state.closePreview = () => {
    app.setSideBar()
    const edit = update(data.edit, {$merge: {
      preview: null
    }})
    setData("edit", edit)
  }

  state.changeOrientation = () => {
    app.setSideBar()
    const options = update(state.preview, {$merge: {
      orient: (state.preview.orient === "portrait") ? "landscape" : "portrait"
    }})
    editor.loadPreview(options)
  }

  state.prevPage = () => {
    if(state.preview.pageNumber > 1){
      app.setSideBar()
      const options = update(state.preview, {$merge: {
        pageNumber: state.preview.pageNumber - 1
      }})
      editor.setPreviewPage(options)
    }
  }

  state.nextPage = () => {
    if(state.preview.pageNumber < state.preview.totalPages){
      app.setSideBar()
      const options = update(state.preview, {$merge: {
        pageNumber: state.preview.pageNumber + 1
      }})
      editor.setPreviewPage(options)
    }
  }
  
  state.setScale = (value) => {
    app.setSideBar()
    const options = update(state.preview, {$merge: {
      scale: value
    }})
    editor.setPreviewPage(options)
  }

  state.prevTransNumber = () => {
    app.setSideBar()
    editor.prevTransNumber()
  }

  state.nextTransNumber = () => {
    app.setSideBar()
    editor.nextTransNumber()
  }

  state.saveEditor = async () => {
    app.setSideBar()
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
  }

  state.searchItems = () => {
    app.setSideBar()
    editor.searchQueue()
  }

  state.createReport = (output) => {
    app.setSideBar()
    editor.createReport(output)
  }

  state.exportAll = () => {
    app.setSideBar()
    editor.exportQueueAll()
  }

  state.eventExport = () => {
    app.setSideBar()
    editor.exportEvent()
  }

  state.printReport = () => {
    app.setSideBar()
    editor.printQueue()
  }

  state.bookmarkSave = (params) => {
    app.setSideBar()
    app.saveBookmark(params)
  }

  state.data = data.current
  state.module = data[state.data.module]
  state.preview = data.edit.preview

  switch (state.data.module) {
    case "search":
      return <Search {...state} />
    case "edit":
      if(data.edit.preview){
        return <Preview {...state} />
      }
      return <Edit {...state} />
    case "setting":
      return <SideBar {...state} />
    case "help":
      return <SideBar {...state} />
    default:
      return <SideBar {...state} />
  }
}