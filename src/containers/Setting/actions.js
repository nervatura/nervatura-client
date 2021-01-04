import { useContext } from 'react';
import update from 'immutability-helper';
import { format } from 'date-fns'

import AppStore from 'containers/App/context'
import { useApp, getSql } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { InputForm, AuditForm, MenuForm } from 'containers/ModalForm'
import { useSql } from 'containers/Controller/Sql'
import dataset from 'containers/Controller/Dataset'
import { useForm } from 'containers/Controller/Forms'
import { useInitItem, useValidator } from 'containers/Controller/Items'
import { useTemplate } from 'containers/Controller/Template'

export const useSetting = () => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const editor = useEditor()
  const sql = useSql()
  const forms = useForm()
  const validator = useValidator()
  const initItem = useInitItem()
  const template = useTemplate()
  const showInput =  InputForm()
  const showAudit =  AuditForm()
  const showMenu = MenuForm()

  const tableValues = (type, item) => {
    let values = {}
    const baseValues = initItem({tablename: type, 
      dataset: data.setting.dataset, current: data.setting.current})
    for (const key in item) {
      if (baseValues.hasOwnProperty(key)) {
        values[key] = item[key]
      }
    }
    return values
  }

  const setSettingForm = (id, isetting) => {
    let setting = update(isetting||data.setting, {$merge: {
      current: {}
    }})
    if (id!==null) {
      let item = setting.dataset[setting.type+"_view"].filter(item => (item.id === parseInt(id,10)))[0]
      setting = update(setting, {$merge: {
        dirty: false,
        current: { form: item }
      }})
      if(setting.ntype === "fieldvalue"){
        setting = update(setting, { current: {$merge: {
          fieldvalue: {
            rowtype: 'fieldvalue',
            id: item.id, 
            //name: 'fieldvalue_value', 
            fieldname: item.fieldname, 
            fieldvalue_value: item.value, 
            fieldvalue_notes: item.notes || '',
            label: item.lslabel, 
            description: (item.fieldtype === 'valuelist') ? item.valuelist.split("|") : item.value, 
            disabled: 'false',
            fieldtype: item.fieldtype, 
            datatype: (item.fieldtype === 'urlink') ? 'text' : item.fieldtype
          }
        }}})
      }
    } else {
      setting = update(setting, {$merge: {
        dirty: ((setting.audit==="all") || (setting.audit==="update")) ? true : false,
        current: { form: initItem({tablename: setting.type, 
          dataset: setting.dataset, current: setting.current}) }
      }})
    }
    if((setting.type === "usergroup") && (setting.current.form.transfilter === null)){
      setting.current.form.transfilter = setting.dataset.transfilter.filter(
        item => (item.groupvalue === "all"))[0].id
    }
    setting = update(setting, {current : {$merge: {
      template: forms[setting.type](setting.current.form, setting)
    }}})
    setting = update(setting, {$merge: {
      panel: setting.current.template.options.panel
    }})
    if (setting.audit === "readonly") {
      setting.panel.save = false
    }
    if (setting.audit !== "all") {
      setting.panel.delete = false;
      setting.panel.new = false;
    }
    setData("setting", setting)
  }

  const setPasswordForm = (username) => {
    const data = {
      username: username, password_1: "", password_2: "" 
    }
    const form = forms.password(data)
    let setting = {
      type: "password", 
      dataset: {}, 
      current: {
        form: data,
        template: form
      },
      panel: form.options.panel,
      caption: form.options.title,
      icon: form.options.icon,
      filter: "", 
      result: [], 
      dirty: false,
      view: {
        type: "password",
        result: []
      }
    }
    setData("setting", setting)
    setData("current", { module: "setting" })
  }

  const changePassword = async () => {
    const { username, password_1, password_2 } = data.setting.current.form
    if (username === "" || username === null) {
      return app.showToast({ type: "error",
        title: app.getText("msg_warning"), 
        message: app.getText("ms_password_username") })
    }
    if (password_1 !== password_2) {
      return app.showToast({ type: "error",
        title: app.getText("msg_warning"), 
        message: app.getText("ms_password_pswerr") })
    }
    const options = {
      method: "POST",
      data: { 
        username: username,
        password: password_1,
        confirm: password_2
      } 
    }
    const result = await app.requestData("/auth/password", options)
    if(result && result.error){
      return app.resultError(result)
    }
    app.showToast({ type: "success",
      title: app.getText("msg_warning"), 
      message: app.getText("msg_password_ok") })
  }

  const setProgramForm = () => {
    const template = forms.program()
    let setting = update({}, {$set: {
      type: "program", 
      dataset: {}, 
      current: {
        form: {
          paginationPage: app.getSetting("paginationPage"),
          history: app.getSetting("history"),
          page_size: app.getSetting("page_size"),
          export_sep: app.getSetting("export_sep"),
          dateFormat: app.getSetting("dateFormat"),
          calendar: app.getSetting("calendar")
        },
        template: template
      }, 
      filter: "", 
      result: [], 
      dirty: false,
      panel: null,
      caption: template.options.title,
      icon: template.options.icon,
      view: {
        type: "program",
        result: []
      }
    }})
    setData("setting", setting)
    setData("current", { module: "setting" })
  }

  const setSettingData = (options) => {
    const form = forms[options.type]()
    const audit = app.getAuditFilter(options.type)[0]
    let setting = update(options, {$merge: {
      current: (options.type === "log") ? {
        form: initItem({ tablename: "log" }),
        template: form
      } : null,
      panel: null,
      filter: "",
      result: [],
      ntype: form.options.data,
      caption: form.options.title,
      icon: form.options.icon,
      view: {
        type: form.view.setting.type,
        result: options.dataset[options.type+"_view"],
        fields: (form.view.setting.fields) ? form.view.setting.fields : null
      },
      actions: {
        new: (audit !== "all") ? null : form.view.setting.actions.new, 
        edit: form.view.setting.actions.edit, 
        delete: (audit !== "all") ? null : form.view.setting.actions.delete
      },
      audit: audit,
      template: null
    }})
    setData("setting", setting)
    setData("current", { module: "setting" })
    if(((options.type === "usergroup") || (options.type === "ui_menu")) && options.id) {
      setViewActions({action: "editItem", setting: setting}, { id: options.id })
    } else if(typeof options.id !== "undefined"){
      setSettingForm(options.id, setting)
    }
  }

  const loadSetting = async (options) => {
    let setting = update(options, {$merge: {
      dataset: {},
      dirty: false
    }})
    if(dataset[setting.type]){
      let views = []
      dataset[setting.type]().forEach(info => {
        let _sql = {}
        if(info.infoType === "table"){
          _sql = { select:["*"], from: info.classAlias }
          if(info.where){
            _sql.where = info.where
          }
          if(info.order){
            _sql.order_by = info.order
          }
        } else {
          if (typeof sql[setting.type][info.sqlKey] !== "undefined") {
            _sql = sql[setting.type][info.sqlKey](setting.type)
          } else if (typeof sql[setting.type][info.infoName] !== "undefined") {
            _sql = sql[setting.type][info.infoName](setting.type)
          } else {
            _sql = sql["all"][info.infoName](setting.type)
          }
        }
        const sqlInfo = getSql(data.login.data.engine, _sql)
        if( (setting.id !== null) || (sqlInfo.prmCount === 0)){
          views = update(views, {$push: [{
            key: info.infoName,
            text: sqlInfo.sql,
            values: ((sqlInfo.prmCount>0) && (setting.id !== null)) ? Array(sqlInfo.prmCount).fill(setting.id) : []
          }]})
        } else {
          setting = update(setting, { dataset: {$merge: {
            [info.infoName]: []
          }}})
        }
      })

      let params = { method: "POST", data: views }
      let view = await app.requestData("/view", params)
      if(view.error){
        return app.resultError(view)
      }
      setting = update(setting, {dataset: {
        $merge: view
      }})
      if ((setting.type === "template") && (typeof setting.id !== "undefined")) {
        return template.setTemplate(setting) 
      }
    }
    setSettingData(setting)
  }

  const saveSetting = async () => {
    let setting = update(data.setting, {})

    let values = tableValues(setting.ntype, setting.current.form)
    values = await validator(setting.ntype, values)
    if(values.error){
      return app.resultError(values)
    }

    let result = await app.requestData("/"+setting.ntype, { method: "POST", data: [values] })
    if(result.error){
      app.resultError(result)
      return null
    }
    if (setting.current.form.id === null) {
      setting = update(setting, {current: { form: {$merge: {
        id: result[0]
      }}}})
    }
    setting = update(setting, {$merge: {
      dirty: false
    }})
    if (setting.type === "usergroup") {
      const transfilter_name = data.login.data.groups.filter(
        item => (item.id === setting.current.form.transfilter))[0].groupvalue
      if((setting.current.form.translink !== null) || (transfilter_name !== "all")){
        const link = update(
          initItem({tablename: "link", dataset: setting.dataset, current: setting.current}),
          {$merge: {
            id: setting.current.form.translink,
            nervatype_1: data.login.data.groups.filter(
              (item)=>((item.groupname === "nervatype") && (item.groupvalue === "groups")))[0].id,
            ref_id_1: setting.current.form.id,
            nervatype_2: data.login.data.groups.filter(
              (item)=>((item.groupname === "nervatype") && (item.groupvalue === "groups")))[0].id,
            ref_id_2: setting.current.form.transfilter
          }}
        )
        result = await app.requestData("/link", { method: "POST", data: [link] })
        if(result.error){
          app.resultError(result)
          return null
        }
      }
    }
    return setting
  }

  const deleteSetting = (item) => {
    const deleteData = async () => {
      const path = (data.setting.type === "usergroup") ? "/groups" : "/"+data.setting.type
      const result = await app.requestData(path, 
        { method: "DELETE", query: { id: item.id } })
      if(result && result.error){
        return app.resultError(result)
      }
      loadSetting({type: data.setting.type})
    }
    showInput({
      title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
      infoText: app.getText("msg_delete_info"), 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      cbCancel: () => {
        setData("current", { modalForm: null })
      },
      cbOK: (value) => {
        setData("current", { modalForm: null }, async () => {
          if (typeof sql[data.setting.type]["delete_state"] !== "undefined") {
            const sqlInfo = getSql(data.login.data.engine, sql[data.setting.type]["delete_state"]())
            const params = { 
              method: "POST", 
              data: [{ 
                key: "state",
                text: sqlInfo.sql,
                values: Array(sqlInfo.prmCount).fill(item.id)
              }]
            }
            let view = await app.requestData("/view", params)
            if(view.error){
              return app.resultError(view)
            }
            if (view.state[0].sco > 0) {
              app.showToast({ type: "error",
                title: app.getText("msg_warning"), 
                message: app.getText("msg_integrity_err") })
            } else {
              deleteData()
            }
          } else {
            deleteData()
          }
        })
      }
    })
  }

  const loadLog = async () => {
    let setting = update(data.setting, {view: {$merge: {
      result: []
    }}})
    let _log = sql.log.result()
    let paramList = []
    if (!["login", "logout"].includes(setting.current.form.logstate)){
      _log.inner_join.push(
        ["groups nt","on",[["l.nervatype","=","nt.id"],
          ["and","nt.groupvalue","=","?"]]])
      paramList.push(setting.current.form.nervatype)
      switch (setting.current.form.nervatype) {
        case "":
          return app.showToast({ type: "error",
            title: app.getText("msg_warning"), 
            message: app.getText("msg_required")+" "+app.getText("log_nervatype") })
        case "customer":
          _log.inner_join.push(["customer c","on",["l.ref_id","=","c.id"]])
          _log.select[4] = "c.custnumber as refnumber";
          break;
        case "employee":
          _log.inner_join.push(["employee em","on",["l.ref_id","=","em.id"]])
          _log.select[4] = "em.empnumber as refnumber";
          break;
        case "event":
          _log.inner_join.push(["event ev","on",["l.ref_id","=","ev.id"]])
          _log.select[4] = "ev.calnumber as refnumber";
          break;
        case "place":
          _log.inner_join.push(["place p","on",["l.ref_id","=","p.id"]])
          _log.select[4] = "p.planumber as refnumber";
          break;
        case "product":
          _log.inner_join.push(["product p","on",["l.ref_id","=","p.id"]])
          _log.select[4] = "p.partnumber as refnumber";
          break;
        case "project":
          _log.inner_join.push(["project p","on",["l.ref_id","=","p.id"]])
          _log.select[4] = "p.pronumber as refnumber";
          break;
        case "tool":
          _log.inner_join.push(["tool t","on",["l.ref_id","=","t.id"]])
          _log.select[4] = "t.serial as refnumber";
          break;
        case "trans":
          _log.inner_join.push(["trans t","on",["l.ref_id","=","t.id"]])
          _log.select[4] = "t.transnumber as refnumber";
          break;
        default:
          break;
      }
    }

    _log.where.push(["ls.groupvalue","=","?"])
    paramList.push(setting.current.form.logstate)
    
    if (setting.current.form.empnumber && setting.current.form.empnumber !== "") {
      _log.where.push(["and","lower(e.empnumber)","like","{CCS}{JOKER}{SEP}lower('"+
        setting.current.form.empnumber+"'){SEP}{JOKER}{CCE}"]);
    }
    
    if (setting.current.form.fromdate && setting.current.form.fromdate !== "") {
      _log.where.push(["and","{FMS_DATE}l.crdate{FME_DATE}",">=","?"])
      paramList.push(setting.current.form.fromdate)
    }
    
    if (setting.current.form.todate && setting.current.form.todate !== "") {
      _log.where.push(["and","{FMS_DATE}l.crdate{FME_DATE}","<=","?"]);
      paramList.push(setting.current.form.todate)
    }

    const params = { 
      method: "POST", 
      data: [{ 
        key: "log",
        text: getSql(data.login.data.engine, _log).sql,
        values: paramList
      }]
    }
    let view = await app.requestData("/view", params)
    if(view.error){
      return app.resultError(view)
    }
    setting = update(setting, {view: {$merge: {
      result: view.log
    }}})
    setData("setting", setting)
  }

  const checkSetting = (options, cbKeyTrue, cbKeyFalse) => {
    const cbNext = (cbKey) =>{
      switch (cbKey) {
        case "LOAD_SETTING":
          loadSetting(options)
          break;
        case "SETTING_FORM":
          setSettingForm(options.id)
          break;
        case "NEW_BLANK":
          template.newBlank()
          break;
        case "NEW_SAMPLE":
          template.newSample()
          break;
        default:
          break;
      }
    }
    if (data.setting.dirty === true) {
        showInput({
          title: app.getText("msg_warning"), message: app.getText("msg_dirty_text"),
          infoText: app.getText("msg_dirty_info"), 
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          cbCancel: () => {
            setData("current", { modalForm: null }, ()=>{
              if (cbKeyFalse) {
                setData("edit", { dirty: false }, ()=>{
                  cbNext(cbKeyFalse)
                })
              } else {
                cbNext(cbKeyTrue)
              }
            })
          },
          cbOK: (value) => {
            setData("current", { modalForm: null }, async ()=>{
              if (data.setting.type === "template_editor"){
                const setting = await template.saveTemplate()
                if(setting){
                  return setData("setting", setting, ()=>{
                    cbNext(cbKeyTrue)
                  })
                }
              } else {
                const setting = await saveSetting()
                if(setting){
                  return setData("setting", setting, ()=>{
                    cbNext(cbKeyTrue)
                  })
                }
              }
              return cbNext(cbKeyFalse)
            })
          }
        })
    } else if (cbKeyFalse) {
      cbNext(cbKeyFalse);
    } else {
      cbNext(cbKeyTrue);
    }
  }

  const setViewActions = async (params, _row) => {
    const row = _row || {}
    switch (params.action) {
      case "newItem":
        checkSetting({ type: data.setting.type, id: null }, 'LOAD_SETTING')
        break;

      case "editItem":
        switch (data.setting.type) {
          case "template":
            checkSetting({ type: data.setting.type, id: row.id }, 'LOAD_SETTING')
            break;
          
          case "place":
            editor.checkEditor({ntype: data.setting.type, ttype: null, 
              id: row.id || null}, 'LOAD_EDITOR')
            break;
         
          case "usergroup":
            const audit_options = { 
              method: "POST", 
              data: [{ 
                key: "audit",
                text: getSql(data.login.data.engine, sql.usergroup.audit()).sql,
                values: [row.id]
              }]
            }
            let audit_view = await app.requestData("/view", audit_options)
            if(audit_view.error){
              return app.resultError(audit_view)
            }
            const audit_setting = update(params.setting||data.setting, {dataset: {$merge: {
              audit: audit_view.audit
            }}})
            setSettingForm(row.id, audit_setting)
            break;
          
          case "ui_menu":
            const menufields_options = { 
              method: "POST", 
              data: [{ 
                key: "menufields",
                text: getSql(data.login.data.engine, sql.ui_menu.ui_menufields()).sql,
                values: [row.id]
              }]
            }
            const menufields_view = await app.requestData("/view", menufields_options)
            if(menufields_view.error){
              return app.resultError(menufields_view)
            }
            const menufields_setting = update(params.setting||data.setting, {dataset: {$merge: {
              ui_menufields: menufields_view.menufields
            }}})
            setSettingForm(row.id, menufields_setting)
            break;

          default:
            setSettingForm(row.id)
            break;
        }
        break;

        case "deleteItem":
        deleteSetting(row)
        break;

      case "deleteTemplate":
        showInput({
          title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
          infoText: app.getText("msg_delete_info"), 
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          cbCancel: () => {
            setData("current", { modalForm: null })
          },
          cbOK: (value) => {
            setData("current", { modalForm: null }, async ()=>{
              const result  = await template.deleteTemplate(row.id)
              if(result){
                loadSetting({type: "template"})
              }
            })
          }
        })
        break;

      case "editAudit":
        let audit = row
        if(!audit.id){
          audit = update(
            initItem({tablename: "link", dataset: data.setting.dataset, current: data.setting.current}),
            {$merge: {
              usergroup: data.setting.current.form.id,
              nervatype: data.setting.dataset.nervatype.filter(
                (item)=>(item.groupvalue === "customer"))[0].id,
              inputfilter: data.setting.dataset.inputfilter.filter(
                (item)=>(item.groupvalue === "all"))[0].id
            }}
          )
        }
        showAudit({ 
          ...audit,
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          updateAudit: async (audit) => {
            if(["trans", "report","menu"].includes(audit.nervatype_name) && (audit.subtype === null)){
              return app.showToast({ type: "error",
                title: app.getText("msg_warning"), 
                message: app.getText("msg_input_invalid")+" "+audit.nervatype_name })
            }
            let result = await app.requestData("/ui_audit", { 
              method: "POST", data: [tableValues("audit", audit)] })
            if(result.error){
              return app.resultError(result)
            }
            setData("current", { modalForm: null }, ()=>{
              setViewActions({action: "editItem"}, data.setting.current.form)
            })
          }
        })
        break;

      case "editMenuField":
        let menufields = row
        if(!menufields.id){
          menufields = update(
            initItem({tablename: "ui_menufields", dataset: data.setting.dataset, current: data.setting.current}),
            {$merge: {
              menu_id: data.setting.current.form.id,
              fieldtype: data.setting.dataset.fieldtype.filter(
                (item)=>(item.groupvalue === "string"))[0].id,
              orderby: data.setting.dataset.ui_menufields.length
            }}
          )
        }
        showMenu({ 
          ...menufields,
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          updateMenu: async (menufield) => {
            if((menufield.fieldname === null) || (menufield.fieldname === "")){
              return app.showToast({ type: "error",
                title: app.getText("msg_warning"), 
                message: app.getText("msg_input_invalid")+" "+app.getText("menufields_fieldname") })
            } else if((menufield.description === null) || (menufield.description === "")){
              return app.showToast({ type: "error",
                title: app.getText("msg_warning"), 
                message: app.getText("msg_input_invalid")+" "+app.getText("menufields_description") })
            }
            let result = await app.requestData("/ui_menufields", { 
              method: "POST", data: [tableValues("ui_menufields", menufield)] })
            if(result.error){
              return app.resultError(result)
            }
            setData("current", { modalForm: null }, ()=>{
              setViewActions({action: "editItem"}, data.setting.current.form)
            })
          }
        })
        break;
      
      case "deleteItemRow":
        showInput({
          title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
          infoText: app.getText("msg_delete_info"), 
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          cbCancel: () => {
            setData("current", { modalForm: null })
          },
          cbOK: (value) => {
            setData("current", { modalForm: null }, async ()=>{
              const result = await app.requestData(
                "/"+params.table, { method: "DELETE", query: { id: row.id } })
              if(result && result.error){
                return app.resultError(result)
              }
              setViewActions({action: "editItem"}, data.setting.current.form)
            })
          }
        })
        break;

      default:
        break;
    }
  }

  const createTemplate = (setting) => {
    let reportkey = setting.dataset.template[0].ntype;
    if (reportkey === "trans") {
      reportkey = setting.dataset.template[0].ttype+"_"+setting.dataset.template[0].dirtype;
    }
    reportkey += "_"+format(new Date(),"yyyyMMddHHmm")
    showInput({
      title: app.getText("template_label_new"), message: reportkey,
      value: setting.dataset.template[0].repname, 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      cbCancel: () => {
        setData("current", { modalForm: null })
      },
      cbOK: (value) => {
        setData("current", { modalForm: null }, async ()=>{
          let values = update(tableValues("report", setting.dataset.template[0]), {$merge: {
            id: null,
            reportkey: reportkey,
            repname: value,
            report: template.json2xml({template: setting.template.template})
          }})
          values = update(values, {
            $unset: ["orientation", "size"]
          })
          let result = await app.requestData("/ui_report", { method: "POST", data: [values] })
          if(result.error){
            return app.resultError(result)
          }
          const id = result[0]

          values = []
          for (let index = 0; index < setting.dataset.template_reportfields.length; index++) {
            const reportfield = setting.dataset.template_reportfields[index]
            values.push(update(tableValues("reportfields", reportfield), {$merge: {
              id: null,
              report_id: id,
              fieldtype: reportfield.fieldtype_id, 
              wheretype: reportfield.wheretype_id
            }}))
          }
          if(values.length > 0){
            result = await app.requestData("/ui_reportfields", { method: "POST", data: values })
            if(result.error){
              return app.resultError(result)
            }
          }

          values = []
          for (let index = 0; index < setting.dataset.template_sources.length; index++) {
            const reportsources = setting.dataset.template_sources[index]
            values.push(update(tableValues("reportsources", reportsources), {$merge: {
              id: null,
              report_id: id
            }}))
          }
          if(values.length > 0){
            result = await app.requestData("/ui_reportsources", { method: "POST", data: values })
            if(result.error){
              return app.resultError(result)
            }
          }

          values = []
          for (let index = 0; index < setting.dataset.template_message.length; index++) {
            const message = setting.dataset.template_message[index]
            values.push(update(tableValues("message", message), {$merge: {
              id: null,
              secname: message.secname.replace(
                setting.dataset.template[0].reportkey, reportkey)
            }}))
          }
          if(values.length > 0){
            result = await app.requestData("/ui_message", { method: "POST", data: values })
            if(result.error){
              return app.resultError(result)
            }
          }

          checkSetting({ type: "template", id: id }, 'LOAD_SETTING')
        })
      }
    })
  }

  return {
    checkSetting: checkSetting,
    loadSetting: loadSetting,
    saveSetting: saveSetting,
    setPasswordForm: setPasswordForm,
    setViewActions: setViewActions,
    changePassword: changePassword,
    setProgramForm: setProgramForm,
    deleteSetting: deleteSetting,
    loadLog: loadLog,
    createTemplate: createTemplate
  }
}