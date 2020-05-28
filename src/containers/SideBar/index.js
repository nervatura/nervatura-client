import React, { useContext, useState } from 'react';

import AppStore from 'containers/App/context'
import { Search, SideBar } from './SideBar';

export default (props) => {
  const { data, actions } = useContext(AppStore);
  
  const [state] = useState({
    mdKey: "current",
    login: data.login.data
  })

  state.changeData = (key, value) => {
    actions.setData(state.data.module, { [key]: value })
  }

  state.quickView = (qview) => {
    actions.setData(state.data.module, { 
      result: [], vkey: null, qview: qview, qfilter: "" })
    if(state.data.side === "show"){
      actions.setSideBar()
    }
  }

  state.showBrowser = (vkey, view) => {
    actions.showBrowser(vkey, view)
  }

  state.data = data[state.mdKey]
  state.module = data[state.data.module]

  if(data.preview[state.data.module]){
    return <SideBar {...state} /> 
  } else {
    switch (state.data.module) {
      case "search":
        return <Search {...state} />
      case "edit":
        return <SideBar {...state} />
      case "setting":
        return <SideBar {...state} />
      case "help":
        return <SideBar {...state} />
      default:
        return <SideBar {...state} />
    }
  }
}