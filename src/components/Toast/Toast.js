import React from 'react';
import styles from './Toast.module.css';

import { ExclamationTriangle, CheckCircle, InfoCircle } from 'components/Icons';

export default (props) => {
  const getIcon = () => {
    if (props.icon === "exclamation"){
      return <ExclamationTriangle height="24px" width="27px" />
    }
    if (props.icon === "success"){
      return <CheckCircle height="24px" width="24px" />
    }
    if (props.icon === "info"){
      return <InfoCircle height="24px" width="24px" />
    }
    return <InfoCircle height="24px" width="24px" />
  }
  if(props.type === "message"){
    return (
      <div className={styles.box}>
        {(props.title)?<div className={styles.header} >{props.title}</div>:null}
        <div className={styles.mbody} dangerouslySetInnerHTML={{ __html: props.message }} />
      </div>
    )
  }
  return(
    <div className="row" >
      <div className={`${"cell"} ${styles.icon}`} >
        {getIcon()}
      </div>
      <div className={`${"cell"} ${styles.msgcell}`} >
        <div className={styles.message}>{props.message}</div>
      </div>
    </div>)
};
