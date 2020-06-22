import React, { useState, Fragment } from 'react';
import update from 'immutability-helper';
import * as sort from 'sortabular';
import { format, formatISO, isValid, parseISO } from 'date-fns'

import { CheckSquare, SquareEmpty } from 'components/Icons';
import { TableView } from "./Table";

export default (props) => {
  
  const { rowKey, rows, fields,
    dateFormat, timeFormat,
    labelYes, labelNo, labelAdd, addIcon, tableFilter, filterPlaceholder,
    paginationPage, paginationTop, paginatonScroll, 
    currentPage, onCurrentPage, tablePadding, onRowSelected, onEditCell, onAddItem } = props

  const [ state, setState ] = useState({
    rowKey: rowKey || "id",
    sortingColumns: {},
    pagination: {
      page: currentPage || 1,
      perPage: (paginationPage >= 0) ? paginationPage : 10
    },
    paginationTop: paginationTop,
    paginatonScroll: paginatonScroll,
    tablePadding: tablePadding,
    filter: "",
    tableFilter: tableFilter,
    filterPlaceholder: filterPlaceholder || "",
    onAddItem: onAddItem,
    labelAdd: labelAdd,
    addIcon: addIcon
  })

  state.rows = rows
  state.fields = fields

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

  state.rowFilter = () => {
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

  state.filterChange = ( value ) => {
    setState({ ...state, filter: value })
  }

  state.onRow = (row, { rowIndex }) => {
    return {
      className: (row.disabled) ? "cursor-disabled" : (onRowSelected) ? "cursor-pointer" : "",
      onClick: () => {
        if(onRowSelected){
          onRowSelected(row, rowIndex)
        }
      }
    };
  }

  state.onSelect = (page) => {
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
    if(state.paginatonScroll)
      window.scrollTo(0,0);
  }

  state.getColumns = () => {
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
          <span><CheckSquare /> {labelYes||""}</span>
        </Fragment>
      }
      else {
        return <Fragment>
          <span className="cell-label">{label}</span>
          <span><SquareEmpty /> {labelNo||""}</span>
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
        <span className="link-cell" 
          onClick={(onEditCell)?()=>onEditCell(fieldname, resultValue, rowData):null} >{value}</span>
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
                    styles.textDecornation = "line-through";
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
              coldef.header.props.style.textAlign = "left"
              coldef.cell.props.style.textAlign = "left"
              coldef.cell.formatters.push((value, { rowData }) => {
                return dateCell(value, fields[fieldname].label, fields[fieldname].fieldtype)
              });
              break;

            case "bool":
              coldef.header.props.style.textAlign = "center"
              coldef.cell.props.style.textAlign = "center"
              coldef.cell.formatters.push((value, { rowData }) => {
                return boolCell(value, fields[fieldname].label)
              });
              break;
            
            case "deffield":
              coldef.header.props.style.textAlign = "left"
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
              coldef.header.props.style.textAlign = "left"
              coldef.cell.props.style.textAlign = "left"
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

  return(
    <TableView {...state}  />
  )
}