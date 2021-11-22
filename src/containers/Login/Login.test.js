import { render, fireEvent, waitFor } from '@testing-library/react';
import update from 'immutability-helper';

import { AppProvider } from 'containers/App/context'
import { store as app_store  } from 'config/app'

import Login from './index';

const fetchResult = (code, data) => {
  if(code === 400){
    return Promise.reject({ 
      status: 400,
      message: "Error"
    })
  }
  return Promise.resolve({
    status: code,
    headers: {
      get: (key) => {
        return "application/json;charset=UTF-8"
      }
    },
    json: () => Promise.resolve(data)
  })
}

describe('<Login />', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    let store_data = update(app_store, {
      current: {$merge: {
        theme: "light"
      }}
    })
    const setData = jest.fn()

    const { container, rerender } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    expect(container.querySelector('#test_login')).toBeDefined();

    const username = container.querySelector('#username')
    fireEvent.change(username, {target: {value: "username"}})
    expect(setData).toHaveBeenCalledTimes(1);

    const sb_lang = container.querySelector('#lang')
    fireEvent.change(sb_lang, {target: {value: "jp"}})
    expect(setData).toHaveBeenCalledTimes(2);

    const cmd_theme = container.querySelector('#theme')
    fireEvent.click(cmd_theme)
    expect(setData).toHaveBeenCalledTimes(3);
    
    rerender(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
  });

  it('onLogin error', async () => {
    let store_data = update(app_store, {
      current: {$merge: {
        theme: "dark"
      }},
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        return fetchResult(400)
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_theme = container.querySelector('#theme')
    fireEvent.click(cmd_theme)
    expect(setData).toHaveBeenCalledTimes(1);

    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(2));
  });

  it('onLogin engine_error', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        return fetchResult(200, {
          token: "token", engine: "engine_error"
        })
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(3));
  });

  it('onLogin version_error', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        return fetchResult(200, {
          token: "token", engine: "sqlite", version: "version_error"
        })
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(3));
  });

  it('onLogin loginData error 1', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        if(path === "/api/auth/login"){
          return fetchResult(200, {
            token: "token", engine: "sqlite", version: "dev"
          })
        }
        return fetchResult(400)
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(5));
  });

  it('onLogin loginData error 2', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        if(path === "/api/auth/login"){
          return fetchResult(200, {
            token: "token", engine: "sqlite", version: "dev"
          })
        }
        if(options.data[0].key === "employee"){
          return fetchResult(200, {
            employee: [{ usergroup: 0 }], menuCmds: [], menuFields: [], userlogin: [], groups: []
          })
        }
        return fetchResult(400)
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(7));
  });

  it('onLogin userLog error', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        if(path === "/api/auth/login"){
          return fetchResult(200, {
            token: "token", engine: "sqlite", version: "dev"
          })
        }
        if(options.data[0].key === "employee"){
          return fetchResult(200, {
            employee: [{ usergroup: 0 }], menuCmds: [], menuFields: [], 
            userlogin: [{ value: "true" }], 
            groups: [{ id: 1, groupname: "transfilter", groupvalue: "all" }]
          })
        }
        if(options.data[0].key === "audit"){
          return fetchResult(200, {
            audit: [], transfilter: []
          })
        }
        return fetchResult(400)
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(9));
  });

  it('onLogin success', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        if(path === "/api/auth/login"){
          return fetchResult(200, {
            token: "token", engine: "sqlite", version: "dev"
          })
        }
        if(options.data[0].key === "employee"){
          return fetchResult(200, {
            employee: [{ id: 1, usergroup: 0 }], menuCmds: [], menuFields: [], 
            userlogin: [{ value: "false" }], 
            groups: [{ id: 1, groupname: "transfilter", groupvalue: "all" }]
          })
        }
        if(options.data[0].key === "audit"){
          return fetchResult(200, {
            audit: [
              { nervatypeName: "trans", subtypeName: "invoice", inputfilterName: "update", supervisor: 0 },
              { nervatypeName: "trans", subtypeName: "worksheet", inputfilterName: "disabled", supervisor: 0 },
              { nervatypeName: "tool", subtypeName: null, inputfilterName: "disabled", supervisor: 0 },
            ], 
            transfilter: [{ id: 1, transfilterName: "update" }]
          })
        }
        return fetchResult(200, {})
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(11));
  });

  it('onLogin success and log', async () => {
    let store_data = update(app_store, {
      login: {$merge: {
        username: "admin",
        database: "demo"
      }}
    })
    const setData = jest.fn()
    jest.spyOn(global, "fetch").mockImplementation(
      (path, options) => {
        if(path === "/api/auth/login"){
          return fetchResult(200, {
            token: "token", engine: "sqlite", version: "dev"
          })
        }
        if(options.data[0].key === "employee"){
          return fetchResult(200, {
            employee: [{ id: 1, usergroup: 0 }], menuCmds: [], menuFields: [], 
            userlogin: [{ value: "true" }], 
            groups: [{ id: 1, groupname: "transfilter", groupvalue: "all" }]
          })
        }
        if(options.data[0].key === "audit"){
          return fetchResult(200, {
            audit: [
              { nervatypeName: "trans", subtypeName: "invoice", inputfilterName: "update", supervisor: 0 },
              { nervatypeName: "trans", subtypeName: "worksheet", inputfilterName: "disabled", supervisor: 0 },
              { nervatypeName: "tool", subtypeName: null, inputfilterName: "disabled", supervisor: 0 },
            ], 
            transfilter: [{ id: 1, transfilterName: "update" }]
          })
        }
        return fetchResult(200, {})
      }
    )
    const { container } = render(
      <AppProvider value={{ data: store_data, setData: setData }}>
        <Login id="test_login" />
      </AppProvider>)
    
    const cmd_login = container.querySelector('#login')
    fireEvent.click(cmd_login)
    await waitFor(() => expect(setData).toHaveBeenCalledTimes(13));
  });

});