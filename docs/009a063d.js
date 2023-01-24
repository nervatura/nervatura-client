import{a as e}from"./ca73009c.js";import"./4e7ea0c6.js";import"./81d721ef.js";import"./95ec07a4.js";const r=r=>{const{data:t}=r.store,{getSql:n,requestData:l,msg:u}=r,i=e=>u("",{id:e});return async(r,u)=>{const a=u,d=async(u,a)=>{const d={method:"POST",data:[{key:"check",text:n(t[e.LOGIN].data.engine,{select:["count(*) as recnum"],from:r,where:[u]}).sql,values:a}]},o=await l("/view",d);return o.error?o.error.message||i("error_internal"):o.check[0].recnum>0?i("msg_value_exists"):""},o=async(e,r)=>{const t={method:"POST",data:{key:"nextNumber",values:{numberkey:e,step:!0}}},n=await l("/function",t);return n.error?n.error.message||i("error_internal"):(a[r]=n,"")};let s="";switch(void 0===a.id&&(a.id=null),r){case"address":case"contact":case"fieldvalue":case"formula":case"log":case"numberdef":case"pattern":case"payment":break;case"barcode":null===a.code||""===a.code?s=`${i("msg_required")} ${i("barcode_code")}`:null===a.barcodetype||""===a.barcodetype?s=`${i("msg_required")} ${i("barcode_barcodetype")}`:null===a.id&&(s=await d(["code","=","?"],[a.code]));break;case"currency":null===a.curr||""===a.curr?s=`${i("msg_required")} ${i("currency_curr")}`:null===a.description||""===a.description?s=`${i("msg_required")} ${i("currency_description")}`:null===a.id&&(s=await d(["curr","=","?"],[a.curr]));break;case"customer":null===a.custname||""===a.custname?s=`${i("msg_required")} ${i("customer_custname")}`:null===a.custtype||""===a.custtype?s=`${i("msg_required")} ${i("customer_custtype")}`:null===a.id&&null!==a.custnumber&&""!==a.custnumber?s=await d(["custnumber","=","?"],[a.custnumber]):null===a.custnumber&&(s=await o("custnumber","custnumber"));break;case"deffield":null===a.nervatype||""===a.nervatype?s=`${i("msg_required")} ${i("deffield_nervatype")}`:null===a.fieldtype||""===a.fieldtype?s=`${i("msg_required")} ${i("deffield_fieldtype")}`:null!==a.description&&""!==a.description||(s=`${i("msg_required")} ${i("deffield_description")}`);break;case"employee":null===t[e.EDIT].current.extend.surname||""===t[e.EDIT].current.extend.surname?s=`${i("msg_required")} ${i("contact_surname")}`:null===a.usergroup||""===a.usergroup?s=`${i("msg_required")} ${i("employee_usergroup")}`:null===a.id&&null!==a.empnumber&&""!==a.empnumber?s=await d(["empnumber","=","?"],[a.empnumber]):null===a.empnumber&&(s=await o("empnumber","empnumber"));break;case"event":null===a.calnumber&&(s=await o("calnumber","calnumber"));break;case"groups":null===a.groupvalue||""===a.groupvalue?s=`${i("msg_required")} ${i("groups_groupvalue")}`:null===a.groupname||""===a.groupname?s=`${i("msg_required")} ${i("groups_groupname")}`:"usergroup"!==a.groupname||""!==a.description&&null!==a.description?"usergroup"!==a.groupname||""!==a.transfilter&&null!==a.transfilter?null===a.id&&(s=await d([["groupname","=","?"],["and","groupvalue","=","?"]],[a.groupname,a.groupvalue])):s=`${i("msg_required")} ${i("groups_transfilter")}`:s=`${i("msg_required")} ${i("groups_description")}`;break;case"item":null===a.product_id||""===a.product_id?s=`${i("msg_required")} ${i("product_partnumber")}`:null===a.description||""===a.description?s=`${i("msg_required")} ${i("item_description")}`:null!==a.tax_id&&""!==a.tax_id||(s=`${i("msg_required")} ${i("item_taxcode")}`);break;case"link":null!==a.ref_id_1&&""!==a.ref_id_1&&null!==a.ref_id_2&&""!==a.ref_id_2||(s=`${i("msg_required")} ${i("document_ref_transnumber")}`);break;case"movement":switch(t[e.EDIT].current.transtype){case"delivery":const r=t[e.EDIT].dataset.groups.filter((r=>r.id===t[e.EDIT].current.item.direction))[0].groupvalue;null===a.place_id||""===a.place_id?s="transfer"===r?`${i("msg_required")} ${i("movement_target")}`:`${i("msg_required")} ${i("movement_place")}`:"transfer"===r&&t[e.EDIT].current.item.place_id===a.place_id?s=`${i("msg_required")} ${i("ms_diff_warehouse_err")}`:null!==a.product_id&&""!==a.product_id||(s=`${i("msg_required")} ${i("product_description")}`);break;case"inventory":case"formula":null!==a.product_id&&""!==a.product_id||(s=`${i("msg_required")} ${i("product_description")}`);break;case"production":null===a.product_id||""===a.product_id?s=`${i("msg_required")} ${i("product_description")}`:null!==a.place_id&&""!==a.place_id||(s=`${i("msg_required")} ${i("movement_place")}`);break;case"waybill":null!==a.tool_id&&""!==a.tool_id||(s=`${i("msg_required")} ${i("tool_serial")}`)}break;case"place":null===a.id&&parseInt(a.placetype,10)!==t[e.EDIT].dataset.placetype.filter((e=>"warehouse"===e.groupvalue))[0].id&&(a.curr=t[e.EDIT].dataset.currency[0].curr),null===a.description||""===a.description?s=`${i("msg_required")} ${i("place_description")}`:null===a.placetype||""===a.placetype?s=`${i("msg_required")} ${i("place_placetype")}`:null===a.planumber&&(s=await o("planumber","planumber"));break;case"price":null===a.validfrom||""===a.validfrom?s=`${i("msg_required")} ${i("price_validfrom")}`:null===a.curr||""===a.curr?s=`${i("msg_required")} ${i("price_curr")}`:null!==a.calcmode&&""!==a.calcmode||null===a.discount||(s=`${i("msg_required")} ${i("price_calcmode")}`);break;case"product":null===a.description||""===a.description?s=`${i("msg_required")} ${i("product_description")}`:null===a.protype||""===a.protype?s=`${i("msg_required")} ${i("product_protype")}`:null===a.unit||""===a.unit?s=`${i("msg_required")} ${i("product_unit")}`:null===a.tax||""===a.tax?s=`${i("msg_required")} ${i("product_tax")}`:null===a.id&&null!==a.partnumber&&""!==a.partnumber?s=await d(["partnumber","=","?"],[a.partnumber]):null===a.partnumber&&(s=await o("partnumber","partnumber"));break;case"project":null===a.description||""===a.description?s=`${i("msg_required")} ${i("project_description")}`:null===a.id&&null!==a.pronumber&&""!==a.pronumber?s=await d(["pronumber","=","?"],[a.pronumber]):null===a.pronumber&&(s=await o("pronumber","pronumber"));break;case"rate":null===a.ratetype||""===a.ratetype?s=`${i("msg_required")} ${i("rate_ratetype")}`:null===a.ratedate||""===a.ratedate?s=`${i("msg_required")} ${i("rate_ratedate")}`:null!==a.curr&&""!==a.curr||(s=`${i("rate_curr")} ${i("rate_ratedate")}`);break;case"tax":null===a.taxcode||""===a.taxcode?s=`${i("msg_required")} ${i("tax_taxcode")}`:null===a.description||""===a.description?s=`${i("msg_required")} ${i("tax_description")}`:null===a.id&&(s=await d(["taxcode","=","?"],[a.taxcode]));break;case"tool":null===a.product_id||""===a.product_id?s=`${i("msg_required")} ${i("product_partnumber")}`:null===a.description||""===a.description?s=`${i("msg_required")} ${i("tool_description")}`:null===a.id&&null!==a.serial&&""!==a.serial?s=await d(["serial","=","?"],[a.serial]):null===a.serial&&(s=await o("serial","serial"));break;case"trans":const r=t[e.EDIT].dataset.groups.filter((e=>e.id===parseInt(a.transtype,10)))[0].groupvalue,n=t[e.EDIT].dataset.groups.filter((e=>e.id===parseInt(a.direction,10)))[0].groupvalue;!["offer","order","worksheet","rent","invoice"].includes(r)||null!==a.customer_id&&""!==a.customer_id?"cash"!==r||null!==a.place_id&&""!==a.place_id?"bank"!==r||null!==a.place_id&&""!==a.place_id?"inventory"!==r&&"production"!==r&&("delivery"!==r||"transfer"!==n)||null!==a.place_id&&""!==a.place_id?"production"!==r||null!==a.duedate&&""!==a.duedate?"production"!==r&&"formula"!==r||null!==t[e.EDIT].current.extend.product_id&&""!==t[e.EDIT].current.extend.product_id?"waybill"!==r||null!==t[e.EDIT].current.extend.ref_id&&""!==t[e.EDIT].current.extend.ref_id?null===a.transnumber&&(s="waybill"===r||"cash"===r?await o(r,"transnumber"):await o(`${r}_${n}`,"transnumber")):s=`${i("msg_required")} ${i("waybill_reference")}`:s=`${i("msg_required")} ${i("product_partnumber")}`:s=`${i("msg_required")} ${i("production_duedate")}`:s=`${i("msg_required")} ${i("movement_place")}`:s=`${i("msg_required")} ${i("payment_place_bank")}`:s=`${i("msg_required")} ${i("payment_place_cash")}`:s=`${i("msg_required")} ${i("customer_custname")}`;break;case"ui_menu":null===a.menukey||""===a.menukey?s=`${i("msg_required")} ${i("menucmd_menukey")}`:null===a.description||""===a.description?s=`${i("msg_required")} ${i("menucmd_description")}`:null===a.method||""===a.method?s=`${i("msg_required")} ${i("menucmd_method")}`:null===a.id&&(s=await d(["menukey","=","?"],[a.menukey]))}return""!==s?{error:{message:s}}:a}},t=r=>{const{data:t}=r.store,{getSetting:n}=r;return r=>{const l=r.dataset||t[e.EDIT].dataset,u=r.current||t[e.EDIT].current,i=t[e.LOGIN].data,a=n("ui");switch(r.tablename){case"address":return{id:null,nervatype:i.groups.filter((e=>"nervatype"===e.groupname&&e.groupvalue===u.type))[0].id,ref_id:u.item.id,country:null,state:null,zipcode:null,city:null,street:null,notes:null,deleted:0};case"audit":return{id:null,usergroup:null,nervatype:null,subtype:null,inputfilter:null,supervisor:1};case"barcode":return{id:null,code:null,product_id:u.item.id,description:null,barcodetype:l.barcodetype.filter((e=>"barcodetype"===e.groupname&&"CODE_39"===e.groupvalue))[0].id,qty:0,defcode:0};case"contact":return{id:null,nervatype:i.groups.filter((e=>"nervatype"===e.groupname&&e.groupvalue===u.type))[0].id,ref_id:u.item.id,firstname:null,surname:null,status:null,phone:null,fax:null,mobil:null,email:null,notes:null,deleted:0};case"currency":return{id:null,curr:null,description:null,digit:0,defrate:0,cround:0};case"customer":return void 0!==l.custtype?{id:null,custtype:l.custtype.filter((e=>"company"===e.groupvalue))[0].id,custnumber:null,custname:null,taxnumber:null,account:null,notax:0,terms:0,creditlimit:0,discount:0,notes:null,inactive:0,deleted:0}:null;case"deffield":return{id:null,fieldname:`${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`,nervatype:null,subtype:null,fieldtype:null,description:null,valuelist:null,addnew:0,visible:1,readonly:0,deleted:0};case"employee":return l.usergroup?{id:null,empnumber:null,username:null,usergroup:l.usergroup.filter((e=>"admin"===e.groupvalue))[0].id,startdate:(new Date).toISOString().split("T")[0],enddate:null,department:null,password:null,registration_key:null,inactive:0,deleted:0}:null;case"event":let e={id:null,calnumber:null,nervatype:null,ref_id:null,uid:null,eventgroup:null,fromdate:null,todate:null,subject:null,place:null,description:null,deleted:0};return void 0!==u.item&&(e="event"===u.type?{...e,nervatype:u.item.nervatype,ref_id:u.item.ref_id}:{...e,nervatype:i.groups.filter((e=>"nervatype"===e.groupname&&e.groupvalue===u.type))[0].id,ref_id:u.item.id}),e;case"fieldvalue":let t={id:null,fieldname:null,ref_id:null,value:null,notes:null,deleted:0};return void 0!==u.item&&(t={...t,ref_id:u.item.id}),t;case"groups":return{id:null,groupname:null,groupvalue:null,description:null,inactive:0,deleted:0};case"usergroup":return{id:null,groupname:"usergroup",groupvalue:null,description:null,transfilter:null,inactive:0,deleted:0};case"item":return{id:null,trans_id:u.item.id,product_id:null,unit:null,qty:0,fxprice:0,netamount:0,discount:0,tax_id:null,vatamount:0,amount:0,description:null,deposit:0,ownstock:0,actionprice:0,deleted:0};case"link":let n={id:null,nervatype_1:null,ref_id_1:null,nervatype_2:null,ref_id_2:null,deleted:0};return"invoice_link"===u.form_type&&(n={...n,nervatype_1:i.groups.filter((e=>"nervatype"===e.groupname&&"payment"===e.groupvalue))[0].id,nervatype_2:i.groups.filter((e=>"nervatype"===e.groupname&&"trans"===e.groupvalue))[0].id,ref_id_2:u.item.id}),"payment_link"===u.form_type&&(n={...n,nervatype_1:i.groups.filter((e=>"nervatype"===e.groupname&&"payment"===e.groupvalue))[0].id,nervatype_2:i.groups.filter((e=>"nervatype"===e.groupname&&"trans"===e.groupvalue))[0].id}),n;case"log":return{id:null,fromdate:(new Date).toISOString().split("T")[0],todate:"",empnumber:"",logstate:"update",nervatype:""};case"ui_menu":return{id:null,menukey:null,description:null,modul:null,icon:null,funcname:null,method:l.method.filter((e=>"post"===e.groupvalue))[0].id,address:null};case"ui_menufields":return{id:null,menu_id:null,fieldname:"",description:"",fieldtype:null,orderby:0};case"movement":let d={id:null,trans_id:u.item.id,shippingdate:null,movetype:null,product_id:null,tool_id:null,qty:0,place_id:null,shared:0,notes:null,deleted:0};switch(u.transtype){case"delivery":d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"inventory"===e.groupvalue))[0].id,shippingdate:`${u.item.transdate} 00:00:00`},l.movement_transfer.length>0&&(d={...d,place_id:l.movement_transfer[0].place_id});break;case"inventory":d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"inventory"===e.groupvalue))[0].id,shippingdate:`${u.item.transdate} 00:00:00`,place_id:u.item.place_id};break;case"production":d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"inventory"===e.groupvalue))[0].id,shippingdate:u.item.duedate};break;case"formula":d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"plan"===e.groupvalue))[0].id,shippingdate:`${u.item.transdate} 00:00:00`};break;case"waybill":d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"tool"===e.groupvalue))[0].id,shippingdate:`${u.item.transdate} 00:00:00`};break;default:d={...d,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"inventory"===e.groupvalue))[0].id}}return d;case"movement_head":let o={id:null,trans_id:u.item.id,shippingdate:null,product_id:null,product:"",movetype:null,tool_id:null,qty:0,place_id:null,shared:0,notes:null,deleted:0};return"formula"===u.transtype&&(o={...o,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"head"===e.groupvalue))[0].id}),"production"===u.transtype&&(o={...o,movetype:l.groups.filter((e=>"movetype"===e.groupname&&"inventory"===e.groupvalue))[0].id,shared:1}),o;case"numberdef":return{id:null,numberkey:null,prefix:null,curvalue:0,isyear:1,sep:"/",len:5,description:null,visible:0,readonly:0,orderby:0};case"pattern":return{id:null,transtype:u.item.transtype,description:null,notes:"",defpattern:0,deleted:0};case"payment":return{id:null,trans_id:u.item.id,paiddate:u.item.transdate,amount:0,notes:null,deleted:0};case"place":return{id:null,planumber:null,placetype:null,description:null,curr:null,defplace:0,notes:null,inactive:0,deleted:0};case"price":case"discount":let s={id:null,product_id:u.item.id,validfrom:(new Date).toISOString().split("T")[0],validto:null,curr:null,qty:0,pricevalue:0,discount:null,calcmode:l.calcmode.filter((e=>"calcmode"===e.groupname&&"amo"===e.groupvalue))[0].id,vendorprice:0,deleted:0};"discount"===r.tablename&&(s={...s,discount:0});const p=l.settings.filter((e=>"default_currency"===e.fieldname))[0];return void 0!==p&&(s={...s,curr:p.value}),s;case"product":if(l.protype){let e={id:null,protype:l.protype.filter((e=>"item"===e.groupvalue))[0].id,partnumber:null,description:null,unit:null,tax_id:null,notes:null,inactive:0,webitem:0,deleted:0};const r=l.settings.filter((e=>"default_unit"===e.fieldname))[0];void 0!==r&&(e={...e,unit:r.value});const t=l.settings.filter((e=>"default_taxcode"===e.fieldname))[0];return e=void 0!==t?{...e,tax_id:l.tax.filter((e=>e.taxcode===t.value))[0].id}:{...e,tax_id:l.tax.filter((e=>"0%"===e.taxcode))[0].id},e}return null;case"project":return{id:null,pronumber:null,description:null,customer_id:null,startdate:null,enddate:null,notes:null,inactive:0,deleted:0};case"printqueue":return"printqueue"===u.type&&u.item?{id:null,nervatype:u.item.nervatype,startdate:u.item.startdate,enddate:u.item.enddate,transnumber:u.item.transnumber,username:u.item.username,server:u.item.server,mode:u.item.mode,orientation:u.item.orientation,size:u.item.size}:{id:null,nervatype:null,startdate:null,enddate:null,transnumber:null,username:null,server:null,mode:"pdf",orientation:a.page_orient,size:a.page_size};case"rate":return{id:null,ratetype:null,ratedate:(new Date).toISOString().split("T")[0],curr:null,place_id:null,rategroup:null,ratevalue:0,deleted:0};case"refvalue":let c={seltype:"transitem",ref_id:null,refnumber:"",transtype:""};if("waybill"===u.transtype){const e=l.trans[0];null!==e.customer_id?c={...c,seltype:"customer",ref_id:e.customer_id,refnumber:e.custname}:null!==e.employee_id?c={...c,seltype:"employee",ref_id:e.employee_id,refnumber:e.empnumber}:(c={...c,seltype:"transitem"},l.translink&&l.translink.length>0&&(c={...c,ref_id:l.translink[0].ref_id_2,transtype:l.translink[0].transtype,refnumber:l.translink[0].transnumber}))}return c;case"report":return{id:null,reportkey:null,nervatype:null,transtype:null,direction:null,repname:null,description:null,label:null,filetype:null,report:null,orientation:a.page_orient,size:a.page_size};case"tax":return{id:null,taxcode:null,description:null,rate:0,inactive:0};case"tool":return{id:null,serial:null,description:null,product_id:null,toolgroup:null,notes:null,inactive:0,deleted:0};case"trans":const m=r.transtype||u.transtype;if(void 0!==l.pattern){let e={id:null,transtype:l.groups.filter((e=>"transtype"===e.groupname&&e.groupvalue===m))[0].id,direction:l.groups.filter((e=>"direction"===e.groupname&&"out"===e.groupvalue))[0].id,transnumber:null,ref_transnumber:null,crdate:(new Date).toISOString().split("T")[0],transdate:(new Date).toISOString().split("T")[0],duedate:null,customer_id:null,employee_id:null,department:null,project_id:null,place_id:null,paidtype:null,curr:null,notax:0,paid:0,acrate:0,notes:null,intnotes:null,fnote:null,transtate:l.transtate.filter((e=>"transtate"===e.groupname&&"ok"===e.groupvalue))[0].id,cruser_id:i.employee.id,closed:0,deleted:0};const r=l.pattern.filter((e=>1===e.defpattern))[0];switch(void 0!==r&&(e={...e,fnote:r.notes}),m){case"offer":case"order":case"worksheet":case"rent":case"invoice":case"receipt":e={...e,duedate:`${(new Date).toISOString().split("T")[0]}T00:00:00`};const r=l.settings.filter((e=>"default_currency"===e.fieldname))[0];void 0!==r&&(e={...e,curr:r.value});const t=l.settings.filter((e=>"default_paidtype"===e.fieldname))[0];void 0!==t&&(e={...e,paidtype:l.paidtype.filter((e=>e.groupvalue===t.value))[0].id});break;case"bank":case"inventory":case"formula":e={...e,direction:l.groups.filter((e=>"direction"===e.groupname&&"transfer"===e.groupvalue))[0].id};break;case"production":e={...e,direction:l.groups.filter((e=>"direction"===e.groupname&&"transfer"===e.groupvalue))[0].id,duedate:`${(new Date).toISOString().split("T")[0]}T00:00:00`}}if("invoice"===m){const r=l.settings.filter((e=>"default_deadline"===e.fieldname))[0];if(void 0!==r){const t=new Date;e={...e,duedate:`${new Date(t.setDate(t.getDate()+parseInt(r.value,10))).toISOString().split("T")[0]}T00:00:00`}}}return e}return null}return!1}};export{t as InitItem,r as Validator};
