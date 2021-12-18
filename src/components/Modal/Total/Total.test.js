import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, DarkTotal } from './Total.stories';

it('renders the card in the Default state', () => {
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_settings" onClose={onClose} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_ok = container.querySelector('#btn_ok')
  fireEvent.click(btn_ok)
  expect(onClose).toHaveBeenCalledTimes(2);

})

it('renders the card in the DarkTotal state', () => {
  const { container } = render(
    <DarkTotal {...DarkTotal.args} id="test_settings" />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();
})