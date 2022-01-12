import { render, queryByAttribute, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Office } from './Search.stories';

const getById = queryByAttribute.bind(null, 'id');

it('renders in the Default state', () => {
  const onGroup = jest.fn()
  const onMenu = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_menu" onGroup={onGroup} onMenu={onMenu} />
  );
  expect(getById(container, "test_menu")).toBeDefined();

  const btn_view = getById(container, 'btn_view_transitem')
  fireEvent.click(btn_view)
  expect(onMenu).toHaveBeenCalledTimes(1);

  const btn_browser = getById(container, 'btn_browser_transitem')
  fireEvent.click(btn_browser)
  expect(onMenu).toHaveBeenCalledTimes(2);

  const btn_group = getById(container, 'btn_group_customer')
  fireEvent.click(btn_group)
  expect(onGroup).toHaveBeenCalledTimes(1);

  const btn_report = getById(container, 'btn_report')
  fireEvent.click(btn_report)
  expect(onGroup).toHaveBeenCalledTimes(2);

  const btn_office = getById(container, 'btn_office')
  fireEvent.click(btn_office)
  expect(onGroup).toHaveBeenCalledTimes(3);

})

it('renders in the Office state', () => {
  const onMenu = jest.fn()

  const { container } = render(
    <Office {...Office.args} id="test_menu" onMenu={onMenu} />
  );
  expect(getById(container, "test_menu")).toBeDefined();

  const btn_printqueue = getById(container, 'btn_printqueue')
  fireEvent.click(btn_printqueue)
  expect(onMenu).toHaveBeenCalledTimes(1);

  const btn_rate = getById(container, 'btn_rate')
  fireEvent.click(btn_rate)
  expect(onMenu).toHaveBeenCalledTimes(2);

  const btn_servercmd = getById(container, 'btn_servercmd')
  fireEvent.click(btn_servercmd)
  expect(onMenu).toHaveBeenCalledTimes(3);

})