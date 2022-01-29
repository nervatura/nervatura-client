import React, { useContext, useState, useEffect } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { appActions } from 'containers/App/actions'
import { settingActions } from './actions'
import { Setting } from './Setting';
import { getSetting } from 'config/app'

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = appActions(data, setData)
  const setting = settingActions(data, setData)

  const [state] = useState({
    engine: data.login.data.engine,
    username: data.login.username,
    ui: getSetting("ui"),
    login: data.login.data,
  })

  state.data = data.setting
  state.current = data.current //= update(state.current, {$merge: { ...data.current }})

  useEffect(() => {
    if(state.current && state.current.content){
      const content = state.current.content
      setData("current", { content: null }, () => {
        setting.checkSetting(content, content.nextKey || "LOAD_SETTING")
      })
    }
  }, [setData, setting, state]);

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.onEvent = (fname, params) => {
    params = params || []
    if(setting[fname]){
      return setting[fname](...params)  
    }
    if(app[fname]){
      return app[fname](...params)  
    }
    state[fname](...params)
  }

  state.changeData = (fieldname, value) => {
    setData("setting", { [fieldname]: value })
  }

  state.companyForm = () => {
    setData("current", { module: "edit", content: { ntype: "customer", ttype: null, id: 1 } })
  }

  state.setViewActions = (params, _row) => {
    setting.setViewActions(params, _row)
  }

  state.editItem = (options) => {
    let settings = update({}, {$set: state.data})
    if(settings.type === "program"){
      settings = update(settings, {current: {form: {$merge: {
        [options.name]: options.value
      }}}})
      localStorage.setItem(options.name, options.value)
    } else if(options.name === "log_search"){
      setting.loadLog()
    } else {
      if((settings.audit==="all") || (settings.audit==="update")){
        settings = update(settings, {$merge: {
          dirty: true
        }})
      }
      if((options.name === "fieldvalue_value") || (options.name === "fieldvalue_notes")){
        settings = update(settings, {current: {fieldvalue: {$merge: {
          [options.name]: options.value
        }}}})
        settings = update(settings, {current: {form: {$merge: {
          [options.name.split("_")[1]]: options.value.toString()
        }}}})
      } else {
        settings = update(settings, {current: {form: {$merge: {
          [options.name]: options.value
        }}}})
      }
    }
    setData("setting", settings)
  }

  state.settingBack = (back_type) => {
    setData("current", { side: app.getSideBar() }, ()=>{
      if(data.setting.type === "password"){
        return setData(state.current.module, { group_key: "group_admin" }, ()=>{
          setting.loadSetting({ type: 'setting' })
        })
      }
      setting.checkSetting({ type: back_type || data.setting.type }, 'LOAD_SETTING')
    })
  }

  state.settingSave = () => {
    setData("current", { side: app.getSideBar() }, async ()=>{
      if(data.setting.type === "password"){
        setting.changePassword()
      } else {
        const result = await setting.saveSetting()
        if(result){
          setting.loadSetting({type: result.type, id: result.current.form.id})
        }
      }
    })
  }

  state.setPassword = (username) =>{
    setData("current", { side: app.getSideBar() }, ()=>{
      if(!username && data.edit.current){
        username = data.edit.dataset[data.edit.current.type][0].username
      }
      setting.checkSetting({ username: username }, "PASSWORD_FORM")
    })
  }

  if(state.data.type){
    return <Setting {...state} />
  }
  return <div />
}