import React from 'react';
import {render} from '@testing-library/react'
import update from 'immutability-helper';

import MenuBar from './index';
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
    getSideBar: jest.fn()
  } 
}

describe('<MenuBar />', () => {

  it('renders without crashing', () => {
    let page_store = update(store, {})
    const { container, rerender } = render(<AppProvider value={page_store}><MenuBar /></AppProvider>);
    expect(container.querySelector('.menubar').tagName).toEqual('DIV')
    //should never re-render the component
    rerender(<AppProvider value={page_store}><MenuBar /></AppProvider>)
  });
  
});
