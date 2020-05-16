import React, { useState, Fragment } from 'react';
import update from 'immutability-helper';
import * as sort from 'sortabular';
import { format, formatISO, isValid, parseISO } from 'date-fns'

//import { TableCellValue, TableCellLabel } from 'components/Controls';
import { CheckSquare, Square } from 'components/Icons';
import { TableView } from "./Table";

export default (props) => {
  
  const { rowKey, rows, fields,
    dateFormat, timeFormat,
    labelYes, labelNo, tableFilter, filterPlaceholder,
    paginationPage, paginationTop, paginatonScroll, 
    currentPage, onCurrentPage, tablePadding, onRowSelected } = props

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
    filterPlaceholder: filterPlaceholder || ""
  })

  state.rows = rows

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
    if(fields){
      Object.keys(fields).forEach((fieldname) => {
        if(fields[fieldname].columnDef){
          cols = update(cols, {$push: [fields[fieldname].columnDef]});
        } else {
          const coldef = {
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
                return <Fragment>
                  <span className="cell-label number">{fields[fieldname].label}</span>
                  <span style={styles}>{value}</span>
                </Fragment>
              });
              break;

            case "datetime":
            case "date":
            case "time":
              coldef.header.props.style.textAlign = "left"
              coldef.cell.props.style.textAlign = "left"
              coldef.cell.formatters.push((value, { rowData }) => {
                let fmtValue = ""
                const dateValue = parseISO(value)
                if (isValid(dateValue)) {
                  switch (fields[fieldname].fieldtype) {
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
                  <span className="cell-label">{fields[fieldname].label}</span>
                  <span>{fmtValue}</span>
                </Fragment>
              });
              break;

            case "bool":
              coldef.header.props.style.textAlign = "center"
              coldef.cell.props.style.textAlign = "center"
              coldef.cell.formatters.push((value, { rowData }) => {
                if((value === 1) || (value === "true") || (value === true)){
                  return <Fragment>
                    <span className="cell-label">{fields[fieldname].label}</span>
                    <span><CheckSquare /> {labelYes||""}</span>
                  </Fragment>
                }
                else {
                  return <Fragment>
                    <span className="cell-label">{fields[fieldname].label}</span>
                    <span><Square /> {labelNo||""}</span>
                  </Fragment>
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
                return <Fragment>
                  <span className="cell-label">{fields[fieldname].label}</span>
                  <span style={styles} >{value}</span>
                </Fragment>
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