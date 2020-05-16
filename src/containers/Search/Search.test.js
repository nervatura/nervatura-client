import React from 'react';
import {render} from '@testing-library/react'
import update from 'immutability-helper';

import Search from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'

let store = { 
  data: update(app_store, {$merge: {
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
  }}),
  actions: {
    getText: (key)=>{ return key },
    setData: jest.fn(),
    showToast: jest.fn(),
    requestData: jest.fn((path, options) => {
      return Promise.resolve({ data: {}, error: null })
    })
  } 
}

describe('<Search />', () => {

  it('renders without crashing', () => {
    let page_store = update(store, {})
    const { getByText, rerender } = render(<AppProvider value={page_store}><Search /></AppProvider>);
    expect(getByText('quick_search: search_transitem').tagName).toEqual('SPAN')
    //should never re-render the component
    rerender(<AppProvider value={page_store}><Search /></AppProvider>)
  });
  
});
