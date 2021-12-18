import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Order, Worksheet } from './Trans.stories';

it('renders the card in the Default state', () => {
  const onCreate = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_settings"
      onCreate={onCreate} onClose={onClose} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onClose).toHaveBeenCalledTimes(2);

  const btn_create = container.querySelector('#btn_create')
  fireEvent.click(btn_create)
  expect(onCreate).toHaveBeenCalledTimes(1);

  const transtype = container.querySelector('#transtype')
  fireEvent.change(transtype, {target: {value: "worksheet"}})
  expect(transtype.value).toEqual("worksheet");

  const direction = container.querySelector('#direction')
  fireEvent.change(direction, {target: {value: "in"}})
  expect(direction.value).toEqual("in");

})

it('renders the card in the Order state', () => {
  const onCreate = jest.fn()

  const { container } = render(
    <Order {...Order.args} id="test_settings"
    onCreate={onCreate} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const transtype = container.querySelector('#transtype')
  fireEvent.change(transtype, {target: {value: "receipt"}})
  expect(transtype.value).toEqual("receipt");

  const refno = container.querySelector('#refno')
  fireEvent.click(refno)

  const netto = container.querySelector('#netto')
  fireEvent.click(netto)

  const from = container.querySelector('#from')
  fireEvent.click(from)

  const btn_create = container.querySelector('#btn_create')
  fireEvent.click(btn_create)
  expect(onCreate).toHaveBeenCalledTimes(1);

})

it('renders the card in the Worksheet state', () => {
  const onCreate = jest.fn()

  const { container } = render(
    <Worksheet {...Worksheet.args} id="test_settings"
    onCreate={onCreate} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const transtype = container.querySelector('#transtype')
  fireEvent.change(transtype, {target: {value: "receipt"}})
  expect(transtype.value).toEqual("receipt");

  const btn_create = container.querySelector('#btn_create')
  fireEvent.click(btn_create)
  expect(onCreate).toHaveBeenCalledTimes(1);

})