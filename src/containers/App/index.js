import update from 'immutability-helper';

import { default as App } from "./App";
import request from './request';
import { store } from 'config/app'
import { showToast } from './toast'
import { getSql } from './adapter'
import { getQuery } from './queries'

export default class extends App {

  constructor(props) {
    super(props);

    this.state = update(store, {$merge: props.data||{} })
    this.actions = {
      setData: this.setData.bind(this),
      resultError: this.resultError.bind(this),
      requestData: this.requestData.bind(this),
      getText: this.getText.bind(this),
      setSideBar: this.setSideBar.bind(this),
      signOut: this.signOut.bind(this),
      showToast: this.showToast.bind(this),
      getSql: getSql,
      getAuditFilter: this.getAuditFilter.bind(this),
      showBrowser: this.showBrowser.bind(this),
      saveToDisk: this.saveToDisk.bind(this)
    }
    this.state = update(this.state, {$merge: {
      queries: getQuery(this.actions.getText)
    }})
  }

  setData(key, data) {
    if(key && this.state[key] && typeof data === "object" && data !== null){
      this.setState({ [key]: update(this.state[key], {$merge: data}) })
    } else if(key){
      this.setState({ [key]:  data })
    }
  }

  /* istanbul ignore next */
  getPath() {
    const path = window.location.pathname.substring(1).split("/")
    return [path[0], path.slice(1)]
  }

  getText(key, defValue) {
    const locales = this.state.session.locales
    const lang = this.state.current.lang
    if (locales[lang] && locales[lang][key]) {
      return locales[lang][key];
    }
    return defValue || locales["en"][key] || ""
  }

  onResize() {
    if((this.state.current.clientHeight !== window.innerHeight) || 
      (this.state.current.clientWidth !== window.innerWidth)){
      this.setData("current", { clientHeight: window.innerHeight, clientWidth: window.innerWidth })
    }
  }

  onScroll() {
    const scrollTop = ((document.body.scrollTop > 100) || (document.documentElement.scrollTop > 100))
    if(this.state.current.scrollTop !== scrollTop){
      this.setData("current", { scrollTop: scrollTop })
    }
  }

  async requestData(path, options, silent) {
    try {
      if (!silent)
        this.actions.setData("current", { "request": true })
      let url = this.state.session.proxy+this.state.session.basePath+path
      const token = (this.state.login.data) ? this.state.login.data.token : options.token || ""
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
        this.actions.setData("current", { "request": false })
      }
      if(result.code){
        if(result.code === 401){
          this.signOut()
        }
        return { error: { message: result.message }, data: null }
      }
      return result
    } catch (err) {
      if(!silent)
        this.actions.setData("current", { "request": false })
      return { error: { message: err.message }, data: null }
    }
  }

  setSideBar(value){
    if(!value){
      switch (this.state.current.side) {
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
    if(this.state.current.side !== value){
      this.actions.setData("current", { side: value })
    }
  }

  signOut() {
    this.actions.setData("login", { data: null, token: null })
  }

  showToast(params) {
    params = update(params, {$merge: { 
      autoClose: (params.autoClose === false) ? false : this.state.ui.toastTime
    }})
    showToast(params)
  }

  getAuditFilter(nervatype, transtype) {
    let retvalue = ["all",1]; let audit;
    switch (nervatype) {
      case "trans":
      case "menu":
        audit = this.state.login.data.audit.filter((audit)=> {
          return ((audit.nervatypeName === nervatype) && (audit.subtypeName === transtype))
        })[0]
        break;
      case "report":
        audit = this.state.login.data.audit.filter((audit)=> {
          return ((audit.nervatypeName === nervatype) && (audit.subtype === transtype))
        })[0]
        break;
      default:
        audit = this.state.login.data.audit.filter((audit)=> {
          return (audit.nervatypeName === nervatype)
        })[0]
    }
    if (typeof audit !== "undefined") {
      retvalue = [audit.inputfilterName, audit.supervisor];}
    return retvalue;
  }

  resultError(result) {
    if(result.error){
      this.actions.setData("error", result.error )
    }
    if(result.error && result.error.message){
      this.actions.showToast({ type: "error", message: result.error.message })
    } else {
      this.actions.showToast({ type: "error", 
        message: this.actions.getText("error_internal", "Internal Server Error") })
    }
  }

  async showBrowser(vkey, view) {
    let search = update(this.state.search, {})
    if((search.vkey !== vkey) && this.state.queries[vkey]){
      let views = [
        { key: "deffield",
          text: this.actions.getSql(this.state.login.data.engine, 
            this.state.queries[vkey]().options.deffield_sql),
          values: [] 
        }
      ]
      let options = { method: "POST", data: views }
      let view = await this.actions.requestData("/view", options)
      if(view.error){
        return this.resultError(view)
      }
      search = update(search, {$merge: {
        deffield: view.deffield
      }})
    }
    if (typeof view==="undefined") {
      view = Object.keys(this.state.queries[vkey]())[1]
    }
    search = update(search, {$merge: {
      vkey: vkey, view: view, dropdown: "", result: []
    }})
    if(!search.filters[view]){
      search = update(search, { filters: {
        $merge: { [view]: []}
      }})
    }
    const viewDef = this.state.queries[vkey]()[view]
    if (typeof search.columns[view] === "undefined") {
      search = update(search, { columns: {
        $merge: { [view]: {} }
      }})
      if (typeof viewDef.columns !== "undefined") {
        for(let fic = 0; fic < Object.keys(viewDef.columns).length; fic++) {
          let fieldname = Object.keys(viewDef.columns)[fic];
          search = update(search, { columns: { 
            [view]: {
              $merge: { [fieldname]: viewDef.columns[fieldname] }
            }
          }})
        }
      }
    }
    if (Object.keys(search.columns[view]).length === 0) {
      for(let v = 0; v < 3; v++) {
        let fieldname = Object.keys(viewDef.fields)[v];
        search = update(search, { columns: { 
          [view]: {
            $merge: { [fieldname]: true }
          }
        }})
      }
    }
    this.actions.setData("search", search)
    if(this.state.current.side === "show"){
      this.actions.setSideBar()
    }
    this.actions.setData("current", { module: "search" })
  }

  saveToDisk(fileUrl, fileName) {
    const element = document.createElement("a")
    element.href = fileUrl
    element.download = fileName || fileUrl
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }
}