import React from 'react';
import { render, fireEvent } from '@testing-library/react'
import update from 'immutability-helper';

import MenuBar from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'
import { BookmarkData } from 'components/Modal/Bookmark/Bookmark.stories'

const store = update(app_store, {$merge: {
    bookmark: BookmarkData.args.bookmark,
    login: {
      data: {
        engine: 'sqlite',
        employee: {
          id: 1, empnumber: 'admin', username: 'admin', usergroup: 114,
          usergroupName: 'admin'
        },
        transfilter: 122,
        transfilterName: 'own',
      }
    }
  }})

const scrollTo = jest.fn()

describe('<MenuBar />', () => {

  beforeEach(() => {
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
    expect(container.querySelector('#mnu_sidebar')).toBeDefined();

    const mnu_scroll = container.querySelector('#mnu_scroll')
    fireEvent.click(mnu_scroll)
    expect(scrollTo).toHaveBeenCalledTimes(1);

    const mnu_sidebar = container.querySelector('#mnu_sidebar')
    fireEvent.click(mnu_sidebar)
    expect(setData).toHaveBeenCalledTimes(1);

    const mnu_logout_large = container.querySelector('#mnu_logout_large')
    fireEvent.click(mnu_logout_large)
    expect(setData).toHaveBeenCalledTimes(2);

    const mnu_help_large = container.querySelector('#mnu_help_large')
    fireEvent.click(mnu_help_large)

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <MenuBar />
      </AppProvider>
    )
  });

  it('loadSetting', () => {
    const it_store = update({}, {$merge: store})
    const setData = (key, data, callback) => {
      if(callback){
        if(data.group_key){
          it_store.setting.group_key = "group_admin"
        }
        callback()
      }
    }
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        return Promise.reject({ 
          status: 400,
          message: "Error"
        })
      }
    )

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <MenuBar />
      </AppProvider>
    );

    const mnu_setting_large = container.querySelector('#mnu_setting_large')
    fireEvent.click(mnu_setting_large)
    fireEvent.click(mnu_setting_large)
  })

  it('showBookmarks - bookmark', () => {
    const setData = async (key, data, callback) => {
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSelect bookmark element
        let row_item = container.querySelector('#row_item_1')
        fireEvent.click(row_item)
        // onClose
        const close = container.querySelector('#closeIcon')
        fireEvent.click(close)
      }
      if(callback){
        callback()
      }
    }

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = container.querySelector('#mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
  })

  it('showBookmarks - history', () => {
    const setData = async (key, data, callback) => {
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSelect bookmark element
        let row_item = container.querySelector('#row_item_0')
        fireEvent.click(row_item)
      }
      if(callback){
        callback()
      }
    }

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="history" />
      </AppProvider>
    );

    const mnu_bookmark_large = container.querySelector('#mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
  })

  it('showBookmarks - onDelete cancel+error', () => {
    let cancel = false
    let ok = false
    const setData = async (key, data, callback) => {
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // showBookmarks - delete icon
        let row_item = container.querySelector('#row_delete_1')
        if(row_item){
          fireEvent.click(row_item)
        }
        // InputBox
        let btn_cancel = container.querySelector('#btn_cancel')
        if(btn_cancel && !cancel){
          cancel = true
          fireEvent.click(btn_cancel)
        }
        let btn_ok = container.querySelector('#btn_ok')
        if(btn_ok && !ok){
          ok = true
          fireEvent.click(btn_ok)
        }
      }
      if(callback){
        callback()
      }
    }

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = container.querySelector('#mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
  })

  it('showBookmarks - onDelete ok', () => {
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        return Promise.resolve({
          status: 200,
          headers: {
            get: (key) => {
              return "application/json;charset=UTF-8"
            }
          },
          json: () => Promise.resolve([])
        })
      }
    )
    let ok = false
    const setData = async (key, data, callback) => {
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // showBookmarks - delete icon
        let row_item = container.querySelector('#row_delete_1')
        if(row_item){
          fireEvent.click(row_item)
        }
        // InputBox
        let btn_ok = container.querySelector('#btn_ok')
        if(btn_ok && !ok){
          ok = true
          fireEvent.click(btn_ok)
        }
      }
      if(callback){
        callback()
      }
    }

    const { container } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <MenuBar bookmarkView="bookmark" />
      </AppProvider>
    );

    const mnu_bookmark_large = container.querySelector('#mnu_bookmark_large')
    fireEvent.click(mnu_bookmark_large)
  })
  
});
