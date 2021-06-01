import React from 'react';
import {render} from '@testing-library/react'
import update from 'immutability-helper';

import Login from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'

let store = { 
  data: update(app_store, {$merge: {
    login: {
    }
  }}),
  actions: {
    getText: (key)=>{ return key },
    setData: jest.fn(),
    getSideBar: jest.fn()
  } 
}

describe('<Login />', () => {

  it('renders without crashing', () => {
    let page_store = update(store, {})
    const { getByText, rerender } = render(<AppProvider value={page_store}><Login /></AppProvider>);
    expect(getByText('title_login').tagName).toEqual('SPAN')
    //should never re-render the component
    rerender(<AppProvider value={page_store}><Login /></AppProvider>)
  });
  
});
