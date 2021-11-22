import React, { memo } from 'react';
import update from 'immutability-helper';

import styles from './Search.module.css';
import { Label, Input, Select } from 'containers/Controller'

import { SelectorView } from 'containers/ModalForm/ModalForm'
import Icon from 'components/Form/Icon'
import Table from 'components/Form/Table';
import DateTime from 'components/Form/DateTime'

export const BrowserView = memo((props) => {
  const { browserFilter, dropDown, showBrowser, getText, browserView, onEdit, 
    setColumns, showColumns, addFilter, editFilter, deleteFilter, checkTotalFields,
    showTotal, exportResult, setActions, bookmarkSave, showHelp, onPage } = props
  const { paginationPage, dateFormat, timeFormat, filter_opt_1, filter_opt_2 } = props.ui
  const { queries, current } = props
  const { vkey, view, browser_filter, dropdown, result, columns, filters, deffield, page } = props.data
  const keyMap = queries[vkey]()
  const viewDef = keyMap[view]
  let fields = {
    view: { columnDef: { property: "view",
      cell: { 
        props: {
          style: { width: 25, padding: "7px 3px 3px 8px" } 
        },
        formatters: [
        (value, { rowData }) => {
          if(!viewDef.readonly)
            return <Icon iconKey="Edit" width={24} height={21.3} 
              onClick={ ()=>onEdit('id', rowData["id"], rowData) }
              className={styles.editCol} />
          return <Icon iconKey="CaretRight" width={9} height={24} />
        }] }
    }}
  }
  Object.keys(viewDef.fields).forEach((fieldname) => {
    if(columns[view][fieldname]){
      switch (viewDef.fields[fieldname].fieldtype) {
        case "float":
        case "integer":
          fields = update(fields, {$merge: {
            [fieldname]: { fieldtype:'number', label: viewDef.fields[fieldname].label }
          }})
          break;

        case "bool":
          fields = update(fields, {$merge: {
            [fieldname]: { fieldtype:'bool', label: viewDef.fields[fieldname].label }
          }})
          break;

        case "string":
          if(fieldname === "deffield_value"){
            fields = update(fields, {$merge: {
              [fieldname]: { fieldtype:'deffield', label: viewDef.fields[fieldname].label }
            }})
          } else {
            fields = update(fields, {$merge: {
              [fieldname]: { fieldtype:'string', label: viewDef.fields[fieldname].label }
            }})
          }
          break;

        default:
          fields = update(fields, {$merge: {
            [fieldname]: { fieldtype:'string', label: viewDef.fields[fieldname].label }
          }})
      }
    }
  })
  const totalFields = checkTotalFields(viewDef.fields, deffield)
  return (
    <div className={`${"page padding-normal"} ${current.theme}`} >
      <div className={`${"panel"}`} >
        <div className="panel-title primary">
          <Label bold primary xxxlarge text={"browser_"+vkey} />
        </div>
        <div className="section container" >
          <div className="row full" >
            <div className="cell" >
              <button className={`${"full primary"}`} onClick={browserFilter} >
                <Label value={viewDef.label} leftIcon={<Icon iconKey="Filter" />} />
              </button>
            </div>
          </div>
          {(browser_filter)?<div className={`${styles.filterPanel} ${"border"}`} >
            <div className="row full section-small" >
              <div className="cell" >
                <button className={`${"border-button"} ${styles.barButton}`} 
                  onClick={ ()=>browserView() } >
                  <Label className="hide-small" text="browser_search" 
                    leftIcon={<Icon iconKey="Search" height={18} width={18} />} />
                </button>
              </div>
              <div className="cell align-right" >
                <button className={`${"border-button small-button"} ${styles.barButton}`} 
                  onClick={()=>bookmarkSave()} >
                  <Label text="browser_bookmark" leftIcon={<Icon iconKey="Star" height={14} width={15.75} />} />
                </button>
                <button className={`${"border-button small-button"} ${styles.barButton}`} 
                  disabled={(result.length === 0)?"disabled":""}
                  onClick={ ()=>exportResult(viewDef.fields) } >
                  <Label text="browser_export" leftIcon={<Icon iconKey="Download" height={14} width={14} />} />
                </button>
                <button className={`${"border-button small-button"} ${styles.barButton}`} 
                  onClick={()=>showHelp("browser")} >
                  <Label text="browser_help" leftIcon={<Icon iconKey="QuestionCircle" height={14} width={14} />} />
                </button>
              </div>
            </div>
            <div className="row full section-small" >
              <div className="cell" >
                <div className={`${styles.dropdownBox}`} >
                  <button 
                    className={`${"border-button"} ${styles.barButton} ${(dropdown === vkey+"_view")?styles.selected:""}`} 
                    onClick={ () => dropDown(vkey+"_view") } >
                    <Label className="hide-small" text="browser_views" 
                      leftIcon={<Icon iconKey="Eye" height={18} width={20.25} />} />
                  </button>
                  {(dropdown === vkey+"_view")?<div className={`${styles.dropdownContent} ${"border"} ${current.theme} `} >
                    {Object.keys(keyMap).map((vname, index) => (vname !== "options")?
                      <div key={index} onClick={ ()=>showBrowser(vkey, vname) }
                        className={`${styles.dropItem} ${(vname === view)?styles.active:null}`} >
                        <Label value={keyMap[vname].label} 
                          leftIcon={(vname === view)?<Icon iconKey="Check" />:<Icon iconKey="Eye" />} />
                      </div>:null
                    )}
                  </div>:null}
                </div>
                <button className={`${"border-button"} ${styles.barButton}`} 
                  onClick={showColumns} >
                  <Label className="hide-small" text="browser_columns" 
                    leftIcon={<Icon iconKey="Columns" height={18} width={18} />} />
                </button>
                <button className={`${"border-button"} ${styles.barButton}`} 
                  onClick={addFilter} >
                  <Label className="hide-small" text="browser_filter" 
                    leftIcon={<Icon iconKey="Plus" height={18} width={15.75} />} />
                </button>
                <button className={`${"border-button"} ${styles.barButton}`} 
                  disabled={((totalFields.count === 0)||(result.length === 0))?"disabled":""}
                  onClick={ ()=>showTotal(viewDef.fields, totalFields) } >
                  <Label className="hide-small" text="browser_total" 
                    leftIcon={<Icon iconKey="InfoCircle" height={18} width={18} />} />
                </button>
              </div>
            </div>
            {(props.data[vkey+"_columns"])?<div className={`${styles.colBox} ${"border"}`} >
              {Object.keys(viewDef.fields).map(fieldname =>
                <div key={fieldname} className={`${"cell padding-tiny tiny left"} 
                  ${(columns[view][fieldname]===true)?styles.selectCol:styles.editCol}`}
                  onClick={()=>setColumns(fieldname, !(columns[view][fieldname]===true))} >
                  <Label value={viewDef.fields[fieldname].label} 
                  leftIcon={(columns[view][fieldname]===true)?<Icon iconKey="CheckSquare" />:<Icon iconKey="SquareEmpty" />} />
                </div>
              )}              
            </div>:null}
            {filters[view].map((filter, index) => <div key={index} className="section-small-top" >
              <div className="cell" >
                <Select value={filter.fieldname} 
                  onChange={(event)=>editFilter(index, "fieldname", event.target.value) }
                  options={Object.keys(viewDef.fields).filter(
                    (fieldname)=> (fieldname !== "id") && (fieldname !== "_id")
                  ).flatMap((fieldname) => {
                    if(fieldname === "deffield_value"){
                      return deffield.map((df) => {
                        return { value: df.fieldname, text: getText(df.fieldname, df.description) }
                      })
                    }
                    return { value: fieldname, text: viewDef.fields[fieldname].label } 
                  })} />
              </div>
              <div className="cell" >
                <Select value={filter.filtertype} 
                  onChange={(event)=>editFilter(index, "filtertype", event.target.value) }
                  options={(["date","float","integer"].includes(filter.fieldtype)?filter_opt_2:filter_opt_1).map(
                    (item)=>{ return { value: item[0], text: item[1] }
                  })} />
              </div>
              <div className="cell mobile" >
                {(filter.filtertype !== "==N")?<div className="cell" >
                  {(filter.fieldtype === "bool")?<Select value={filter.value} 
                    onChange={(event)=>editFilter(index, "value", event.target.value) }
                    options={[
                      { value: 0, text: getText("label_no") }, 
                      { value: 1, text: getText("label_yes") }
                    ]} />:null}
                  {((filter.fieldtype === "integer")||(filter.fieldtype === "float"))?<Input value={filter.value} 
                    onChange={(event)=>editFilter(index, "value", event.target.value) }
                    itype={filter.fieldtype} className="align-right" />:null}
                  {(filter.fieldtype === "date")?<DateTime value={filter.value} 
                    dateTime={false} isEmpty={false}
                    onChange={(value)=>editFilter(index, "value", value) } />:null}
                  {(filter.fieldtype === "string")?<Input value={filter.value} 
                    onChange={(event)=>editFilter(index, "value", event.target.value) } />:null}
                </div>:null}
                <div className="cell" >
                  <button className={` ${"border-button"} ${styles.filterDelete}`} 
                    onClick={ ()=>deleteFilter(index) } ><Icon iconKey="Times" />
                  </button>
                </div>
              </div>
            </div>)}
          </div>:null}
          <div className="row full section-small-top" >
            <div className={`${"row full border"}`} >
              <div className={`${"cell"} ${styles.resultTitle}`} >
                {result.length} <Label text="browser_result" />
              </div>
              {(viewDef.actions_new)?<div className={`${"cell"} ${styles.resultTitlePlus}`}>
                <button className={`${"small-button"}`} 
                  onClick={ ()=>setActions(viewDef.actions_new) } >
                  <Icon iconKey="Plus" />
                </button>
              </div>:null}
            </div>
          </div>
          <div className="row full" >
            <Table rowKey="row_id"
              fields={fields} rows={result}
              filterPlaceholder={getText("placeholder_filter")}
              labelYes={getText("label_yes")} labelNo={getText("label_no")}
              dateFormat={dateFormat} timeFormat={timeFormat} 
              paginationPage={paginationPage} paginationTop={true}
              onEditCell={onEdit} 
              currentPage={page||1} onCurrentPage={onPage} />
          </div>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.data.update === nextProps.data.update)
  )
})

export const QuickView = memo((props) => { 
  const { current } = props
  return (
    <div className={`${"page padding-normal"} ${current.theme}`} >
      <SelectorView {...props} />
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})
