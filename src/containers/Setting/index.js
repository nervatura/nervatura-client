import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSetting } from './actions'
import { Setting } from './Setting';
import { Preview } from 'containers/Editor/Editor'

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()
  const setting = useSetting()

  const [state] = useState({
    engine: data.login.data.engine,
    theme: data.session.theme,
    ui: app.getSetting("ui"),
    getText: app.getText
  })

  state.data = data.setting

  state.setViewActions = (params, _row) => {
    setting.setViewActions(params, _row)
  }

  state.editItem = async (options) => {
    let settings = update({}, {$set: state.data})
    if(setting.type === "program"){
      settings = update(settings, {current: {form: {$merge: {
        [options.name]: options.value
      }}}})
      localStorage.setItem(options.name, options.value)
    } else if(options === "log_search"){
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

  if(data.preview){
    return <Preview {...state} />
  }
  if(state.data.type){
    return <Setting {...state} />
  }
  return <div />
}