import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import styles from './Controller.module.css';
//import DateTimeInput from 'components/DateTimeInput';

const useText = (key) => {
  const store = useContext(AppStore)
  if(key && store.actions)
    return store.actions.getText(key)
  return ""
}

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
        store.actions.setData(keys[0], { [keys[1]]: data })
      }
      if(keys.length === 2)
        store.actions.setData(keys[0], { [keys[1]]: value })
    }
  }
}

export const Label = (props) => {
  const labelText = useText(props.text)
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
        <div className={`${styles.label_rightIcon_info} ${props.className||""}`}
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
  const [ state, setState ] = useState({
    focus: false
  })
  const placeholderText = useText(props.placeholder)
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
  
  return <input id={props.id||""}
    type={props.type||"text"}
    className={`${props.className||""}`} style={props.style||{}}
    placeholder={placeholderText} 
    onChange={(props.onChange) ? props.onChange : (evt) => change(props.keys, evt.target.value)}
    onFocus={()=> { setState({...state, focus: true }) }}
    onBlur={()=> { setState({...state, focus: false }) }}
    onKeyDown={(props.onEnter)?(ev)=>{if(ev.keyCode === 13){props.onEnter()}}:null}
    value={inputValue}/>
}

export const Select = (props) => {

  const [ state, setState ] = useState({
    focus: false
  })
  const placeholderText = useText(props.placeholder)
  const selectValue = useValues(props.keys, props.value)
  const change = useChange()

  const options = []
  if(props.placeholder){
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

/*
export const DateInput = (props) => {
  const store = useContext(AppStore);
  const placeholderText = useText(props.placeholder)
  const dateValue = useValues(props.keys)
  const change = useChange()

  const _props = update(props, {$merge: {
    value: (props.default && (dateValue === "")) ? props.default : dateValue,
    placeholder: placeholderText,
    onChange: (value) => change(props.keys, value),
    dateFormat: store.data.ui.dateFormat,
    timeFormat: store.data.ui.timeFormat
  }})
  return <DateTimeInput {..._props}/>
}
*/