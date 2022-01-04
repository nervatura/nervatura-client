/*eslint no-useless-escape: "off"*/
import { useContext } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { getSql, useApp, request } from 'containers/App/actions'
import { Queries } from 'containers/Controller/Queries'
import Server from 'components/Modal/Server'

export const useSearch = () => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const queries = Queries({ getText: app.getText })

  const showBrowser = (vkey, view) => {
    setData("current", { side: app.getSideBar() }, async ()=>{
      let search = update(data.search, {$merge: {
        vkey: vkey, view: view,
        filters: {}, 
        columns: {}, 
        result: [],
        page: 1
      }})
      if((search.vkey !== vkey) && queries[vkey]){
        let views = [
          { key: "deffield",
            text: getSql(data.login.data.engine, 
              queries[vkey]().options.deffield_sql).sql,
            values: [] 
          }
        ]
        let options = { method: "POST", data: views }
        let view = await app.requestData("/view", options)
        if(view.error){
          return app.resultError(view)
        }
        search = update(search, {$merge: {
          deffield: view.deffield
        }})
      }
      if (typeof view==="undefined") {
        view = Object.keys(queries[vkey]())[1]
      }
      search = update(search, {$merge: {
        vkey: vkey, view: view, dropdown: "", result: []
      }})
      if(!search.filters[view]){
        search = update(search, { filters: {
          $merge: { [view]: []}
        }})
      }
      const viewDef = queries[vkey]()[view]
      if (typeof search.columns[view] === "undefined") {
        search = update(search, { columns: {
          $merge: { [view]: {} }
        }})
        if (typeof viewDef.columns !== "undefined") {
          for(let fic = 0; fic < Object.keys(viewDef.columns).length; fic++) {
            let fieldname = Object.keys(viewDef.columns)[fic];
            search = update(search, { columns: { 
              [view]: {
                $merge: { [fieldname]: viewDef.columns[fieldname] }
              }
            }})
          }
        }
      }
      if (Object.keys(search.columns[view]).length === 0) {
        for(let v = 0; v < 3; v++) {
          let fieldname = Object.keys(viewDef.fields)[v];
          search = update(search, { columns: { 
            [view]: {
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
    switch (type) {
      case "customer":
        break;
      case "product":
        break;
      case "transitem":
        if (app.getAuditFilter("trans", "offer")[0] === "disabled") {
          _where = _where.concat.push(["and", ["tg.groupvalue", "<>", "'offer'"]]);
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
        break;
      case "transpayment":
        if (app.getAuditFilter("trans", "bank")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'bank'"]]);
        }
        if (app.getAuditFilter("trans", "cash")[0] === "disabled") {
          _where = _where.concat(["and", ["tg.groupvalue", "<>", "'cash'"]]);
        }
        break;
      case "transmovement":
        if (view !== "InventoryView") {
          if (app.getAuditFilter("trans", "delivery")[0] === "disabled") {
            _where = _where.concat(["and", ["tg.groupvalue", "<>", "'delivery'"]]);
          }
          if (app.getAuditFilter("trans", "inventory")[0] === "disabled") {
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
    const query = queries[type]
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

  return {
    showBrowser: showBrowser,
    quickSearch: quickSearch,
    getUserFilter: getUserFilter,
    getDataFilter: getDataFilter,
    showServerCmd: showServerCmd
  }
}
