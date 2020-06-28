import React, { useState } from 'react';

import InputDialog from "./InputDialog";

export default (props) => {

  const { message, infoText, title, value, defaultOK, labelCancel, 
    labelOK, cbOK, cbCancel } = props

  const [ state, setState ] = useState({
    title: title || null,
    message: message || "",
    infoText: infoText,
    labelCancel: labelCancel || "Cancel",
    labelOK: labelOK || "OK",
    value: value || "",
    showValue: (typeof value === "undefined") ? false : true,
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
    <InputDialog {...state}  />
  )
}