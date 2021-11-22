import { registerLocale } from  "react-datepicker";
import * as dateLocales from 'date-fns/locale/';

import { version } from '../../package.json';
import * as locales from './locales';

const publicHost = "nervatura.github.io"
const basePath = "/api"

const calendarLocales = [
  ["bg", "bg"], ["cs", "cs"], ["da", "da"], ["de", "de"], ["el", "el"], 
  ["en", "en"], ["es", "es"], ["fi", "fi"], ["fr", "fr"], ["he", "he"], 
  ["hr", "hr"], ["hu", "hu"], ["id", "id"], ["is", "is"], ["it", "it"], 
  ["ja", "ja"], ["ko", "ko"], ["lt", "lt"], ["nb", "nb"], ["nl", "nl"], 
  ["nn", "nn"], ["pl", "pl"], ["pt", "pt"], ["ro", "ro"], ["ru", "ru"], 
  ["sk", "sk"], ["sv", "sv"], ["th", "th"], ["tr", "tr"], ["uz", "uz"], 
  ["vi", "vi"], ["zh", "zh"]
]
calendarLocales.forEach(loc => {
  registerLocale(loc[0], dateLocales[loc[0]])
});

// Default read and write application context data 
export const store = {
  session: {
    version: version,
    locales: locales,
    configServer: false,
    proxy: process.env.REACT_APP_PROXY||"",
    apiPath: "/api",
    engines: ["sqlite", "sqlite3", "mysql", "postgres", "mssql"],
    service: ["dev", "5.0.0-beta.10", "5.0.0-beta.11", "5.0.0-beta.12", "5.0.0-beta.13", "5.0.0-beta.14"],
    helpPage: "https://nervatura.github.io/nervatura/docs/"
  },
  ui: {
    toastTime: 7000,
    paginationPage: 10,
    selectorPage: 5,
    history: 5,
    calendar: "en",
    calendarLocales: calendarLocales,
    dateFormat: "yyyy-MM-dd",
    dateStyle: [
      ["yyyy-MM-dd","yyyy-MM-dd"], 
      ["dd-MM-yyyy","dd-MM-yyyy"], 
      ["MM-dd-yyyy","MM-dd-yyyy"]
    ],
    timeFormat: "HH:mm",
    timeIntervals: 15,
    searchSubtract: 3, //months
    filter_opt_1: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"]],
    filter_opt_2: [["===","EQUAL"],["==N","IS NULL"],["!==","NOT EQUAL"],[">==",">="],["<==","<="]],
    export_sep: ";",
    page_size: "a4",
    page_orient: "portrait",
    printqueue_mode: [
      ["print", "printqueue_mode_print"],
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
      { label: 'Bold', style: 'BOLD', icon: "Bold" }, 
      { label: 'Italic', style: 'ITALIC', icon: "Italic"  }, 
      { label: 'Underline', style: 'UNDERLINE', icon: "Underline" }
    ],
    rtf_block: [
      { label: 'UL', style: 'unordered-list-item', icon: "ListUl" }, 
      { label: 'OL', style: 'ordered-list-item', icon: "ListOl" }
    ]
  },
  current: { 
    home: "search", module: "login", side: "auto",
    clientWidth: 0,
    lang: (localStorage.getItem("lang") && locales[localStorage.getItem("lang")]) ? localStorage.getItem("lang") : "en",
    theme: localStorage.getItem("theme") || "light"
  },
  login: { 
    username: localStorage.getItem("username") || "",
    database: localStorage.getItem("database") || "",
    server: 
      (!localStorage.getItem("server") || (localStorage.getItem("server") === ""))
      ? (window.location.hostname !== publicHost) ? window.location.origin+basePath : ""
      : localStorage.getItem("server")
  },
  search: { group_key: "transitem", result: [], vkey: null, qview: "transitem", qfilter: "", 
    filters: {}, columns: {}, browser_filter: true },
  edit: { dataset: {}, current: {}, dirty: false, form_dirty: false, preview: null },
  setting: { dirty: false, result: [] }, 
  bookmark: { history: null, bookmark: [] }
}

export const getText = ({locales, lang, key, defaultValue}) => {
  let value = (defaultValue) ? defaultValue : key
  if(locales[lang] && locales[lang][key]){
    value = locales[lang][key]
  } else if(("en" !== lang) && locales["en"][key]) {
    value = locales["en"][key]
  }
  return value
}