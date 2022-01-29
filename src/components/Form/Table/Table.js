import { memo, useState, Fragment } from 'react';
import update from 'immutability-helper';
import PropTypes from 'prop-types';
import * as Table from 'reactabular-table';
import * as sort from 'sortabular';
import orderBy from 'lodash/orderBy';
import { format, formatISO, isValid, parseISO } from 'date-fns'

import Paginator, { paginate } from 'components/Form/Paginator/Paginator';
import Icon from 'components/Form/Icon'
import Button from 'components/Form/Button'
import Label from 'components/Form/Label'
import Input from 'components/Form/Input'
import { getSetting } from 'config/app'

import './Table.css';

export const TableView = ({
  rowKey, rows, fields,
  dateFormat, timeFormat, className,
  labelYes, labelNo, labelAdd, addIcon, tableFilter, filterPlaceholder, filterValue,
  paginationPage, paginationTop, paginatonScroll, 
  currentPage, onCurrentPage, tablePadding, onRowSelected, onEditCell, onAddItem,
  ...props 
}) => {
  const [ state, setState ] = useState({
    sortingColumns: {},
    pagination: {
      page: currentPage,
      perPage: paginationPage
    },
    filter: filterValue
  })

  const pagination = (onCurrentPage) ? { page: currentPage, perPage: paginationPage } : state.pagination
  const getSortingColumns = () => state.sortingColumns;
  const sortable = sort.sort({
    getSortingColumns,
    onSort: selectedColumn => {
      setState({
        ...state,
        sortingColumns: sort.byColumn({
          sortingColumns: state.sortingColumns,
          selectedColumn
        })
      });
    }
  });

  const rowFilter = () => {
    const getValidRow = (row, filter)=>{
      let find = false;
      Object.keys(fields).forEach((fieldname) => {
        if(String(row[fieldname]).toLowerCase().indexOf(filter)>-1){
          find = true;
        }
      });
      return find;
    }
    if(state.filter !== ""){
      let _rows = []; let _filter = String(state.filter).toLowerCase()
      rows.forEach(function(frow) {
        if(getValidRow(frow,_filter)){
          _rows.push(frow);
        }
      });
      return _rows;
    } else {
      return rows
    }
  }

  const onRow = (row, { rowIndex }) => {
    return {
      className: (row.disabled) ? "cursor-disabled" : (onRowSelected) ? "cursor-pointer" : "",
      onClick: () => {
        if(onRowSelected){
          onRowSelected(row, rowIndex)
        }
      }
    };
  }

  const onSelect = (page) => {
    const pages = Math.ceil(
      rows.length / state.pagination.perPage
    );
    const _page = Math.min(Math.max(page, 1), pages)
    setState({
      ...state,
      pagination: Object.assign({}, state.pagination, {
        page: _page
      })
    });
    if(onCurrentPage){
      onCurrentPage(_page)
    }
    if(paginatonScroll)
      window.scrollTo(0,0);
  }

  const getColumns = () => {
    let cols = []
    const numberCell = (value, label, styles) => {
      return <div className="number-cell">
        <span className="cell-label">{label}</span>
        <span style={styles}>{value}</span>
      </div>
    }
    const boolCell = (value, label) => {
      if((value === 1) || (value === "true") || (value === true)){
        return <Fragment>
          <span className="cell-label">{label}</span>
          <span><Icon iconKey="CheckSquare" /> {labelYes}</span>
        </Fragment>
      }
      else {
        return <Fragment>
          <span className="cell-label">{label}</span>
          <span><Icon iconKey="SquareEmpty" /> {labelNo}</span>
        </Fragment>
      }
    }
    const dateCell = (value, label, dateType) => {
      let fmtValue = ""
      const dateValue = parseISO(value)
      if (isValid(dateValue)) {
        switch (dateType) {
          case "date":
            if(dateFormat){
              fmtValue = format(dateValue, dateFormat)
            } else {
              fmtValue = formatISO(dateValue, { representation: 'date' })
            }   
            break;
          
          case "time":
            if(timeFormat){
              fmtValue = format(dateValue, timeFormat)
            } else {
              fmtValue = formatISO(dateValue, { representation: 'time' })
            }   
            break;
        
          default:
          if(dateFormat && timeFormat){
              fmtValue = format(dateValue, dateFormat+" "+timeFormat)
            } else {
              fmtValue = formatISO(dateValue)
            } 
            break;
        }
      }
      return <Fragment>
        <span className="cell-label">{label}</span>
        <span>{fmtValue}</span>
      </Fragment>
    }
    const stringCell = (value, label, styles) => {
      return <Fragment>
        <span className="cell-label">{label}</span>
        <span style={styles} >{value}</span>
      </Fragment>
    }
    const linkCell = (value, label, fieldname, resultValue, rowData) => {
      return <Fragment>
        <span className="cell-label">{label}</span>
        <span id={"link_"+rowData[rowKey]} className="link-cell" 
          onClick={(onEditCell)?(event)=>{
            event.stopPropagation();
            onEditCell(fieldname, resultValue, rowData);
          }:null} >{value}</span>
      </Fragment>
    }
    if(fields){
      Object.keys(fields).forEach((fieldname) => {
        if(fields[fieldname].columnDef){
          cols = update(cols, {$push: [fields[fieldname].columnDef]});
        } else {
          let coldef = {
            property: fieldname,
            header: {
              props: {
                style: {}
              },
              label: fields[fieldname].label || "",
              transforms: [sortable],
            },
            cell: {
              props: {
                style: {}
              },
              formatters: []
            },
          }
          switch (fields[fieldname].fieldtype) {
            case "number":
              coldef.header.props.style.textAlign = "right"
              coldef.cell.formatters.push((value, { rowData }) => {
                let styles = {}
                if(fields[fieldname].format){
                  styles.fontWeight = "bold";
                  if(rowData.edited){
                    styles.textDecoration = "line-through";
                  } else if(value !== 0){
                    styles.color = "red"
                  } else {
                    styles.color = "green"
                  }
                }
                return numberCell(value, fields[fieldname].label, styles)
              });
              break;

            case "datetime":
            case "date":
            case "time":
              coldef.cell.formatters.push((value, { rowData }) => {
                return dateCell(value, fields[fieldname].label, fields[fieldname].fieldtype)
              });
              break;

            case "bool":
              coldef.cell.formatters.push((value, { rowData }) => {
                return boolCell(value, fields[fieldname].label)
              });
              break;
            
            case "deffield":
              coldef.cell.formatters.push((value, { rowData }) => {
                switch (rowData.fieldtype) {
                  case "bool":
                    return boolCell(value, fields[fieldname].label)

                  case "integer":
                  case "float":
                    return numberCell(value, fields[fieldname].label, {})

                  case "customer":
                  case "tool":
                  case "product":
                  case "trans": 
                  case "transitem":
                  case "transmovement": 
                  case "transpayment":
                  case "project":
                  case "employee":
                  case "place":
                  case "urlink":
                    return linkCell(rowData["export_deffield_value"], fields[fieldname].label, rowData.fieldtype, rowData[fieldname], rowData)

                  default:
                    return stringCell(value, fields[fieldname].label, {})
                }
              });
              break;

            default:
              coldef.cell.formatters.push((value, { rowData }) => {
                let styles = {}
                if(rowData[fieldname+"_color"]){
                  styles.color = rowData[fieldname+"_color"]
                }
                if(Object.keys(rowData).includes("export_"+fieldname)){
                  return linkCell(rowData["export_"+fieldname], fields[fieldname].label, fieldname, rowData[fieldname], rowData)
                }
                return stringCell(value, fields[fieldname].label, styles)
              })
          }
          if(tablePadding){
            coldef.header.props.style.padding = tablePadding
            coldef.cell.props.style.padding = tablePadding
          }
          if(fields[fieldname].verticalAlign) {
            coldef.cell.props.style.verticalAlign = fields[fieldname].verticalAlign
          }
          if(fields[fieldname].textAlign) {
            coldef.cell.props.style.verticalAlign = fields[fieldname].textAlign
          }
          cols = update(cols, {$push: [coldef]});
        }
      })
    }
    return cols
  }

  const columns = getColumns()
  const tableRows = (pagination.perPage > 0) ? 
    paginate(pagination)(
      sort.sorter({ columns: columns, sortingColumns: state.sortingColumns, sort: orderBy })(rowFilter())) :
    sort.sorter({ columns: columns, sortingColumns: state.sortingColumns, sort: orderBy })(rowFilter())
  const showPaginator = ((typeof tableRows.amount !== "undefined") && (tableRows.amount > 1)) ? true : false
  return(
    <div {...props} className={` ${"ui-table"} ${className}`} >
      {(tableFilter || (showPaginator && paginationTop))?<div className="padding-tiny">
        {(showPaginator && paginationTop) ?
          <Paginator page={tableRows.page+1} pages={tableRows.amount} onSelect={onSelect} />:null}
        {(tableFilter) ? <div className="row full">
          <div className="cell" >
            <Input id="filter" type="text" className="full"
              placeholder={filterPlaceholder} value={state.filter}
              onChange={(value) => setState({ ...state, filter: value })} />
          </div>
          {(onAddItem)?<div className="cell" style={{width:20}} >
            <Button id="btn_add" 
              className={`${"border-button"} ${"addButton"}`}
              value={<Label className="addLabel" 
                leftIcon={addIcon} value={labelAdd} />} 
              onClick={(event)=>onAddItem(event)} />
          </div>:null}
        </div>: null}
      </div>:null}
      <Table.Provider columns={columns} >
        <Table.Header />
        <Table.Body rows={tableRows.rows || tableRows} rowKey={rowKey} 
          onRow={onRow} />
      </Table.Provider>
      {(showPaginator && !paginationTop) ? <div className="padding-tiny">
        <Paginator page={tableRows.page+1} pages={tableRows.amount} onSelect={onSelect} /></div>:null}
    </div>
  )
}

