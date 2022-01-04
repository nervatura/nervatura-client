import { render, queryByAttribute } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, Max } from './Paginator.stories';
import { paginate } from './Paginator';

const getById = queryByAttribute.bind(null, 'id');

it('renders in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="test_paginator" />
  );
  expect(getById(container, 'test_paginator')).toBeDefined();

});

it('renders in the Max state', () => {

  const { container } = render(
    <Max {...Max.args} id="test_paginator" />
  );
  expect(getById(container, 'test_paginator')).toBeDefined();
  
  let prows = paginate({page: 1, perPage: 5})([{id:1},{id:2}])
  expect(prows).toBeDefined();

  prows = paginate({page: 10, perPage: 5})([{id:1},{id:2}])
  expect(prows).toBeDefined();
});