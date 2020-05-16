import React from 'react';
import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from 'components/Toast'

toast.configure({});

export const showToast = (params) => {
  //const autoClose = (params.autoClose === false) ? false : toastTime
  switch (params.type) {
    case "error":
      toast.error(
        <Toast icon="exclamation" message={params.message} />, { autoClose: params.autoClose })
      break;
    
    case "warning":
      toast.warning(
        <Toast icon="exclamation" message={params.message} />, { autoClose: params.autoClose })
      break;
    
    case "success":
      toast.success(
        <Toast icon="check" message={params.message} />, { autoClose: params.autoClose })
      break;
    
    case "info":
      toast.info(
        <Toast icon="info" message={params.message} />, { autoClose: params.autoClose })
      break;
    
    case "message":
      const toastId = params.key || "message"
      /* istanbul ignore next */
      if (!toast.isActive(toastId)) {
        toast(
          <Toast type="message" message={params.message} title={params.title} />, { 
            autoClose: params.autoClose, className: "message-box", toastId: toastId,
            //position:"top-center", 
            closeButton: false, transition: Zoom })
      }
      break;
  
    default:
      toast(params.message, { autoClose: params.autoClose })
      break;
  }
}