import React from 'react';
import update from 'immutability-helper';
import { render, fireEvent } from '@testing-library/react'

import { AppProvider } from 'containers/App/context'
import { User } from 'components/Icons';
import { Label, Input, Select, DateInput } from './index';

const store = { 
  data: {
    key1: {
      value: "",
      key2: {
        key3: "test"
      }
    },
    ui:{
      dateFormat: "yyyy-MM-dd",
      timeFormat: "HH:mm",
      timeIntervals: 15
    }
  },
  actions: {
    getText: (key)=>{ return key },
    setData: jest.fn()
  } 
}

afterEach(() => {
  jest.clearAllMocks();
});

describe('Icons', () => {

  it('Label', () => {

    const ctr_store = update({}, {$set: store})
    const { container, rerender } = render(
      <AppProvider value={ctr_store}>
        <Label text="hello" value="leo" />
      </AppProvider>);
    expect(container.querySelector('span').tagName).toEqual("SPAN")

    rerender(
      <AppProvider value={ctr_store}>
        <Label link="true" keys={["key1", "key2", "key3"]} />
      </AppProvider>)

    rerender(
      <AppProvider value={ctr_store}>
        <Label center leftIcon={<User />} col={30} keys={["key1"]} value="Google" />
      </AppProvider>)

    rerender(
      <AppProvider value={ctr_store}>
        <Label leftIcon={<User />} keys={["key1", "key2", "key4"]} value="Google" />
      </AppProvider>)
    
    rerender(
      <AppProvider value={ctr_store}>
        <Label keys={["key1", "value"]} rightIcon={<User />} />
      </AppProvider>)
    
    rerender(
      <AppProvider value={ctr_store}>
        <Label />
      </AppProvider>)
    
    rerender(<Label text="hello" />)
  });

  it('Input', () => {

    let ctr_store = update(store, {
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    const { container, rerender } = render(
      <AppProvider value={ctr_store}>
        <Input id="testInput1" text="hello" keys={["key1", "key2", "key3"]} />
      </AppProvider>);
    expect(container.querySelector('input').tagName).toEqual("INPUT")

    const testInput1 = container.querySelector('#testInput1')
    let value = 'value'
    fireEvent.change(testInput1, {target: {value: value}})
    expect(ctr_store.setData).toHaveBeenCalled()

    ctr_store = update(store, {
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    rerender(
      <AppProvider value={ctr_store}>
        <Input id="testInput2" placeholder="hello" keys={["key1", "value"]} />
      </AppProvider>)

    const testInput2 = container.querySelector('#testInput2')
    value = 'test'
    fireEvent.change(testInput2, {target: {value: value}})
    expect(ctr_store.setData).toHaveBeenCalled()

    fireEvent.focus(testInput2)
    fireEvent.blur(testInput2)

  });

  it('Input', () => {
    let ctr_store = update(store, {
      data: {$merge: {
        key1: {
          bigdata: 9999999,
          smalldata: 0
        }
      }},
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    const { container, rerender } = render(
      <AppProvider value={ctr_store}>
        <Input id="testInput4" itype="integer" keys={["key1","bigdata"]} 
          onChange={(event)=>{ 
            ctr_store.data["key1"]["bigdata"] = event.target.value 
          }} 
          max={20000} />
      </AppProvider>)
    
    const testInput4 = container.querySelector('#testInput4')
    let value = "123456"
    fireEvent.change(testInput4, {target: {value: value}})
    expect(ctr_store.data["key1"]["bigdata"]).toBe(value)

    rerender(<AppProvider value={ctr_store}>
        <Input id="testInput4" itype="integer" keys={["key1","smalldata"]} 
          onChange={(event)=>{ 
            ctr_store.data["key1"]["smalldata"] = event.target.value 
          }} 
          min={1} />
      </AppProvider>)
    
    rerender(<AppProvider value={ctr_store}>
        <Input id="testInput4" itype="integer" value={200}  
          min={1} max={20000} />
      </AppProvider>)
    
    rerender(
      <AppProvider value={ctr_store}>
        <Input id="testInput5" value="test" />
      </AppProvider>)
    
    const testInput5 = container.querySelector('#testInput5')
    value = "nokey"
    fireEvent.change(testInput5, {target: {value: value}})
    expect(ctr_store.setData).not.toHaveBeenCalled()

  });

  it('Select', () => {
    let ctr_store = update(store, {
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    const options = [
      { value: "value1", text: "Text1"}, 
      { value: "value2", text: "Text2"},
      { value: "value3", text: "Text3"}
    ]
    const { container, rerender } = render(
      <AppProvider value={ctr_store}>
        <Select id="testSelect" placeholder="md_games_played_hero" 
          keys={["key1", "key2", "key3"]} options={options} />
      </AppProvider>);
    expect(container.querySelector('select').tagName).toEqual("SELECT")

    const testSelect = container.querySelector('#testSelect')
    let value = 'value1'
    fireEvent.change(testSelect, {target: {value: value}})
    expect(ctr_store.setData).toHaveBeenCalled()

    fireEvent.focus(testSelect)
    fireEvent.blur(testSelect)

    ctr_store = update(store, {
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    rerender(
      <AppProvider value={ctr_store}>
        <Select keys={["key1", "key2", "key4"]} onChange={(event)=>jest.fn()}  />
      </AppProvider>)

    rerender(
      <AppProvider value={ctr_store}>
        <Select placeholder="md_games_played_hero" keys={["key1", "key2", "key4"]}  />
      </AppProvider>)

  });

  it('DateInput', () => {
    let ctr_store = update(store, {
      data: { $merge: {
        key1: {
          key2: {
            key3: "2020-01-01"
          }
        }
      }},
      actions: { $merge: {
        setData: jest.fn()
      }}
    })
    const { container, rerender } = render(
      <AppProvider value={ctr_store}>
        <DateInput keys={["key1", "key2", "key3"]} />
      </AppProvider>);
    expect(container.querySelector('input').tagName).toEqual("INPUT")

    const testInput = container.querySelector('input')
    let value = '2012-11-01'
    fireEvent.change(testInput, {target: {value: value}})
    expect(ctr_store.setData).toHaveBeenCalled()

    rerender(
      <AppProvider value={ctr_store}>
        <DateInput default="2020-01-01" keys={["key1", "key2", "key4"]} />
      </AppProvider>);
  
  });

})