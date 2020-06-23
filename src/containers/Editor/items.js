import { useContext } from 'react';
import update from 'immutability-helper';
import { formatISO, addDays } from 'date-fns'

import AppStore from 'containers/App/context'
import { guid } from 'containers/App/actions'

export const useInitItem = () => {
  const { data } = useContext(AppStore)
  return (params) => {
    const dataset = params.dataset || data.edit.dataset
    const current = params.current || data.edit.current
    const store = data.login.data
    const config = data.ui
    switch (params.tablename) {
      case "address":
        return update({}, {$set: {
          id:null, 
          nervatype: store.groups.filter((group)=> {
            return ((group.groupname === "nervatype") && (group.groupvalue === current.type))
          })[0].id, 
          ref_id: current.item.id, 
          country: null, state: null, zipcode: null, city: null, street: null, notes: null, deleted: 0
        }})
          
      case "audit":
        //ui_audit
        return update({}, {$set: {
          id: null, usergroup: null, nervatype: null, subtype: null, inputfilter: null, supervisor: 1
        }})
        
      case "barcode":
        return update({}, {$set: {
          id: null, code: null, product_id: current.item.id, description: null,
          barcodetype: dataset.barcodetype.filter((group)=> {
            return ((group.groupname === "barcodetype") && (group.groupvalue === "CODE_39"))
          })[0].id, 
          qty: 0, defcode: 0
        }})
      
      case "contact":
        return update({}, {$set: {
          id: null,
          nervatype: store.groups.filter((group)=> {
            return ((group.groupname === "nervatype") && (group.groupvalue === current.type))
          })[0].id, 
          ref_id: current.item.id, 
          firstname: null, surname: null, status: null, 
          phone: null, fax: null, mobil: null, email: null, notes: null, deleted: 0
        }})  
          
      case "currency":
        return update({}, {$set: {
          id: null, curr: null, description: null, digit: 0, defrate: 0, cround: 0
        }})
          
      case "customer":
        if (typeof dataset.custtype !== "undefined") {
          return update({}, {$set: {
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
        return update({}, {$set: {
          id: null, fieldname: guid(), 
          nervatype: null, subtype: null, fieldtype: null, description: null,
          valuelist:null, addnew: 0, visible: 1, readonly: 0, deleted: 0
        }})
        
      case "employee":
        if(dataset.usergroup){
          return update({}, {$set: {
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
        let event = update({}, {$set: {
          id: null, calnumber: null, 
          nervatype: null, ref_id: null, 
          uid: null, eventgroup: null, fromdate: null, todate: null, subject: null, 
          place: null, description: null, deleted: 0
        }})
        if (typeof current.item !== "undefined") {
          if (current.type === "event") {
            event = update(event, {$merge: {
              nervatype: current.item.nervatype,
              ref_id: current.item.ref_id
            }})  
          } else {
            event = update(event, {$merge: {
              nervatype: store.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === current.type))
              })[0].id,
              ref_id: current.item.id
            }})
          }
        }
        return event;
      
      case "fieldvalue":
        let fieldvalue = update({}, {$set: {
          id: null, fieldname: null, ref_id: null, value: null, notes: null, deleted: 0
        }})
        if (typeof current.item !== "undefined") {
          fieldvalue = update(fieldvalue, {$merge: {
            ref_id: current.item.id
          }})
        }
        return fieldvalue;
      
      case "groups":
        return update({}, {$set: {
          id: null, groupname: null, groupvalue: null, description: null, 
          inactive: 0, deleted: 0
        }})
      
      case "usergroup":
        //groups
        return update({}, {$set: {
          id: null, groupname: "usergroup", groupvalue: null, description: null, 
          transfilter: null, inactive: 0, deleted: 0
        }})
        
      case "item":
        return update({}, {$set: {
          id: null, 
          trans_id: current.item.id, 
          product_id: null, unit: null, qty: 0, 
          fxprice: 0, netamount: 0, discount: 0, tax_id: null, 
          vatamount: 0, amount: 0, description: null, deposit: 0, 
          ownstock: 0, actionprice: 0, deleted: 0
        }})
        
      case "link":
        let link = update({}, {$set: { 
          id: null, nervatype_1: null, ref_id_1: null, nervatype_2: null, 
          ref_id_2: null, deleted: 0
        }})
        switch (current.form_type) {
          case "invoice_link":
            link = update(link, {$merge: {
              nervatype_1: store.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "payment"))
              })[0].id,
              nervatype_2: store.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "trans"))
              })[0].id,
              ref_id_2: current.item.id
            }})
            break;
          case "payment_link":
            link = update(link, {$merge: {
              nervatype_1: store.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "payment"))
              })[0].id,
              nervatype_2: store.groups.filter((group)=> {
                return ((group.groupname === "nervatype") && (group.groupvalue === "trans"))
              })[0].id
            }})
            break;
          default:
        }
        return link;
      
      case "log":
        return update({}, {$set: {
          id: null,
          fromdate: formatISO(new Date(), { representation: 'date' }), 
          todate: "", empnumber: "", logstate: "update", nervatype: ""
        }})
      
      case "ui_menu":
        return update({}, {$set: {
          id: null, menukey: null, description: null, modul: null, icon: null, 
          funcname: null, url: 0, address: null
        }})
      
      case "ui_menufields":
        return update({}, {$set: {
          id: null, menu_id: null, fieldname: null, description: null, 
          fieldtype: null, orderby: 0
        }})
          
      case "movement":
        let movement = update({}, {$set: {
          id: null, trans_id: current.item.id, 
          shippingdate: null, movetype: null, product_id: null,
          tool_id: null, qty: 0, place_id: null, shared: 0, notes: null, deleted: 0
        }})
        switch (current.transtype) {
          case "delivery":
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: current.item.transdate+" 00:00:00"
            }})
            if (dataset.movement_transfer.length > 0){
              movement = update(movement, {$merge: {
                place_id: dataset.movement_transfer[0].place_id
              }})
            }
            break;
          case "inventory":
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: current.item.transdate+" 00:00:00",
              place_id: current.item.place_id
            }})
            break;
          case "production":
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shippingdate: current.item.duedate
            }})
            break;
          case "formula":
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "plan"))
              })[0].id,
              shippingdate: current.item.transdate+" 00:00:00"
            }})
            break;
          case "waybill":
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "tool"))
              })[0].id,
              shippingdate: current.item.transdate+" 00:00:00"
            }})
            break;
          default:
            movement = update(movement, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id
            }})
        }
        return movement;
      
      case "movement_head":
        //movement
        let movement_head = update({}, {$set: {
          id: null, trans_id: current.item.id, 
          shippingdate: null, product_id: null, product: "", movetype: null, 
          tool_id: null, qty: 0, place_id: null, shared: 0, notes: null, deleted: 0
        }})
        switch (current.transtype) {
          case "formula":
            movement_head = update(movement_head, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "head"))
              })[0].id
            }})
            break;
          case "production":
            movement_head = update(movement_head, {$merge: {
              movetype: dataset.groups.filter((group)=> {
                return ((group.groupname === "movetype") && (group.groupvalue === "inventory"))
              })[0].id,
              shared: 1
            }})
            break;
          default:
        }
        return movement_head;
          
      case "numberdef":
        return update({}, {$set: {
          id: null,
          numberkey: null, prefix: null, curvalue: 0, isyear: 1, sep: "/",
          len: 5, description: null, visible: 0, readonly: 0, orderby: 0
        }})
        
      case "pattern":
        return update({}, {$set: {
          id: null,
          transtype: current.item.transtype,
          description: null, notes: "", defpattern: 0, deleted: 0
        }})
          
      case "payment":
        return update({}, {$set: {
          id: null,
          trans_id: current.item.id, 
          paiddate: current.item.transdate, amount: 0, notes: null, deleted: 0
        }})
      
      case "place":
        return update({}, {$set: {
          id: null,
          planumber: null, placetype:null, description: null,
          curr: null, defplace: 0, notes: null, inactive: 0, deleted: 0
        }})
        
      case "price":
      case "discount":
        let price =  update({}, {$set: {
          id: null, product_id: current.item.id,
          validfrom: formatISO(new Date(), { representation: 'date' }), 
          validto: null, curr: null, qty: 0,
          pricevalue: 0, discount: null,
          calcmode: dataset.calcmode.filter((group)=> {
            return ((group.groupname === "calcmode") && (group.groupvalue === "amo"))
          })[0].id, 
          vendorprice: 0, deleted: 0
        }})
        if (params.tablename === "discount") {
          price =  update(price, {$merge: {
            discount: 0
          }})
        }
        let default_currency = dataset.settings.filter((group)=> {
          return (group.fieldname === "default_currency")
        })[0]
        if (typeof default_currency !== "undefined") {
          price =  update(price, {$merge: {
            curr: default_currency.value
          }})
        }
        return price;
        
      case "product":
        if(dataset.protype){
          let product = update({}, {$set: {
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
            product = update(product, {$merge: {
              unit: default_unit.value
            }})
          }
          let default_taxcode = dataset.settings.filter((group)=> {
            return (group.fieldname === "default_taxcode")
          })[0]
          if (typeof default_taxcode !== "undefined") {
            product = update(product, {$merge: {
              tax_id: dataset.tax.filter((tax)=> {
                return (tax.taxcode === default_taxcode.value)
              })[0].id
            }})
          } else {
            product = update(product, {$merge: {
              tax_id: dataset.tax.filter((tax)=> {
                return (tax.taxcode === "0%")
              })[0].id
            }})
          }
          return product;
        }
        return null
      
      case "project":
        return update({}, {$set: {
          id: null,
          pronumber: null, description: null, customer_id: null, startdate: null, 
          enddate:null, notes:null, inactive:0, deleted: 0
        }})
      
      case "printqueue":
        if ((current.type === "printqueue") && current.item) {
          return update({}, {$set: {
            id: null, 
            nervatype: current.item.nervatype, 
            startdate: current.item.startdate, 
            enddate: current.item.enddate,
            transnumber: current.item.transnumber, 
            username: current.item.username, 
            server: current.item.server, 
            mode: current.item.mode,
            orientation: current.item.orientation,
            size: current.item.size
          }})
        }
        return update({}, {$set: {
          id: null, nervatype: null, startdate: null, enddate: null,
          transnumber: null, username: null, server: null, mode: "pdf", 
          orientation: config.page_orient, 
          size: config.page_size
        }})
      
      case "rate":
        return update({}, {$set: {
          id: null,
          ratetype: null, ratedate: formatISO(new Date(), { representation: 'date' }), 
          curr: null, place_id: null, rategroup: null, ratevalue: 0, deleted: 0
        }})
      
      case "refvalue":
        let refvalue = update({}, {$set: {
          seltype: "transitem", ref_id: null, refnumber: "", transtype: ""
        }})
        if (current.transtype === "waybill") {
          const base_trans = dataset.trans[0]
          if (base_trans.customer_id !== null) {
            refvalue = update(refvalue, {$merge: {
              seltype: "customer",
              ref_id: base_trans.customer_id,
              refnumber: base_trans.custname
            }}) 
          } else if (base_trans.employee_id !== null) {
            refvalue = update(refvalue, {$merge: {
              seltype: "employee",
              ref_id: base_trans.employee_id,
              refnumber: base_trans.empnumber
            }})
          } else {
            refvalue = update(refvalue, {$merge: {
              seltype: "transitem",
            }})
            if (dataset.translink.length > 0) {
              refvalue = update(refvalue, {$merge: {
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
        return update({}, {$set: {
          id: null,
          reportkey: null, nervatype: null, transtype: null, direction: null, repname: null,
          description: null, label: null, filetype: null, report: null,
          orientation: config.page_orient, size: config.page_size
        }})
        
      case "tax":
        return update({}, {$set: {
          id:null,
          taxcode: null, description: null, rate: 0, inactive: 0
        }})
      
      case "tool":
        return update({}, {$set: {
          id: null,
          serial: null, description: null, product_id: null, 
          toolgroup: null, notes: null, inactive: 0, deleted: 0
        }})
        
      case "trans":
        const transtype = params.transtype || current.transtype;
        if (typeof dataset.pattern !== "undefined") {
          let trans = update({}, {$set: {
            id: null,
            movetype: dataset.groups.filter((group)=> {
              return ((group.groupname === "transtype") && (group.groupvalue === transtype))
            })[0].id,
            direction: dataset.groups.filter((group)=> {
              return ((group.groupname === "direction") && (group.groupvalue === "out"))
            })[0].id, 
            transnumber: null, ref_transnumber: null, 
            crdate: formatISO(new Date(), { representation: 'date' }), 
            transdate: formatISO(new Date(), { representation: 'date' }), 
            duedate: null,
            customer_id: null, employee_id: null, department: null, project_id: null,
            place_id: null, paidtype: null, curr: null, notax: 0, paid: 0, acrate: 0, 
            notes: null, intnotes: null, fnote: null,
            transtate: dataset.transtate.filter((group)=> {
              return ((group.groupname === "transtate") && (group.groupvalue === "ok"))
            })[0].id,
            cruser_id: store.employee.id, closed: 0, deleted: 0
          }})
          let pattern = dataset.pattern.filter((pattern)=> {
            return (pattern.defpattern === 1)
          })[0]
          if (typeof pattern !== "undefined") {
            trans = update(trans, {$merge: {
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
              trans = update(trans, {$merge: {
                duedate: formatISO(new Date(), { representation: 'date' })+"T00:00:00"
              }})
              let default_currency = dataset.settings.filter((group)=> {
                return (group.fieldname === "default_currency")
              })[0]
              if (typeof default_currency !== "undefined") {
                trans = update(trans, {$merge: {
                  curr: default_currency.value
                }})
              }
              let default_paidtype = dataset.settings.filter((group)=> {
                return (group.fieldname === "default_paidtype")
              })[0]
              if (typeof default_paidtype !== "undefined") {
                trans = update(trans, {$merge: {
                  paidtype: dataset.paidtype.filter((group)=> {
                    return (group.groupvalue === default_paidtype.value)
                  })[0].id
                }})
              }
              break;
            case "bank":
            case "inventory":
            case "formula":
              trans = update(trans, {$merge: {
                direction: dataset.groups.filter((group)=> {
                  return ((group.groupname === "direction") && (group.groupvalue === "transfer"))
                })[0].id
              }})
              break;
            case "production":
              trans = update(trans, {$merge: {
                direction: dataset.groups.filter((group)=> {
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
              trans = update(trans, {$merge: {
                duedate: formatISO(addDays(new Date(), parseInt(default_deadline.value,10)), { representation: 'date' })+"T00:00:00"
              }})
            }
          }    
          return trans;}
        return null;
        
      default:
    }
    return false;
  }
}