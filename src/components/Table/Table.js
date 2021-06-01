import React, { memo, createElement } from 'react';
import * as Table from 'reactabular-table';
import * as sort from 'sortabular';
import orderBy from 'lodash/orderBy';

import Paginator, { paginate } from 'components/Paginator';
import { Plus } from 'components/Icons';
import './Table.css';

export const TableView = memo((props) => {
  const { getColumns, rowFilter, onSelect, onRow, onAddItem } = props
  const { rowKey, sortingColumns, pagination, paginationTop,
    tableFilter, filter, filterPlaceholder, filterChange, labelAdd, addIcon } = props

  const columns = getColumns()
  const tableRows = (pagination.perPage > 0) ? 
    paginate(pagination)(
      sort.sorter({ columns, sortingColumns, sort: orderBy })(rowFilter())) :
    sort.sorter({ columns, sortingColumns, sort: orderBy })(rowFilter())

  return(
    <div className="ui-table" >
      {((tableRows.amount) && (tableRows.amount > 1) && paginationTop) ?
        <Paginator pagination={pagination} pages={tableRows.amount} onSelect={onSelect} />:null}
      {(tableFilter) ? <div className="row full">
        <div className="cell" ><input id="filter" 
          placeholder={filterPlaceholder} value={filter} 
          onChange={(evt) => filterChange(evt.target.value)} /></div>
        {(onAddItem)?<div className="cell" style={{width:20}} ><button 
          className={`${"border-button"} ${"addButton"}`} 
          onClick={ ()=>onAddItem() } >{createElement(addIcon || Plus)}<span className="addLabel">{labelAdd}</span>
        </button></div>:null}
      </div>: null}
      <Table.Provider columns={columns} >
        <Table.Header />
        <Table.Body rows={tableRows.rows || tableRows} rowKey={rowKey} 
          onRow={onRow} />
      </Table.Provider>
      {((tableRows.amount) && (tableRows.amount > 1) && !paginationTop) ?
        <Paginator pagination={pagination} pages={tableRows.amount} onSelect={onSelect} />:null}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.rows === nextProps.rows) &&
    (prevProps.sortingColumns === nextProps.sortingColumns) &&
    (prevProps.filter === nextProps.filter) &&
    (prevProps.pagination === nextProps.pagination) &&
    (prevProps.fields === nextProps.fields)
  )
})