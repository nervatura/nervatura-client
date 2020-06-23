import React from 'react';
import {create} from 'react-test-renderer';

import Spinner from './index';

describe('Controls', () => {

  it('Spinner with Loading', () => {

    const testRenderer = create(<Spinner theme={{primaryColor: "white"}} />);
    expect(testRenderer.root.findAllByType("svg").length).toBe(0)
  });
});