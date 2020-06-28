import React from 'react';
import styles from './InputDialog.module.css';

import { Times, Check } from 'components/Icons';

export default (props) => {
  const { valueChange, valueKey, inputCancel, inputOK } = props
  const { title, message, infoText, value, labelCancel, labelOK, defaultOK, showValue } = props

  return (
    <div className={`${"modal"} ${styles.modal}`} >
      <div className={styles.dialog}>
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
    </div>
  )
  
};