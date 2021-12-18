import { useContext } from 'react';
import update from 'immutability-helper';
import 'whatwg-fetch';
import { formatISO } from 'date-fns'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppStore from 'containers/App/context'
import InputBox from 'components/Modal/InputBox'
import { getText, getSetting } from 'config/app'

toast.configure({});

export const getSql = (engine, _sql) => {
  let prm_count = 0;
  const engine_type = (sql) => {
    switch (engine) {
      case "alasql":
        sql = sql.replace(/deleted/g, "[deleted]");
        sql = sql.replace(/{CCS}/g, "");
        sql = sql.replace(/{SEP}/g, "+");
        sql = sql.replace(/{CCE}/g, "");
        sql = sql.replace(/{CAS_TEXT}/g, "cast(");
        sql = sql.replace(/{CAE_TEXT}/g, " as nvarchar)");
        sql = sql.replace(/{CAS_INT}/g, "cast(");
        sql = sql.replace(/{CAE_INT}/g, " as int)");
        sql = sql.replace(/{CAS_FLOAT}/g, "cast(");
        sql = sql.replace(/{CAE_FLOAT}/g, " as real)");
        sql = sql.replace(/{CAS_DATE}/g, "cast(");
        sql = sql.replace(/{CASF_DATE}/g, "");
        sql = sql.replace(/{CAE_DATE}/g, " as date)");
        sql = sql.replace(/{CAEF_DATE}/g, "");
        sql = sql.replace(/{FMSF_NUMBER}/g, "");
        sql = sql.replace(/{FMSF_DATE}/g, "");
        sql = sql.replace(/{FMEF_CONVERT}/g, "");
        sql = sql.replace(/{FMS_FLOAT}/g, "format(cast(");
        sql = sql.replace(/{FME_FLOAT}/g, " as real), 'N2')");
        sql = sql.replace(/{FMS_INT}/g, "format(cast(");
        sql = sql.replace(/{FME_INT}/g, " as integer), 'N')");
        sql = sql.replace(/{FMS_DATE}/g, "convert(varchar(10),");
        sql = sql.replace(/{FME_DATE}/g, ", 120)");
        sql = sql.replace(/{FMS_DATETIME}/g, "convert(varchar(19),");
        sql = sql.replace(/{FME_DATETIME}/g, ", 120)");
        sql = sql.replace(/{FMS_TIME}/g, "SUBSTRING(cast(cast(");
        sql = sql.replace(/{FME_TIME}/g, " as time) as nvarchar),0,6)");
        sql = sql.replace(/{JOKER}/g, "'%'");
        sql = sql.replace(/{CUR_DATE}/g, "cast(GETDATE() as DATE)");
        break;
      case "sqlite":
      case "sqlite3":
        sql = sql.replace(/{CCS}/g, "");
        sql = sql.replace(/{SEP}/g, "||");
        sql = sql.replace(/{CCE}/g, "");
        sql = sql.replace(/{CAS_TEXT}/g, "cast(");
        sql = sql.replace(/{CAE_TEXT}/g, " as text)");
        sql = sql.replace(/{CAS_INT}/g, "cast("); //cast as integer - start
        sql = sql.replace(/{CAE_INT}/g, " as integer)"); //cast as integer - end
        sql = sql.replace(/{CAS_FLOAT}/g, "cast(");
        sql = sql.replace(/{CAE_FLOAT}/g, " as double)"); //" as real)");
        sql = sql.replace(/{CAS_DATE}/g, "");
        sql = sql.replace(/{CASF_DATE}/g, "");
        sql = sql.replace(/{CAE_DATE}/g, "");
        sql = sql.replace(/{CAEF_DATE}/g, "");
        sql = sql.replace(/{FMSF_NUMBER}/g, "");
        sql = sql.replace(/{FMSF_DATE}/g, "");
        sql = sql.replace(/{FMEF_CONVERT}/g, "");
        sql = sql.replace(/{FMS_FLOAT}/g, "");
        sql = sql.replace(/{FME_FLOAT}/g, "");
        sql = sql.replace(/{FMS_INT}/g, "");
        sql = sql.replace(/{FME_INT}/g, "");
        sql = sql.replace(/{FMS_DATE}/g, "substr("); //format to iso date - start
        sql = sql.replace(/{FME_DATE}/g, ",1,10)"); //format to iso date - end
        sql = sql.replace(/{FMS_DATETIME}/g, "substr("); //format to iso datetime - start
        sql = sql.replace(/{FME_DATETIME}/g, ",1,19)"); //format to iso datetime - end
        sql = sql.replace(/{FMS_TIME}/g, "substr(time(");
        sql = sql.replace(/{FME_TIME}/g, "),0,6)");
        sql = sql.replace(/{JOKER}/g, "'%'");
        sql = sql.replace(/{CUR_DATE}/g, "date('now')");
        break;
      case "google_sql":
      case "mysql":
        sql = sql.replace(/{CCS}/g, "concat(");
        sql = sql.replace(/{SEP}/g, ",");
        sql = sql.replace(/{CCE}/g, ")");
        sql = sql.replace(/{CAS_TEXT}/g, "cast(");
        sql = sql.replace(/{CAE_TEXT}/g, " as char)");
        sql = sql.replace(/{CAS_INT}/g, "cast("); //cast as integer - start
        sql = sql.replace(/{CAE_INT}/g, " as signed)"); //cast as integer - end
        sql = sql.replace(/{CAS_FLOAT}/g, "cast(");
        sql = sql.replace(/{CAE_FLOAT}/g, " as decimal)"); //" as decimal)");
        sql = sql.replace(/{CAS_DATE}/g, "cast(");
        sql = sql.replace(/{CASF_DATE}/g, "cast(");
        sql = sql.replace(/{CAE_DATE}/g, " as date)");
        sql = sql.replace(/{CAEF_DATE}/g, " as date)");
        sql = sql.replace(/{FMSF_NUMBER}/g, "");
        sql = sql.replace(/{FMSF_DATE}/g, "");
        sql = sql.replace(/{FMEF_CONVERT}/g, "");
        sql = sql.replace(/{FMS_FLOAT}/g, "replace(format(cast(");
        sql = sql.replace(/{FME_FLOAT}/g, " as decimal(10,2)),2),'.00','')");
        sql = sql.replace(/{FMS_INT}/g, "format(cast(");
        sql = sql.replace(/{FME_INT}/g, " as signed), 0)");
        sql = sql.replace(/{FMS_DATE}/g, "date_format(");
        sql = sql.replace(/{FME_DATE}/g, ", '%Y-%m-%d')");
        sql = sql.replace(/{FMS_DATETIME}/g, "date_format(");
        sql = sql.replace(/{FME_DATETIME}/g, ", '%Y-%m-%dT%H:%i:%s')");
        sql = sql.replace(/{FMS_TIME}/g, "cast(cast(");
        sql = sql.replace(/{FME_TIME}/g, " as time) as char)");
        sql = sql.replace(/{JOKER}/g, "'%'");
        sql = sql.replace(/{CUR_DATE}/g, "current_date");
        break;
      case "postgres":
        sql = sql.replace(/{CCS}/g, "");
        sql = sql.replace(/{SEP}/g, "||");
        sql = sql.replace(/{CCE}/g, "");
        sql = sql.replace(/{CAS_TEXT}/g, "cast(");
        sql = sql.replace(/{CAE_TEXT}/g, " as text)");
        sql = sql.replace(/{CAS_INT}/g, "cast("); //cast as integer - start
        sql = sql.replace(/{CAE_INT}/g, " as integer)"); //cast as integer - end
        sql = sql.replace(/{CAS_FLOAT}/g, "cast(");
        sql = sql.replace(/{CAE_FLOAT}/g, " as float)");
        sql = sql.replace(/{CAS_DATE}/g, "cast(");
        sql = sql.replace(/{CASF_DATE}/g, "cast(");
        sql = sql.replace(/{CAE_DATE}/g, " as date)");
        sql = sql.replace(/{CAEF_DATE}/g, " as date)");
        sql = sql.replace(
          /{FMSF_NUMBER}/g,
          "case when rf_number.fieldname is null then 0 else "
        );
        sql = sql.replace(
          /{FMSF_DATE}/g,
          "case when rf_date.fieldname is null then current_date else "
        );
        sql = sql.replace(/{FMEF_CONVERT}/g, " end ");
        sql = sql.replace(/{FMS_FLOAT}/g, "replace(to_char(cast(");
        sql = sql.replace(
          /{FME_FLOAT}/g,
          " as float),'999,999,990.00'),'.00','')"
        );
        sql = sql.replace(/{FMS_INT}/g, "to_char(cast(");
        sql = sql.replace(/{FME_INT}/g, " as integer), '999,999,999')");
        sql = sql.replace(/{FMS_DATE}/g, "to_char(");
        sql = sql.replace(/{FME_DATE}/g, ", 'YYYY-MM-DD')");
        sql = sql.replace(/{FMS_DATETIME}/g, "to_char(");
        sql = sql.replace(/{FME_DATETIME}/g, ", 'YYYY-MM-DD\"T\"HH24:MI:SS')");
        sql = sql.replace(/{FMS_TIME}/g, "substr(cast(cast(");
        sql = sql.replace(/{FME_TIME}/g, " as time) as text), 0, 6)");
        sql = sql.replace(/{JOKER}/g, "chr(37)");
        sql = sql.replace(/{CUR_DATE}/g, "current_date");
        break;
      case "mssql":
        sql = sql.replace(/{CCS}/g, "");
        sql = sql.replace(/{SEP}/g, "+");
        sql = sql.replace(/{CCE}/g, "");
        sql = sql.replace(/{CAS_TEXT}/g, "cast(");
        sql = sql.replace(/{CAE_TEXT}/g, " as nvarchar)");
        sql = sql.replace(/{CAS_INT}/g, "cast(");
        sql = sql.replace(/{CAE_INT}/g, " as int)");
        sql = sql.replace(/{CAS_FLOAT}/g, "cast(");
        sql = sql.replace(/{CAE_FLOAT}/g, " as real)");
        sql = sql.replace(/{CAS_DATE}/g, "cast(");
        sql = sql.replace(/{CASF_DATE}/g, "");
        sql = sql.replace(/{CAE_DATE}/g, " as date)");
        sql = sql.replace(/{CAEF_DATE}/g, "");
        sql = sql.replace(/{FMSF_NUMBER}/g, "");
        sql = sql.replace(/{FMSF_DATE}/g, "");
        sql = sql.replace(/{FMEF_CONVERT}/g, "");
        sql = sql.replace(/{FMS_FLOAT}/g, "replace(convert(varchar,cast("); // mssql 2012+ format(???,'N2')
        sql = sql.replace(/{FME_FLOAT}/g, " as money),1),'.00','')");
        sql = sql.replace(/{FMS_INT}/g, "replace(convert(varchar,cast(");
        sql = sql.replace(/{FME_INT}/g, " as money),1), '.00','')");
        sql = sql.replace(/{FMS_DATE}/g, "convert(varchar(10),");
        sql = sql.replace(/{FME_DATE}/g, ", 120)");
        sql = sql.replace(/{FMS_DATETIME}/g, "convert(varchar(19),");
        sql = sql.replace(/{FME_DATETIME}/g, ", 120)");
        sql = sql.replace(/{FMS_TIME}/g, "SUBSTRING(cast(cast(");
        sql = sql.replace(/{FME_TIME}/g, " as time) as nvarchar),0,6)");
        sql = sql.replace(/{JOKER}/g, "'%'");
        sql = sql.replace(/{CUR_DATE}/g, "cast(GETDATE() as DATE)");
        break;
      default:
        break;
    }
    return sql;
  };

  const sql_decode = (data, key) => {
    let sql = "";
    if (Array.isArray(data)) {
      let sep = " ",
        start_br = "",
        end_br = "";
      if (data.length > 0) {
        if (
          key === "select" ||
          key === "select_distinct" ||
          key === "union_select" ||
          key === "order_by" ||
          key === "group_by" ||
          data[0].length === 0
        ) {
          sep = ", ";
        }
      }
      data.forEach((element) => {
        if (typeof element === "undefined" || element === null) {
          element = "null";
        }
        if (element.length === 0) {
          if (key !== "set") {
            start_br = "(";
            end_br = ")";
          }
        } else if (
          data.length === 2 &&
          (element === "and" || element === "or")
        ) {
          sql += element + " (";
          end_br = ")";
        } else if (key && data.length === 1 && typeof data[0] === "object") {
          sql += " (" + sql_decode(element, key) + ")";
        } else {
          sql += sep + sql_decode(element, key);
        }
      });
      if (sep === ", ") {
        sql = sql.substr(2);
      }
      if (key && data.includes("on")) {
        sql = key.replace("_", " ") + sql;
      }
      return start_br + sql.toString().trim() + end_br;
    } else if (typeof data === "object") {
      for (let _key in data) {
        if (data.hasOwnProperty(_key)) {
          if (_key === "inner_join" || _key === "left_join") {
            sql += " " + sql_decode(data[_key], _key);
          } else {
            sql +=
              " " + _key.replace("_", " ") + " " + sql_decode(data[_key], _key);
          }
        }
      }
      return sql;
    } else {
      if (data.includes("?") && key !== "select") {
        prm_count += 1;
        if(engine === "postgres"){
          data = data.replace("?","$" + prm_count);
        }
      }
      return data;
    }
  };

  if (typeof _sql === "string") {
    return {sql: engine_type(_sql), prmCount: prm_count};
  } else {
    return {sql: engine_type(sql_decode(_sql)), prmCount: prm_count};
  }
};

