import React from 'react';
import {create} from 'react-test-renderer';

import Paginator from './index';

describe('Paginator', () => {

  it('Paginator', () => {

    const testRenderer = create(<Paginator pagination={10} pages={1} onSelect={()=>{}} />);
    expect(testRenderer.root.findByProps({pagination: 10})).toBeDefined()
  });

});