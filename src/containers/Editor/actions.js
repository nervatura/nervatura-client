import { useContext } from 'react';
import update from 'immutability-helper';
import { formatISO, addDays } from 'date-fns'
import { EditorState } from 'draft-js';
import { convertFromHTML } from 'draft-convert'

//import Report from 'nervatura-report/dist/report.module'
import pdfjsLib from 'pdfjs-dist/webpack';

import AppStore from 'containers/App/context'
import { useApp, getSql, saveToDisk } from 'containers/App/actions'
import { SelectorForm, ReportForm } from 'containers/Controller'
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
  const showSelector = SelectorForm()
  const showReport = ReportForm()
  
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
      if(edit.current.item.fnote){
        edit = update(edit, {current: {$merge: {
          note: EditorState.createWithContent(convertFromHTML(edit.current.item.fnote))
        }}})
      } else {
        edit = update(edit, {current: {$merge: {
          note: EditorState.createEmpty() 
        }}})
      }
      if (edit.dataset.pattern){
        const template = edit.dataset.pattern.filter((item) => (item.defpattern === 1))[0]
        edit = update(edit, {current: {$merge: {
          template: (template) ? template.id : "" 
        }}})
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
        delivery_type: app.getText("delivery_"+edit.current.direction)
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
          const tqty = (edit.current.direction === "out")?-parseFloat(mitem.sqty) : parseFloat(mitem.sqty)
          oitem = update(oitem, {$merge: {
            tqty: tqty,
            diff: parseFloat(oitem.qty) - tqty
          }})
        } else {
          oitem = update(oitem, {$merge: {
            qty: parseFloat(oitem.qty),
            tqty: 0,
            diff: parseFloat(oitem.qty)
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
    setData("edit", edit)
    setData("current", { module: "edit", edit: true })
  }

  const loadEditor = async (params) => {
    let { ntype, ttype, id } = params;
    let edit = update({}, {$set: {
      dataset: { },
      current: { type: ntype, transtype: ttype },
      dirty: false,
      form_dirty: false,
      preview: null
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
            if(params.shipping){
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
          return setEditor(params, forms[ntype](edit.dataset[ntype][0], edit, data.ui), edit)
        }
      })
    }
  }

  const setEditorItem = (options) => {
    let edit = update(data.edit, {})
    let dkey = forms[options.fkey]({}, edit, data.ui).options.data
    if (typeof dkey === "undefined") {
      dkey = options.fkey
    }
    edit = update(edit, {$merge: {
      form_dirty: false
    }})
    edit = update(edit, {current: {$merge: {
      form_type: options.fkey,
      form_datatype: dkey,
      form: initItem({tablename: dkey, dataset: edit.dataset, current: edit.current})
    }}})

    if (options.id!==null) {
      edit = update(edit, {current: {$merge: {
        form: edit.dataset[options.fkey].filter((item)=> {
          return (item.id === parseInt(options.id,10))
        })[0]
      }}})
    } else {
      edit = update(edit, {current: {$merge: {
        form_dirty: true
      }}})
    }
    edit = update(edit, {current: {$merge: {
      form_template: forms[options.fkey](edit.current.form, edit, data.ui)
    }}})

    switch (options.fkey) {
      case "price":
      case "discount":
        edit = update(edit, {current: {$merge: {
          price_link_customer: null,
          price_customer_id: null
        }}})
        if (options.id!==null) {
          edit = update(edit, {current: {$merge: {
            price_link_customer: edit.current.form.link_customer,
            price_customer_id: edit.current.form.customer_id
          }}})
        }
        break;
      
      case "invoice_link":
        edit = update(edit, {current: {$merge: {
          invoice_link_fieldvalue: edit.dataset.invoice_link_fieldvalue
        }}})
        let invoice_props = { 
          id: edit.current.form.id, ref_id_1: "", transnumber: "", curr: ""
        }
        let invoice_link = edit.dataset.invoice_link.filter((item)=> {
          return (item.id === edit.current.form.id)
        })[0]
        if (typeof invoice_link !== "undefined") {
          invoice_props = invoice_link
        }
        edit = update(edit, {current: {$merge: {
          invoice_link: [invoice_props]
        }}})
        break;
      
      case "payment_link":
        edit = update(edit, {current: {$merge: {
          payment_link_fieldvalue: edit.dataset.payment_link_fieldvalue
        }}})
        let payment_props = { 
          id: edit.current.form.id, ref_id_2: "", transnumber: "", curr: ""
        }
        let payment_link = edit.dataset.payment_link.filter((item)=> {
          return (item.id === edit.current.form.id)
        })[0]
        if (typeof payment_link !== "undefined") {
          payment_props = payment_link
        }
        edit = update(edit, {current: {$merge: {
          payment_link: [payment_props]
        }}})
        if(options.link_field){
          edit = update(edit, {current: {form: {$merge: {
            [options.link_field]: options.link_id
          }}}})
        }
        break;
      
      default:
        break;}
    
    let panel = update(edit.current.form_template.options.panel, {$merge: {
      form: true,
      state: edit.current.state
    }})
    if (edit.panel.state !== "normal") {
      edit = update(edit, {$merge: {
        audit: "readonly"
      }})
    }
    if (edit.audit === "readonly") {
      panel = update(panel, {$merge: {
        save: false,
      }})
    }
    if (edit.audit !== "all") {
      panel = update(panel, {$merge: {
        link: false,
        delete: false,
        new: false
      }})
    }
    edit = update(edit, {$merge: {
      panel: panel
    }})
    setData("edit", edit)
  }

  const newFieldvalue = (_fieldname) => {
    const updateFieldvalue = async (item) => {
      const options = { method: "POST", data: [item] }
      const result = await app.requestData("/fieldvalue", options)
      if(result.error){
        return app.resultError(result)
      }
      loadEditor({
        ntype: data.edit.current.type, 
        ttype: data.edit.current.transtype, 
        id: data.edit.current.item.id, 
        form: "fieldvalue", form_id: result[0]
      })
    }

    if (_fieldname!=="") {
      const deffield = data.edit.dataset.deffield.filter((item) => (item.fieldname === _fieldname))[0]
      const _fieldtype = data.login.data.groups.filter((item) => (item.id === deffield.fieldtype))[0].groupvalue
      let item = update(initItem({tablename: "fieldvalue"}), {$merge: {
        id: null,
        fieldname: deffield.fieldname
      }})
      let _selector = false;
      switch (_fieldtype) {
        case "bool":
          item = update(item, {$merge: {
            value: "false"
          }})
          break;

        case "date":
          item = update(item, {$merge: {
            value: formatISO(new Date(), { representation: 'date' })
          }})
          break;

        case "time":
          item = update(item, {$merge: {
            value: "00:00"
          }})
          break;

        case "float":
        case "integer":
          item = update(item, {$merge: {
            value: "0"
          }})
          break;

        case "valuelist":
          item = update(item, {$merge: {
            value: deffield.valuelist.split("|")[0]
          }})
          break;

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
          _selector = true;
          break;

        default:
          break;
      }
      if (_selector) {
        showSelector({
          type: _fieldtype, filter: "", 
          onChange: (form) => {
            setData("edit", { selectorForm: form })
          }, 
          onSelect: (row, filter) => {
            setData("edit", { selectorForm: null }, ()=>{
              const params = row.id.split("/")
              item = update(item, {$merge: {
                value: String(parseInt(params[2],10))
              }})
              updateFieldvalue(item)
            })
          }
        })
      } else {
        updateFieldvalue(item)
      }
    } else {
      return app.showToast({ type: "error", title: app.getText("msg_warning"), 
          message: app.getText("fields_deffield_missing") })
    }
  }

  const createHistory = async (ctype) => {
    let history = update({}, {$set: {
      datetime: formatISO(new Date()),
      type: ctype, 
      type_title: app.getText["label_"+ctype],
      ntype: data.edit.current.type,
      transtype: data.edit.current.transtype || "",
      id: data.edit.current.item.id
    }})
    let title = (history.ntype === "trans") ?
      data.edit.template.options.title+" | "+data.edit.current.item[data.edit.template.options.title_field] :
      data.edit.template.options.title
    if ((history.ntype !== "trans") && (typeof data.edit.template.options.title_field !== "undefined")){
      title += " | "+data.edit.current.item[data.edit.template.options.title_field]
    }
    history = update(history, {$merge: {
      title: title
    }})
    let bookmark = update(data.bookmark, {})
    let userconfig = {}
    if (bookmark.history.length > 0) {
      userconfig = update(bookmark.history[0], {$merge: {
        cfgroup: formatISO(new Date())
      }})
      let history_values = JSON.parse(userconfig.cfvalue);
      history_values.unshift(history)
      if (history_values.length> data.ui.history) {
        history_values = history_values.slice(0, data.ui.history)
      }
      userconfig = update(userconfig, {$merge: {
        cfname: history_values.length,
        cfvalue: JSON.stringify(history_values)
      }})
      bookmark = update(bookmark, {history: {$merge: {
        0: userconfig
      }}})
    } else {
      userconfig = update(userconfig, {$merge: {
        employee_id: data.login.data.employee.id,
        section: "history",
        cfgroup: formatISO(new Date()),
        cfname: 1,
        cfvalue: JSON.stringify([history])
      }})
      bookmark = update(bookmark, {history: 
        {$push: [userconfig] }
      })
    }
    setData("bookmark", bookmark)
    const options = { method: "POST", data: [userconfig] }
    const result = await app.requestData("/ui_userconfig", options)
    if(result.error){
      return app.resultError(result)
    }
  }

  const deleteEditor = () => {
    const clearEditor = () => {
      setData("edit", { dataset: {}, current: {}, dirty: false, form_dirty: false })
      setData("current", { module: "search" })
    }
    const deleteData = async () => {
      const result = await app.requestData("/"+data.edit.current.type, 
        { method: "DELETE", query: { id: data.edit.current.item.id } })
      if(result && result.error){
        return app.resultError(result)
      }
      createHistory("delete")
      clearEditor()
    }
    setData("current", { input: { 
      title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
      infoText: app.getText("msg_delete_info"),
      cbCancel: () => {
        setData("current", { input: null })
      },
      cbOK: (value) => {
        setData("current", { input: null }, async () => {
          if (data.edit.current.item.id === null) {
            clearEditor()
          } else {
            if (typeof sql[data.edit.current.type]["delete_state"] !== "undefined") {
              const sqlInfo = getSql(data.login.data.engine, sql[data.edit.current.type]["delete_state"]())
              const params = { 
                method: "POST", 
                data: [{ 
                  key: "state",
                  text: sqlInfo.sql,
                  values: Array(sqlInfo.prmCount).fill(data.edit.current.item.id)
                }]
              }
              let view = await app.requestData("/view", params)
              if(view.error){
                return app.resultError(view)
              }
              if (view.state[0].sco > 0) {
                app.showToast({ type: "error", //autoClose: false,
                  title: app.getText("msg_warning"), 
                  message: app.getText("msg_integrity_err") })
              } else {
                deleteData()
              }
            } else {
              deleteData()
            }
          }
        })
      }
    }})
  }

  const deleteEditorItem = (params) => {
    const reLoad = () => {
      loadEditor({
        ntype: data.edit.current.type, 
        ttype: data.edit.current.transtype, 
        id: data.edit.current.item.id, 
        form: params.fkey
      })
    }
    const deleteItem = async () => {
      if (params.id === null) {
        reLoad()
      } else {
        const table = (!params.table) ? params.fkey : params.table
        const result = await app.requestData(
          "/"+table, { method: "DELETE", query: { id: params.id } })
        if(result && result.error){
          return app.resultError(result)
        }
        createHistory("save")
        reLoad()
      }
    }

    if(params.prompt){
      deleteItem()
    } else {
      setData("current", { input: { 
        title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
        infoText: app.getText("msg_delete_info"),
        cbCancel: ()=>{
          setData("current", { input: null })
        },
        cbOK: (value)=>{
          setData("current", { input: null }, ()=>{
            deleteItem()
          })
        }
      }})
    }
  }

  const reportPath = (params) => {
    let query = new URLSearchParams()
    query.append("reportkey", params.template)
    query.append("orientation", params.orient)
    query.append("size", params.size)
    query.append("output", params.type)
    query.append("nervatype", data.edit.current.type)
    return `/report?${query.toString()}&filters[@id]=${data.edit.current.item.id}`
  }

  const setPreviewPage = (options) => {
    let pageNumber = options.pageNumber || 1
    pageNumber = pageNumber < 1 ? 1 : pageNumber
    pageNumber = pageNumber > options.pdf.numPages ? options.pdf.numPages : pageNumber
    options.pdf.getPage(pageNumber).then((page) => {
      let edit = update(data.edit, {})
      edit = update(edit, {$merge: {
        preview: {
          type: "pdf",
          template: options.template,
          size: options.size,
          orient: options.orient,
          pdf: options.pdf,
          page: page,
          scale: options.scale || 1,
          pageNumber: pageNumber,
          totalPages: options.pdf.numPages
        }
      }})
      setData("edit", edit)
    })
  }

  const loadPreview = (params) => {
    setData("current", { "request": true })
    pdfjsLib.getDocument({
      url: data.session.proxy+data.session.basePath+reportPath(params),
      httpHeaders: { Authorization: `Bearer ${data.login.data.token}` }
    }).promise.then((pdf) => {
      setData("current", { "request": false })
      setPreviewPage(update(params, {$merge: {
        pdf: pdf
      }}))
    }, (error) => {
      setData("current", { "request": false })
      return app.resultError(error)
    })
  }

  const addPrintQueue = async (reportkey, copy) => {
    const report = data.edit.dataset.report.filter((item)=>(item.reportkey === reportkey))[0]
    const ntype = data.login.data.groups.filter(
      (item)=>((item.groupname === "nervatype") && (item.groupvalue === data.edit.current.type)))[0]
    const values = {
      "nervatype": ntype.id, 
      "ref_id": data.edit.current.item.id, 
      "qty": parseInt(copy), 
      "employee_id": data.login.data.employee.id, 
      "report_id": report.id
    }
    const options = { method: "POST", data: [values] }
    const result = await app.requestData("/ui_printqueue", options)
    if(result.error){
      return app.resultError(result)
    }
    app.showToast({ type: "success", autoClose: true,
      title: app.getText("msg_successful"), 
      message: app.getText("report_add_groups") })
  }

  const reportOutput = async (params) => {
    if(params.type === "printqueue"){
      return addPrintQueue(params.template, params.copy)
    }
    if(params.type === "preview"){
      return loadPreview(params)
    }
    const result = await app.requestData(reportPath(params), {})
    if(result && result.error){
      return app.resultError(result)
    }
    const resultUrl = URL.createObjectURL(result, {type : (params.type === "pdf") ? "application/pdf" : "application/xml; charset=UTF-8"})
    let filename = params.title+"_"+formatISO(new Date(), { representation: 'date' })+"."+params.type
    filename = filename.split("/").join("_")
    return saveToDisk(resultUrl, filename)
  }

  const checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    const cbNext = (cbKey) =>{
      switch (cbKey) {
        case "LOAD_EDITOR":
          loadEditor(options);
          break;
        case "SET_EDITOR_ITEM":
          setEditorItem(options);
          break;
        case "LOAD_FORMULA":
          //dispatch(appData("modal", { type: 'formula', params: {formula: ""} }))
          break;
        case "NEW_FIELDVALUE":
          newFieldvalue(options.fieldname)
          break;
        case "REPORT_SETTINGS":
          showReport({ 
            onChange: (form) => {
              setData("edit", { selectorForm: form })
            }, 
            onOutput: (params) => {
              setData("edit", { selectorForm: null }, ()=>{
                reportOutput(params)
              })
            }
          })
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

        setData("current", { input: { 
          title: app.getText("msg_warning"), message: app.getText("msg_dirty_text"),
          infoText: app.getText("msg_dirty_info"),
          cbCancel: ()=>{
            setData("current", { input: null }, ()=>{
              if (cbKeyFalse) {
                setData("edit", { dirty: false, form_dirty: false })
                cbNext(cbKeyFalse)
              } else {
                cbNext(cbKeyTrue)
              }
            })
          },
          cbOK: (value)=>{
            setData("current", { input: null }, ()=>{
              if (data.edit.form_dirty) {
                //dispatch(tableValidator(data.edit.current.form, 
                //  ()=>{
                //    dispatch(saveEditorForm(cbKeyTrue, cbKeyFalse, options));}));
              } else {
                if (data.edit.current.type==="template"){
                  //dispatch(saveTemplate(callback));
                } else {
                  //dispatch(saveEditor(cbKeyTrue, cbKeyFalse, options));
                }
              }
            })
          }
        }})
    } else if (cbKeyFalse) {
      cbNext(cbKeyFalse);
    } else {
      cbNext(cbKeyTrue);
    }
  }
  
  const checkTranstype = async (options, cbKeyTrue, cbKeyFalse) => {
    if ((options.ntype==="trans" || options.ntype==="transitem" || 
      options.ntype==="transmovement" || options.ntype==="transpayment") && 
      options.ttype===null) {
        const params = { 
          method: "POST", 
          data: [{ 
            key: "transtype",
            text: getSql(data.login.data.engine, {
              select:["groupvalue"], from:"groups g", 
              inner_join:["trans t","on",[["g.id","=","t.transtype"],["and","t.id","=","?"]]]}).sql,
            values: [options.id] 
          }]
        }
        let view = await app.requestData("/view", params)
        if(view.error){
          return app.resultError(view)
        }
        checkEditor({ntype:"trans", ttype:view.transtype[0].groupvalue, id:options.id}, cbKeyTrue, cbKeyFalse)
    } else {
      checkEditor(options, cbKeyTrue, cbKeyFalse)
    }
  }

  const setFormActions = (params, _row) => {

    const row = _row || {}
    switch (params.action) {
      case "loadEditor":
        checkEditor({
          ntype: params.ntype || data.edit.current.type, 
          ttype: params.ttype || data.edit.current.transtype, 
          id: row.id || null }, 
          'LOAD_EDITOR')
        break;
      
      case "newEditorItem":
        checkEditor({fkey: params.fkey, id: null}, 'SET_EDITOR_ITEM')
        break;
      
      case "editEditorItem":
        setEditorItem({fkey: params.fkey, id: row.id})
        break;
      
      case "deleteEditorItem":
        deleteEditorItem({fkey: params.fkey, table: params.table, id: row.id})
        break;

      case "loadShipping":
        checkEditor({
          ntype: params.ntype || data.edit.current.type, 
          ttype: params.ttype || data.edit.current.transtype, 
          id: params.id || data.edit.current.item.id, 
          shipping: true}, 'LOAD_EDITOR')
        break;
      
      case "addShippingRow":
        /*
        if (row.edited !== true) {
          data.edit.dataset.shiptemp.push(
            { "id": row.item_id+"-"+row.product_id, 
              "item_id": row.item_id, "product_id": row.product_id,  
              "product": row.product, "partnumber": row.partnumber,
              "partname": row.partname, "unit": row.unit, 
              "batch_no":"", "qty":row.diff, "diff":0,
              "oqty":row.qty, "tqty":row.tqty});
          appData("page_edit", data.edit)
          setEditor(data.edit.template, {shipping: true, form:"shipping_items"})
        }
        */
        break;
      
      case "showShippingStock":
        //showStock({ 
        //    product_id: row.product_id, 
        //    partnumber: row.partnumber, 
        //    partname: row.partname})
        break;

      case "editShippingRow":
        //appData("modal", { type: 'shipping', params: copyItem({}, row) })
        break;
      
      case "updateShippingRow":
        //const item = getState().store.modal.params;
        //const uitem = getItemFromKey(data.edit.dataset.shiptemp, "id", item.id);
        
        //item.diff = item.oqty - (item.tqty + item.qty);
        //data.edit.dataset.shiptemp[uitem.index] = item;
        //appData("page_edit", data.edit)
        //modalValue('type','')
        break;
      
      case "deleteShippingRow":
        //let sitem = getItemFromKey(data.edit.dataset.shiptemp, "id", row.id);
        //data.edit.dataset.shiptemp = deleteItem(data.edit.dataset.shiptemp, sitem.index);
        //appData("page_edit", data.edit)
        //setEditor(data.edit.template, {shipping: true, form:"shiptemp_items"})
        break;

      case "exportQueueItem":
        //exportQueue(row)
        break;
    
      default:
        break;
    }
  }

  const prevTransNumber = () => {

  }

  const nextTransNumber = () => {

  }

  return {
    checkEditor: checkEditor,
    checkTranstype: checkTranstype,
    loadEditor: loadEditor,
    setEditor: setEditor,
    setFormActions: setFormActions,
    deleteEditorItem: deleteEditorItem,
    deleteEditor: deleteEditor,
    loadPreview: loadPreview,
    setPreviewPage: setPreviewPage,
    prevTransNumber: prevTransNumber,
    nextTransNumber: nextTransNumber
  }
}