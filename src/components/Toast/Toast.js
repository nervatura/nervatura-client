import React from 'react';
import styles from './Toast.module.css';

import { ExclamationTriangle, CheckCircle, InfoCircle } from 'components/Icons';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { icon, message } = props

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
