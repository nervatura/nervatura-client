import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { getSql, useApp } from 'containers/App/actions'

import { Login } from './Login';

// eslint-disable-next-line import/no-anonymous-default-export
export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()

  const [state] = useState({
    session: data.session
  })

  state.data = data.login
  state.user = data.session.user
  state.theme = data.current.theme
  
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
    return await app.requestData("/log", options)
  }
  
  const loginData = async (params) => {
    let lData = update({}, {$set: { 
      token: params.token, engine: params.engine }})
    let views = [
      { key: "employee",
        text: getSql(params.engine, { 
          select: ["e.*", "ug.groupvalue as usergroupName", "dp.groupvalue as departmentName"], 
          from: "employee e",
          inner_join: ["groups ug", "on", ["e.usergroup", "=", "ug.id"]],
          left_join: ["groups dp", "on", ["e.department", "=", "dp.id"]], 
          where: ["username", "=", "?"] }).sql,
        values: [state.data.username] },
      { key: "menuCmds",
        text: getSql(params.engine, { 
          select: ["*"], from: "ui_menu" }).sql,
        values: [] },
      { key: "menuFields",
        text: getSql(params.engine, { 
          select: ["mf.*", "ft.groupvalue as fieldtypeName"], 
          from: "ui_menufields mf",
          inner_join: ["groups ft", "on", ["mf.fieldtype", "=", "ft.id"]],
          order_by: ["menu_id", "orderby"] }).sql,
        values: [] },
      { key: "userlogin",
        text: getSql(params.engine, {
          select: ["value"], from: "fieldvalue",
          where: [["ref_id", "is", "null"], ["and", "fieldname", "=", "'log_login'"]]
        }).sql,
        values: [] },
      { key: "groups",
        text: getSql(params.engine, {
          select: ["*"], from: "groups",
          where: ["groupname", "in", [[], "'usergroup'", "'nervatype'", "'transtype'", "'inputfilter'",
            "'transfilter'", "'department'", "'logstate'", "'fieldtype'"]]
        }).sql,
        values: [] }
    ]
    let options = { method: "POST", token: params.token, data: views }
    let view = await app.requestData("/view", options)
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
        text: getSql(params.engine, { 
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
        }).sql,
        values: [lData.employee.usergroup] },
      { key: "transfilter",
        text: getSql(params.engine, {
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
        }).sql,
        values: [lData.employee.usergroup] 
      }
    ]

    options = { method: "POST", token: params.token, data: views }
    view = await app.requestData("/view", options)
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
      data: {
        username: state.data.username, password: state.data.password,
        database: state.data.database
      }
    }
    let result = await app.requestData("/auth/login", options)
    if(result.token && result.engine ){
      if(!data.session.engines.includes(result.engine)){
        return app.resultError({ error: { message: app.getText("login_engine_err") } })
      }
      const lData = await loginData(result)
      if(lData.error){
        return app.resultError(lData)
      }
      if (lData.userlogin === "t" || lData.userlogin === "true") {
        const log = await userLog(lData)
        if(log.error){
          return app.resultError(log)
        }
      }

      //setData("search", { filters: {}, columns: {}, result: [], view: null, vkey: null })
      //setData("edit", { fdataset: {}, current: {}, dirty: false, form_dirty: false, history: [], selector: {} })
      //setData("setting", { dirty: false, result: [] })
      setData("current", { module: "search" })
      setData("login", { data: lData })
      localStorage.setItem("database", state.data.database);
      localStorage.setItem("username", state.data.username);
      localStorage.setItem("server", state.data.server);
      app.loadBookmark({ user_id: lData.employee.id, token: result.token })

    } else {
      app.resultError(result)
    }
  }

  state.setTheme = () => {
    const theme = (state.theme === "light") ? "dark" : "light"
    setData("current", { theme: theme })
    localStorage.setItem("theme", theme);
  }

  return(
    <Login {...state} />
  )
}
