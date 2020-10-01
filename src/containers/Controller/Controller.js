import React, { useContext, useState, createElement, Fragment } from 'react';
import update from 'immutability-helper';
import { format, isValid, parseISO, formatISO } from 'date-fns'

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { SelectorForm } from 'containers/ModalForm'
import styles from './Controller.module.css';
import DateTimeInput from 'components/DateTimeInput';
import { ToggleOff, ToggleOn, Times, Search, CheckSquare, SquareEmpty } from 'components/Icons';

const useValues = (keys, defValue) => {
  const store = useContext(AppStore)
  if(keys && keys.length === 3)
    return store.data[keys[0]][keys[1]][keys[2]]||""
  if(keys && keys.length === 2)
    return store.data[keys[0]][keys[1]]||""
  return defValue
}

const useChange = () => {
  const store = useContext(AppStore)
  return (keys, value) => {
    if(keys && Array.isArray(keys) && keys.length > 1){
      if(keys.length === 3){
        const data = update(store.data[keys[0]][keys[1]], {$merge: {
          [keys[2]]: value
        }})
        store.setData(keys[0], { [keys[1]]: data })
      }
      if(keys.length === 2)
        store.setData(keys[0], { [keys[1]]: value })
    }
  }
}

export const Label = (props) => {
  const app = useApp()
  const labelText = app.getText(props.text)
  const labelValue = useValues(props.keys)

  let value = (props.text) ? labelText : (props.keys) ? labelValue:""
  if(typeof props.value !== "undefined")
    value += props.value
  
  if(props.leftIcon){
    return(
      <div className={`${"row"} ${(props.center)?styles.centered:null}`}>
        <div className={`${"cell"} ${styles.label_icon_left}`}
          style={{ width: props.col||"auto"}} >{props.leftIcon}</div>
        <div className={`${"cell"} ${styles.label_info_left} ${props.className||""}`}
          style={props.style||{}} >{value}</div>
      </div>
    )
  }
  if(props.rightIcon){
    return(
      <div className="row full">
        <div className={`${styles.label_info_right} ${props.className||""}`}
          style={props.style||{}} >{value}</div>
        <div className={`${"cell"} ${styles.label_icon_right}`}
          style={{ width: props.col||"auto" }} >{props.rightIcon}</div>
      </div>
    )
  }
  return(
    <span className={props.className||""} style={props.style||{}} >{value}</span>
  )
}

export const Input = (props) => {
  const app = useApp()
  const [ state, setState ] = useState({
    focus: false
  })
  const placeholderText = app.getText(props.placeholder)
  let inputValue = useValues(props.keys, props.value)
  const change = useChange()

  if(props.itype === "integer"){
    inputValue = parseInt(String(inputValue).replace(/[^0-9-]|-(?=.)/g,''),10);
    if (isNaN(inputValue)){
      inputValue = 0
    }
    if(props.min){
      if(inputValue < props.min){
        inputValue = props.min
      }
    }
    if(props.max){
      if(inputValue > props.max){
        inputValue = props.max
      }
    }
  }
  if(props.itype === "float"){
    let fvalue = parseFloat(String(inputValue).replace(/[^0-9.-]+/g, ""))
    if (isNaN(fvalue)){
      fvalue = 0
    }
    if (inputValue !== fvalue && inputValue !== fvalue+".") {
      inputValue = fvalue
    }
    if (inputValue === "" || isNaN(inputValue) || inputValue === null) {
      inputValue = 0
    }
  }
  
  return <input id={props.id||""}
    type={props.type||"text"}
    className={`${props.className||""}`} style={props.style||{}}
    placeholder={placeholderText} 
    onChange={(props.onChange) ? props.onChange : (evt) => change(props.keys, evt.target.value)}
    onFocus={()=> { setState({...state, focus: true }) }}
    onBlur={()=> { setState({...state, focus: false }) }}
    onKeyDown={(props.onEnter)?
      (ev)=>{if(ev.keyCode === 13){props.onEnter()}}:null}
    value={inputValue}/>
}

