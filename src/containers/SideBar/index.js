import React, { useContext, useState } from 'react';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSearch } from 'containers/Search/actions'
import { useEditor } from 'containers/Editor/actions'
import { useForm } from 'containers/Editor//forms'

import { Search, SideBar, Edit } from './SideBar';

export default (props) => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const search = useSearch()
  const editor = useEditor()
  
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
      /*
      setSelector({type:"transitem_delivery", filter:"", result:[], 
        callback: (row)=>{
          checkEditor({ ntype: row.ntype, ttype: row.ttype, id: row.id, 
            shipping: true}, 'LOAD_EDITOR') }
      })
      */
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

  state.data = data.current
  state.module = data[state.data.module]

  if(data.preview[state.data.module]){
    return <SideBar {...state} /> 
  } else {
    switch (state.data.module) {
      case "search":
        return <Search {...state} />
      case "edit":
        return <Edit {...state} />
      case "setting":
        return <SideBar {...state} />
      case "help":
        return <SideBar {...state} />
      default:
        return <SideBar {...state} />
    }
  }
}