import React, { useContext, useState } from 'react';
import update from 'immutability-helper';
import { formatISO } from 'date-fns'

import AppStore from 'containers/App/context'
import { QuickView, BrowserView } from './Search';

export default (props) => {
  const { data, actions } = useContext(AppStore);
  
  const [state] = useState({
    mdKey: "search",
    engine: data.login.data.engine,
    queries: data.queries,
    theme: data.session.theme,
    ui: data.ui
  })

  state.data = data[state.mdKey]
  state.current = data.current

  state.getText = (key, defValue) => {
    return actions.getText(key, defValue)
  }

  state.editRow = (row, rowIndex) => {
    //actions.setData("current", { module: "video", params: [row.id], fallback:"games" })
  }

  state.onEdit = ( fieldname, value, row ) => {
    //const val = value
  }

  state.setColumns = (fieldname, value) => {
    let columns = update(state.data.columns, {})
    if(value){
      columns = update(columns, { [state.data.view] : {$merge: {
        [fieldname]: true
      }} })
    } else {
      delete columns[state.data.view][fieldname]
      columns = update(columns, {$merge: {
        [state.data.view] : columns[state.data.view]
      } })
    }
    actions.setData(state.mdKey, { columns: columns, update: new Date().getTime() })
  }

  state.showColumns = () => {
    actions.setData(state.mdKey, { [state.data.vkey+"_columns"]: !(state.data[state.data.vkey+"_columns"]) })
  }

  const defaultFilterValue = (fieldtype) => {
    switch (fieldtype) {
      case "date":
        return formatISO(new Date(), { representation: 'date' })
      case "bool":
      case "integer":
      case "float":
        return 0
      default:
        return ""
    }
  }

  state.addFilter = () => {
    const viewDef = state.queries[state.data.vkey]()[state.data.view]
    const frow = viewDef.fields[Object.keys(viewDef.fields)[0]]
    let filters = update(state.data.filters, {})
    filters = update(filters, { [state.data.view]: {$push: [{
      id: new Date().getTime().toString(),
      fieldtype: frow.fieldtype,
      fieldname: Object.keys(viewDef.fields)[0],
      sqlstr: frow.sqlstr,
      wheretype: frow.wheretype,
      filtertype: "===",
      value: defaultFilterValue(frow.fieldtype)
    }]}})
    actions.setData(state.mdKey, { filters: filters })
  }

  state.deleteFilter = (index) => {
    let filters = update(state.data.filters, {})
    filters = update(filters, { [state.data.view]: {
      $splice: [[index, 1]]
    } })
    actions.setData(state.mdKey, { filters: filters })
  }

  state.editFilter = (index, fieldname, value) => {
    const viewDef = state.queries[state.data.vkey]()[state.data.view]
    let filters = update(state.data.filters, {})
    switch (fieldname) {
      case "filtertype":
      case "value":
        filters = update(filters, { [state.data.view]: {
          [index]: {$merge: { [fieldname]: value } }
        } })
        break;
      case "fieldname":
        if (Object.keys(viewDef.fields).includes(value)) {
          const frow = viewDef.fields[value]
          filters = update(filters, { [state.data.view]: {
            [index]: {$merge: { 
              fieldname: value, fieldtype: frow.fieldtype,
              sqlstr: frow.sqlstr, wheretype: frow.wheretype, filtertype: "===",
              value: defaultFilterValue(frow.fieldtype)
            }}
          }})
        } else {
          const deffield = state.data.deffield.filter((df)=>(df.fieldname === value))[0]
          if(deffield){
            let fieldtype = "string"; let sqlstr = "fv.value ";
            switch (deffield.fieldtype) {
              case "bool":
                fieldtype = "bool";
                sqlstr = "fg.groupvalue='bool' and case when fv.value='true' then 1 else 0 end ";
                break;
              case "integer":
                fieldtype = "integer";
                sqlstr = "fg.groupvalue='integer' and {FMSF_NUMBER} {CAS_INT}fv.value {CAE_INT} {FMEF_CONVERT} ";
                break;
              case "float":
                fieldtype = "float";
                sqlstr = "fg.groupvalue='float' and {FMSF_NUMBER} {CAS_FLOAT}fv.value {CAE_FLOAT} {FMEF_CONVERT} ";
                break;
              case "date":
                fieldtype = "date";
                sqlstr = "fg.groupvalue='date' and {FMSF_DATE} {CASF_DATE}fv.value{CAEF_DATE} {FMEF_CONVERT} ";
                break;
              case "customer":
                fieldtype = "string";
                sqlstr = "rf_customer.custname ";
                break;
              case "tool":
                fieldtype = "string";
                sqlstr = "rf_tool.serial ";
                break;
              case "product":
                fieldtype = "string";
                sqlstr = "rf_product.partnumber ";
                break;
              case "trans":
              case "transitem":
              case "transmovement":
              case "transpayment":
                fieldtype = "string";
                sqlstr = "rf_trans.transnumber ";
                break;
              case "project":
                fieldtype = "string";
                sqlstr = "rf_project.pronumber ";
                break;
              case "employee":
                fieldtype = "string";
                sqlstr = "rf_employee.empnumber ";
                break;
              case "place":
                fieldtype = "string";
                sqlstr = "rf_place.planumber ";
                break;
              default:
                fieldtype = "string";
                sqlstr = "fv.value ";   
            }
            filters = update(filters, { [state.data.view]: {
              [index]: {$merge: { 
                fieldname: deffield.fieldname,
                fieldlimit: ["and","fv.fieldname","=","'"+deffield.fieldname+"'"],
                fieldtype: fieldtype, sqlstr: sqlstr,
                wheretype: "where", filtertype: "===", value: ""
              }}
            }})
          }
        }
        break;
      default:
    }
    actions.setData(state.mdKey, { filters: filters })
  }

  state.browserFilter = () => {
    actions.setData(state.mdKey, { browser_filter: !state.data.browser_filter })
  }

  state.dropDown = (value) => {
    actions.setData(state.mdKey, { dropdown: (state.data.dropdown === value) ? "": value })
  }

  state.showBrowser = (vkey, view) => {
    actions.showBrowser(vkey, view)
  }
  
  const getDataFilter = (type, _where) => {
    switch (type) {
      case "customer":
        break;
      case "product":
        break;
      case "transitem":
        if (actions.getAuditFilter("trans", "offer")[0] === "disabled") {
          _where = _where.concat.push(["and", ["tg.groupvalue", "<>", "'offer'"]]);
        }
        if (actions.getAuditFilter("trans", "order")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'order'"]]);
        }
        if (actions.getAuditFilter("trans", "worksheet")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'worksheet'"]]);
        }
        if (actions.getAuditFilter("trans", "rent")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'rent'"]]);
        }
        if (actions.getAuditFilter("trans", "invoice")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'invoice'"]]);
        }
        break;
      case "transpayment":
        if (actions.getAuditFilter("trans", "bank")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'bank'"]]);
        }
        if (actions.getAuditFilter("trans", "cash")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'cash'"]]);
        }
        break;
      case "transmovement":
        if (state.data.view !== "InventoryView") {
          if (actions.getAuditFilter("trans", "delivery")[0] === "disabled") {
            _where = _where.concat(["and", ["tg.groupvalue", "<>", "'delivery'"]]);
          }
          if (actions.getAuditFilter("trans", "inventory")[0] === "disabled") {
            _where = _where.concat(["and", ["tg.groupvalue", "<>", "'inventory'"]]);
          }
        }
        break;
      default:
        break;
    }
    return _where;
  }

  const getUserFilter = (type) => {
    let filter = { params: [], where: []}
    const query = state.queries[type]
    if(!query){
      return filter
    }
    switch (data.login.data.transfilterName) {
      case "all":
        break;
      case "usergroup":
        if (query().options.usergroup_filter !== null) {
          filter.where = ["and", query().options.usergroup_filter]
          filter.params = [data.login.data.employee.usergroup]
        }
        break;
      case "own":
        if (query().options.employee_filter !== null) {
          filter.where = ["and", query().options.employee_filter]
          filter.params = [data.login.data.employee.id]
        }
        break;
      default:
        break;}
    return filter;
  }

  state.quickSearch = async () => {
    const query = state.queries.quick[state.data.qview](data.login.data.employee.usergroup)
    let _sql = update({}, {$set: query.sql})
    let params = []; let _where = []
    if(state.data.qfilter !== ""){
      const filter = `{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE} `
      query.columns.forEach((column, index) => {
        _where.push([((index!==0)?"or":""),[`lower(${column[1]})`,"like", filter]])
        params.push(state.data.qfilter)
      });
      _where = ["and",[_where]]
    }
    _where = getDataFilter(state.data.qview, _where)
    if(_where.length > 0){
      _sql = update(_sql, { where: {$push: [_where]}})
    }

    let userFilter = getUserFilter(state.data.qview)
    if(userFilter.where.length > 0){
      _sql = update(_sql, { where: {$push: userFilter.where}})
      params = params.concat(userFilter.params)
    }
    
    let views = [
      { key: "result",
        text: actions.getSql(state.engine, _sql),
        values: params 
      }
    ]
    let options = { method: "POST", data: views }
    let view = await actions.requestData("/view", options)
    if(view.error){
      return actions.resultError(view)
    }
    actions.setData(state.mdKey, { result: view.result })
  }

  state.browserView = async () => {
    const query = state.queries[state.data.vkey]()[state.data.view]
    let _sql = update({}, {$set: query.sql})
    let params = []

    const setFilterWhere = (filter) => {
      if(filter.filtertype !== "==N"){
        params.push(filter.value)
      }
      switch (filter.filtertype) {
        case "===":
          if(filter.fieldtype === "string"){
            _where.push(
              ["and", ["lower("+filter.sqlstr+")", "like", "{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE}"]])
          } else {
            _where.push(["and", [filter.sqlstr, "=", "?"]])
          }
          break;
        
        case "==N":
          if(filter.fieldtype === "string"){
            _where.push(
              ["and", [ [filter.sqlstr, "like", "''"], ["or", filter.sqlstr, "is null"]]])
          } else {
            _where.push(["and", filter.sqlstr, " is null"])
          }
          break;
        
        case "!==":
          if(filter.fieldtype === "string"){
            _where.push(
              ["and", ["lower("+filter.sqlstr+")", "not like", "{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE}"]])
          } else {
            _where.push(["and", [filter.sqlstr, "<>", "?"]])
          }
          break;
        
        case ">==":
          _where.push(["and", [filter.sqlstr, ">=", "?"]])
          break;
        
        case "<==":
          _where.push(["and", [filter.sqlstr, "<=", "?"]])
          break;

        default:
      }
    }
    
    let _where = []
    state.data.filters[state.data.view].filter((filter)=>(filter.wheretype === "where")).forEach(filter => {
      setFilterWhere(filter)
    });
    if(_where.length > 0){
      _sql = update(_sql, { where: {$push: [..._where]}})
    }

    _where = []
    state.data.filters[state.data.view].filter((filter)=>(filter.wheretype === "having")).forEach(filter => {
      setFilterWhere(filter)
    });
    if(_where.length > 0){
      _sql = update(_sql, { having: {$push: [..._where]}})
    }

    _where = getDataFilter(state.data.vkey, [])
    if(_where.length > 0){
      _sql = update(_sql, { where: {$push: [_where]}})
    }

    let userFilter = getUserFilter(state.data.vkey)
    if(userFilter.where.length > 0){
      _sql = update(_sql, { where: {$push: userFilter.where}})
      params = params.concat(userFilter.params)
    }

    let views = [
      { key: "result",
        text: actions.getSql(state.engine, _sql),
        values: params 
      }
    ]
    let options = { method: "POST", data: views }
    let view = await actions.requestData("/view", options)
    if(view.error){
      return actions.resultError(view)
    }
    actions.setData(state.mdKey, { result: view.result, dropdown: "" })
  }
  
  state.checkTotalFields = (fields, deffield) => {
    let retval = { totalFields: {}, totalLabels: {}, count: 0 }
    if (Object.keys(fields).includes("deffield_value")) {
      deffield.filter((df)=>((df.fieldtype==="integer")||(df.fieldtype==="float")))
      .forEach((df) => {
         retval = update(retval, { 
           totalFields: { $merge: { [df.fieldname]: 0 }},
           totalLabels: { $merge: { [df.fieldname]: df.description }}
         })
       }
      )
    } else {
      Object.keys(fields).filter((fieldname)=>(
        ((fields[fieldname].fieldtype==="integer")||(fields[fieldname].fieldtype==="float"))
          &&(fields[fieldname].calc !== "avg")))
      .forEach((fieldname) => {
         retval = update(retval, { 
           totalFields: { $merge: { [fieldname]: 0 }},
           totalLabels: { $merge: { [fieldname]: fields[fieldname].label }}
         })
       }
      )
    }
    retval = update(retval, { $merge: {
      count: Object.keys(retval.totalFields).length
    }})
    return retval
  }

  state.showTotal = (fields, total) => {
    let df = false;
    const deffield = Object.keys(fields).includes("deffield_value")
    const getValidValue = (value) => {
      if(isNaN(parseFloat(value))) {
        return 0
      } else {
        return parseFloat(value)
      }
    }
    const formatNumber = (number) => {
      return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    state.data.result.forEach(row => {
      if (deffield) {
        if (typeof total.totalFields[row.fieldname] !== "undefined") {
          df = true;
          total = update(total, { 
            totalFields: { $merge: { 
              [row.fieldname]: total.totalFields[row.fieldname] + getValidValue(row.export_deffield_value) }}
          })
        }
      } else {
        df = true;
        Object.keys(total.totalFields).forEach(fieldname => {
          if (typeof row["export_"+fieldname] !== "undefined") {
            total = update(total, { 
              totalFields: { $merge: { 
                [fieldname]: total.totalFields[fieldname] + getValidValue(row["export_"+fieldname]) }}
            })
          } else {
            total = update(total, { 
              totalFields: { $merge: { 
                [fieldname]: total.totalFields[fieldname] + getValidValue(row[fieldname]) }}
            })
          }
        });
      }
    });
    if(df){
      const content = Object.keys(total.totalFields).map(fieldname => 
        `<div class="row full">
          <div class="cell bold padding-tiny half">
            <span>${total.totalLabels[fieldname]}</span>
          </div>
          <div class="cell padding-tiny half">
            <input class="align-right bold right full" 
              type="text" disabled="disabled"
              value="${formatNumber(total.totalFields[fieldname])}"/>
          </div>
        </div>`)
      actions.showToast({ type: "message", autoClose: false,
        title: actions.getText("browser_total"), message: content.join("") })
    }
  }

  state.exportResult = (fields) => {
    const filename = state.data.view+".csv"
    let data = ""
    const labels = Object.keys(fields).map(fieldname => {
      return fields[fieldname].label
    })
    data += labels.join(state.ui.export_sep) + "\n"
    state.data.result.forEach(row => {
      const cols = Object.keys(fields).map(fieldname => {
        return (typeof row["export_"+fieldname] != "undefined") ? row["export_"+fieldname] : row[fieldname]
      })
      data += cols.join(state.ui.export_sep) + "\n"
    });
    const csvUrl = URL.createObjectURL(new Blob([data], {type : 'text/csv;charset=utf-8;'}))
    actions.saveToDisk(csvUrl, filename)
  }

  if(state.data.vkey){
    return (
      <BrowserView {...state} />
    )
  }
  return (
    <QuickView {...state} />
  )
}