import { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { appActions } from 'containers/App/actions'
import { searchActions } from 'containers/Search/actions'
import { editorActions } from 'containers/Editor/actions'
import { settingActions } from 'containers/Setting/actions'
import { templateActions } from 'containers/Report/Template'
import { Forms } from 'containers/Controller/Forms'
import { reportActions } from 'containers/Report/actions'
import { Queries } from 'containers/Controller/Queries'

import Selector from 'components/Modal/Selector'
import InputBox from 'components/Modal/InputBox'
import SideBarMemo, { SideBarComponent } from './SideBar';

const SideBar = (props) => {
  const { data, setData } = useContext(AppStore)
  const app = appActions(data, setData)
  const search = searchActions(data, setData)
  const editor = editorActions(data, setData)
  const setting = settingActions(data, setData)
  const template = templateActions(data, setData)
  const report = reportActions(data, setData)

  const [state] = useState(update(props, {$merge: {
    username: data.login.username,
    login: data.login.data,
    forms: Forms({ getText: app.getText }),
    queries: Queries({ getText: app.getText })
  }}))

  state.data = update(state.data, {$merge: { ...data[state.key] }})
  state.module = update(state.module, {$merge: { ...data[state.data.module] }})

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.onGroup = (value) => {
    setData(state.data.module, { group_key: value })
  }

  state.onMenu = (fname, params) => {
    params = params||[]
    let umodule = state
    if(["checkEditor","createShipping","prevTransNumber","nextTransNumber","exportEvent"].includes(fname)){
      umodule = editor
    } else if(["showBrowser"].includes(fname)){
      umodule = search
    } else if(["searchQueue","createReport","exportQueueAll"].includes(fname)){
      umodule = report
    } else if(["loadSetting","setProgramForm","deleteSetting","checkSetting","createTemplate"].includes(fname)){
      umodule = setting
    } else if(["saveBookmark","showHelp"].includes(fname)){
      umodule = app
    } else if(["showPreview","saveTemplate","exportTemplate"].includes(fname)){
      umodule = template
    } else {
      return umodule[fname](...params)
    }
    setData(state.key, { side: app.getSideBar() }, ()=>{
      umodule[fname](...params)
    })
  }

  state.editState = () => {
    setData(state.key, { edit: !state.data.edit })
  }

  state.quickView = (qview) => {
    setData(state.data.module, { seltype: "selector",
      result: [], qview: qview, qfilter: "", page: 1 })
    setData(state.key, { side: app.getSideBar() })
  }
  
  state.editorNew = (params) =>{
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if(params.ttype === "shipping"){
        let formProps = {
          view: "transitem_delivery", 
          columns: state.queries.quick["transitem_delivery"]().columns,
          result: [],
          filter: "",
          getText: app.getText, 
          onClose: ()=>setData(state.key, { modalForm: null }), 
          onSelect: (row, filter) => {
            setData(state.key, { modalForm: null }, ()=>{
              const params = row.id.split("/")
              editor.checkEditor({ 
                ntype: params[0], ttype: params[1], id: parseInt(params[2],10), 
                shipping: true
              }, 'LOAD_EDITOR')
            })
          },
          onSearch: async (filter)=>{
            const view = await search.quickSearch("transitem_delivery", filter)
            if(view.error){
              return app.resultError(view)
            }
            formProps.result = view.result
            setData(state.key, { modalForm: <Selector {...formProps} /> })
          }
        }
        setData(state.key, { modalForm: <Selector {...formProps} /> })
      /*
      } else if(data.edit.current.form){
        editor.checkEditor({
          fkey: params.fkey || data.edit.current.form_type, 
          id: null}, 'SET_EDITOR_ITEM')
      */
      } else {
        editor.checkEditor({
          ntype: params.ntype || data.edit.current.type, 
          ttype: params.ttype || data.edit.current.transtype, 
          id: null}, 'LOAD_EDITOR')
      }
    })
  }

  state.editorDelete = () => {
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if(data.edit.current.form){
        editor.deleteEditorItem({
          fkey: data.edit.current.form_type, 
          table: data.edit.current.form_datatype, 
          id: data.edit.current.form.id
        })
      } else {
        editor.deleteEditor()
      }
    })
  }

  state.transCopy = (ctype) => {
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if (ctype === "create") {
        editor.checkEditor({}, "CREATE_TRANS_OPTIONS");
      } else {
        setData(state.key, { modalForm: 
          <InputBox 
            title={app.getText("msg_warning")}
            message={app.getText("msg_copy_text")}
            infoText={app.getText("msg_delete_info")}
            defaultOK={true}
            labelOK={app.getText("msg_ok")}
            labelCancel={app.getText("msg_cancel")}
            onCancel={() => {
              setData(state.key, { modalForm: null })
            }}
            onOK={(value) => {
              setData(state.key, { modalForm: null }, () => {
                editor.checkEditor({ cmdtype: "copy", transcast: ctype }, "CREATE_TRANS");
              })
            }}
          /> 
        })
      }
    })
  };
  
  state.setLink = (type, field) =>{
    setData(state.key, { side: app.getSideBar() }, ()=>{
      let link_id = (data.edit.current.transtype === "cash") ? 
      data.edit.current.extend.id : data.edit.current.form.id;
      editor.checkEditor(
        { fkey: type, id: null, link_field: field, link_id: link_id }, 'SET_EDITOR_ITEM')
    })    
  }

  state.shippingAddAll = () => {
    setData(state.key, { side: app.getSideBar() }, ()=>{
      let edit = update({}, {$set: data.edit})
      edit.dataset.shipping_items_.forEach(sitem => {
        if (sitem.diff !== 0 && sitem.edited !== true) {
          edit = update(edit, {dataset: { shiptemp: {$push: [{ 
            "id": sitem.item_id+"-"+sitem.product_id,
            "item_id": sitem.item_id, 
            "product_id": sitem.product_id,  
            "product": sitem.product, 
            "partnumber": sitem.partnumber,
            "partname": sitem.partname, 
            "unit": sitem.unit, 
            "batch_no":"", 
            "qty":sitem.diff, 
            "diff":0,
            "oqty": sitem.qty, 
            "tqty": sitem.tqty
          }]}}})
        }
      });
      editor.setEditor({shipping: true, form:"shiptemp_items"}, edit.template, edit)
    })
  }

  state.editorBack = () =>{
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if(data.edit.current.form){
        editor.checkEditor({
          ntype: data.edit.current.type, 
          ttype: data.edit.current.transtype, 
          id: data.edit.current.item.id,
          form: data.edit.current.form_type}, 'LOAD_EDITOR')
      } else {
        if(data.edit.current.form_type === "transitem_shipping"){
          editor.checkEditor({
            ntype: data.edit.current.type, 
            ttype: data.edit.current.transtype, 
            id: data.edit.current.item.id,
            form: data.edit.current.form_type}, 'LOAD_EDITOR')
        } else {
          let reftype = state.login.groups.filter((item)=> {
            return (item.id === data.edit.current.item.nervatype)
          })[0].groupvalue
          editor.checkEditor({ntype: reftype, 
            ttype: null, id: data.edit.current.item.ref_id,
            form: data.edit.current.type}, 'LOAD_EDITOR')
        }
      }
    })
  }

  state.settingBack = (back_type) => {
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if(data.setting.type === "password"){
        return setData(state.data.module, { group_key: "group_admin" }, ()=>{
          setting.loadSetting({ type: 'setting' })
        })
      }
      setting.checkSetting({ type: back_type || data.setting.type }, 'LOAD_SETTING')
    })
  }

  state.saveEditor = () => {
    setData(state.key, { side: app.getSideBar() }, async ()=>{
      let edit = null
      if(data.edit.current.form){
        edit = await editor.saveEditorForm()
      } else {
        edit = await editor.saveEditor()
      }
      if(edit){
        editor.loadEditor({
          ntype: edit.current.type, 
          ttype: edit.current.transtype, 
          id: edit.current.item.id,
          form: edit.current.form_type
        })
      }
    })
  }

  state.setPassword = (username) =>{
    setData(state.key, { side: app.getSideBar() }, ()=>{
      if(!username && data.edit.current){
        username = data.edit.dataset[data.edit.current.type][0].username
      }
      setting.setPasswordForm(username)
    })
  }

  state.settingSave = () => {
    setData(state.key, { side: app.getSideBar() }, async ()=>{
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

  return <SideBarMemo {...state} />

}

SideBar.propTypes = {
  key: PropTypes.string.isRequired,
  ...SideBarComponent.propTypes,
  showHelp: PropTypes.func,
  showBrowser: PropTypes.func,
  editState: PropTypes.func,
  quickView: PropTypes.func,
  editorNew: PropTypes.func,
  editorDelete: PropTypes.func,
  transCopy: PropTypes.func,
  setLink: PropTypes.func,
  shippingAddAll: PropTypes.func,
  editorBack: PropTypes.func,
  settingBack: PropTypes.func,
  saveEditor: PropTypes.func,
  setPassword: PropTypes.func,
  settingSave: PropTypes.func,
}

SideBar.defaultProps = {
  key: "current",
  ...SideBarComponent.defaultProps,
  showHelp: undefined,
  showBrowser: undefined,
  editState: undefined,
  quickView: undefined,
  editorNew: undefined,
  editorDelete: undefined,
  transCopy: undefined,
  setLink: undefined,
  shippingAddAll: undefined,
  editorBack: undefined,
  settingBack: undefined,
  saveEditor: undefined,
  setPassword: undefined,
  settingSave: undefined,
}

export default SideBar;
