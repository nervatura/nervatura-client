import React, { memo, createElement, Fragment } from 'react';

import styles from './SideBar.module.css';
import { Label } from 'containers/Controller'
import { FileText, ChartBar, Search as SearchIcon, Bolt, Inbox, Print, 
  Globe, Share, Plus, Edit as EditIcon, Check, Times, Copy,
  Reply, ArrowLeft, ArrowRight, ExclamationTriangle, Lock, Sitemap,
  Undo, Magic, Link, Download, Code, Calendar, Star, QuestionCircle,
  Money, Truck, Retweet, Cog, ListOl, Key, InfoCircle, Tag, Th, Map,
  Dollar, Ticket, Home, TextHeight, Keyboard, Desktop, Database } from 'components/Icons';

export const Search = memo((props) => {
  const { changeData, quickView, showBrowser, checkEditor } = props
  const { side } = props.data
  const { group_key } = props.module
  const { audit_filter } = props.login
  
  const groupButton = (key) => {
    if(key === group_key){
      return styles.selectButton
    }
    return styles.groupButton
  }
  const searchGroup = (key) => {
    return(
      <div className="row full">
        <button className={`${"full medium"} ${groupButton(key)}`} 
          onClick={()=>changeData("group_key",key)} >
          <Label text={"search_"+key} leftIcon={<FileText />} col={20}  />
        </button>
        {(group_key === key)?<div className={`${"row full"} ${styles.panelGroup}`} >
          <button className={`${"full medium"} ${styles.panelButton}`} 
            onClick={()=>quickView(key)} >
            <Label text={"quick_search"} leftIcon={<Bolt />} col={20}  />
          </button>
          <button className={`${"full medium"} ${styles.panelButton}`} 
            onClick={()=>showBrowser(key)} >
            <Label text={"browser_"+key} leftIcon={<SearchIcon />} col={20}  />
          </button>
        </div>:null}
      </div>
    )
  }
  return (
    <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
      {searchGroup("transitem")}
      {((audit_filter.trans.bank[0]!=="disabled") || (audit_filter.trans.cash[0]!=="disabled"))?
        searchGroup("transpayment"):null}
      {((audit_filter.trans.delivery[0]!=="disabled") || (audit_filter.trans.inventory[0]!=="disabled") 
        || (audit_filter.trans.waybill[0]!=="disabled") || (audit_filter.trans.production[0]!=="disabled")
        || (audit_filter.trans.formula[0]!=="disabled"))?
        searchGroup("transmovement"):null}
      
      <div className={styles.separator} />
      {(audit_filter.customer[0]!=="disabled")?
        searchGroup("customer"):null}
      {(audit_filter.product[0]!=="disabled")?
        searchGroup("product"):null}
      {(audit_filter.employee[0]!=="disabled")?
        searchGroup("employee"):null}
      {(audit_filter.tool[0]!=="disabled")?
        searchGroup("tool"):null}
      {(audit_filter.project[0]!=="disabled")?
        searchGroup("project"):null}

      <div className={styles.separator} />
      <button className={`${"full medium"} ${groupButton("report")}`} 
        onClick={()=>{changeData("group_key","report"); quickView("report")}} >
        <Label text={"search_report"} leftIcon={<ChartBar />} col={20}  />
      </button>
      <button className={`${"full medium"} ${groupButton("office")}`} 
        onClick={()=>changeData("group_key","office")} >
        <Label text={"search_office"} leftIcon={<Inbox />} col={20}  />
      </button>
      {(group_key === "office")?<div className={`${"row full"} ${styles.panelGroup}`} >
        <button className={`${"full medium primary"} ${styles.panelButton}`} 
          onClick={()=>checkEditor({ ntype: "printqueue", ttype: null, id: null}, 'LOAD_EDITOR')} >
          <Label text={"title_printqueue"} leftIcon={<Print />} col={20}  />
        </button>
        <button className={`${"full medium primary"} ${styles.panelButton}`} 
          onClick={()=>showBrowser("rate")} >
          <Label text={"title_rate"} leftIcon={<Globe />} col={20}  />
        </button>
        <button className={`${"full medium primary"} ${styles.panelButton}`} 
          onClick={()=>quickView("servercmd")} >
          <Label text={"title_servercmd"} leftIcon={<Share />} col={20}  />
        </button>
      </div>:null}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.module.group_key === nextProps.module.group_key)
  )
})

