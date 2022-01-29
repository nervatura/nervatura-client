import PropTypes from 'prop-types';
import update from 'immutability-helper';

import styles from './Meta.module.css';

import Row from 'components/Form/Row'
import Select from 'components/Form/Select'
import Label from 'components/Form/Label'
import Icon from 'components/Form/Icon'
import Button from 'components/Form/Button'

import Paginator, { paginate } from 'components/Form/Paginator/Paginator';

export const Meta = ({ 
  current, dataset, audit, className,
  getText, onEvent,
  ...props 
}) => {  
  const editItem = (options) => onEvent("editItem", [options])
  const onSelector = (...params) => onEvent("onSelector", [...params])
  const onSelect = (page) => {
    onEvent("onPaginationSelect", [page, fieldvalue_list.length])
  }

  let fieldvalue_list = []
  current.fieldvalue.forEach(fieldvalue => {
    let _deffield = dataset.deffield.filter((df) => (df.fieldname === fieldvalue.fieldname))[0]
    if ((_deffield.visible === 1) && (fieldvalue.deleted === 0)) {
      let _fieldtype = dataset.groups.filter((group) => (group.id === _deffield.fieldtype ))[0].groupvalue
      let _description = fieldvalue.value;
      let _datatype = _fieldtype;
      if(["customer", "tool", "trans", "transitem", "transmovement", "transpayment", 
        "product", "project", "employee", "place"].includes(_fieldtype)){
          let item = dataset.deffield_prop.filter((df) => (
            (df.ftype === _fieldtype) && (df.id === parseInt(fieldvalue.value,10))))[0]
          if(item){
            _description = item.description;}
          _datatype = "selector";
      }
      if(_fieldtype === "urlink"){
        _datatype = "text";
      }
      if(_fieldtype === "valuelist"){
        _description = _deffield.valuelist.split("|");
      }
      fieldvalue_list = update(fieldvalue_list, {$push: [{ 
        rowtype: 'fieldvalue',
        id: fieldvalue.id, name: 'fieldvalue_value', 
        fieldname: fieldvalue.fieldname, 
        value: fieldvalue.value, notes: fieldvalue.notes||'',
        label: _deffield.description, description: _description, 
        disabled: _deffield.readonly ? true : false,
        fieldtype: _fieldtype, datatype: _datatype
      }]})
    }
  });
  const deffields = () => {
    const ntype_id = dataset.groups.filter((group) => (
      (group.groupname === "nervatype") && (group.groupvalue === current.type )))[0].id
    if (current.type === "trans") {
      return dataset.deffield.filter((df) => (
        (df.nervatype === ntype_id) && (df.visible === 1))).filter( (df) => (
        (df.subtype === current.item.transtype) || (df.subtype === null)) ).map(
          (df)=>{ return {value: df.fieldname, text: df.description } })
    } else {
      return dataset.deffield.filter((df) => (
        (df.nervatype === ntype_id) && (df.visible === 1))).map(
          (df)=>{ return {value: df.fieldname, text: df.description } })
    }
  }
  
  const fieldRows = paginate(current.pagination)(fieldvalue_list)
  return (
    <div {...props} className={`${styles.formPanel} ${"border"} ${className}`} >
      {((audit !== 'readonly')||((fieldRows.amount) && (fieldRows.amount > 1)))?
      <div className="row full container-small section-small border-bottom" >
        {(audit !== 'readonly')?<div className="cell mobile">
          <div className="cell padding-small" >
            <Select id="sel_deffield"
              value={current.deffield||""} 
              onChange={(value)=>onEvent("changeCurrentData",["deffield", value])}
              placeholder="" options={deffields()} />
          </div>
          {(current.deffield && (current.deffield !== ""))?<div className="cell" >
            <Button id="btn_new"
              className={`${"border-button"} ${styles.addButton}`} 
              onClick={ ()=>onEvent("checkEditor",[{fieldname: current.deffield}, 'NEW_FIELDVALUE', undefined]) }
              value={<Label value={getText("label_new")} 
                leftIcon={<Icon iconKey="Plus" />} iconWidth="20px" />}
            />
          </div>:null}
        </div>:null}
        {((fieldRows.amount) && (fieldRows.amount > 1)) ?
        <div className={` ${styles.paginatorCell} ${"cell right mobile"}`} >
          <Paginator page={fieldRows.page+1} pages={fieldRows.amount} onSelect={onSelect} />
        </div>:null}
      </div>:null}
      {fieldRows.rows.map((fieldvalue, index) => <Row
        key={fieldvalue.id} row={fieldvalue} 
        values={fieldvalue} options={{}}
        data={{ audit: audit, current: current, dataset: dataset }}
        getText={getText} onEdit={editItem} onEvent={onEvent} onSelector={onSelector}
      />)}
    </div>
  )
}

Meta.propTypes = {
  current: PropTypes.object.isRequired,  
  dataset: PropTypes.object.isRequired, 
  audit: PropTypes.string.isRequired,
  className: PropTypes.string,
  onEvent: PropTypes.func,
  getText: PropTypes.func,
}

Meta.defaultProps = {
  current: {},  
  dataset: {}, 
  audit: "",
  className: "",
  onEvent: undefined,
  getText: undefined,
}

export default Meta;