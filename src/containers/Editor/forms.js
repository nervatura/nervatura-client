import { useContext } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'

export const useForm = () => {
  const { data } = useContext(AppStore)
  const app = useApp()
  return {
    address: (item) => {
      let address = {
        options: {
          title: app.getText("address_view"),
          title_field: "",
          icon: "home",
          panel: {}},
        rows: [
          {rowtype: "col3", columns: [
            {name: "country", label: app.getText("address_country"), datatype: "string"},
            {name: "state", label: app.getText("address_state"), datatype: "string"},
            {name: "zipcode", label: app.getText("address_zipcode"), datatype: "string"}]},
          {rowtype: "field", name: "city", label: app.getText("address_city"), datatype: "string"},
          {rowtype: "field", name: "street", label: app.getText("ddress_street"), datatype: "string"},
          {rowtype: "field", name:"notes", label: app.getText("address_notes"), datatype: "text"}]};
      if (typeof item !== "undefined") {
        if (item.id === null) {
          address = update(address, { options: { 
            panel: {$merge: {
              new: false, delete: false
            }} 
          }})
        }
      }
      return address;
    },

    bank: (item) => {
        var bank = {
          options: {
            title: app.getText("title_bank"),
            title_field: "transnumber",
            icon: "money",
            fieldvalue: true,
            pattern: true,
            panel: {arrow:true, more:true, trans:true, create:false,
              bookmark:["editor","trans","transnumber"], help:"payment"}},
          view: {
            payment: {
              type: "table",
              icon: "list",
              title: app.getText("item_view"),
              data: "payment",
              total:{
                expense: app.getText("payment_expense"),
                income: app.getText("payment_income"),
                balance: app.getText("payment_balance")
              },
              fields: {
                rid: {fieldtype:'integer', label: app.getText("payment_item")},
                paiddate: {fieldtype:'date', label: app.getText("payment_paiddate2")},
                amount: {fieldtype:'float', label: app.getText("payment_amount")},
                notes: {fieldtype:'string', label: app.getText("payment_description")}}
            },
            payment_link: {
              type:"list",
              data:"payment_link",
              icon:"file-text",
              title:app.getText("invoice_view"),
              actions: {
                new: null, 
                edit: {action: "editEditorItem", fkey: "payment_link"}, 
                delete: null}
            }
          },
          rows: [
            {rowtype:"col3", columns: [
              {name:"ref_transnumber", label:app.getText("document_ref_transnumber"), datatype:"string"},
              {name:"crdate", label:app.getText("bank_crdate"), datatype:"date", disabled:"false"},
              {name:"transtate", label:app.getText("document_transtate"), datatype:"select", empty:"false",
                map: {source:"transtate", value:"id", text:"groupvalue", label:"state"}}]},
            {rowtype:"col3", columns: [
              {name:"transdate", label:app.getText("bank_transdate"), datatype:"date"},
              {name:"place_id", label:app.getText("payment_place_bank"), datatype:"selector",
                empty:"false", map:{seltype:"place_bank", table:"trans", fieldname:"place_id", 
                lnktype:"place", transtype:"", label_field:"planumber"}},
              {name:"closed", label:app.getText("document_closed"), datatype:"flip"}]},
            {rowtype:"field", name:"notes", label:app.getText("document_notes"), datatype:"text"},
            {rowtype:"field", name:"intnotes", label:app.getText("document_intnotes"), datatype:"text"}
          ]};
        if (typeof item !== "undefined") {
          if (item.id === null) {
            bank = update(bank, {
              view: {},
              options: { 
                panel: {$merge: {
                  arrow: false, new: false, delete: false, 
                  report: false, bookmark: false, trans: false
                }} 
              }
            })  
          } else {
            if (data.edit.dataset.translink.length > 0) {
              bank.rows[0].columns[0] = {name:"id", 
                label:app.getText("document_ref_transnumber"), datatype:"link",
                map: {source:"translink", value:"ref_id_1", text:"ref_id_2",
                  label_field:"transnumber", lnktype:"trans", 
                  transtype:data.edit.dataset.translink[0].transtype}};}
          }
        }
        return bank;
      }

  }
}