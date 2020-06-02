import React, { useState } from 'react';

import Toast from "./Toast";

export default (props) => {

  const { type, icon, title, message, infoText, value, labelCancel, 
    labelOK, defaultOK, cbCancel, cbOK } = props

  const [ state, setState ] = useState({
    icon: icon || "info",
    type: type || "toast",
    title: title || null,
    message: message || "",
    infoText: infoText,
    labelCancel: labelCancel || "Cancel",
    labelOK: labelOK || "OK",
    value: value || "",
    showValue: (!value) ? false : true,
    defaultOK: ((defaultOK === true) || !defaultOK) ? true : false
  })

  state.valueChange = (ev) => {
    setState({ ...state, value: ev.target.value })
  }

  state.valueKey = (ev) => {
    if((ev.keyCode === 13) && cbOK){
      cbOK(state.value)
    }
  }

  state.inputCancel = (ev) => {
    if(cbCancel){
      cbCancel()
    }
  }

  state.inputOK = (ev) => {
    if(cbOK){
      cbOK(state.value)
    }
  }
  
  return(
    <Toast {...state}  />
  )
}