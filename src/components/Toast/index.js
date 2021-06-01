import React, { useState } from 'react';

import Toast from "./Toast";

// eslint-disable-next-line import/no-anonymous-default-export
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