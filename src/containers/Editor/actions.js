import { useContext } from 'react';
import update from 'immutability-helper';
import { formatISO, addDays } from 'date-fns'

import AppStore from 'containers/App/context'
import { useApp, getSql } from 'containers/App/actions'
import dataset from './dataset'
import { useSql } from './sql'
import { useForm } from './forms'
import { useInitItem } from './items'

export const useEditor = () => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const initItem = useInitItem()
  const sql = useSql()
  const forms = useForm()
  
  const setEditor = (options, form, iedit) => {
    let edit = update(iedit||data.edit, {})
    if ((typeof edit.dataset[edit.current.type] === "undefined") || 
      (edit.dataset[edit.current.type].length===0)) {
      app.showToast({ type: "error", autoClose: false,
        title: app.getText("msg_warning"), 
        message: app.getText("msg_editor_invalid") })
      return false;
    }
    
    edit = update(edit, {$merge: {
      template: form,
      panel: form.options.panel,
      caption: form.options.title,
      audit: app.getAuditFilter(edit.current.type, edit.current.transtype)[0]
    }})
    if (edit.audit==="disabled") {
      return false
    }

    if (edit.dataset[edit.current.type][0].id === null) {
      edit = update(edit, { current: {$merge: {
        item: edit.dataset[edit.current.type][0]
      }}})
      if (form.options.search_form) {
        edit = update(edit, {$merge: {
          title_field: form.options.title_field
        }})
      } else {
        if((edit.audit==="all") || (edit.audit==="update")){
          edit = update(edit, {$merge: {
            dirty: true
          }})
        }
        edit = update(edit, {$merge: {
          title_field: app.getText("label_new")+" "+form.options.title
        }})
      }
      if (typeof form.options.extend !== "undefined") {
        edit = update(edit, {current: {$merge: {
          extend: initItem({tablename: form.options.extend, 
            dataset: edit.dataset, current: edit.current})
        }}})
      }
    } else {
      edit = update(edit, {current: {$merge: {
        item: update(initItem({tablename: edit.current.type, 
          dataset: edit.dataset, current: edit.current}), {
          $merge: edit.dataset[edit.current.type][0]})
      }}})
      if (typeof form.options.extend !== "undefined") {
        edit = update(edit, {current: {$merge: {
          extend: initItem({tablename: form.options.extend, 
            dataset: edit.dataset, current: edit.current})
        }}})
        if (typeof edit.dataset[form.options.extend] !== "undefined") {
          if (edit.dataset[form.options.extend].length > 0) {
            edit = update(edit, {current: {$merge: {
              extend: update(edit.current.extend, {
                $merge: edit.dataset[form.options.extend][0]})
            }}})
          }
        }
      }
    }

    edit = update(edit, {current: {$merge: {
      state: "normal",
      pagination: { page: 1, perPage: data.ui.selectorPage }
    }}})
    if (edit.current.type === "trans") {
      if (typeof edit.dataset.trans[0].transcast !== "undefined") {
        if (edit.dataset.trans[0].transcast === "cancellation") {
          edit = update(edit, {current: {$merge: {
            state: "cancellation"
          }}})
        }
      }
    }
    if (edit.current.state === "normal" && edit.current.item.deleted === 1) {
      edit = update(edit, {current: {$merge: {
        state: "deleted"
      }}})
    } else if (edit.current.item.closed === 1) {
      edit = update(edit, {current: {$merge: {
        state: "closed"
      }}})
    }

    edit = update(edit, {current: {$merge: {
      fieldvalue: edit.dataset.fieldvalue || []
    }}})

    Object.keys(edit.template.view).forEach(vname => {
      edit = update(edit, {template: {view: { [vname]: {$merge: {
        view_audit: "all"
      }}}}})
      if (vname === "setting") {
        edit = update(edit, {template: {view: { [vname]: {$merge: {
          view_audit: "disabled"
        }}}}})
      } else {
        edit = update(edit, {template: {view: { [vname]: {$merge: {
          view_audit: app.getAuditFilter(form.view[vname].audit_type || vname, 
            form.view[vname].audit_transtype || null)[0]
        }}}}})
      }
    });

    if (edit.current.type === "report") {
      edit.dataset.reportfields.forEach(rfdata => {
        const selected = (rfdata.selected)?
          rfdata.selected:
          (rfdata.wheretype === 'in')?true:false
        let tfrow = update({}, {$set: {
          id: rfdata.id,
          rowtype: "reportfield", 
          datatype: rfdata.fieldtype,
          name: rfdata.fieldname, 
          label: rfdata.description, 
          selected: selected,
          empty: (rfdata.wheretype === 'in') ? 'false' : 'true',
          value: rfdata.value
        }})
        switch (rfdata.fieldtype) {
          case "bool":
            break;
          case "valuelist":
            tfrow = update(tfrow, {$merge: {
              description: (rfdata.wheretype !== "in") ? 
                rfdata.valuelist.split("|").unshift("") : rfdata.valuelist.split("|")
            }})
            break;
          case "date":
            if(typeof(tfrow.value) === "undefined"){
              if (rfdata.defvalue !== null) {
                tfrow = update(tfrow, {$merge: {
                  value: formatISO(addDays(new Date(), parseInt(rfdata.defvalue,10)), { representation: 'date' })
                }})
              } else if (rfdata.wheretype === "in") {
                tfrow = update(tfrow, {$merge: {
                  value: formatISO(new Date(), { representation: 'date' })
                }})
              } else {
                tfrow = update(tfrow, {$merge: {
                  value: ""
                }})
              }
            }
            break;
          case "integer":
          case "float":
            if(typeof(tfrow.value) === "undefined"){
              tfrow = update(tfrow, {$merge: {
                value: (rfdata.defvalue !== null && rfdata.defvalue !== "") ? rfdata.defvalue : "0"
              }})
            }
            break;
          default:
            tfrow = update(tfrow, {$merge: {
              datatype: "string"
            }})
            break;
        }
        if (typeof tfrow.value === "undefined") {
          tfrow = update(tfrow, {$merge: {
            value: (rfdata.defvalue !== null) ? rfdata.defvalue : ""
          }})
        }
        edit = update(edit, {current: {fieldvalue: {
          $push: [tfrow]
        }}})
      });
    }

    if(options.shipping){
      edit = update(edit, {current: {$merge: {
        form_type: "transitem_shipping",
        direction: edit.dataset.groups.filter((group)=> {
          return (group.id === edit.current.item.direction)
        })[0].groupvalue
      }}})
      if (typeof edit.dataset.shiptemp === "undefined") {
        edit = update(edit, {dataset: {$merge: {
          shiptemp: []
        }}})
      }
      edit = update(edit, {current: {item: {$merge: {
        delivery_type: app.getLang("delivery_"+edit.current.direction)
      }}}})
      if(edit.current.shippingdate){
        edit = update(edit, {current: {item: {$merge: {
          shippingdate: edit.current.shippingdate
        }}}})
      } else {
        edit = update(edit, {current: {$merge: {
          shippingdate: formatISO(new Date(), { representation: 'date' })+"T00:00:00"
        }}})
        edit = update(edit, {current: {item: {$merge: {
          shippingdate: formatISO(new Date(), { representation: 'date' })+"T00:00:00"
        }}}})
      }
      if(edit.current.shipping_place_id){
        edit = update(edit, {current: {item: {$merge: {
          shipping_place_id: edit.current.shipping_place_id
        }}}})
      } else{
        edit = update(edit, {current: {$merge: {
          shipping_place_id: null
        }}})
        edit = update(edit, {current: {item: {$merge: {
          shipping_place_id: null
        }}}})
      }

      edit = update(edit, {dataset: {$merge: {
        shipping_items_: []
      }}})
      edit.dataset.shipping_items.forEach((item, index) => {
        let oitem = update(item, {$merge: {
          id: index+1
        }})
        const mitem = edit.dataset.transitem_shipping.filter((item)=> {
          return (item.id === oitem.item_id+"-"+oitem.product_id)
        })[0]
        if (typeof mitem !== "undefined") {
          const dir = (edit.current.direction === "out")?-1:1
          oitem = update(oitem, {$merge: {
            tqty: dir*mitem.sqty,
            diff: oitem.qty - dir*oitem.tqty
          }})
        } else {
          oitem = update(oitem, {$merge: {
            tqty: 0,
            diff: oitem.qty
          }})
        }
        const sitem = edit.dataset.shiptemp.filter((item)=> {
          return (item.id === oitem.item_id+"-"+oitem.product_id)
        })[0]
        if (typeof sitem !== "undefined") {
          oitem = update(oitem, {$merge: {
            edited: true
          }})
        }
        edit = update(edit, {dataset: {shipping_items_: {
          $push: [oitem]
        }}})
      });
    }

    if (edit.current.type === "printqueue") {
      if (typeof edit.printqueue === "undefined") {
        const default_printer = edit.dataset.settings.filter((item)=> {
          return (item.fieldname === "default_printer")
        })[0]
        if (typeof default_printer !== "undefined") {
          edit = update(edit, {current: {item: {$merge: {
            server: default_printer.value
          }}}})
        }
        edit = update(edit, {$merge: {
          printqueue: edit.current.item
        }})
      } else {
        edit = update(edit, {current: {item: {$merge: {
          ...edit.printqueue
        }}}})
      }
    }

    edit = update(edit, {panel: {$merge: {
      form: true,
      state: edit.current.state
    }}})
    if (edit.panel.state !== "normal") {
      edit = update(edit, {$merge: {
        audit: "readonly"
      }})
    }
    if(edit.audit === "readonly") {
      edit = update(edit, {panel: {$merge: {
        save: false, link: false, delete: false, new: false,
        pattern: false, password: false, formula: false
      }}})  
      if (edit.panel.state !== "deleted") {
        edit = update(edit, {panel: {$merge: {
          trans: false
        }}})
      }
    }
    if (edit.audit !== "all") {
      edit = update(edit, {panel: {$merge: {
        delete: false,
        new: false
      }}})
      if (edit.panel.state !== "deleted") {
        edit = update(edit, {panel: {$merge: {
          trans: false
        }}})
      }
    }
    if (edit.panel.state === "deleted") {
      edit = update(edit, {panel: {$merge: {
        copy: false, 
        create: false
      }}})
    }
    edit = update(edit, {current: {$merge: {
      view: options.form||'form'
    }}})
    setData("state", { edit: true })
    setData("edit", edit)
    if(data.preview.edit){
      setData("preview", { edit: false })
    }
    setData("current", { module: "edit" })
  }

  const loadEditor = async (params) => {
    let { ntype, ttype, id } = params;
    let edit = update({}, {$set: {
      dataset: { },
      current: { type: ntype, transtype: ttype },
      dirty: false,
      form_dirty: false
    }})
    let proitem;
    if (id===null) {
      proitem = initItem({tablename: ntype, transtype: ttype, 
        dataset: edit.dataset, current: edit.current});
    };
    let views = []
    dataset[ntype](ttype).forEach(info => {
      let _sql = {}
      if(info.infoType === "table"){
        _sql = { select:["*"], from: info.classAlias }
        if(info.where){
          _sql.where = info.where
        }
        if(info.order){
          _sql.order_by = info.order
        }
      } else {
        if (typeof sql[ntype][info.sqlKey] !== "undefined") {
          _sql = sql[ntype][info.sqlKey](ntype)
        } else if (typeof sql[ntype][info.infoName] !== "undefined") {
          _sql = sql[ntype][info.infoName](ntype)
        } else {
          _sql = sql["all"][info.infoName](ntype)
        }
      }
      const sqlInfo = getSql(data.login.data.engine, _sql)
      if( (id !== null) || (sqlInfo.prmCount === 0)){
        views = update(views, {$push: [{
          key: info.infoName,
          text: sqlInfo.sql,
          values: ((sqlInfo.prmCount>0) && (id !== null)) ? Array(sqlInfo.prmCount).fill(id) : []
        }]})
      } else {
        edit = update(edit, { dataset: {$merge: {
          [info.infoName]: []
        }}})
      }
    })

    if(views.length > 0){
      if (ntype !== "report") {
        dataset["report"]().forEach(info => {
          let view = {
            key: info.infoName,
            sql: sql.report[info.infoName](ntype),
            values: []
          }
          if(info.infoName === "report"){
            view.values.push(data.login.data.employee.usergroup)
            view.values.push(edit.current.type)
          } else if(info.infoName === "message"){
            view.values.push(edit.current.type)
            view.values.push(edit.current.type)
          } else {
            view.values.push(edit.current.type)
          }
          if (edit.current.type ==="trans") {
            const _where = ["and","r.transtype","=",[[],{select:["id"], from:"groups", 
                where:[["groupname","=","'transtype'"],["and","groupvalue","=","?"]]}]]
            if(info.infoName === "message"){
              view.sql.where[0][2][0].from[0][0][0].where[0].push(_where)
              view.sql.where[0][2][0].from[0][0][1].where[0].push(_where)
              view.values.splice(1, 0, edit.current.transtype)
            } else {
              view.sql.where.push(_where)
            }
            view.values.push(edit.current.transtype)
          }
          views = update(views, {$push: [{
            key: view.key,
            text: getSql(data.login.data.engine, view.sql).sql,
            values: view.values
          }]})
        })
      }

      let options = { method: "POST", data: views }
      let view = await app.requestData("/view", options)
      if(view.error){
        return app.resultError(view)
      }
      edit = update(edit, {$merge: {
        dataset: view
      }})
      if (id===null) {
        if (proitem === null) {
          proitem = initItem({tablename: ntype, transtype: ttype, 
            dataset: edit.dataset, current: edit.current});
        }
        if (ttype === "delivery") {
          proitem = update(proitem, {$merge: {
            direction: edit.dataset.groups.filter((group)=> {
              return ((group.groupname === "direction") && (group.groupvalue === "transfer"))
            })[0].id
          }})
        }
        edit = update(edit, { dataset: {$merge: {
          [ntype]: [proitem]
        }}})
      }
      setData("edit", edit, ()=>{
        if (!params.cb_key || (params.cb_key ==="SET_EDITOR")) {
          if (ntype==="trans") {
            if(options.shipping){
              return setEditor(params, forms["shipping"](edit.dataset[ntype][0], edit, data.ui), edit)
            } else {
              return setEditor(params, forms[ttype](edit.dataset[ntype][0], edit, data.ui), edit)
            }
          } else {
            return setEditor(params, forms[ntype](edit.dataset[ntype][0], edit, data.ui), edit)
          }
        }
      })
    } else {
      edit = update(edit, { dataset: {$merge: {
        [ntype]: [initItem({ tablename: ntype, transtype: ttype, 
          dataset: edit.dataset, current: edit.current })]
      }}})
      setData("edit", edit, ()=>{
        if (!params.cb_key || (params.cb_key ==="SET_EDITOR")) {
          return setEditor(params, forms[ntype](), edit)
        }
      })
    }
  }

  const checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    const cbNext = (cbKey) =>{
      switch (cbKey) {
        case "LOAD_EDITOR":
          loadEditor(options);
          break;
        case "SET_EDITOR_ITEM":
          //dispatch(setEditorItem(options));
          break;
        case "LOAD_FORMULA":
          //dispatch(appData("modal", { type: 'formula', params: {formula: ""} }))
          break;
        case "NEW_FIELDVALUE":
          //dispatch(newFieldvalue(options.fieldname));
          break;
        case "REPORT_SETTINGS":
          //dispatch(setReportSettings());
          break;
        case "CREATE_TRANS":
          //dispatch(createTrans(options));
          break;
        case "CREATE_TRANS_OPTIONS":
          //dispatch(createTransOptions());
          break;
        default:
          break;
      }
    }
    if ((data.edit.dirty === true && data.edit.current.item) ||
      (data.edit.dirty === true && (data.edit.current.type==="template")) || 
      (data.edit.form_dirty === true && data.edit.current.form)) {

        app.showToast({ type: "input", 
          title: app.getText("msg_warning"), message: app.getText("msg_dirty_text"),
          infoText: app.getText("msg_dirty_info"),
          cbCancel: ()=>{
            if (cbKeyFalse) {
              setData("edit", { dirty: false, form_dirty: false })
              cbNext(cbKeyFalse)
            } else {
              cbNext(cbKeyTrue)
            }
          },
          cbOK: (value)=>{
            if (data.edit.form_dirty) {
              //dispatch(tableValidator(page_edit.current.form, 
              //  ()=>{
              //    dispatch(saveEditorForm(cbKeyTrue, cbKeyFalse, options));}));
            } else {
              if (data.edit.current.type==="template"){
                //dispatch(saveTemplate(callback));
              } else {
                //dispatch(saveEditor(cbKeyTrue, cbKeyFalse, options));
              }
            }
          }
        })
    } else if (cbKeyFalse) {
      cbNext(cbKeyFalse);
    } else {
      cbNext(cbKeyTrue);
    }
  }
  
  const checkTranstype = (options, cbKeyTrue, cbKeyFalse) => {
    
  }

  const setFormActions = (params, _row) => {

  }

  return {
    checkEditor: checkEditor,
    checkTranstype: checkTranstype,
    loadEditor: loadEditor,
    setEditor: setEditor,
    setFormActions: setFormActions
  }
}