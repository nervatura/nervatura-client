import React, { memo } from 'react';

import styles from './Search.module.css';
import { Label, Input } from 'containers/Controller'
import { Search as SearchIcon, CaretRight, ExclamationTriangle } from 'components/Icons';
import Table from 'components/Table';

export const QuickView = memo((props) => {
  const { getText, quickSearch, editRow } = props
  const { mdKey, queries, theme } = props
  const { qview, result } = props.data
  const query = queries.quick[qview]()
  const fields = {
    view: { columnDef: { property: "view",
      cell: { 
        props: {
          style: { width: 25, padding: "7px 2px 3px 8px" } 
        },
        formatters: [
        (value, { rowData }) => {
          if(rowData.deleted === 1)
            return <ExclamationTriangle  color={theme.orangeColor} />
          return <CaretRight width={9} height={24} />
        }] }
    }}
  }
  if(query.columns){
    query.columns.forEach(field => {
      fields[field[0]] = {fieldtype:'string', label: getText(qview+"_"+field[0])}
    });
  } else {
    fields.lslabel = {fieldtype:'string', label: "lslabel"}
    fields.lsvalue = {fieldtype: 'string', label: "lsvalue"}
  }
  return (
    <div className="page padding-normal" >
      <div className={`${"panel"} ${styles.maxpanel}`} >
        <div className="panel-title">
          <Label bold primary xxxlarge 
          text="quick_search" value={": "+getText("search_"+qview)} />
        </div>
        <div className="section" >
          <div className="row full container section-small-bottom" >
            <div className="cell" >
              <Input type="text" className="full" placeholder="placeholder_search"
                keys={[mdKey,"qfilter"]} onEnter={quickSearch} />
            </div>
            <div className={`${"cell"} ${styles.searchCol}`} >
              <button className={`${"full medium"}`} 
                onClick={()=>quickSearch()} >
                <Label text={"label_search"} leftIcon={<SearchIcon />} center />
              </button>
            </div>
          </div>
          {(result && (result.length > 0))?<div className="row full container section-small-bottom" >
            <Table fields={fields} rows={result}
              filterPlaceholder={getText("placeholder_search")} 
              paginationPage={10} paginationTop={true}
              onRowSelected={editRow} />
          </div>:null}
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})
