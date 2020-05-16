import React, { memo } from 'react';

import styles from './SideBar.module.css';
import { Label } from 'containers/Controller'
import { FileText, ChartBar, Search as SearchIcon, Bolt, Inbox, Print, Globe, Share } from 'components/Icons';

export const Search = memo((props) => {
  const { changeData, quickView } = props
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
          <button className={`${"full medium primary"} ${styles.panelButton}`} 
            onClick={()=>quickView(key)} >
            <Label text={"quick_search"} leftIcon={<Bolt />} col={20}  />
          </button>
          <button className={`${"full medium primary"} ${styles.panelButton}`} 
            onClick={()=>{}} >
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
          onClick={()=>{}} >
          <Label text={"title_printqueue"} leftIcon={<Print />} col={20}  />
        </button>
        <button className={`${"full medium primary"} ${styles.panelButton}`} 
          onClick={()=>{}} >
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
