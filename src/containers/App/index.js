import update from 'immutability-helper';

import { default as App } from "./App";
import request from './request';
import { store } from 'config/app'
import { showToast } from './toast'
import { getSql } from './adapter'

export default class extends App {

  constructor(props) {
    super(props);

    this.state = update(store, {$merge: props.data||{} })
    this.actions = {
      setData: this.setData.bind(this),
      requestData: this.requestData.bind(this),
      getText: this.getText.bind(this),
      setSideBar: this.setSideBar.bind(this),
      signOut: this.signOut.bind(this),
      showToast: this.showToast.bind(this),
      getSql: getSql,
      getAuditFilter: this.getAuditFilter.bind(this)
    }
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
}