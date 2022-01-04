import { renderHook } from '@testing-library/react-hooks'
import { queryByAttribute } from '@testing-library/react'
import ReactDOM from 'react-dom';
import update from 'immutability-helper';

import { AppProvider } from 'containers/App/context'
import { store as app_store  } from 'config/app'
import { request, guid, saveToDisk, getSql, useApp } from './actions'
import { toast } from 'react-toastify';

jest.mock("react-toastify");

const getById = queryByAttribute.bind(null, 'id');
const wrapper = ({ children }) => <AppProvider 
  value={{ 
    data: app_store, 
    setData: jest.fn((key, data, callback)=>{ if(callback){callback()} }) 
  }}>{children}</AppProvider>

it('getSql', () => {
  expect(getSql("sqlite", "select * from table")).toBeDefined();
  expect(getSql("sqlite3", "select * from table")).toBeDefined();
  expect(getSql("mysql", "select * from table")).toBeDefined();
  expect(getSql("postgres", "select * from table")).toBeDefined();
  expect(getSql("mssql", "select * from table")).toBeDefined();
  expect(getSql("", "select * from table")).toBeDefined();

  expect(getSql("postgres", {
    select: ["col1, col2"], from: "table t1",
    inner_join:["table2 t2","on",["t1.id","=","t2.id"]],
    left_join:["table3 t3","on",["t1.id","=","t3.id"]],
    where: [["t1.col1","=","0"],["and",["t3.col3","is",null]],["or",["t2.col2",">","1"]]]
  })).toBeDefined();

  expect(getSql("postgres", {
    update: "table", set: [[],["col1","=","?"],["col2","=","?"]], where: [["col1","=","0"]]
  })).toBeDefined();
  expect(getSql("postgres", {
    insert_into: ["table",[[],"col1","col2","col3"]], values:[[],"?","?","?"]
  })).toBeDefined();

  expect(getSql("sqlite3", {
    update: "table", set: [[],["col1","=","?"],["col2","=","?"]], where: [["col1","=","0"]]
  })).toBeDefined();
  expect(getSql("sqlite3", {
    insert_into: ["table",[[],"col1","col2","col3"]], values:[[],"?","?","?"], where: []
  })).toBeDefined();
});

describe('saveToDisk', () => {
  beforeEach(() => {
    jest.spyOn(document.body, 'appendChild');
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('call saveToDisk', () => {
    saveToDisk("fileUrl", "fileName")
    saveToDisk("fileUrl")
  });
})

it('guid', () => {
  expect(guid()).toBeDefined();
});

describe('request', () => {
  // Before each test, stub the fetch function
  beforeEach(() => {
    window.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('stubbing successful json response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 200,
        headers: {
          'Content-type': 'application/json',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result.hello).toBe('world');
    });

  });

  describe('stubbing successful text response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('hello', {
        status: 200,
        headers: {
          'Content-type': 'text/plain',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBe("hello");
    });

  });

  describe('stubbing successful csv response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('hello,hello', {
        status: 200,
        headers: {
          'Content-type': 'text/csv',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBe("hello,hello");
    });

  });

  describe('stubbing successful default response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('default', {
        status: 200,
        headers: {
          'Content-type': 'unknown',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result.status).toBe(200);
    });

  });

  describe('stubbing successful pdf response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response(new Blob(["pdf"], { type: 'application/pdf'}), {
        status: 200,
        headers: {
          'Content-type': 'application/pdf',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBeDefined();
    });

  });

  describe('stubbing successful xml response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response(new Blob(["<xml></xml>"], { type: 'text/xml'}), {
        status: 200,
        headers: {
          'Content-type': 'application/xml',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBeDefined();
    });

  });

  describe('stubbing successful excel response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response(new Blob(["<xml></xml>"], { type: 'text/xml'}), {
        status: 200,
        headers: {
          'Content-type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBeDefined();
    });

  });

  describe('stubbing 204 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('', {
        status: 204,
        statusText: 'No Content'
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should return null on 204 response', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBeDefined();
    });

  });

  describe('stubbing 401 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"hello":"world"}', {
        status: 401,
        headers: {
          'Content-type': 'application/json',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result.message).toBe('Unauthorized');
    });

  });

  describe('stubbing 400 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('{"error":"errordata"}', {
        status: 400,
        headers: {
          'Content-type': 'application/json',
        },
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should format the response correctly', async () => {
      const result = await request('/thisurliscorrect')
      expect(result.error).toBe('errordata');
    });

  });

  describe('stubbing 205 response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('', {
        status: 205,
        statusText: 'No Content'
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should return null on 205 response', async () => {
      const result = await request('/thisurliscorrect')
      expect(result).toBeDefined();
    });

  });

  describe('stubbing error response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      const res = new Response('', {
        status: 404,
        statusText: 'Not Found',
      });

      window.fetch.mockReturnValue(Promise.resolve(res));
    });

    it('should catch errors', async () => {
      let result
      try {
        result = await request('/thisurliscorrect')
      } catch (error) {
        result = error.message
      }
      expect(result).toBe("Not Found");
    });

  });

});

