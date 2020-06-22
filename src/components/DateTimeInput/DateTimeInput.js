import React, { memo } from 'react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './DateTimeInput.css';

export const DateTimeInput = memo((props) => {
  const { placeholder, dateTime, dateFormat, timeFormat,
    minDate, maxDate, excludeDates, includeDates, highlightDates,
    showTimeSelectOnly, showTimeInput, excludeTimes, includeTimes, timeIntervals,
    locale, isEmpty, readOnly, disabled, className } = props
  const { setValue, setFocus } = props
  const { selectedDate } = props
  const lostFocus = () => {
    setFocus(false)
  }
  return (
    <DatePicker 
      selected={selectedDate}
      placeholderText={placeholder}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      minDate={minDate}
      maxDate={maxDate}
      excludeDates={excludeDates}
      includeDates={includeDates}
      highlightDates={highlightDates}
      showTimeSelect={(dateTime || showTimeSelectOnly)}
      showTimeSelectOnly={showTimeSelectOnly}
      showTimeInput={showTimeInput}
      timeIntervals={timeIntervals}
      excludeTimes={excludeTimes}
      includeTimes={includeTimes}
      locale={locale}
      isClearable={isEmpty}
      readOnly={readOnly}
      disabled={disabled}
      onChange={(value) => setValue( value )}
      onFocus={()=>setFocus(true)}
      onBlur={lostFocus}
      onCalendarClose={lostFocus}
      className={className} />
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.value === nextProps.value) &&
    (prevProps.focus === nextProps.focus)
  )
})
