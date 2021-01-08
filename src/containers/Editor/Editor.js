import React, { memo, createElement, Fragment } from 'react';
import update from 'immutability-helper';
import {Editor as RtfEditor} from 'draft-js';

import styles from './Editor.module.css';
import { Label, FormRow, Select } from 'containers/Controller'
import Paginator, { paginate } from 'components/Paginator';
import { Plus, Edit, Times, Comment, Home, Download, Upload } from 'components/Icons';
import Table from 'components/Table';
import List from 'components/List';

export const MainEditor = memo((props) => {
  const { currentView, getText, editItem } = props
  const { current, template, audit, dataset } = props.data
  let label = current.item[template.options.title_field]
  if(current.type === "printqueue"){
    label = template.options.title_field;
  } else if(current.item.id === null){
    label = getText("label_new")+" "+template.options.title;
  }
  return (
    <Fragment >
      <div className="row full" >
        <div className="cell" >
          <button className={` ${styles.tabButton} ${"full secondary-title"}`} onClick={()=>currentView("form")} >
            <Label value={label} 
              leftIcon={createElement(template.options.icon)} col={20} />
          </button>
        </div>
      </div>
      {(current.view === "form")?<div className={`${styles.formPanel} ${"border"}`} >
        {template.rows.map((row, index) => <FormRow key={index} row={row} 
          values={current.item}
          rowdata={{ audit: audit, current: current, dataset: dataset, onEdit: editItem }} />)}
      </div>:null}
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const FieldEditor = memo((props) => {
  const { currentView, editItem, checkEditor, onPaginationSelect } = props
  const { current, template, dataset, audit } = props.data
  if (current.item.id !== null || template.options.search_form) {
    if (typeof dataset.fieldvalue !== "undefined" && current.item !== null && template.options.fieldvalue === true) {
      let fieldvalue_list = []
      current.fieldvalue.forEach(fieldvalue => {
        let _deffield = dataset.deffield.filter((df) => (df.fieldname === fieldvalue.fieldname))[0]
        if ((_deffield.visible === 1) && (fieldvalue.deleted === 0)) {
          let _fieldtype = dataset.groups.filter((group) => (group.id === _deffield.fieldtype ))[0].groupvalue
          let _description = fieldvalue.value;
          let _datatype = _fieldtype;
          switch (_fieldtype) {
            case "customer":
            case "tool":
            case "trans":
            case "transitem":
            case "transmovement":
            case "transpayment":
            case "product":
            case "project":
            case "employee":
            case "place":
              let item = dataset.deffield_prop.filter((df) => (
                (df.ftype === _fieldtype) && (df.id === parseInt(fieldvalue.value,10))))[0]
              if(item){
                _description = item.description;}
              _datatype = "selector";
              break;
            case "urlink":
              _datatype = "text";
              break;
            case "valuelist":
              _description = _deffield.valuelist.split("|");
              break;
            default:
              break;
          }
          fieldvalue_list = update(fieldvalue_list, {$push: [{ 
            rowtype: 'fieldvalue',
            id: fieldvalue.id, name: 'fieldvalue_value', 
            fieldname: fieldvalue.fieldname, 
            value: fieldvalue.value, notes: fieldvalue.notes||'',
            label: _deffield.description, description: _description, 
            disabled: _deffield.readonly ? true : false,
            fieldtype: _fieldtype, datatype: _datatype
          }]})
        }
      });
      const deffields = () => {
        const ntype_id = dataset.groups.filter((group) => (
          (group.groupname === "nervatype") && (group.groupvalue === current.type )))[0].id
        if (current.type === "trans") {
          return dataset.deffield.filter((df) => (
            (df.nervatype === ntype_id) && (df.visible === 1))).filter( (df) => (
            (df.subtype === current.item.transtype) || (df.subtype === null)) ).map(
              (df)=>{ return {value: df.fieldname, text: df.description } })
        } else {
          return dataset.deffield.filter((df) => (
            (df.nervatype === ntype_id) && (df.visible === 1))).map(
              (df)=>{ return {value: df.fieldname, text: df.description } })
        }
      }
      const onSelect = (page) => {
        onPaginationSelect(page, fieldvalue_list.length)
      }
      const fieldRows = (current.pagination.perPage > 0) ? 
        paginate(current.pagination)(fieldvalue_list) : fieldvalue_list
      return (
        <Fragment >
          <div className="row full" >
            <div className="cell" >
              <button className={` ${styles.tabButton} ${"full secondary-title"}`} onClick={()=>currentView("fieldvalue")} >
                <div className="row full" >
                  <div className="cell" >
                    <Label text="fields_view" leftIcon={createElement(template.options.icon)} col={20} />
                  </div>
                  <div className="cell align-right" >
                    <span className={`${styles.badge}`} >{fieldvalue_list.length}</span>
                  </div>  
                </div>
              </button>
            </div>
          </div>
          {(current.view === "fieldvalue")?<div className={`${styles.formPanel} ${"border"}`} >
            {((audit !== 'readonly')||((fieldRows.amount) && (fieldRows.amount > 1)))?
            <div className="row full container-small section-small border-bottom" >
              {(audit !== 'readonly')?<div className="cell mobile">
                <div className="cell padding-small" >
                  <Select value={current.deffield||""} keys={["edit", "current","deffield"]} placeholder=""
                    options={deffields()} />
                </div>
                {(current.deffield && (current.deffield !== ""))?<div className="cell" >
                  <button className={`${"border-button"} ${styles.addButton}`} 
                    onClick={ ()=>checkEditor({fieldname: current.deffield}, 'NEW_FIELDVALUE') } >
                    <Label text="label_new" leftIcon={<Plus />} col={20} />
                  </button>
                </div>:null}
              </div>:null}
              {((fieldRows.amount) && (fieldRows.amount > 1)) ?
              <div className={` ${styles.paginatorCell} ${"cell right mobile"}`} >
                <Paginator pagination={current.pagination} pages={fieldRows.amount} onSelect={onSelect} />
              </div>:null}
            </div>:null}
            {(fieldRows.rows || fieldRows).map((fieldvalue, index) => <FormRow
              key={fieldvalue.id} row={fieldvalue} 
              values={fieldvalue}
              rowdata={{ audit: audit, current: current, dataset: dataset, onEdit: editItem }}
            />)}
          </div>:null}
        </Fragment>
      )
    }
  }
  return null
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const ViewEditor = memo((props) => {
  const { currentView, getText, setActions, formatNumber } = props
  const { vname } = props
  const { current, template, dataset, audit } = props.data
  const { paginationPage, dateFormat, timeFormat } = props.ui
  
  const vtemplate = template.view[vname];
  const rows = dataset[vtemplate.data] || [];
  const edited = vtemplate.edited || true;
  let actions = vtemplate.actions;
  if (typeof actions === "undefined") {
    actions = {
      new: {action: "newEditorItem", fkey: vname}, 
      edit: {action: "editEditorItem", fkey: vname}, 
      delete: {action: "deleteEditorItem", fkey: vname}
    }
  }
  if (audit !== "all") {
    actions = update(actions, {$merge: {
      new: null,
      delete: null
    }})
  }
  
  const editIcon = (typeof vtemplate.edit_icon !== "undefined") ? 
    vtemplate.edit_icon : Edit
  const deleteIcon = (typeof vtemplate.delete_icon !== "undefined") ? 
    vtemplate.delete_icon : Times
  const addIcon = (typeof vtemplate.new_icon !== "undefined") ? 
    vtemplate.new_icon : Plus
  let fields = {}
  if(vtemplate.type === "table"){
    if(edited && (actions.edit || actions.delete)){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              const ecol = (actions.edit !== null)?<div 
                className={`${"cell"} ${styles.editCol}`} >
                {createElement(editIcon, { width:24, height:21.3, 
                  onClick: ()=>setActions(actions.edit, rowData),
                  className: styles.editCol})}
              </div>:null
              const dcol = (actions.delete !== null)?<div 
                className={`${"cell"} ${styles.deleteCol}`} >
                {createElement(deleteIcon, { width:19, height:27.6, 
                  onClick: ()=>setActions(actions.delete, rowData),
                  className: styles.deleteCol})}
              </div>:null
              return <Fragment>{ecol}{dcol}</Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...vtemplate.fields}})
  }
  return (
    <Fragment >
      <div className="row full" >
        <div className="cell" >
          <button className={` ${styles.tabButton} ${"full secondary-title"}`} onClick={()=>currentView(vname)} >
            <div className="row full" >
              <div className="cell" >
                <Label value={vtemplate.title} leftIcon={createElement(vtemplate.icon)} col={20} />
              </div>
              <div className="cell align-right" >
                <span className={`${styles.badge}`} >{rows.length}</span>
              </div>  
            </div>
          </button>
        </div>
      </div>
      {(current.view === vname)?<div className={`${styles.viewPanel}`} >
        {(vtemplate.total)?<div className="row full border">
          <div className="cell l4 m4 s12 padding-normal align-right">
            <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[0]]+":"}</span>
            <span className={`${styles.totalValue} ${"border"} `}>
              {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[0]],
                dataset[current.type][0].digit||2)}
            </span>
          </div>
          <div className="cell l4 m4 s12 padding-normal align-right">
            <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[1]]+":"}</span>
            <span className={`${styles.totalValue} ${"border"}`}>
              {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[1]],
                dataset[current.type][0].digit || 2)}
            </span>
          </div>
          <div className="cell l4 m4 s12 padding-normal align-right">
            <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[2]]+":"}</span>
            <span className={`${styles.totalValue} ${"border"}`}>
              {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[2]],
                dataset[current.type][0].digit || 2)}
            </span>
          </div>
        </div>:null}
        <div className="row full" >
          {(vtemplate.type === "table")?
          <Table rowKey="id"
            onAddItem={(edited && (actions.new !== null)) ? ()=>setActions(actions.new) : null}
            fields={fields} rows={rows} tableFilter={true}
            filterPlaceholder={getText("placeholder_filter")}
            labelYes={getText("label_yes")} labelNo={getText("label_no")} 
            labelAdd={(typeof vtemplate.new_label !== "undefined") ? 
              vtemplate.new_label : getText("label_new")}
            addIcon={addIcon}
            dateFormat={dateFormat} timeFormat={timeFormat} 
            paginationPage={paginationPage} paginationTop={true}/>
          :<List 
            rows={rows} labelAdd={(typeof vtemplate.new_label !== "undefined") ? 
              vtemplate.new_label : getText("label_new")} 
            addIcon={addIcon} editIcon={editIcon} deleteIcon={deleteIcon}
            listFilter={true} filterPlaceholder={getText("placeholder_filter")}
            paginationPage={paginationPage} paginationTop={true} 
            onEdit={(edited && (actions.edit !== null)) ? (row)=>setActions(actions.edit, row) : null} 
            onAddItem={(edited && (actions.new !== null)) ? ()=>setActions(actions.new) : null} 
            onDelete={(edited && (actions.delete !== null)) ? (row)=>setActions(actions.delete, row) : null} />}
        </div>
      </div>:null}
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const ReportEditor = memo((props) => {
  const { editItem } = props
  const { current, dataset, audit } = props.data
  if (current.type === "report"){
    if (dataset.reportfields.length>0) {
      return(<div className="row full">
        {current.fieldvalue.map((row, index) => <FormRow key={index} row={row} 
          values={row}
          rowdata={{ audit: audit, current: current, dataset: dataset, onEdit: editItem }} />)}
      </div>)
    }
  }
  return null
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const NoteEditor = memo((props) => {
  const { noteChange, currentView, noteState, getText, noteTemplate, setPattern } = props
  const { rtf_inline, rtf_block } = props.ui
  const { current, template, audit, dataset } = props.data
  if ((current.item.id !== null) && (typeof current.item.fnote !== "undefined") && 
    (template.options.pattern === true)) {
    const currentStyle = current.note.getCurrentInlineStyle()
    const selection = current.note.getSelection();
    const blockType = current.note.getCurrentContent().getBlockForKey(selection.getStartKey()).getType()
    return(
      <Fragment >
          <div className="row full" >
            <div className="cell" >
              <button className={` ${styles.tabButton} ${"full secondary-title"}`} onClick={()=>currentView("fnote")} >
                <div className="row full" >
                  <div className="cell" >
                    <Label text="fnote_view" leftIcon={<Comment />} col={20} />
                  </div>  
                </div>
              </button>
            </div>
          </div>
          {(current.view === "fnote")?<div className={`${styles.formPanel} ${"border"}`} >
            {(audit !== 'readonly')?<div>
              <div className="row full" >
                <div className={`${"cell padding-small"}`} >
                  <div className="cell padding-tiny">
                    <button className={`${"border-button"} ${styles.barButton}`}
                      title={getText("pattern_default")}
                      onClick={ ()=>setPattern("default") } >
                      <Home />
                    </button>
                    <button className={`${"border-button"} ${styles.barButton}`}
                      title={getText("pattern_load")}
                      onClick={ ()=>setPattern("load") } >
                      <Download />
                    </button>
                    <button className={`${"border-button"} ${styles.barButton}`}
                      title={getText("pattern_save")}
                      onClick={ ()=>setPattern("save") } >
                      <Upload />
                    </button>
                  </div>
                  <div className="cell padding-tiny">
                    <button className={`${"border-button"} ${styles.barButton}`}
                      title={getText("pattern_new")}
                      onClick={ ()=>setPattern("new") } >
                      <Plus />
                    </button>
                    <button className={`${"border-button"} ${styles.barButton}`}
                      title={getText("pattern_delete")}
                      onClick={ ()=>setPattern("delete") } >
                      <Times />
                    </button>
                  </div>
                  <div className="cell padding-tiny mobile" >
                    <Select value={current.template} placeholder=""
                      onChange={ (event)=>noteTemplate(event.target.value) }
                      options={dataset.pattern.map( pattern => {
                        return { value: pattern.id, 
                          text: pattern.description+((pattern.defpattern === 1)?"*":"") 
                      }})} />
                  </div>
                </div>
              </div>
            </div>:null}
            <div className="row full" >
              <div className={`${"cell padding-small border-bottom"} ${styles.viewPanel}`} >
                <div className="cell padding-tiny">
                  {rtf_inline.map(
                    type => <button key={type.label} title={type.label}
                      className={`${"border-button"} ${styles.barButton} ${currentStyle.has(type.style)?styles.activeStyle:""}`} 
                        onClick={ ()=>noteState(type.style) } >
                        {createElement(type.icon)}
                      </button>
                  )}
                </div>
                <div className="cell padding-tiny">
                  {rtf_block.map(
                    (type) => <button key={type.label} title={type.label}
                      className={`${"border-button"} ${styles.barButton} ${(type.style === blockType)?styles.activeStyle:""}`} 
                        onClick={ ()=>noteState(type.style) } >
                        {createElement(type.icon)}
                      </button>
                  )}
                </div>
              </div>
            </div>
            <div className={`${styles.rtfEditor} ${"rtf"}`} >
              <RtfEditor editorState={current.note} onChange={noteChange} />
            </div>
        </div>:null}
      </Fragment>)
  }
  return null
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const ItemEditor = memo((props) => {
  const { getText, editItem } = props
  const { current, audit, dataset } = props.data
  return (
    <Fragment >
      <div className="row full" >
        <div className={`${"cell padding-normal border secondary-title"} ${styles.itemTitle}` }>
          <Label className={` ${styles.itemTitlePre}` } 
            value={(current.form.id === null) ? getText("label_new") : current.form.id} />
          <Label value={current.form_template.options.title} />
        </div>
      </div>
      <div className={`${styles.formPanel} ${"border"}`} >
        {current.form_template.rows.map((row, index) =>
          <FormRow key={index} row={row} 
            values={current.form}
            rowdata={{
              audit: audit,
              current: current,
              dataset: dataset,
              onEdit: editItem
            }} 
          />
        )}
      </div>
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const Editor = memo((props) => {
  const { current, caption, template } = props.data
  const { theme } = props
  return (
    <Fragment>
      <div className={`${"page padding-normal"} ${theme}`} >
        <div className={`${styles.width800}`}>
          <div className={`${"panel"}`} >
            <div className="panel-title primary">
              <Label bold primary xxxlarge value={caption} 
                leftIcon={createElement(template.options.icon)} col={20} />
            </div>
            {(current.form)?
              <div className="section container" ><ItemEditor {...props}/></div>:
              <div className="section container" >
                <MainEditor {...props} />
                <FieldEditor {...props} />
                <ReportEditor {...props} />
                <NoteEditor {...props} />
                {Object.keys(template.view).filter(
                  (vname)=>(template.view[vname].view_audit !== "disabled")).map(
                    (vname) =><ViewEditor key={vname} vname={vname} {...props} />)}
              </div>}
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
