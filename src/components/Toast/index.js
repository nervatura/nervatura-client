import React, { useState } from 'react';

import Toast from "./Toast";

export default (props) => {

  const { type, icon, title, message } = props

  const [ state ] = useState({
    icon: icon || "info",
    type: type || "toast",
    title: title || null,
    message: message || ""
  })
  
  return(
    <Toast {...state}  />
  )
}