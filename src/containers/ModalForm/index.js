import React, { useContext, createElement } from 'react';
import update from 'immutability-helper';
import { format, parseISO } from 'date-fns'

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useSearch } from 'containers/Search/actions'
import { useQueries } from 'containers/Controller/Queries'

import styles from './ModalForm.module.css';
import { InputBox, ReportSettings, FormulaBox, SelectorView, ShippingBox, StockBox, 
  TransBox, BookmarkBox, AuditBox, MenuBox, TemplateBox, TotalBox } from './ModalForm'

export const SelectorForm = (props) => {
  const app = useApp()
  const search = useSearch()
  const queries = useQueries()
  return (params) => {
    const { type, filter, onChange, onSelect } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog}`} >{createElement(SelectorView, { ..._props })}</div> 
      </div>)
    }
    let formProps = {
      getText: app.getText,
      quickSearch: async ()=>{
        const view = await search.quickSearch(type, formProps.filter)
        if(view.error){
          return app.resultError(view)
        }
        formProps = update(formProps, { data: {$merge: {
          result: view.result
        }}})
        onChange(form(formProps))
      },
      editRow: (row)=>{
        onSelect(row, formProps.filter)
      },
      onClose: ()=>onChange(null),
      filterChange: (event)=>{
        formProps = update(formProps, {$merge: {
          filter: event.target.value
        }})
        onChange(form(formProps))
      },
      queries: queries, 
      ui: app.getSetting("ui"),
      filter: filter,
      data: {
        qview: type,
        result: []
      }
    }
    onChange(form(formProps))
  }
}

export const ReportForm = (props) => {
  const { data } = useContext(AppStore);
  const app = useApp()
  return (params) => {
    const { onChange, onOutput } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(ReportSettings, { ..._props })}</div> 
      </div>)
    }
    const direction = (data.edit.current.type === "trans") ? 
      data.edit.dataset.groups.filter(
        item => (item.id === data.edit.current.item.direction))[0].groupvalue : "out"
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      reportOutput: (otype) => {
        onOutput({ type: otype, template: formProps.template, title: formProps.title,
          orient: formProps.orient, size: formProps.size, copy: formProps.copy })
      },
      orient: app.getSetting("page_orient"),
      report_orientation: app.getSetting("report_orientation").map(item => { return { value: item[0], text: app.getText(item[1]) } }),
      size: app.getSetting("page_size"),
      report_size: app.getSetting("report_size").map(item => { return { value: item[0], text: item[1] } }),
      copy: 1,
      direction: direction,
      template: (data.edit.current.type === "trans") ?
        data.edit.dataset.settings.filter(
          item => (item.fieldname === "default_trans_"+data.edit.current.transtype+"_"+direction+"_report"))[0] :
        data.edit.dataset.settings.filter(
          item => (item.fieldname === "default_"+data.edit.current.type+"_report"))[0],
      templates: [],
      title: data.edit.current.item[data.edit.template.options.title_field]
    }})
    data.edit.dataset.report.forEach(template => {
      let audit = data.login.data.audit.filter(item => (
        (item.nervatypeName === "report") && (item.subtype === template.id)))[0]
      if(audit){
        audit= audit.inputfilterName
      } else {
        audit = "all"
      }
      if (audit !== "disabled") {
        if (data.edit.current.type==="trans") {
          if (data.edit.current.item.direction === template.direction) {
            formProps = update(formProps, { 
              templates: {$push: [{
                value: template.reportkey, text: template.repname
              }]}
            })
          }
        } else {
          formProps = update(formProps, { 
            templates: {$push: [{
              value: template.reportkey, text: template.repname
            }]}
          })
        }
      }
    })
    if (typeof formProps.template !== "undefined") {
      formProps = update(formProps, {$merge: {
        template: formProps.template.value
      }})
    } else if(formProps.templates.length > 0){
      formProps = update(formProps, {$merge: {
        template: formProps.templates[0].value
      }})
    } else {
      formProps = update(formProps, {$merge: {
        template: ""
      }})
    }
    onChange(form(formProps))
  }
}

export const FormulaForm = (props) => {
  const { data } = useContext(AppStore);
  return (params) => {
    const { onChange, calcFormula } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(FormulaBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      calcFormula: () => {
        calcFormula(parseInt(formProps.formula,10))
      },
      formula: "",
      partnumber: data.edit.dataset.movement_head[0].partnumber,
      description: data.edit.dataset.movement_head[0].description,
      formula_head: data.edit.dataset.formula_head.map(formula => { return { value: formula.id, text: formula.transnumber } })
    }})
    onChange(form(formProps))
  }
}

export const ShippingForm = (props) => {
  return (params) => {
    const { onChange, updateShipping } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(ShippingBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      updateShipping: () => {
        updateShipping(formProps.batch_no, parseFloat(formProps.qty))
      },
      partnumber: params.partnumber, 
      description: params.product, 
      unit: params.unit, 
      batch_no: params.batch_no, 
      qty: params.qty
    }})
    onChange(form(formProps))
  }
}

export const StockForm = (props) => {
  const app = useApp()
  return (params) => {
    const { onChange } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(StockBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      getText: app.getText,
      partnumber: params.partnumber,
      partname: params.partname,
      rows: params.rows,
      paginationPage: app.getSetting("selectorPage")
    }})
    onChange(form(formProps))
  }
}

export const TransForm = (props) => {
  return (params) => {
    const { onChange, createTrans } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(TransBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        if(key === "transtype"){
          if((value === 'invoice' || value === 'receipt') && 
            (formProps.base_transtype==='order' || formProps.base_transtype==='rent' || 
              formProps.base_transtype==='worksheet')){
                formProps.netto_color = true;
          } else {
            formProps.netto_color = false;
          }
          if((value === 'invoice' || value === 'receipt') && 
            (formProps.base_transtype==='order' || formProps.base_transtype==='rent' || 
              formProps.base_transtype==='worksheet') && (formProps.element_count===0)) {
                formProps.from_color = true;
          } else {
            formProps.from_color = false;
          }
        }
        onChange(form(formProps))
      },
      createTrans: () => {
        createTrans({ 
          new_transtype: formProps.transtype, 
          new_direction: formProps.direction, 
          refno: formProps.refno, 
          from_inventory: (formProps.from && formProps.from_color), 
          netto_qty: (formProps.netto && formProps.netto_color)
        })
      },
      ...params.options,
      doctypes: params.options.doctypes.map(dt => { return { value: dt, text: dt } }),
      directions: params.options.directions.map(dir => { return { value: dir, text: dir } })
    }})
    onChange(form(formProps))
  }
}

export const InputForm = (props) => {
  return (params) => {
    const { message, infoText, title, value, defaultOK, labelCancel, 
      labelOK, cbOK, cbCancel, onChange } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(InputBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      inputCancel: () => {
        if(cbCancel){
          cbCancel()
        }
      },
      inputOK: () => {
        if(cbOK){
          cbOK(formProps.value)
        }
      },
      valueKey: (ev) => {
        if((ev.keyCode === 13) && cbOK){
          cbOK(formProps.value)
        }
      },
      title: title || null,
      message: message || "",
      infoText: infoText,
      labelCancel: labelCancel || "Cancel",
      labelOK: labelOK || "OK",
      value: value || "",
      showValue: (typeof value === "undefined") ? false : true,
      defaultOK: ((defaultOK === true) || !defaultOK) ? true : false
    }})
    onChange(form(formProps))
  }
}

export const BookmarkForm = (props) => {
  const app = useApp()
  return (params) => {
    const { getText, onChange, onSelect, onDelete, bookmark } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog}`} >{createElement(BookmarkBox, { ..._props })}</div> 
      </div>)
    }
    const setBookmark = ()=> bookmark.bookmark.map(item => {
      let bvalue = JSON.parse(item.cfvalue)
      let value = {
        bookmark_id: item.id,
        id: bvalue.id,
        cfgroup: item.cfgroup,
        ntype: bvalue.ntype,
        transtype: (bvalue.ntype === "trans") ? bvalue.transtype : null,
        vkey: bvalue.vkey,
        view: bvalue.view,
        filters: bvalue.filters,
        columns: bvalue.columns,
        lslabel: item.cfname, 
        lsvalue: format(parseISO(bvalue.date), props.ui.dateFormat)
      }
      if(item.cfgroup === "editor"){
        if (bvalue.ntype==="trans") {
          value.lsvalue += " | " + getText("title_"+bvalue.transtype) + " | " + bvalue.info
        } else {
          value.lsvalue += " | " + getText("title_"+bvalue.ntype) + " | " + bvalue.info
        }
      }
      if(item.cfgroup === "browser"){
        value.lsvalue += " | " + getText("browser_"+bvalue.vkey)
      }
      return value
    })
    const setHistory = ()=> {
      if(bookmark.history && bookmark.history.cfvalue){
        const history_values = JSON.parse(bookmark.history.cfvalue)
        return history_values.map(item => {
          return {
            id: item.id, 
            lslabel: item.title, 
            type: item.type,
            lsvalue: format(parseISO(item.datetime), props.ui.dateFormat+" "+props.ui.timeFormat)+" | "+ getText("label_"+item.type,item.type), 
            ntype: item.ntype, transtype: item.transtype
          }
        })
      }
      return []
    }
    let formProps = {
      getText: getText,
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      selectRow: (row)=>{
        onSelect(formProps.tabView, row)
      },
      deleteRow: (row)=>{
        onDelete(row.bookmark_id)
      },
      onClose: ()=>onChange(null),
      tabView: "bookmark",
      paginationPage: app.getSetting("selectorPage"),
      bookmarkList: setBookmark(),
      historyList: setHistory()
    }
    onChange(form(formProps))
  }
}

