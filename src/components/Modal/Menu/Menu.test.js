import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Disabled } from './Menu.stories';

it('renders the card in the Default state', () => {
  const onMenu = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_settings"
    onMenu={onMenu} onClose={onClose} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onClose).toHaveBeenCalledTimes(2);

  const btn_ok = container.querySelector('#btn_ok')
  fireEvent.click(btn_ok)
  expect(onMenu).toHaveBeenCalledTimes(1);

  const fieldname = container.querySelector('#fieldname')
  fireEvent.change(fieldname, {target: {value: "value"}})
  expect(fieldname.value).toEqual("value");

  const description = container.querySelector('#description')
  fireEvent.change(description, {target: {value: "value"}})
  expect(description.value).toEqual("value");

  const fieldtype = container.querySelector('#fieldtype')
  fireEvent.change(fieldtype, {target: {value: "37"}})
  expect(fieldtype.value).toEqual("37");

  const orderby = container.querySelector('#orderby')
  fireEvent.change(orderby, {target: {value: "12"}})
  expect(orderby.value).toEqual("12");

})

it('renders the card in the Disabled state', () => {
  const { container } = render(
    <Disabled {...Disabled.args} id="test_settings" />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();
})