import { render, fireEvent } from '@testing-library/react';

import '@testing-library/jest-dom/extend-expect';

import { Default, TopPagination, BottomPagination, Filtered } from './Table.stories';
import Table from './Table';

beforeEach(() => {
  Object.defineProperty(global.window, 'scrollTo', { value: jest.fn() });
});

afterEach(() => {
  jest.clearAllMocks();
});

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="test_table" />
  );
  expect(container.querySelector('#test_table')).toBeDefined();

  const row_selected = container.querySelector('tbody tr')
  fireEvent.click(row_selected)

});

it('renders the card in the TopPagination state', () => {
  const onRowSelected = jest.fn()
  const onCurrentPage = jest.fn()
  const onEditCell = jest.fn()

  const { container, getByText } = render(
    <TopPagination {...TopPagination.args} id="test_table"
      onRowSelected={onRowSelected} onCurrentPage={onCurrentPage} onEditCell={onEditCell} />
  );
  expect(container.querySelector('#test_table')).toBeDefined();

  const row_selected = container.querySelector('tbody tr')
  fireEvent.click(row_selected)
  expect(onRowSelected).toHaveBeenCalledTimes(1);

  const link_cell = container.querySelector('.link-cell')
  fireEvent.click(link_cell)
  expect(onEditCell).toHaveBeenCalledTimes(1);

  const page_2 = getByText("2")
  fireEvent.click(page_2)
  expect(onCurrentPage).toHaveBeenCalledTimes(1);

  const sort_header = container.querySelector('.sort')
  fireEvent.click(sort_header)

});

it('renders the card in the BottomPagination state', () => {

  const { container, getByText } = render(
    <BottomPagination {...BottomPagination.args} id="test_table" />
  );
  expect(container.querySelector('#test_table')).toBeDefined();

  const page_1 = getByText("1")
  fireEvent.click(page_1)

});

it('renders the card in the Filtered state', () => {
  const onAddItem = jest.fn()

  const { container } = render(
    <Filtered {...Filtered.args} id="test_table" onAddItem={onAddItem} />
  );
  expect(container.querySelector('#test_table')).toBeDefined();

  const btn_add = container.querySelector('#btn_add')
  fireEvent.click(btn_add)
  expect(onAddItem).toHaveBeenCalledTimes(1);

  const filter = container.querySelector('#filter')
  fireEvent.change(filter, {target: {value: "filter"}})
  expect(filter.value).toEqual("filter");

});

it('renders the card in the List memo state', () => {

  const { container, rerender } = render(
    <Table id="test_table" />
  );
  expect(container.querySelector('#test_table')).toBeDefined();

  rerender(<Table id="test_table" />);

});