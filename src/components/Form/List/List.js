import { memo, useState } from 'react';
import PropTypes from 'prop-types';

import 'styles/style.css';
import styles from './List.module.css';

import { getSetting } from 'config/app'
import Paginator, { paginate } from 'components/Form/Paginator/Paginator';
import Icon from 'components/Form/Icon'
import Button from 'components/Form/Button'
import Label from 'components/Form/Label'
import Input from 'components/Form/Input'

export const ListView = ({
  rows, labelAdd, addIcon, editIcon, deleteIcon,
  listFilter, filterPlaceholder, filterValue,
  currentPage, paginationPage, paginationTop, paginatonScroll, 
  onEdit, onAddItem, onDelete, onCurrentPage,
  ...props 
}) => {
  const [ state, setState ] = useState({
    pagination: {
      page: currentPage,
      perPage: paginationPage
    },
    filter: filterValue,
  })

  const rowFilter = () => {
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
    if(paginatonScroll){
      window.scrollTo(0,0);
    }
    if(onCurrentPage){
      onCurrentPage(_page)
    }
  }

  const listRows = (state.pagination.perPage > 0) 
    ? paginate(state.pagination)(rowFilter()) : { amount: undefined, rows: rowFilter() }
  const showPaginator = ((typeof listRows.amount !== "undefined") && (listRows.amount > 1)) ? true : false
  return (
    <div {...props}>
      {(listFilter || (showPaginator && paginationTop))?<div className="padding-tiny">
        {(showPaginator && paginationTop) ?
          <Paginator page={listRows.page+1} pages={listRows.amount} onSelect={onSelect} />:null}
        {(listFilter) ? <div className="row full">
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
      <ul className={`${"list"} ${styles.list}`} >
        {listRows.rows.map((row, index) => <li 
          key={index}
          className={`${"border-bottom"} ${styles.listRow}`} >
          {(onEdit)?<div id={`row_edit_${index}`}
            className={`${styles.editCell}`} onClick={()=>onEdit(row)} >
            {editIcon}
          </div>:null}
          <div id={`row_item_${index}`}
            className={`${styles.valueCell} ${(onEdit)?styles.cursor:""}`} onClick={()=>onEdit(row)}>
            <div className={`${"border-bottom"} ${styles.label}`} >
              <span>{row.lslabel}</span>
            </div>
            <div className={`${styles.value}`} >
              <span>{row.lsvalue}</span>
            </div>
          </div>
          {(onDelete)?<div id={`row_delete_${index}`}
            className={`${styles.deleteCell}`} onClick={()=>onDelete(row)} >
            {deleteIcon}
          </div>:null}
        </li>)}
      </ul>
      {(showPaginator && !paginationTop) ? <div className="padding-tiny">
        <Paginator page={listRows.page+1} pages={listRows.amount} onSelect={onSelect} /></div>:null}
    </div>
  )
}

ListView.propTypes = {
  /**
   * List rows
   */
  rows: PropTypes.arrayOf(PropTypes.shape({
    lslabel: PropTypes.string.isRequired,
    lsvalue: PropTypes.string.isRequired,
  })).isRequired,
  /**
   * Current pagination page number
   */
  currentPage: PropTypes.number.isRequired,
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
   * Show/hide filter input 
   */ 
  listFilter: PropTypes.bool.isRequired,
  /**
   * Filter input placeholder 
   */ 
  filterPlaceholder: PropTypes.string,
  /**
   * Filter init value
   */
  filterValue: PropTypes.string,
  /**
   * Add button label
   */
  labelAdd: PropTypes.string.isRequired,
  /**
   * Icon element (svg)
   */   
  addIcon: PropTypes.any.isRequired,
  /**
   * Icon element (svg)
   */
  editIcon: PropTypes.any.isRequired,
  /**
   * Icon element (svg)
   */ 
  deleteIcon: PropTypes.any.isRequired,
  /**
   * List row click handle
   */
  onEdit: PropTypes.func,
  /**
   * Add new row handle
   */
  onAddItem: PropTypes.func,
  /**
   * Delete row handle 
   */ 
  onDelete: PropTypes.func,
  /**
   * Paginator select handle 
   */ 
  onCurrentPage: PropTypes.func,
}

ListView.defaultProps = {
  rows: [],
  currentPage: 1,
  paginationPage: getSetting("paginationPage"),
  paginationTop: true,
  paginatonScroll: false,
  listFilter: true,
  filterPlaceholder: undefined,
  filterValue: "",
  labelAdd: "",
  addIcon: <Icon iconKey="Plus" />,
  editIcon: <Icon iconKey="Edit" width={24} height={21.3} />,
  deleteIcon: <Icon iconKey="Times" width={19} height={27.6} />,
  onEdit: undefined,
  onAddItem: undefined,
  onDelete: undefined,
  onCurrentPage: undefined
}

export default memo(ListView, (prevProps, nextProps) => {
  return (
    (prevProps.rows === nextProps.rows) &&
    (prevProps.filter === nextProps.filter) &&
    (prevProps.pagination === nextProps.pagination)
  )
})