import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import { formatISO, isValid, parseISO } from 'date-fns'

import "react-datepicker/dist/react-datepicker.css";
import './DateTime.css';

import { store } from 'config/app'

export const DateTime = ({ 
  value, placeholder, dateTime, isEmpty, showTimeSelectOnly,
  dateFormat, timeFormat, locale, className,
  onChange,
  ...props 
}) => {
  const selectedDate = () => {
    let dateValue = (value) ? parseISO(value) : null
    if(value && !isValid(dateValue) && showTimeSelectOnly){
      dateValue = new Date(formatISO(new Date(), { representation: 'date' })+"T"+value)
    }
    return dateValue
  } 

  const setValue = ( input ) => {
    if(onChange){
      if(input === null){
        if(isEmpty){
          return onChange(null)
        }
        return onChange(value)
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

  return(
    <DatePicker
      className={`${className}`} 
      selected={selectedDate()}
      placeholderText={placeholder}
      dateFormat={(showTimeSelectOnly) ? timeFormat : 
        (dateTime) ? dateFormat+" "+timeFormat : dateFormat}
      timeFormat={timeFormat}
      showTimeSelect={(dateTime || showTimeSelectOnly)}
      showTimeSelectOnly={showTimeSelectOnly}
      locale={locale}
      isClearable={isEmpty}
      onChange={(value) => setValue( value )}
      {...props}
    />
  )
}

DateTime.propTypes = {
  /**
   * Calendar selected value
   */
  value: PropTypes.string,
  /**
   * Input box placeholder text
   */
  placeholder: PropTypes.string,
  /**
   * Date or Datetime input
   */ 
  dateTime: PropTypes.bool.isRequired,
  /**
   * Enabled empty (null) value 
   */ 
  isEmpty: PropTypes.bool.isRequired,
  /**
   * Time input 
   */ 
  showTimeSelectOnly: PropTypes.bool.isRequired,
  /**
   * Locale date format
   */
  dateFormat: PropTypes.string,
  /**
    * Locale time format 
    */ 
  timeFormat: PropTypes.string,
  /**
   * Calendar locale
   */
  locale: PropTypes.string,
  /**
   * onChange handle
   */
  onChange: PropTypes.func,
}

DateTime.defaultProps = {
  value: undefined,
  placeholder: undefined,
  dateTime: true,
  isEmpty: true,
  showTimeSelectOnly: false,
  dateFormat: store.ui.dateFormat,
  timeFormat: store.ui.timeFormat,
  locale: store.ui.calendar,
  onChange: undefined
}

export default DateTime;