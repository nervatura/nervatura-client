import React from 'react';
import styles from './Toast.module.css';

import { ExclamationTriangle, CheckCircle, InfoCircle, Times, Check } from 'components/Icons';

export default (props) => {
  const { valueChange, valueKey, inputCancel, inputOK } = props
  const { type, icon, title, message, infoText, value, labelCancel, labelOK, defaultOK, showValue } = props

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
  if(type === "input"){
    return (
      <div className={styles.box}>
        {(title)?<div className={styles.header} >{title}</div>:null}
        <div className="section-small">
          <div className="row full">
            <div className="cell padding-normal">
              <div className={`${styles.input}`}>{message}</div>
              {(infoText)?<div className={`${"section-small-top"} ${styles.info}`}>{infoText}</div>:null}
              {(showValue)?<div className={`${"section-small-top"}`}>
                <input type="text" className="full" 
                value={value} autoFocus={true}
                onChange={valueChange} onKeyDown={valueKey} /></div>:null}
            </div>
          </div>
          <div className="row full">
            <div className="cell padding-normal half">
              <button className={` ${"full center"} ${styles.btnCancel}`}
                onClick={inputCancel} >
                  <Times /><span className={`${styles.btnLabel}`}>{labelCancel}</span>
                  </button>
            </div>
            <div className="cell padding-normal half">
              <button className={` ${"full center primary"} ${styles.btnOK}`} 
                autoFocus={(showValue)?false:defaultOK}
                onClick={inputOK} >
                  <Check /><span className={`${styles.btnLabel}`}>{labelOK}</span>
                </button>
            </div>
          </div>
        </div>
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
