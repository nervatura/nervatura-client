import { render } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, LeftIcon, RightIcon, Centered } from './Label.stories';

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="test_label" />
  );
  expect(container.querySelector('#test_label')).toBeDefined();

});

it('renders the card in the LeftIcon state', () => {

  const { container } = render(
    <LeftIcon {...LeftIcon.args} id="test_label" />
  );
  expect(container.querySelector('#test_label')).toBeDefined();

});

it('renders the card in the RightIcon state', () => {

  const { container } = render(
    <RightIcon {...RightIcon.args} id="test_label" />
  );
  expect(container.querySelector('#test_label')).toBeDefined();

});

it('renders the card in the Centered state', () => {

  const { container } = render(
    <Centered {...Centered.args} id="test_label" />
  );
  expect(container.querySelector('#test_label')).toBeDefined();

});