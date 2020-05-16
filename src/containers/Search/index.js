import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { QuickView } from './Search';
import { getQuery } from './queries';

export default (props) => {
  const { data, actions } = useContext(AppStore);
  
  const [state] = useState({
    mdKey: "search",
    engine: data.login.data.engine,
    queries: getQuery(actions.getText),
    theme: data.session.theme
  })

  state.data = data[state.mdKey]
  state.current = data.current

  state.getText = (key) => {
    return actions.getText(key)
  }

  state.editRow = (row, rowIndex) => {
    //actions.setData("current", { module: "video", params: [row.id], fallback:"games" })
  }

  const error = (result) => {
    if(result.error){
      actions.setData(state.mdKey, { error: result.error })
    }
    if(result.error && result.error.message){
      actions.showToast({ type: "error", message: result.error.message })
    } else {
      actions.showToast({ type: "error", 
        message: actions.getText("error_internal", "Internal Server Error") })
    }
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
        text: actions.getSql(state.engine, _sql).replace("@where_str",""),
        values: params 
      }
    ]
    let options = { method: "POST", data: views }
    let view = await actions.requestData("/view", options)
    if(view.error){
      return error(view)
    }
    actions.setData(state.mdKey, { result: view.result })
  }
  
  return (
    <QuickView {...state} />
  )
}