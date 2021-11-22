import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Placeholder } from './Select.stories';

it('renders the card in the Default state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_select"
    onChange={onChange} />
  );
  expect(container.querySelector('#test_select')).toBeDefined();

  const test_select = container.querySelector('#test_select')

  fireEvent.change(test_select, {target: {value: "value2"}})
  expect(onChange).toHaveBeenCalledTimes(1);

});

it('renders the card in the Placeholder state', () => {
  const { container } = render(
    <Placeholder {...Placeholder.args} id="test_select" />
  );
  expect(container.querySelector('#test_select')).toBeDefined();

});