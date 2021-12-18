import { renderHook } from '@testing-library/react-hooks'

import { AppProvider } from 'containers/App/context'
import { useQueries } from './Queries'
import { store as app_store  } from 'config/app'

const wrapper = ({ children }) => <AppProvider 
  value={{ data: app_store, setData: jest.fn() }}>{children}</AppProvider>

describe('Queries', () => {
  it('quick', () => {
    const { result } = renderHook(() => useQueries(), { wrapper })
    const quick = result.current.quick

    expect(quick.customer().sql).toBeDefined()
    expect(quick.employee().sql).toBeDefined()
    expect(quick.payment().sql).toBeDefined()
    expect(quick.place().sql).toBeDefined()
    expect(quick.place_bank().sql).toBeDefined()
    expect(quick.place_cash().sql).toBeDefined()
    expect(quick.place_warehouse().sql).toBeDefined()
    expect(quick.product().sql).toBeDefined()
    expect(quick.product_item().sql).toBeDefined()
    expect(quick.project().sql).toBeDefined()
    expect(quick.report(1).sql).toBeDefined()
    expect(quick.servercmd(1).sql).toBeDefined()
    expect(quick.tool().sql).toBeDefined()
    expect(quick.transitem().sql).toBeDefined()
    expect(quick.transitem_invoice().sql).toBeDefined()
    expect(quick.transitem_delivery().sql).toBeDefined()
    expect(quick.transmovement().sql).toBeDefined()
    expect(quick.transpayment().sql).toBeDefined()
    
  })

  it('browser', () => {
    const { result } = renderHook(() => useQueries(), { wrapper })
    const current = result.current

    expect(current.customer().options).toBeDefined()
    expect(current.employee().options).toBeDefined()
    expect(current.product().options).toBeDefined()
    expect(current.project().options).toBeDefined()
    expect(current.rate().options).toBeDefined()
    expect(current.tool().options).toBeDefined()
    expect(current.transitem().options).toBeDefined()
    expect(current.transmovement().options).toBeDefined()
    expect(current.transpayment().options).toBeDefined()
  })

})