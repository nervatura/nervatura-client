import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSetting } from './actions'
import { Setting } from './Setting';
import { useTemplate } from 'containers/Controller/Template'
import { Preview, pageRender } from 'containers/Report'

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()
  const setting = useSetting()
  const template = useTemplate()

  const [state] = useState({
    engine: data.login.data.engine,
    ui: app.getSetting("ui"),
    theme: data.current.theme,
    getMapCtr: template.getMapCtr,
    getElementType: template.getElementType
  })

  state.data = data.setting

  state.viewerRef = useRef(null)
  state.canvasRef = useRef(null)
  
  useEffect(() => {
    pageRender(state.viewerRef.current, state.canvasRef.current, state.data.preview)
  },[state.viewerRef, state.canvasRef, state.data.preview])

  state.mapRef = useCallback(map => {
    if (map) {
      template.createMap(map)
    }
  }, [template]);

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.setViewActions = (params, _row) => {
    setting.setViewActions(params, _row)
  }

  state.editTemplate = (options) => {
    template.editItem({...options, setting: state.data})
  }

  state.mapNext = () => {
    template.goNext(state.data)
  }

  state.mapPrevious = () => {
    template.goPrevious(state.data)
  }

  state.moveUp = () => {
    template.moveUp(state.data)
  }

  state.moveDown = () => {
    template.moveDown(state.data)
  }

  state.deleteItem = () => {
    template.deleteItem(state.data)
  }

  state.addItem = (value) => {
    template.addItem(value, state.data)
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

  state.changeTemplateData = (key, value) => {
    let setting = update(data.setting, {template: {$merge: {
      [key]: value
    }}})
    setData("setting", setting)
  }

  state.changeCurrentData = (key, value) => {
    let setting = update(data.setting, {template: {current: {$merge: {
      [key]: value
    }}}})
    setData("setting", setting)
  }

  state.setCurrent = (tmp_id, set_dirty) => {
    template.setCurrent({tmp_id: tmp_id, set_dirty: set_dirty, setting: state.data})
  }

  state.addTemplateData = () => {
    template.addTemplateData()
  }

  state.setCurrentData = (data) => {
    template.setCurrentData(data)
  }

  state.setCurrentDataItem = (value) => {
    template.setCurrentDataItem(value)
  }

  state.deleteDataItem = (options) => {
    template.deleteDataItem(options)
  }

  state.deleteData = (dskey) => {
    template.deleteData(dskey)
  }

  state.editDataItem = (options) => {
    template.editDataItem(options)
  }

  if(state.data.preview){
    return <Preview {...state} />
  }
  if(state.data.type){
    return <Setting {...state} />
  }
  return <div />
}