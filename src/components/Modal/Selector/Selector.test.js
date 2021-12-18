import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, QuickView } from './Selector.stories';

it('renders the card in the Default state', () => {
  const onSelect = jest.fn()
  const onSearch = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_selector"
      onSelect={onSelect} onSearch={onSearch} onClose={onClose} />
  );
  expect(container.querySelector('#test_selector')).toBeDefined();

  const row_item = container.querySelector('tbody tr')
  fireEvent.click(row_item)
  expect(onSelect).toHaveBeenCalledTimes(1);

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_search = container.querySelector('#btn_search')
  fireEvent.click(btn_search)
  expect(onSearch).toHaveBeenCalledTimes(1);

  const filter = container.querySelector('#filter')
  fireEvent.change(filter, {target: {value: "filter"}})
  expect(filter.value).toEqual("filter");
  fireEvent.keyDown(filter, { key: 'Enter', code: 'Enter', keyCode: 13 })
  expect(onSearch).toHaveBeenCalledTimes(2)

})

it('renders the card in the QuickView state', () => {
  const { container } = render(
    <QuickView {...QuickView.args} id="test_selector" />
  );
  expect(container.querySelector('#test_selector')).toBeDefined();
})