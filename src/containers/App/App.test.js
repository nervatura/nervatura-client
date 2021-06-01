import React from 'react';
import ReactDOM from 'react-dom';
//import update from 'immutability-helper';

//import { render } from '@testing-library/react';
import { create } from 'react-test-renderer';

import App from './index';
//import { store as app_store } from 'config/app'

let fetchData = (url) => {
  return { data: {}, error: null }
}

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation(
    (path, options) => {
      if(options && options.error){
        return Promise.reject({ 
          status: 400,
          message: "Error"
        })
      }
      return Promise.resolve({
        status: 200,
        json: () => Promise.resolve(fetchData(path))
      })
    }
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('<App />', () => {
  
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<App />, div);
  });

  it('showToast', () => {
    const testRenderer = create(<App />);
    const app = testRenderer.getInstance()
    app.showToast({ message: "Hello"})
    app.showToast({ type: "info", message: "Hello", autoClose: false })
    app.showToast({ type: "success", message: "Hello"})
    app.showToast({ type: "warning", message: "Hello"})
    app.showToast({ type: "error", message: "Hello"})
    app.showToast({ type: "message", message: "<div>Hello</div>", title: "Title"})
    app.showToast({ type: "message", message: "<div>Hello</div>", title: "Title"})
  });
  
});