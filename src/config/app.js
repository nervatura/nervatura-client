import { version } from '../../package.json';
import * as locales from './locales';
import theme from '../styles/theme.css';

const serverSide = true
const languages = [{ value: "en", text:"English" }]

// Default read and write application context data 
export const store = {
  session: {
    version: version,
    locales: locales,
    theme: theme,
    serverSide: serverSide,
    engines: ["sqlite", "sqlite3", "mysql", "postgres", "mssql"],
    languages: languages,
    proxy: process.env.REACT_APP_PROXY||"",
    basePath: "/api"
  },
  ui: {
    toastTime: 7000,
    paginationPage: 10,
    dateFormat: "yyyy-MM-dd",
    timeFormat: "HH:mm",
    timeIntervals: 15,
    searchSubtract: 3, //months
    filter_opt_1: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"]],
    filter_opt_2: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"],[">==",">="],["<==","<="]],
    export_sep: ";"
  },
  current: { 
    home: "search", module: "login", side: "auto",
    lang: localStorage.getItem("lang") || "en" 
  },
  login: { 
    username: localStorage.getItem("username") || "",
    database: localStorage.getItem("database") || ""  
  },
  search: { group_key: "transitem", result: [], vkey: null, qview: "transitem", qfilter: "", 
    filters: {}, columns: {}, browser_filter: true }, 
  edit: {}, setting: {}, bookmark: {}, preview: {}
}
