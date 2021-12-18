import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, FlipStringOn, FlipStringOff, FlipTextOn, FlipTextOff, FlipImageOn, FlipImageOff,
  FlipChecklistOn, FlipChecklistOff, Field, Reportfield, ReportfieldEmpty, Fieldvalue,
  Col2, Col3, Col4, Missing, Label } from './Row.stories';

it('renders the card in the Default state', () => {
  const { container } = render(
    <Default {...Default.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Label state', () => {
  const { container } = render(
    <Label {...Label.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the FlipStringOn state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <FlipStringOn {...FlipStringOn.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const checkbox = container.querySelector('#checkbox_title')
  fireEvent.click(checkbox)
  expect(onEdit).toHaveBeenCalledTimes(1);

});

it('renders the card in the FlipStringOff state', () => {
  const { container } = render(
    <FlipStringOff {...FlipStringOff.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the FlipTextOn state', () => {
  const { container } = render(
    <FlipTextOn {...FlipTextOn.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the FlipTextOff state', () => {
  const { container } = render(
    <FlipTextOff {...FlipTextOff.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the FlipImageOn state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <FlipImageOn {...FlipImageOn.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const input_src = container.querySelector('#input_src')
  fireEvent.change(input_src, {target: {value: "data:image"}})
  expect(onEdit).toHaveBeenCalledTimes(1);

  const file_src = container.querySelector('#file_src')
  fireEvent.change(file_src, {target: {value: ""}})
  expect(onEdit).toHaveBeenCalledTimes(2);

  render(
    <FlipImageOn {...FlipImageOn.args} 
      values={{ src: "" }} />
  )

  render(
    <FlipImageOn {...FlipImageOn.args} 
      values={{ src: "data:image" }} />
  )

  render(
    <FlipImageOn {...FlipImageOn.args} 
      values={{ src: "data" }} />
  )

});

it('renders the card in the FlipImageOff state', () => {
  const { container } = render(
    <FlipImageOff {...FlipImageOff.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the FlipChecklistOn state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <FlipChecklistOn {...FlipChecklistOn.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const checkbox = container.querySelector('#checklist_border_0')
  fireEvent.click(checkbox)
  expect(onEdit).toHaveBeenCalledTimes(1);

});

it('renders the card in the FlipChecklistOff state', () => {
  const { container } = render(
    <FlipChecklistOff {...FlipChecklistOff.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Field state', () => {
  const { container } = render(
    <Field {...Field.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Reportfield state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <Reportfield {...Reportfield.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const cb_posdate = container.querySelector('#cb_posdate')
  fireEvent.click(cb_posdate)
  expect(onEdit).toHaveBeenCalledTimes(0);

});

it('renders the card in the ReportfieldEmpty state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <ReportfieldEmpty {...ReportfieldEmpty.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const cb_curr = container.querySelector('#cb_curr')
  fireEvent.click(cb_curr)
  expect(onEdit).toHaveBeenCalledTimes(1);

});

it('renders the card in the Fieldvalue state', () => {
  const onEdit = jest.fn()

  const { container } = render(
    <Fieldvalue {...Fieldvalue.args} id="test_input" onEdit={onEdit} />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

  const checkbox = container.querySelector('#delete_sample_customer_float')
  fireEvent.click(checkbox)
  expect(onEdit).toHaveBeenCalledTimes(1);

  const notes = container.querySelector('#notes_sample_customer_float')
  fireEvent.change(notes, {target: {value: "value"}})
  expect(onEdit).toHaveBeenCalledTimes(2);

  render(
    <Fieldvalue {...Fieldvalue.args} id="test_input" 
      data={{
        dataset: {}, 
        current: {}, 
        audit: "readonly"}} />
  );

});

it('renders the card in the Col2 state', () => {
  const { container } = render(
    <Col2 {...Col2.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Col3 state', () => {
  const { container } = render(
    <Col3 {...Col3.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Col4 state', () => {
  const { container } = render(
    <Col4 {...Col4.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});

it('renders the card in the Missing state', () => {
  const { container } = render(
    <Missing {...Missing.args} id="test_input" />
  );
  expect(container.querySelector('#test_input')).toBeDefined();

});