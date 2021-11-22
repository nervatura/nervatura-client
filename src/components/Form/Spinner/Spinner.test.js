import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default } from './Spinner.stories';

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} />
  );
  expect(container.querySelector('#app_loading')).toBeDefined();

});