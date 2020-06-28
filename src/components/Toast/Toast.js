import React from 'react';
import styles from './Toast.module.css';

import { ExclamationTriangle, CheckCircle, InfoCircle } from 'components/Icons';

export default (props) => {
  const { type, icon, title, message } = props

  const getIcon = () => {
    if (icon === "exclamation"){
      return <ExclamationTriangle height="24px" width="27px" />
    }
    if (icon === "success"){
      return <CheckCircle height="24px" width="24px" />
    }
    if (icon === "info"){
      return <InfoCircle height="24px" width="24px" />
    }
    return <InfoCircle height="24px" width="24px" />
  }
  if(type === "message"){
    return (
      <div className={styles.box}>
        {(title)?<div className={styles.header} >{title}</div>:null}
        <div className={styles.mbody} dangerouslySetInnerHTML={{ __html: message }} />
      </div>
    )
  }
  return(
    <div className="row" >
      <div className={`${"cell"} ${styles.icon}`} >
        {getIcon()}
      </div>
      <div className={`${"cell"} ${styles.msgcell}`} >
        <div className={styles.message}>{message}</div>
      </div>
    </div>)
};