export const Select = (props) => {
  const app = useApp()
  const [ state, setState ] = useState({
    focus: false
  })
  const placeholderText = app.getText(props.placeholder)
  const selectValue = useValues(props.keys, props.value)
  const change = useChange()

  const options = []
  if(typeof props.placeholder !== "undefined"){
    options.push(<option className={styles.optionPlaceholder}
      key="placeholder" value="" >{placeholderText}</option>)
  }
  if(props.options){
    props.options.forEach((item, index) => {
      options.push(<option className={styles.option} 
        key={index} value={item.value} >{item.text}</option>)
    });
  }
  
  return <select id={props.id||""}
    className={`${props.className||""}`} style={props.style||{}}
    onChange={(props.onChange) ? props.onChange : (evt) => change(props.keys, evt.target.value)}
    onFocus={()=> { setState({...state, focus: true }) }}
    onBlur={()=> { setState({...state, focus: false }) }}
    value={selectValue} >
    {options}
  </select>
}

export const DateInput = (props) => {
  const app = useApp()
  const store = useContext(AppStore);
  const placeholderText = app.getText(props.placeholder)
  const dateValue = useValues(props.keys, props.value)
  const change = useChange()

  const _props = update(props, {$merge: {
    value: (props.default && (dateValue === "")) ? props.default : dateValue,
    placeholder: placeholderText,
    onChange: (props.onChange) ? props.onChange : (value) => change(props.keys, value),
    dateFormat: store.data.ui.dateFormat,
    timeFormat: store.data.ui.timeFormat
  }})
  return <DateTimeInput {..._props}/>
}

