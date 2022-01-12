import update from 'immutability-helper';
import { formatISO } from 'date-fns'

import { getSql, appActions, request } from 'containers/App/actions'
import { Queries } from 'containers/Controller/Queries'
import Server from 'components/Modal/Server'

export const searchActions = (data, setData) => {
  const app = appActions(data, setData)
  const queries = Queries({ getText: app.getText })

  const showBrowser = (vkey, view, search_data) => {
    search_data = search_data || data.search
    setData("current", { side: app.getSideBar() }, async ()=>{
      let search = update(search_data, {$merge: {
        seltype: "browser",
        vkey: vkey, 
        view: (typeof view==="undefined") ? Object.keys(queries[vkey]())[1] : view, 
        result: [], deffield:[],
        show_dropdown: false,
        show_header: (typeof search_data.show_header === "undefined") ? true : search_data.show_header,
        show_columns: (typeof search_data.show_columns === "undefined") ? false : search_data.show_columns,
        page: search_data.page || 1,
      }})
      let views = [
        { key: "deffield",
          text: getSql(data.login.data.engine, 
            queries[vkey]().options.deffield_sql).sql,
          values: [] 
        }
      ]
      let options = { method: "POST", data: views }
      let result = await app.requestData("/view", options)
      if(result.error){
        return app.resultError(result)
      }
      search = update(search, {$merge: {
        deffield: result.deffield
      }})
      if(!search.filters[search.view]){
        search = update(search, { filters: {
          $merge: { [search.view]: []}
        }})
      }
      const viewDef = queries[vkey]()[search.view]
      if (typeof search.columns[search.view] === "undefined") {
        search = update(search, { columns: {
          $merge: { [search.view]: {} }
        }})
        for(let fic = 0; fic < Object.keys(viewDef.columns).length; fic++) {
          let fieldname = Object.keys(viewDef.columns)[fic];
          search = update(search, { columns: { 
            [search.view]: {
              $merge: { [fieldname]: viewDef.columns[fieldname] }
            }
          }})
        }
      }
      if (Object.keys(search.columns[search.view]).length === 0) {
        for(let v = 0; v < 3; v++) {
          let fieldname = Object.keys(viewDef.fields)[v];
          search = update(search, { columns: { 
            [search.view]: {
              $merge: { [fieldname]: true }
            }
          }})
        }
      }
      setData("search", search)
      setData("current", { module: "search" })
    })
  }
  
  const getDataFilter = (type, _where, view) => {
    if(type === "transitem"){
      if (app.getAuditFilter("trans", "offer")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'offer'"]]);
      }
      if (app.getAuditFilter("trans", "order")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'order'"]]);
      }
      if (app.getAuditFilter("trans", "worksheet")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'worksheet'"]]);
      }
      if (app.getAuditFilter("trans", "rent")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'rent'"]]);
      }
      if (app.getAuditFilter("trans", "invoice")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'invoice'"]]);
      }
    }
    if(type === "transpayment"){
      if (app.getAuditFilter("trans", "bank")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'bank'"]]);
      }
      if (app.getAuditFilter("trans", "cash")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'cash'"]]);
      }
    }
    if((type === "transmovement") && (view !== "InventoryView")){
      if (app.getAuditFilter("trans", "delivery")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'delivery'"]]);
      }
      if (app.getAuditFilter("trans", "inventory")[0] === "disabled") {
        _where = _where.concat(["and", ["tg.groupvalue", "<>", "'inventory'"]]);
      }
    }
    return _where;
  }

  const getUserFilter = (type) => {
    let filter = { params: [], where: []}
    const query = queries[type]
    if(!query){
      return filter
    }
    if(data.login.data.transfilterName === "usergroup"){
      if (query().options.usergroup_filter !== null) {
        filter.where = ["and", query().options.usergroup_filter]
        filter.params = [data.login.data.employee.usergroup]
      }
    }
    if(data.login.data.transfilterName === "own"){
      if (query().options.employee_filter !== null) {
        filter.where = ["and", query().options.employee_filter]
        filter.params = [data.login.data.employee.id]
      }
    }
    return filter;
  }

  const quickSearch = async (qview, qfilter) => {
    const query = queries.quick[qview](String(data.login.data.employee.usergroup))
    let _sql = update({}, {$set: query.sql})
    let params = []; let _where = []
    if(qfilter !== ""){
      const filter = `{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE} `
      query.columns.forEach((column, index) => {
        _where.push([((index!==0)?"or":""),[`lower(${column[1]})`,"like", filter]])
        params.push(qfilter)
      });
      _where = ["and",[_where]]
    }
    _where = getDataFilter(qview, _where)
    if(_where.length > 0){
      _sql = update(_sql, { where: {$push: [_where]}})
    }

    let userFilter = getUserFilter(qview)
    if(userFilter.where.length > 0){
      _sql = update(_sql, { where: {$push: userFilter.where}})
      params = params.concat(userFilter.params)
    }
    
    let views = [
      { key: "result",
        text: getSql(data.login.data.engine, _sql).sql,
        values: params 
      }
    ]
    let options = { method: "POST", data: views }
    return await app.requestData("/view", options)
  }

  const showServerCmd = (menu_id) => {
    const menuCmd = data.login.data.menuCmds.filter(item => (item.id === parseInt(menu_id, 10)))[0]
    if(menuCmd){
      const menuFields = data.login.data.menuFields.filter(item => (item.menu_id === parseInt(menu_id, 10)))
      let params =update({}, {$set: {
        cmd: menuCmd, 
        fields: menuFields, 
        values: {}
      }})
      menuFields.forEach(mfield => {
        switch (mfield.fieldtypeName) {
          case "bool":
            params.values[mfield.fieldname] = false
            break;
          case "float":
          case "integer":
            params.values[mfield.fieldname] = 0
            break;
          default:
            params.values[mfield.fieldname] = ""
            break;
        }
      });
      setData("current", { modalForm: 
        <Server 
          {...params}
          getText={app.getText}
          onClose={() => {
            setData("current", { modalForm: null })
          }}
          onOK={(options) => {
            setData("current", { modalForm: null }, async ()=>{
              let query = new URLSearchParams();
              let values = update({}, {$set: options.values})
              options.fields.forEach(function(field) {
                if (field.fieldtypeName === "bool") {
                  query.append(field.fieldname, (options.values[field.fieldname])?1:0)
                  values[field.fieldname] = (options.values[field.fieldname])?1:0
                } else {
                  query.append(field.fieldname, options.values[field.fieldname])
                }
              })
              if (options.cmd.methodName === "get") {
                let server = options.cmd.address || ""
                if((server === "") && options.cmd.funcname && (options.cmd.funcname !== "")){
                  server = (data.session.configServer)?
                    data.session.proxy+data.session.apiPath+"/"+options.cmd.funcname : 
                    data.login.server+"/"+options.cmd.funcname
                }
                if (server!=="") {
                  window.open(server+"?"+query.toString(), '_system')
                }
              } else {
                let params = { method: "POST", 
                  data: {
                    key: options.cmd.funcname || options.cmd.menukey,
                    values: values
                  }
                }
                let result
                if(options.cmd.address && (options.cmd.address !== "")){
                  try {
                    result = await request(options.cmd.address, options)
                  } catch (error) {
                    app.resultError(error)
                    return null
                  }
                } else {
                  result = await app.requestData("/function", params)
                }
                if(result.error){
                  app.resultError(result)
                  return null
                }
                let message = result
                if(typeof result === "object"){
                  message = JSON.stringify(result,null,"  ")
                }
                app.showToast({ type: "success", title: app.getText("ms_server_response"), 
                  message: message })
              }
            })
          }}
        /> 
      })
    }
  }

  const getFilterWhere = (filter) => {
    switch (filter.filtertype) {
      case "==N":
        if(filter.fieldtype === "string"){
          return ["and", [ [filter.sqlstr, "like", "''"], ["or", filter.sqlstr, "is null"]]]
        }
        return ["and", filter.sqlstr, "is null"]
      
      case "!==":
        if(filter.fieldtype === "string"){
          return ["and", ["lower("+filter.sqlstr+")", "not like", "{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE}"]]
        }
        return ["and", [filter.sqlstr, "<>", "?"]]
      
      case ">==":
        return ["and", [filter.sqlstr, ">=", "?"]]
      
      case "<==":
        return ["and", [filter.sqlstr, "<=", "?"]]

      case "===":
      default:
        if(filter.fieldtype === "string"){
          return ["and", ["lower("+filter.sqlstr+")", "like", "{CCS}{JOKER}{SEP}lower(?){SEP}{JOKER}{CCE}"]]
        }
        return ["and", [filter.sqlstr, "=", "?"]]
    }
  }

  const defaultFilterValue = (fieldtype) => {
    if(fieldtype === "date"){
      return formatISO(new Date(), { representation: 'date' })
    }
    if(["bool", "integer", "float"].includes(fieldtype)){
      return 0
    }
    return ""
  }

  return {
    showBrowser: showBrowser,
    quickSearch: quickSearch,
    getUserFilter: getUserFilter,
    getDataFilter: getDataFilter,
    showServerCmd: showServerCmd,
    getFilterWhere: getFilterWhere,
    defaultFilterValue: defaultFilterValue
  }
}
