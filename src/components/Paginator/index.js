export { default } from './Paginator';

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