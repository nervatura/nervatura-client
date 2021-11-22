import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, ColorPointer } from './Icon.stories';

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="default" />
  );
  expect(container.querySelector('#default')).toBeDefined();

});

it('renders the card in the ColorPointer state', () => {

  const { container } = render(
    <ColorPointer {...ColorPointer.args} id="color" />
  );
  expect(container.querySelector('#color')).toBeDefined();

});