export const AuditForm = (props) => {
  const { data } = useContext(AppStore);
  return (params) => {
    const { onChange, updateAudit } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(AuditBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        if(key === "nervatype"){
          formProps.nervatype_name = data.setting.dataset.nervatype.filter(
            group => (group.id === parseInt(value,10)))[0].groupvalue
          switch (value) {
            case "trans":
              formProps.subtype = data.setting.dataset.transtype[0].id
              break;
            
            case "report":
              if (data.setting.dataset.reportkey.length>0) {
                formProps.subtype = data.setting.dataset.reportkey[0].id;
              } else {
                formProps.subtype = null
              }
              break;
            
            case "menu":
              if (data.setting.dataset.menukey.length>0) {
                formProps.subtype = data.setting.dataset.menukey[0].id;
              } else {
                formProps.subtype = null
              }
              break;
          
            default:
              formProps.subtype = null
              break;
          }
        }
        onChange(form(formProps))
      },
      updateAudit: () => {
        updateAudit(formProps)
      },
      subtypeOptions: () => {
        switch (formProps.nervatype_name) {
          case "trans":
            return data.setting.dataset.transtype.map(group => { 
              return { value: group.id, text: group.groupvalue } })
          case "report":
            return data.setting.dataset.reportkey.map(report => { 
              return { value: report.id, text: report.reportkey } })
          case "menu":
            return data.setting.dataset.menukey.map(menu => { 
              return { value: menu.id, text: menu.menukey } })
          default:
            return []
        }
      },
      id: params.id,
      usergroup: params.usergroup,
      nervatype: params.nervatype,
      subtype: params.subtype||null,
      inputfilter: params.inputfilter,
      supervisor: params.supervisor||0,
      type_options: data.setting.dataset.nervatype.map(group => { return { value: group.id, text: group.groupvalue } }), 
      nervatype_name: data.setting.dataset.nervatype.filter(group => (group.id === params.nervatype))[0].groupvalue,
      inputfilter_options: data.setting.dataset.inputfilter.map(group => { return { value: group.id, text: group.groupvalue } }),
    }})
    onChange(form(formProps))
  }
}

