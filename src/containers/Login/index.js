import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'

import { Login } from './Login';

export default (props) => {
  const { data, actions } = useContext(AppStore);

  const [state] = useState({
    mdKey: "login",
    session: data.session
  })

  state.data = data[state.mdKey]
  state.user = data.session.user
  
  const userLog = async (loginData) => {
    let options = { 
      method: "POST", token: loginData.token, 
      data: [
        { keys: { 
          employee_id: loginData.employee.empnumber,
          logstate: "login"
        }}
      ] 
    }
    return await actions.requestData("/log", options)
  }
  
  const loginData = async (params) => {
    let lData = update({}, {$set: { 
      token: params.token, engine: params.engine }})
    let views = [
      { key: "employee",
        text: actions.getSql(params.engine, { 
          select: ["e.*", "ug.groupvalue as usergroupName", "dp.groupvalue as departmentName"], 
          from: "employee e",
          inner_join: ["groups ug", "on", ["e.usergroup", "=", "ug.id"]],
          left_join: ["groups dp", "on", ["e.department", "=", "dp.id"]], 
          where: ["username", "=", "?"] }),
        values: [data[state.mdKey].username] },
      { key: "menuCmds",
        text: actions.getSql(params.engine, { 
          select: ["*"], from: "ui_menu" }),
        values: [] },
      { key: "menuFields",
        text: actions.getSql(params.engine, { 
          select: ["mf.*", "ft.groupvalue as fieldtypeName"], 
          from: "ui_menufields mf",
          inner_join: ["groups ft", "on", ["mf.fieldtype", "=", "ft.id"]],
          order_by: ["menu_id", "orderby"] }),
        values: [] },
      { key: "userlogin",
        text: actions.getSql(params.engine, {
          select: ["value"], from: "fieldvalue",
          where: [["ref_id", "is", "null"], ["and", "fieldname", "=", "'log_login'"]]
        }),
        values: [] },
      { key: "groups",
        text: actions.getSql(params.engine, {
          select: ["*"], from: "groups",
          where: ["groupname", "in", [[], "'usergroup'", "'nervatype'", "'transtype'", "'inputfilter'",
            "'transfilter'", "'department'", "'logstate'", "'fieldtype'"]]
        }),
        values: [] }
    ]
    let options = { method: "POST", token: params.token, data: views }
    let view = await actions.requestData("/view", options)
    if(view.error){
      return view
    }

    lData = update(lData, {$merge: view})
    lData = update(lData, {$merge: {
      employee: lData.employee[0],
      userlogin: (lData.userlogin.length>0) ? lData.userlogin[0].value : "false"
    }})

    views = [
      { key: "audit",
        text: actions.getSql(params.engine, { 
          select: ["au.nervatype", "nt.groupvalue as nervatypeName", "au.subtype",
            "case when nt.groupvalue = 'trans' then st.groupvalue else m.menukey end as subtypeName",
            "au.inputfilter", "ip.groupvalue as inputfilterName", "au.supervisor"],
          from: "ui_audit au",
          inner_join: [
            ["groups nt", "on", ["au.nervatype", "=", "nt.id"]],
            ["groups ip", "on", ["au.inputfilter", "=", "ip.id"]]],
          left_join: [
            ["groups st", "on", ["au.subtype", "=", "st.id"]],
            ["ui_menu m", "on", ["au.subtype", "=", "m.id"]]],
          where: ["au.usergroup", "=", "?"] 
        }),
        values: [lData.employee.usergroup] },
      { key: "transfilter",
        text: actions.getSql(params.engine, {
          select: ["ref_id_2 as transfilter", "g.groupvalue as transfilterName"], 
          from: "link",
          inner_join: ["groups g", "on", ["link.ref_id_2", "=", "g.id"]],
          where: [["ref_id_1", "=", "?"], ["and", "link.deleted", "=", "0"],
          ["and", "nervatype_1", "in",
            [{
              select: ["id"], from: "groups",
              where: [["groupname", "=", "'nervatype'"], ["and", "groupvalue", "=", "'groups'"]]
            }]],
          ["and", "nervatype_2", "in",
            [{
              select: ["id"], from: "groups",
              where: [["groupname", "=", "'nervatype'"], ["and", "groupvalue", "=", "'groups'"]]
            }]]]
        }),
        values: [lData.employee.usergroup] 
      }
    ]

    options = { method: "POST", token: params.token, data: views }
    view = await actions.requestData("/view", options)
    if(view.error){
      return view
    }
    lData = update(lData, {$merge: {
      transfilter: (view.transfilter.length>0) ? view.transfilter[0].transfilter : null,
      audit: view.audit
    }})
    if(lData.transfilter === null){
      const transfilter = lData.groups.filter((group)=> {
        return ((group.groupname === "transfilter") && (group.groupvalue === "all"))
      })[0]
      lData = update(lData, {$merge: {
        transfilter: transfilter.id,
        transfilterName: "all"
      }})
    } else {
      lData = update(lData, {$merge: {
        transfilterName: view.transfilter[0].transfilterName
      }})
    }

    lData = update(lData, {$merge: {
      audit_filter: {trans:{}, menu:{}, report:{}},
      edit_new: [[],[],[],[]]
    }})
    const trans = [
      ["offer",0],["order",0],["worksheet",0],["rent",0],["invoice",0],["receipt",0],
      ["bank",1],["cash",1],
      ["delivery",2],["inventory",2],["waybill",2],["production",2],["formula",2]]
    trans.forEach((transtype) => {
      const audit = lData.audit.filter((item)=> {
        return ((item.nervatypeName === "trans") && (item.subtypeName === transtype[0]))
      })[0]
      lData = update(lData, { audit_filter: { trans: { $merge: {
        [transtype[0]]: (audit) ? 
          [audit.inputfilterName, audit.supervisor] : ["all",1]
      }}}})
      if (lData.audit_filter.trans[transtype[0]][0] !== "disabled"){
        lData = update(lData, { edit_new: {
          [transtype[1]]: {$push: [transtype[0]]}
        }})
      }
    });

    const nervatype = ["customer","product","employee","tool","project","setting","audit"]
    nervatype.forEach((ntype) => {
      const audit = lData.audit.filter((item)=> {
        return ((item.nervatypeName === ntype) && (item.subtypeName === null))
      })[0]
      lData = update(lData, { audit_filter: { $merge: {
        [ntype]: (audit) ? 
          [audit.inputfilterName, audit.supervisor] : ["all",1]
      }}})
      if (lData.audit_filter[ntype][0] !== "disabled" && 
        ntype !== "setting" && ntype !== "audit"){
          lData = update(lData, { edit_new: {
            3: {$push: [ntype]}
          }})
        }
    });

    return lData
  }

  state.login = async () => {
    const options = {
      method: "POST",
      data: update({}, { $set: data[state.mdKey] }) 
    }
    let result = await actions.requestData("/auth/login", options)
    if(result.token && result.engine ){
      if(!data.session.engines.includes(result.engine)){
        return actions.resultError({ error: { message: actions.getText("login_engine_err") } })
      }
      const lData = await loginData(result)
      if(lData.error){
        return actions.resultError(lData)
      }
      if (lData.userlogin === "t" || lData.userlogin === "true") {
        const log = await userLog(lData)
        if(log.error){
          return actions.resultError(log)
        }
      }

      //actions.setData("search", { filters: {}, columns: {}, result: [], view: null, vkey: null })
      //actions.setData("edit", { fdataset: {}, current: {}, dirty: false, form_dirty: false, history: [], selector: {} })
      //actions.setData("setting", { dirty: false, result: [] })
      actions.setData("current", { module: "search" })
      actions.setData(state.mdKey, { data: lData })
      localStorage.setItem("database", data[state.mdKey].database);
      localStorage.setItem("username", data[state.mdKey].username);

    } else {
      actions.resultError(result)
    }
  }

  return(
    <Login {...state} />
  )
}
