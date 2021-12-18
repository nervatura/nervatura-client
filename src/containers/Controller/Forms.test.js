import { renderHook } from '@testing-library/react-hooks'

import { AppProvider } from 'containers/App/context'
import { useForm } from './Forms'
import { store as app_store  } from 'config/app'

const wrapper = ({ children }) => <AppProvider 
  value={{ data: app_store, setData: jest.fn() }}>{children}</AppProvider>

describe('Forms', () => {
  it('address', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let address = result.current.address()
    expect(address.options.icon).toBe("Home")
    address = result.current.address({ id: null })
    expect(address.options.panel["new"]).toBeDefined()
    address = result.current.address({ id: 1 })
    expect(address.options.panel["new"]).toBeUndefined()
  })

  it('bank', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let bank = result.current.bank()
    expect(bank.options.icon).toBe("Money")
    bank = result.current.bank({ id: null })
    expect(bank.options.panel["new"]).toBeDefined()
    bank = result.current.bank({ id: 1 }, { dataset: { translink: [] } })
    expect(bank.options.panel["new"]).toBeUndefined()
    bank = result.current.bank({ id: 1 }, { dataset: { translink: [{ transtype: "transtype" }] } })
    expect(bank.rows[0].columns[0].name).toBe("id")
  })

  it('barcode', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let barcode = result.current.barcode()
    expect(barcode.options.icon).toBe("Barcode")
    barcode = result.current.barcode({ id: null })
    expect(barcode.options.panel["new"]).toBeDefined()
    barcode = result.current.barcode({ id: 1 })
    expect(barcode.options.panel["new"]).toBeUndefined()
  })

  it('cash', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let cash = result.current.cash()
    expect(cash.options.icon).toBe("Money")
    cash = result.current.cash(
      { id: null, direction: 1 }, 
      { dataset: { translink: [], groups: [ { id: 1, groupvalue: "in" } ] } }
    )
    expect(cash.options.panel["new"]).toBeDefined()
    cash = result.current.cash(
      { id: 1, direction: 1 }, 
      { dataset: { translink: [], cancel_link: [], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(cash.options.panel["new"]).toBeUndefined()
    cash = result.current.cash(
      { id: 1, direction: 1 }, 
      { dataset: { translink: [{ transtype: "transtype" }], cancel_link: [], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(cash.rows[3].columns[0].map["source"]).toBe("translink")
    cash = result.current.cash(
      { id: 1, direction: 1 }, 
      { dataset: { translink: [], cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(cash.rows[3].columns[0].map["source"]).toBe("cancel_link")
  })

  it('contact', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let contact = result.current.contact()
    expect(contact.options.icon).toBe("Phone")
    contact = result.current.contact({ id: null })
    expect(contact.options.panel["new"]).toBeDefined()
    contact = result.current.contact({ id: 1 })
    expect(contact.options.panel["new"]).toBeUndefined()
  })

  it('currency', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let currency = result.current.currency()
    expect(currency.options.icon).toBe("Dollar")
    currency = result.current.currency({ id: null })
    expect(currency.options.panel["new"]).toBeDefined()
    currency = result.current.currency({ id: 1 })
    expect(currency.options.panel["new"]).toBeUndefined()
  })

  it('customer', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let customer = result.current.customer()
    expect(customer.options.icon).toBe("User")
    customer = result.current.customer(
      { id: null, custtype: 1 },
      { dataset: { custtype: {}, groups: [ { id: 1, groupname: "custtype", groupvalue: "own" } ] } }
    )
    expect(customer.options.panel["new"]).toBeDefined()
    customer = result.current.customer(
      { id: 1, custtype: 2 },
      { dataset: { custtype: {}, groups: [ { id: 1, groupname: "custtype", groupvalue: "own" } ] } }
    )
    expect(customer.options.panel["new"]).toBeUndefined()
    customer = result.current.customer(
      { id: 1, custtype: 2 },
      { dataset: { groups: [ { id: 1, groupname: "custtype", groupvalue: "own" } ] } }
    )
    expect(customer.options.panel["new"]).toBeUndefined()
  })

  it('deffield', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let deffield = result.current.deffield()
    expect(deffield.options.icon).toBe("Tag")
    deffield = result.current.deffield({ id: null })
    expect(deffield.options.panel["new"]).toBeDefined()
    deffield = result.current.deffield(
      { id: 1, fieldtype: 1 },
      { dataset: { fieldtype: [ { id: 1, groupvalue: "valuelist" } ] } }
    )
    expect(deffield.options.panel["new"]).toBeUndefined()
    deffield = result.current.deffield(
      { id: 1, fieldtype: 1 },
      { dataset: { fieldtype: [ { id: 2, groupvalue: "valuelist" } ] } }
    )
    expect(deffield.options.panel["new"]).toBeUndefined()
  })

  it('delivery', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let delivery = result.current.delivery()
    expect(delivery.options.icon).toBe("Truck")
    delivery = result.current.delivery(
      { id: null, direction: 1 },
      { dataset: { translink: [], groups: [ { id: 1, groupvalue: "transfer" } ] } }
    )
    expect(delivery.options.panel["new"]).toBeDefined()
    delivery = result.current.delivery(
      { id: 1, direction: 1 },
      { dataset: { translink: [], groups: [ { id: 1, groupvalue: "transfer" } ] } }
    )
    expect(delivery.rows[0].columns[1].name).toBe("ref_transnumber")
    delivery = result.current.delivery(
      { id: 1, direction: 1 },
      { dataset: { translink: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "transfer" } ] } }
    )
    expect(delivery.rows[0].columns[1].name).toBe("id")
    delivery = result.current.delivery(
      { id: 1, direction: 1 },
      { dataset: { cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "transfer" } ] } }
    )
    expect(delivery.rows[0].columns[1].name).toBe("id")
    delivery = result.current.delivery(
      { id: 1, direction: 1 },
      { dataset: { cancel_link: [{ transtype: "in" }], groups: [ { id: 1, groupvalue: "transfer" } ] } }
    )
    delivery = result.current.delivery(
      { id: null, direction: 1 },
      { dataset: { translink: [], groups: [ { id: 1, groupvalue: "in" } ] } }
    )
    expect(delivery.options.panel["new"]).toBeDefined()
  })

  it('discount', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let discount = result.current.discount()
    expect(discount.options.icon).toBe("Dollar")
    discount = result.current.discount({ id: null })
    expect(discount.options.panel["new"]).toBeDefined()
    discount = result.current.discount({ id: 1 })
    expect(discount.options.panel["new"]).toBeUndefined()
  })

  it('employee', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let employee = result.current.employee()
    expect(employee.options.icon).toBe("Male")
    employee = result.current.employee({ id: null })
    expect(employee.options.panel["new"]).toBeDefined()
    employee = result.current.employee({ id: 1 })
    expect(employee.options.panel["new"]).toBeUndefined()
  })

  it('event', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let event = result.current.event()
    expect(event.options.icon).toBe("Calendar")
    event = result.current.event({ id: null })
    expect(event.options.panel["new"]).toBeDefined()
    event = result.current.event({ id: 1 })
    expect(event.options.panel["new"]).toBeUndefined()
  })

  it('formula', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let formula = result.current.formula()
    expect(formula.options.icon).toBe("Magic")
    formula = result.current.formula({ id: null })
    expect(formula.options.panel["new"]).toBeDefined()
    formula = result.current.formula(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(formula.options.panel["new"]).toBeUndefined()
    formula = result.current.formula(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(formula.rows[2].columns[0].name).toBe("id")
  })

  it('groups', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let groups = result.current.groups()
    expect(groups.options.icon).toBe("Th")
    groups = result.current.groups({ id: null })
    expect(groups.options.panel["new"]).toBeDefined()
    groups = result.current.groups({ id: 1 })
    expect(groups.options.panel["new"]).toBeUndefined()
  })

  it('inventory', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let inventory = result.current.inventory()
    expect(inventory.options.icon).toBe("Truck")
    inventory = result.current.inventory({ id: null })
    expect(inventory.options.panel["new"]).toBeDefined()
    inventory = result.current.inventory({ id: 1 })
    expect(inventory.options.panel["new"]).toBeUndefined()
  })

  it('invoice_link', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let invoice_link = result.current.invoice_link()
    expect(invoice_link.options.icon).toBe("Money")
    invoice_link = result.current.invoice_link({ id: null })
    expect(invoice_link.options.panel["new"]).toBeDefined()
    invoice_link = result.current.invoice_link({ id: 1 })
    expect(invoice_link.options.panel["new"]).toBeUndefined()
  })

  it('invoice', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let invoice = result.current.invoice()
    expect(invoice.options.icon).toBe("FileText")
    invoice = result.current.invoice({ id: null })
    expect(invoice.options.panel["new"]).toBeDefined()
    invoice = result.current.invoice(
      { id: 1, direction: 1, transcast: "normal" },
      { dataset: { translink: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "in" } ] } }
    )
    expect(invoice.options.panel["new"]).toBeUndefined()
    invoice = result.current.invoice(
      { id: 1, direction: 1, transcast: "normal", deleted: 0 },
      { dataset: { translink: [], cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(invoice.options.panel["corrective"]).toBeDefined()
    invoice = result.current.invoice(
      { id: 1, direction: 1, transcast: "normal", deleted: 1 },
      { dataset: { translink: [], cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(invoice.options.panel["cancellation"]).toBeDefined()
    invoice = result.current.invoice(
      { id: 1, direction: 1, transcast: "normal", deleted: 1 },
      { dataset: { translink: [], cancel_link: [], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(invoice.options.panel["cancellation"]).toBeDefined()
  })

  it('item', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let item = result.current.item()
    expect(item.options.icon).toBe("ListOl")
    item = result.current.item(
      { id: null },
      { current: { transtype: "invoice" } }
    )
    expect(item.options.panel["new"]).toBeDefined()
    item = result.current.item(
      { id: 1 },
      { current: { transtype: "offer" } }
    )
    expect(item.options.panel["new"]).toBeUndefined()
    item = result.current.item(
      { id: 1 },
      { current: { transtype: "order" } }
    )
    expect(item.options.panel["new"]).toBeUndefined()
  })

  it('log', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let log = result.current.log()
    expect(log.options.icon).toBe("InfoCircle")
  })

  it('movement', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let movement = result.current.movement(
      undefined,
      { current: { transtype: "default" } }
    )
    expect(movement.options.icon).toBe("Truck")
    movement = result.current.movement(
      { id: null },
      { current: { transtype: "delivery" } }
    )
    expect(movement.options.panel["new"]).toBeDefined()
    movement = result.current.movement(
      { id: 1 },
      { current: { transtype: "inventory" } }
    )
    expect(movement.options.panel["new"]).toBeUndefined()
    movement = result.current.movement(
      { id: 1 },
      { current: { transtype: "production" } }
    )
    expect(movement.options.panel["new"]).toBeUndefined()
    movement = result.current.movement(
      { id: 1 },
      { current: { transtype: "formula" } }
    )
    expect(movement.options.panel["new"]).toBeUndefined()
    movement = result.current.movement(
      { id: 1 },
      { current: { transtype: "waybill" } }
    )
    expect(movement.options.panel["new"]).toBeUndefined()
  })

  it('numberdef', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let numberdef = result.current.numberdef()
    expect(numberdef.options.icon).toBe("ListOl")
  })

  it('offer', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let offer = result.current.offer()
    expect(offer.options.icon).toBe("FileText")
    offer = result.current.offer({ id: null })
    expect(offer.options.panel["new"]).toBeDefined()
    offer = result.current.offer(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(offer.options.panel["new"]).toBeUndefined()
    offer = result.current.offer(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(offer.options.panel["new"]).toBeUndefined()
  })

  it('order', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let order = result.current.order()
    expect(order.options.icon).toBe("FileText")
    order = result.current.order({ id: null })
    expect(order.options.panel["new"]).toBeDefined()
    order = result.current.order(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(order.options.panel["new"]).toBeUndefined()
    order = result.current.order(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(order.options.panel["new"]).toBeUndefined()
  })

  it('password', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let password = result.current.password()
    expect(password.options.icon).toBe("Lock")
  })

  it('payment_link', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let payment_link = result.current.payment_link()
    expect(payment_link.options.icon).toBe("FileText")
    payment_link = result.current.payment_link({ id: null })
    expect(payment_link.options.panel["new"]).toBeDefined()
    payment_link = result.current.payment_link({ id: 1 })
    expect(payment_link.options.panel["new"]).toBe(false)
  })

  it('payment', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let payment = result.current.payment()
    expect(payment.options.icon).toBe("Money")
    payment = result.current.payment({ id: null })
    expect(payment.options.panel["new"]).toBeDefined()
    payment = result.current.payment({ id: 1 })
    expect(payment.options.panel["new"]).toBeUndefined()
  })

  it('place', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let place = result.current.place()
    expect(place.options.icon).toBe("Map")
    place = result.current.place({ id: null })
    expect(place.options.panel["new"]).toBeDefined()
    place = result.current.place(
      { id: 1, placetype: 2 },
      { dataset: { placetype: [ { id: 1, groupvalue: "warehouse" } ] } }
    )
    expect(place.options.panel["new"]).toBeUndefined()
    place = result.current.place(
      { id: 1, placetype: 1 },
      { dataset: { groups: [ { id: 1, groupname: "placetype", groupvalue: "warehouse" } ] } }
    )
    expect(place.options.panel["new"]).toBeUndefined()
  })

  it('price', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let price = result.current.price()
    expect(price.options.icon).toBe("Dollar")
    price = result.current.price({ id: null })
    expect(price.options.panel["new"]).toBeDefined()
    price = result.current.price({ id: 1 })
    expect(price.options.panel["new"]).toBeUndefined()
  })

  it('printqueue', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let printqueue = result.current.printqueue(
      undefined, undefined,
      { printqueue_type: "printqueue_type", printqueue_mode: "printqueue_mode",
        report_orientation: "report_orientation", page_orient: "page_orient",
        report_size: "report_size", page_size: "page_size"
      }
    )
    expect(printqueue.options.icon).toBe("Filter")
  })

  it('product', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let product = result.current.product()
    expect(product.options.icon).toBe("ShoppingCart")
    product = result.current.product({ id: null })
    expect(product.options.panel["new"]).toBeDefined()
    product = result.current.product({ id: 1 })
    expect(product.options.panel["new"]).toBeUndefined()
  })

  it('production', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let production = result.current.production()
    expect(production.options.icon).toBe("Flask")
    production = result.current.production({ id: null })
    expect(production.options.panel["new"]).toBeDefined()
    production = result.current.production(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(production.options.panel["new"]).toBeUndefined()
    production = result.current.production(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(production.options.panel["new"]).toBeUndefined()
  })

  it('project', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let project = result.current.project()
    expect(project.options.icon).toBe("Clock")
    project = result.current.project({ id: null })
    expect(project.options.panel["new"]).toBeDefined()
    project = result.current.project({ id: 1 })
    expect(project.options.panel["new"]).toBeUndefined()
  })

  it('rate', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let rate = result.current.rate()
    expect(rate.options.icon).toBe("Strikethrough")
    rate = result.current.rate(
      { id: null },
      { dataset: { ratetype: [ { id: 1, groupvalue: "rate" } ], settings: [ { id: 1, fieldname: "default_currency", value: "EUR" } ] } }
    )
    expect(rate.options.panel["new"]).toBeDefined()
    rate = result.current.rate(
      { id: null },
      { dataset: { ratetype: [ { id: 1, groupvalue: "rate" } ], settings: [] } }
    )
    expect(rate.options.panel["new"]).toBeDefined()
    rate = result.current.rate({ id: 1 })
    expect(rate.options.panel["new"]).toBeUndefined()
  })

  it('program', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let program = result.current.program()
    expect(program.options.icon).toBe("Keyboard")
  })

  it('receipt', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let receipt = result.current.receipt()
    expect(receipt.options.icon).toBe("FileText")
    receipt = result.current.receipt({ id: null })
    expect(receipt.options.panel["new"]).toBeDefined()
    receipt = result.current.receipt(
      { id: 1, direction: 1, transcast: "normal" },
      { dataset: { translink: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "in" } ] } }
    )
    expect(receipt.options.panel["new"]).toBeUndefined()
    receipt = result.current.receipt(
      { id: 1, direction: 1, transcast: "normal", deleted: 0 },
      { dataset: { translink: [], cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(receipt.options.panel["corrective"]).toBeDefined()
    receipt = result.current.receipt(
      { id: 1, direction: 1, transcast: "normal", deleted: 1 },
      { dataset: { translink: [], cancel_link: [{ transtype: "transtype" }], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(receipt.options.panel["cancellation"]).toBeDefined()
    receipt = result.current.receipt(
      { id: 1, direction: 1, transcast: "normal", deleted: 1 },
      { dataset: { translink: [], cancel_link: [], groups: [ { id: 1, groupvalue: "out" } ] } }
    )
    expect(receipt.options.panel["cancellation"]).toBeDefined()
  })

  it('rent', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let rent = result.current.rent()
    expect(rent.options.icon).toBe("FileText")
    rent = result.current.rent({ id: null })
    expect(rent.options.panel["new"]).toBeDefined()
    rent = result.current.rent(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(rent.options.panel["new"]).toBeUndefined()
    rent = result.current.rent(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(rent.options.panel["new"]).toBeUndefined()
  })

  it('report', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let report = result.current.report(
      undefined, undefined,
      { report_orientation: "report_orientation", page_orient: "page_orient",
        report_size: "report_size", page_size: "page_size" }
    )
    expect(report.options.panel["print"]).toBeDefined()
    report = result.current.report(
      { id: 1, ftype: "csv" }, undefined,
      { report_orientation: "report_orientation", page_orient: "page_orient",
        report_size: "report_size", page_size: "page_size" }
    )
    expect(report.options.panel["print"]).toBeDefined()
    report = result.current.report(
      { id: 1, ftype: "pdf" }, undefined,
      { report_orientation: "report_orientation", page_orient: "page_orient",
        report_size: "report_size", page_size: "page_size" }
    )
    expect(report.options.panel["print"]).toBeDefined()
  })

  it('setting', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let setting = result.current.setting()
    expect(setting.options.icon).toBe("Cog")
  })

  it('shipping', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let shipping = result.current.shipping()
    expect(shipping.options.icon).toBe("Truck")
  })

  it('tax', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let tax = result.current.tax()
    expect(tax.options.icon).toBe("Ticket")
    tax = result.current.tax({ id: null })
    expect(tax.options.panel["new"]).toBeDefined()
    tax = result.current.tax({ id: 1 })
    expect(tax.options.panel["new"]).toBeUndefined()
  })

  it('template', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let template = result.current.template()
    expect(template.options.icon).toBe("TextHeight")
  })

  it('tool', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let tool = result.current.tool()
    expect(tool.options.icon).toBe("Wrench")
    tool = result.current.tool({ id: null })
    expect(tool.options.panel["new"]).toBeDefined()
    tool = result.current.tool({ id: 1 })
    expect(tool.options.panel["new"]).toBeUndefined()
  })

  it('ui_menu', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let ui_menu = result.current.ui_menu()
    expect(ui_menu.options.icon).toBe("Share")
    ui_menu = result.current.ui_menu({ id: null })
    expect(ui_menu.rows[0].columns[0]["disabled"]).toBeUndefined()
    ui_menu = result.current.ui_menu({ id: 1 })
    expect(ui_menu.rows[0].columns[0]["disabled"]).toBeDefined()
  })

  it('usergroup', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let usergroup = result.current.usergroup()
    expect(usergroup.options.icon).toBe("Key")
    usergroup = result.current.usergroup({ id: null })
    expect(usergroup.options.panel["new"]).toBeDefined()
    usergroup = result.current.usergroup({ id: 1 })
    expect(usergroup.options.panel["new"]).toBeUndefined()
  })

  it('waybill', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let waybill = result.current.waybill()
    expect(waybill.options.icon).toBe("Briefcase")
    waybill = result.current.waybill({ id: null })
    expect(waybill.options.panel["new"]).toBeDefined()
    waybill = result.current.waybill(
      { id: 1, customer_id: null, employee_id: null },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(waybill.options.panel["new"]).toBeUndefined()
    waybill = result.current.waybill(
      { id: 1, customer_id: null, employee_id: null },
      { dataset: { translink: [] } }
    )
    expect(waybill.options.panel["new"]).toBeUndefined()
    waybill = result.current.waybill(
      { id: 1, customer_id: 1 },
    )
    expect(waybill.rows[1].columns[1]["map"]["seltype"]).toBe("customer")
    waybill = result.current.waybill(
      { id: 1, customer_id: null, employee_id: 1 },
    )
    expect(waybill.rows[1].columns[1]["map"]["seltype"]).toBe("employee")
  })

  it('worksheet', () => {
    const { result } = renderHook(() => useForm(), { wrapper })
    
    let worksheet = result.current.worksheet()
    expect(worksheet.options.icon).toBe("FileText")
    worksheet = result.current.worksheet({ id: null })
    expect(worksheet.options.panel["new"]).toBeDefined()
    worksheet = result.current.worksheet(
      { id: 1 },
      { dataset: { translink: [{ transtype: "transtype" }] } }
    )
    expect(worksheet.options.panel["new"]).toBeUndefined()
    worksheet = result.current.worksheet(
      { id: 1 },
      { dataset: { translink: [] } }
    )
    expect(worksheet.options.panel["new"]).toBeUndefined()
  })

})