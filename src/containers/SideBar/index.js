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

  state.checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    editor.checkEditor(options, cbKeyTrue, cbKeyFalse)
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