export const MenuForm = (props) => {
  const { data } = useContext(AppStore);
  return (params) => {
    const { onChange, updateMenu } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(MenuBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      updateMenu: () => {
        updateMenu(formProps)
      },
      id: params.id,
      menu_id: params.menu_id,
      fieldname: params.fieldname||"", 
      description: params.description||"", 
      fieldtype: params.fieldtype,
      fieldtype_options: data.setting.dataset.fieldtype.map(group => { return { value: group.id, text: group.groupvalue } }), 
      orderby: params.orderby
    }})
    onChange(form(formProps))
  }
}

export const DataForm = (props) => {
  return (params) => {
    const { onChange, updateData } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(TemplateBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      updateData: () => {
        updateData({name: formProps.name, type: formProps.type, columns: formProps.columns})
      },
      name: "", 
      type: "string", 
      type_options: [
        { value: "string", text: "TEXT" },
        { value: "list", text: "LIST" },
        { value: "table", text: "TABLE" }
      ], 
      columns: ""
    }})
    onChange(form(formProps))
  }
}

export const TotalForm = (props) => {
  return (params) => {
    const { onChange } = params
    const form = (_props) => {
      return (<div className={`${"modal"} ${styles.modal}`} >
        <div className={`${"dialog"} ${styles.dialog} ${styles.width400}`} >{createElement(TotalBox, { ..._props })}</div> 
      </div>)
    }
    let formProps = update({}, {$set: {
      onClose: ()=>onChange(null),
      valueChange: (key, value)=>{
        formProps = update(formProps, {$merge: {
          [key]: value
        }})
        onChange(form(formProps))
      },
      total: params.total
    }})
    onChange(form(formProps))
  }
}