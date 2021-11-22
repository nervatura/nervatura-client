import { render, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, TopPagination, BottomPagination, Filtered } from './List.stories';
import List from './List';

beforeEach(() => {
  Object.defineProperty(global.window, 'scrollTo', { value: jest.fn() });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="test_list" />
  );
  expect(container.querySelector('#test_list')).toBeDefined();

});

it('renders the card in the TopPagination state', () => {
  const onEdit = jest.fn()
  const onDelete = jest.fn()
  const onCurrentPage = jest.fn()

  const { container, getByText } = render(
    <TopPagination {...TopPagination.args} id="test_list"
      onEdit={onEdit} onDelete={onDelete} onCurrentPage={onCurrentPage} />
  );
  expect(container.querySelector('#test_list')).toBeDefined();

  const row_edit = container.querySelector('#row_edit_1')
  fireEvent.click(row_edit)
  expect(onEdit).toHaveBeenCalledTimes(1);

  const row_item = container.querySelector('#row_item_1')
  fireEvent.click(row_item)
  expect(onEdit).toHaveBeenCalledTimes(2);

  const row_delete = container.querySelector('#row_delete_1')
  fireEvent.click(row_delete)
  expect(onDelete).toHaveBeenCalledTimes(1);

  const page_2 = getByText("2")
  fireEvent.click(page_2)
  expect(onCurrentPage).toHaveBeenCalledTimes(1);

});

it('renders the card in the BottomPagination state', () => {

  const { container, getByText } = render(
    <BottomPagination {...BottomPagination.args} id="test_list" />
  );
  expect(container.querySelector('#test_list')).toBeDefined();

  const page_1 = getByText("1")
  fireEvent.click(page_1)

});

it('renders the card in the Filtered state', () => {
  const onAddItem = jest.fn()

  const { container } = render(
    <Filtered {...Filtered.args} id="test_list" onAddItem={onAddItem} />
  );
  expect(container.querySelector('#test_list')).toBeDefined();

  const btn_add = container.querySelector('#btn_add')
  fireEvent.click(btn_add)
  expect(onAddItem).toHaveBeenCalledTimes(1);

  const filter = container.querySelector('#filter')
  fireEvent.change(filter, {target: {value: "filter"}})
  expect(filter.value).toEqual("filter");

});

it('renders the card in the List memo state', () => {

  const { container, rerender } = render(
    <List id="test_list" />
  );
  expect(container.querySelector('#test_list')).toBeDefined();

  rerender(<List id="test_list" />);

});