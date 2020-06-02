import { useContext } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp, getSql } from 'containers/App/actions'
import dataset from './dataset'
import { useSql } from './sql'
//import { useForm } from './forms'

export const useEditor = () => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const sql = useSql()
  //const forms = useForm()
  
  const setEditor = (form, options) => {

  }

  const loadEditor = async (params) => {
    let { ntype, ttype, id } = params;
    let proitem;
    if (id===null) {
      proitem = app.initItem({tablename: ntype, transtype: ttype, dataset: {}});
    };
    let edit = update({}, {$set: {
      dataset: { },
      current: { type: ntype, transtype: ttype },
      dirty: false,
      form_dirty: false
    }})
    let views = []
    dataset[ntype](ttype).forEach(info => {
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
        if (typeof sql[ntype][info.sqlKey] !== "undefined") {
          _sql = sql[ntype][info.sqlKey](ntype)
        } else if (typeof sql[ntype][info.infoName] !== "undefined") {
          _sql = sql[ntype][info.infoName](ntype)
        } else {
          _sql = sql["all"][info.infoName](ntype)
        }
      }
      const sqlInfo = getSql(data.login.data.engine, _sql)
      if( (id !== null) || (sqlInfo.prmCount === 0)){
        views = update(views, {$push: [{
          key: info.infoName,
          text: sqlInfo.sql,
          values: ((sqlInfo.prmCount>0) && (id !== null)) ? Array(sqlInfo.prmCount).fill(id) : []
        }]})
      } else {
        edit = update(edit, { dataset: {$merge: {
          [info.infoName]: []
        }}})
      }
    })

    if(views.length > 0){
      if (ntype !== "report") {
        dataset["report"]().forEach(info => {
          let view = {
            key: info.infoName,
            sql: sql.report[info.infoName](ntype),
            values: []
          }
          if(info.infoName === "report"){
            view.values.push(data.login.data.employee.usergroup)
            view.values.push(edit.current.type)
          } else if(info.infoName === "message"){
            view.values.push(edit.current.type)
            view.values.push(edit.current.type)
          } else {
            view.values.push(edit.current.type)
          }
          if (edit.current.type ==="trans") {
            const _where = ["and","r.transtype","=",[[],{select:["id"], from:"groups", 
                where:[["groupname","=","'transtype'"],["and","groupvalue","=","?"]]}]]
            if(info.infoName === "message"){
              view.sql.where[0][2][0].from[0][0][0].where[0].push(_where)
              view.sql.where[0][2][0].from[0][0][1].where[0].push(_where)
              view.values.splice(1, 0, edit.current.transtype)
            } else {
              view.sql.where.push(_where)
            }
            view.values.push(edit.current.transtype)
          }
          views = update(views, {$push: [{
            key: view.key,
            text: getSql(data.login.data.engine, view.sql).sql,
            values: view.values
          }]})
        })
      }

      let options = { method: "POST", data: views }
      let view = await app.requestData("/view", options)
      if(view.error){
        return app.resultError(view)
      }
      edit = update(edit, {$merge: {
        dataset: view
      }})
      if (id===null) {
        if (proitem === null) {
          proitem = app.initItem({tablename: ntype, transtype: ttype, dataset: edit.dataset});
        }
        if (ttype === "delivery") {
          proitem = update(proitem, {$merge: {
            direction: edit.dataset.groups.filter((group)=> {
              return ((group.groupname === "direction") && (group.groupvalue === "transfer"))
            })[0].id
          }})
        }
        edit = update(edit, { dataset: {$merge: {
          [ntype]: [proitem]
        }}})
      }
      setData("edit", edit)
      if (!params.cb_key || (params.cb_key ==="SET_EDITOR")) {
        if (ntype==="trans") {
          if(options.shipping){
            //setEditor(params, forms["shipping"](edit.dataset[ntype][0]))
          } else {
            //setEditor(params, forms[ttype](edit.dataset[ntype][0]))
          }
        } else {
          //setEditor(params, forms[ntype](edit.dataset[ntype][0]))
        }
      }
    } else {
      edit = update(edit, { dataset: {$merge: {
        [ntype]: [app.initItem({ tablename: ntype, transtype: ttype, dataset: edit.dataset })]
      }}})
      setData("edit", edit)
      if (!params.cb_key || (params.cb_key ==="SET_EDITOR")) {
        //setEditor(params, forms[ntype]())
      }
    }
  }

  const checkEditor = (options, cbKeyTrue, cbKeyFalse) => {
    const cbNext = (cbKey) =>{
      switch (cbKey) {
        case "LOAD_EDITOR":
          loadEditor(options);
          break;
        case "SET_EDITOR_ITEM":
          //dispatch(setEditorItem(options));
          break;
        case "LOAD_FORMULA":
          //dispatch(appData("modal", { type: 'formula', params: {formula: ""} }))
          break;
        case "NEW_FIELDVALUE":
          //dispatch(newFieldvalue(options.fieldname));
          break;
        case "REPORT_SETTINGS":
          //dispatch(setReportSettings());
          break;
        case "CREATE_TRANS":
          //dispatch(createTrans(options));
          break;
        case "CREATE_TRANS_OPTIONS":
          //dispatch(createTransOptions());
          break;
        default:
          break;
      }
    }
    if ((data.edit.dirty === true && data.edit.current.item) ||
      (data.edit.dirty === true && (data.edit.current.type==="template")) || 
      (data.edit.form_dirty === true && data.edit.current.form)) {

        app.showToast({ type: "input", 
          title: app.getText("msg_warning"), message: app.getText("msg_dirty_text"),
          infoText: app.getText("msg_dirty_info"),
          cbCancel: ()=>{
            if (cbKeyFalse) {
              setData("edit", { dirty: false, form_dirty: false })
              cbNext(cbKeyFalse)
            } else {
              cbNext(cbKeyTrue)
            }
          },
          cbOK: (value)=>{
            if (data.edit.form_dirty) {
              //dispatch(tableValidator(page_edit.current.form, 
              //  ()=>{
              //    dispatch(saveEditorForm(cbKeyTrue, cbKeyFalse, options));}));
            } else {
              if (data.edit.current.type==="template"){
                //dispatch(saveTemplate(callback));
              } else {
                //dispatch(saveEditor(cbKeyTrue, cbKeyFalse, options));
              }
            }
          }
        })
    } else if (cbKeyFalse) {
      cbNext(cbKeyFalse);
    } else {
      cbNext(cbKeyTrue);
    }
  }

  return {
    checkEditor: checkEditor,
    loadEditor: loadEditor,
    setEditor: setEditor
  }
}