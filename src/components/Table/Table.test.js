import React from 'react';
import { render, fireEvent } from '@testing-library/react'

import Table from './index';

const dateFormat = "yyyy-MM-dd"
const timeFormat = "HH:mm"
const fields = {
  name: { fieldtype:'string', label: "Name" },
  valid: { fieldtype:'bool', label: "Valid" },
  from: { fieldtype:'date', label: "From" },
  start: { fieldtype:'time', label: "Start" },
  stamp: { fieldtype:'datetime', label: "Stamp" },
  levels: { fieldtype: 'number', label: "Levels", format: true, verticalAlign: "middle" },
  videos: { fieldtype: 'number', textAlign: "center" },
  editor: { columnDef: { property: "editor", 
    cell: { formatters: [
      () => <button className="primary full" onClick={() => {} } >Hello</button> ] }
  }}
}

const items = [
  { id: 1, name: "Name1", "levels": 0, valid: "true", 
    from: "2020-06-06", start: "2020-04-23T10:30:00+02:00", stamp: "2020-04-23T10:30:00+02:00",
    name_color: "red" },
  { id: 2, name: "Name2", "levels": 20, valid: 1, 
    from: "2020-06-06", start: "2020-04-23T10:30:00+02:00", stamp: "2020-04-23T10:30:00+02:00",
    name_color: "red", edited: true },
  { id: 3, name: "Name3", "levels": 30, valid: "false", 
    from: "2020-06-06", start: "2020-04-23T10:30:00+02:00", stamp: "2020-04-23T10:30:00+02:00",
    name_color: "yellow", disabled: true },
  { id: 4, name: "Name4", "levels": 40, valid: 0, 
    from: "2020-06-06", start: "", stamp: "2020-04-23T10:30:00+02:00",
    name_color: "yellow" },
  { id: 5, name: "Name5", "levels": 50, valid: false,
    from: "2020-06-06", start: "2020-04-23T10:30:00+02:00", stamp: "2020-04-23T10:30:00+02:00" },
  { id: 6, name: "Name6", "levels": 60, valid: true, 
    from: "2020-06-06", start: "2020-04-23T10:30:00+02:00", stamp: "2020-04-23T10:30:00+02:00",
    name_color: "green" }
]

beforeEach(() => {
  Object.defineProperty(global.window, 'scrollTo', { value: jest.fn() });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Table', () => {

  it('Table', () => {
    render(<Table />);
  });

  it('Table', () => {

    const { container, rerender } = render(<Table 
      fields={fields} rows={items} tableFilter={false}
      filterPlaceholder="Placeholder" tablePadding="8px"
      labelYes="YES" labelNo="NO" dateFormat={dateFormat} timeFormat={timeFormat}
      paginationPage={5} paginationTop={true} />);
    expect(container.querySelector('table')).toBeDefined()

    rerender(<Table 
      fields={fields} rows={items} tableFilter={false}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={5} paginationTop={true} />)

  });

  it('Table', () => {

    const { container } = render(<Table 
      fields={fields} rows={items} tableFilter={false} paginatonScroll={true}
      filterPlaceholder="Placeholder"
      paginationPage={5} paginationTop={false} />);
    expect(container.querySelector('table')).toBeDefined()

    render(<Table 
      fields={fields} rows={items} tableFilter={false}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={0} paginationTop={false} />);

  });

  it('Filter change', () => {

    const { container } = render(<Table 
      fields={fields} rows={items} tableFilter={true}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={0} paginationTop={true} />);
    
    const filterInput = container.querySelector('#filter')
    let value = 'name2'
    fireEvent.change(filterInput, {target: {value: value}})
    expect(filterInput.value).toBe(value)

  });

  it('Table onRowSelected 1.', () => {

    const rowClick = jest.fn()
    const { container } = render(<Table 
      fields={fields} rows={items} tableFilter={true}
      onRowSelected={rowClick}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={0} paginationTop={true} />);
    
    let tableRow = container.querySelector('tbody tr')
    fireEvent.click(tableRow)
    expect(rowClick).toHaveBeenCalled()

  });

  it('Table onRowSelected 2.', () => {

    const rowClick = jest.fn()
    const { container } = render(<Table 
      fields={fields} rows={items} tableFilter={true}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={0} paginationTop={true} />)

    const tableRow = container.querySelector('tbody tr')
    fireEvent.click(tableRow)
    expect(rowClick).not.toHaveBeenCalled() 

  });

  it('Pagination onSelect', () => {

    const currentPage = jest.fn()
    const { getByText } = render(<Table onCurrentPage={currentPage}
      fields={fields} rows={items} tableFilter={true} paginatonScroll={true}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={5} paginationTop={true} />);

    const selectButton = getByText('2')
    fireEvent.click(selectButton)
    expect(currentPage).toHaveBeenCalled()

  });

  it('Pagination onSelect', () => {

    const { getByText } = render(<Table
      fields={fields} rows={items} tableFilter={true}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={5} paginationTop={true} />);

    const selectButton = getByText('2')
    fireEvent.click(selectButton)

  });

  it('Pagination onSort', () => {

    const currentPage = jest.fn()
    const { container } = render(<Table onCurrentPage={currentPage}
      fields={fields} rows={items} tableFilter={true} paginatonScroll={true}
      filterPlaceholder="Placeholder" tablePadding="8px"
      paginationPage={5} paginationTop={true} />);

    const headerButton = container.querySelector('th')
    fireEvent.click(headerButton)

  });

});