export const FormField = (props) => {
  const app = useApp()
  const editor = useEditor()
  const { data } = useContext(AppStore);
  const [ state, setState ] = useState({})
  const showSelector = SelectorForm()

  const { field, values } = props
  const { dataset, current, audit, onEdit } = props.rowdata;
  
  let disabled = field.disabled
  let fieldName = field.name;
  let value = values[field.name]
  let datatype = field.datatype
  let description = field.description
  let fieldMap = field.map || null
  const empty = ((field.empty === "true") || (field.empty === true)) ? true : false

  const onChange = ( value, item ) => {
    let extend = false
    if (fieldMap){
      if(fieldMap.fieldname){
        fieldName = fieldMap.fieldname
      }
      if(fieldMap.extend){
        extend = true;
        if(fieldMap.text){
          fieldName = fieldMap.text 
        }
      }
    }
    onEdit({
      id: field.id || 1,
      name: fieldName, 
      value: value, 
      extend: extend, 
      refnumber: (item && item.label) ? item.label : field.link_label, 
      item: item
    })
  }

  const onSelector = (row, filter) => {
    let selector = update(state.selector, {$merge: {
      text: "",
      id: null,
      filter: filter || ""
    }})
    if (row){
      const params = row.id.split("/")
      selector = update(selector, {$merge: {
        text: row.label || row.item.lslabel
      }})
      selector = update(selector, { $merge: {
        id: parseInt(params[2],10),
        ttype: params[1]
      }})
      if((params[0] === "trans") && (params[1] !== "")){
        if(row.trans_id){
          selector = update(selector, { $merge: {
            id: row.trans_id
          }})
        }
      }
    }
    selector = update(selector, {$merge: {
      value: selector.id || ""
    }})
    
    setState({...state, selector: selector, form: null })
    onChange(selector.id, row)
  }
  
  const selectorInit = () => {
    let selector = update({}, {$set: {
      value: values.value || "",
      filter: description || "",
      text: description || "",
      type: field.fieldtype,
      ntype: field.fieldtype,
      ttype: null,
      id: values.value || null,
      table: { name:"fieldvalue", fieldname: "value", id: field.id }
    }})
    if (fieldMap) {
      selector = update(selector, {$merge: {
        value: value || "",
        type: fieldMap.seltype, 
        filter: String(selector.text).split(" | ")[0],
        table:{ name: fieldMap.table, fieldname: fieldMap.fieldname },
        ntype: fieldMap.lnktype, 
        ttype: (value !== "") ? fieldMap.transtype : selector.ttype, 
        id: (value !== "") ? value : selector.id
      }})
      let reftable;
      if (fieldMap.extend === true || fieldMap.table === "extend") {
        reftable = current.extend
      } else {
        if((typeof current[fieldMap.table] !== "undefined") && Array.isArray(current[fieldMap.table])){
          reftable = current[fieldMap.table].filter(item => (item.id === values.id))[0]
        } else {
          reftable = dataset[fieldMap.table].filter(item => (item.id === values.id))[0]
        }
      }        
      if (typeof reftable === "undefined" && current[fieldMap.table] && Array.isArray(current[fieldMap.table])) {
        reftable = current[fieldMap.table].filter(item => 
          (item[fieldMap.fieldname] === selector.value))[0]
      }
      if (typeof reftable === "undefined") {
        reftable = dataset[fieldMap.table].filter(item => 
          (item[fieldMap.fieldname] === selector.value))[0]
      }
      if (typeof reftable === "undefined" && current[fieldMap.table] && Array.isArray(current[fieldMap.table])) {
        reftable = current[fieldMap.table].filter(item => (item.id === selector.value))[0]
      }
      if (typeof reftable === "undefined") {
        reftable = dataset[fieldMap.table].filter(item => (item.id === selector.value))[0]
      }
      if (typeof reftable !== "undefined") {
        if (typeof reftable[fieldMap.label_field] !== "undefined" && 
          reftable[fieldMap.label_field] !== null) {
            selector = update(selector, {$merge: {
              text: reftable[fieldMap.label_field], 
              filter: reftable[fieldMap.label_field]
            }})
        } else {
          selector = update(selector, {$merge: {
            text: "", 
            filter: ""
          }})
        }
        if (typeof reftable[fieldMap.fieldname] !== "undefined" && 
          selector.value==="" && reftable[fieldMap.fieldname] !== null) {
            selector = update(selector, {$merge: {
              ntype: fieldMap.lnktype, 
              ttype: fieldMap.transtype, 
              id: reftable[fieldMap.fieldname]
            }})
        }
        if (fieldMap.lnktype === "trans" && typeof reftable.transtype !== "undefined") {
          selector.selector_edit = {ntype:fieldMap.lnktype, ttype:reftable.transtype}
          if (typeof fieldMap.lnkid !== "undefined") {
            selector = update(selector, {$merge: { 
              id: reftable[fieldMap.lnkid]
            }})
          } else if (typeof reftable[fieldMap.fieldname] !== "undefined") {
            selector = update(selector, {$merge: { 
              id: reftable[fieldMap.fieldname]
            }})
          } else {
            selector = update(selector, {$merge: { 
              id: selector.value
            }})
          }
        }
      } else {
        selector = update(selector, {$merge: {
          text: "", 
          filter: ""
        }})
      }
    } 
    return selector
  }

  if(!state.selector && (datatype === "selector")){
    setState({...state, selector: selectorInit() })
  }

  const getOppositeValue = (value) => {
    if (data.edit.template.options.opposite && (parseFloat(value)<0)) {
      return String(value).replace("-","");
    } else if (data.edit.template.options.opposite && (parseFloat(value)>0)) {
      return "-"+value;
    }
    return value;  
  }

  const lnkValue = () => {
    if (typeof values[field.name] === "undefined") {
      return [(current[fieldMap.source]) ?
        current[fieldMap.source].filter(item => 
          (item.ref_id === values.id) && (item[fieldMap.value] === field.name))[0] :
        dataset[fieldMap.source].filter(item => 
          (item.ref_id === values.id) && (item[fieldMap.value] === field.name))[0], false]
    } else {
      const svalue = ((fieldName === "id") && (value === "")) ? null : value
      return [(current[fieldMap.source]) ?
        current[fieldMap.source].filter(item => 
          (item[fieldMap.value] === svalue))[0] :
        dataset[fieldMap.source].filter(item => 
          (item[fieldMap.value] === svalue))[0], true]
    }
  }

  if((field.rowtype === "reportfield") || (field.rowtype === "fieldvalue")){
    value = values.value
  }
  if ((typeof value==="undefined") || value === null){
    value = (field.default) ? field.default : ""
  }
  if (datatype === "fieldvalue"){
    if(values.datatype){
      datatype = values.datatype 
    } else {
      if (fieldMap) {
        const mitem = dataset[fieldMap.source].filter((field)=>(
          field[fieldMap.value] === values.id))[0]
        datatype = mitem.fieldtype
        fieldMap = null
        if (mitem.valuelist !== null) {
          description = mitem.valuelist.split("|");
        }
      } 
    }
  }
  switch (datatype) {
    case "password":
    case "color":
      return <input className="full" name={fieldName} type={datatype} value={value||""} 
        onChange={(event) => onChange(event.target.value)}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}/>

    case "date":
    case "datetime":
      let dateValue = parseISO(value)
      if (fieldMap) {
        if (fieldMap.extend) {
          dateValue = parseISO(current.extend[fieldMap.text])
          fieldName = fieldMap.text;
        } else {
          const lnkDate = lnkValue()
          if (typeof lnkDate[0] !== "undefined") {
            dateValue = parseISO(lnkDate[0][fieldMap.text])
            disabled = (lnkDate[1]) ? lnkDate[1] : disabled
          }
        }
      }
      value = isValid(dateValue) ? formatISO(dateValue) : ""
      return <DateTimeInput value={value} 
        dateTime={(datatype === "datetime")}
        isEmpty={empty} disabled={(disabled || audit === 'readonly')}
        onChange={(value) => {
          if(datatype === "datetime"){
            onChange(format(parseISO(value), data.ui.dateFormat+" "+data.ui.timeFormat))
          } else {
            onChange(value)
          }
        }}
        dateFormat={data.ui.dateFormat}
        timeFormat={data.ui.timeFormat} />

    case "bool":
    case "flip":
      const toggleDisabled = (disabled || audit === 'readonly')?styles.toggleDisabled:""
      if(value===1 || value==="1" || value==="true"|| value===true){
        return <div className={` ${styles.toggleBorder} ${toggleDisabled}`}
          onClick={(!disabled && audit !== 'readonly')?
            ()=>onChange((field.name === 'fieldvalue_value') ? false : 0):null}>
          <ToggleOn className={`${styles.toggleOn}`} width={40} height={32.6} />
        </div>
      } else {
        return <div className={` ${styles.toggleBorder} ${toggleDisabled}`}
          onClick={(!disabled && audit !== 'readonly')?
            ()=>onChange((field.name === 'fieldvalue_value') ? true : 1):null}>
          <ToggleOff className={`${styles.toggleOff}`} width={40} height={32.6} />
        </div>
      }
    
    case "label":
      return null;

    case "select":
      if (field.extend) {
        value = current.extend[field.name]||"";
      }
      let option = []
      if (empty) {
        option.push(<option key="empty" value=""></option>)
      }
      if (fieldMap) {
        dataset[fieldMap.source].forEach((element, index) => {
          let _label = element[fieldMap.text]
          if (typeof fieldMap.label !== "undefined") {
            if (typeof app.getText(fieldMap.label+"_"+_label) !== "undefined") {
              _label = app.getText(fieldMap.label+"_"+_label);
            }
          }
          option.push(<option key={index} value={element[fieldMap.value]}>{_label}</option>)
        });
      } else {
        field.options.forEach((element, index) => {
          let _label = element[1]
          if(app.getText(_label)){
            _label = app.getText(_label)
          }
          if (typeof field.olabel !== "undefined") {
            if (typeof app.getText(field.olabel+"_"+element[1]) !== "undefined") {
              _label = app.getText(field.olabel+"_"+element[1]);
            }
          }
          option.push(<option key={index} value={element[0]} >{_label}</option>)
        });
      }
      return <select className="full" name={field.name} value={value}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}
        onChange={(event) => {
          let value = isNaN(parseInt(event.target.value,10)) ?
            event.target.value : parseInt(event.target.value,10)
          onChange(value)
        }} >{option}</select>
    
    case "valuelist":
      return <select className="full" name={field.name} value={value}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}
        onChange={(event) => onChange(event.target.value)} >
          {description.map((value, index) =>
            <option key={index} value={value} >{value}</option>)}
        </select>
    
    case "link":
      let litem = values;
      const lnkLink = lnkValue()
      if (typeof lnkLink[0] !== "undefined") {
        litem = lnkLink[0]
        if(lnkLink[0][fieldMap.text]){
          value = lnkLink[0][fieldMap.text];
        }
      }
      let llabel = value;
      if (typeof fieldMap.label_field !== "undefined") {
        if (typeof litem[fieldMap.label_field] !== "undefined") {
          llabel = litem[fieldMap.label_field];
        }
      }
      return <div className={`${styles.lnkBox}`}>
        <span className={`${styles.lnkText}`} onClick={()=>editor.checkEditor(
          {ntype: fieldMap.lnktype, ttype: fieldMap.transtype, id: value}, 
          'LOAD_EDITOR')} >{llabel}</span>
      </div>
    
    case "selector":
      let columns = []
      let selector_text = (state && state.selector) ? state.selector.text : ""
      let selector_type = (state && state.selector) ? state.selector.type : ""
      let selector_filter = (state && state.selector) ? state.selector.filter : ""
      let selector_ntype = (state && state.selector) ? state.selector.ntype : ""
      let selector_ttype = (state && state.selector) ? state.selector.ttype : ""
      let selector_id = (state && state.selector) ? state.selector.id : ""
      if (fieldMap){
        if (fieldMap.extend === true || fieldMap.table === "extend") {
          if(current.extend){
            if(current.extend.seltype){
              selector_text = current.extend[fieldMap.label_field]
              selector_type = current.extend.seltype
              selector_filter = selector_text
              selector_ntype = current.extend.ntype || current.extend.seltype
              selector_ttype = current.extend.transtype
              selector_id = current.extend.ref_id
            }
          }
        }
      }
      if(!(disabled || audit === 'readonly')){
        columns.push(<div key="sel_show" className={` ${"cell"} ${styles.searchCol}`}>
          <button className={`${"border-button"} ${styles.selectorButton}`}
            disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}
            onClick={ ()=>showSelector({
              type: selector_type, 
              filter: selector_filter, 
              onChange: (form) => {
                setState({...state, form: form })
              }, 
              onSelect: onSelector
            }) } >
            <Search />
          </button>
        </div>)
      }
      if (empty) {
        columns.push(<div key="sel_delete" className={` ${"cell"} ${styles.timesCol}`}>
          <button className={`${"border-button"} ${styles.selectorButton}`}
            disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}
            onClick={ ()=>onSelector() } >
            <Times />
          </button>
        </div>)
      }
      columns.push(<div key="sel_text" className={`${styles.lnkBox}`}>
        {(selector_text !== "")?<span className={`${styles.lnkText}`}
          onClick={()=>editor.checkTranstype(
          { ntype: selector_ntype, ttype: selector_ttype, id: selector_id }, 
          'LOAD_EDITOR')} >{selector_text}</span>:null}
      </div>)
      return <Fragment>
        <div className={`${"row full"}`} >{columns}</div>
        {(state.form)?state.form:null}
        </Fragment>
    
    case "button":
      return <button className={`${"border-button"} ${styles.selectorButton} ${field.class}`}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}
        autoFocus={field.focus || false}
        onClick={ ()=>onEdit(fieldName) } >
        <Label value={(field.title)?(field.title):""} 
          leftIcon={(field.icon)?createElement(field.icon):null} 
          col={(field.icon)?20:null} />
      </button>

    case "percent":
    case "integer":
    case "float":
      if (fieldMap) {
        if (fieldMap.extend) {
          value = current.extend[fieldMap.text];
          fieldName = fieldMap.text;
        } else {
          const lnkNumber = lnkValue()
          if (typeof lnkNumber[0] !== "undefined") {
            value = lnkNumber[0][fieldMap.text];
            disabled = (lnkNumber[1]) ? lnkNumber[1] : disabled
          }
        }
      }
      if (value === ""){ value = 0 }
      if(datatype === "integer"){
        value = parseInt(String(value).replace(/[^0-9-]|-(?=.)/g,''),10);
        if (isNaN(value)){
          value = 0
        }
      }
      if(datatype === "float"){
        let fvalue = parseFloat(String(value).replace(/[^0-9.-]+/g, ""))
        if (isNaN(fvalue)){
          fvalue = 0
        }
        if(typeof field.min !== "undefined"){
          if(fvalue < field.min){
            fvalue = field.min
          }
        }
        if(typeof field.max !== "undefined"){
          if(fvalue > field.max){
            fvalue = field.max
          }
        }
        if (value !== fvalue && ((value !== fvalue+".") || (state.event_type === "blur"))) {
          value = fvalue
        }
        if (value === "" || isNaN(value) || value === null) {
          value = 0
        }
      }
      if (typeof field.opposite !== "undefined") {
        value = getOppositeValue(value) 
      }
      return <input name={fieldName} type="text" value={value||"0"}
        className="align-right" 
        onChange={(event) => {
          setState({...state, event_type: event.type })
          onChange((field.opposite) ? parseFloat(getOppositeValue(event.target.value)): parseFloat(event.target.value))
        }}
        onBlur={(event) => {
          setState({...state, event_type: event.type })
          onChange((field.opposite) ? parseFloat(getOppositeValue(event.target.value)): parseFloat(event.target.value))
        }}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}/>
    
    case "notes":
    case "text":
    case "string":
    default:
      if (fieldMap) {
        if (fieldMap.extend) {
          value = current.extend[fieldMap.text];
          fieldName = fieldMap.text;
        } else {
          const lnkString = lnkValue()
          if (typeof lnkString[0] !== "undefined") {
            value = lnkString[0][fieldMap.text];
            disabled = (lnkString[1]) ? lnkString[1] : disabled
            if (typeof fieldMap.label !== "undefined") {
              if (typeof app.getText(fieldMap.label+"_"+value) !== "undefined") {
                value = app.getText(fieldMap.label+"_"+value);
              }
            }
          }
        }
      }
      if((datatype === "notes") || datatype === "text"){
        return <textarea className="full" name={fieldName} value={value||""}
          rows={(field.rows )?field.rows:null}
          onChange={(event) => onChange(event.target.value)}
          disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}/>
      }
      return <input className="full" name={fieldName} type="text" value={value||""} 
        maxLength={(field.length)?field.length:null}
        size={(field.length)?field.length:null}
        onChange={(event) => onChange(event.target.value)}
        disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}/>
  }
}

