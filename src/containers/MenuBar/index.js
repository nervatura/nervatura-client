import { useContext, useState } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { useSearch } from 'containers/Search/actions'
import { useSetting } from 'containers/Setting/actions'
import Bookmark from 'components/Modal/Bookmark'
import InputBox from 'components/Modal/InputBox'

import MenuBarMemo, { MenuBarComponent } from './MenuBar';

const MenuBar = (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()
  const editor = useEditor()
  const search = useSearch()
  const setting = useSetting()

  const [state] = useState(update(props, {data: {$merge: {
    ...data[props.key]
  }}}))

  state.data = update(state.data, {$merge: { ...data[state.key] }})
  state.bookmark = update(state.bookmark, {$merge: { ...data.bookmark }})

  state.getText = (key, defValue) => {
    return app.getText(key, defValue)
  }

  state.sideBar = () => {
    setData("current", { side: app.getSideBar() })
  }

  state.setScroll = () => {
    window.scrollTo(0,0);
  }

  state.loadModule = (key) => {
    switch (key) {
      case "login":
        return app.signOut()

      case "help":
        return app.showHelp("")

      case "bookmark":
        return state.showBookmarks()

      default:
        setData("current", { module: key, menu: "" }, ()=>{
          if(key === "setting" && !data.setting.group_key){
            setData(state.data.module, { group_key: "group_admin" }, ()=>{
              setting.loadSetting({ type: 'setting' })
            })
          }
        })
    }
  }

  state.showBookmarks = () => {
    setData("current", { modalForm:
      <Bookmark bookmark={state.bookmark} tabView={state.bookmarkView}
        getText={app.getText} 
        onSelect={(view, row) => {
          setData("current", { modalForm: null }, async () => {
            if((view === "bookmark") && (row.cfgroup === "browser")){
              let search_data = update(data.search, {
                filters: {$merge: {
                  [row.view]: row.filters
                }
              }})
              search_data = update(search_data, {
                columns: {$merge: {
                  [row.view]: row.columns
                }
              }})
              setData("search", search_data, ()=>{
                  search.showBrowser(row.vkey, row.view)
                }
              )
            } else {
              editor.checkEditor({
                ntype: row.ntype, 
                ttype: row.transtype, 
                id: row.id,
              }, 'LOAD_EDITOR')
            }
          })
        }}
        onDelete={(id) => {
          setData("current", { modalForm: 
            <InputBox 
              title={app.getText("msg_warning")}
              message={app.getText("msg_delete_text")}
              infoText={app.getText("msg_delete_info")}
              labelOK={app.getText("msg_ok")}
              labelCancel={app.getText("msg_cancel")}
              onCancel={() => {
                state.showBookmarks()
              }}
              onOK={async () => {
                const result = await app.requestData("/ui_userconfig", 
                  { method: "DELETE", query: { id: id } })
                if(result && result.error){
                  return app.resultError(result)
                }
                app.loadBookmark({user_id: data.login.data.employee.id, callback: ()=>{
                  state.showBookmarks()
                }})
              }}
            /> })
        }}
        onClose={()=>{
          setData("current", { modalForm: null })
        }}
      />
    })
  }

  return <MenuBarMemo {...state} />
}

MenuBar.propTypes = {
  key: PropTypes.string.isRequired,
  ...MenuBarComponent.propTypes,
  bookmark: PropTypes.object,
  bookmarkView: PropTypes.string.isRequired,
  showBookmarks: PropTypes.func,
}

MenuBar.defaultProps = {
  key: "current",
  ...MenuBarComponent.defaultProps,
  bookmark: {},
  bookmarkView: "bookmark",
  showBookmarks: undefined,
}

export default MenuBar;