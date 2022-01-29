import PropTypes from 'prop-types';

import Pagify from 'react-pagify';
import segmentize from 'segmentize';

import 'styles/style.css';

import 'react-pagify/style.css';
import './Paginator.css';

export const Paginator = ({
  page, pages, className, onSelect,
  ...props 
}) => {
  return(
    <div id="pagination" {...props} 
      className={`${"pagination"} ${className}`} >
      <Pagify.Context
        className="pagify-pagination"
        segments={segmentize({
          page: page,
          pages,
          beginPages: 3,
          endPages: 3,
          sidePages: 2
        })} onSelect={onSelect}
      >
        <Pagify.Button  page={page - 1}>&#10094;</Pagify.Button>

        <Pagify.Segment field="beginPages" />

        <Pagify.Ellipsis
          className="ellipsis"
          previousField="beginPages"
          nextField="previousPages"
        />

        <Pagify.Segment field="previousPages" />
        <Pagify.Segment field="centerPage" className="selected" />
        <Pagify.Segment field="nextPages" />

        <Pagify.Ellipsis
          className="ellipsis"
          previousField="nextPages"
          nextField="endPages"
        />

        <Pagify.Segment field="endPages" />

        <Pagify.Button page={page + 1}>&#10095;</Pagify.Button>
      </Pagify.Context>
    </div>
  )
}

Paginator.propTypes = {
  page: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  className: PropTypes.string.isRequired,
  onSelect: PropTypes.func
}

Paginator.defaultProps = {
  page: 1,
  pages: 10,
  className: "",
  onSelect: undefined
}

export const paginate = ({ page, perPage }) => {
  return (rows) => {
    // adapt to zero indexed logic
    const p = page - 1 || 0;
    
    const amountOfPages = Math.ceil(rows.length / Math.max(perPage, 1));
    const startPage = p < amountOfPages ? p : 0;

    return {
      amount: amountOfPages,
      rows: rows.slice(startPage * perPage, (startPage * perPage) + perPage),
      page: startPage
    };
  };
}

export default Paginator;