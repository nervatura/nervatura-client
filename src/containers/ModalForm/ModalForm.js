import React from 'react';
import update from 'immutability-helper';

import styles from './ModalForm.module.css';
import { Label, Select, Input, FormRow } from 'containers/Controller'
import { Times, ChartBar, Magic, Check, Search as SearchIcon, CaretRight,
  ExclamationTriangle, Truck, Book, FileText, CheckSquare, SquareEmpty, 
  Star, History, Key, Share, Plus, InfoCircle } from 'components/Icons';
import Table from 'components/Table';
import List from 'components/List';

export const InputBox = (props) => {
  const { valueChange, valueKey, inputCancel, inputOK } = props
  const { title, message, infoText, value, labelCancel, labelOK, defaultOK, showValue } = props
  return (
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label value={title} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
         <div className="cell padding-normal">
          <div className={`${styles.input}`}>{message}</div>
          {(infoText)?<div className={`${"section-small-top"} ${styles.info}`}>{infoText}</div>:null}
          {(showValue)?<div className={`${"section-small-top"}`}>
            <input type="text" className="full" 
            value={value} autoFocus={true}
            onChange={ (event)=>valueChange("value", event.target.value) }
            onKeyDown={valueKey} /></div>:null}
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={inputCancel} >
              <Label center value={labelCancel} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              autoFocus={(showValue)?false:defaultOK}
              onClick={inputOK} >
              <Label center value={labelOK} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const SelectorView = (props) => {
  const { getText, quickSearch, editRow, onClose, filterChange } = props
  const { queries, filter } = props
  const { paginationPage, selectorPage } = props.ui
  const { qview, result } = props.data
  const query = queries.quick[qview]()
  let fields = {
    view: { columnDef: { property: "view",
      cell: { 
        props: {
          style: { width: 25, padding: "7px 2px 3px 8px" } 
        },
        formatters: [
        (value, { rowData }) => {
          if(rowData.deleted === 1)
            return <ExclamationTriangle className={styles.exclamation} />
          return <CaretRight width={9} height={24} />
        }] }
    }}
  }
  query.columns.forEach(field => {
    fields = update(fields, {$merge: {
      [field[0]]: {fieldtype:'string', label: getText(qview+"_"+field[0])}
    }})
  });
  return(
    <div className={`${"panel"} ${styles.width800}`} >
      <div className="panel-title primary">
        {(onClose)?<div className="row full">
          <div className="cell">
            <Label value={getText("search_"+qview)} leftIcon={<SearchIcon />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>:
        <Label bold primary xxxlarge 
          text="quick_search" value={": "+getText("search_"+qview)} />}
      </div>
      <div className="section" >
        <div className="row full container section-small-bottom" >
          <div className="cell" >
            {((typeof filter !== "undefined") && filterChange)?
              <Input type="text" className="full" placeholder="placeholder_search" autoFocus={true}
                value={filter} onEnter={quickSearch} onChange={filterChange} />:
              <Input type="text" className="full" placeholder="placeholder_search"
                keys={["search","qfilter"]} onEnter={quickSearch} />}
          </div>
          <div className={`${"cell"} ${styles.searchCol}`} >
            <button className={`${"full medium"}`} 
              onClick={()=>quickSearch()} >
              <Label text={"label_search"} leftIcon={<SearchIcon />} center />
            </button>
          </div>
        </div>
        {(result && (result.length > 0))?<div className="row full container section-small-bottom" >
          <Table fields={fields} rows={result}
            filterPlaceholder={getText("placeholder_search")} 
            paginationPage={(onClose)?selectorPage:paginationPage} paginationTop={true}
            onRowSelected={editRow} />
        </div>:null}
      </div>
    </div>
  )
}

export const ReportSettings = (props) => {
  const { onClose, valueChange, reportOutput } = props
  const { title, template, templates, orient, report_orientation, size, report_size, copy } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label value={title} leftIcon={<ChartBar />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="msg_template" />
            </div>
            <Select className="full" value={template}
              onChange={ (event)=>valueChange("template", event.target.value) }
              options={templates} />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="msg_report_prop" />
            </div>
            <Select value={orient}
              onChange={ (event)=>valueChange("orient", event.target.value) }
              options={report_orientation} />
            <Select value={size}
              onChange={ (event)=>valueChange("size", event.target.value) }
              options={report_size} />
            <Input className={`${styles.copyInput}`} itype="integer" value={copy} 
              onChange={(event)=>valueChange("copy", event.target.value)} />
          </div>
        </div> 
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} disabled={(template==="")?"disabled":""}
              onClick={()=>reportOutput("preview")} >
              <Label text="msg_preview" />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} disabled={(template==="")?"disabled":""}
              onClick={()=>reportOutput("pdf")} >
              <Label text="msg_export_pdf" />
            </button>
          </div>
        </div>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} onClick={()=>reportOutput("xml")} >
              <Label text="msg_export_xml" />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} disabled={(template==="")?"disabled":""}
              onClick={()=>reportOutput("printqueue")} >
              <Label text="msg_printqueue" />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const FormulaBox = (props) => {
  const { onClose, valueChange, calcFormula } = props
  const { formula, partnumber, description, formula_head } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="label_formula" leftIcon={<Magic />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="product_partnumber" />
            </div>
            <Input className="full" value={partnumber}
              disabled="disabled" />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <Input className="full" value={description}
              disabled="disabled" />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <Select className="full" value={formula} placeholder=""
              onChange={ (event)=>valueChange("formula", event.target.value) }
              options={formula_head} />
          </div>
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `} disabled={(formula==="")?"disabled":""}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} disabled={(formula==="")?"disabled":""}
              onClick={ ()=>calcFormula() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const ShippingBox = (props) => {
  const { onClose, valueChange, updateShipping } = props
  const { partnumber, description, unit, batch_no, qty } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="shipping_movement_product" leftIcon={<Truck />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="product_partnumber" />
            </div>
            <Input className="full" value={partnumber}
              disabled="disabled" />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="product_description" />
            </div>
            <Input className="full" value={description}
              disabled="disabled" />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="product_unit" />
            </div>
            <Input className="full" value={unit}
              disabled="disabled" />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="movement_batchnumber" />
            </div>
            <Input className="full" value={batch_no} autoFocus={true}
              onChange={ (event)=>valueChange("batch_no", event.target.value) } />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="movement_qty" />
            </div>
            <Input className="full align-right" value={qty} itype="float"
              onChange={ (event)=>valueChange("qty", event.target.value) } />
          </div>
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              onClick={ ()=>updateShipping() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const StockBox = (props) => {
  const { onClose, getText } = props
  const { partnumber, partname, rows, paginationPage } = props
  const fields = {
    warehouse: { fieldtype:"string", label:getText("delivery_place") },
    batch_no: { fieldtype:"string", label:getText("item_unit") },
    description: { fieldtype:"string", label:getText("movement_batchnumber") },
    sqty: { fieldtype:"number", label:getText("shipping_stock") }
  }
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="shipping_stocks" leftIcon={<Book />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" value={partnumber} />
            </div>
            <div>
              <Label value={partname} />
            </div>
          </div>
        </div>
        <div className="row full">
          <Table rowKey="id"
            fields={fields} rows={rows} tableFilter={true}
            filterPlaceholder={getText("placeholder_filter")} 
            paginationPage={paginationPage} paginationTop={true}/>
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small"}`} >
            <button className={`${"full primary"}`} onClick={onClose} >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const TransBox = (props) => {
  const { onClose, valueChange, createTrans } = props
  const { transtype, direction, doctypes, directions, refno, 
    netto_color, netto, from_color, from } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="msg_create_title" leftIcon={<FileText />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div>
              <Label className="bold" text="msg_create_new" />
            </div>
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell half padding-small"}`} >
            <Select className="full" value={transtype} 
              onChange={ (event)=>valueChange("transtype", event.target.value) }
              options={doctypes} />
          </div>
          <div className={`${"cell half padding-small"}`} >
            <Select className="full" value={direction} 
              onChange={ (event)=>valueChange("direction", event.target.value) }
              options={directions} />
          </div>
        </div>
        <div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div className={`${"padding-small"} ${styles.editCol}`} 
              onClick={() => valueChange("refno", !refno)}>
              <Label className="bold" text="msg_create_setref" 
                leftIcon={(refno)?<CheckSquare />:<SquareEmpty />} />
            </div>
          </div>
        </div>
        {(netto_color)?<div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div className={`${"padding-small"} ${styles.editCol}`} 
              onClick={() => valueChange("netto", !netto)}>
              <Label className="bold" text="msg_create_deduction" 
                leftIcon={(netto)?<CheckSquare />:<SquareEmpty />} />
            </div>
          </div>
        </div>:null}
        {(from_color)?<div className="row full">
          <div className={`${"cell padding-small"}`} >
            <div className={`${"padding-small"} ${styles.editCol}`} 
              onClick={() => valueChange("from", !from)}>
              <Label className="bold" text="msg_create_deduction" 
                leftIcon={(from)?<CheckSquare />:<SquareEmpty />} />
            </div>
          </div>
        </div>:null}
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`} 
              onClick={ ()=>createTrans() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const BookmarkBox = (props) => {
  const { getText, valueChange, selectRow, deleteRow, onClose } = props
  const { tabView, paginationPage, bookmarkList, historyList } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="title_bookmark" leftIcon={<Star />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="section" >
        <div className="row full container section-small-bottom" >
          <div className="cell half" >
            <button className={`${"full"} ${styles.tabButton} ${(tabView === "bookmark")?styles.selected:""} ${(tabView === "bookmark")?"primary":""}`} 
              onClick={()=>valueChange("tabView","bookmark")} >
              <Label text={"title_bookmark_list"} leftIcon={<Star />} />
            </button>
          </div>
          <div className={`${"cell half"}`} >
            <button className={`${"full"} ${styles.tabButton} ${(tabView === "history")?styles.selected:""} ${(tabView === "history")?"primary":""}`} 
              onClick={()=>valueChange("tabView","history")} >
              <Label text={"title_history"} leftIcon={<History />} />
            </button>
          </div>
        </div>
        <div className="row full container section-small-bottom" >
          <List 
            rows={(tabView === "bookmark")?bookmarkList:historyList} 
            editIcon={(tabView === "bookmark") ? Star : History}
            listFilter={true} filterPlaceholder={getText("placeholder_filter")}
            paginationPage={paginationPage} paginationTop={true} 
            onEdit={selectRow}  
            onDelete={(tabView === "bookmark") ? (row)=>deleteRow(row) : null} />
        </div>
      </div>
    </div>
  )
}

export const AuditBox = (props) => {
  const { onClose, valueChange, updateAudit, subtypeOptions } = props
  const { id, type_options, nervatype, subtype, nervatype_name,
    inputfilter, inputfilter_options, supervisor } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="title_usergroup" leftIcon={<Key />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="section-small">
        <div className="row full container-small section-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="audit_nervatype" />
              </div>
              <Select className="full" value={nervatype}
                disabled={(id)?"disabled":""}
                onChange={ (event)=>valueChange("nervatype", parseInt(event.target.value,10)) }
                options={type_options} />
            </div>
          </div>
        </div>
        {(["trans", "report","menu"].includes(nervatype_name))?
          <div className="row full container-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="audit_subtype" />
              </div>
              <Select className="full" value={subtype||""}
                onChange={ (event)=>valueChange("subtype", parseInt(event.target.value,10)) }
                options={subtypeOptions()} />
            </div>
          </div>
        </div>:null}
        <div className="row full container-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="audit_inputfilter" />
              </div>
              <Select className="full" value={inputfilter}
                onChange={ (event)=>valueChange("inputfilter", parseInt(event.target.value,10)) }
                options={inputfilter_options} />
            </div>
          </div>
        </div>
        <div className="row full container-small">
          <div className="row">
            <div className={`${"cell padding-small"}`} >
              <div className={`${"padding-small"} ${styles.reportField}`} 
                onClick={(event)=>valueChange("supervisor", (supervisor===1)?0:1)}>
                <Label className="bold" text="audit_supervisor" 
                  leftIcon={(supervisor===1)?<CheckSquare />:<SquareEmpty />} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              onClick={ ()=>updateAudit() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const MenuBox = (props) => {
  const { onClose, valueChange, updateMenu } = props
  const { fieldname, description, fieldtype, fieldtype_options, orderby } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="title_menucmd" leftIcon={<Share />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="section-small">
        <div className="row full container-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="menufields_fieldname" />
              </div>
              <Input className="full" value={fieldname}
                onChange={ (event)=>valueChange("fieldname", event.target.value) } />
            </div>
          </div>
        </div>
        <div className="row full container-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="menufields_description" />
              </div>
              <Input className="full" value={description}
                onChange={ (event)=>valueChange("description", event.target.value) } />
            </div>
          </div>
        </div>
        <div className="row full container-small">
          <div className="cell padding-small half">
            <div className="row full">
              <Label className="bold" text="menufields_fieldtype" />
            </div>
            <Select className="full" value={fieldtype}
              onChange={ (event)=>valueChange("fieldtype", parseInt(event.target.value,10)) }
              options={fieldtype_options} />
          </div>
          <div className="cell padding-small half">
            <div className="row full">
              <Label className="bold" text="menufields_orderby" />
            </div>
            <Input className="full align-right" value={orderby} itype="integer"
              onChange={ (event)=>valueChange("orderby", parseInt(event.target.value,10)) } />
          </div>
        </div>
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              onClick={ ()=>updateMenu() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const TemplateBox = (props) => {
  const { onClose, valueChange, updateData } = props
  const { name, type, type_options, columns } = props
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="template_label_new_data" leftIcon={<Plus />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="section-small">
        <div className="row full container-small">
          <div className="cell padding-small half">
            <div className="row full">
              <Label className="bold" text="template_data_type" />
            </div>
            <Select className="full" value={type} autoFocus={true}
              onChange={ (event)=>valueChange("type", event.target.value) }
              options={type_options} />
          </div>
          <div className="cell padding-small half">
            <div className="row full">
              <Label className="bold" text="template_data_name" />
            </div>
            <Input className="full" value={name} 
                onChange={ (event)=>valueChange("name", event.target.value) } />
          </div>
        </div>
        {(type === "table")?<div className="row full container-small">
          <div className="row full">
            <div className={`${"cell padding-small"}`} >
              <div>
                <Label className="bold" text="template_data_columns" />
              </div>
              <textarea className="full" value={columns} rows={3}
                onChange={ (event)=>valueChange("columns", event.target.value) } />
            </div>
          </div>
        </div>:null}
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              onClick={ ()=>updateData() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const TotalBox = (props) => {
  const { onClose } = props
  const { total } = props
  const formatNumber = (number) => {
    return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label text="browser_total" leftIcon={<InfoCircle />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      <div className="row full container-small section-small">
        {Object.keys(total.totalFields).map(fieldname => 
          <div key={fieldname} className="row full">
            <div className="cell bold padding-tiny half">
              <Label className="bold" value={total.totalLabels[fieldname]} />
            </div>
            <div className="cell padding-tiny half">
              <Input className="full align-right bold" 
                value={formatNumber(total.totalFields[fieldname])} 
                disabled="disabled" />
            </div>
          </div>)}
      </div>
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small"}`} >
            <button className={`${"full primary"}`} onClick={onClose} >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}

export const ServerBox = (props) => {
  const { onClose, valueChange, sendServerCmd } = props
  const { cmd, fields, values } = props.params
  return(
    <div className={`${"panel"}`} >
      <div className="panel-title primary">
        <div className="row full">
          <div className="cell">
            <Label value={cmd.description} leftIcon={<Share />} col={20} />
          </div>
          <div className={`${"cell align-right"} ${styles.closeIcon}`}>
            <Times onClick={onClose} />
          </div>
        </div>
      </div>
      {fields.map((field, index) =>
        <FormRow key={index}
          row={{
            rowtype: "field", 
            name: field.fieldname,
            datatype: field.fieldtypeName,
            label: field.description }} 
          values={values}
          rowdata={{
            audit: "all",
            current: {},
            dataset: {},
            onEdit: (options)=>valueChange(options.name, options.value)
          }} 
        />
      )}
      <div className={`${"row full section container-small secondary-title"}`}>
        <div className={`${"row full"}`}>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full"} ${styles.closeIcon} `}
              onClick={ ()=>onClose() } >
              <Label center text={"msg_cancel"} leftIcon={<Times />} col={20}  />
            </button>
          </div>
          <div className={`${"cell padding-small half"}`} >
            <button className={`${"full primary"}`}
              onClick={ ()=>sendServerCmd() } >
              <Label center text={"msg_ok"} leftIcon={<Check />} col={20}  />
            </button>
          </div>
        </div>
      </div> 
    </div>
  )
}