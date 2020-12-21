import React, { useContext, useState } from 'react';
import update from 'immutability-helper';
import { formatISO } from 'date-fns'

import AppStore from 'containers/App/context'
import { getSql, saveToDisk, useApp } from 'containers/App/actions'
import { useSearch } from './actions'
import { useEditor } from 'containers/Editor/actions'
import { useQueries } from 'containers/Controller/Queries'
import { QuickView, BrowserView } from './Search';

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const search = useSearch()
  const editor = useEditor()
  const queries = useQueries()
  const app = useApp()

  const [state] = useState({
    engine: data.login.data.engine,
    queries: queries,
    theme: data.session.theme,
    ui: app.getSetting("ui"),
    getText: app.getText,
    showHelp: app.showHelp
  })

  state.data = data.search
  state.current = data.current

  state.editRow = (row, rowIndex) => {
    const params = row.id.split("/")
    const options = update({},{$set: { 
      ntype: params[0], 
      ttype: params[1], 
      id: parseInt(params[2],10), item:row 
    }})
    if (options.ntype === "servercmd") {
      //showServerCmd(options.id)
    } else {
      editor.checkEditor(options, 'LOAD_EDITOR')
    }
  }

  state.setActions = (params, row) => {
    editor.setFormActions(params, row)
  }

  state.onEdit = ( fieldname, value, row ) => {
    const params = value.split("/")
    let options = update({},{$set: { 
      ntype: params[0], 
      ttype: params[1], 
      id: params[2] 
    }})
    if(fieldname === "id"){
      options = update(options, {$merge: {
        form: row.form,
        form_id: row.form_id
      }})
    }
    editor.checkEditor(options, 'LOAD_EDITOR')
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
    setData("search", { columns: columns, update: new Date().getTime() })
  }

  state.showColumns = () => {
    setData("search", { [state.data.vkey+"_columns"]: !(state.data[state.data.vkey+"_columns"]) })
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
    setData("search", { filters: filters })
  }

  state.deleteFilter = (index) => {
    let filters = update(state.data.filters, {})
    filters = update(filters, { [state.data.view]: {
      $splice: [[index, 1]]
    } })
    setData("search", { filters: filters })
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
    setData("search", { filters: filters })
  }

  state.browserFilter = () => {
    setData("search", { browser_filter: !state.data.browser_filter })
  }

  state.dropDown = (value) => {
    setData("search", { dropdown: (state.data.dropdown === value) ? "": value })
  }

  state.showBrowser = (vkey, view) => {
    search.showBrowser(vkey, view)
  }

  state.quickSearch = async () => {
    const view = await search.quickSearch(state.data.qview, state.data.qfilter)
    if(view.error){
      return app.resultError(view)
    }
    setData("search", { result: view.result })
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

    _where = search.getDataFilter(state.data.vkey, [], state.data.view)
    if(_where.length > 0){
      _sql = update(_sql, { where: {$push: [_where]}})
    }

    let userFilter = search.getUserFilter(state.data.vkey)
    if(userFilter.where.length > 0){
      _sql = update(_sql, { where: {$push: userFilter.where}})
      params = params.concat(userFilter.params)
    }

    let views = [
      { key: "result",
        text: getSql(state.engine, _sql).sql,
        values: params 
      }
    ]
    let options = { method: "POST", data: views }
    let view = await app.requestData("/view", options)
    if(view.error){
      return app.resultError(view)
    }
    setData("search", { result: view.result, dropdown: "" })
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
      app.showToast({ type: "message", autoClose: false,
        title: app.getText("browser_total"), message: content.join("") })
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
    saveToDisk(csvUrl, filename)
  }

  state.bookmarkSave = () => {
    app.saveBookmark(['browser',queries[data.search.vkey]()[data.search.view].label])
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