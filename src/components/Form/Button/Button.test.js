import { render, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, PrimaryIconLabel, IconBorderButton, Disabled, SmallButton } from './Button.stories';

it('renders the card in the Default state', () => {
  const onClick = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_button" onClick={onClick} />
  );
  expect(container.querySelector('#test_button')).toBeDefined();

  const test_button = container.querySelector('#test_button')

  fireEvent.click(test_button)
  expect(onClick).toHaveBeenCalledTimes(1);

});

it('renders the card in the PrimaryIconLabel state', () => {

  const { container } = render(
    <PrimaryIconLabel {...PrimaryIconLabel.args} id="test_button" />
  );
  expect(container.querySelector('#test_button')).toBeDefined();

});

it('renders the card in the IconBorderButton state', () => {

  const { container } = render(
    <IconBorderButton {...IconBorderButton.args} id="test_button" />
  );
  expect(container.querySelector('#test_button')).toBeDefined();

});

it('renders the card in the Disabled state', () => {

  const { container } = render(
    <IconBorderButton {...Disabled.args} id="test_button" />
  );
  expect(container.querySelector('#test_button')).toBeDefined();

});

it('renders the card in the SmallButton state', () => {

  const { container } = render(
    <SmallButton {...SmallButton.args} id="test_button" />
  );
  expect(container.querySelector('#test_button')).toBeDefined();

});