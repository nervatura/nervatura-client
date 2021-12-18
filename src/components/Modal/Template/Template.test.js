import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Disabled } from './Template.stories';

it('renders the card in the Default state', () => {
  const onData = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_settings"
    onData={onData} onClose={onClose} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onClose).toHaveBeenCalledTimes(2);

  const name = container.querySelector('#name')
  fireEvent.change(name, {target: {value: "name"}})
  expect(name.value).toEqual("name");

  const columns = container.querySelector('#columns')
  fireEvent.change(columns, {target: {value: "col3,col4,col5"}})
  expect(columns.value).toEqual("col3,col4,col5");

  const type = container.querySelector('#type')
  fireEvent.change(type, {target: {value: "list"}})
  expect(type.value).toEqual("list");

  const btn_ok = container.querySelector('#btn_ok')
  fireEvent.click(btn_ok)
  expect(onData).toHaveBeenCalledTimes(1);

})

it('renders the card in the Disabled state', () => {
  const { container } = render(
    <Disabled {...Disabled.args} id="test_settings" />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();
})