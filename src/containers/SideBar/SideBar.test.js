import React from 'react';
import { render, fireEvent, queryByAttribute, screen } from '@testing-library/react'
import update from 'immutability-helper';

import SideBar from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'
import { Default as EditDefault, DocumentCancellation, Document as EditDocument, NewMovement } from 'components/SideBar/Edit/Edit.stories'
import { FormItemAll, TemplateEditor } from 'components/SideBar/Setting/Setting.stories'

import { appActions } from 'containers/App/actions'
import { editorActions } from 'containers/Editor/actions'
import { settingActions } from 'containers/Setting/actions'
import { searchActions } from 'containers/Search/actions'
import { templateActions } from 'containers/Report/Template'
import { reportActions } from 'containers/Report/actions'

jest.mock("containers/App/actions");
jest.mock("containers/Editor/actions");
jest.mock("containers/Setting/actions");
jest.mock("containers/Search/actions");
jest.mock("containers/Report/Template");
jest.mock("containers/Report/actions");

const getById = queryByAttribute.bind(null, 'id');

const store = update(app_store, {$merge: {
  login: {
    username: 'admin',
    data: {
      audit_filter: EditDefault.args.auditFilter,
      edit_new: EditDefault.args.newFilter
    }
  }
}})

describe('<SideBar />', () => {

  beforeEach(() => {
    appActions.mockReturnValue({
      getSideBar: jest.fn(),
      getText: jest.fn(),
      resultError: jest.fn(),
      showHelp: jest.fn(),
      saveBookmark: jest.fn()
    })
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders in the Search state', () => {
    searchActions.mockReturnValue({
      showBrowser: jest.fn(),
    })
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn()
    const it_store = update(store, {
      current: {$merge: {
        module: "search",
      }},
      search: {$merge: {
        group_key: "transitem"
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const btn_transitem = getById(container, 'btn_view_transitem')
    fireEvent.click(btn_transitem)
    expect(setData).toHaveBeenCalledTimes(2);

    const btn_browser = getById(container, 'btn_browser_transitem')
    fireEvent.click(btn_browser)
    expect(setData).toHaveBeenCalledTimes(3);

    const btn_group = getById(container, 'btn_group_customer')
    fireEvent.click(btn_group)
    expect(setData).toHaveBeenCalledTimes(4);

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar />
      </AppProvider>
    )
  });

  it('renders in the Setting state', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    settingActions.mockReturnValue({
      loadSetting: jest.fn(),
      setPasswordForm: jest.fn(),
      setProgramForm: jest.fn(),
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        group_key: "group_database"
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const cmd_deffield = getById(container, 'cmd_deffield')
    fireEvent.click(cmd_deffield)
    expect(setData).toHaveBeenCalledTimes(1);

    const cmd_company = getById(container, 'cmd_company')
    fireEvent.click(cmd_company)
    expect(setData).toHaveBeenCalledTimes(2);

    it_store = update(it_store, {
      setting: {$merge: {
        group_key: "group_user"
      }}
    })

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    )

    const cmd_program = getById(container, 'cmd_program')
    fireEvent.click(cmd_program)
    expect(setData).toHaveBeenCalledTimes(3);

    let cmd_password = getById(container, 'cmd_password')
    fireEvent.click(cmd_password)
    expect(setData).toHaveBeenCalledTimes(4);

  });

  it('renders in the Setting - setPassword', () => {
    settingActions.mockReturnValue({
      setPasswordForm: jest.fn()
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    const it_store = update(store, {
      login: {$merge: {
        username: undefined
      }},
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        group_key: "group_user"
      }},
      edit: {$merge: {
        current: {
          type: "employee"
        },
        dataset: {
          employee: [
            { username: "admin" }
          ]
        }
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar />
      </AppProvider>
    )

    const cmd_password = getById(container, 'cmd_password')
    fireEvent.click(cmd_password)
    expect(setData).toHaveBeenCalledTimes(1);
  })

  it('renders in the Setting - settingSave', () => {
    settingActions.mockReturnValue({
      changePassword: jest.fn(),
      saveSetting: jest.fn(async () => ({ type: "", current: { form: { id: 1 } }})),
      loadSetting: jest.fn()
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        ...FormItemAll.args.module
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_save = getById(container, 'cmd_save')
    fireEvent.click(cmd_save)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      setting: {$merge: {
        type: "password",
      }}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    cmd_save = getById(container, 'cmd_save')
    fireEvent.click(cmd_save)
    expect(setData).toHaveBeenCalledTimes(2);

  })

  it('renders in the Setting - settingSave missing result', () => {
    settingActions.mockReturnValue({
      saveSetting: jest.fn(async () => (null)),
      loadSetting: jest.fn()
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        ...FormItemAll.args.module
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_save = getById(container, 'cmd_save')
    fireEvent.click(cmd_save)
    expect(setData).toHaveBeenCalledTimes(1);

  })

  it('renders in the Setting - exportTemplate', () => {
    templateActions.mockReturnValue({
      exportTemplate: jest.fn(),
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        ...TemplateEditor.args.module
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const cmd_json = getById(container, 'cmd_json')
    fireEvent.click(cmd_json)
    expect(setData).toHaveBeenCalledTimes(1);

  })
  
  it('renders in the Setting - settingBack', () => {
    settingActions.mockReturnValue({
      checkSetting: jest.fn(),
      loadSetting: jest.fn()
    })

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "setting",
      }},
      setting: {$merge: {
        ...FormItemAll.args.module
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_back = getById(container, 'cmd_back')
    fireEvent.click(cmd_back)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      setting: {$merge: {
        type: "password",
      }}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    cmd_back = getById(container, 'cmd_back')
    fireEvent.click(cmd_back)
    expect(setData).toHaveBeenCalledTimes(3);
  
  })

  it('renders in the Edit state', () => {
    const setData = jest.fn()
    const it_store = update(store, {
      current: {$merge: {
        module: "edit",
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const state_edit = getById(container, 'state_new')
    fireEvent.click(state_edit)
    expect(setData).toHaveBeenCalledTimes(1);

  });

  it('renders in the Edit - editorBack', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      login: {data: {$merge: {
        groups: [
          { id:1, groupvalue: "trans" }
        ]
      }}},
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...DocumentCancellation.args.module
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_back = getById(container, 'cmd_back')
    fireEvent.click(cmd_back)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      edit: {current: {$merge: {
        form_type: "transitem_shipping",
        type: "trans",
        transtype: "invoice"
      }}}
    })

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );

    cmd_back = getById(container, 'cmd_back')
    fireEvent.click(cmd_back)
    expect(setData).toHaveBeenCalledTimes(2);

    it_store = update(it_store, {
      edit: {current: {$merge: {
        form_type: "invoice",
        type: "trans",
        transtype: "invoice",
        form: {}
      }}}
    })

    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );

    cmd_back = getById(container, 'cmd_back')
    fireEvent.click(cmd_back)
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('renders in the Edit - createReport, showHelp', () => {
    reportActions.mockReturnValue({
      createReport: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const cmd_print = getById(container, 'cmd_print')
    fireEvent.click(cmd_print)
    expect(setData).toHaveBeenCalledTimes(1);

    const cmd_help = getById(container, 'cmd_help')
    fireEvent.click(cmd_help)
    expect(setData).toHaveBeenCalledTimes(2);

  })

  it('renders in the Edit - saveEditor', () => {
    editorActions.mockReturnValue({
      saveEditorForm: jest.fn(),
      saveEditor: jest.fn(async () => ({ current: { item: {} }})),
      loadEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_save = getById(container, 'cmd_save')
    fireEvent.click(cmd_save)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      edit: {current: {$merge: {
        form: {}
      }}}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    cmd_save = getById(container, 'cmd_save')
    fireEvent.click(cmd_save)
    expect(setData).toHaveBeenCalledTimes(2);

  })

  it('renders in the Edit - shippingAddAll', () => {
    editorActions.mockReturnValue({
      setEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module,
        dataset: {
          shiptemp: [{}],
          shipping_items_: [
            { diff: 0, edited: true },
            { diff: 1, edited: false, item_id: 1, product_id: 1 }
          ]
        }
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_shipping = getById(container, 'cmd_shipping_all')
    fireEvent.click(cmd_shipping)
    expect(setData).toHaveBeenCalledTimes(1);

  })

  it('renders in the Edit - setLink', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module,
        current: {
          transtype: "invoice",
          extend: {
            id: 1, nervatype: 1, ref_id: 1
          },
          form: {
            id: 1, nervatype: 1, ref_id: 1
          }
        }
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_link = getById(container, 'cmd_link')
    fireEvent.click(cmd_link)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      edit: {current: {$merge: {
        transtype: "cash",
      }}}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    cmd_link = getById(container, 'cmd_link')
    fireEvent.click(cmd_link)
    expect(setData).toHaveBeenCalledTimes(2);

  })

  it('renders in the Edit - transCopy', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onOK
        const btn_ok = getById(container, 'btn_ok')
        fireEvent.click(btn_ok)
        // onCancel
        const btn_cancel = getById(container, 'btn_cancel')
        fireEvent.click(btn_cancel)
      }
      if(callback){callback()} 
    })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module,
      }}
    })

    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    const cmd_create = getById(container, 'cmd_create')
    fireEvent.click(cmd_create)
    expect(setData).toHaveBeenCalledTimes(1);

    const cmd_copy = getById(container, 'cmd_copy')
    fireEvent.click(cmd_copy)
    expect(setData).toHaveBeenCalledTimes(5);

  })

  it('renders in the Edit - editorDelete', () => {
    editorActions.mockReturnValue({
      deleteEditorItem: jest.fn(),
      deleteEditor: jest.fn(),
    })
    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module,
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_delete = getById(container, 'cmd_delete')
    fireEvent.click(cmd_delete)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(it_store, {
      edit: {current: {$merge: {
        form: {}
      }}}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    cmd_delete = getById(container, 'cmd_delete')
    fireEvent.click(cmd_delete)
    expect(setData).toHaveBeenCalledTimes(2);

  })

  it('renders in the Edit - editorNew', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    searchActions.mockReturnValue({
      quickSearch: jest.fn(async () => ({ 
        result: [ {id:"trans/invoice/1"}, {id:"trans/invoice/2"}, {id:"trans/invoice/3"} ] 
      })),
    })
    let isResult = false
    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSearch
        if(!isResult){
          isResult = true
          const btn_search = getById(container, 'btn_search')
          fireEvent.click(btn_search)
        }
        if(isResult){
          const row_item = screen.getAllByRole('row')
          if(row_item[2]){
            // onSelect
            fireEvent.click(row_item[2])
          }
        }
        // onCancel
        const btn_cancel = getById(container, 'closeIcon')
        fireEvent.click(btn_cancel)
      }
      if(callback){callback()} 
    })
    let it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: true
      }},
      edit: {$merge: {
        ...EditDocument.args.module,
      }}
    })

    const { container, rerender } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();

    let cmd_new = getById(container, 'cmd_new')
    fireEvent.click(cmd_new)
    expect(setData).toHaveBeenCalledTimes(1);

    it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: false
      }},
      edit: {$merge: {
        ...NewMovement.args.module,
      }}
    })
    rerender(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    let shipping = getById(container, 'shipping')
    fireEvent.click(shipping)
    expect(setData).toHaveBeenCalledTimes(4);

  })

  it('renders in the Edit - editorNew onSearch error', () => {
    editorActions.mockReturnValue({
      checkEditor: jest.fn(),
    })
    searchActions.mockReturnValue({
      quickSearch: jest.fn(async () => ({ 
        error: {} 
      })),
    })
    let isResult = false
    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const { container } = render(data.modalForm);
        // onSearch
        if(!isResult){
          isResult = true
          const btn_search = getById(container, 'btn_search')
          fireEvent.click(btn_search)
        }
      }
      if(callback){callback()} 
    })

    const it_store = update(store, {
      current: {$merge: {
        module: "edit",
        edit: false
      }},
      edit: {$merge: {
        ...NewMovement.args.module,
      }}
    })
    const { container } = render(
      <AppProvider value={{ data: it_store, setData: setData }}>
        <SideBar id="sidebar" />
      </AppProvider>
    );
    expect(getById(container, 'sidebar')).toBeDefined();
    
    let shipping = getById(container, 'shipping')
    fireEvent.click(shipping)
    expect(setData).toHaveBeenCalledTimes(2);
  })

})
