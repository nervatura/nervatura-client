import { useApp } from 'containers/App/actions'

export const useSql = () => {
  const app = useApp()
  return {    
    all: {
      deffield_prop: (nervatype) => {
        let _sql = [
          {select:["'customer' as ftype","c.id as id","c.custname as description"],
            from:"customer c", where:[["{CAS_TEXT}c.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'customer'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'tool' as ftype","t.id as id","t.serial as description"],
            from:"tool t", where:[["{CAS_TEXT}t.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'tool'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'trans' as ftype","t.id as id","t.transnumber as description"],
            from:"trans t", where:[["{CAS_TEXT}t.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'trans'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'transitem' as ftype","t.id as id","t.transnumber as description"],
            from:"trans t", where:[["{CAS_TEXT}t.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'transitem'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'transmovement' as ftype","t.id as id","t.transnumber as description"],
            from:"trans t", where:[["{CAS_TEXT}t.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'transmovement'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'transpayment' as ftype","t.id as id","t.transnumber as description"],
            from:"trans t", where:[["{CAS_TEXT}t.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'transpayment'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'product' as ftype","p.id as id","p.partnumber as description"],
            from:"product p", where:[["{CAS_TEXT}p.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'product'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'project' as ftype","p.id as id","p.pronumber as description"],
            from:"project p", where:[["{CAS_TEXT}p.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'project'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'employee' as ftype","e.id as id","e.empnumber as description"],
            from:"employee e", where:[["{CAS_TEXT}e.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'employee'"]]]],
              where:["fv.deleted","=","0"]}]]]},
          {union_select:["'place' as ftype","p.id as id","p.planumber as description"],
            from:"place p", where:[["{CAS_TEXT}p.id {CAE_TEXT}","in",[
              {select:["fv.value"], from:"deffield df",
              inner_join:[
                ["fieldvalue fv","on",[["df.fieldname","=","fv.fieldname"],["and","fv.ref_id","=","?"]]],
                ["groups nt","on",[["df.nervatype","=","nt.id"],["and","nt.groupvalue","=","'"+nervatype+"'"]]],
                ["groups ft","on",[["df.fieldtype","=","ft.id"],["and","ft.groupvalue","=","'place'"]]]],
              where:["fv.deleted","=","0"]}]]]}]
          return _sql;}
    },

    currency: {
      delete_state: () => {
        let _sql = {select:["sum(co) as sco"], from:[
          [[{select:["count(place.id) as co"], from:"place",
          inner_join:["currency","on",["place.curr","=","currency.curr"]],
          where:[["place.deleted","=","0"],["and","currency.id","=","?"]]},
          {union_select:["count(price.id) as co"], from:"price", 
          inner_join:["currency","on",["price.curr","=","currency.curr"]], 
          where:[["price.deleted","=","0"],["and","currency.id","=","?"]]}, 
          {union_select:["count(rate.id) as co"], from:"rate", 
          inner_join:["currency","on",["rate.curr","=","currency.curr"]],
          where:[["rate.deleted","=","0"],["and","currency.id","=","?"]]},
          {union_select:["count(trans.id) as co"], from:"trans",
          inner_join:["currency","on",["trans.curr","=","currency.curr"]],
          where:[["trans.deleted","=","0"],["and","currency.id","=","?"]]}]],"foo"]} 
        return _sql;},
          
      currency_view: () => {
        let _sql = {select:["*"], from:"currency"}; return _sql;}
      },

    customer: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"trans", where:["customer_id","=","?"]},
            {union_select:["count(*) as co"], from:"project", where:["customer_id","=","?"]},
            {union_select:["count(*) as co"], from:"event",
            inner_join:[["groups nt","on",["event.nervatype","=","nt.id"]],
              ["and","nt.groupvalue","=","'customer'"]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[
              {select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
                ["and","ref_id_2","=","?"]]}
          ]],"foo"]}
        return _sql;},
            
      address: () => {
        let _sql = {
          select:["*", 
            "{CCS} case when city is null then '' else city end{SEP} ' | '{SEP} case when street is null then '' else street end{CCE} as lslabel", 
            "{CCS}'"+app.getText("address_country")+": '{SEP} case when country is null then '' else country end{SEP} ' | '{SEP} '"+
            app.getText("address_zipcode")+": '{SEP}case when zipcode is null then '' else zipcode end {SEP} ' | '{SEP} '"+
            app.getText("address_state")+": '{SEP} case when state is null then '' else state end{CCE} as lsvalue", 
            "{CCS}'"+app.getText("address_notes")+": '{SEP} case when notes is null then '' else notes end{CCE} as lsinfo"], 
          from:"address", 
          where: [["deleted","=","0"], ["and","nervatype","=",[
            {select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
            ["and","ref_id","=","?"]]}; 
        return _sql;},
              
      contact: () => {
        let _sql = {
          select:["*",
            "{CCS} case when firstname is null then '' else {CCS} firstname{SEP}' '{CCE} end{SEP}case when surname is null then '' else surname end{SEP}' '{SEP} case when status is null then '' else {CCS}' | "+
            app.getText("contact_status")+": '{SEP}status{CCE} end{CCE} as lslabel",
            "{CCS}'"+app.getText("contact_phone")+": '{SEP}case when phone is null then '' else phone end {SEP}' | "+
              app.getText("contact_mobil")+": '{SEP}case when mobil is null then '' else mobil end {SEP}' | "+
              app.getText("contact_fax")+": '{SEP}case when fax is null then '' else fax end{CCE} as lsvalue", 
            "{CCS}'"+app.getText("contact_email")+": '{SEP}case when email is null then '' else email end {SEP}' | "+
            app.getText("contact_notes")+": '{SEP}case when notes is null then '' else notes end{CCE} as lsinfo"],
          from:"contact", 
          where: [["deleted","=","0"], ["and","nervatype","=",[
            {select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
            ["and","ref_id","=","?"]]}
          return _sql;},
              
      event: () => {
        let _sql = {
          select:["e.id","e.calnumber","{FMS_DATETIME}e.fromdate {FME_DATETIME} as fromdate",
            "eg.groupvalue as eventgroup", "e.subject", "e.deleted",
            "{CCS}case when e.fromdate is null then '' else {FMS_DATETIME}e.fromdate {FME_DATETIME} end"+
            "{SEP}' | '{SEP}case when e.subject is null then '' else e.subject end{CCE} as lslabel",
            "{CCS}e.calnumber{SEP}' | '{SEP}'"+app.getText("event_group")+
            ": '{SEP}case when eg.groupvalue is null then '' else eg.groupvalue end{CCE} as lsvalue"],
          from:"event e", 
          left_join:["groups eg","on",["e.eventgroup","=","eg.id"]], 
          where: [["e.deleted","=","0"], ["and","e.nervatype","=",[
            {select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
            ["and","e.ref_id","=","?"]]} 
        return _sql;},
    },
    
    deffield: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(fieldvalue.id) as co"], from:"fieldvalue",
            inner_join:["deffield","on",["deffield.fieldname","=","fieldvalue.fieldname"]],
            where:[["fieldvalue.deleted","=","0"],["and","deffield.id","=","?"]]}]],"foo"]};
        return _sql;},
          
      deffield_view: () => {
        let sql = {
          select:["df.*","df.description as lslabel","{CCS}ntype.groupvalue{SEP}' | '{SEP}ftype.groupvalue {CCE} as lsvalue"],
          from:"deffield df",
          inner_join:[
            ["groups ntype","on",["df.nervatype","=","ntype.id"]],
            ["groups ftype","on",[["df.fieldtype","=","ftype.id"],["and","ntype.groupvalue","in",
              [[],"'customer'","'employee'","'event'","'formula'","'place'","'product'",
                "'project'","'tool'","'trans'"]]]]],
          where:[["df.deleted","=","0"],["and","df.visible","=","1"]], 
          order_by:["df.description"]}; 
        return sql;}
      },
      
    employee: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"trans", where:["employee_id","=","?"]},
            {union_select:["count(*) as co"], from:"trans", where:["cruser_id","=","?"]},
            {union_select:["count(*) as co"], from:"log", where:["employee_id","=","?"]},
            {union_select:["count(*) as co"], from:"ui_printqueue", where:["employee_id","=","?"]},
            {union_select:["count(*) as co"], from:"ui_userconfig", where:["employee_id","=","?"]},
            {union_select:["count(*) as co"], from:"event",
            inner_join:[["groups nt","on",["event.nervatype","=","nt.id"]],["and","nt.groupvalue","=","'employee'"]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link", 
            where:[["nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'employee'"]]}]],
                ["and","ref_id_2","=","?"]]}]],"foo"]}
          return _sql;},
      
      employee: () => {
        let sql = {
          select:["*","{FMS_DATE}startdate {FME_DATE} as startdate",
            "{FMS_DATE}enddate {FME_DATE} as enddate"],
          from:"employee",
          where:[["deleted","=","0"],["and","id","=","?"]]}
        return sql;},
      
      address: () => {
        let sql = {
          select:["*", "{CCS}case when city is null then '' else city end{SEP} ' | '{SEP} "+
            "case when street is null then '' else street end{CCE} as lslabel",
            "{CCS}'"+app.getText("address_country")+": '{SEP} "+
            "case when country is null then '' else country end{SEP} ' | '{SEP} "+
            "'"+app.getText("address_zipcode")+": '{SEP}case when zipcode is null then '' else zipcode end "+
            "{SEP} ' | '{SEP} '"+app.getText("address_state")+": '{SEP} "+
            "case when state is null then '' else state end{CCE} as lsvalue",
            "{CCS}'"+app.getText("address_notes")+": '{SEP} "+
            "case when notes is null then '' else notes end{CCE} as lsinfo"],
          from:"address", 
          where:[["deleted","=","0"],["and","nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'employee'"]]}]],
            ["and","ref_id","=","?"]]}; 
        return sql;},
              
      contact: () => {
        let sql = {
          select:["*", "{CCS} case when firstname is null then '' else {CCS} firstname{SEP}' '{CCE} end{SEP}case when surname is null then '' else surname end{SEP}' '{SEP} "+
            "case when status is null then '' else {CCS}' | "+
            app.getText("contact_status")+": '{SEP}status{CCE} end{CCE} as lslabel",
            "{CCS}'"+app.getText("contact_phone")+": '{SEP}case when phone is null then '' else phone end "+
            "{SEP}' | "+app.getText("contact_mobil")+": '{SEP}case when mobil is null then '' else mobil end "+
            "{SEP}' | "+app.getText("contact_fax")+": '{SEP}case when fax is null then '' else fax end{CCE} as lsvalue",
            "{CCS}'"+app.getText("contact_email")+": '{SEP}case when email is null then '' else email end "+
            "{SEP}' | "+app.getText("contact_notes")+": '{SEP}case when notes is null then '' else notes end{CCE} as lsinfo"],
          from:"contact", 
          where:[["deleted","=","0"],["and","nervatype","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'employee'"]]}]],
            ["and","ref_id","=","?"]]}; 
          return sql;},
              
      event: () => {
        let sql = {
          select:["e.id","e.calnumber",
            "{FMS_DATETIME}e.fromdate {FME_DATETIME} as fromdate",
            "eg.groupvalue as eventgroup","e.subject","e.deleted",
            "{CCS}case when e.fromdate is null then '' else {FMS_DATETIME}e.fromdate {FME_DATETIME} end"+
            "{SEP} ' | '{SEP}case when e.subject is null then '' else e.subject end{CCE} as lslabel",
            "{CCS}e.calnumber{SEP}' | '{SEP}'"+app.getText("event_group")+": '{SEP}"+
            "case when eg.groupvalue is null then '' else eg.groupvalue end{CCE} as lsvalue"],
          from:"event e", 
          left_join:["groups eg","on",["e.eventgroup","=","eg.id"]],
          where:[["e.deleted","=","0"],["and","e.nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'employee'"]]}]],
            ["and","e.ref_id","=","?"]] }; 
        return sql;}
    },
    
    event: {
      event: () =>{
        let sql = {select:["*","{FMS_DATETIME}fromdate {FME_DATETIME} as fromdate",
          "{FMS_DATETIME}todate {FME_DATETIME} as todate"],
          from:"event", where:[["deleted","=","0"],["and","id","=","?"]]}
        return sql;
      }
    },
    
    groups: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"groups",
            where:[["groupname","in",[[],"'nervatype'","'custtype'","'fieldtype'","'logstate'","'movetype'",
              "'transtype'","'placetype'","'calcmode'","'protype'","'ratetype'","'direction'",
              "'transtate'","'inputfilter'","'filetype'","'wheretype'","'aggretype'"]],["and","id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'groups'"]]}]],
              ["and","ref_id_2","=","?"]]},
            {union_select:["count(*)"], from:"barcode", where:["barcode.barcodetype","=","?"]},
            {union_select:["count(*)"], from:"deffield", where:[["deffield.deleted","=","0"],
              ["and","deffield.subtype","=","?"]]},
            {union_select:["count(*)"], from:"employee", where:[["employee.deleted","=","0"],
              ["and","employee.usergroup","=","?"]]},
            {union_select:["count(*)"], from:"employee", where:[["employee.deleted","=","0"],
              ["and","employee.department","=","?"]]},
            {union_select:["count(*)"], from:"event", where:[["event.deleted","=","0"],
              ["and","event.eventgroup","=","?"]]},
            {union_select:["count(*)"], from:"rate", where:[["rate.deleted","=","0"],
              ["and","rate.rategroup","=","?"]]},
            {union_select:["count(*)"], from:"tool", where:[["tool.deleted","=","0"],
              ["and","tool.toolgroup","=","?"]]},
            {union_select:["count(*)"], from:"trans", where:[["trans.deleted","=","0"],
              ["and","trans.department","=","?"]]}]],"foo"]}
        return _sql;},
          
      groups_view: () => {
        let sql = {
          select:["*","groupvalue as lslabel",
            "{CCS}groupname{SEP} case when description is null then '' else "+
            "{CCS}' | '{SEP}description{CCE} end{CCE} as lsvalue"],
          from:"groups", where:[["deleted","=","0"], ["and","groupname","in",[[],
            "'department'","'eventgroup'","'paidtype'","'toolgroup'","'rategroup'"]]]}; 
        return sql;}
      },
      
    log: {
      result: () => {
        let sql = {
          select:["{FMS_DATE}l.crdate {FME_DATE} as crdate","e.empnumber","ls.groupvalue as logstate",
            "l.nervatype as nervatype","l.ref_id as refnumber","l.id as id"],
          from:"log l",
          inner_join:[
            ["employee e","on",["l.employee_id","=","e.id"]],
            ["groups ls","on",["l.logstate","=","ls.id"]]]}; 
        return sql;}
      },
      
    numberdef: {
      numberdef_view: () => {
        let sql = {
          select:["*", "case when isyear = 1 then '"+app.getText("label_yes")+
            "'else '"+app.getText("label_no")+"' end as is_year"], 
          from:"numberdef"}; 
        return sql;},
      },
      
    place: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"event",
            inner_join:[["groups nt","on",["event.nervatype","=","nt.id"]],
              ["and","nt.groupvalue","=","'place'"]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'place'"]]}]],
                ["and","ref_id_2","=","?"]]},
            {union_select:["count(*) as co"], from:"movement", 
              where:[["movement.deleted","=","0"],["and","movement.place_id","=","?"]]},
            {union_select:["count(*) as co"], from:"rate", 
              where:[["rate.deleted","=","0"],["and","rate.place_id","=","?"]]},
            {union_select:["count(*) as co"], from:"trans", 
              where:[["trans.deleted","=","0"],["and","trans.place_id","=","?"]]}]],"foo"]} 
        return _sql;},
      
      contact: () => {
        let sql = {
          select:[ "*", "{CCS} case when firstname is null then '' else {CCS} firstname{SEP}' '{CCE} end{SEP}case when surname is null then '' else surname end{SEP}' '{SEP} "+
            "case when firstname is null then '' else firstname end{SEP} "+
            "case when status is null then '' else {CCS}' | "+
            app.getText("contact_status")+": '{SEP}status{CCE} end{CCE} as lslabel",
            "{CCS}'"+app.getText("contact_phone")+": '{SEP}case when phone is null then '' else phone end "+
            "{SEP}' | "+app.getText("contact_mobil")+": '{SEP}case when mobil is null then '' else mobil end "+
            "{SEP}' | "+app.getText("contact_fax")+": '{SEP}case when fax is null then '' else fax end{CCE} as lsvalue",
            "{CCS}'"+app.getText("contact_email")+": '{SEP}case when email is null then '' else email end "+
            "{SEP}' | "+app.getText("contact_notes")+": '{SEP}case when notes is null then '' else notes end{CCE} as lsinfo"],
          from:"contact", 
          where:[["deleted","=","0"],["and","nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'place'"]]}]],
              ["and","ref_id","=","?"]]}; 
        return sql;},
                  
      place_view: () => {
        let sql = {
          select:["p.*","pt.groupvalue as place_type"],
          from:"place p",
          inner_join:["groups pt","on",["p.placetype","=","pt.id"]],
          where:["p.deleted","=","0"]}; 
        return sql;}
      },
    
    printqueue: {
      server_printers: () => {
        let sql = {
          select:["t.id","t.serial"],
          from:"tool t",
          inner_join:[
            ["product p","on",[["t.product_id","=","p.id"],["and","p.deleted","=","0"]]],
            ["groups g","on",[["t.toolgroup","=","g.id"],["and","g.groupvalue","=","'printer'"]]]],
          where:[["t.deleted","=","0"],["and","t.inactive","=","0"]]}; 
        return sql;},
              
      items: (edit) => {
        let sql = {
          select:["pq.id","ntg.groupvalue as typename",
            "case when ntg.groupvalue='trans' then tg.groupvalue "+
              "else ntg.groupvalue end as stypename",
            "case when ntg.groupvalue='trans' then tg.groupvalue else null end as transtype",
            "case when ntg.groupvalue in ('customer') then rf_customer.custnumber "+
              "when ntg.groupvalue in ('tool') then rf_tool.serial "+
              "when ntg.groupvalue in ('trans', 'transitem', 'transmovement', "+
                "'transpayment') then rf_trans.transnumber "+
              "when ntg.groupvalue in ('product') then rf_product.partnumber "+
              "when ntg.groupvalue in ('project') then rf_project.pronumber "+
              "when ntg.groupvalue in ('employee') then rf_employee.empnumber "+
              "when ntg.groupvalue in ('place') then rf_place.planumber "+
              "else 'REFNUMBER' end as refnumber, pq.ref_id, pq.qty as copies",
            "{CCS}case when ntg.groupvalue in ('customer') then rf_customer.custnumber "+
              "when ntg.groupvalue in ('tool') then rf_tool.serial "+
              "when ntg.groupvalue in ('trans', 'transitem', 'transmovement', "+
                "'transpayment') then rf_trans.transnumber "+
              "when ntg.groupvalue in ('product') then rf_product.partnumber "+
              "when ntg.groupvalue in ('project') then rf_project.pronumber "+
              "when ntg.groupvalue in ('employee') then rf_employee.empnumber "+
              "when ntg.groupvalue in ('place') then rf_place.planumber "+
              "else null end{SEP}' | '{SEP} '"+app.getText("printqueue_copies")+"'{SEP}': '{SEP}"+
              "{CAS_TEXT}pq.qty{CAE_TEXT}{CCE} as lslabel",
            "case when ntg.groupvalue='trans' then dg.groupvalue else null end as direction",
            "{CCS}{FMS_DATE}pq.crdate{FME_DATE}{SEP}' | '{SEP}e.username "+
            "{SEP}' | '{SEP}r.repname{CCE} as lsvalue","r.reportkey"],
          from:"ui_printqueue pq",
          inner_join:[
            ["groups ntg","on",["pq.nervatype","=","ntg.id"]],
            ["employee e","on",["pq.employee_id","=","e.id"]]],
          left_join: [
            ["customer rf_customer","on",["pq.ref_id","=","rf_customer.id"]],
            ["tool rf_tool","on",["pq.ref_id","=","rf_tool.id"]],
            ["trans rf_trans","on",["pq.ref_id","=","rf_trans.id"]],
            ["groups dg","on",["rf_trans.direction","=","dg.id"]],
            ["groups tg","on",["rf_trans.transtype","=","tg.id"]],
            ["product rf_product","on",["pq.ref_id","=","rf_product.id"]],
            ["project rf_project","on",["pq.ref_id","=","rf_project.id"]],
            ["employee rf_employee","on",["pq.ref_id","=","rf_employee.id"]],
            ["place rf_place","on",["pq.ref_id","=","rf_place.id"]],
            ["ui_report r","on",["pq.report_id","=","r.id"]]]};
        if (typeof edit.printqueue === "undefined") {
          sql.where = [["pq.id","=","-1"]];}
        else {
          sql.where = [["1","=","1"]];
          if (edit.printqueue.nervatype !== "" && 
            edit.printqueue.nervatype !== null) {
              switch (edit.printqueue.nervatype) {
                case "customer":
                case "product":
                case "employee":
                case "tool":
                case "project":
                  sql.where.push(["and","ntg.groupvalue","=","'"+edit.printqueue.nervatype+"'"]);
                  break;
                default:
                  sql.where.push(["and","ntg.groupvalue","=","'trans'"]);
                  sql.where.push(["and","tg.groupvalue","=","'"+edit.printqueue.nervatype+"'"]);
                  break;}}
          if (edit.printqueue.startdate !== "" && 
            edit.printqueue.startdate !== null) {
            sql.where.push(["and","pq.crdate",">=","'"+edit.printqueue.startdate+"'"]);}
          if (edit.printqueue.enddate !== "" && 
            edit.printqueue.enddate !== null) {
            sql.where.push(["and","pq.crdate","<=","'"+edit.printqueue.enddate+"'"]);}
          if (edit.printqueue.transnumber !== "" && 
            edit.printqueue.transnumber !== null) {
            sql.where.push(["and", "case when ntg.groupvalue in ('customer') then rf_customer.custnumber "+
              "when ntg.groupvalue in ('tool') then rf_tool.serial "+
              "when ntg.groupvalue in ('trans', 'transitem', 'transmovement', "+
                "'transpayment') then rf_trans.transnumber "+
              "when ntg.groupvalue in ('product') then rf_product.partnumber "+
              "when ntg.groupvalue in ('project') then rf_project.pronumber "+
              "when ntg.groupvalue in ('employee') then rf_employee.empnumber "+
              "when ntg.groupvalue in ('place') then rf_place.planumber "+
              "else null end","like","'"+edit.printqueue.transnumber+"'"]);}
          if (edit.printqueue.username !== "" && 
            edit.printqueue.username !== null) {
            sql.where.push(["and","e.username","like","'"+edit.printqueue.username+"'"]);}}
        return sql;}
    },
    
    product: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"event",
            inner_join:["groups nt","on",[["event.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'product'"]]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"address",
            inner_join:["groups nt","on",[["address.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'product'"]]],
            where:[["address.deleted","=","0"],["and","address.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"contact",
            inner_join:["groups nt","on",[["contact.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'product'"]]],
            where:[["contact.deleted","=","0"],["and","contact.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'product'"]]}]],
                ["and","ref_id_2","=","?"]]},
            {union_select:["count(*) as co"], from:"barcode", where:["barcode.product_id","=","?"]},
            {union_select:["count(*) as co"], from:"movement", 
              where:[["movement.deleted","=","0"],["and","movement.product_id","=","?"]]},
            {union_select:["count(*) as co"], from:"item", 
              where:[["item.deleted","=","0"],["and","item.product_id","=","?"]]},
            {union_select:["count(*) as co"], from:"price", 
              where:[["price.deleted","=","0"],["and","price.product_id","=","?"]]},
            {union_select:["count(*) as co"], from:"tool", 
              where:[["tool.deleted","=","0"],["and","tool.product_id","=","?"]]}]],"foo"]}; 
        return _sql;},
      
      barcode: () => {
        let sql = {
          select:["bc.*","bc.code as lslabel",
            "{CCS}g.groupvalue {SEP} ' | ' "+
            "{SEP} case when bc.description is null then '' else bc.description end{CCE} as lsvalue"],
          from:"barcode bc",
          inner_join:["groups g","on",["bc.barcodetype","=","g.id"]],
          where:["bc.product_id","=","?"]}; 
        return sql;},
      
      barcode_check: (bcode) => {
        let sql = {
          select:["p.id","p.partnumber","p.description","p.unit","p.tax_id"],
          from:"barcode bc",
          inner_join:["product p","on",["bc.product_id","=","p.id"]], 
          where:["bc.code","=", "'"+bcode+"'"]}; 
        return sql;},
      
      price: () => {
        let sql = {
          select:["pr.*","{FMS_DATE}pr.validfrom{FME_DATE} as validfrom",
            "{FMS_DATE}pr.validto{FME_DATE} as validto",
            "ln0.id as link_customer","c.id as customer_id","c.custname"],
          from:"price pr",
          left_join:[
            ["link ln0","on",[["ln0.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'price'"]]}]],
              ["and","ln0.ref_id_1","=","pr.id"],["and","ln0.deleted","=","0"], 
              ["and","ln0.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]]]],
            ["customer c","on",[["ln0.ref_id_2","=","c.id"],["and","c.deleted","=","0"]]]],
          where:[["pr.deleted","=","0"],["and","pr.discount","is null"],["and","pr.product_id","=","?"]]}; 
        return sql;},
      
      discount: () => {
        let sql = {
          select:["pr.*","{FMS_DATE}pr.validfrom{FME_DATE} as validfrom",
            "{FMS_DATE}pr.validto{FME_DATE} as validto",
            "ln0.id as link_customer","c.id as customer_id","c.custname"],
          from:"price pr",
          left_join:[
            ["link ln0","on",[["ln0.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'price'"]]}]],
              ["and","ln0.ref_id_1","=","pr.id"],["and","ln0.deleted","=","0"], 
              ["and","ln0.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]]]],
            ["customer c","on",[["ln0.ref_id_2","=","c.id"],["and","c.deleted","=","0"]]]],
          where:[["pr.deleted","=","0"],["and","pr.discount","is not null"],["and","pr.product_id","=","?"]]}; 
        return sql;},
              
      event: () => {
        let sql = {
          select:["e.id","e.calnumber",
            "{FMS_DATETIME}e.fromdate {FME_DATETIME} as fromdate",
            "eg.groupvalue as eventgroup","e.subject","e.deleted",
            "{CCS}case when e.fromdate is null then '' else {FMS_DATETIME}e.fromdate {FME_DATETIME} end"+
            "{SEP} ' | '{SEP}case when e.subject is null then '' else e.subject end{CCE} as lslabel",
            "{CCS}e.calnumber{SEP}' | '{SEP}'"+app.getText("event_group")+": '{SEP}"+
            "case when eg.groupvalue is null then '' else eg.groupvalue end{CCE} as lsvalue"],
          from:"event e", 
          left_join:["groups eg","on",["e.eventgroup","=","eg.id"]],
          where:[["e.deleted","=","0"],["and","e.nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'product'"]]}]],
            ["and","e.ref_id","=","?"]] }; 
        return sql;}
      },
      
    project: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"trans", where:["project_id","=","?"]},
            {union_select:["count(*) as co"], from:"event",
            inner_join:["groups nt","on",[["event.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'project'"]]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups",
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'project'"]]}]],
                ["and","ref_id_2","=","?"]]}]],"foo"]}; 
        return _sql;},
      
      project: () => {
        let sql = {
          select:["pr.*","c.custname","{FMS_DATE}pr.startdate {FME_DATE} as startdate",
            "{FMS_DATE}pr.enddate {FME_DATE} as enddate"],
          from:"project pr",
          left_join:["customer c","on",["pr.customer_id","=","c.id"]],
          where:[["pr.deleted","=","0"],["and","pr.id","=","?"]]}
        return sql;},
          
      address: () => {
        let _sql = {
          select:["*", 
            "{CCS} case when city is null then '' else city end{SEP} ' | '{SEP} case when street is null then '' else street end{CCE} as lslabel", 
            "{CCS}'"+app.getText("address_country")+": '{SEP} case when country is null then '' else country end{SEP} ' | '{SEP} '"+
            app.getText("address_zipcode")+": '{SEP}case when zipcode is null then '' else zipcode end {SEP} ' | '{SEP} '"+
            app.getText("address_state")+": '{SEP} case when state is null then '' else state end{CCE} as lsvalue", 
            "{CCS}'"+app.getText("address_notes")+": '{SEP} case when notes is null then '' else notes end{CCE} as lsinfo"], 
          from:"address", 
          where: [["deleted","=","0"], ["and","nervatype","=",[
            {select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'project'"]]}]],
            ["and","ref_id","=","?"]]}; 
        return _sql;},
              
      contact: () => {
        let _sql = {
          select:["*",
            "{CCS} case when firstname is null then '' else {CCS} firstname{SEP}' '{CCE} end{SEP}case when surname is null then '' else surname end{SEP}' '{SEP} case when status is null then '' else {CCS}' | "+
            app.getText("contact_status")+": '{SEP}status{CCE} end{CCE} as lslabel",
            "{CCS}'"+app.getText("contact_phone")+": '{SEP}case when phone is null then '' else phone end {SEP}' | "+
              app.getText("contact_mobil")+": '{SEP}case when mobil is null then '' else mobil end {SEP}' | "+
              app.getText("contact_fax")+": '{SEP}case when fax is null then '' else fax end{CCE} as lsvalue", 
            "{CCS}'"+app.getText("contact_email")+": '{SEP}case when email is null then '' else email end {SEP}' | "+
            app.getText("contact_notes")+": '{SEP}case when notes is null then '' else notes end{CCE} as lsinfo"],
          from:"contact", 
          where: [["deleted","=","0"], ["and","nervatype","=",[
            {select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'project'"]]}]],
            ["and","ref_id","=","?"]]}; 
        return _sql;},
              
      event: () => {
        let sql = {
          select:["e.id","e.calnumber",
            "{FMS_DATETIME}e.fromdate {FME_DATETIME} as fromdate",
            "eg.groupvalue as eventgroup","e.subject","e.deleted",
            "{CCS}case when e.fromdate is null then '' else {FMS_DATETIME}e.fromdate {FME_DATETIME} end"+
            "{SEP} ' | '{SEP}case when e.subject is null then '' else e.subject end{CCE} as lslabel",
            "{CCS}e.calnumber{SEP}' | '{SEP}'"+app.getText("event_group")+": '{SEP}"+
            "case when eg.groupvalue is null then '' else eg.groupvalue end{CCE} as lsvalue"],
          from:"event e", 
          left_join:["groups eg","on",["e.eventgroup","=","eg.id"]],
          where:[["e.deleted","=","0"],["and","e.nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'project'"]]}]],
            ["and","e.ref_id","=","?"]] }; 
      return sql;}
    },
    
    rate: {
      delete_state: () => {
        let sql = {select:["0"]}; return sql;},
      
      rate: () => {
        let sql = {
          select:["r.*","p.planumber","{FMS_DATE}r.ratedate {FME_DATE} as ratedate"],
          from:"rate r",
          left_join:["place p","on",["r.place_id","=","p.id"]],
          where:[["r.deleted","=","0"],["and","r.id","=","?"]]}; 
        return sql;}
          
    },
    
    report: {
      report: (ntype) => {
        switch (ntype) {
          case "report":
            return {
              select:["r.*","fg.groupvalue as ftype"], from:"ui_report r",
              inner_join:["groups fg","on",["r.filetype","=","fg.id"]], 
              where:["r.id","=","?"]};
          case "printqueue":
            return {
              select:["*"], from:"ui_report",
              where:["id","in",[{select_distinct:["report_id"], from:"ui_printqueue"}]]};
          default:
            return {
              select:["r.id","r.reportkey","r.repname","r.description","r.label","fg.groupvalue as filetype",
                "case when ig.groupvalue='disabled' then 0 else 1 end as usereports","r.nervatype",
                "r.report","r.direction"],
              from:"ui_report r", 
              inner_join:["groups fg","on",["r.filetype","=","fg.id"]],
              left_join:[
                ["ui_audit au","on",[["r.id","=","au.subtype"],["and","au.usergroup","=","?"],
                  ["and","au.nervatype","=",[{select:["id"], from:"groups", 
                    where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'report'"]]}]]]],
                ["groups ig","on",["au.inputfilter","=","ig.id"]]],
              where:[["r.nervatype","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","?"]]}]],
                  ["and","fg.groupvalue","in",[[],"'ntr'"]],["and","r.repname","is not null"]], 
              order_by:["r.repname"]};
        }},
            
      reportfields: (ntype) => {
        switch (ntype) {
          case "report":
            return {
              select:["rf.id","rf.report_id","rf.fieldname","fg.groupvalue as fieldtype","wg.groupvalue as wheretype",
                "rf.description","rf.orderby","rf.sqlstr","rf.parameter","rf.dataset","rf.defvalue","rf.valuelist"],
              from:"ui_reportfields rf",
              inner_join:[
                ["groups fg","on",["rf.fieldtype","=","fg.id"]],
                ["groups wg","on",["rf.wheretype","=","wg.id"]],
                ["ui_report r","on",["rf.report_id","=","r.id"]]],
              where:["rf.report_id","=","?"], 
              order_by:["orderby"]};
          default:
            return {
              select:["rf.id","rf.report_id","rf.fieldname","fg.groupvalue as fieldtype","wg.groupvalue as wheretype",
                "rf.description","rf.orderby","rf.sqlstr","rf.parameter","rf.dataset","rf.defvalue","rf.valuelist"],
              from:"ui_reportfields rf",
              inner_join:[
                ["groups fg","on",["rf.fieldtype","=","fg.id"]],
                ["groups wg","on",["rf.wheretype","=","wg.id"]],
                ["ui_report r","on",["rf.report_id","=","r.id"]],
                ["groups ffg","on",[["r.filetype","=","ffg.id"],["and","ffg.groupvalue","in",[[],"'ntr'"]]]]],
              where:[["r.nervatype","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","?"]]}]],
                  ["and","r.repname","is not null"]]};
        }},
            
      sources: (ntype) => {
        switch (ntype) {
          case "report":
            return {select:["*"], from:"ui_reportsources", where:["report_id","=","?"]};
          case "printqueue":
            return {select:["*"], from:"ui_reportsources",
              where:["report_id","in",[{select_distinct:["report_id"], from:"ui_printqueue"}]]};
          default:
            return {
              select:["rs.*"], from:"ui_reportsources rs",
              inner_join:[ 
                ["ui_report r","on",["rs.report_id","=","r.id"]],
                ["groups ffg","on",[["r.filetype","=","ffg.id"],["and","ffg.groupvalue","in",[[],"'ntr'"]]]]],
              where:[["r.nervatype","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","?"]]}]],
                ["and","r.repname","is not null"]]};
        }},
          
      message: (ntype) => {
        switch (ntype) {
          case "report":
            return {
              select:["*"], from:"ui_message", 
              where:[
                ["secname","in",[
                  {select:["foo.skey"], from:[[[
                    {select:["{CCS}r.reportkey{SEP}'_'{SEP}rs.dataset{CCE} as skey"],
                      from:"ui_reportsources rs",
                      inner_join:["ui_report r","on",["rs.report_id","=","r.id"]],
                      where:["r.id","=","?"]},
                    {union_select:["{CCS}r.reportkey{SEP}'_report'{CCE} as skey"],
                      from:"ui_report r", where:["r.id","=","?"]}]],"foo"]}
                ]],
              ["and","lang","is null"]]};
          case "printqueue":
            return {
              select:["*"], from:"ui_message", 
              where:[
                ["secname","in",[
                  {select:["foo.skey"], from:[[[
                    {select:["{CCS}r.reportkey{SEP}'_'{SEP}rs.dataset{CCE} as skey"],
                      from:"ui_reportsources rs",
                      inner_join:["ui_report r","on",["rs.report_id","=","r.id"]],
                      where:["r.id","in",[{select_distinct:["report_id"], from:"ui_printqueue"}]]},
                    {union_select:["{CCS}r.reportkey{SEP}'_report'{CCE} as skey"],
                      from:"ui_report r", 
                      where:["r.id","in",[{select_distinct:["report_id"], from:"ui_printqueue"}]]}]],"foo"]}
                  ]],
                ["and","lang","is null"]]};
          default:
            return {
              select:["*"], from:"ui_message", 
              where:[
                ["secname","in",[
                  {select:["foo.skey"], from:[[[
                    {select:["{CCS}r.reportkey{SEP}'_'{SEP}rs.dataset{CCE} as skey"],
                      from:"ui_reportsources rs",
                      inner_join:["ui_report r","on",["rs.report_id","=","r.id"]],
                      where:[["r.nervatype","=",[
                        {select:["id"], from:"groups", 
                        where:[["groupname","=","'nervatype'"],["and","groupvalue","=","?"]]}],
                        ["and","r.repname","is not null"]]]},
                    {union_select:["{CCS}r.reportkey{SEP}'_report'{CCE} as skey"],
                      from:"ui_report r",
                      where:[["r.nervatype","=",[
                        {select:["id"], from:"groups", 
                        where:[["groupname","=","'nervatype'"],["and","groupvalue","=","?"]]}],
                        ["and","r.repname","is not null"]]]}]],"foo"]}
                  ]], 
                ["and","lang","is null"]]};}}
    },
    
    setting: {
      setting_view: () => {
        let sql = {
          select:["fv.id","fv.fieldname","fv.value","fv.notes",
            "df.description","df.valuelist","ft.groupvalue as fieldtype",
            "df.description as lslabel",
            "{CCS}case when fv.value is null then '' else fv.value end "+
            "{SEP} case when fv.notes is null then '' "+
            "else {CCS}' | '{SEP}fv.notes{CCE} end{CCE} as lsvalue"],
          from:"deffield df",
          inner_join:[
            ["fieldvalue fv","on",["fv.fieldname","=","df.fieldname"]],
            ["groups ft","on",["df.fieldtype","=","ft.id"]],
            ["groups g","on",[["df.nervatype","=","g.id"],["and","g.groupname","=","'nervatype'"],
              ["and","g.groupvalue","=","'setting'"]]]],
          where:[["df.deleted","=","0"],["and","df.visible","=","1"],["and","fv.deleted","=","0"]], 
          order_by:["df.description"]}; 
        return sql;},
      },
      
    tax: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"item",
            where:[["item.deleted","=","0"],["and","item.tax_id","=","?"]]},
            {union_select:["count(*) as co"], from:"product",
            where:[["product.deleted","=","0"],["and","product.tax_id","=","?"]]}]],"foo"]};
        return _sql;},
          
      tax_view: () => {
        let sql = {
          select:["*","case when inactive = 1 then '"+app.getText("label_yes")+"' else '"+app.getText("label_no")+"' end as inact"], 
          from:"tax"}; 
        return sql;}
      },
      
    template: {
      template: () => {
        let sql = {
          select:["r.*","ng.groupvalue as ntype","tt.groupvalue as ttype","dir.groupvalue as dirtype"],
          from:"ui_report r",
          inner_join:["groups ng","on",["r.nervatype","=","ng.id"]],
          left_join:[
            ["groups tt","on",["r.transtype","=","tt.id"]],
            ["groups dir","on",["r.direction","=","dir.id"]]],
          where:["r.id","=","?"]}; 
        return sql;},
      template_reportfields: () => {
        let sql = {
          select:["rf.id","rf.report_id","rf.fieldname","fg.groupvalue as fieldtype","wg.groupvalue as wheretype",
            "rf.description","rf.orderby","rf.sqlstr","rf.parameter","rf.dataset","rf.defvalue","rf.valuelist"],
          from:"ui_reportfields rf",
          inner_join:[
            ["groups fg","on",["rf.fieldtype","=","fg.id"]],
            ["groups wg","on",["rf.wheretype","=","wg.id"]],
            ["ui_report r","on",["rf.report_id","=","r.id"]]],
          where:["rf.report_id","=","?"], 
          order_by:["orderby"]};
        return sql;
      },
      template_sources: () => {
        let sql = {select:["*"], from:"ui_reportsources", where:["report_id","=","?"]};
        return sql;},
      template_message: () => {
        let sql = {
          select:["*"], from:"ui_message", 
          where:[["secname","in",[
            {select:["foo.skey"], from:[[[
              {select:["{CCS}r.reportkey{SEP}'_'{SEP}rs.dataset{CCE} as skey"],
                from:"ui_reportsources rs",
                inner_join:["ui_report r","on",["rs.report_id","=","r.id"]],
                where:["r.id","=","?"]},
              {union_select:["{CCS}r.reportkey{SEP}'_report'{CCE} as skey"],
                from:"ui_report r", where:["r.id","=","?"]}]],"foo"]}]], 
            ["and","lang","is null"]]};
        return sql;},
      insert_reportsources: (old_id, new_id) => {
        let sql = {
          insert_into:["ui_reportsources",[[],"report_id","dataset","sqlstr"]],
          select:[new_id,"dataset","sqlstr"], from:"ui_reportsources",
          where:["report_id","=",old_id]};
        return sql;},
      insert_reportfields: (old_id, new_id) => {
          let sql = {
          insert_into:["ui_reportfields",[[],"report_id","fieldname","fieldtype","wheretype",
            "description","orderby","sqlstr","parameter","dataset","defvalue","valuelist"]],
          select:[new_id,"fieldname","fieldtype","wheretype","description","orderby","sqlstr",
            "parameter","dataset","defvalue","valuelist"], from:"ui_reportfields",
          where:["report_id","=",old_id]};
        return sql;},
      template_view: () => {
        let sql = {
          select:["r.*","r.reportkey as lslabel","r.repname as lsvalue"],
          from:"ui_report r", 
          inner_join:[
            ["groups fg","on",["r.filetype","=","fg.id"]],
            ["groups ng","on",["r.nervatype","=","ng.id"]]],
          where:["fg.groupvalue","=","'ntr'"]}; 
        return sql;}
      },
      
    tool: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"movement", where:["tool_id","=","?"]},
            {union_select:["count(*) as co"], from:"event",
            inner_join:["groups nt","on",[["event.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'tool'"]]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups",
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'tool'"]]}]],
              ["and","ref_id_2","=","?"]]}
          ]],"foo"]} 
        return _sql;},
      
      tool: () => {
        let sql = {
          select:["too.*","{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product"],
          from:"tool too",
          inner_join:["product p","on",["too.product_id","=","p.id"]],
          where:[["too.deleted","=","0"],["and","too.id","=","?"]]}; 
        return sql;},
      
      event: () => {
        let sql = {
          select:["e.id","e.calnumber",
            "{FMS_DATETIME}e.fromdate {FME_DATETIME} as fromdate",
            "eg.groupvalue as eventgroup","e.subject","e.deleted",
            "{CCS}case when e.fromdate is null then '' else {FMS_DATETIME}e.fromdate {FME_DATETIME} end"+
            "{SEP} ' | '{SEP}case when e.subject is null then '' else e.subject end{CCE} as lslabel",
            "{CCS}e.calnumber{SEP}' | '{SEP}'"+app.getText("event_group")+": '{SEP}"+
            "case when eg.groupvalue is null then '' else eg.groupvalue end{CCE} as lsvalue"],
          from:"event e", 
          left_join:["groups eg","on",["e.eventgroup","=","eg.id"]],
          where:[["e.deleted","=","0"],["and","e.nervatype","=",[{select:["id"], from:"groups", 
            where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'tool'"]]}]],
            ["and","e.ref_id","=","?"]] }; 
        return sql;}
    },
    
    trans: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"event",
            inner_join:["groups nt","on",[["event.nervatype","=","nt.id"],
              ["and","nt.groupvalue","=","'trans'"]]],
            where:[["event.deleted","=","0"],["and","event.ref_id","=","?"]]},
            {union_select:["count(*) as co"], from:"link",
            where:[["nervatype_2","=",[{select:["id"], from:"groups",
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
              ["and","ref_id_2","=","?"]]}]],"foo"]}; 
        return _sql;},
      
      item: () => {
        let sql = {
          select:["i.*","p.partnumber","ta.rate"],
          from:"item i", 
          inner_join:[
            ["product p","on",["i.product_id","=","p.id"]],
            ["tax ta","on",["i.tax_id","=","ta.id"]]],
          where:[["i.deleted","=","0"],["and","trans_id","=","?"]], 
          order_by:["i.id"]}; 
        return sql;},
      
      element_count: () => {
        let sql = {
          select:["count(t.id) as pec"], from:"trans t",
          inner_join:[
            ["item i","on",[["t.id","=","i.trans_id"],["and","i.deleted","=","0"]]],
            ["fieldvalue fv","on",[["i.product_id","=","fv.ref_id"],
              ["and","fv.fieldname","=","'product_element'"]]]],
          where:["t.id","=","?"]}; 
        return sql;},
      
      payment: () => {
        let sql = {select:["*","id as rid",
          "{FMS_DATE}paiddate {FME_DATE} as paiddate"], 
          from:"payment",
          where:[["deleted","=","0"],["and","trans_id","=","?"]], 
          order_by:["id"]}; 
        return sql;},
      
      movement_delivery: () => {
        let sql = {
          select_distinct:["mv.*","mv.id as rid","lnk_item.ref_id_2 as item_id",
            "it.transnumber as item_refnumber","lnk_ref.ref_id_1 as ref_id","pl.planumber",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product",
            "p.partnumber","p.unit","it.id as item_ref_id",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate"],
          from:"movement mv", 
          inner_join:["groups mt","on",[["mv.movetype","=","mt.id"],
            ["and","mt.groupvalue","in",[[],"'inventory'","'tool'","'plan'"]]]],
          left_join:[
            ["product p","on",["mv.product_id","=","p.id"]],
            ["link lnk_item","on",[["mv.id","=","lnk_item.ref_id_1"],["and","lnk_item.deleted","=","0"],
              ["and","lnk_item.nervatype_1","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]],
              ["and","lnk_item.nervatype_2","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'item'"]]}]]]],
            ["item mi","on",["lnk_item.ref_id_2","=","mi.id"]],
            ["trans it","on",["mi.trans_id","=","it.id"]],
            ["link lnk_ref","on",[["mv.id","=","lnk_ref.ref_id_2"],["and","lnk_ref.deleted","=","0"],
              ["and","lnk_ref.nervatype_2","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]],
              ["and","lnk_ref.nervatype_1","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]]]],
            ["place pl","on",["mv.place_id","=","pl.id"]]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
      
      movement_transfer: () => {
        let sql = {
          select_distinct:["mv.*","mv.id as rid","lnk_ref.ref_id_1 as ref_id","pl.planumber",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product",
            "p.partnumber","p.unit",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate"],
          from:"movement mv",
          inner_join:[
            ["trans t","on",["mv.trans_id","=","t.id"]],
            ["product p","on",["mv.product_id","=","p.id"]],
            ["place pl","on",["mv.place_id","=","pl.id"]],
            ["link lnk_ref","on",[["mv.id","=","lnk_ref.ref_id_2"],["and","lnk_ref.deleted","=","0"],
              ["and","lnk_ref.nervatype_2","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]],
              ["and","lnk_ref.nervatype_1","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]]]]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
      
      movement_inventory: () => {
        let sql = {
          select:["mv.*","p.partnumber","p.description","p.unit",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product"],
          from:"movement mv",
          inner_join:["product p","on",["mv.product_id","=","p.id"]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
      
      movement_waybill: () => {
        let sql = {
          select:["mv.*","too.serial","too.description as tooldesc",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate"],
          from:"movement mv",
          inner_join:["tool too","on",["mv.tool_id","=","too.id"]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
      
      //formula(movetype=head)
      movement_formula_head: () => {
        let sql = {
          select:["mv.*","p.partnumber","p.description",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product"],
          from:"movement mv",
          inner_join:[
            ["groups mt","on",[["mv.movetype","=","mt.id"],["and","mt.groupvalue","=","'head'"]]],
            ["product p","on",["mv.product_id","=","p.id"]]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]]}; 
        return sql;},
      
      movement_formula: () => {
        let sql = {
          select:["mv.*","p.partnumber","p.description","pl.planumber","p.unit",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product",
            "case when mv.shared = 1 then "+
              "'<div align=\"center\" width=\"100&#37;\"><a class=\"ui-btn ui-btn-icon-notext ui-icon-check ui-state-disabled ui-btn-b\" style=\"background-color:#838B83;border-style:none;\">YES</a></div>' "+
            "else "+
              "'<div align=\"center\" width=\"100&#37;\"><a class=\"ui-btn ui-btn-icon-notext ui-icon-delete ui-state-disabled ui-btn-b\" style=\"background-color:#EEE8CD;border-style:none;\">NO</a></div>' end as cb_shared"],
          from:"movement mv",
          inner_join:[
            ["groups mt","on",[["mv.movetype","=","mt.id"],["and","mt.groupvalue","=","'plan'"]]],
            ["product p","on",["mv.product_id","=","p.id"]]],
          left_join:["place pl","on",["mv.place_id","=","pl.id"]],
          where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
      
      //production(shared=1)
      movement_production_head: () => {
        let sql = {
          select:["mv.*","p.partnumber","p.description",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product"],
          from:"movement mv",
          inner_join:["product p","on",["mv.product_id","=","p.id"]],
          where:[["mv.deleted","=","0"],["and","mv.shared","=","1"],["and","mv.trans_id","=","?"]]}; 
        return sql;},
      
      movement_production: () => {
        let sql = {
          select:["mv.*","p.partnumber","p.description","pl.planumber","p.unit",
            "-(mv.qty) as opposite_qty",
            "{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate",
            "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as product"],
          from:"movement mv",
          inner_join:["product p","on",["mv.product_id","=","p.id"]],
          left_join:["place pl","on",["mv.place_id","=","pl.id"]],
          where:[["mv.deleted","=","0"],["and","mv.shared","=","0"],["and","mv.trans_id","=","?"]],
          order_by:["mv.id"]}; 
        return sql;},
        
      formula_head: () => {
        let sql = {
          select:["t.id","t.transnumber","mv.qty"],
          from:"trans t",
          inner_join:[
            ["movement mv","on",[["mv.trans_id","=","t.id"],["and","mv.deleted","=","0"]]],
            ["groups fmt","on",[["mv.movetype","=","fmt.id"],["and","fmt.groupvalue","=","'head'"]]],
            ["movement pv","on",[["pv.product_id","=","mv.product_id"],["and","pv.deleted","=","0"],["and","pv.shared","=","1"]]],
            ["groups pmt","on",[["pv.movetype","=","pmt.id"],["and","pmt.groupvalue","=","'inventory'"]]]],
          where:[["t.deleted","=","0"],["and","pv.trans_id","=","?"]]}; 
        return sql;},
      
      formula_items: (formula_id) => {
        let sql = {
          select:["mv.*","{FMS_DATETIME}mv.shippingdate {FME_DATETIME} as shippingdate"], from:"trans t",
          inner_join:[
            ["movement mv","on",[["mv.trans_id","=","t.id"],["and","mv.deleted","=","0"]]],
            ["groups fmt","on",[["mv.movetype","=","fmt.id"],["and","fmt.groupvalue","=","'plan'"]]]],
          where:["t.id","=",formula_id], order_by:["mv.id"]}; 
        return sql;},
                
      trans: () => {
        let sql = {
          select:["t.*","p.pronumber","e.empnumber","c.custname","c.terms","c.discount","c.notax as cust_notax",
            "{CCS}pl.planumber{SEP} case when pl.curr is null then '' else {CCS}' | '{SEP} "+
              "pl.curr{CCE} end{CCE} as planumber",
            "{FMS_DATE}t.crdate {FME_DATE} as crdate","{FMS_DATE}t.transdate {FME_DATE} as transdate",
            "{FMS_DATETIME}t.duedate {FME_DATETIME} as duedate",
            "tfp.place_id as target_place","tfp.planumber as target_planumber",
            "case when irow.netamount is null then 0 else irow.netamount end as netamount",
            "case when irow.vatamount is null then 0 else irow.vatamount end as vatamount",
            "case when irow.amount is null then 0 else irow.amount end as amount",
            "case when prow.expense is null then 0 else prow.expense end as expense",
            "case when prow.income is null then 0 else prow.income end as income",
            "case when prow.balance is null then 0 else prow.balance end as balance",
            "case when fv.value is null then 'normal' else fv.value end as transcast",
            "cu.digit"], 
          from:"trans t",
          inner_join:[
            ["groups tg","on",["t.transtype","=","tg.id"]],
            ["groups dg","on",["t.direction","=","dg.id"]]],
          left_join:[
            ["fieldvalue fv","on",[["t.id","=","fv.ref_id"],
              ["and","fieldname","=","'trans_transcast'"]]],
            ["customer c","on",["t.customer_id","=","c.id"]],
            ["project p","on",["t.project_id","=","p.id"]],
            ["employee e","on",["t.employee_id","=","e.id"]],
            ["place pl","on",["t.place_id","=","pl.id"]],
            ["currency cu","on",["t.curr","=","cu.curr"]],
            [[[{select:["mv.trans_id","mv.place_id","pl.planumber"], from:"movement mv", 
              inner_join:["place pl","on",["mv.place_id","=","pl.id"]],
              where:[["mv.deleted","=","0"],["and","mv.trans_id","=","?"]],
              group_by:["mv.trans_id","mv.place_id","pl.planumber"]}],"tfp"],"on",
                [["tfp.trans_id","=","t.id"],["and","tfp.place_id","<>","t.place_id"]]],
            [[[{select:["trans_id","sum(netamount) as netamount","sum(vatamount) as vatamount","sum(amount) as amount"],
              from:"item", where:[["deleted","=","0"],["and","trans_id","=","?"]], 
              group_by:["trans_id"]}],"irow"],"on",["t.id","=","irow.trans_id"]],
            [[[{select:["trans_id","sum(case when amount<0 then amount else 0 end) as expense",
                "sum(case when amount>0 then amount else 0 end) as income",
                "sum(amount) as balance"],
              from:"payment", where:[["deleted","=","0"],["and","trans_id","=","?"]], 
              group_by:["trans_id"]}],"prow"],"on",["t.id","=","prow.trans_id"]]],
          where:[["t.id","=","?"],["and", [["t.deleted","=","0"], 
            ["or",[["tg.groupvalue","=","'invoice'"],["and","dg.groupvalue","=","'out'"]]],
            ["or",[["tg.groupvalue","=","'receipt'"],["and","dg.groupvalue","=","'out'"]]],
            ["or",[["tg.groupvalue","=","'cash'"]]]]]]}; 
        return sql;},
        
        translink: () => {
          let sql = {
            select:["l.*","tt.groupvalue as transtype","tr2.transnumber"],
            from:"link l",
            inner_join:[
              ["groups t1","on",[["l.nervatype_1","=","t1.id"],
                ["and","t1.groupname","=","'nervatype'"],["and","t1.groupvalue","=","'trans'"]]],
              ["groups t2","on",[["l.nervatype_2","=","t2.id"],["and","t2.groupname","=","'nervatype'"], 
                ["and","t2.groupvalue","=","'trans'"]]],
              ["fieldvalue tc","on",[["tc.ref_id","=","l.ref_id_1"],["and","tc.fieldname","=","'trans_transcast'"],
                ["and","tc.value","in",[[],"'normal'","'cancellation'"]]]],
              ["trans tr2","on",[["l.ref_id_2","=","tr2.id"],
              ["and",["tr2.deleted","=","0"]]]],
              ["groups tt","on",["tr2.transtype","=","tt.id"]]],
            where:[["l.deleted","=","0"],["and","l.ref_id_1","=","?"]]}; 
        return sql;},
        
        cancel_link: () => {
          let sql = {
            select:["l.*","tt.groupvalue as transtype","tr1.transnumber"],
            from:"link l",
            inner_join:[
              ["groups t1","on",[["l.nervatype_1","=","t1.id"],
                ["and","t1.groupname","=","'nervatype'"],["and","t1.groupvalue","=","'trans'"]]],
              ["groups t2","on",[["l.nervatype_2","=","t2.id"],["and","t2.groupname","=","'nervatype'"], 
                ["and","t2.groupvalue","=","'trans'"]]],
              ["trans tr1","on",[["l.ref_id_1","=","tr1.id"]]],
              ["groups tt","on",["tr1.transtype","=","tt.id"]],
              ["fieldvalue tc","on",[["tc.ref_id","=","tr1.id"],["and","tc.fieldname","=","'trans_transcast'"],
                ["and","tc.value","=","'cancellation'"]]]],
            where:[["l.deleted","=","0"],["and","l.ref_id_2","=","?"]]}; 
        return sql;},
        
        invoice_customer: (customer_id) => {
          let sql = {
            select:["comp.custname as trans_custinvoice_compname",
            "{CCS}comp.zipcode{SEP}' '{SEP}comp.city{SEP}' '"+
            "{SEP}comp.street{CCE} as trans_custinvoice_compaddress",
            "comp.taxnumber as trans_custinvoice_comptax",
            "cust.custname as trans_custinvoice_custname",
            "{CCS}cust.zipcode{SEP}' '{SEP}cust.city{SEP}' '"+
            "{SEP}cust.street{CCE} as trans_custinvoice_custaddress",
            "cust.taxnumber as trans_custinvoice_custtax"],
          from: [
            [[{select:["c.custname","adr.zipcode","adr.city","adr.street","c.taxnumber"],
            from:"customer c",
            left_join:[[[{select:["ref_id as customer_id","case when zipcode is null then '' else zipcode end as zipcode",
              "case when city is null then '' else city end as city",
              "case when street is null then '' else street end as street"],
              from:"address",
              where:["id","in",[{
                select:["min(id)"], from:"address",
                where:[["nervatype","=",[{select:["id"], from:"groups",
                  where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
                ["and","deleted","=","0"]],
                group_by:["ref_id"]}]]}],"adr"],"on",["c.id","=","adr.customer_id"]],
            where:["c.id","in",[{select:["min(customer.id)"],
              from:"customer", 
              inner_join:["groups","on",[["customer.custtype","=","groups.id"],
                ["and","groups.groupvalue","=","'own'"]]]}]]}],"comp,"],
            [[{select:["c.custname","adr.zipcode","adr.city","adr.street","c.taxnumber"],
            from:"customer c",
            left_join:[[[{select:["ref_id as customer_id","case when zipcode is null then '' else zipcode end as zipcode",
              "case when city is null then '' else city end as city",
              "case when street is null then '' else street end as street"],
            from:"address",
            where:["id","in",[{select:["min(id)"], from:"address",
              where:[["nervatype","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'customer'"]]}]],
                ["and","deleted","=","0"]], 
                group_by:["ref_id"]}]]}],"adr"],"on",["c.id","=","adr.customer_id"]],
            where:["c.id","=",customer_id]}],"cust"]]}; 
          return sql;
        },
        
        invoice_link: () => {
          let sql = {
            select:["ln.*", "{CCS}t.transnumber{SEP}case when tg.groupvalue='bank' then "+
            "{CCS}' ~ '{SEP}{CAS_TEXT}p.id {CAE_TEXT}{CCE} else '' end{SEP}' | '"+
            "{SEP}tg.groupvalue{SEP}'-'{SEP}dg.groupvalue{CCE} as lsvalue",
            "{CCS}{CAS_TEXT}p.paiddate {CAE_TEXT}{SEP}' | ' "+
            "{SEP}pa.description{SEP}' | ' "+
            "{SEP}{CAS_TEXT}{CAS_FLOAT}af.value {CAE_FLOAT}*{CAS_FLOAT}"+
            "rf.value {CAE_FLOAT}{CAE_TEXT}{CCE} as lslabel",
            "t.id as trans_id","tg.groupvalue as transtype","pa.curr",
            "{CCS}t.transnumber{SEP}case when tg.groupvalue='bank' then "+
            "{CCS}' ~ '{SEP}{CAS_TEXT}p.id {CAE_TEXT}{CCE} else '' end{CCE} as transnumber"],
          from:"link ln",
          inner_join:[
            ["payment p","on",[["ln.ref_id_1","=","p.id"],["and","p.deleted","=","0"]]],
            ["trans t","on",["p.trans_id","=","t.id"]],
            ["groups tg","on",["t.transtype","=","tg.id"]],
            ["groups dg","on",["t.direction","=","dg.id"]],
            ["place pa","on",["t.place_id","=","pa.id"]],
            ["fieldvalue af","on",[["ln.id","=","af.ref_id"],["and","af.fieldname","=","'link_qty'"]]],
            ["fieldvalue rf","on",[["ln.id","=","rf.ref_id"],["and","rf.fieldname","=","'link_rate'"]]]],
          where:[["ln.deleted","=","0"],
            ["and","ln.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'payment'"]]}]],
            ["and","ln.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
            ["and","ln.ref_id_2","=","?"]],
          order_by:["p.paiddate"]};
        return sql;
        },
        
        payment_link: () => {
          let sql = {
            select:["ln.*","p.id as rid","t.transnumber","t.curr","af.value as amount","rf.value as rate",
              "{CCS}t.curr{SEP}' | '{SEP}af.value{SEP}' | '{SEP}'"+
                app.getText("payment_rate")+" :'{SEP}rf.value{CCE} as lslabel",
              "{CCS}'"+app.getText("payment_item")+": '{SEP}{CAS_TEXT}p.id {CAE_TEXT}{SEP}' | '{SEP}'"+
                app.getText("payment_invnumber")+": '{SEP}t.transnumber{CCE} as lsvalue"],
          from:"link ln",
          inner_join:[
            ["payment p","on",[["ln.ref_id_1","=","p.id"],["and","p.deleted","=","0"]]],
            ["trans t","on",["ln.ref_id_2","=","t.id"]],
            ["groups tg","on",["t.transtype","=","tg.id"]],
            ["groups dg","on",["t.direction","=","dg.id"]],
            ["fieldvalue af","on",[["ln.id","=","af.ref_id"],["and","af.fieldname","=","'link_qty'"]]],
            ["fieldvalue rf","on",[["ln.id","=","rf.ref_id"],["and","rf.fieldname","=","'link_rate'"]]]],
          where:[["ln.deleted","=","0"],
            ["and","ln.nervatype_1","=", [{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'payment'"]]}]],
            ["and","ln.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
            ["and","p.trans_id","=","?"]],
          order_by:["p.paiddate"]};
        return sql;
        },
        
        tool_movement: () => {
          let sql = {
            select:["t.id",
            "{CCS}t.transnumber{SEP}' | '{SEP}dg.groupvalue{CCE} as lsvalue",
            "{CCS}{CAS_TEXT}mv.shippingdate {CAE_TEXT}{SEP}' | '{SEP}"+
              "tl.serial{SEP}' | '{SEP}tl.description{CCE} as lslabel"],
          from:"trans t",
          inner_join:[
            ["movement mv","on",["t.id","=","mv.trans_id"]],
            ["tool tl","on",["mv.tool_id","=","tl.id"]],
            ["groups tg","on",[["t.transtype","=","tg.id"],["and","tg.groupvalue","=","'waybill'"]]],
            ["groups dg","on",["t.direction","=","dg.id"]]],
          left_join:[
            ["link lnk","on",[["t.id","=","lnk.ref_id_1"],["and","lnk.deleted","=","0"], 
              ["and","lnk.nervatype_1","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
              ["and","lnk.nervatype_2","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]]]],
            ["trans lt","on",["lnk.ref_id_2","=","lt.id"]]],
          where:[["t.deleted","=","0"],["and","mv.deleted","=","0"],["and","lt.id","=","?"]],
          order_by:["shippingdate"]};
        return sql;
        },
        
        transitem_invoice: () => {
          let sql ={
            select:["t1.id as id","ti.product_id","ti.deposit","ti.qty",
            "{CCS}t1.transnumber{SEP}' | '{SEP} {CAS_TEXT}t1.transdate {CAE_TEXT}{SEP} "+
              "case when ti.deposit=1 then {CCS}' | '{SEP}'Deposit'{CCE} else '' end{CCE} as lsinfo",
            "ti.description as lsvalue",
            "{CCS}ti.unit{SEP}' | '{SEP}{CAS_TEXT}ti.qty {CAE_TEXT}{SEP}' | '"+
              "{SEP} t1.curr{SEP}' | '{SEP}{CAS_TEXT}ti.amount {CAE_TEXT}{CCE} as lslabel"],
          from:"link ln",
          inner_join:[
            ["trans t1","on",[["ln.ref_id_1","=","t1.id"],["and","t1.deleted","=","0"]]],
            ["groups t1type","on",[["t1.transtype","=","t1type.id"],
              ["and",[["t1type.groupvalue","=","'invoice'"],["or","t1type.groupvalue","=","'receipt'"]]]]],
            ["groups t1dir","on",["t1.direction","=","t1dir.id"]],
            ["item ti","on",[["t1.id","=","ti.trans_id"],["and","ti.deleted","=","0"]]],
            ["trans t2","on",["ln.ref_id_2","=","t2.id"]]],
          where:[["ln.deleted","=","0"],
            ["and","ln.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
            ["and","ln.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'trans'"]]}]],
            ["and","t1.direction","=","t2.direction"],["and","ln.ref_id_2","=","?"]],
          order_by:["ti.id"]};
          return sql;
        },
        
        transitem_shipping: () => {
          let sql ={
            select:["{CCS}i.id{SEP}'-'{SEP}mt.product_id{CCE} as id",
              "mt.product_id","ip.description as item_product",
              "mp.description as movement_product","sum(mt.qty) as sqty"],
            from:"item i",
            inner_join:[
              ["product ip","on",["i.product_id","=","ip.id"]],
              ["link ln","on",[["ln.ref_id_2","=","i.id"],
                ["and","ln.nervatype_2","=",[{select:["id"], from:"groups", 
                  where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'item'"]]}]]]],
              ["movement mt","on",[["ln.ref_id_1","=","mt.id"],["and","mt.deleted","=","0"],
                ["and","ln.nervatype_1","=",[{select:["id"], from:"groups", 
                  where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]]]],
              ["product mp","on",["mt.product_id","=","mp.id"]]],
          where:[["i.deleted","=","0"],["and","i.trans_id","=","?"]],
          group_by:["i.id","ip.description","mt.product_id","mp.description"],
          order_by:["ip.description"]};
        return sql;
        },
        
        shipping_items: () => {
          let sql ={
            select:["i.id as item_id","i.description",
              "case when pe.id is null then i.product_id else pe.id end as product_id",
              "case when pf.notes is null then 1 else {CAS_FLOAT}pf.notes {CAE_FLOAT} end * i.qty as qty",
              "case when pe.id is null then p.unit else pe.unit end as unit",
              "case when pe.id is null then p.partnumber else pe.partnumber end as partnumber",
              "case when pe.id is null then p.description else pe.description end as partname",
              "case when pe.id is null then "+
                "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} "+
              "else {CCS}pe.partnumber{SEP}' | '{SEP}pe.description{CCE} "+
                "end as product",
              "case when pe.id is null then 0 else 1 end as pgroup"],
          from:"item i",
          inner_join:[
            ["product p","on",["i.product_id","=","p.id"]],
            ["groups pg","on",[["p.protype","=","pg.id"],["and","pg.groupvalue","=","'item'"]]]],
            left_join:[
              ["fieldvalue pf","on",[["pf.ref_id","=","i.product_id"],["and","pf.fieldname","=","'product_element'"]]],
              ["product pe","on",["{CAS_INT}pf.value {CAE_INT}","=","pe.id"]]],
          where:[["i.deleted","=","0"],["and","trans_id","=","?"]],
          order_by:["i.id"]};
        return sql;
        },
        
        shipping_delivery: () => {
          let sql ={
            select:["t.id","{CCS}p.unit{SEP}' | '{SEP}{CAS_TEXT}mv.qty {CAE_TEXT}{SEP}' | '{SEP}mv.notes{CCE} as lslabel",
              "{CCS}p.partnumber{SEP}' | '{SEP}p.description{CCE} as lsvalue",
              "{CCS}t.transnumber{SEP}' | '{SEP} "+
                "{CAS_TEXT}{FMS_DATETIME}mv.shippingdate {FME_DATETIME} {CAE_TEXT}"+
                "{SEP}' | '{SEP}pl.planumber{CCE} as lsinfo"],
          from:"movement mv",
          inner_join:[
            ["product p","on",["mv.product_id","=","p.id"]],
            ["trans t","on",["mv.trans_id","=","t.id"]],
            ["link lnk_item","on",[["mv.id","=","lnk_item.ref_id_1"],["and","lnk_item.deleted","=","0"],
              ["and","lnk_item.nervatype_1","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'movement'"]]}]],
              ["and","lnk_item.nervatype_2","=",[{select:["id"], from:"groups", 
                where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'item'"]]}]]]],
              ["item mi","on",["lnk_item.ref_id_2","=","mi.id"]],
              ["trans it","on",["mi.trans_id","=","it.id"]],
              ["place pl","on",["mv.place_id","=","pl.id"]]],
          where:[["mv.deleted","=","0"],["and","mi.trans_id","=","?"]],
          order_by:["mv.id"]};
        return sql;
        },
        
        shipping_stock: (product_id) => {
          let sql ={
            select:["pl.id","p.partnumber","p.description","p.unit","mv.notes as batch_no",
              "{CCS}pl.planumber{SEP}' | '{SEP}pl.description{CCE} as warehouse",
              "sum(mv.qty) as sqty",
              "{FMS_DATETIME}max(mv.shippingdate) {FME_DATETIME} as shipping"],
            from:"movement mv", 
            inner_join:[
              ["groups g","on",[["mv.movetype","=","g.id"],["and","g.groupvalue","=","'inventory'"]]],
              ["place pl","on",["mv.place_id","=","pl.id"]],
              ["product p","on",["mv.product_id","=","p.id"]],
              ["trans t","on",[["mv.trans_id","=","t.id"],["and","t.deleted","=","0"]]]],
            where:[["mv.deleted","=","0"],["and","p.id","=",product_id]],
            group_by:["pl.id","pl.planumber","pl.description","p.id","p.partnumber","p.description","p.unit","mv.notes"],
            order_by:["sum(mv.qty)"]};
          return sql;
        }
    },
    
    ui_menu: {
      ui_menufields: () => {
        let sql = {
          select:["f.*","ft.groupvalue as fieldtype_name"], 
          from:"ui_menufields f",
          inner_join:["groups ft","on",["f.fieldtype","=","ft.id"]],
          where:["menu_id","=","?"]}; 
        return sql;},
          
      ui_menu_view: () => {
        let sql = {
          select:["*","menukey as lslabel","description as lsvalue"],
          from:"ui_menu"}; 
        return sql;}
      },
    
    usergroup: {
      delete_state: () => {
        let _sql = {
          select:["sum(co) as sco"],
          from: [[[
            {select:["count(*) as co"], from:"employee",
            where:[["employee.deleted","=","0"],["and","employee.usergroup","=","?"]]}]],"foo"]} 
        return _sql;},
      
      reportkey: () => {
        let sql = {select:["id","reportkey"], from:"ui_report", order_by:["reportkey"]}; 
        return sql;},
      
      menukey: () => {
        let sql = {select:["id","menukey"], from:"ui_menu", order_by:["menukey"]}; 
        return sql;},
      
      datafilter: () => {
        let sql = {
          select:["*"], from:"link l", 
          where:[["l.deleted","=","0"],
            ["and","l.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'groups'"]]}]],
            ["and","l.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'groups'"]]}]],
            ["and","l.ref_id_1","=","?"]]}; 
        return sql;},
          
      audit: () => {
        let sql = {
          select:["a.*","nt.groupvalue as nervatype_name",
            "case when nt.groupvalue ='trans' then st.groupvalue "+
                "when nt.groupvalue ='report' then ur.reportkey "+
                "when nt.groupvalue ='menu' then um.menukey "+
                "else null end as subtype_name",
            "inf.groupvalue as inputfilter_name",
            "case when a.supervisor = 1 then '"+app.getText("label_yes")+
            "' else '"+app.getText("label_no")+"' end as supervisor_name"],
          from:"ui_audit a",
          inner_join:[
            ["groups nt","on",["a.nervatype","=","nt.id"]],
            ["groups inf","on",["a.inputfilter","=","inf.id"]]],
          left_join:[
            ["groups st","on",["a.subtype","=","st.id"]],
            ["ui_report ur","on",["a.subtype","=","ur.id"]],
            ["ui_menu um","on",["a.subtype","=","um.id"]]],
          where:["a.usergroup","=","?"]};
        return sql;},
      
      usergroup_view: () => {
        let sql = {
          select:["ug.*","ug.groupvalue as lslabel",
            "case when ug.description is null then '' else ug.description end as lsvalue",
            "l.ref_id_2 as transfilter","l.id as translink"],
          from:"groups ug",
          left_join:["link l","on",[["l.ref_id_1","=","ug.id"],["and","l.deleted","=","0"],
            ["and","l.nervatype_1","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'groups'"]]}]],
            ["and","l.nervatype_2","=",[{select:["id"], from:"groups", 
              where:[["groupname","=","'nervatype'"],["and","groupvalue","=","'groups'"]]}]]]],
          where:[["ug.deleted","=","0"],["and","ug.groupname","in",[[],"'usergroup'"]]]}; 
        return sql;}
      }
  }
}