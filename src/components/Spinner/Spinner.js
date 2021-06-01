import React from 'react';

import styles from './Spinner.module.css';
import Loading from 'components/Loading';

export default React.memo((props) => {
  return (
    <div className={styles.modal} >
      <div className={styles.middle} >
        <Loading />
      </div>
    </div>
    )
});
