import { Fragment } from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import styles from './View.module.css';

import { getSetting, formatNumber } from 'config/app'
import Table from 'components/Form/Table';
import List from 'components/Form/List';
import Icon from 'components/Form/Icon'

export const View = ({ 
  viewName, current, template, dataset, audit, className,
  paginationPage, dateFormat, timeFormat,
  getText, onEvent,
  ...props 
}) => {
  const vtemplate = template.view[viewName];
  const rows = dataset[vtemplate.data] || [];
  const edited = (typeof vtemplate.edited !== "undefined") ? vtemplate.edited : true;
  let actions = vtemplate.actions;
  if (typeof actions === "undefined") {
    actions = {
      new: {action: "newEditorItem", fkey: viewName}, 
      edit: {action: "editEditorItem", fkey: viewName}, 
      delete: {action: "deleteEditorItem", fkey: viewName}
    }
  }
  if (audit !== "all") {
    actions = update(actions, {$merge: {
      new: null,
      delete: null
    }})
  }

  const onAction = (action, row) => {
    if(edited && action){
      onEvent("setFormActions",[{ params: action, row: row }])
    }
  }
  
  const editIcon = (typeof vtemplate.edit_icon !== "undefined") ? 
    [vtemplate.edit_icon, undefined, undefined] : ["Edit", 24, 21.3]
  const deleteIcon = (typeof vtemplate.delete_icon !== "undefined") ? 
    [vtemplate.delete_icon, undefined, undefined] : ["Times", 19, 27.6]
  const addIcon = (typeof vtemplate.new_icon !== "undefined") ? 
    vtemplate.new_icon : "Plus"
  const labelAdd = (typeof vtemplate.new_label !== "undefined") ? 
    vtemplate.new_label : getText("label_new")

  let fields = {}
  if(vtemplate.type === "table"){
    if(edited && (actions.edit || actions.delete)){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              const ecol = (actions.edit !== null)?<div 
                className={`${"cell"} ${styles.editCol}`} >
                {<Icon id={"edit_"+rowData["id"]}
                  iconKey={editIcon[0]} width={editIcon[1]} height={editIcon[2]} 
                  onClick={ () => onAction(actions.edit, rowData) }
                  className={styles.editCol} />}
              </div>:null
              const dcol = (actions.delete !== null)?<div 
                className={`${"cell"} ${styles.deleteCol}`} >
                {<Icon id={"delete_"+rowData["id"]}
                  iconKey={deleteIcon[0]} width={deleteIcon[1]} height={deleteIcon[2]} 
                  onClick={ () => onAction(actions.delete, rowData) }
                  className={styles.deleteCol} />}
              </div>:null
              return <Fragment>{ecol}{dcol}</Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...vtemplate.fields}})
  }
  return (
    <div {...props} className={`${styles.viewPanel} ${className}`} >
      {(vtemplate.total)?<div className="row full border">
        <div className="cell l4 m4 s12 padding-normal align-right">
          <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[0]]+":"}</span>
          <span className={`${styles.totalValue} ${"border"} `}>
            {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[0]],
              dataset[current.type][0].digit)}
          </span>
        </div>
        <div className="cell l4 m4 s12 padding-normal align-right">
          <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[1]]+":"}</span>
          <span className={`${styles.totalValue} ${"border"}`}>
            {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[1]],
              dataset[current.type][0].digit)}
          </span>
        </div>
        <div className="cell l4 m4 s12 padding-normal align-right">
          <span className={`${styles.totalLabel}`}>{vtemplate.total[Object.keys(vtemplate.total)[2]]+":"}</span>
          <span className={`${styles.totalValue} ${"border"}`}>
            {formatNumber(dataset[current.type][0][Object.keys(vtemplate.total)[2]],
              dataset[current.type][0].digit)}
          </span>
        </div>
      </div>:null}
      <div className="row full" >
        {(vtemplate.type === "table")?
        <Table rowKey="id"
          onAddItem={ () => onAction(actions.new) }
          fields={fields} rows={rows} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          labelYes={getText("label_yes")} labelNo={getText("label_no")} 
          labelAdd={labelAdd}
          addIcon={<Icon iconKey={addIcon} />}
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>
        :<List 
          rows={rows} labelAdd={labelAdd} 
          addIcon={<Icon iconKey={addIcon} />} 
          editIcon={<Icon iconKey={editIcon[0]} width={editIcon[1]} height={editIcon[2]} />} 
          deleteIcon={<Icon iconKey={deleteIcon[0]} width={deleteIcon[1]} height={deleteIcon[2]} />}
          listFilter={true} filterPlaceholder={getText("placeholder_filter")}
          paginationPage={paginationPage} paginationTop={true} 
          onEdit={ (row) => onAction(actions.edit, row) } 
          onAddItem={ () => onAction(actions.new) } 
          onDelete={ (row) => onAction(actions.delete, row) } />}
      </div>
    </div>
  )
}

View.propTypes = {
  viewName: PropTypes.string.isRequired,
  current: PropTypes.object.isRequired, 
  template: PropTypes.object.isRequired, 
  dataset: PropTypes.object.isRequired, 
  audit: PropTypes.string.isRequired,
  paginationPage: PropTypes.number.isRequired, 
  dateFormat: PropTypes.string, 
  timeFormat: PropTypes.string,
  className: PropTypes.string,
  onEvent: PropTypes.func,
  getText: PropTypes.func,
}

View.defaultProps = {
  viewName: "",
  current: {}, 
  template: {}, 
  dataset: {}, 
  audit: "",
  paginationPage: getSetting("paginationPage"),
  dateFormat: getSetting("dateFormat"),
  timeFormat: getSetting("timeFormat"),
  className: "",
  onEvent: undefined,
  getText: undefined,
}

export default View;