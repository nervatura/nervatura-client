import React, { useState } from 'react';
import { formatISO, isValid, parseISO } from 'date-fns'

import { DateTimeInput } from "./DateTimeInput";

export default (props) => {

  const { value, onChange, placeholder, dateTime,
    dateFormat, timeFormat,
    minDate, maxDate, highlightDates, excludeDates, includeDates,
    showTimeSelectOnly, showTimeInput, excludeTimes, includeTimes,
    locale, isEmpty, readOnly, disabled } = props

  const [ state, setState ] = useState({
    focus: false,
    placeholder: placeholder,
    dateTime: dateTime,
    dateFormat: (showTimeSelectOnly) ? timeFormat : 
      (dateTime) ? dateFormat+" "+timeFormat : dateFormat,
    timeFormat: timeFormat,
    minDate: minDate,
    maxDate: maxDate,
    excludeDates: excludeDates,
    includeDates: includeDates,
    highlightDates: highlightDates,
    showTimeSelectOnly: showTimeSelectOnly,
    showTimeInput:showTimeInput,
    excludeTimes: excludeTimes,
    includeTimes: includeTimes,
    locale: locale
  })
  
  state.isEmpty = isEmpty
  state.readOnly = readOnly
  state.disabled = disabled
  state.value = value
  state.selectedDate = (value) ? parseISO(value) : null
  if(value && !isValid(state.selectedDate) && showTimeSelectOnly){
    state.selectedDate = new Date(formatISO(new Date(), { representation: 'date' })+"T"+value)
  }

  state.setValue = ( input ) => {
    if(onChange){
      if(input === null){
        if(isEmpty){
          return onChange(null)
        }
        return onChange(state.value)
      }
      if(showTimeSelectOnly){
        return onChange(formatISO(input, { representation: 'time' }))  
      }
      if(!dateTime){
        return onChange(formatISO(input, { representation: 'date' }))  
      }
      return onChange(formatISO(input))
    }
  }

  state.setFocus = ( value ) => {
    setState({ ...state, focus: value })
  }

  return <DateTimeInput {...state}  />
}