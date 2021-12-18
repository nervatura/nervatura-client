import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, BookmarkData, DarkTheme } from './Bookmark.stories';

it('renders the card in the Default state', () => {

  const { container } = render(
    <Default {...Default.args} id="test_bookmark" />
  );
  expect(container.querySelector('#test_bookmark')).toBeDefined();
})

it('renders the card in the BookmarkData state', () => {
  const onSelect = jest.fn()
  const onDelete = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <BookmarkData {...BookmarkData.args} id="test_bookmark" 
      onSelect={onSelect} onDelete={onDelete} onClose={onClose} />
  );
  expect(container.querySelector('#test_bookmark')).toBeDefined();

  const row_item = container.querySelector('#row_item_1')
  fireEvent.click(row_item)
  expect(onSelect).toHaveBeenCalledTimes(1);

  const row_delete = container.querySelector('#row_delete_1')
  fireEvent.click(row_delete)
  expect(onDelete).toHaveBeenCalledTimes(1);

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_bookmark = container.querySelector('#btn_bookmark')
  fireEvent.click(btn_bookmark)

  const btn_history = container.querySelector('#btn_history')
  fireEvent.click(btn_history)
  
})

it('renders the card in the DarkTheme state', () => {

  const { container } = render(
    <DarkTheme {...DarkTheme.args} id="test_bookmark" />
  );
  expect(container.querySelector('#test_bookmark')).toBeDefined();
})