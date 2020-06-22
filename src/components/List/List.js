import React, { memo, createElement } from 'react';

import Paginator, { paginate } from 'components/Paginator';
import { Plus, Edit, Times } from 'components/Icons';
import styles from './List.module.css';

export const ListView = memo((props) => {
  const { rowFilter, onSelect, onEdit, onAddItem, onDelete } = props
  const { pagination, paginationTop, listFilter, filter, filterPlaceholder, 
    filterChange, labelAdd, addIcon, editIcon, deleteIcon } = props

  const listRows = (pagination.perPage > 0) ? paginate(pagination)(rowFilter()) : rowFilter()
  return(
    <div >
      {((listRows.amount) && (listRows.amount > 1) && paginationTop) ?
        <Paginator pagination={pagination} pages={listRows.amount} onSelect={onSelect} />:null}
      {(listFilter) ? <div className="row full">
        <div className="cell" ><input id="filter" 
          placeholder={filterPlaceholder} value={filter} 
          onChange={(evt) => filterChange(evt.target.value)} /></div>
        {(onAddItem)?<div className="cell" style={{width:20}} ><button 
          className={`${"border-button"} ${"addButton"}`} 
          onClick={ ()=>onAddItem() } >{createElement(addIcon || Plus)}<span className="addLabel">{labelAdd}</span>
        </button></div>:null}
      </div>: null}
      <ul className={`${styles.list}`} >
        {listRows.rows.map((row, index) => <li key={index} 
          className={`${styles.listRow}`} >
          {(onEdit)?<div className={`${styles.editCell}`} onClick={()=>onEdit(row)} >
            {createElement(editIcon||Edit, { width:24, height:21.3 })}
          </div>:null}
          <div className={`${styles.valueCell}`} onClick={()=>onEdit(row)}>
            <div className={`${styles.label}`} >
              <span>{row.lslabel}</span>
            </div>
            <div className={`${styles.value}`} >
              <span>{row.lsvalue}</span>
            </div>
          </div>
          {(onDelete)?<div className={`${styles.deleteCell}`} onClick={()=>onDelete(row)} >
            {createElement(deleteIcon||Times, { width:19, height:27.6 })}
          </div>:null}
        </li>)}
      </ul>
      {((listRows.amount) && (listRows.amount > 1) && !paginationTop) ?
        <Paginator pagination={pagination} pages={listRows.amount} onSelect={onSelect} />:null}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.rows === nextProps.rows) &&
    (prevProps.filter === nextProps.filter) &&
    (prevProps.pagination === nextProps.pagination)
  )
})