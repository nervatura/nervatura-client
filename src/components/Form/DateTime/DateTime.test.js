import { render, fireEvent, queryByAttribute } from '@testing-library/react';
import { screen } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect';

import { Default, DateInput, TimeInput, Placeholder } from './DateTime.stories';

const getById = queryByAttribute.bind(null, 'id');

it('renders in the Default state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_date"
      onChange={onChange} />
  );
  expect(getById(container, 'test_date')).toBeDefined();

  const close_btn = screen.getByRole('button', {});
  fireEvent.click(close_btn)
  expect(onChange).toHaveBeenCalledTimes(1);

  const input = getById(container, 'test_date')
  fireEvent.change(input, {target: {value: null}})
  expect(onChange).toHaveBeenCalledTimes(2);

  fireEvent.change(input, {target: {value: "2021-12-24 12:00"}})
  expect(onChange).toHaveBeenCalledTimes(3);

});

it('renders in the DateInput state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <DateInput {...DateInput.args} id="test_date" 
      onChange={onChange} />
  );
  expect(getById(container, 'test_date')).toBeDefined();

  const input = getById(container, 'test_date')
  fireEvent.change(input, {target: {value: null}})
  expect(onChange).toHaveBeenCalledTimes(1);

  fireEvent.change(input, {target: {value: "2021-12-24"}})
  expect(onChange).toHaveBeenCalledTimes(2);

});

it('renders in the TimeInput state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <TimeInput {...TimeInput.args} id="test_date" 
      onChange={onChange}/>
  );
  expect(getById(container, 'test_date')).toBeDefined();

  const input = getById(container, 'test_date')
  fireEvent.change(input, {target: {value: "12:20"}})
  expect(onChange).toHaveBeenCalledTimes(1);

});

it('renders in the Placeholder state', () => {
  const { container } = render(
    <Placeholder {...Placeholder.args} id="test_date" onChange={null} />
  );
  expect(getById(container, 'test_date')).toBeDefined();

  const input = getById(container, 'test_date')
  fireEvent.change(input, {target: {value: "2001-12-12"}})
  
});