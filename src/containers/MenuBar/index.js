import React, { useContext, useState } from 'react';

import AppStore from 'containers/App/context'
import { MenuBar } from './MenuBar';

export default (props) => {
  const { data, actions } = useContext(AppStore);
  
  const [state] = useState({
    mdKey: "current"
  })

  state.data = data[state.mdKey]

  state.signOut = () => {
    actions.signOut()
  }

  state.sideBar = () => {
    actions.setSideBar()
  }

  state.loadModule = (key) => {
    actions.setData(state.mdKey, { module: key, menu: "" })
  }

  state.setScroll = () => {
    window.scrollTo(0,0);
  }

  return (
    <MenuBar {...state} />
  )
}
