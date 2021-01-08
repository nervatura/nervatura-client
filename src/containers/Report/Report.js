import React, { memo } from 'react';

import styles from './Report.module.css';

export const Preview = memo((props) => {
  const { viewerRef, canvasRef, theme } = props
  return (
    <div ref={viewerRef} className={`${"page padding-normal"} ${theme}`} >
      <div className="section center" >
        <canvas ref={canvasRef} className={`${styles.pdfPage}`} />
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.canvasRef.current === nextProps.canvasRef.current)
  )
})