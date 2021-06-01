import update from 'immutability-helper';

import { default as App } from "./App";
import { store } from 'config/app'
import { guid, request } from './actions'

// eslint-disable-next-line import/no-anonymous-default-export
export default class extends App {

  constructor(props) {
    super(props);

    this.state = update(store, {$merge: props.data||{} })
    this.setData = this.setData.bind(this)
  }

  setData(key, data, callback) {
    if(key && this.state[key] && typeof data === "object" && data !== null){
      this.setState({ [key]: update(this.state[key], {$merge: data}) }, 
        ()=>{ if(callback) {callback()} })
    } else if(key){
      this.setState({ [key]:  data }, ()=>{ if(callback) {callback()} })
    }
  }

  /* istanbul ignore next */
  getPath() {
    const getParams = (prmString) => {
      let params = {}
      prmString.split('&').forEach(prm => {
        params[prm.split("=")[0]] = prm.split("=")[1]
      });
      return params
    }
    if(window.location.hash){
      return ["hash", getParams(window.location.hash.substring(1))]
    }
    if(window.location.search){
      return ["search", getParams(window.location.search.substring(1))]
    }
    const path = window.location.pathname.substring(1).split("/")
    return [path[0], path.slice(1)]
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

  setHashToken(params) {
    const path = (params.path) 
      ? "/"+params.path 
      : "/"
    localStorage.setItem("token", params.access_token||null)
    window.location.assign(path)
  }

  async setCodeToken(params) {
    const config = await this.loadConfig(true)
    if(config && config.provider_token_callback){
      const options = {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({
          code: params.code,
          client_id: config.provider_client_id || "missing_config",
          client_secret: config.provider_client_secret || "missing_config"
        })
      }
      try {
        const result = await request(config.provider_token_callback, options)
        if(result.access_token){
          const path = (params.path) 
            ? "/"+params.path 
            : "/"
          localStorage.setItem("token", result.access_token||null)
          window.location.assign(path)
        }
      } catch (err) {
        if(config.provider_token_login && config.provider_token_login !== ""){
          return window.location.assign(config.provider_token_login+"&state="+guid())
        }
        this.setData("error", err )
      }
    } else {
      this.setData("error", {
        id: "error_unauthorized",
        type: "error", 
        message: this.getText("error_unauthorized", "Unauthorized user")
      } )
    }
  }

  async loadConfig(preLoad){
    let config = update({}, {$merge: this.state.session})
    try {
      const result = await request(this.state.login.server+"/config", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      if(result.locales && (typeof result.locales == "object")){
        config = update(config, {locales: {$merge: result.locales }})
      }
      if(preLoad){
        return config
      }
      this.setData("session", config )
      if(localStorage.getItem("lang") && config.locales[localStorage.getItem("lang")] 
        && (localStorage.getItem("lang") !== this.state.current.lang)){
          this.setData("current", {lang: localStorage.getItem("lang")} )
        }
    } catch (error) {
      this.setData("error", error )
    }
  }
}