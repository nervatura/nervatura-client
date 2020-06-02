import update from 'immutability-helper';

import { default as App } from "./App";
import { store } from 'config/app'

export default class extends App {

  constructor(props) {
    super(props);

    this.state = update(store, {$merge: props.data||{} })
    this.setData = this.setData.bind(this)
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
}