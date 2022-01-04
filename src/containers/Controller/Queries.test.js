import { Queries } from './Queries'
import { getText, store } from 'config/app';

const query = Queries({ getText: (key)=>getText({ locales: store.session.locales, lang: "en", key: key }) })

describe('Queries', () => {
  it('quick', () => {
    expect(query.quick.customer().sql).toBeDefined()
    expect(query.quick.employee().sql).toBeDefined()
    expect(query.quick.payment().sql).toBeDefined()
    expect(query.quick.place().sql).toBeDefined()
    expect(query.quick.place_bank().sql).toBeDefined()
    expect(query.quick.place_cash().sql).toBeDefined()
    expect(query.quick.place_warehouse().sql).toBeDefined()
    expect(query.quick.product().sql).toBeDefined()
    expect(query.quick.product_item().sql).toBeDefined()
    expect(query.quick.project().sql).toBeDefined()
    expect(query.quick.report(1).sql).toBeDefined()
    expect(query.quick.servercmd(1).sql).toBeDefined()
    expect(query.quick.tool().sql).toBeDefined()
    expect(query.quick.transitem().sql).toBeDefined()
    expect(query.quick.transitem_invoice().sql).toBeDefined()
    expect(query.quick.transitem_delivery().sql).toBeDefined()
    expect(query.quick.transmovement().sql).toBeDefined()
    expect(query.quick.transpayment().sql).toBeDefined()
    
  })

  it('browser', () => {
    expect(query.customer().options).toBeDefined()
    expect(query.employee().options).toBeDefined()
    expect(query.product().options).toBeDefined()
    expect(query.project().options).toBeDefined()
    expect(query.rate().options).toBeDefined()
    expect(query.tool().options).toBeDefined()
    expect(query.transitem().options).toBeDefined()
    expect(query.transmovement().options).toBeDefined()
    expect(query.transpayment().options).toBeDefined()
  })

})