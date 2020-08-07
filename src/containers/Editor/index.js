import React, { useContext, useState, useEffect, useRef } from 'react';
import update from 'immutability-helper';
import { convertToHTML, convertFromHTML } from 'draft-convert'
import { EditorState, RichUtils } from 'draft-js';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { useInitItem } from './items'
import { Preview, Editor } from './Editor';

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const editor = useEditor()
  const app = useApp()
  const initItem = useInitItem()

  const [state] = useState({
    engine: data.login.data.engine,
    theme: data.session.theme,
    ui: data.ui
  })

  state.data = data.edit
  
  state.viewerRef = useRef(null)
  state.canvasRef = useRef(null)
  
  useEffect(() => {
    const { scale, page } = data.edit.preview || {}
    if (page) {
      const viewer = state.viewerRef.current
      const canvas = state.canvasRef.current
      const context = canvas.getContext('2d')
      let viewport = page.getViewport({ scale: 1 })

      if(scale === "page-width"){
        viewport = page.getViewport({ scale: (viewer.clientWidth-48)/viewport.width })
      } else if(scale !== 1){
        viewport = page.getViewport({ scale: scale })
      }

      canvas.width = viewport.width
      canvas.height = viewport.height

      page.render({
        canvasContext: context,
        viewport
      })

    }
  },[state.viewerRef, state.canvasRef, data.edit.preview])

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.formatNumber = (number, digit) => {
    const value = (!isNaN(parseFloat(number))) ? parseFloat(number) : 0
    return value.toFixed(digit).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  state.changeData = (key, value) => {
    setData("edit", { [key]: value })
  }

  state.onPaginationSelect = (page, size) => {
    const pages = Math.ceil(
      size / data.edit.current.pagination.perPage
    );
    const _page = Math.min(Math.max(page, 1), pages)
    const current = update(data.edit.current, {$merge: {
      pagination: update(data.edit.current.pagination, { $merge: {
        page: _page
      }})
    }})
    setData("edit", { current: current })
  }

  state.checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    editor.checkEditor(options, cbKeyTrue, cbKeyFalse)
  }

  state.currentView = (key) => {
    const current = update(data.edit.current, {$merge: {
      view: (data.edit.current.view === key) ? "" : key
    }})
    setData("edit", { current: current })
  }

  const loadPrice = async (trans, item) => {
    const options = { method: "POST", 
      data: {
        key: "getPriceValue",
        values: {
          vendorprice: item.vendorprice, 
          product_id: item.product_id,
          posdate: trans.transdate, 
          curr: trans.curr, 
          qty: item.qty, 
          customer_id: trans.customer_id
        }
      }
    }
    return app.requestData("/function", options)
  }

  const calcPrice = (_calcmode, item) => {
    const round = (n,dec) => {
      n = parseFloat(n);
      if(!isNaN(n)){
        if(!dec) dec= 0;
        let factor= Math.pow(10,dec);
        return Math.floor(n*factor+((n*factor*10)%10>=5?1:0))/factor;
      } else {
        return n
      }
    }

    let rate = data.edit.dataset.tax.filter(tax => (tax.id === parseInt(item.tax_id,10)))[0]
    rate = (typeof rate !== "undefined") ? rate.rate : 0
    let digit = data.edit.dataset.currency.filter(currency => 
      (currency.curr === data.edit.current.item.curr))[0]
    digit = (typeof digit !== "undefined") ? digit.digit : 2
    
    let netAmount = 0; let vatAmount = 0; let amount = 0; let fxPrice = 0;
    switch(_calcmode) {
      case "fxprice":
        fxPrice = parseFloat(item.fxprice)
        netAmount = round(fxPrice*(1-parseFloat(item.discount)/100)*parseFloat(item.qty),parseInt(digit,10))
        vatAmount = round(fxPrice*(1-parseFloat(item.discount)/100)*parseFloat(item.qty)*parseFloat(rate),parseInt(digit,10))
        amount = round(netAmount+vatAmount, parseInt(digit,10))
        break;
        
      case "netamount":
        netAmount = parseFloat(item.netamount)
        if (parseFloat(item.qty)!==0) {
          fxPrice = round(netAmount/(1-parseFloat(item.discount)/100)/parseFloat(item.qty),parseInt(digit,10))
          vatAmount = round(netAmount*parseFloat(rate),parseInt(digit,10))
        }
        amount = round(netAmount+vatAmount,parseInt(digit,10))
        break;

      case "amount":
        amount = parseFloat(item.amount)
        if (parseFloat(item.qty)!==0) {
          netAmount = round(amount/(1+parseFloat(rate)),parseInt(digit,10))
          vatAmount = round(amount-netAmount,parseInt(digit,10))
          fxPrice = round(netAmount/(1-parseFloat(item.discount)/100)/parseFloat(item.qty),parseInt(digit,10))
        }
        break;
      default:
    }
    return update(item, {$merge: {
      fxprice: fxPrice,
      netamount: netAmount,
      vatamount: vatAmount,
      amount: amount
    }})
  }

  state.editItem = async (options) => {
    let edit = update({}, {$set: data.edit})
    if((options.name === "fieldvalue_value") || (options.name === "fieldvalue_notes") || (options.name === "fieldvalue_deleted")){
      const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.id === options.id))
      if( (fieldvalue_idx > -1) && ((edit.audit==="all") || (edit.audit==="update"))){
        edit = update(edit, {$merge: {
          dirty: true,
        }})
        edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
          [options.name.split("_")[1]]: (options.name === "fieldvalue_deleted") ? 1 : options.value.toString()
        }}}}})
      }
    } else if (edit.current.form) {
      edit = update(edit, {$merge: {
        form_dirty: true
      }})
      if (typeof edit.current.form[options.name] !== "undefined") {
        edit = update(edit, {current: {form: {$merge: {
          [options.name]: options.value
        }}}})
      }
      switch (edit.current.form_type) {
        case "item":
          if (options.name === "product_id" && (typeof options.item !== "undefined")) {
            edit = update(edit, {current: {form: {$merge: {
              description: options.item.description,
              unit: options.item.unit,
              tax_id: parseInt(options.item.tax_id,10)
            }}}})
            if (edit.current.form.qty === 0) {
              edit = update(edit, {current: {form: {$merge: {
                qty: 1
              }}}})
            }
            const price = await loadPrice(edit.current.item, edit.current.form)
            if(price.error){
              return app.resultError(price)
            }
            edit = update(edit, {current: {form: {$merge: {
              fxprice: !isNaN(parseFloat(price.price)) ? parseFloat(price.price) : 0,
              discount: !isNaN(parseFloat(price.discount)) ? parseFloat(price.discount) : 0
            }}}})
            edit = update(edit, {current: {$merge: {
              form : calcPrice("fxprice", edit.current.form)
            }}})
          } else {
            switch(options.name) {
              case "qty":
                if (parseFloat(edit.current.form.fxprice) === 0) {
                  const price = await loadPrice(edit.current.item, edit.current.form)
                  if(price.error){
                    return app.resultError(price)
                  }
                  edit = update(edit, {current: {form: {$merge: {
                    fxprice: !isNaN(parseFloat(price.price)) ? parseFloat(price.price) : 0,
                    discount: !isNaN(parseFloat(price.discount)) ? parseFloat(price.discount) : 0
                  }}}})
                }
                edit = update(edit, {current: {$merge: {
                  form : calcPrice("fxprice", edit.current.form)
                }}})
                break;
              case "fxprice":
              case "tax_id":
              case "discount":
                edit = update(edit, {current: {$merge: {
                  form : calcPrice("fxprice", edit.current.form)
                }}})
                break;
              case "amount":
                edit = update(edit, {current: {$merge: {
                  form : calcPrice("amount", edit.current.form)
                }}})
                break;
              case "netamount":
                edit = update(edit, {current: {$merge: {
                  form : calcPrice("netamount", edit.current.form)
                }}})
                break;
              default:
                break;
            }
          }
          break;
        
        case "price":
        case "discount":
          if (options.name === "customer_id") {
            edit = update(edit, {current: {$merge: {
              price_customer_id: options.value
            }}})
          }
          break;

        case "invoice_link":
          if (options.name === "ref_id_1" && (typeof options.item !== "undefined")) {
            edit = update(edit, {current: {invoice_link: {
              0: {$merge: {
                curr: options.item.curr
              }}
            }}})
          } else if ((options.name === "link_qty") || (options.name === "link_rate")) {
            edit = update(edit, { current: {$merge: {
              invoice_link_fieldvalue: editor.setFieldvalue(edit.current.invoice_link_fieldvalue, 
                options.name, edit.current.form.id, null, options.value)
            }}})
          }
          break;

        case "payment_link":
          if (options.name === "ref_id_2" && (typeof options.item !== "undefined")) {
            edit = update(edit, {current: {payment_link: {
              0: {$merge: {
                curr: options.item.curr
              }}
            }}})
          } else if ((options.name === "link_qty") || (options.name === "link_rate")) {
            edit = update(edit, { current: {$merge: {
              payment_link_fieldvalue: editor.setFieldvalue(edit.current.payment_link_fieldvalue, 
                options.name, edit.current.form.id, null, options.value)
            }}})
          }
          break;

        default:
          break;
      }
    } else {
      if ((typeof edit.current.item[options.name] !== "undefined") && (options.extend === false)) {
        edit = update(edit, {current: {item: {$merge: {
          [options.name]: options.value
        }}}})
      } else if ((typeof edit.template.options.extend !== "undefined") && (options.extend === true)) {
        edit = update(edit, {current: {extend: {$merge: {
          [options.name]: options.value
        }}}})
      }
      if((edit.audit==="all") || (edit.audit==="update")){
        edit = update(edit, {$merge: {
          dirty: true
        }})
      }

      switch (edit.current.type){
        case "report":
          edit = update(edit, {$merge: {
            dirty: false
          }})
          if(options.name === "selected"){
            const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.id === options.id))
            if(fieldvalue_idx > -1){
              edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
                selected: options.value
              }}}}})
            }
          } else {
            const fieldvalue_idx = edit.current.fieldvalue.findIndex((item)=>(item.name === options.name))
            if(fieldvalue_idx > -1){
              edit = update(edit, { current: { fieldvalue: { [fieldvalue_idx]: {$merge: {
                value: options.value
              }}}}})
            }
          }
          break;

        case "printqueue":
          edit = update(edit, {$merge: {
            dirty: false
          }})
          edit = update(edit, { printqueue: {$merge: {
              [options.name]: options.value
          }}})
          break;

        case "trans":
          switch (options.name) {
            case "closed":
              if (options.value === 1) {
                setData("current", { input: { 
                  title: app.getText("msg_warning"), message: app.getText("msg_close_text"),
                  infoText: app.getText("msg_delete_info"),
                  cbOK: ()=>{
                    setData("current", { input: null }, ()=>{
                      edit = update(edit, { current: {$merge: {
                        closed: 1
                      }}})
                      setData("edit", edit)
                    })
                  },
                  cbCancel: (value)=>{
                    setData("current", { input: null }, ()=>{
                      edit = update(edit, { current: { item: {$merge: {
                        [options.name]: 0
                      }}}})
                      setData("edit", edit)
                    })
                  }
                }})
              }
              break;
            case "paiddate":
              edit = update(edit, { current: { item: {$merge: {
                transdate: options.value
              }}}})
              break;
            case "direction":
              if(edit.current.transtype === "cash"){
                const direction = edit.dataset.groups.filter((item)=>(item.id === options.value))[0].groupvalue
                edit = update(edit, { template: { options: {$merge: {
                  opposite: (direction === "out")
                }}}})
              }
              break;        
            case "seltype":
              edit = update(edit, { current: { 
                extend: {$merge: {
                  seltype: options.value,
                  ref_id: null,
                  refnumber: ""
                }},
                item: {$merge: {
                  customer_id: null,
                  employee_id: null,
                  ref_transnumber: null
                }}
              }})
              break;
            case "ref_id":
              edit = update(edit, { current: { extend: {$merge: {
                  refnumber: options.refnumber,
                  ntype: (edit.current.extend.seltype === "transitem") ? "trans" : edit.current.extend.seltype,
                  transtype: (options.item && options.item.transtype) ? options.item.transtype.split("-")[0] : ""
              }}}})
              switch (edit.current.extend.seltype){
                case "customer":
                  edit = update(edit, { current: { item: {$merge: {
                    customer_id: options.value
                  }}}})
                  break;
                case "employee":
                  edit = update(edit, { current: { item: {$merge: {
                    employee_id: options.value
                  }}}})
                  break;
                case "transitem":
                  edit = update(edit, { current: { item: {$merge: {
                    ref_transnumber: options.refnumber,
                  }}}})
                  break;
                default:
                  break;}
              break;
            case "trans_wsdistance":
            case "trans_wsrepair":
            case "trans_wstotal":
            case "trans_reholiday":
            case "trans_rebadtool":
            case "trans_reother":
            case "trans_wsnote":
            case "trans_rentnote":
              edit = update(edit, { current: {$merge: {
                fieldvalue: editor.setFieldvalue(edit.current.fieldvalue, 
                  options.name, edit.current.item.id, null, options.value)
              }}})
              break;
            case "shippingdate":
            case "shipping_place_id":
              edit = update(edit, {$merge: {
                dirty: false
              }})
              edit = update(edit, { current: {$merge: {
                  [options.name]: options.value
              }}})
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    }
    setData("edit", edit)
  }

  state.noteState = (key) => {
    const edit = update(data.edit, { current: {$merge: {
      note: (["unordered-list-item","ordered-list-item"].includes(key))?
        RichUtils.toggleBlockType(data.edit.current.note, key):
        RichUtils.toggleInlineStyle(data.edit.current.note, key),
    }}})
    setData("edit", edit)
  }

  state.noteTemplate = (value) => {
    const edit = update(data.edit, { current: {$merge: {
      template: value
    }}})
    setData("edit", edit)
  }

  state.setPattern = ( key ) => {
    const updatePattern = async (values) => {
      const options = { method: "POST", data: values }
      let result = await app.requestData("/pattern", options)
      if(result.error){
        return app.resultError(result)
      }
      editor.checkEditor({ntype: data.edit.current.type, 
        ttype: data.edit.current.transtype, 
        id: data.edit.current.item.id, form:"fnote"}, 'LOAD_EDITOR')
    }
    if(key !== "new"){
      if(!data.edit.current.template || (data.edit.current.template === "")){
        return app.showToast({ type: "error", title: app.getText("msg_warning"), 
          message: app.getText("msg_pattern_missing") })
      }
    }
    switch (key) {
      case "default":
        setData("current", { input: {
          title: app.getText("msg_warning"), message: app.getText("msg_pattern_default"),
          cbOK: ()=>{
            setData("current", { input: null }, ()=>{
              let pattern = update(data.edit.dataset.pattern, {})
              pattern.forEach((element, index) => {
                pattern = update(pattern, {
                  [index]: { $merge: {
                    defpattern: (element.id === parseInt(data.edit.current.template,10)) ? 1 : 0
                  }}
                })
              });
              updatePattern(pattern)
            })
          },
          cbCancel: ()=>{
            setData("current", { input: null })
          }
        }})
        break;

      case "load":
        const pattern = data.edit.dataset.pattern.filter((item) => 
          (item.id === parseInt(data.edit.current.template,10) ))[0]
        if(pattern){
          let edit = update(data.edit, {
            current: { item: { $merge: {
              fnote: pattern.notes
            }}}
          })
          edit = update(edit, {
            current: {$merge: {
              note: EditorState.createWithContent(convertFromHTML(pattern.notes||""))
            }}
          })
          edit = update(edit, {$merge: {
            dirty: true
          }})
          setData("edit", edit)
        }
        break;

      case "save":
        setData("current", { input: {
          title: app.getText("msg_warning"), message: app.getText("msg_pattern_save"),
          cbOK: ()=>{
            setData("current", { input: null }, ()=>{
              let pattern = data.edit.dataset.pattern.filter((item) => 
                (item.id === parseInt(data.edit.current.template,10) ))[0]
              if(pattern){
                pattern = update(pattern, {$merge: {
                  notes: data.edit.current.item.fnote
                }})
                updatePattern([pattern])
              }
            })
          },
          cbCancel: ()=>{
            setData("current", { input: null })
          }
        }})
        break;
      
      case "new":
        setData("current", { input: {
          title: app.getText("msg_pattern_new"), message: app.getText("msg_pattern_name"),
          value: "",
          cbOK: (value)=>{
            setData("current", { input: null }, async ()=>{
              if(value !== ""){
                let result = await app.requestData("/pattern?filter=description;==;"+value, {})
                if(result.error){
                  return app.resultError(result)
                }
                if(result.length > 0){
                  return app.showToast({ type: "error", title: app.getText("msg_warning"), 
                    message: app.getText("msg_value_exists") })
                }
                const pattern = update(initItem({tablename: "pattern", current: data.edit.current}), {$merge: {
                  description: value,
                  defpattern: (data.edit.dataset.pattern.length === 0) ? 1 : 0
                }})
                updatePattern([pattern])
              }
            })
          },
          cbCancel: ()=>{
            setData("current", { input: null })
          }
        }})
        break;

      case "delete":
        setData("current", { input: { 
          title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
          cbOK: ()=>{
            setData("current", { input: null }, ()=>{
              let pattern = data.edit.dataset.pattern.filter((item) => 
                (item.id === parseInt(data.edit.current.template,10) ))[0]
              if(pattern){
                pattern = update(pattern, {$merge: {
                  deleted: 1,
                  defpattern: 0
                }})
                updatePattern([pattern])
              }
            })
          },
          cbCancel: ()=>{
            setData("current", { input: null })
          }
        }})
        break;
    
      default:
        break;
    }
  }
  
  state.noteChange = (editorState) => {
    let edit = update(data.edit, { current: {$merge: {
      note: editorState,
    }}})
    edit = update(edit, { current: { item: {$merge: {
      fnote: convertToHTML(editorState.getCurrentContent())
    }}}})
    edit = update(edit, {$merge: {
      dirty: true
    }})
    setData("edit", edit)
  }
  
  state.setActions = (params, row) => {
    editor.setFormActions(params, row)
  }

  if(data.edit.current.item){
    if(data.edit.preview){
      return <Preview {...state} />
    }
    return <Editor {...state} />
  }
  return <div />
}