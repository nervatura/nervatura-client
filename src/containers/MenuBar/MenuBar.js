import React, { memo, useRef } from 'react';

import styles from './MenuBar.module.css';
import { Label } from 'containers/Controller'
import { HandUp, Bars, Close, Exit, Search, Edit, Cog, Star, QuestionCircle } from 'components/Icons';

export const MenuBar = memo((props) => {
  const topMenu = useRef(null);
  const { signOut, loadModule, sideBar, setScroll, showBookmarks } = props
  const { side, scrollTop } = props.data
  const selected = (key) => {
    if(key === props.data.module){
      return styles.selected
    }
    return ""
  }
  return (
    <div ref={topMenu} className={`${(scrollTop)?styles.shadow:""} ${styles.menubar}`} >
      <div className="cell">
        <div className={`${styles.menuitem} ${styles.sidebar}`} onClick={() => sideBar() }>
          {(side === "show")?
            <Label className={`${styles.selected} ${styles.exit}`} 
              leftIcon={<Close className={`${styles.selected} ${styles.exit}`} />} text="menu_hide" />:
            <Label leftIcon={<Bars width="24" height="24" />} text="menu_side" />}
        </div>
        <div className={`${"hide-small hide-medium"} ${selected("search")} ${styles.menuitem}`} onClick={() => loadModule("search") } >
          <Label leftIcon={<Search />} text="menu_search" />
        </div>
        <div className={`${"hide-small hide-medium"} ${selected("edit")} ${styles.menuitem}`} onClick={() => loadModule("edit") } >
          <Label leftIcon={<Edit />} text="menu_edit" />
        </div>
        <div className={`${"hide-small hide-medium"} ${selected("setting")} ${styles.menuitem}`} onClick={() => loadModule("setting") } >
          <Label leftIcon={<Cog />} text="menu_setting" />
        </div>
        <div className={`${"hide-small hide-medium"} ${selected("bookmark")} ${styles.menuitem}`} onClick={() => showBookmarks() } >
          <Label leftIcon={<Star />} text="menu_bookmark" />
        </div>
        <div className={`${"hide-small hide-medium"} ${selected("help")} ${styles.menuitem}`} onClick={() => loadModule("help") } >
          <Label leftIcon={<QuestionCircle />} text="menu_help" />
        </div>

        {(scrollTop)?<div className={`${styles.menuitem}`} onClick={() => setScroll() } >
          <HandUp />
        </div>:null}
      </div>
      <div className={`${"right"} ${styles.menuitem} ${styles.exit}`} onClick={() => signOut() } >
        <Exit width="24" height="24"/>
      </div>
      <div className={`${"cell"} ${"right"} ${styles.container}`}>
        <div className={`${"right hide-large"} ${selected("help")} ${styles.menuitem}`} onClick={() => loadModule("help") } >
          <Label className="hide-small" leftIcon={<QuestionCircle />} text="menu_help" />
        </div>
        <div className={`${"right hide-large"} ${selected("bookmark")} ${styles.menuitem}`} onClick={() => showBookmarks() } >
          <Label className="hide-small" leftIcon={<Star />} text="menu_bookmark" />
        </div>
        <div className={`${"right hide-large"} ${selected("setting")} ${styles.menuitem}`} onClick={() => loadModule("setting") } >
          <Label className="hide-small" leftIcon={<Cog />} text="menu_setting" />
        </div>
        <div className={`${"right hide-large"} ${selected("edit")} ${styles.menuitem}`} onClick={() => loadModule("edit") } >
          <Label className="hide-small" leftIcon={<Edit />} text="menu_edit" />
        </div>
        <div className={`${"right hide-large"} ${selected("search")} ${styles.menuitem}`} onClick={() => loadModule("search") } >
          <Label className="hide-small" leftIcon={<Search />} text="menu_search" />
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})
