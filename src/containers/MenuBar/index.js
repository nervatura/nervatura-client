import React, { useContext, useState } from 'react';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { MenuBar } from './MenuBar';

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()
  
  const [state] = useState({})

  state.data = data.current

  state.signOut = () => {
    app.signOut()
  }

  state.sideBar = () => {
    app.setSideBar()
  }

  state.loadModule = (key) => {
    setData("current", { module: key, menu: "" })
  }

  state.setScroll = () => {
    window.scrollTo(0,0);
  }

  return (
    <MenuBar {...state} />
  )
}