TableView.propTypes = {
  /**
   * Table row unique identifier
   */
  rowKey: PropTypes.string.isRequired,
  /**
   * Table data rows
   */
  rows: PropTypes.array.isRequired,
  /**
   * Table columns def.
   */
  fields: PropTypes.object,
  /**
   * Locale date format
   */
  dateFormat: PropTypes.string,
  /**
   * Locale time format 
   */ 
  timeFormat: PropTypes.string,
  /**
   * Table header/cell padding value
   */
  tablePadding: PropTypes.number,
  labelYes: PropTypes.string.isRequired,
  labelNo: PropTypes.string.isRequired,
  /**
   * Add button label
   */
  labelAdd: PropTypes.string.isRequired, 
  /**
   * Icon element (svg)
   */   
  addIcon: PropTypes.any.isRequired,
  /**
   * Show/hide filter input 
   */
  tableFilter: PropTypes.bool.isRequired, 
  /**
   * Filter input placeholder 
   */ 
  filterPlaceholder: PropTypes.string, 
  /**
   * Filter init value
   */
  filterValue: PropTypes.string,
  /**
   * Pagination row number / page
   */
  paginationPage: PropTypes.number.isRequired, 
  /**
   * at the top or bottom of the list
   */
  paginationTop: PropTypes.bool.isRequired, 
  /**
   * Scroll to top after pagination change
   */
  paginatonScroll: PropTypes.bool.isRequired,
  /**
   * Current pagination page number
   */
  currentPage: PropTypes.number.isRequired,
  /**
   * Paginator select handle 
   */ 
  onCurrentPage: PropTypes.func,
  /**
   * List row click handle
   */ 
  onRowSelected: PropTypes.func,
  /**
   * Table cell click handle
   */
  onEditCell: PropTypes.func,
  /**
   * Add new row handle
   */
  onAddItem: PropTypes.func,
}

TableView.defaultProps = {
  rowKey: "id",
  rows: [],
  fields: undefined,
  dateFormat: getSetting("dateFormat"),
  timeFormat: getSetting("timeFormat"),
  labelYes: "YES",
  labelNo: "NO",
  labelAdd: "",
  addIcon: <Icon iconKey="Plus" />,
  tableFilter: false,
  filterPlaceholder: undefined,
  filterValue: "",
  paginationPage: 10,
  currentPage: 1,
  paginationTop: true,
  paginatonScroll: false,
  tablePadding: undefined,
  onRowSelected: undefined,
  onEditCell: undefined,
  onAddItem: undefined
}

export default memo(TableView, (prevProps, nextProps) => {
  return (
    (prevProps.rows === nextProps.rows) &&
    (prevProps.sortingColumns === nextProps.sortingColumns) &&
    (prevProps.filter === nextProps.filter) &&
    (prevProps.pagination === nextProps.pagination) &&
    (prevProps.fields === nextProps.fields)
  )
})