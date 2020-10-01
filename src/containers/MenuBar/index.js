import React, { useContext, useState } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { useSearch } from 'containers/Search/actions'
import { BookmarkForm, InputForm } from 'containers/ModalForm'

import { MenuBar } from './MenuBar';

export default (props) => {
  const { data, setData } = useContext(AppStore);
  const app = useApp()
  const editor = useEditor()
  const search = useSearch()
  const showBookmark = BookmarkForm({ui: data.ui})
  const showInput =  InputForm()
  
  const [state] = useState({})

  state.data = data.current
  state.bookmark = data.bookmark

  state.signOut = () => {
    app.signOut()
  }

  state.sideBar = () => {
    app.setSideBar()
  }

  state.loadModule = (key) => {
    setData("current", { module: key, menu: "" })
  }

  state.showBookmarks = () => {
    showBookmark({
      bookmark: state.bookmark,
      getText: app.getText, 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      onDelete: (id) => {
        showInput({
          title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
          infoText: app.getText("msg_delete_info"), 
          onChange: (form) => {
            setData("current", { modalForm: form })
          }, 
          cbCancel: () => {
            state.showBookmarks()
          },
          cbOK: async () => {
            const result = await app.requestData("/ui_userconfig", 
              { method: "DELETE", query: { id: id } })
            if(result && result.error){
              return app.resultError(result)
            }
            app.loadBookmark({user_id: data.login.data.employee.id, callback: ()=>{
              state.showBookmarks()
            }})
          }
        })
      },
      onSelect: (tabView, row) => {
        setData("current", { modalForm: null }, async () => {
          if((tabView === "bookmark") && (row.cfgroup === "browser")){
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
      }
    })
  }

  state.setScroll = () => {
    window.scrollTo(0,0);
  }

  return (
    <MenuBar {...state} />
  )
}
