import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, Disabled } from './Formula.stories';

it('renders the card in the Default state', () => {
  const onFormula = jest.fn()
  const onClose = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_settings"
    onFormula={onFormula} onClose={onClose} />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();

  const closeIcon = container.querySelector('#closeIcon')
  fireEvent.click(closeIcon)
  expect(onClose).toHaveBeenCalledTimes(1);

  const btn_cancel = container.querySelector('#btn_cancel')
  fireEvent.click(btn_cancel)
  expect(onClose).toHaveBeenCalledTimes(2);

  const btn_formula = container.querySelector('#btn_formula')
  fireEvent.click(btn_formula)
  expect(onFormula).toHaveBeenCalledTimes(1);

  const formula = container.querySelector('#formula')
  fireEvent.change(formula, {target: {value: "19"}})
  expect(formula.value).toEqual("19");

})

it('renders the card in the Disabled state', () => {
  const { container } = render(
    <Disabled {...Disabled.args} id="test_settings" />
  );
  expect(container.querySelector('#test_settings')).toBeDefined();
})