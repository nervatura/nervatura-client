import React, { useState } from 'react';

import { ListView } from "./List";

export default (props) => {
  const { rows, labelAdd, addIcon, editIcon, deleteIcon,
    listFilter, filterPlaceholder,
    currentPage, paginationPage, paginationTop, paginatonScroll, 
    onEdit, onAddItem, onDelete } = props

  const [ state, setState ] = useState({
    pagination: {
      page: currentPage || 1,
      perPage: (paginationPage >= 0) ? paginationPage : 10
    },
    paginationTop: paginationTop,
    paginatonScroll: paginatonScroll,
    filter: "",
    listFilter: listFilter,
    filterPlaceholder: filterPlaceholder || "",
    onEdit: onEdit,
    onDelete: onDelete,
    onAddItem: onAddItem,
    labelAdd: labelAdd,
    editIcon: editIcon, 
    deleteIcon: deleteIcon,
    addIcon: addIcon
  })

  state.rows = rows

  state.rowFilter = () => {
    const getValidRow = (row, filter)=>{
      if(String(row.lslabel).toLowerCase().indexOf(filter)>-1 || 
        String(row.lsvalue).toLowerCase().indexOf(filter)>-1){
          return true
      } else {
        return false
      }
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
    if(state.paginatonScroll)
      window.scrollTo(0,0);
  }
  
  return(
    <ListView {...state}  />
  )
}