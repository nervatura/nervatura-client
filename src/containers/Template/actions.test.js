import update from 'immutability-helper';
import { templateActions } from './actions'
import { templateElements } from './Template'

import { getText as appGetText, store as app_store  } from 'config/app'

const sample_template = require('../../config/sample.json')
const getText = (key)=>appGetText({ locales: app_store.session.locales, lang: "en", key: key })

const store = update(app_store, {$merge: {
  login: {
    data: {
      employee: {
        id: 1, empnumber: 'admin', username: 'admin', usergroup: 114,
        usergroupName: 'admin'
      },
    }
  },
  template: {
    key: "_sample",
    template: {
      ...update(sample_template, {}),
      sources: {
        head: {
          default: "select * from table"
        }
      },
      footer: []
    },
    current: {
      id: "tmp_report",
      section: "report",
      type: "report",
      item: update(sample_template, {}).report,
      index: null,
      parent: null,
      parent_type: null,
      parent_index: null,
      form: templateElements({ getText: getText })["report"]
    }
  }
}})

describe('templateActions', () => {
  
  it('getElementType', () => {
    const setData = jest.fn()
    let values = templateActions(store, setData).getElementType({ row: {} })
    expect(values).toBe("row")
    values = templateActions(store, setData).getElementType({})
    expect(values).toBeNull()
  })

  it('getDataset', () => {
    const sample = update(sample_template, {})
    const setData = jest.fn()
    const dataset = templateActions(store, setData).getDataset(sample.data)
    expect(dataset.length).toBe(6)
  })

  it('setCurrent', () => {
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      key: "test"
    }}})
    templateActions(it_store, setData).setCurrent({tmp_id: "tmp_details", set_dirty: true})
    expect(setData).toHaveBeenCalledTimes(1)
    templateActions(it_store, setData).setCurrent({tmp_id: "tmp_details_1_row"})
    expect(setData).toHaveBeenCalledTimes(2)
    templateActions(it_store, setData).setCurrent({tmp_id: "tmp_details_0_vgap"})
    expect(setData).toHaveBeenCalledTimes(3)
    templateActions(it_store, setData).setCurrent({tmp_id: "tmp_details_1_row_0_cell"})
    expect(setData).toHaveBeenCalledTimes(4)
  })

  it('createMap', () => {
    const sample = update(sample_template, {})
    const setData = jest.fn()
    let canvas = {
      height: 0, width: 0,
      getContext: () => ({
        fillStyle: "",
        fillRect: jest.fn(),
        beginPath: jest.fn(),
        moveTo: jest.fn(),
        lineTo: jest.fn(),
        stroke: jest.fn(),
      })
    }
    let it_store = update(store, {template: {$merge:{
      current: {
        item: sample.details,
        parent: null,
      }
    }}})
    templateActions(it_store, setData).createMap(canvas)
    it_store = update(it_store, {template: {$merge:{
      current: {
        item: sample.details[1].row.columns[0].cell,
        parent: sample.details[1].row.columns,
      }
    }}})
    templateActions(it_store, setData).createMap(canvas)
    it_store = update(it_store, {template: {$merge:{
      current: {
        item: sample.details[19].datagrid.columns[1].column,
        parent: sample.details[19].datagrid.columns,
      }
    }}})
    templateActions(it_store, setData).createMap(canvas)
    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [],
        footer: [],
        sources: {},
        data: {}
      },
      current: {}
    }}})
    templateActions(it_store, setData).createMap(canvas)
  })

  it('goPrevious', () => {
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "report",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 0,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(3)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 0,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(4)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 1,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(5)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 1,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(6)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 2,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(7)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "details",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(8)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(9)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [
          { row: { columns: [] } }
        ],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: null,
        parent_index: 1,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(10)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [
          { row: { columns: [] } }
        ],
        details: [],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(11)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [
          { row: { columns: [ { cell: {} } ] } }
        ],
        details: [],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goPrevious()
    expect(setData).toHaveBeenCalledTimes(12)
  })

  it('goNext', () => {
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "report",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 0,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(3)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 0,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(4)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "header",
        index: 2,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(5)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "footer",
        index: null,
        parent_index: null,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(6)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [],
        footer: [
          { row: { columns: [] } }
        ],
        sources: {},
        data: {}
      },
      current: {
        section: "footer",
        index: null,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(7)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [],
        footer: [
          { row: { columns: [ { cell: {} } ] } }
        ],
        sources: {},
        data: {}
      },
      current: {
        section: "footer",
        index: 0,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(8)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [
          { row: { columns: [ { cell: {} } ] } }
        ],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: 0,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(9)

    it_store = update(it_store, {template: {$merge:{
      template: {
        meta: {},
        report: {},
        header: [],
        details: [
          { vgap: { } }
        ],
        footer: [],
        sources: {},
        data: {}
      },
      current: {
        section: "details",
        index: null,
        parent_index: 0,
      }
    }}})
    templateActions(it_store, setData).goNext()
    expect(setData).toHaveBeenCalledTimes(10)

  })

  it('moveDown', () => {
    let sample = update(sample_template, {})
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "vgap",
        item: sample.details[0].vgap,
        index: 0,
        parent: sample.details,
        parent_type: "details",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).moveDown()
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "cell",
        item: sample.details[0].row.columns[0].cell,
        index: 0,
        parent: sample.details[0].row.columns,
        parent_type: "row",
        parent_index: 0,
      },
    }}})
    templateActions(it_store, setData).moveDown()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "cell",
        item: sample.details[0].row.columns[1].cell,
        index: 1,
        parent: sample.details[0].row.columns,
        parent_type: "row",
        parent_index: 0,
      },
    }}})
    templateActions(it_store, setData).moveDown()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "header",
        type: "row",
        item: sample.header[0].row,
        index: null,
        parent: sample.header,
        parent_type: "header",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).moveDown()
    expect(setData).toHaveBeenCalledTimes(2)

  })

  it('moveUp', () => {
    let sample = update(sample_template, {})
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "vgap",
        item: sample.details[8].vgap,
        index: 8,
        parent: sample.details,
        parent_type: "details",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).moveUp()
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "cell",
        item: sample.details[5].row.columns[1].cell,
        index: 1,
        parent: sample.details[5].row.columns,
        parent_type: "row",
        parent_index: 5,
      },
    }}})
    templateActions(it_store, setData).moveUp()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "vgap",
        item: sample.details[0].vgap,
        index: 0,
        parent: sample.details,
        parent_type: "details",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).moveUp()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "header",
        type: "row",
        item: sample.header[0].row,
        index: null,
        parent: sample.header,
        parent_type: "header",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).moveUp()
    expect(setData).toHaveBeenCalledTimes(2)

  })

  it('deleteItem', () => {
    let sample = update(sample_template, {})
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "vgap",
        item: sample.details[0].vgap,
        index: 0,
        parent: sample.details,
        parent_type: "details",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).deleteItem()
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "cell",
        item: sample.details[5].row.columns[1].cell,
        index: 1,
        parent: sample.details[5].row.columns,
        parent_type: "row",
        parent_index: 5,
      },
    }}})
    templateActions(it_store, setData).deleteItem()
    expect(setData).toHaveBeenCalledTimes(2)

    it_store = update(store, {template: {$merge:{
      current: {
        section: "header",
        type: "row",
        item: sample.header[0].row,
        index: null,
        parent: sample.header,
        parent_type: "header",
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).deleteItem()
    expect(setData).toHaveBeenCalledTimes(2)

  })

  it('addItem', () => {
    let sample = update(sample_template, {})
    const setData = jest.fn()
    let it_store = update(store, {template: {$merge:{
      current: {
        section: "details",
        type: "details",
        item: sample.details,
        index: null,
        parent: null,
        parent_type: null,
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).addItem("row")
    expect(setData).toHaveBeenCalledTimes(1)

    it_store = update(it_store, {template: {$merge:{
      current: {
        section: "details",
        type: "details",
        item: sample.details,
        index: null,
        parent: null,
        parent_type: null,
        parent_index: null,
      },
    }}})
    templateActions(it_store, setData).addItem("vgap")
    expect(setData).toHaveBeenCalledTimes(2)

    templateActions(it_store, setData).addItem("")
    expect(setData).toHaveBeenCalledTimes(2)

  })

})