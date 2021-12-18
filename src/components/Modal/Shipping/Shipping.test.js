import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, DarkShipping } from './Shipping.stories';

it('renders the card in the Default state', () => {
  const onShipping = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_shipping"
    onShipping={onShipping} onClose={onClose} />
  );
  expect(container.querySelector('#test_shipping')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onClose).toHaveBeenCalledTimes(2);

  const btn_ok = container.querySelector('#btn_ok')
  fireEvent.click(btn_ok)
  expect(onShipping).toHaveBeenCalledTimes(1);

  const batch_no = container.querySelector('#batch_no')
  fireEvent.change(batch_no, {target: {value: "abc123"}})
  expect(batch_no.value).toEqual("abc123");

  const qty = container.querySelector('#qty')
  fireEvent.change(qty, {target: {value: "12"}})
  expect(qty.value).toEqual("12");

})

it('renders the card in the DarkShipping state', () => {
  const { container } = render(
    <DarkShipping {...DarkShipping.args} id="test_shipping" />
  );
  expect(container.querySelector('#test_shipping')).toBeDefined();
})