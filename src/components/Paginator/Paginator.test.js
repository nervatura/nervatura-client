import React from 'react';
import {create} from 'react-test-renderer';

import Paginator from './index';

describe('Paginator', () => {

  it('Paginator', () => {

    const testRenderer = create(<Paginator pagination={10} pages={1} onSelect={()=>{}} 
       theme={{ primaryColorGrad: "#fff", colorWhite: "#fff", primaryColor: "#000"}} />);
    expect(testRenderer.root.findByProps({pagination: 10})).toBeDefined()
  });

});