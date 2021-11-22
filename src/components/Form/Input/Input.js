import PropTypes from 'prop-types';
import './Input.module.css';

export const INPUT_TYPE = {
  TEXT: "text",
  INTEGER: "integer",
  NUMBER: "number",
  COLOR: "color",
  FILE: "file",
  PASSWORD: "password",
}

export const DECIMAL_SEPARATOR = {
  POINT: ".",
  COMMA: ","
}

export const Input = ({ 
  type, separator, value, minValue, maxValue, focus, className,
  onChange, onBlur, onEnter,
  ...props 
}) => {
  return <input {...props} 
    type={type}
    value={((type === INPUT_TYPE.NUMBER) || (type === INPUT_TYPE.INTEGER))
      ? String(value).replace(DECIMAL_SEPARATOR.POINT,separator) : value}
    className={`${className} ${((type === INPUT_TYPE.NUMBER) || (type === INPUT_TYPE.INTEGER))?"align-right":""} `}
    onChange={(event) => {
      event.stopPropagation();
      let inputValue = event.target.value
      if((type === INPUT_TYPE.NUMBER) || (type === INPUT_TYPE.INTEGER)){
        inputValue = (type === "number") ? 
          String(event.target.value).replace(new RegExp(`[^0-9${separator}-]`, "g"), "") : 
          String(event.target.value).replace(/[^0-9-]|-(?=.)/g,'')
        if(inputValue === ""){
          inputValue = 0
        }
        if(!String(inputValue).endsWith(separator) 
          || (String(inputValue).endsWith(separator) 
            && (String(inputValue).match(new RegExp(`[${separator}]`, "g")).length > 1)) 
          || String(inputValue).endsWith(separator+separator)){
            inputValue = parseFloat(String(inputValue).replace(separator,DECIMAL_SEPARATOR.POINT))
          if(minValue && (inputValue < minValue)){
            inputValue = minValue
          }
          if(maxValue && (inputValue > maxValue)){
            inputValue = maxValue
          }
        }
      }
      onChange(inputValue)
    }}
    onKeyDown={(event)=>{
      event.stopPropagation();
      if(event.keyCode === 13){
        onEnter(value)
      }
    }}
    onBlur={(event) => {
      event.stopPropagation();
      let inputValue = event.target.value
      if((type === INPUT_TYPE.NUMBER) || (type === INPUT_TYPE.INTEGER)){
        inputValue = 0
        if((type === "number") 
          && !isNaN(parseFloat(String(event.target.value).replace(separator,DECIMAL_SEPARATOR.POINT)))){
            inputValue = parseFloat(String(event.target.value).replace(separator,DECIMAL_SEPARATOR.POINT))
        }
        if((type === "integer") && !isNaN(parseInt(event.target.value))){
          inputValue = parseInt(event.target.value,10)
        }
        if(!onBlur &&(String(inputValue) !== event.target.value)){
          onChange(inputValue)
        }
      }
      if(onBlur){
        onBlur(inputValue)
      }
    }}
  />
}

Input.propTypes = {
  /**
    * Input type
    */
  type: PropTypes.oneOf(Object.values(INPUT_TYPE)).isRequired,
  /**
   * Number type decimal separator
   */
  separator: PropTypes.oneOf(Object.values(DECIMAL_SEPARATOR)).isRequired,
  /**
   * Input value
   */
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * Number/integer type minimum value limit
   */
  minValue: PropTypes.number,
  /**
  * Number/integer type maximum value limit
  */
  maxValue: PropTypes.number,
  /**
  * Value change event
  */
  onChange: PropTypes.func,
  /**
  * Lost focus event
  */
  onBlur: PropTypes.func,
  /**
  * Enter key event
  */
  onEnter: PropTypes.func,
  /**
   * Input style
   */
  className: PropTypes.string,
}

Input.defaultProps = {
  type: INPUT_TYPE.TEXT,
  separator: DECIMAL_SEPARATOR.POINT,
  value: "",
  minValue: undefined,
  maxValue: undefined,
  onChange: undefined,
  onBlur: undefined,
  onEnter: undefined,
}

export default Input;