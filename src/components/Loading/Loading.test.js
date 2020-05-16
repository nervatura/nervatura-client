import React from 'react';
import {render} from '@testing-library/react'

import Loading from './index';

describe('<Loading />', () => {
  it('should render 13 divs', () => {

    const { container } = render(<Loading />);
    expect(container).toBeDefined()
  });
});