describe('useApp', () => {

  beforeEach(() => {
    window.fetch = jest.fn()
    toast.mockReturnValue({
      error: jest.fn(),
      warning: jest.fn(),
      success: jest.fn(),
      info: jest.fn(),
    })
    jest.spyOn(document.body, 'appendChild');
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  it('getText', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    
    let langText = result.current.getText("en", "en")
    expect(langText).toBe("English")
  });
  
  it('showToast', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    result.current.showToast({autoClose: true, type: "error", message: "message"})
    result.current.showToast({autoClose: false, type: "warning", message: "message"})
    result.current.showToast({autoClose: false, type: "success", message: "message"})
    result.current.showToast({autoClose: true, type: "info", message: "message"})
    result.current.showToast({autoClose: true, type: "default", message: "message"})
  });

  it('resultError', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.resultError({})
    result.current.resultError({error:"error"})
    result.current.resultError({error:{message: "message"}})
  });

  it('signOut', () => {
    const setData = jest.fn()
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: app_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.signOut()
    expect(setData).toHaveBeenCalledTimes(1);
  });

  it('requestData 200', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      session: {$merge: {
        configServer: true
      }},
      login: {$merge: {
        data: {
          token: "token"
        }
      }}
    })
    const options = {
      data: {
        value: "value"
      },
      query: { 
        id: 1 
      }
    }
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    const resultData = await result.current.requestData("/test", options, false)
    expect(resultData.hello).toBe("world");
    expect(setData).toHaveBeenCalledTimes(2);

  });

  it('requestData 401', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 401,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      session: {$merge: {
        configServer: false
      }}
    })
    const options = {
      token: "token",
      headers: {}
    }
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    const resultData = await result.current.requestData("/test", options, true)
    expect(resultData.error.message).toBe("Unauthorized");
    expect(setData).toHaveBeenCalledTimes(1);

  });

  it('requestData 400', async () => {
    const res = new Response('{"code":400, "message":"errordata"}', {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      session: {$merge: {
        configServer: false
      }}
    })
    const options = {}
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    const resultData = await result.current.requestData("/test", options, true)
    expect(resultData.error.message).toBe("errordata");
    expect(setData).toHaveBeenCalledTimes(0);

  });

  it('requestData error', async () => {
    const res = new Response('', {
      status: 404,
      statusText: 'Not Found',
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      session: {$merge: {
        configServer: false
      }}
    })
    const options = {}
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    let resultData = await result.current.requestData("/test", options, true)
    expect(resultData.error.message).toBe("Not Found");
    expect(setData).toHaveBeenCalledTimes(0);

    resultData = await result.current.requestData("/test", options, false)
    expect(resultData.error.message).toBe("Not Found");
    expect(setData).toHaveBeenCalledTimes(2);

  });

  it('getSideBar', () => {
    const setData = jest.fn()
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: app_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    let value = result.current.getSideBar()
    expect(value).toBe("show");
    value = result.current.getSideBar("auto")
    expect(value).toBe("show");
    value = result.current.getSideBar("show")
    expect(value).toBe("hide");
    value = result.current.getSideBar("hide")
    expect(value).toBe("show");
  });

  it('getAuditFilter', () => {
    const setData = jest.fn()
    const it_store = update(app_store, {
      login: {$merge: {
        data: {
          audit: [
            {
              inputfilter: 108,
              inputfilterName: 'update',
              nervatype: 10,
              nervatypeName: 'customer',
              subtype: null,
              subtypeName: null,
              supervisor: 1
            },
            {
              inputfilter: 107,
              inputfilterName: 'readonly',
              nervatype: 31,
              nervatypeName: 'trans',
              subtype: 62,
              subtypeName: 'inventory',
              supervisor: 0
            },
            {
              inputfilter: 106,
              inputfilterName: 'disabled',
              nervatype: 28,
              nervatypeName: 'report',
              subtype: 6,
              subtypeName: null,
              supervisor: 0
            },
            {
              inputfilter: 106,
              inputfilterName: 'disabled',
              nervatype: 18,
              nervatypeName: 'menu',
              subtype: 1,
              subtypeName: 'nextNumber',
              supervisor: 0
            }
          ]
        }
      }}
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    let audit = result.current.getAuditFilter("trans", "inventory")
    expect(audit[0]).toBe("readonly");
    audit = result.current.getAuditFilter("menu", "nextNumber")
    expect(audit[0]).toBe("disabled");
    audit = result.current.getAuditFilter("report", 6)
    expect(audit[0]).toBe("disabled");
    audit = result.current.getAuditFilter("customer")
    expect(audit[0]).toBe("update");
    audit = result.current.getAuditFilter("product")
    expect(audit[0]).toBe("all");

  });

  it('createHistory trans', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "trans",
          transtype: "invoice",
          item: {
            id: 5,
            transnumber: "DMINV/00001"
          }
        },
        template: {
          options: {
            title: "INVOICE",
            title_field: "transnumber"
          }
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }}
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.createHistory("save")
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('createHistory customer', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "customer",
          item: {
            id: 1,
            custnumber: "CUST/00001"
          }
        },
        template: {
          options: {
            title: "CUSTOMER",
            title_field: "custnumber"
          }
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
      bookmark: {$merge: {
        history: {
          employee_id: 1,
          section: "history",
          cfgroup: "2022-01-03T22:27:00+02:00",
          cfname: 1,
          cfvalue: "[{\"datetime\":\"2022-01-03T22:21:32+02:00\",\"type\":\"save\",\"ntype\":\"trans\",\"transtype\":\"invoice\",\"id\":5,\"title\":\"INVOICE | DMINV/00001\"}]",
        }
      }}
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.createHistory("save")
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('createHistory error', async () => {
    const res = new Response('{"code":400, "message":"errordata"}', {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "customer",
          item: {
            id: 1,
          }
        },
        template: {
          options: {
            title: "CUSTOMER",
          }
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
      bookmark: {$merge: {
        history: {
          employee_id: 1,
          section: "history",
          cfgroup: "2022-01-03T22:27:00+02:00",
          cfname: 1,
          cfvalue: "[{},{},{},{},{},{},{},{},{},{}]",
        }
      }}
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.createHistory("save")
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('loadBookmark 1.', async () => {
    const res = new Response('[{"section":"history"},{"section":"bookmark"}]', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: app_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.loadBookmark({ token:"token", user_id: 1, callback: ()=>{} })
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('loadBookmark 2.', async () => {
    const res = new Response('[{"section":"bookmark"}]', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ if(callback){callback()} })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: app_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.loadBookmark({ token:"token", user_id: 1 })
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('loadBookmark error', async () => {
    const res = new Response('{"code":400, "message":"errordata"}', {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn()
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: app_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    await result.current.loadBookmark({ token:"token", user_id: 1, callback: ()=>{} })
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('showHelp', () => {
    const { result } = renderHook(() => useApp(), { wrapper })
    result.current.showHelp("help")
  });

  it('saveBookmark browser', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const container = document.createElement('div');
        ReactDOM.render(data.modalForm, container);

        // onOK
        const btn_ok = getById(container, 'btn_ok')
        btn_ok.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        
        // onCancel
        const btn_cancel = getById(container, 'btn_cancel')
        btn_cancel.dispatchEvent(new MouseEvent('click', {bubbles: true}));
      }
      if(callback){callback()} 
    })
    const it_store = update(app_store, {
      search: {$merge: {
        vkey: "customer",
        filters: {
          CustomerView: [
          ],
        },
        columns: {
          CustomerView: {
            custnumber: true,
            custname: true,
            address: true,
          },
        },
        view: "CustomerView",
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.saveBookmark(['browser', 'Customer Data'])
    expect(setData).toHaveBeenCalledTimes(4);

    result.current.saveBookmark(['browser', ''])
    expect(setData).toHaveBeenCalledTimes(7);

  });

  it('saveBookmark editor trans 1.', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const container = document.createElement('div');
        ReactDOM.render(data.modalForm, container);

        // onOK
        const btn_ok = getById(container, 'btn_ok')
        btn_ok.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        
      }
      if(callback){callback()} 
    })
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "trans",
          transtype: "invoice",
          item: {
            id: 5,
            transnumber: "DMINV/00001",
            transdate: "2020-12-10",
          }
        },
        dataset: {
          trans: [
            {
              custname: "First Customer Co."
            }
          ]
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.saveBookmark(['editor', 'trans', 'transnumber'])
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('saveBookmark editor trans 2.', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const container = document.createElement('div');
        ReactDOM.render(data.modalForm, container);

        // onOK
        const btn_ok = getById(container, 'btn_ok')
        btn_ok.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        
      }
      if(callback){callback()} 
    })
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "trans",
          transtype: "receipt",
          item: {
            id: 5,
            transnumber: "DMINV/00001",
            transdate: "2020-12-10",
          }
        },
        dataset: {
          trans: [
            {
              custname: null
            }
          ]
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.saveBookmark(['editor', 'trans', 'transnumber'])
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('saveBookmark editor customer', async () => {
    const res = new Response('{"hello":"world"}', {
      status: 200,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const container = document.createElement('div');
        ReactDOM.render(data.modalForm, container);

        // onOK
        const btn_ok = getById(container, 'btn_ok')
        btn_ok.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        
      }
      if(callback){callback()} 
    })
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "customer",
          transtype: "",
          item: {
            id: 2,
            custnumber: "DMCUST/00001",
            custname: "First Customer Co.",
          }
        },
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.saveBookmark(['editor', 'customer', 'custname', 'custnumber'])
    expect(setData).toHaveBeenCalledTimes(3);

  });

  it('saveBookmark error', async () => {
    const res = new Response('{"code":400, "message":"errordata"}', {
      status: 400,
      headers: {
        'Content-type': 'application/json',
      },
    });
    window.fetch.mockReturnValue(Promise.resolve(res));

    const setData = jest.fn((key, data, callback)=>{ 
      if((key === "current") && data.modalForm ){
        const container = document.createElement('div');
        ReactDOM.render(data.modalForm, container);

        // onOK
        const btn_ok = getById(container, 'btn_ok')
        btn_ok.dispatchEvent(new MouseEvent('click', {bubbles: true}));
        
      }
      if(callback){callback()} 
    })
    const it_store = update(app_store, {
      edit: {$merge: {
        current: {
          type: "trans",
          transtype: "invoice",
          item: {
            id: 5,
            transnumber: "DMINV/00001",
            transdate: "2020-12-10",
          }
        },
        dataset: {
          trans: [
            {
              custname: "First Customer Co."
            }
          ]
        }
      }},
      login: {$merge: {
        data: {
          employee: {
            id: 1
          }
        }
      }},
    })
    const wrapper = ({ children }) => <AppProvider 
      value={{ data: it_store, setData: setData }}>{children}</AppProvider>
    const { result } = renderHook(() => useApp(), { wrapper })
    
    result.current.saveBookmark(['editor', 'trans', 'transnumber'])
    expect(setData).toHaveBeenCalledTimes(3);

  });

})