export const saveToDisk = (fileUrl, fileName) => {
  const element = document.createElement("a")
  element.href = fileUrl
  element.download = fileName || fileUrl
  document.body.appendChild(element) // Required for this to work in FireFox
  element.click()
}

export const guid = () => {
  const _p8 = (s) => {
    let p = (Math.random().toString(16)+"000000000").substr(2,8);
    return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

export const request = (url, options) => {
  const parseJSON = (response) => {
    if (response.status === 401)
      return { code: 401, message: "Unauthorized" }
    if (response.status === 400)
      return response.json()
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    switch (response.headers.get('content-type').split(";")[0]) {
      case "application/pdf":
      case "application/xml":
      case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
        return response.blob()

      case "application/json":
        return response.json()
      
      case "text/plain":
      case "text/csv":
        return response.text()
    
      default:
        return response
    }
  }

  const checkStatus = (response) => {
    if ((response.status >= 200 && response.status < 300) || (response.status === 400) || (response.status === 401)) {
      return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
  }

  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON);
}

export const useApp = () => {
  const { data, setData } = useContext(AppStore)

  const getLangText = (key, defValue) => {
    return getText({ 
      locales: data.session.locales,
      lang: data.current.lang, 
      key: key, defaultValue: defValue 
    })
  }

  const showToast = (params) => {
    const autoClose = (params.autoClose === false) ? false : getSetting("toastTime")
    switch (params.type) {
      case "error":
        toast.error(params.message, {
          theme: "colored",
          autoClose: autoClose,
        });
        break;
      
      case "warning":
        toast.warning(params.message, {
          theme: "colored",
          autoClose: autoClose,
        });
        break;
      
      case "success":
        toast.success(params.message, {
          theme: "colored",
          autoClose: autoClose,
        });
        break;
      
      case "info":
        toast.info(params.message, {
          theme: "colored",
          autoClose: autoClose,
        });
        break;
    
      default:
        toast(params.message, { autoClose: autoClose })
        break;
    }
  }

  const resultError = (result) => {
    if(result.error){
      setData("error", result.error )
    }
    if(result.error && result.error.message){
      showToast({ type: "error", message: result.error.message })
    } else {
      showToast({ type: "error", 
        message: getLangText("error_internal", "Internal Server Error") })
    }
  }

  const signOut = () => {
    setData("login", { data: null, token: null })
  }

  const requestData = async (path, options, silent) => {
    try {
      if (!silent){
        setData("current", { "request": true })
      }
      let url = (data.session.configServer)?
        data.session.proxy+data.session.apiPath+path : data.login.server+path
      const token = (data.login.data) ? data.login.data.token : options.token || ""
      if (!options.headers)
        options = update(options, {$merge: { headers: {} }})
      options = update(options, { 
        headers: {$merge: { "Content-Type": "application/json" }}
      })
      if(token !== ""){
        options = update(options, { 
          headers: {$merge: { "Authorization": "Bearer "+token }} 
        })
      }
      if (options.data){
        options = update(options, { 
          body: {$set: JSON.stringify(options.data)}
        })
      }
      if(options.query){
        let query = new URLSearchParams();
        for (const key in options.query) {
          query.append(key, options.query[key])
        }
        url += "?" + query.toString()
      }
      
      const result = await request(url, options)
      if (!silent) {
        setData("current", { "request": false })
      }
      if(result && result.code){
        if(result.code === 401){
          signOut()
        }
        return { error: { message: result.message }, data: null }
      }
      return result
    } catch (err) {
      if(!silent)
        setData("current", { "request": false })
      return { error: { message: err.message }, data: null }
    }
  }

  const getSideBar = (value) => {
    if(!value){
      switch (data.current.side) {
        case "auto":
          value = "show"
          break;
        case "show":
          value = "hide"
          break;
        case "hide":
          value = "show"
          break;
        default:
          break;}}
    if(data.current.side !== value){
      return value
    }
  }

  const getAuditFilter = (nervatype, transtype) => {
    let retvalue = ["all",1]; let audit;
    switch (nervatype) {
      case "trans":
      case "menu":
        audit = data.login.data.audit.filter((audit)=> {
          return ((audit.nervatypeName === nervatype) && (audit.subtypeName === transtype))
        })[0]
        break;
      case "report":
        audit = data.login.data.audit.filter((audit)=> {
          return ((audit.nervatypeName === nervatype) && (audit.subtype === transtype))
        })[0]
        break;
      default:
        audit = data.login.data.audit.filter((audit)=> {
          return (audit.nervatypeName === nervatype)
        })[0]
    }
    if (typeof audit !== "undefined") {
      retvalue = [audit.inputfilterName, audit.supervisor];}
    return retvalue;
  }

  const createHistory = async (ctype) => {
    let history = update({}, {$set: {
      datetime: formatISO(new Date()),
      type: ctype, 
      type_title: getLangText["label_"+ctype],
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
    if (bookmark.history) {
      userconfig = update(bookmark.history, {$merge: {
        cfgroup: formatISO(new Date())
      }})
      let history_values = JSON.parse(userconfig.cfvalue);
      history_values.unshift(history)
      if (history_values.length > parseInt(getSetting("history"),10)) {
        history_values = history_values.slice(0, parseInt(getSetting("history"),10))
      }
      userconfig = update(userconfig, {$merge: {
        cfname: history_values.length,
        cfvalue: JSON.stringify(history_values)
      }})
    } else {
      userconfig = update(userconfig, {$merge: {
        employee_id: data.login.data.employee.id,
        section: "history",
        cfgroup: formatISO(new Date()),
        cfname: 1,
        cfvalue: JSON.stringify([history])
      }})
    }
    const options = { method: "POST", data: [userconfig] }
    const result = await requestData("/ui_userconfig", options)
    if(result.error){
      return resultError(result)
    }
    setData("bookmark", { history: userconfig})
  }

  const loadBookmark = async (params) => {
    const result = await requestData("/ui_userconfig", {
      token: params.token,
      query: {
        filter: "employee_id;==;"+params.user_id
      }
    })
    if(result.error){
      resultError(result)
      return null
    }
    setData("bookmark", { 
      bookmark: result.filter(item => (item.section === "bookmark")),
      history: result.filter(item => (item.section === "history"))[0]||null
    }, ()=>{
      if(params.callback){
        params.callback()
      }
    })
  }

  const saveBookmark = (params) => {
    setData("current", { modalForm: 
      <InputBox 
        title={getLangText("msg_bookmark_new")}
        message={getLangText("msg_bookmark_name")}
        value={(params[0] === "browser") ? params[1] : data.edit.current.item[params[2]]}
        showValue={true}
        labelOK={getLangText("msg_ok")}
        labelCancel={getLangText("msg_cancel")}
        onCancel={() => {
          setData("current", { modalForm: null })
        }}
        onOK={(value) => {
          setData("current", { modalForm: null }, async () => {
            if (value !== "") {
              let userconfig = {
                employee_id: data.login.data.employee.id,
                section: "bookmark",
                cfgroup: params[0],
              }
              if((params[0]) === "browser"){
                userconfig = update(userconfig, {$merge: {
                  cfname: value,
                  cfvalue: JSON.stringify({
                    date: formatISO(new Date(), { representation: 'date' }),
                    vkey: data.search.vkey,
                    view: data.search.view,
                    filters: data.search.filters[data.search.view],
                    columns: data.search.columns[data.search.view]
                  })
                }})
              } else {
                userconfig = update(userconfig, {$merge: {
                  cfname: value,
                  cfvalue: JSON.stringify({
                    date: formatISO(new Date(), { representation: 'date' }),
                    ntype: data.edit.current.type,
                    transtype: data.edit.current.transtype,
                    id: data.edit.current.item.id,
                    info: (data.edit.current.type === "trans") 
                      ? (data.edit.dataset.trans[0].custname !== null) 
                        ? data.edit.dataset.trans[0].custname 
                        : data.edit.current.item.transdate 
                      : data.edit.current.item[params[3]]
                  })
                }})
              }
  
              const options = { method: "POST", data: [userconfig] }
              const result = await requestData("/ui_userconfig", options)
              if(result.error){
                return resultError(result)
              }
              loadBookmark({user_id: data.login.data.employee.id})
            }
          })
        }}
      /> 
    })
  }

  const showHelp = (key) => {
    const element = document.createElement("a")
    element.setAttribute("href", data.session.helpPage+key)
    element.setAttribute("target", "_blank")
    document.body.appendChild(element)
    element.click()
  }

  return {
    getText: getLangText,
    getAuditFilter: getAuditFilter,
    showToast: showToast,
    resultError: resultError,
    requestData: requestData,
    signOut: signOut,
    getSideBar: getSideBar,
    createHistory: createHistory,
    loadBookmark: loadBookmark,
    saveBookmark: saveBookmark,
    showHelp: showHelp
  }
}