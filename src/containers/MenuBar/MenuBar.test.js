import React from 'react';
import { render, fireEvent, queryByAttribute } from '@testing-library/react'
import update from 'immutability-helper';

import MenuBar from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'
import { BookmarkData } from 'components/Modal/Bookmark/Bookmark.stories'

import { useApp } from 'containers/App/actions'
import { useEditor } from 'containers/Editor/actions'
import { useSetting } from 'containers/Setting/actions'
import { useSearch } from 'containers/Search/actions'

jest.mock("containers/App/actions");
jest.mock("containers/Editor/actions");
jest.mock("containers/Setting/actions");
jest.mock("containers/Search/actions");

const getById = queryByAttribute.bind(null, 'id');

const store = update(app_store, {$merge: {
  bookmark: BookmarkData.args.bookmark,
  login: {
    data: {
      employee: {
        id: 1, empnumber: 'admin', username: 'admin', usergroup: 114,
        usergroupName: 'admin'
      },
    }
  }
}})

const scrollTo = jest.fn()

describe('<MenuBar />', () => {

  beforeEach(() => {
    useApp.mockReturnValue({
      getSideBar: jest.fn(),
      getText: jest.fn(),
      signOut: jest.fn(),
      showHelp: jest.fn(),
      requestData: jest.fn(async () => ({})),
      resultError: jest.fn(),
      loadBookmark: jest.fn(({user_id, callback})=>{ 
        if(callback){callback()} 
      }),
    })
    Object.defineProperty(global.window, 'scrollTo', { value: scrollTo });
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const setData = jest.fn()
    const it_store = update(store, {
      current: {$merge: {
        scrollTop: true
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <MenuBar />
      </AppProvider>
    );
    expect(getById(container, 'mnu_sidebar')).toBeDefined();

    const mnu_scroll = getById(container, 'mnu_scroll')
    fireEvent.click(mnu_scroll)
    expect(scrollTo).toHaveBeenCalledTimes(1);

    const mnu_sidebar = getById(container, 'mnu_sidebar')
    fireEvent.click(mnu_sidebar)
    expect(setData).toHaveBeenCalledTimes(1);

    const mnu_logout_large = getById(container, 'mnu_logout_large')
    fireEvent.click(mnu_logout_large)
    expect(setData).toHaveBeenCalledTimes(1);

    const mnu_help_large = getById(container, 'mnu_help_large')
    fireEvent.click(mnu_help_large)
    expect(setData).toHaveBeenCalledTimes(1);

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <MenuBar />
      </AppProvider>
    )
  });

  it('loadSetting', () => {
    useSetting.mockReturnValue({
      loadSetting: jest.fn(),
    })
    const it_store = update({}, {$merge: store})
    const setData = jest.fn((key, data, callback)=>{ 
      if(callback){
        if(data.group_key){
          it_store.setting.group_key = "group_admin"
        }
        callback()
      } 
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <MenuBar />
      </AppProvider>
    );

    const mnu_setting_large = getById(container, 'mnu_setting_large')
    fireEvent.click(mnu_setting_large)
    expect(setData).toHaveBeenCalledTimes(2);
    fireEvent.click(mnu_setting_large)
    expect(setData).toHaveBeenCalledTimes(3);
  })

  it('showBookmarks - bookmark', () => {
    useSearch.mockReturnValue({
      showBrowser: jest.fn(),
    })
    useEditor.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSelect bookmark element
        let row_item = getById(container, 'row_item_1')
        fireEvent.click(row_item)
        // onClose
        const close = getById(container, 'closeIcon')
        fireEvent.click(close)
      }
      if(callback){
        callback()
      }
    })

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = getById(container, 'mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
    expect(setData).toHaveBeenCalledTimes(4);
  })

  it('showBookmarks - history', () => {
    useSearch.mockReturnValue({
      showBrowser: jest.fn(),
    })
    useEditor.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSelect bookmark element
        let row_item = getById(container, 'row_item_0')
        fireEvent.click(row_item)
      }
      if(callback){
        callback()
      }
    })

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="history" />
      </AppProvider>
    );

    const mnu_bookmark_large = getById(container, 'mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
    expect(setData).toHaveBeenCalledTimes(2);
  })

  it('showBookmarks - onDelete cancel+error', () => {
    useApp.mockReturnValue({
      getText: jest.fn(),
      requestData: jest.fn(async () => ({ error: {} })),
      resultError: jest.fn(),
    })
    let cancel = false
    let ok = false
    const setData = jest.fn((key, data, callback)=>{
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // showBookmarks - delete icon
        let row_item = getById(container, 'row_delete_1')
        if(row_item){
          fireEvent.click(row_item)
        }
        // InputBox
        let btn_cancel = getById(container, 'btn_cancel')
        if(btn_cancel && !cancel){
          cancel = true
          fireEvent.click(btn_cancel)
        }
        let btn_ok = getById(container, 'btn_ok')
        if(btn_ok && !ok){
          ok = true
          fireEvent.click(btn_ok)
        }
      }
      if(callback){
        callback()
      }
    })

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = getById(container, 'mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
    expect(setData).toHaveBeenCalledTimes(4);
  })

  it('showBookmarks - onDelete ok', () => {
    let ok = false
    const setData = jest.fn((key, data, callback)=>{
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // showBookmarks - delete icon
        let row_item = getById(container, 'row_delete_1')
        if(row_item){
          fireEvent.click(row_item)
        }
        // InputBox
        let btn_ok = getById(container, 'btn_ok')
        if(btn_ok && !ok){
          ok = true
          fireEvent.click(btn_ok)
        }
      }
      if(callback){
        callback()
      }
    })

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = getById(container, 'mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
    expect(setData).toHaveBeenCalledTimes(2);
  })

});
