import React, { useContext, useState } from 'react';
import update from 'immutability-helper';
import { convertToHTML } from 'draft-convert'
import { RichUtils } from 'draft-js';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { useInitItem } from './items'
import { Preview, Editor } from './Editor';

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const editor = useEditor()
  const app = useApp()
  const initItem = useInitItem()

  const [state] = useState({
    engine: data.login.data.engine,
    theme: data.session.theme,
    ui: data.ui
  })

  state.data = data.edit

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.formatNumber = (number, digit) => {
    const value = (!isNaN(parseFloat(number))) ? parseFloat(number) : 0
    return value.toFixed(digit).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  state.changeData = (key, value) => {
    setData("edit", { [key]: value })
  }

  state.onPaginationSelect = (page, size) => {
    const pages = Math.ceil(
      size / data.edit.current.pagination.perPage
    );
    const _page = Math.min(Math.max(page, 1), pages)
    const current = update(data.edit.current, {$merge: {
      pagination: update(data.edit.current.pagination, { $merge: {
        page: _page
      }})
    }})
    setData("edit", { current: current })
  }

  state.checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    editor.checkEditor(options, cbKeyTrue, cbKeyFalse)
  }

  state.currentView = (key) => {
    const current = update(data.edit.current, {$merge: {
      view: (data.edit.current.view === key) ? "" : key
    }})
    setData("edit", { current: current })
  }

  const setFieldvalue = (recordset, fieldname, ref_id, defvalue, value) => {
    const fieldvalue_idx = recordset.findIndex((item)=>((item.ref_id === ref_id)&&(item.fieldname === fieldname)))
    if (fieldvalue_idx === -1) {
      const fieldvalue = update(initItem({tablename: "fieldvalue", current: data.edit.current}), {$merge: {
        fieldname: fieldname,
        ref_id: ref_id,
        value: value || defvalue
      }})
      recordset = update(recordset, {$push: [fieldvalue]})
    } else if(value) {
      recordset = update(recordset, { [fieldvalue_idx]: {$merge: {
        value: value
      }}})
    }
    return recordset
  }

  state.editItem = (options) => {
    let edit = update({}, {$set: data.edit})
    if((options.name === "fieldvalue_value") || (options.name === "fieldvalue_notes") || (options.name === "fieldvalue_delete")){
      const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.id === options.id))
      if( (fieldvalue_idx > -1) && ((edit.audit==="all") || (edit.audit==="update"))){
        edit = update(edit, {
          dirty: true,
        })
        edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
          [options.name.split("_")[1]]: options.value.toString()
        }}}}})
      }
    } else if (edit.current.form) { 

    } else {
      if ((typeof edit.current.item[options.name] !== "undefined") && (options.extend === false)) {
        edit = update(edit, {current: {item: {$merge: {
          [options.name]: options.value
        }}}})
      } else if ((typeof edit.template.options.extend !== "undefined") && (options.extend === true)) {
        edit = update(edit, {current: {extend: {$merge: {
          [options.name]: options.value
        }}}})
      }
      if((edit.audit==="all") || (edit.audit==="update")){
        edit = update(edit, {$merge: {
          dirty: true
        }})
      }

      switch (edit.current.type){
        case "report":
          edit = update(edit, {$merge: {
            dirty: false
          }})
          if(options.name === "selected"){
            const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.id === options.id))
            if(fieldvalue_idx > -1){
              edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
                selected: options.value
              }}}}})
            }
          } else {
            const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.name === options.name))
            if(fieldvalue_idx > -1){
              edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
                value: options.value
              }}}}})
            }
          }
          break;

        case "printqueue":
          edit = update(edit, {$merge: {
            dirty: false
          }})
          edit = update(edit, { printqueue: {$merge: {
              [options.name]: options.value
          }}})
          break;

        case "trans":
          switch (options.name) {
            case "closed":
              if (options.value === 1) {
                app.showToast({ type: "input", 
                  title: app.getText("msg_warning"), message: app.getText("msg_close_text"),
                  infoText: app.getText("msg_delete_info"),
                  cbOK: ()=>{
                    edit = update(edit, { current: {$merge: {
                      closed: 1
                    }}})
                    setData("edit", edit)
                  },
                  cbCancel: (value)=>{
                    edit = update(edit, { current: { item: {$merge: {
                      [options.name]: 0
                    }}}})
                    setData("edit", edit)
                  }
                })
              }
              break;
            case "paiddate":
              edit = update(edit, { current: { item: {$merge: {
                transdate: options.value
              }}}})
              break;
            case "direction":
              if(edit.current.transtype === "cash"){
                const direction = edit.dataset.groups.filter((item)=>(item.id === options.value))[0].groupvalue
                edit = update(edit, { template: { options: {$merge: {
                  opposite: (direction === "out")
                }}}})
              }
              break;        
            case "seltype":
              edit = update(edit, { current: { 
                extend: {$merge: {
                  seltype: options.value,
                  ref_id: null,
                  refnumber: ""
                }},
                item: {$merge: {
                  customer_id: null,
                  employee_id: null,
                  ref_transnumber: null
                }}
              }})
              break;
            case "ref_id":
              edit = update(edit, { current: { extend: {$merge: {
                  refnumber: options.refnumber
              }}}})
              switch (edit.current.extend.seltype){
                case "customer":
                  edit = update(edit, { current: { item: {$merge: {
                    customer_id: options.value
                  }}}})
                  break;
                case "employee":
                  edit = update(edit, { current: { item: {$merge: {
                    employee_id: options.value
                  }}}})
                  break;
                case "transitem":
                  edit = update(edit, { current: { item: {$merge: {
                    ref_transnumber: options.refnumber
                  }}}})
                  break;
                default:
                  break;}
              break;
            case "trans_wsdistance":
            case "trans_wsrepair":
            case "trans_wstotal":
            case "trans_reholiday":
            case "trans_rebadtool":
            case "trans_reother":
            case "trans_wsnote":
            case "trans_rentnote":
              edit = update(edit, { current: {$merge: {
                fieldvalue: setFieldvalue(edit.current.fieldvalue, 
                  options.name, edit.current.item.id, null, options.value)
              }}})
              break;
            case "shippingdate":
            case "shipping_place_id":
              edit = update(edit, {$merge: {
                dirty: false
              }})
              edit = update(edit, { current: {$merge: {
                  [options.name]: options.value
              }}})
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    setData("edit", edit)
  }

  state.noteState = (key) => {
    const edit = update(data.edit, { current: {$merge: {
      note: (["unordered-list-item","ordered-list-item"].includes(key))?
        RichUtils.toggleBlockType(data.edit.current.note, key):
        RichUtils.toggleInlineStyle(data.edit.current.note, key),
    }}})
    setData("edit", edit)
  }
  
  state.noteChange = (editorState) => {
    let edit = update(data.edit, { current: {$merge: {
      note: editorState,
      dirty: true
    }}})
    edit = update(edit, { current: { item: {$merge: {
      fnote: convertToHTML(editorState.getCurrentContent())
    }}}})
    setData("edit", edit)
  }
  
  state.setActions = (params, row) => {
    editor.setFormActions(params, row)
  }

  if(data.edit.current.item){
    if(data.preview.edit){
      return <Preview {...state} />
    }
    return <Editor {...state} />
  }
  return <div />
}