import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, DateInput, TimeInput, Placeholder } from './DateTime.stories';

it('renders the card in the Default state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_date"
      onChange={onChange} />
  );
  expect(container.querySelector('#test_date')).toBeDefined();

  const close_btn = container.querySelector('.react-datepicker__close-icon')
  fireEvent.click(close_btn)
  expect(onChange).toHaveBeenCalledTimes(1);

  const input = container.querySelector('input')
  fireEvent.change(input, {target: {value: null}})
  expect(onChange).toHaveBeenCalledTimes(2);

  fireEvent.change(input, {target: {value: "2021-12-24 12:00"}})
  expect(onChange).toHaveBeenCalledTimes(3);

});

it('renders the card in the DateInput state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <DateInput {...DateInput.args} id="test_date" 
      onChange={onChange} />
  );
  expect(container.querySelector('#test_date')).toBeDefined();

  const input = container.querySelector('input')
  fireEvent.change(input, {target: {value: null}})
  expect(onChange).toHaveBeenCalledTimes(1);

  fireEvent.change(input, {target: {value: "2021-12-24"}})
  expect(onChange).toHaveBeenCalledTimes(2);

});

it('renders the card in the TimeInput state', () => {
  const onChange = jest.fn()

  const { container } = render(
    <TimeInput {...TimeInput.args} id="test_date" 
      onChange={onChange}/>
  );
  expect(container.querySelector('#test_date')).toBeDefined();

  const input = container.querySelector('input')
  fireEvent.change(input, {target: {value: "12:20"}})
  expect(onChange).toHaveBeenCalledTimes(1);

});

it('renders the card in the Placeholder state', () => {
  const { container } = render(
    <Placeholder {...Placeholder.args} id="test_date" onChange={null} />
  );
  expect(container.querySelector('#test_date')).toBeDefined();

  const input = container.querySelector('input')
  fireEvent.change(input, {target: {value: "2001-12-12"}})
  
});