export const Edit = memo((props) => {
  const { editState, changeData, editorBack, editorNew, editorDelete, reportSettings,
    prevTransNumber, nextTransNumber, saveEditor, loadFormula, transCopy, setLink,
    shippingAddAll, shippingCreate, searchItems, createReport, exportAll, eventExport,
    bookmarkSave, setPassword, showHelp } = props
  const { login, forms } = props
  const { side, edit } = props.data
  const { current, form_dirty, dirty, panel, dataset, group_key } = props.module
  const editItems = (options)=>{
    if (typeof options === "undefined") {
      options = {}
    }
    let panels = []

    if (options.back === true || current.form) {
      panels.push(<button key="cmd_back"
        className={`${"medium"} ${styles.itemButton} ${styles.selected}`} 
        onClick={ ()=>editorBack() } >
        <Label text={"label_back"} leftIcon={<Reply />} col={20}  />
      </button>)
      panels.push(<div key="back_sep" className={styles.separator} />)
    }

    if (options.arrow === true) {
      panels.push(<button key="cmd_arrow_left"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>prevTransNumber() } >
        <Label text={"label_previous"} leftIcon={<ArrowLeft />} col={20}  />
      </button>)
      panels.push(<button key="cmd_arrow_right"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>nextTransNumber() } >
        <Label text={"label_next"} rightIcon={<ArrowRight />} col={20}  />
      </button>)
      panels.push(<div key="arrow_sep" className={styles.separator} />)
    }

    if (options.state !== "normal") {
      let color = "white"
      let icon = ExclamationTriangle
      switch (options.state) {
        case "deleted":
          color = "red"
          break;
        case "cancellation":
          color = "orange"
          break;
        case "closed":
          icon = Lock
          break;
        case "readonly":
          icon = Lock
          break;
        default:
          break;
        }
      panels.push(<div key="cmd_state" className={`${"full padding-small large"} ${styles.stateLabel}`} >
        <Label text={"label_"+options.state} style={{ color: color }}
          leftIcon={createElement(icon, { color: color })} col={25}  />
      </div>)
      panels.push(<div key="state_sep" className={styles.separator} />)
    }

    if (options.save !== false) {
      panels.push(<button key="cmd_save"
        className={`${"full medium"} ${styles.itemButton} ${((current.form && form_dirty)||(!current.form && dirty))?styles.selected:""}`} 
        onClick={ ()=>saveEditor() } >
        <Label text={"label_save"} leftIcon={<Check />} col={20}  />
      </button>)
    }
    if (options.delete !== false && options.state === "normal") {
      panels.push(<button key="cmd_delete"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>editorDelete() } >
        <Label text={"label_delete"} leftIcon={<Times />} col={20}  />
      </button>)
    }
    if (options.new !== false && options.state === "normal" && !current.form) {
      panels.push(<button key="cmd_new"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>editorNew({}) } >
        <Label text={"label_new"} leftIcon={<Plus />} col={20}  />
      </button>)
    }

    if (options.trans === true) {
      panels.push(<div key="trans_sep" className={styles.separator} />)
      if (options.copy !== false) {
        panels.push(
          <button
            key="cmd_copy"
            className={`${"full medium"} ${styles.itemButton}`}
            onClick={() => transCopy("normal")}>
            <Label text={"label_copy"} leftIcon={<Copy />} col={20} />
          </button>
        );
      }
      if (options.create !== false) {
        panels.push(
          <button
            key="cmd_create"
            className={`${"full medium"} ${styles.itemButton}`}
            onClick={() => transCopy("create")}>
            <Label text={"label_create"} leftIcon={<Sitemap />} col={20} />
          </button>
        );
      }
      if (options.corrective === true && options.state === "normal") {
        panels.push(
          <button
            key="cmd_corrective"
            className={`${"full medium"} ${styles.itemButton}`}
            onClick={() => transCopy("amendment")}>
            <Label text={"label_corrective"} leftIcon={<Share />} col={20} />
          </button>
        );
      }
      if (options.cancellation === true && options.state !== "cancellation") {
        panels.push(
          <button
            key="cmd_cancellation"
            className={`${"full medium"} ${styles.itemButton}`}
            onClick={() => transCopy("cancellation")}>
            <Label text={"label_cancellation"} leftIcon={<Undo />} col={20} />
          </button>
        );
      }
      if (options.formula === true) {
        panels.push(<button key="cmd_formula"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={ ()=>loadFormula() } >
          <Label text={"label_formula"} leftIcon={<Magic />} col={20}  />
        </button>)
      }
    }

    if (options.link === true) {
      panels.push(<button key="cmd_link"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>setLink(options.link_type, options.link_field)} >
          <Label value={options.link_label} leftIcon={<Link />} col={20}  />
        </button>)
    }

    if (options.password === true) {
      panels.push(<button key="cmd_password"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>setPassword()} >
          <Label text={"title_password"} leftIcon={<Lock />} col={20}  />
        </button>)
    }

    if (options.shipping === true) {
      panels.push(<button key="cmd_shipping_all"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={() => shippingAddAll()} >
          <Label text={"shipping_all_label"} leftIcon={<Plus />} col={20}  />
        </button>)
      panels.push(<button key="cmd_shipping_create"
        className={`${"full medium"} ${styles.itemButton} ${(dataset.shiptemp.length > 0)?styles.selected:""}`} 
        onClick={() => shippingCreate()} >
        <Label text={"shipping_create_label"} leftIcon={<Check />} col={20}  />
      </button>)
    }

    if (options.more === true) {
      panels.push(<div key="more_sep_1" className={styles.separator} />)
      if (options.report !== false) {
        panels.push(<button key="cmd_report"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={ ()=>reportSettings() } >
          <Label text={"label_report"} leftIcon={<ChartBar />} col={20}  />
        </button>)
      }
      if (options.search === true) {
        panels.push(<button key="cmd_search"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>searchItems()} >
          <Label text={"label_search"} leftIcon={<SearchIcon />} col={20}  />
        </button>)
      }
      if (options.export_all === true && options.state === "normal") {
        panels.push(<button key="cmd_export_all"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>exportAll()} >
          <Label text={"label_export_all"} leftIcon={<Download />} col={20}  />
        </button>)
      }
      if (options.print === true) {
        panels.push(<button key="cmd_print"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>createReport("print")} >
          <Label text={"label_print"} leftIcon={<Print />} col={20}  />
        </button>)
      }
      if (options.export_pdf === true && options.state === "normal") {
        panels.push(<button key="cmd_export_pdf"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>createReport("pdf")} >
          <Label text={"label_export_pdf"} leftIcon={<Download />} col={20}  />
        </button>)
      }
      if (options.export_xml === true && options.state === "normal") {
        panels.push(<button key="cmd_export_xml"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>createReport("xml")} >
          <Label text={"label_export_xml"} leftIcon={<Code />} col={20}  />
        </button>)
      }
      if (options.export_csv === true && options.state === "normal") {
        panels.push(<button key="cmd_export_csv"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>createReport("csv")} >
          <Label text={"label_export_csv"} leftIcon={<Download />} col={20}  />
        </button>)
      }
      if (options.export_event === true && options.state === "normal") {
        panels.push(<button key="cmd_export_event"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>eventExport()} >
          <Label text={"label_export_event"} leftIcon={<Calendar />} col={20}  />
        </button>)
      }
      panels.push(<div key="more_sep_2" className={styles.separator} />)
      if (options.bookmark !== false && options.state === "normal") {
        panels.push(<button key="cmd_bookmark"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>bookmarkSave(options.bookmark)} >
          <Label text={"label_bookmark"} leftIcon={<Star />} col={20}  />
        </button>)
      }
      if (options.help !== false) {
        panels.push(<button key="cmd_help"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>showHelp(options.help)} >
          <Label text={"label_help"} leftIcon={<QuestionCircle />} col={20}  />
        </button>)
      }
    }

    if (options.more !== true && typeof options.help !== "undefined") {
      panels.push(<div key="help_sep" className={styles.separator} />)
      panels.push(<button key="cmd_help"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={()=>showHelp(options.help)} >
        <Label text={"label_help"} leftIcon={<QuestionCircle />} col={20}  />
      </button>)
    }
    
    return panels
  }
  const groupButton = (key) => {
    if(key === group_key){
      return styles.selectButton
    }
    return styles.groupButton
  }
  const newItems = ()=>{
    let mnu_items = []

    if(Array(login.edit_new[0]).length > 0){
      mnu_items.push(<div key="0" className="row full">
        <button className={`${"full medium"} ${groupButton("new_transitem")}`} 
          onClick={()=>changeData("group_key","new_transitem")} >
          <Label text={"search_transitem"} leftIcon={<FileText />} col={25}  />
        </button>
        {(group_key === "new_transitem")?<div className={`${"row full"} ${styles.panelGroup}`} >
          {login.edit_new[0].map(transtype =>{
            if (login.audit_filter.trans[transtype][0] === "all"){ 
              return (<button key={transtype} className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={ ()=>editorNew( {ntype: 'trans', ttype: transtype} ) } >
                <Label text={"title_"+transtype} leftIcon={<FileText />} col={25}  />
              </button>) 
            } else { 
              return null 
            }
          })}
        </div>:null}
      </div>)
    }

    if(Array(login.edit_new[1]).length > 0){
      mnu_items.push(<div key="1" className="row full">
        <button className={`${"full medium"} ${groupButton("new_transpayment")}`} 
          onClick={()=>changeData("group_key","new_transpayment")} >
          <Label text={"search_transpayment"} leftIcon={<Money />} col={25}  />
        </button>
        {(group_key === "new_transpayment")?<div className={`${"row full"} ${styles.panelGroup}`} >
          {login.edit_new[1].map(transtype =>{
            if (login.audit_filter.trans[transtype][0] === "all"){ 
              return (<button key={transtype} className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={ ()=>editorNew( {ntype: 'trans', ttype: transtype} ) } >
                <Label text={"title_"+transtype} leftIcon={<Money />} col={25}  />
              </button>) 
            } else { 
              return null 
            }
          })}
        </div>:null}
      </div>)
    }

    if(Array(login.edit_new[2]).length > 0){
      mnu_items.push(<div key="2" className="row full">
        <button className={`${"full medium"} ${groupButton("new_transmovement")}`} 
          onClick={()=>changeData("group_key","new_transmovement")} >
          <Label text={"search_transmovement"} leftIcon={<Truck />} col={25}  />
        </button>
        {(group_key === "new_transmovement")?<div className={`${"row full"} ${styles.panelGroup}`} >
          {login.edit_new[2].map(transtype => {
            if (login.audit_filter.trans[transtype][0] === "all"){
              if(transtype === "delivery"){
                return ([
                  <button key="shipping" className={`${"full medium primary"} ${styles.panelButton}`} 
                    onClick={ ()=>editorNew( {ntype: 'trans', ttype: "shipping"} ) } >
                    <Label text={"title_"+transtype} 
                      leftIcon={createElement(forms[transtype]().options.icon)} col={25}  />
                  </button>,
                  <button key={transtype} className={`${"full medium primary"} ${styles.panelButton}`} 
                    onClick={ ()=>editorNew( {ntype: 'trans', ttype: transtype} ) } >
                    <Label text={"title_transfer"} 
                      leftIcon={createElement(forms[transtype]().options.icon)} col={25}  />
                  </button>
                ])
              } else {
                return (<button key={transtype} className={`${"full medium primary"} ${styles.panelButton}`} 
                  onClick={ ()=>editorNew( {ntype: 'trans', ttype: transtype} ) } >
                  <Label text={"title_"+transtype} 
                    leftIcon={createElement(forms[transtype]().options.icon)} col={25}  />
                </button>)
              } 
            } else { 
              return null 
            }
          })}
        </div>:null}
      </div>)
    }

    if(Array(login.edit_new[3]).length > 0){
      mnu_items.push(<div key="3" className="row full">
        <button className={`${"full medium"} ${groupButton("new_resources")}`} 
          onClick={()=>changeData("group_key","new_resources")} >
          <Label text={"title_resources"} leftIcon={<Money />} col={25}  />
        </button>
        {(group_key === "new_resources")?<div className={`${"row full"} ${styles.panelGroup}`} >
          {login.edit_new[3].map(ntype =>{
            if (login.audit_filter[ntype][0] === "all"){ 
              return (<button key={ntype} className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={ ()=>editorNew( {ntype: ntype, ttype: null} ) } >
                <Label text={"title_"+ntype} 
                  leftIcon={createElement(forms[ntype]().options.icon)} col={25}  />
              </button>) 
            } else { 
              return null 
            }
          })}
        </div>:null}
      </div>)
    }

    return mnu_items
  }
  return (
    <Fragment>
      <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
        {(!current.form && (current.form_type !== "transitem_shipping"))?
        <div className="row full section-small container">
          <div className="cell half">
            <button className={`${"full medium"} ${(edit && current.item)?styles.groupButton:styles.selectButton}`} 
              onClick={ ()=>editState() } >
              <Label text={"label_new"} leftIcon={<Plus />} col={20}  />
            </button>
          </div>
          <div className="cell half">
            <button className={`${"full medium"} ${(edit && current.item)?styles.selectButton:styles.groupButton}`} 
              disabled={(!current.item)?"disabled":""}
              onClick={ ()=>editState() } >
              <Label text={"label_edit"} leftIcon={<EditIcon />} col={20}  />
            </button>
          </div>
        </div>:null}
        {((!current.form && !current.item) || !edit)?newItems():(edit)?editItems(panel):null}
      </div>
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.module === nextProps.module)
  )
})

