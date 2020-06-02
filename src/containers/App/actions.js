import React, { useContext } from 'react';
import update from 'immutability-helper';
import { formatISO, addDays } from 'date-fns'
import 'whatwg-fetch';

import { toast, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Toast from 'components/Toast'

import AppStore from 'containers/App/context'

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
        sql = sql.replace(/{FMS_DATETIME}/g, "convert(varchar(16),");
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
        sql = sql.replace(/{FMS_DATE}/g, "date("); //format to iso date - start
        sql = sql.replace(/{FME_DATE}/g, ")"); //format to iso date - end
        sql = sql.replace(/{FMS_DATETIME}/g, "substr(datetime("); //format to iso datetime - start
        sql = sql.replace(/{FME_DATETIME}/g, "),1,16)"); //format to iso datetime - end
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
        sql = sql.replace(/{FME_DATETIME}/g, ", '%Y-%m-%d %H:%i')");
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
        sql = sql.replace(/{FME_DATETIME}/g, ", 'YYYY-MM-DD HH24:MI')");
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
        sql = sql.replace(/{FMS_DATETIME}/g, "convert(varchar(16),");
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
      if (key && data.indexOf("on") > -1) {
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
      if (data.indexOf("?")>-1 && key !== "select") {
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

const request = (url, options) => {
  const parseJSON = (response) => {
    if (response.status === 401)
      return { code: 401, message: "Unauthorized" }
    if (response.status === 400)
      return { code: 400, message: response.statusText }
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
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

  const getText = (key, defValue) => {
    const locales = data.session.locales
    const lang = data.current.lang
    if (locales[lang] && locales[lang][key]) {
      return locales[lang][key];
    }
    return defValue || locales["en"][key] || ""
  }

  const initItem = (params) => {
    const dataset = params.dataset || data.edit.dataset
    switch (params.tablename) {
      case "address":
        return update({}, {$merge: {
          id:null, 
          nervatype: data.login.data.groups.filter((group)=> {
            return ((group.groupname === "nervatype") && (group.groupvalue === data.edit.current.type))
          })[0].id, 
          ref_id: data.edit.current.item.id, 
          country: null, state: null, zipcode: null, city: null, street: null, notes: null, deleted: 0
        }})
          
      case "audit":
        //ui_audit
        return update({}, {$merge: {
          id: null, usergroup: null, nervatype: null, subtype: null, inputfilter: null, supervisor: 1
        }})
        
      case "barcode":
        return update({}, {$merge: {
          id: null, code: null, product_id: data.edit.current.item.id, description: null,
          barcodetype: dataset.barcodetype.filter((group)=> {
            return ((group.groupname === "barcodetype") && (group.groupvalue === "CODE_39"))
          })[0].id, 
          qty: 0, defcode: 0
        }})
      
      case "contact":
        return update({}, {$merge: {
          id: null,
          nervatype: data.login.data.groups.filter((group)=> {
            return ((group.groupname === "nervatype") && (group.groupvalue === data.edit.current.type))
          })[0].id, 
          ref_id: data.edit.current.item.id, 
          firstname: null, surname: null, status: null, 
          phone: null, fax: null, mobil: null, email: null, notes: null, deleted: 0
        }})  
         
      case "currency":
        return update({}, {$merge: {
          id: null, curr: null, description: null, digit: 0, defrate: 0, cround: 0
        }})
          
      case "customer":
        if (typeof dataset.custtype !== "undefined") {
          return update({}, {$merge: {
            id: null,
            custtype: dataset.custtype.filter((group)=> {
              return (group.groupvalue === "company")
            })[0].id,  
            custnumber: null, custname: null, taxnumber: null, account: null,
            notax: 0, terms: 0, creditlimit: 0, discount: 0, notes: null, inactive: 0, deleted: 0
          }})
        }  
        return null;
          
      case "deffield":
        return update({}, {$merge: {
          id: null, fieldname: guid(), 
          nervatype: null, subtype: null, fieldtype: null, description: null,
          valuelist:null, addnew: 0, visible: 1, readonly: 0, deleted: 0
        }})
        
      case "employee":
        if(dataset.usergroup){
          return update({}, {$merge: {
            id: null,
            empnumber: null, username: null,
            usergroup: dataset.usergroup.filter((group)=> {
              return (group.groupvalue === "admin")
            })[0].id, 
            startdate: formatISO(new Date(), { representation: 'date' }), 
            enddate: null, department: null,
            password: null, registration_key: null, inactive: 0, deleted: 0
          }})  
        }
        return null
        
      case "event":
        let event = update({}, {$merge: {
          id: null, calnumber: null, 
          nervatype: null, ref_id: null, 
          uid: null, eventgroup: null, fromdate: null, todate: null, subject: null, 
          place: null, description: null, deleted: 0
        }})
        if (typeof data.edit.current.item !== "undefined") {
          if (data.edit.current.type === "event") {
            event = update({}, {$merge: {
              nervatype: data.edit.current.item.nervatype,
              ref_id: data.edit.current.item.ref_id
            }})  
          } else {
            event = update({}, {$merge: {
              nervatype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === data.edit.current.type))
              })[0].id,
              ref_id: data.edit.current.item.id
            }})
          }
        }
        return event;
      
      case "fieldvalue":
        let fieldvalue = update({}, {$merge: {
          id: null, fieldname: null, ref_id: null, value: null, notes: null, deleted: 0
        }})
        if (typeof data.edit.current.item !== "undefined") {
          fieldvalue = update({}, {$merge: {
            ref_id: data.edit.current.item.id
          }})
        }
        return fieldvalue;
      
      case "groups":
        return update({}, {$merge: {
          id: null, groupname: null, groupvalue: null, description: null, 
          inactive: 0, deleted: 0
        }})
      
      case "usergroup":
        //groups
        return update({}, {$merge: {
          id: null, groupname: "usergroup", groupvalue: null, description: null, 
          transfilter: null, inactive: 0, deleted: 0
        }})
        
      case "item":
        return update({}, {$merge: {
          id: null, 
          trans_id: data.edit.current.item.id, 
          product_id: null, unit: null, qty: 0, 
          fxprice: 0, netamount: 0, discount: 0, tax_id: null, 
          vatamount: 0, amount: 0, description: null, deposit: 0, 
          ownstock: 0, actionprice: 0, deleted: 0
        }})
        
      case "link":
        let link = update({}, {$merge: { 
          id: null, nervatype_1: null, ref_id_1: null, nervatype_2: null, 
          ref_id_2: null, deleted: 0
        }})
        switch (data.edit.current.form_type) {
          case "invoice_link":
            link = update({}, {$merge: {
              nervatype_1: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "payment"))
              })[0].id,
              nervatype_2: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "trans"))
              })[0].id,
              ref_id_2: data.edit.current.item.id
            }})
            break;
          case "payment_link":
            link = update({}, {$merge: {
              nervatype_1: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "payment"))
              })[0].id,
              nervatype_2: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "trans"))
              })[0].id
            }})
            break;
          default:
        }
        return link;
      
      case "log":
        return update({}, {$merge: {
          id: null,
          fromdate: formatISO(new Date(), { representation: 'date' }), 
          todate: "", empnumber: "", logstate: "update", nervatype: ""
        }})
      
      case "ui_menu":
        return update({}, {$merge: {
          id: null, menukey: null, description: null, modul: null, icon: null, 
          funcname: null, url: 0, address: null
        }})
      
      case "ui_menufields":
        return update({}, {$merge: {
          id: null, menu_id: null, fieldname: null, description: null, 
          fieldtype: null, orderby: 0
        }})
          
      case "movement":
        let movement = update({}, {$merge: {
          id: null, trans_id: data.edit.current.item.id, 
          shippingdate: null, movetype: null, product_id: null,
          tool_id: null, qty: 0, place_id: null, shared: 0, notes: null, deleted: 0
        }})
        switch (data.edit.current.transtype) {
          case "delivery":
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: data.edit.current.item.transdate+" 00:00:00"
            }})
            if (dataset.movement_transfer.length > 0){
              movement = update({}, {$merge: {
                place_id: dataset.movement_transfer[0].place_id
              }})
            }
            break;
          case "inventory":
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: data.edit.current.item.transdate+" 00:00:00",
              place_id: data.edit.current.item.place_id
            }})
            break;
          case "production":
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: data.edit.current.item.duedate
            }})
            break;
          case "formula":
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "plan"))
              })[0].id,
              shippingdate: data.edit.current.item.transdate+" 00:00:00"
            }})
            break;
          case "waybill":
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "tool"))
              })[0].id,
              shippingdate: data.edit.current.item.transdate+" 00:00:00"
            }})
            break;
          default:
            movement = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id
            }})
        }
        return movement;
      
      case "movement_head":
        //movement
        let movement_head = update({}, {$merge: {
          id: null, trans_id: data.edit.current.item.id, 
          shippingdate: null, product_id: null, product: "", movetype: null, 
          tool_id: null, qty: 0, place_id: null, shared: 0, notes: null, deleted: 0
        }})
        switch (data.edit.current.transtype) {
          case "formula":
            movement_head = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "head"))
              })[0].id
            }})
            break;
          case "production":
            movement_head = update({}, {$merge: {
              movetype: data.login.data.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shared: 1
            }})
            break;
          default:
        }
        return movement_head;
          
      case "numberdef":
        return update({}, {$merge: {
          id: null,
          numberkey: null, prefix: null, curvalue: 0, isyear: 1, sep: "/",
          len: 5, description: null, visible: 0, readonly: 0, orderby: 0
        }})
        
      case "pattern":
        return update({}, {$merge: {
          id: null,
          transtype: data.edit.current.item.transtype,
          description: null, notes: "", defpattern: 0, deleted: 0
        }})
          
      case "payment":
        return update({}, {$merge: {
          id: null,
          trans_id: data.edit.current.item.id, 
          paiddate: data.edit.current.item.transdate, amount: 0, notes: null, deleted: 0
        }})
      
      case "place":
        return update({}, {$merge: {
          id: null,
          planumber: null, placetype:null, description: null,
          curr: null, defplace: 0, notes: null, inactive: 0, deleted: 0
        }})
        
      case "price":
      case "discount":
        let price =  update({}, {$merge: {
          id: null, product_id: data.edit.current.item.id,
          validfrom: formatISO(new Date(), { representation: 'date' }), 
          validto: null, curr: null, qty: 0,
          pricevalue: 0, discount: null,
          calcmode: data.login.data.groups.filter((group)=> {
            return ((group.groupname === "calcmode") && (group.groupvalue === "amo"))
          })[0].id, 
          vendorprice: 0, deleted: 0
        }})
        if (params.tablename === "discount") {
          price =  update({}, {$merge: {
            discount: 0
          }})
        }
        let default_currency = dataset.settings.filter((group)=> {
          return (group.fieldname === "default_currency")
        })[0]
        if (typeof default_currency !== "undefined") {
          price =  update({}, {$merge: {
            curr: default_currency.value
          }})
        }
        return price;
        
      case "product":
        if(dataset.protype){
          let product = update({}, {$merge: {
            id: null,
            protype: dataset.protype.filter((group)=> {
              return (group.groupvalue === "item")
            })[0].id,
            partnumber: null, description: null, unit: null,
            tax_id: null, notes: null, inactive: 0, webitem: 0, deleted: 0
          }})
          let default_unit = dataset.settings.filter((group)=> {
            return (group.fieldname === "default_unit")
          })[0]
          if (typeof default_unit !== "undefined") {
            product = update({}, {$merge: {
              unit: default_unit.value
            }})
          }
          let default_taxcode = dataset.settings.filter((group)=> {
            return (group.fieldname === "default_taxcode")
          })[0]
          if (typeof default_taxcode !== "undefined") {
            product = update({}, {$merge: {
              tax_id: dataset.tax.filter((tax)=> {
                return (tax.taxcode === default_taxcode.value)
              })[0].id
            }})
          } else {
            product = update({}, {$merge: {
              tax_id: dataset.tax.filter((tax)=> {
                return (tax.taxcode === "0%")
              })[0].id
            }})
          }
          return product;
        }
        return null
      
      case "project":
        return update({}, {$merge: {
          id: null,
          pronumber: null, description: null, customer_id: null, startdate: null, 
          enddate:null, notes:null, inactive:0, deleted: 0
        }})
      
      case "printqueue":
        if (data.edit.current.type === "printqueue") {
          return update({}, {$merge: {
            id: null, 
            nervatype: data.edit.current.item.nervatype, 
            startdate: data.edit.current.item.startdate, 
            enddate: data.edit.current.item.enddate,
            transnumber: data.edit.current.item.transnumber, 
            username: data.edit.current.item.username, 
            server: data.edit.current.item.server, 
            mode: data.edit.current.item.mode,
            orientation: data.edit.current.item.orientation,
            size: data.edit.current.item.size
          }})
        }
        return update({}, {$merge: {
          id: null, nervatype: null, startdate: null, enddate: null,
          transnumber: null, username: null, server: null, mode: "pdf", 
          orientation: data.ui.page_orient, 
          size: data.ui.page_size
        }})
      
      case "rate":
        return update({}, {$merge: {
          id: null,
          ratetype: null, ratedate: formatISO(new Date(), { representation: 'date' }), 
          curr: null, place_id: null, rategroup: null, ratevalue: 0, deleted: 0
        }})
      
      case "refvalue":
        let refvalue = update({}, {$merge: {
          seltype: "transitem", ref_id: null, refnumber: "", transtype: ""
        }})
        if (data.edit.current.transtype === "waybill") {
          const base_trans = dataset.trans[0]
          if (base_trans.customer_id !== null) {
            refvalue = update({}, {$merge: {
              seltype: "customer",
              ref_id: base_trans.customer_id,
              refnumber: base_trans.custname
            }}) 
          } else if (base_trans.employee_id !== null) {
            refvalue = update({}, {$merge: {
              seltype: "employee",
              ref_id: base_trans.employee_id,
              refnumber: base_trans.empnumber
            }})
          } else {
            refvalue = update({}, {$merge: {
              seltype: "transitem",
            }})
            if (dataset.translink.length > 0) {
              refvalue = update({}, {$merge: {
                ref_id: dataset.translink[0].ref_id_2,
                transtype: dataset.translink[0].transtype,
                refnumber: dataset.translink[0].transnumber
              }})
            }
          }
        }
        return refvalue;
      
      case "report":
        //ui_report
        return update({}, {$merge: {
          id: null,
          reportkey: null, nervatype: null, transtype: null, direction: null, repname: null,
          description: null, label: null, filetype: null, report: null,
          orientation: data.ui.page_orient, size: data.ui.page_size
        }})
        
      case "tax":
        return update({}, {$merge: {
          id:null,
          taxcode: null, description: null, rate: 0, inactive: 0
        }})
      
      case "tool":
        return update({}, {$merge: {
          id: null,
          serial: null, description: null, product_id: null, 
          toolgroup: null, notes: null, inactive: 0, deleted: 0
        }})
       
      case "trans":
        const transtype = params.transtype || data.edit.current.transtype;
        if (typeof dataset.pattern !== "undefined") {
          let trans = update({}, {$merge: {
            id: null,
            movetype: data.login.data.groups.filter((group)=> {
              return ((group.groupname === "transtype") && (group.groupvalue === transtype))
            })[0].id,
            direction: data.login.data.groups.filter((group)=> {
              return ((group.groupname === "direction") && (group.groupvalue === "out"))
            })[0].id, 
            transnumber: null, ref_transnumber: null, 
            crdate: formatISO(new Date(), { representation: 'date' }), 
            transdate: formatISO(new Date(), { representation: 'date' }), 
            duedate: null,
            customer_id: null, employee_id: null, department: null, project_id: null,
            place_id: null, paidtype: null, curr: null, notax: 0, paid: 0, acrate: 0, 
            notes: null, intnotes: null, fnote: null,
            transtate: data.login.data.groups.filter((group)=> {
              return ((group.groupname === "transtate") && (group.groupvalue === "ok"))
            })[0].id,
            cruser_id: data.login.data.employee.id, closed: 0, deleted: 0
          }})
          let pattern = dataset.pattern.filter((pattern)=> {
            return (pattern.defpattern === 1)
          })[0]
          if (typeof pattern !== "undefined") {
            trans = update({}, {$merge: {
              fnote: pattern.notes
            }})
          }
          switch (transtype) {
            case "offer":
            case "order":
            case "worksheet":
            case "rent":
            case "invoice":
            case "receipt":
              trans = update({}, {$merge: {
                duedate: formatISO(new Date(), { representation: 'date' })+"T00:00:00"
              }})
              let default_currency = dataset.settings.filter((group)=> {
                return (group.fieldname === "default_currency")
              })[0]
              if (typeof default_currency !== "undefined") {
                trans = update({}, {$merge: {
                  curr: default_currency.value
                }})
              }
              let default_paidtype = dataset.settings.filter((group)=> {
                return (group.fieldname === "default_paidtype")
              })[0]
              if (typeof default_paidtype !== "undefined") {
                trans = update({}, {$merge: {
                  paidtype: dataset.paidtype.filter((group)=> {
                    return (group.groupvalue === default_paidtype.value)
                  })[0].id
                }})
              }
              break;
            case "bank":
            case "inventory":
            case "formula":
              trans = update({}, {$merge: {
                direction: data.login.data.groups.filter((group)=> {
                  return ((group.groupname === "direction") && (group.groupvalue === "transfer"))
                })[0].id
              }})
              break;
            case "production":
              trans = update({}, {$merge: {
                direction: data.login.data.groups.filter((group)=> {
                  return ((group.groupname === "direction") && (group.groupvalue === "transfer"))
                })[0].id,
                duedate: formatISO(new Date(), { representation: 'date' })+"T00:00:00"
              }})
              break;
            default:
              }
          if (transtype === "invoice") {
            let default_deadline = dataset.settings.filter((group)=> {
              return (group.fieldname === "default_deadline")
            })[0]
            if (typeof default_deadline !== "undefined") {
              trans = update({}, {$merge: {
                duedate: formatISO(addDays(new Date(), parseInt(default_deadline.item.value,10)), { representation: 'date' })+"T00:00:00"
              }})
            }
          }    
          return trans;}
        return null;
        
      default:
    }
    return false;
  }

  const showToast = (params) => {
    const autoClose = (params.autoClose === false) ? false : data.ui.toastTime
    const modal = (show)=>setData("current", { modal: show } )
    const toastId = params.key || params.type
    switch (params.type) {
      case "error":
        toast.error(
          <Toast icon="exclamation" message={params.message} />, { autoClose: autoClose })
        break;
      
      case "warning":
        toast.warning(
          <Toast icon="exclamation" message={params.message} />, { autoClose: autoClose })
        break;
      
      case "success":
        toast.success(
          <Toast icon="check" message={params.message} />, { autoClose: autoClose })
        break;
      
      case "info":
        toast.info(
          <Toast icon="info" message={params.message} />, { autoClose: autoClose })
        break;
      
      case "message":
        /* istanbul ignore next */
        if (!toast.isActive(toastId)) {
          toast(
            <Toast type="message" message={params.message} title={params.title} />, { 
              autoClose: autoClose, toastId: toastId,
              position: "top-right", closeButton: false, transition: Zoom })
        }
        break;

      case "input":
        /* istanbul ignore next */
        toast.dismiss()
        modal(true)
        toast(
          <Toast type="input" 
            message={params.message} infoText={params.infoText} title={params.title}
            value={params.value} defaultOK={params.defaultOK}
            labelCancel={params.labelCancel || getText("msg_cancel")}
            labelOK={params.labelOK || getText("msg_ok")}  
            cbCancel={()=>{ 
              toast.dismiss(toastId); modal(false);
              if(params.cbCancel){ params.cbCancel() } 
            }}
            cbOK={(value)=>{ 
              toast.dismiss(toastId); modal(false);
              if(params.cbOK){ params.cbOK(value) } 
            }} />, { 
            autoClose: false, className: "input-box", toastId: toastId,
            position: "top-center", draggable: false,
            closeButton: false, transition: Zoom, closeOnClick: false })
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
        message: getText("error_internal", "Internal Server Error") })
    }
  }

  const signOut = () => {
    setData("login", { data: null, token: null })
  }

  const requestData = async (path, options, silent) => {
    try {
      if (!silent)
        setData("current", { "request": true })
      let url = data.session.proxy+data.session.basePath+path
      const token = (data.login.data) ? data.login.data.token : options.token || ""
      if (!options.headers)
        options = update(options, {$merge: { headers: {} }})
      options = update(options, { 
        headers: {$merge: { "Content-Type": "application/json " }}
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
      if(result.code){
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

  const setSideBar = (value) => {
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
      setData("current", { side: value })
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

  return {
    getText: getText,
    getAuditFilter: getAuditFilter,
    initItem: initItem,
    showToast: showToast,
    resultError: resultError,
    requestData: requestData,
    signOut: signOut,
    setSideBar: setSideBar
  }
}