export const FormRow = (props) => {
  const { values, rowdata } = props
  const { id, rowtype, label, columns, name, disabled, audit, notes, selected, empty } = props.row
  switch (rowtype) {

    case "label":
      return (<div className={`${"row full padding-small section-small border-bottom"} ${styles.labelRow}`} >
        <div className="cell padding-small" >{values[name] || label}</div>
      </div>)

    case "field":
      return(<div className="row full padding-small section-small border-bottom">
        <div className={`${"cell padding-small hide-small"} ${styles.fieldCell}`} >
          <Label className="bold" value={label} />
        </div>
        <div className={`${"cell padding-small"}`} >
          <div className={`${"hide-medium hide-large"}`} >
            <Label className="bold" value={label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={props.row} />
        </div>
      </div>)
    
    case "reportfield":
      return(<div className={`${"cell padding-small s12 m6 l4"}`} >
        <div className={`${"padding-small"} ${(empty !== 'false')?styles.reportField:""}`} 
          onClick={() => {if(empty !== 'false'){
            rowdata.onEdit({id: id, name: "selected", value: !selected, extend: false })} }}>
          <Label className="bold" value={label} 
            leftIcon={(selected)?<CheckSquare />:<SquareEmpty />} />
        </div>
        <FormField values={values} rowdata={rowdata} field={props.row} />
      </div>)

    case "fieldvalue":
      return(<div className="row full padding-small section-small border-bottom">
        <div className="row full">
          <div className="cell container-small">
            <Label className="bold" value={label} />
          </div>
          <div className="cell align-right container-small" >
            <span className={`${styles.fieldvalueDelete}`} 
              onClick={ ()=>rowdata.onEdit({ 
                id: id, name: "fieldvalue_deleted"}) }><Times /></span>
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small s12 m6 l6"}`} >
            <FormField values={values} rowdata={rowdata} field={props.row} />
          </div>
          <div className={`${"cell padding-small s12 m6 l6"}`} >
            <input name={'fieldvalue_notes'} type="text" 
              value={notes} className="full" 
              onChange={(event) => rowdata.onEdit({
                id: id, name: "fieldvalue_notes", value: event.target.value})}
              disabled={(disabled || audit === 'readonly') ? 'disabled' : ''}/>
          </div>
        </div>
      </div>)
    
    case "col2":
      return(<div className="row full padding-small section-small border-bottom">
        <div className={`${"cell padding-small s12 m6 l6"}`} >
          <div>
            <Label className="bold" value={columns[0].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[0]} />
        </div>
        <div className={`${"cell padding-small s12 m6 l6"}`} >
          <div>
            <Label className="bold" value={columns[1].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[1]} />
        </div>
      </div>)
    
    case "col3":
      return(<div className="row full padding-small section-small border-bottom">
        <div className={`${"cell padding-small s12 m4 l4"}`} >
          <div>
            <Label className="bold" value={columns[0].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[0]} />
        </div>
        <div className={`${"cell padding-small s12 m4 l4"}`} >
          <div>
            <Label className="bold" value={columns[1].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[1]} />
        </div>
        <div className={`${"cell padding-small s12 m4 l4"}`} >
          <div>
            <Label className="bold" value={columns[2].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[2]} />
        </div>
      </div>)

    case "col4":
      return(<div className="row full padding-small section-small border-bottom">
        <div className={`${"cell padding-small s12 m3 l3"}`} >
          <div>
            <Label className="bold" value={columns[0].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[0]} />
        </div>
        <div className={`${"cell padding-small s12 m3 l3"}`} >
          <div>
            <Label className="bold" value={columns[1].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[1]} />
        </div>
        <div className={`${"cell padding-small s12 m3 l3"}`} >
          <div>
            <Label className="bold" value={columns[2].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[2]} />
        </div>
        <div className={`${"cell padding-small s12 m3 l3"}`} >
          <div>
            <Label className="bold" value={columns[3].label} />
          </div>
          <FormField values={values} rowdata={rowdata} field={columns[3]} />
        </div>
      </div>)
    
    default:
      return null;
  }
}