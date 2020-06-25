import { version } from '../../package.json';
import * as locales from './locales';
import theme from '../styles/theme.css';
import { ListOl, ListUl, Bold, Italic, Underline } from 'components/Icons';

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
    selectorPage: 5,
    dateFormat: "yyyy-MM-dd",
    timeFormat: "HH:mm",
    timeIntervals: 15,
    searchSubtract: 3, //months
    filter_opt_1: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"]],
    filter_opt_2: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"],[">==",">="],["<==","<="]],
    export_sep: ";",
    page_size: "a4",
    page_orient: "portrait",
    printqueue_mode: [
      ["preview", "printqueue_mode_preview"],
      ["pdf", "printqueue_mode_pdf"],
      ["xml", "printqueue_mode_xml"]
    ],
    printqueue_type: [
      ["customer", "title_customer"],
      ["product", "title_product"],
      ["employee", "title_employee"],
      ["tool", "title_tool"],
      ["project", "title_project"],
      ["order", "title_order"],
      ["offer", "title_offer"],
      ["invoice", "title_invoice"],
      ["receipt", "title_receipt"],
      ["rent", "title_rent"],
      ["worksheet", "title_worksheet"],
      ["delivery", "title_delivery"],
      ["inventory", "title_inventory"],
      ["waybill", "title_waybill"],
      ["production", "title_production"],
      ["formula", "title_formula"],
      ["bank", "title_bank"],
      ["cash", "title_cash"]
    ],
    report_orientation: [
      ["portrait", "report_portrait"],
      ["landscape", "report_landscape"]
    ],
    report_size: [
      ["a3", "A3"], ["a4", "A4"],
      ["a5", "A5"], ["letter", "Letter"],
      ["legal", "Legal"]
    ],
    rtf_inline: [
      { label: 'B', style: 'BOLD', icon: Bold }, 
      { label: 'I', style: 'ITALIC', icon: Italic  }, 
      { label: 'U', style: 'UNDERLINE', icon: Underline }
    ],
    rtf_block: [
      { label: 'UL', style: 'unordered-list-item', icon: ListUl }, 
      { label: 'OL', style: 'ordered-list-item', icon: ListOl }
    ]
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
  edit: { dataset: {}, current: {}, dirty: false, form_dirty: false, history: [], selector: {} },
  setting: {}, bookmark: {}, preview: {}
}
