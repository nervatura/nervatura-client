"use strict";(self.webpackChunknervatura_client=self.webpackChunknervatura_client||[]).push([[163],{4867:function(e,t,r){r.d(t,{Z:function(){return Z}});var n=r(1413),a=r(2982),u=r(885),l=r(4925),i=r(7313),s=r(5110),d=(r(2580),"List_list__mrlCW"),c="List_listRow__jwkLV",o="List_editCell__TuBfd",p="List_valueCell__aYNqP",m="List_deleteCell__UE7S2",g="List_label__7OY58",f="List_value__Voh4G",x="List_cursor__6sebD",_="List_filterInput__bg66g",b="List_addButton__aa57q",v=r(4848),y=r(5750),k=r(4721),T=r(8907),h=r(6360),q=r(3443),$=r(6417),w=["rows","labelAdd","addIcon","editIcon","deleteIcon","listFilter","filterPlaceholder","filterValue","currentPage","paginationPage","paginationTop","paginatonScroll","hidePaginatonSize","onEdit","onAddItem","onDelete","onCurrentPage"],j=function(e){var t=e.rows,r=e.labelAdd,v=e.addIcon,y=e.editIcon,j=e.deleteIcon,Z=e.listFilter,P=e.filterPlaceholder,N=e.filterValue,I=e.currentPage,C=e.paginationPage,S=e.paginationTop,z=e.paginatonScroll,D=e.hidePaginatonSize,K=e.onEdit,O=e.onAddItem,L=e.onDelete,E=e.onCurrentPage,V=(0,l.Z)(e,w),B=(0,i.useState)({filter:N}),A=(0,u.Z)(B,2),F=A[0],M=A[1],W=(0,i.useMemo)((function(){return[{accessor:"list"}]}),[]),R=(0,i.useMemo)((function(){if(""!==F.filter){var e=[],r=String(F.filter).toLowerCase();return t.forEach((function(t){var n,a;n=t,a=r,(String(n.lslabel).toLowerCase().indexOf(a)>-1||String(n.lsvalue).toLowerCase().indexOf(a)>-1)&&e.push(t)})),e}return t}),[t,F.filter]),H=(0,s.useTable)({columns:W,data:R,initialState:{pageIndex:I,pageSize:C}},s.usePagination),Y=H.prepareRow,G=H.page,U=H.canPreviousPage,X=H.canNextPage,J=H.pageCount,Q=H.gotoPage,ee=H.nextPage,te=H.previousPage,re=H.setPageSize,ne=H.state,ae=ne.pageIndex,ue=ne.pageSize,le=function(e,t){var r={gotoPage:Q,nextPage:ee,previousPage:te,setPageSize:re};r[e].apply(r,(0,a.Z)(t)),z&&window.scrollTo(0,0),E&&"setPageSize"!==e&&E(t[0])},ie=J>1;return(0,$.jsxs)("div",(0,n.Z)((0,n.Z)({},V),{},{children:[Z||ie&&S?(0,$.jsxs)("div",{children:[ie&&S?(0,$.jsx)(q.Z,{pageIndex:ae,pageSize:ue,pageCount:J,canPreviousPage:U,canNextPage:X,hidePageSize:D,onEvent:le}):null,Z?(0,$.jsxs)("div",{className:"row full",children:[(0,$.jsx)("div",{className:"cell",children:(0,$.jsx)(h.Z,{id:"filter",type:"text",className:_,placeholder:P,value:F.filter,onChange:function(e){return M((0,n.Z)((0,n.Z)({},F),{},{filter:e}))}})}),O?(0,$.jsx)("div",{className:"cell",style:{width:20},children:(0,$.jsx)(k.Z,{id:"btn_add",className:"border-button".concat(" ",b),value:(0,$.jsx)(T.Z,{className:"addLabel",leftIcon:v,value:r}),onClick:function(e){return O(e)}})}):null]}):null]}):null,(0,$.jsx)("ul",{className:"list".concat(" ",d),children:G.map((function(e,t){return Y(e),(0,$.jsxs)("li",{className:"border-bottom".concat(" ",c),children:[K?(0,$.jsx)("div",{id:"row_edit_".concat(t),className:"".concat(o),onClick:function(){return K(e.original)},children:y}):null,(0,$.jsxs)("div",{id:"row_item_".concat(t),className:"".concat(p," ").concat(K?x:""),onClick:function(){return K?K(e.original):null},children:[(0,$.jsx)("div",{className:"border-bottom".concat(" ",g),children:(0,$.jsx)("span",{children:e.original.lslabel})}),(0,$.jsx)("div",{className:"".concat(f),children:(0,$.jsx)("span",{children:e.original.lsvalue})})]}),L?(0,$.jsx)("div",{id:"row_delete_".concat(t),className:"".concat(m),onClick:function(){return L(e.original)},children:j}):null]},t)}))}),ie&&!S?(0,$.jsx)("div",{className:"padding-tiny",children:(0,$.jsx)(q.Z,{pageIndex:ae,pageSize:ue,pageCount:J,canPreviousPage:U,canNextPage:X,hidePageSize:D,onEvent:le})}):null]}))};j.defaultProps={rows:[],currentPage:0,paginationPage:(0,v.$8)("paginationPage"),paginationTop:!0,paginatonScroll:!1,hidePaginatonSize:!1,listFilter:!0,filterPlaceholder:void 0,filterValue:"",labelAdd:"",addIcon:(0,$.jsx)(y.Z,{iconKey:"Plus"}),editIcon:(0,$.jsx)(y.Z,{iconKey:"Edit",width:24,height:21.3}),deleteIcon:(0,$.jsx)(y.Z,{iconKey:"Times",width:19,height:27.6}),onEdit:void 0,onAddItem:void 0,onDelete:void 0,onCurrentPage:void 0};var Z=j},5468:function(e,t,r){r.r(t),r.d(t,{default:function(){return k}});var n=r(1413),a=r(885),u=r(4925),l=r(7313),i=(r(2580),"InputBox_modal__zH99T"),s="InputBox_dialog__VHVKq",d="InputBox_panel__mkIsx",c="InputBox_panelTitle__XrM8s",o="InputBox_closeIcon__RK5-z",p="InputBox_input__vTjn4",m="InputBox_info__DK5WD",g=r(8907),f=r(4721),x=r(6360),_=r(5750),b=r(6417),v=["title","message","infoText","value","labelCancel","labelOK","defaultOK","showValue","className","onOK","onCancel"],y=function(e){var t=e.title,r=e.message,y=e.infoText,k=e.value,T=e.labelCancel,h=e.labelOK,q=e.defaultOK,$=e.showValue,w=e.className,j=e.onOK,Z=e.onCancel,P=(0,u.Z)(e,v),N=(0,l.useState)({value:k}),I=(0,a.Z)(N,2),C=I[0],S=I[1];return(0,b.jsx)("div",{className:"modal".concat(" ",i," ").concat(w),children:(0,b.jsx)("div",(0,n.Z)((0,n.Z)({className:"dialog".concat(" ",s)},P),{},{children:(0,b.jsxs)("div",{className:"".concat(d),children:[(0,b.jsx)("div",{className:"".concat(c," ","primary"),children:(0,b.jsx)("div",{className:"row full",children:(0,b.jsx)("div",{className:"cell",children:(0,b.jsx)(g.Z,{value:t})})})}),(0,b.jsx)("div",{className:"row full container-small section-small",children:(0,b.jsxs)("div",{className:"cell padding-normal",children:[(0,b.jsx)("div",{className:"".concat(p),children:r}),y?(0,b.jsx)("div",{className:"section-small-top".concat(" ",m),children:y}):null,$?(0,b.jsx)("div",{className:"section-small-top",children:(0,b.jsx)(x.Z,{id:"input_value",type:"text",className:"full",value:C.value,autoFocus:!0,onChange:function(e){return S((0,n.Z)((0,n.Z)({},C),{},{value:e}))},onEnter:function(){return j(C.value)}})}):null]})}),(0,b.jsx)("div",{className:"row full section container-small secondary-title",children:(0,b.jsxs)("div",{className:"row full",children:[(0,b.jsx)("div",{className:"cell padding-small half",children:(0,b.jsx)(f.Z,{id:"btn_cancel",className:"full".concat(" ",o," "),autoFocus:!$&&!q,onClick:Z,value:(0,b.jsx)(g.Z,{center:!0,value:T,leftIcon:(0,b.jsx)(_.Z,{iconKey:"Times"}),iconWidth:"20px"})})}),(0,b.jsx)("div",{className:"cell padding-small half",children:(0,b.jsx)(f.Z,{id:"btn_ok",className:"full primary",autoFocus:!$&&q,onClick:function(){return j(C.value)},value:(0,b.jsx)(g.Z,{center:!0,value:h,leftIcon:(0,b.jsx)(_.Z,{iconKey:"Check"}),iconWidth:"20px"})})})]})})]})}))})};y.defaultProps={title:"",message:"",infoText:void 0,value:"",labelCancel:"Cancel",labelOK:"OK",defaultOK:!1,showValue:!1,className:"",onOK:void 0,onCancel:void 0};var k=y},7112:function(e,t,r){r.d(t,{c:function(){return p},o:function(){return m}});var n=r(5861),a=r(7757),u=r.n(a),l=r(4754),i=r.n(l),s=r(5919),d=r(9004),c=r(9155),o=r(4848),p=function(e,t){var r=(0,c.xZ)(e,t);return function(){var t=(0,n.Z)(u().mark((function t(a,l){var i,s,d,o,p,m;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:i=function(){var t=(0,n.Z)(u().mark((function t(n,l){var i,s;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return i={method:"POST",data:[{key:"check",text:(0,c.aT)(e.login.data.engine,{select:["count(*) as recnum"],from:a,where:[n]}).sql,values:l}]},t.next=3,r.requestData("/view",i);case 3:if(!(s=t.sent).error){t.next=6;break}return t.abrupt("return",s.error.message||r.getText("error_internal"));case 6:if(!(s.check[0].recnum>0)){t.next=8;break}return t.abrupt("return",r.getText("msg_value_exists"));case 8:return t.abrupt("return","");case 9:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}(),s=function(){var e=(0,n.Z)(u().mark((function e(t,n){var a,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a={method:"POST",data:{key:"nextNumber",values:{numberkey:t,step:!0}}},e.next=3,r.requestData("/function",a);case 3:if(!(i=e.sent).error){e.next=6;break}return e.abrupt("return",i.error.message||r.getText("error_internal"));case 6:return l[n]=i,e.abrupt("return","");case 8:case"end":return e.stop()}}),e)})));return function(t,r){return e.apply(this,arguments)}}(),d="","undefined"===typeof l.id&&(l.id=null),t.t0=a,t.next="address"===t.t0?7:"barcode"===t.t0?8:"contact"===t.t0?21:"currency"===t.t0?22:"customer"===t.t0?35:"deffield"===t.t0?54:"employee"===t.t0?56:"event"===t.t0?75:"fieldvalue"===t.t0?80:"formula"===t.t0?81:"groups"===t.t0?82:"item"===t.t0?103:"link"===t.t0?105:"log"===t.t0?107:"movement"===t.t0?108:"numberdef"===t.t0?124:"pattern"===t.t0?125:"payment"===t.t0?126:"place"===t.t0?127:"price"===t.t0?141:"product"===t.t0?143:"project"===t.t0?170:"rate"===t.t0?185:"tax"===t.t0?187:"tool"===t.t0?200:"trans"===t.t0?219:"ui_menu"===t.t0?260:277;break;case 7:return t.abrupt("break",278);case 8:if(null!==l.code&&""!==l.code){t.next=12;break}d=r.getText("msg_required")+" "+r.getText("barcode_code"),t.next=20;break;case 12:if(null!==l.barcodetype&&""!==l.barcodetype){t.next=16;break}d=r.getText("msg_required")+" "+r.getText("barcode_barcodetype"),t.next=20;break;case 16:if(null!==l.id){t.next=20;break}return t.next=19,i(["code","=","?"],[l.code]);case 19:d=t.sent;case 20:case 21:return t.abrupt("break",278);case 22:if(null!==l.curr&&""!==l.curr){t.next=26;break}d=r.getText("msg_required")+" "+r.getText("currency_curr"),t.next=34;break;case 26:if(null!==l.description&&""!==l.description){t.next=30;break}d=r.getText("msg_required")+" "+r.getText("currency_description"),t.next=34;break;case 30:if(null!==l.id){t.next=34;break}return t.next=33,i(["curr","=","?"],[l.curr]);case 33:d=t.sent;case 34:return t.abrupt("break",278);case 35:if(null!==l.custname&&""!==l.custname){t.next=39;break}d=r.getText("msg_required")+" "+r.getText("customer_custname"),t.next=53;break;case 39:if(null!==l.custtype&&""!==l.custtype){t.next=43;break}d=r.getText("msg_required")+" "+r.getText("customer_custtype"),t.next=53;break;case 43:if(null!==l.id||null===l.custnumber||""===l.custnumber){t.next=49;break}return t.next=46,i(["custnumber","=","?"],[l.custnumber]);case 46:d=t.sent,t.next=53;break;case 49:if(null!==l.custnumber){t.next=53;break}return t.next=52,s("custnumber","custnumber");case 52:d=t.sent;case 53:return t.abrupt("break",278);case 54:return null===l.nervatype||""===l.nervatype?d=r.getText("msg_required")+" "+r.getText("deffield_nervatype"):null===l.fieldtype||""===l.fieldtype?d=r.getText("msg_required")+" "+r.getText("deffield_fieldtype"):null!==l.description&&""!==l.description||(d=r.getText("msg_required")+" "+r.getText("deffield_description")),t.abrupt("break",278);case 56:if(null!==e.edit.current.extend.surname&&""!==e.edit.current.extend.surname){t.next=60;break}d=r.getText("msg_required")+" "+r.getText("contact_surname"),t.next=74;break;case 60:if(null!==l.usergroup&&""!==l.usergroup){t.next=64;break}d=r.getText("msg_required")+" "+r.getText("employee_usergroup"),t.next=74;break;case 64:if(null!==l.id||null===l.empnumber||""===l.empnumber){t.next=70;break}return t.next=67,i(["empnumber","=","?"],[l.empnumber]);case 67:d=t.sent,t.next=74;break;case 70:if(null!==l.empnumber){t.next=74;break}return t.next=73,s("empnumber","empnumber");case 73:d=t.sent;case 74:return t.abrupt("break",278);case 75:if(null!==l.calnumber){t.next=79;break}return t.next=78,s("calnumber","calnumber");case 78:d=t.sent;case 79:case 80:case 81:return t.abrupt("break",278);case 82:if(null!==l.groupvalue&&""!==l.groupvalue){t.next=86;break}d=r.getText("msg_required")+" "+r.getText("groups_groupvalue"),t.next=102;break;case 86:if(null!==l.groupname&&""!==l.groupname){t.next=90;break}d=r.getText("msg_required")+" "+r.getText("groups_groupname"),t.next=102;break;case 90:if("usergroup"!==l.groupname||""!==l.description&&null!==l.description){t.next=94;break}d=r.getText("msg_required")+" "+r.getText("groups_description"),t.next=102;break;case 94:if("usergroup"!==l.groupname||""!==l.transfilter&&null!==l.transfilter){t.next=98;break}d=r.getText("msg_required")+" "+r.getText("groups_transfilter"),t.next=102;break;case 98:if(null!==l.id){t.next=102;break}return t.next=101,i([["groupname","=","?"],["and","groupvalue","=","?"]],[l.groupname,l.groupvalue]);case 101:d=t.sent;case 102:return t.abrupt("break",278);case 103:return null===l.product_id||""===l.product_id?d=r.getText("msg_required")+" "+r.getText("product_partnumber"):null===l.description||""===l.description?d=r.getText("msg_required")+" "+r.getText("item_description"):null!==l.tax_id&&""!==l.tax_id||(d=r.getText("msg_required")+" "+r.getText("item_taxcode")),t.abrupt("break",278);case 105:return null!==l.ref_id_1&&""!==l.ref_id_1&&null!==l.ref_id_2&&""!==l.ref_id_2||(d=r.getText("msg_required")+" "+r.getText("document_ref_transnumber")),t.abrupt("break",278);case 107:return t.abrupt("break",278);case 108:t.t1=e.edit.current.transtype,t.next="delivery"===t.t1?111:"inventory"===t.t1?114:"production"===t.t1?116:"formula"===t.t1?118:"waybill"===t.t1?120:122;break;case 111:return o=e.edit.dataset.groups.filter((function(t){return t.id===e.edit.current.item.direction}))[0].groupvalue,null===l.place_id||""===l.place_id?d="transfer"===o?r.getText("msg_required")+" "+r.getText("movement_target"):r.getText("msg_required")+" "+r.getText("movement_place"):"transfer"===o&&e.edit.current.item.place_id===l.place_id?d=r.getText("msg_required")+" "+r.getText("ms_diff_warehouse_err"):null!==l.product_id&&""!==l.product_id||(d=r.getText("msg_required")+" "+r.getText("product_description")),t.abrupt("break",123);case 114:return null!==l.product_id&&""!==l.product_id||(d=r.getText("msg_required")+" "+r.getText("product_description")),t.abrupt("break",123);case 116:return null===l.product_id||""===l.product_id?d=r.getText("msg_required")+" "+r.getText("product_description"):null!==l.place_id&&""!==l.place_id||(d=r.getText("msg_required")+" "+r.getText("movement_place")),t.abrupt("break",123);case 118:return null!==l.product_id&&""!==l.product_id||(d=r.getText("msg_required")+" "+r.getText("product_description")),t.abrupt("break",123);case 120:return null!==l.tool_id&&""!==l.tool_id||(d=r.getText("msg_required")+" "+r.getText("tool_serial")),t.abrupt("break",123);case 122:return t.abrupt("break",123);case 123:case 124:case 125:case 126:return t.abrupt("break",278);case 127:if(null===l.id&&parseInt(l.placetype,10)!==e.edit.dataset.placetype.filter((function(e){return"warehouse"===e.groupvalue}))[0].id&&(l.curr=e.edit.dataset.currency[0].curr),null!==l.description&&""!==l.description){t.next=132;break}d=r.getText("msg_required")+" "+r.getText("place_description"),t.next=140;break;case 132:if(null!==l.placetype&&""!==l.placetype){t.next=136;break}d=r.getText("msg_required")+" "+r.getText("place_placetype"),t.next=140;break;case 136:if(null!==l.planumber){t.next=140;break}return t.next=139,s("planumber","planumber");case 139:d=t.sent;case 140:return t.abrupt("break",278);case 141:return null===l.validfrom||""===l.validfrom?d=r.getText("msg_required")+" "+r.getText("price_validfrom"):null===l.curr||""===l.curr?d=r.getText("msg_required")+" "+r.getText("price_curr"):null!==l.calcmode&&""!==l.calcmode||null===l.discount||(d=r.getText("msg_required")+" "+r.getText("price_calcmode")),t.abrupt("break",278);case 143:if(null!==l.description&&""!==l.description){t.next=147;break}d=r.getText("msg_required")+" "+r.getText("product_description"),t.next=169;break;case 147:if(null!==l.protype&&""!==l.protype){t.next=151;break}d=r.getText("msg_required")+" "+r.getText("product_protype"),t.next=169;break;case 151:if(null!==l.unit&&""!==l.unit){t.next=155;break}d=r.getText("msg_required")+" "+r.getText("product_unit"),t.next=169;break;case 155:if(null!==l.tax&&""!==l.tax){t.next=159;break}d=r.getText("msg_required")+" "+r.getText("product_tax"),t.next=169;break;case 159:if(null!==l.id||null===l.partnumber||""===l.partnumber){t.next=165;break}return t.next=162,i(["partnumber","=","?"],[l.partnumber]);case 162:d=t.sent,t.next=169;break;case 165:if(null!==l.partnumber){t.next=169;break}return t.next=168,s("partnumber","partnumber");case 168:d=t.sent;case 169:return t.abrupt("break",278);case 170:if(null!==l.description&&""!==l.description){t.next=174;break}d=r.getText("msg_required")+" "+r.getText("project_description"),t.next=184;break;case 174:if(null!==l.id||null===l.pronumber||""===l.pronumber){t.next=180;break}return t.next=177,i(["pronumber","=","?"],[l.pronumber]);case 177:d=t.sent,t.next=184;break;case 180:if(null!==l.pronumber){t.next=184;break}return t.next=183,s("pronumber","pronumber");case 183:d=t.sent;case 184:return t.abrupt("break",278);case 185:return null===l.ratetype||""===l.ratetype?d=r.getText("msg_required")+" "+r.getText("rate_ratetype"):null===l.ratedate||""===l.ratedate?d=r.getText("msg_required")+" "+r.getText("rate_ratedate"):null!==l.curr&&""!==l.curr||(d=r.getText("rate_curr")+" "+r.getText("rate_ratedate")),t.abrupt("break",278);case 187:if(null!==l.taxcode&&""!==l.taxcode){t.next=191;break}d=r.getText("msg_required")+" "+r.getText("tax_taxcode"),t.next=199;break;case 191:if(null!==l.description&&""!==l.description){t.next=195;break}d=r.getText("msg_required")+" "+r.getText("tax_description"),t.next=199;break;case 195:if(null!==l.id){t.next=199;break}return t.next=198,i(["taxcode","=","?"],[l.taxcode]);case 198:d=t.sent;case 199:return t.abrupt("break",278);case 200:if(null!==l.product_id&&""!==l.product_id){t.next=204;break}d=r.getText("msg_required")+" "+r.getText("product_partnumber"),t.next=218;break;case 204:if(null!==l.description&&""!==l.description){t.next=208;break}d=r.getText("msg_required")+" "+r.getText("tool_description"),t.next=218;break;case 208:if(null!==l.id||null===l.serial||""===l.serial){t.next=214;break}return t.next=211,i(["serial","=","?"],[l.serial]);case 211:d=t.sent,t.next=218;break;case 214:if(null!==l.serial){t.next=218;break}return t.next=217,s("serial","serial");case 217:d=t.sent;case 218:return t.abrupt("break",278);case 219:if(p=e.edit.dataset.groups.filter((function(e){return e.id===parseInt(l.transtype,10)}))[0].groupvalue,m=e.edit.dataset.groups.filter((function(e){return e.id===parseInt(l.direction,10)}))[0].groupvalue,"offer"!==p&&"order"!==p&&"worksheet"!==p&&"rent"!==p&&"invoice"!==p||null!==l.customer_id&&""!==l.customer_id){t.next=225;break}d=r.getText("msg_required")+" "+r.getText("customer_custname"),t.next=259;break;case 225:if("cash"!==p||null!==l.place_id&&""!==l.place_id){t.next=229;break}d=r.getText("msg_required")+" "+r.getText("payment_place_cash"),t.next=259;break;case 229:if("bank"!==p||null!==l.place_id&&""!==l.place_id){t.next=233;break}d=r.getText("msg_required")+" "+r.getText("payment_place_bank"),t.next=259;break;case 233:if("inventory"!==p&&"production"!==p&&("delivery"!==p||"transfer"!==m)||null!==l.place_id&&""!==l.place_id){t.next=237;break}d=r.getText("msg_required")+" "+r.getText("movement_place"),t.next=259;break;case 237:if("production"!==p||null!==l.duedate&&""!==l.duedate){t.next=241;break}d=r.getText("msg_required")+" "+r.getText("production_duedate"),t.next=259;break;case 241:if("production"!==p&&"formula"!==p||null!==e.edit.current.extend.product_id&&""!==e.edit.current.extend.product_id){t.next=245;break}d=r.getText("msg_required")+" "+r.getText("product_partnumber"),t.next=259;break;case 245:if("waybill"!==p||null!==e.edit.current.extend.ref_id&&""!==e.edit.current.extend.ref_id){t.next=249;break}d=r.getText("msg_required")+" "+r.getText("waybill_reference"),t.next=259;break;case 249:if(null!==l.transnumber){t.next=259;break}if("waybill"!==p&&"cash"!==p){t.next=256;break}return t.next=253,s(p,"transnumber");case 253:d=t.sent,t.next=259;break;case 256:return t.next=258,s(p+"_"+m,"transnumber");case 258:d=t.sent;case 259:return t.abrupt("break",278);case 260:if(null!==l.menukey&&""!==l.menukey){t.next=264;break}d=r.getText("msg_required")+" "+r.getText("menucmd_menukey"),t.next=276;break;case 264:if(null!==l.description&&""!==l.description){t.next=268;break}d=r.getText("msg_required")+" "+r.getText("menucmd_description"),t.next=276;break;case 268:if(null!==l.method&&""!==l.method){t.next=272;break}d=r.getText("msg_required")+" "+r.getText("menucmd_method"),t.next=276;break;case 272:if(null!==l.id){t.next=276;break}return t.next=275,i(["menukey","=","?"],[l.menukey]);case 275:d=t.sent;case 276:case 277:return t.abrupt("break",278);case 278:if(""===d){t.next=280;break}return t.abrupt("return",{error:{message:d}});case 280:return t.abrupt("return",l);case 281:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}()},m=function(e,t){return function(t){var r=t.dataset||e.edit.dataset,n=t.current||e.edit.current,a=e.login.data,u=(0,o.$8)("ui");switch(t.tablename){case"address":return i()({},{$set:{id:null,nervatype:a.groups.filter((function(e){return"nervatype"===e.groupname&&e.groupvalue===n.type}))[0].id,ref_id:n.item.id,country:null,state:null,zipcode:null,city:null,street:null,notes:null,deleted:0}});case"audit":return i()({},{$set:{id:null,usergroup:null,nervatype:null,subtype:null,inputfilter:null,supervisor:1}});case"barcode":return i()({},{$set:{id:null,code:null,product_id:n.item.id,description:null,barcodetype:r.barcodetype.filter((function(e){return"barcodetype"===e.groupname&&"CODE_39"===e.groupvalue}))[0].id,qty:0,defcode:0}});case"contact":return i()({},{$set:{id:null,nervatype:a.groups.filter((function(e){return"nervatype"===e.groupname&&e.groupvalue===n.type}))[0].id,ref_id:n.item.id,firstname:null,surname:null,status:null,phone:null,fax:null,mobil:null,email:null,notes:null,deleted:0}});case"currency":return i()({},{$set:{id:null,curr:null,description:null,digit:0,defrate:0,cround:0}});case"customer":return"undefined"!==typeof r.custtype?i()({},{$set:{id:null,custtype:r.custtype.filter((function(e){return"company"===e.groupvalue}))[0].id,custnumber:null,custname:null,taxnumber:null,account:null,notax:0,terms:0,creditlimit:0,discount:0,notes:null,inactive:0,deleted:0}}):null;case"deffield":return i()({},{$set:{id:null,fieldname:(0,c.M8)(),nervatype:null,subtype:null,fieldtype:null,description:null,valuelist:null,addnew:0,visible:1,readonly:0,deleted:0}});case"employee":return r.usergroup?i()({},{$set:{id:null,empnumber:null,username:null,usergroup:r.usergroup.filter((function(e){return"admin"===e.groupvalue}))[0].id,startdate:(0,s.Z)(new Date,{representation:"date"}),enddate:null,department:null,password:null,registration_key:null,inactive:0,deleted:0}}):null;case"event":var l=i()({},{$set:{id:null,calnumber:null,nervatype:null,ref_id:null,uid:null,eventgroup:null,fromdate:null,todate:null,subject:null,place:null,description:null,deleted:0}});return"undefined"!==typeof n.item&&(l="event"===n.type?i()(l,{$merge:{nervatype:n.item.nervatype,ref_id:n.item.ref_id}}):i()(l,{$merge:{nervatype:a.groups.filter((function(e){return"nervatype"===e.groupname&&e.groupvalue===n.type}))[0].id,ref_id:n.item.id}})),l;case"fieldvalue":var p=i()({},{$set:{id:null,fieldname:null,ref_id:null,value:null,notes:null,deleted:0}});return"undefined"!==typeof n.item&&(p=i()(p,{$merge:{ref_id:n.item.id}})),p;case"groups":return i()({},{$set:{id:null,groupname:null,groupvalue:null,description:null,inactive:0,deleted:0}});case"usergroup":return i()({},{$set:{id:null,groupname:"usergroup",groupvalue:null,description:null,transfilter:null,inactive:0,deleted:0}});case"item":return i()({},{$set:{id:null,trans_id:n.item.id,product_id:null,unit:null,qty:0,fxprice:0,netamount:0,discount:0,tax_id:null,vatamount:0,amount:0,description:null,deposit:0,ownstock:0,actionprice:0,deleted:0}});case"link":var m=i()({},{$set:{id:null,nervatype_1:null,ref_id_1:null,nervatype_2:null,ref_id_2:null,deleted:0}});switch(n.form_type){case"invoice_link":m=i()(m,{$merge:{nervatype_1:a.groups.filter((function(e){return"nervatype"===e.groupname&&"payment"===e.groupvalue}))[0].id,nervatype_2:a.groups.filter((function(e){return"nervatype"===e.groupname&&"trans"===e.groupvalue}))[0].id,ref_id_2:n.item.id}});break;case"payment_link":m=i()(m,{$merge:{nervatype_1:a.groups.filter((function(e){return"nervatype"===e.groupname&&"payment"===e.groupvalue}))[0].id,nervatype_2:a.groups.filter((function(e){return"nervatype"===e.groupname&&"trans"===e.groupvalue}))[0].id}})}return m;case"log":return i()({},{$set:{id:null,fromdate:(0,s.Z)(new Date,{representation:"date"}),todate:"",empnumber:"",logstate:"update",nervatype:""}});case"ui_menu":return i()({},{$set:{id:null,menukey:null,description:null,modul:null,icon:null,funcname:null,method:r.method.filter((function(e){return"post"===e.groupvalue}))[0].id,address:null}});case"ui_menufields":return i()({},{$set:{id:null,menu_id:null,fieldname:"",description:"",fieldtype:null,orderby:0}});case"movement":var g=i()({},{$set:{id:null,trans_id:n.item.id,shippingdate:null,movetype:null,product_id:null,tool_id:null,qty:0,place_id:null,shared:0,notes:null,deleted:0}});switch(n.transtype){case"delivery":g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"inventory"===e.groupvalue}))[0].id,shippingdate:n.item.transdate+" 00:00:00"}}),r.movement_transfer.length>0&&(g=i()(g,{$merge:{place_id:r.movement_transfer[0].place_id}}));break;case"inventory":g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"inventory"===e.groupvalue}))[0].id,shippingdate:n.item.transdate+" 00:00:00",place_id:n.item.place_id}});break;case"production":g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"inventory"===e.groupvalue}))[0].id,shippingdate:n.item.duedate}});break;case"formula":g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"plan"===e.groupvalue}))[0].id,shippingdate:n.item.transdate+" 00:00:00"}});break;case"waybill":g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"tool"===e.groupvalue}))[0].id,shippingdate:n.item.transdate+" 00:00:00"}});break;default:g=i()(g,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"inventory"===e.groupvalue}))[0].id}})}return g;case"movement_head":var f=i()({},{$set:{id:null,trans_id:n.item.id,shippingdate:null,product_id:null,product:"",movetype:null,tool_id:null,qty:0,place_id:null,shared:0,notes:null,deleted:0}});switch(n.transtype){case"formula":f=i()(f,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"head"===e.groupvalue}))[0].id}});break;case"production":f=i()(f,{$merge:{movetype:r.groups.filter((function(e){return"movetype"===e.groupname&&"inventory"===e.groupvalue}))[0].id,shared:1}})}return f;case"numberdef":return i()({},{$set:{id:null,numberkey:null,prefix:null,curvalue:0,isyear:1,sep:"/",len:5,description:null,visible:0,readonly:0,orderby:0}});case"pattern":return i()({},{$set:{id:null,transtype:n.item.transtype,description:null,notes:"",defpattern:0,deleted:0}});case"payment":return i()({},{$set:{id:null,trans_id:n.item.id,paiddate:n.item.transdate,amount:0,notes:null,deleted:0}});case"place":return i()({},{$set:{id:null,planumber:null,placetype:null,description:null,curr:null,defplace:0,notes:null,inactive:0,deleted:0}});case"price":case"discount":var x=i()({},{$set:{id:null,product_id:n.item.id,validfrom:(0,s.Z)(new Date,{representation:"date"}),validto:null,curr:null,qty:0,pricevalue:0,discount:null,calcmode:r.calcmode.filter((function(e){return"calcmode"===e.groupname&&"amo"===e.groupvalue}))[0].id,vendorprice:0,deleted:0}});"discount"===t.tablename&&(x=i()(x,{$merge:{discount:0}}));var _=r.settings.filter((function(e){return"default_currency"===e.fieldname}))[0];return"undefined"!==typeof _&&(x=i()(x,{$merge:{curr:_.value}})),x;case"product":if(r.protype){var b=i()({},{$set:{id:null,protype:r.protype.filter((function(e){return"item"===e.groupvalue}))[0].id,partnumber:null,description:null,unit:null,tax_id:null,notes:null,inactive:0,webitem:0,deleted:0}}),v=r.settings.filter((function(e){return"default_unit"===e.fieldname}))[0];"undefined"!==typeof v&&(b=i()(b,{$merge:{unit:v.value}}));var y=r.settings.filter((function(e){return"default_taxcode"===e.fieldname}))[0];return b="undefined"!==typeof y?i()(b,{$merge:{tax_id:r.tax.filter((function(e){return e.taxcode===y.value}))[0].id}}):i()(b,{$merge:{tax_id:r.tax.filter((function(e){return"0%"===e.taxcode}))[0].id}})}return null;case"project":return i()({},{$set:{id:null,pronumber:null,description:null,customer_id:null,startdate:null,enddate:null,notes:null,inactive:0,deleted:0}});case"printqueue":return"printqueue"===n.type&&n.item?i()({},{$set:{id:null,nervatype:n.item.nervatype,startdate:n.item.startdate,enddate:n.item.enddate,transnumber:n.item.transnumber,username:n.item.username,server:n.item.server,mode:n.item.mode,orientation:n.item.orientation,size:n.item.size}}):i()({},{$set:{id:null,nervatype:null,startdate:null,enddate:null,transnumber:null,username:null,server:null,mode:"pdf",orientation:u.page_orient,size:u.page_size}});case"rate":return i()({},{$set:{id:null,ratetype:null,ratedate:(0,s.Z)(new Date,{representation:"date"}),curr:null,place_id:null,rategroup:null,ratevalue:0,deleted:0}});case"refvalue":var k=i()({},{$set:{seltype:"transitem",ref_id:null,refnumber:"",transtype:""}});if("waybill"===n.transtype){var T=r.trans[0];null!==T.customer_id?k=i()(k,{$merge:{seltype:"customer",ref_id:T.customer_id,refnumber:T.custname}}):null!==T.employee_id?k=i()(k,{$merge:{seltype:"employee",ref_id:T.employee_id,refnumber:T.empnumber}}):(k=i()(k,{$merge:{seltype:"transitem"}}),r.translink&&r.translink.length>0&&(k=i()(k,{$merge:{ref_id:r.translink[0].ref_id_2,transtype:r.translink[0].transtype,refnumber:r.translink[0].transnumber}})))}return k;case"report":return i()({},{$set:{id:null,reportkey:null,nervatype:null,transtype:null,direction:null,repname:null,description:null,label:null,filetype:null,report:null,orientation:u.page_orient,size:u.page_size}});case"tax":return i()({},{$set:{id:null,taxcode:null,description:null,rate:0,inactive:0}});case"tool":return i()({},{$set:{id:null,serial:null,description:null,product_id:null,toolgroup:null,notes:null,inactive:0,deleted:0}});case"trans":var h=t.transtype||n.transtype;if("undefined"!==typeof r.pattern){var q=i()({},{$set:{id:null,transtype:r.groups.filter((function(e){return"transtype"===e.groupname&&e.groupvalue===h}))[0].id,direction:r.groups.filter((function(e){return"direction"===e.groupname&&"out"===e.groupvalue}))[0].id,transnumber:null,ref_transnumber:null,crdate:(0,s.Z)(new Date,{representation:"date"}),transdate:(0,s.Z)(new Date,{representation:"date"}),duedate:null,customer_id:null,employee_id:null,department:null,project_id:null,place_id:null,paidtype:null,curr:null,notax:0,paid:0,acrate:0,notes:null,intnotes:null,fnote:null,transtate:r.transtate.filter((function(e){return"transtate"===e.groupname&&"ok"===e.groupvalue}))[0].id,cruser_id:a.employee.id,closed:0,deleted:0}}),$=r.pattern.filter((function(e){return 1===e.defpattern}))[0];switch("undefined"!==typeof $&&(q=i()(q,{$merge:{fnote:$.notes}})),h){case"offer":case"order":case"worksheet":case"rent":case"invoice":case"receipt":q=i()(q,{$merge:{duedate:(0,s.Z)(new Date,{representation:"date"})+"T00:00:00"}});var w=r.settings.filter((function(e){return"default_currency"===e.fieldname}))[0];"undefined"!==typeof w&&(q=i()(q,{$merge:{curr:w.value}}));var j=r.settings.filter((function(e){return"default_paidtype"===e.fieldname}))[0];"undefined"!==typeof j&&(q=i()(q,{$merge:{paidtype:r.paidtype.filter((function(e){return e.groupvalue===j.value}))[0].id}}));break;case"bank":case"inventory":case"formula":q=i()(q,{$merge:{direction:r.groups.filter((function(e){return"direction"===e.groupname&&"transfer"===e.groupvalue}))[0].id}});break;case"production":q=i()(q,{$merge:{direction:r.groups.filter((function(e){return"direction"===e.groupname&&"transfer"===e.groupvalue}))[0].id,duedate:(0,s.Z)(new Date,{representation:"date"})+"T00:00:00"}})}if("invoice"===h){var Z=r.settings.filter((function(e){return"default_deadline"===e.fieldname}))[0];"undefined"!==typeof Z&&(q=i()(q,{$merge:{duedate:(0,s.Z)((0,d.Z)(new Date,parseInt(Z.value,10)),{representation:"date"})+"T00:00:00"}}))}return q}return null}return!1}}}}]);