import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, InputValue, DefaultCancel } from './InputBox.stories';

it('renders the card in the Default state', () => {
  const onOK = jest.fn()
  const onCancel = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_input"
      onOK={onOK} onCancel={onCancel} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const btn_ok = container.querySelector('#btn_ok')
  fireEvent.click(btn_ok)
  expect(onOK).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onCancel).toHaveBeenCalledTimes(1);

})

it('renders the card in the InputValue state', () => {
  const onOK = jest.fn()

  const { container } = render(
    <InputValue {...InputValue.args} id="test_input" onOK={onOK} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const input_value = container.querySelector('#input_value')
  fireEvent.change(input_value, {target: {value: "value"}})
  expect(input_value.value).toEqual("value");

  fireEvent.keyDown(input_value, { key: 'Enter', code: 'Enter', keyCode: 13 })
  expect(onOK).toHaveBeenCalledTimes(1)

})

it('renders the card in the DefaultCancel state', () => {
  const { container } = render(
    <DefaultCancel {...DefaultCancel.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

})