export const Preview = memo((props) => {
  const { closePreview, changeOrientation, setScale, prevPage, nextPage } = props
  const { side } = props.data
  const { orient, pageNumber, totalPages } = props.preview
  return (
    <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
      <button
        className={`${"medium"} ${styles.itemButton} ${styles.selected}`} 
        onClick={ ()=>closePreview() } >
        <Label text={"label_back"} leftIcon={<Reply />} col={20}  />
      </button>
      <div className={styles.separator} />

      <div className={`${"full padding-small large"} ${styles.previewLabel}`} >
        <Label text="report_page" value={`: ${pageNumber}/${totalPages}`} />
      </div>
      <div className={styles.separator} />

      <button
        className={`${"medium full"} ${styles.itemButton} ${styles.upper}`} 
        onClick={ ()=>changeOrientation() } >
        <Label 
          text={(orient === "portrait")?"report_landscape":"report_portrait"} 
          leftIcon={<Retweet />} col={20}  />
      </button>
      <div className={styles.separator} />

      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        disabled={(pageNumber === 1)?"disabled":""}
        onClick={ ()=>prevPage() } >
        <Label text="report_previous" leftIcon={<ArrowLeft />} col={20}  />
      </button>
      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        disabled={(pageNumber === totalPages)?"disabled":""}
        onClick={ ()=>nextPage() } >
        <Label text="report_next" rightIcon={<ArrowRight />} col={20}  />
      </button>
      <div className={styles.separator} />
      
      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        onClick={ ()=>setScale(0.5) } >
        <Label value="50%" leftIcon={<SearchIcon />} col={20}  />
      </button>
      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        onClick={ ()=>setScale(0.75) } >
        <Label value="75%" leftIcon={<SearchIcon />} col={20}  />
      </button>
      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        onClick={ ()=>setScale(1) } >
        <Label value="100%" leftIcon={<SearchIcon />} col={20}  />
      </button>
      <button
        className={`${"medium full"} ${styles.itemButton}`} 
        onClick={ ()=>setScale("page-width") } >
        <Label text="report_full_width" leftIcon={<SearchIcon />} col={20}  />
      </button>

    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.preview === nextProps.preview)
  )
})

