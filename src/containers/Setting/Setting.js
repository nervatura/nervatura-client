import React, { memo, createElement, Fragment } from 'react';
import update from 'immutability-helper';

import styles from './Setting.module.css';
import { Label, FormRow } from 'containers/Controller'
import { Edit, Times } from 'components/Icons';
import Table from 'components/Table';
import List from 'components/List';

export const SettingView = memo((props) => {
  const { getText, setViewActions } = props
  const { view, actions } = props.data
  const { paginationPage, dateFormat, timeFormat } = props.ui
  
  let fields = {}
  if(view.type === "table"){
    if(actions.edit){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              return <Fragment>
                <div className={`${"cell"} ${styles.editCol}`} >{createElement(
                  Edit, { width:24, height:21.3, 
                  onClick: ()=>setViewActions(actions.edit, rowData),
                  className: styles.editCol})}
                </div>
              </Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...view.fields}})
  }
  return (
    <div className={`${styles.viewPanel}`} >
      <div className="row full" >
        {(view.type === "table")?
        <Table rowKey="id"
          fields={fields} rows={view.result} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          onAddItem={(actions.new !== null) ? ()=>setViewActions(actions.new) : null}
          onRowSelected={(actions.edit !== null) ? (row)=>setViewActions(actions.edit, row) : null}
          labelAdd={getText("label_new")} labelYes={getText("label_yes")} labelNo={getText("label_no")} 
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>
        :<List rows={view.result}
          listFilter={true} filterPlaceholder={getText("placeholder_filter")}
          onAddItem={(actions.new !== null) ? ()=>setViewActions(actions.new) : null}
          labelAdd={getText("label_new")}
          paginationPage={paginationPage} paginationTop={true} 
          onEdit={(actions.edit !== null) ? (row)=>setViewActions(actions.edit, row) : null} 
          onDelete={(actions.delete !== null) ? (row)=>setViewActions(actions.delete, row) : null} />}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const SettingForm = memo((props) => {
  const { editItem, setViewActions, getText } = props
  const { current, audit, dataset, type, view } = props.data
  const { paginationPage, dateFormat, timeFormat } = props.ui
  let fields = {}
  if((typeof current.template.view.items !== "undefined") && (current.form.id !== null)){
    if(current.template.view.items.actions.edit){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              const ecol = (current.template.view.items.actions.edit !== null)?<div 
                className={`${"cell"} ${styles.editCol}`} >
                {createElement(Edit, { width:24, height:21.3, 
                  onClick: ()=>setViewActions(current.template.view.items.actions.edit, rowData),
                  className: styles.editCol})}
              </div>:null
              const dcol = (current.template.view.items.actions.delete !== null)?<div 
                className={`${"cell"} ${styles.deleteCol}`} >
                {createElement(Times, { width:19, height:27.6, 
                  onClick: ()=>setViewActions(current.template.view.items.actions.delete, rowData),
                  className: styles.deleteCol})}
              </div>:null
              return <Fragment>{ecol}{dcol}</Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...current.template.view.items.fields}})
  }
  return (
    <Fragment >
      <div className={`${styles.formPanel}`} >
        {current.template.rows.map((row, index) =>
          <FormRow key={index} row={row} 
            values={current.fieldvalue || current.form}
            rowdata={{
              audit: audit,
              current: current,
              dataset: dataset,
              onEdit: editItem
            }} 
          />
        )}
      </div>
      {((typeof current.template.view.items !== "undefined") && (current.form.id !== null))?
        <Table rowKey="id"
          onAddItem={(current.template.view.items.actions.new !== null) 
            ? ()=>setViewActions(current.template.view.items.actions.new) : null}
          labelAdd={getText("label_new")}
          fields={fields} 
          rows={dataset[current.template.view.items.data]} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          labelYes={getText("label_yes")} labelNo={getText("label_no")}
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>:null}
      {(type === "log")?
        <Table rowKey="id"
          fields={view.fields} 
          rows={view.result} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          labelYes={getText("label_yes")} labelNo={getText("label_no")}
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>:null}
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const Setting = memo((props) => {
  const { caption, icon, current } = props.data
  const pageView = () => {
    if(current){
      return <SettingForm {...props} />
    }
    return <SettingView {...props} />
  }
  return (
    <Fragment>
      <div className="page padding-normal" >
        <div className={`${"panel"}`} >
          <div className="panel-title">
            <Label bold primary xxxlarge value={caption} 
              leftIcon={createElement(icon)} col={20} />
          </div>
          <div className="section" >
            <div className="row full container section-small-bottom" >
              {pageView()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})