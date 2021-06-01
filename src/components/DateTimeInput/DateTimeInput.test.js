import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import DateTimeInput from './index';

beforeEach(() => {
  global.document.createRange = () => ({
    setStart: () => {},
    setEnd: () => {},
    commonAncestorContainer: {
      nodeName: 'BODY',
      ownerDocument: document,
    },
  });
})

describe('DateTimeInput', () => {

  it('DateTimeInput', () => {
    const { container, rerender } = render(<DateTimeInput />);
    expect(container.querySelector('input').tagName).toEqual("INPUT")

    rerender(<DateTimeInput />)
  });

  it('DateTimeInput change event datetime', () => {
    const { container } = render(
      <DateTimeInput value="" onChange={()=>{}} dateTime={true} 
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = '2012-11-01'
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

    fireEvent.focus(testInput)

  });

  it('DateTimeInput change event date', () => {
    const { container } = render(
      <DateTimeInput value="" onChange={()=>{}} dateTime={false} 
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = '2012-11-01'
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

    fireEvent.blur(testInput)
  });

  it('DateTimeInput change event time', () => {
    const { container } = render(
      <DateTimeInput value="" onChange={()=>{}} showTimeSelectOnly={true} 
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = '2012-11-01'
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

  });

  it('DateTimeInput change event null, isEmpty', () => {
    const { container } = render(
      <DateTimeInput value="2012-11-01" onChange={()=>{}} isEmpty={true}
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = ""
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

  });

  it('DateTimeInput change event null, cancel', () => {
    const { container } = render(
      <DateTimeInput value="2012-11-01" onChange={()=>{}}
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = ""
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

  });

  it('DateTimeInput change event missing onChange  ', () => {
    const { container } = render(
      <DateTimeInput value=""
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    const testInput = container.querySelector('input')

    let value = "2012-11-01"
    fireEvent.change(testInput, {target: {value: value}})
    expect(testInput.value).toBe(value)

  });

  it('DateTimeInput time', () => {
    const { container } = render(
      <DateTimeInput value="16:40" onChange={()=>{}} showTimeSelectOnly={true}
        dateFormat="yyyy-MM-dd" timeFormat="HH:mm" />);

    expect(container.querySelector('input').tagName).toEqual("INPUT")

  });

})