export const Setting = memo((props) => {
  const { changeData, settingLoad, loadCompany, setPassword, settingBack, 
    settingSave, setProgram, settingDelete, settingNew, templatePrint,
    templateSave, templateCreate, templateNewBlank, templateNewSample,
    template2json, showHelp } = props
  const { username } = props
  const { side } = props.data
  const { group_key, current, panel, dirty, template } = props.module
  const { audit_filter } = props.login
  const menuItems = (options)=>{
    if (typeof options === "undefined") {
      options = {}
    }
    let panels = []

    panels.push(<button key="cmd_back"
      className={`${"medium"} ${styles.itemButton} ${styles.selected}`} 
      onClick={ ()=>settingBack() } >
      <Label text={"label_back"} leftIcon={<Reply />} col={20}  />
    </button>)
    panels.push(<div key="back_sep" className={styles.separator} />)

    if (options.save !== false) {
      panels.push(<button key="cmd_save"
        className={`${"full medium"} ${styles.itemButton} ${(dirty)?styles.selected:""}`} 
        onClick={ ()=>settingSave() } >
        <Label text={"label_save"} leftIcon={<Check />} col={20}  />
      </button>)
    }
    if ((options.delete !== false) && (current.form.id !== null)) {
      panels.push(<button key="cmd_delete"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>settingDelete() } >
        <Label text={"label_delete"} leftIcon={<Times />} col={20}  />
      </button>)
    }
    if ((options.new !== false) && (current.form.id !== null)) {
      panels.push(<button key="cmd_new"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={ ()=>settingNew({}) } >
        <Label text={"label_new"} leftIcon={<Plus />} col={20}  />
      </button>)
    }
    if (typeof options.help !== "undefined") {
      panels.push(<div key="help_sep" className={styles.separator} />)
      panels.push(<button key="cmd_help"
        className={`${"full medium"} ${styles.itemButton}`} 
        onClick={()=>showHelp(options.help)} >
        <Label text={"label_help"} leftIcon={<QuestionCircle />} col={20}  />
      </button>)
    }

    return panels
  }
  if(template){
    return(
      <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
        <button key="cmd_back"
          className={`${"medium"} ${styles.itemButton} ${styles.selected}`} 
          onClick={ ()=>settingBack("template") } >
          <Label text={"label_back"} leftIcon={<Reply />} col={25}  />
        </button>
        <div key="tmp_sep_1" className={styles.separator} />

        {((template.key !== "_blank") && (template.key !== "_sample"))?
        <Fragment>
          <div key="tmp_sep_2" className={styles.separator} />
          <button key="cmd_save"
            className={`${"full medium"} ${styles.itemButton} ${(dirty)?styles.selected:""}`} 
            onClick={ ()=>templateSave() } >
            <Label text={"template_save"} leftIcon={<Check />} col={25}  />
          </button>
          <button
            key="cmd_create"
            className={`${"full medium"} ${styles.itemButton}`}
            onClick={() => templateCreate()}>
            <Label text={"template_create_from"} leftIcon={<Sitemap />} col={25} />
          </button>
        </Fragment>:null}

        <div key="tmp_sep_3" className={styles.separator} />
        <button
          key="cmd_blank"
          className={`${"full medium"} ${styles.itemButton}`}
          onClick={() => templateNewBlank()}>
          <Label text={"template_new_blank"} leftIcon={<Plus />} col={25} />
        </button>
        <button
          key="cmd_sample"
          className={`${"full medium"} ${styles.itemButton}`}
          onClick={() => templateNewSample()}>
          <Label text={"template_new_sample"} leftIcon={<Plus />} col={25} />
        </button>

        <div key="tmp_sep_4" className={styles.separator} />
        <button key="cmd_print"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>templatePrint()} >
          <Label text={"label_print"} leftIcon={<Print />} col={25}  />
        </button>
        <button
          key="cmd_json"
          className={`${"full medium"} ${styles.itemButton}`}
          onClick={() => template2json()}>
          <Label text={"template_export_json"} leftIcon={<Code />} col={25} />
        </button>

        <div key="tmp_sep_5" className={styles.separator} />
        <button key="cmd_help"
          className={`${"full medium"} ${styles.itemButton}`} 
          onClick={()=>showHelp("editor")} >
          <Label text={"label_help"} leftIcon={<QuestionCircle />} col={20}  />
        </button>

      </div>
    )
  } else if(current && panel){
    return(
      <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
        {menuItems(panel)}
      </div>
    )
  } else {
    return (
      <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
        {(audit_filter.setting[0]!=="disabled")?
          <div className="row full">
            <button className={`${"full medium"} ${(group_key === "group_admin")?styles.selectButton:styles.groupButton}`} 
              onClick={()=>changeData("group_key","group_admin")} >
              <Label text={"title_admin"} leftIcon={<ExclamationTriangle />} col={20}  />
            </button>
            {(group_key === "group_admin")?<div className={`${"row full"} ${styles.panelGroup}`} >
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'setting' })} >
                <Label text={"title_dbsettings"} leftIcon={<Cog />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'numberdef' })} >
                <Label text={"title_numberdef"} leftIcon={<ListOl />} col={20}  />
              </button>
              {(audit_filter.audit[0]!=="disabled")?
                <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'usergroup' })} >
                <Label text={"title_usergroup"} leftIcon={<Key />} col={20}  />
              </button>:null}
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'ui_menu' })} >
                <Label text={"title_menucmd"} leftIcon={<Share />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'log' })} >
                <Label text={"title_log"} leftIcon={<InfoCircle />} col={20}  />
              </button>
            </div>:null}
          </div>:null}
        {(audit_filter.setting[0]!=="disabled")?
          <div className="row full">
            <button className={`${"full medium"} ${(group_key === "group_database")?styles.selectButton:styles.groupButton}`} 
              onClick={()=>changeData("group_key","group_database")} >
              <Label text={"title_database"} leftIcon={<Database />} col={20}  />
            </button>
            {(group_key === "group_database")?<div className={`${"row full"} ${styles.panelGroup}`} >
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'deffield' })} >
                <Label text={"title_deffield"} leftIcon={<Tag />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'groups' })} >
                <Label text={"title_groups"} leftIcon={<Th />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'place' })} >
                <Label text={"title_place"} leftIcon={<Map />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'currency' })} >
                <Label text={"title_currency"} leftIcon={<Dollar />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'tax' })} >
                <Label text={"title_tax"} leftIcon={<Ticket />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>loadCompany()} >
                <Label text={"title_company"} leftIcon={<Home />} col={20}  />
              </button>
              <button className={`${"full medium primary"} ${styles.panelButton}`} 
                onClick={()=>settingLoad({ type: 'template' })} >
                <Label text={"title_report_editor"} leftIcon={<TextHeight />} col={20}  />
              </button>
            </div>:null}
          </div>:null}
        <div className="row full">
          <button className={`${"full medium"} ${(group_key === "group_user")?styles.selectButton:styles.groupButton}`} 
            onClick={()=>changeData("group_key","group_user")} >
            <Label text={"title_user"} leftIcon={<Desktop />} col={20}  />
          </button>
          {(group_key === "group_user")?<div className={`${"row full"} ${styles.panelGroup}`} >
            <button className={`${"full medium primary"} ${styles.panelButton}`} 
              onClick={()=>setProgram()} >
              <Label text={"title_program"} leftIcon={<Keyboard />} col={20}  />
            </button>
            <button className={`${"full medium primary"} ${styles.panelButton}`} 
              onClick={()=>setPassword(username)} >
              <Label text={"title_password"} leftIcon={<Lock />} col={20}  />
            </button>
          </div>:null}
        </div>
      </div>
    )
  }
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data) &&
    (prevProps.module === nextProps.module)
  )
})

export const SideBar = memo((props) => {
  const { side } = props.data
  return (
    <div className={`${styles.sidebar} ${((side !== "auto")? side : "")}`} >
      
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})
