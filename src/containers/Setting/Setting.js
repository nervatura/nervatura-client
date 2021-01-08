import React, { memo, createElement, Fragment } from 'react';
import update from 'immutability-helper';

import styles from './Setting.module.css';
import { Label, FormRow, Select } from 'containers/Controller'
import { Edit, Times, Tags, Database, Tag, Check, InfoCircle, Plus, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown } from 'components/Icons';
import Table from 'components/Table';
import List from 'components/List';

export const SettingView = memo((props) => {
  const { getText, setViewActions } = props
  const { view, actions } = props.data
  const { paginationPage, dateFormat, timeFormat } = props.ui
  
  let fields = {}
  if(view.type === "table"){
    if(actions.edit){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              return <Fragment>
                <div className={`${"cell"} ${styles.editCol}`} >{createElement(
                  Edit, { width:24, height:21.3, 
                  onClick: ()=>setViewActions(actions.edit, rowData),
                  className: styles.editCol})}
                </div>
              </Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...view.fields}})
  }
  return (
    <div className={`${styles.viewPanel}`} >
      <div className="row full" >
        {(view.type === "table")?
        <Table rowKey="id"
          fields={fields} rows={view.result} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          onAddItem={(actions.new !== null) ? ()=>setViewActions(actions.new) : null}
          onRowSelected={(actions.edit !== null) ? (row)=>setViewActions(actions.edit, row) : null}
          labelAdd={getText("label_new")} labelYes={getText("label_yes")} labelNo={getText("label_no")} 
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>
        :<List rows={view.result}
          listFilter={true} filterPlaceholder={getText("placeholder_filter")}
          onAddItem={(actions.new !== null) ? ()=>setViewActions(actions.new) : null}
          labelAdd={getText("label_new")}
          paginationPage={paginationPage} paginationTop={true} 
          onEdit={(actions.edit !== null) ? (row)=>setViewActions(actions.edit, row) : null} 
          onDelete={(actions.delete !== null) ? (row)=>setViewActions(actions.delete, row) : null} />}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const SettingForm = memo((props) => {
  const { editItem, setViewActions, getText } = props
  const { current, audit, dataset, type, view } = props.data
  const { paginationPage, dateFormat, timeFormat } = props.ui
  let fields = {}
  if((typeof current.template.view.items !== "undefined") && (current.form.id !== null)){
    if(current.template.view.items.actions.edit){
      fields = update(fields, {$merge: {
        edit: { columnDef: { property: "edit",
          cell: { 
            props: {
              style: { width: 30, padding: "7px 3px 3px 8px" } 
            },
            formatters: [
            (value, { rowData }) => {
              const ecol = (current.template.view.items.actions.edit !== null)?<div 
                className={`${"cell"} ${styles.editCol}`} >
                {createElement(Edit, { width:24, height:21.3, 
                  onClick: ()=>setViewActions(current.template.view.items.actions.edit, rowData),
                  className: styles.editCol})}
              </div>:null
              const dcol = (current.template.view.items.actions.delete !== null)?<div 
                className={`${"cell"} ${styles.deleteCol}`} >
                {createElement(Times, { width:19, height:27.6, 
                  onClick: ()=>setViewActions(current.template.view.items.actions.delete, rowData),
                  className: styles.deleteCol})}
              </div>:null
              return <Fragment>{ecol}{dcol}</Fragment>
            }] }
        }}
      }})
    }
    fields = update(fields, {$merge: {...current.template.view.items.fields}})
  }
  return (
    <Fragment >
      <div className={`${"border"} ${styles.formPanel}`} >
        {current.template.rows.map((row, index) =>
          <FormRow key={index} row={row} 
            values={current.fieldvalue || current.form}
            rowdata={{
              audit: audit,
              current: current,
              dataset: dataset,
              onEdit: editItem
            }} 
          />
        )}
      </div>
      {((typeof current.template.view.items !== "undefined") && (current.form.id !== null))?
        <Table rowKey="id"
          onAddItem={(current.template.view.items.actions.new !== null) 
            ? ()=>setViewActions(current.template.view.items.actions.new) : null}
          labelAdd={getText("label_new")}
          fields={fields} 
          rows={dataset[current.template.view.items.data]} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          labelYes={getText("label_yes")} labelNo={getText("label_no")}
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>:null}
      {(type === "log")?
        <Table rowKey="id"
          fields={view.fields} 
          rows={view.result} tableFilter={true}
          filterPlaceholder={getText("placeholder_filter")}
          labelYes={getText("label_yes")} labelNo={getText("label_no")}
          dateFormat={dateFormat} timeFormat={timeFormat} 
          paginationPage={paginationPage} paginationTop={true}/>:null}
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const TemplateEditor = memo((props) => {
  const { changeTemplateData, changeCurrentData, getMapCtr, setCurrent, getElementType, 
    mapPrevious, mapNext, moveUp, moveDown, deleteItem, addItem, editTemplate,
    getText, addTemplateData, setCurrentData, deleteData, editDataItem, setCurrentDataItem, deleteDataItem } = props
  const { mapRef } =props
  const { paginationPage } = props.ui
  const { tabView, template, current, current_data, dataset } = props.data.template
  
  const getBadge = (items, index) => {
    if (typeof index!=="undefined") {
      return index
    }
    if ((typeof items==="object") && (Array.isArray(items)) && (items.length>0)) {
      return items.length
    }
    return 0
  }

  const setListIcon = (item, index) => {
    if (current.item===item) {
      return {
        selected: true, icon: Tag, color: "green", 
        badge: getBadge(item, index)
      };
    }
    if (current.parent===item || template[current.section]===item) {
      return {
        selected: true, icon: Check, color: "", 
        badge: getBadge(item, index) 
      };
    }
    let icon = InfoCircle
    switch (item) {
      case template.report:
        break;
      case template.data:
        if (Object.keys(template.data).length>0) {
          icon = Plus
        }
        break;
      case template.header:
      case template.details:
      case template.footer:
        if (item.length>0) {
          icon = Plus
        }
        break;
      default:
        if (Array.isArray(item)) {
          if (item.length>0) {
            icon = Plus
          }
        }
    }
    return { selected: false, icon: icon, color: "", badge: 0 };
  }

  const createSubList = (maplist) => {
    for(let index = 0; index < template[current.section].length; index++) {
      const etype = getElementType(template[current.section][index]);
      let item = template[current.section][index][etype];
      const mkey = "tmp_"+current.section+"_"+index.toString()+"_"+etype
      if (etype==="row" || etype==="datagrid") {
        item = item.columns;
      }
      if (current.parent===null) {
        const pinfo = setListIcon(item);
        maplist.push(<div key={mkey}><button 
          onClick={() => setCurrent(mkey) } 
          className={`${styles.mapButton} ${"full border-button"} ${(pinfo.color!=="")?styles.green:""}`}>
            <div className="row full" >
              <div className="cell" >
                <Label value={etype.toUpperCase()} leftIcon={createElement(pinfo.icon)} col={20} />
              </div>
              <div className="cell align-right" >
                <span className={`${"primary"} ${styles.badgeBlack}`} >{index+1}</span>
              </div>
            </div>
          </button>
        </div>)
      } else {
        if ((current.item===item) || (current.parent===item)) {
          const cinfo = setListIcon(item, index+1)
          maplist.push(<div key={mkey}><button 
            onClick={() => setCurrent(mkey) } 
            className={`${styles.mapButton} ${"full border-button"} ${(cinfo.color!=="")?styles.green:""}`}>
              <div className="row full" >
                <div className="cell" >
                  <Label value={etype.toUpperCase()} leftIcon={createElement(cinfo.icon)} col={20} />
                </div>
                {(cinfo.badge>0)?<div className="cell align-right" >
                  <span className={`${"primary"} ${styles.badgeBlack}`} >{cinfo.badge}</span>
                </div>:null}
              </div>
            </button>
          </div>)
          if (current.type==="row" || current.type==="datagrid" ||
            current.parent_type==="row" || current.parent_type==="datagrid") {
            for(let i2 = 0; i2 < item.length; i2++) {
              let subtype = getElementType(item[i2]);
              let subitem = item[i2][subtype];
              const skey = "tmp_"+current.section+"_"+index.toString()+"_"+etype+"_"+i2.toString()+"_"+subtype
              const sinfo = setListIcon(subitem);
              maplist.push(<div key={skey}><button 
                onClick={() => setCurrent(skey) } 
                className={`${styles.mapButton} ${"full border-button"} ${(sinfo.color!=="")?styles.green:""}`}>
                  <div className="row full" >
                    <div className="cell" >
                      <Label value={subtype.toUpperCase()} leftIcon={createElement(sinfo.icon)} col={20} />
                    </div>
                    {(sinfo.badge>0)?<div className="cell align-right" >
                      <span className={`${"primary"} ${styles.badgeBlack}`} >{sinfo.badge}</span>
                    </div>:null}
                  </div>
                </button>
              </div>)
            }
          }
        }
      }
    };

  }

  const createMapList = () => {
    let maplist = [];
    ["report", "header", "details", "footer"].forEach(mkey => {
      const info = setListIcon(template[mkey]);
      if (info.selected && (mkey !== "report")) {
        maplist.push(<div key={"sep_"+mkey+"_0"} className={styles.separator} />)
      }
      maplist.push(<div key={mkey}><button 
        onClick={() => setCurrent("tmp_"+mkey) } 
        className={`${styles.mapButton} ${"full border-button"} ${(info.color!=="")?styles.green:""}`}>
          <div className="row full" >
            <div className="cell" >
              <Label value={mkey.toUpperCase()} leftIcon={createElement(info.icon)} col={20} />
            </div>
            {(info.badge>0)?<div className="cell align-right" >
              <span className={`${"warning"} ${styles.badgeOrange}`} >{info.badge}</span>
            </div>:null}
          </div>
        </button>
      </div>)
      if (info.selected) {
        maplist.push(<div key={"sep_"+mkey+"_1"} className={styles.separator} />)
        if(mkey !== "report"){
          createSubList(maplist)
          maplist.push(<div key={"sep_"+mkey+"_2"} className={styles.separator} />)
        }
      }
    })
    return maplist;
  }

  const reportElements = {
    header: ["row", "vgap", "hline"],
    details: ["row", "vgap", "hline", "html", "datagrid"],
    footer: ["row", "vgap", "hline"],
    row: ["cell", "image", "barcode", "separator"],
    datagrid: ["column"]
  }

  const tableFields = () => {
    let fields = update(current_data.fields, {$merge: {
      delete: { columnDef: { property: "delete",
        cell: { 
          props: {
            style: { width: 40, padding: "7px 8px 3px 8px" } 
          },
          formatters: [
          (value, { rowData }) => {
            return (<div 
              className={`${"cell"} ${styles.deleteCol}`} >
              {createElement(Times, { width:19, height:27.6, 
                onClick: ()=>deleteDataItem({ _index: rowData._index }),
                className: styles.deleteCol })}
            </div>)
          }] }
      }}
    }})
    return fields
  }

  return (
    <Fragment >
      <div className={`${styles.viewPanel}`} >
        <div className="row full" >
          <div className="cell half" >
            <button className={`${"full"} ${styles.tabButton} ${(tabView === "template")?styles.selected:""} ${(tabView === "template")?"primary":""}`} 
              onClick={()=>changeTemplateData("tabView","template")} >
              <Label text={"template_label_template"} leftIcon={<Tags />} col={25} />
            </button>
          </div>
          <div className={`${"cell half"}`} >
            <button className={`${"full"} ${styles.tabButton} ${(tabView === "data")?styles.selected:""} ${(tabView === "data")?"primary":""}`} 
              onClick={()=>changeTemplateData("tabView","data")} >
              <Label text={"template_label_data"} leftIcon={<Database />} col={25} />
            </button>
          </div>
        </div>
        {(tabView === "template")?
        <Fragment >
          <div className="row full border section container-small" >
            <div className="cell padding-small third" >
              <button onClick={() => mapPrevious() } 
                className={`${styles.mapButton} ${"full border-button"}`}>
                  <Label text="label_previous" leftIcon={<ArrowLeft />} col={20} />
              </button>
              <div key="map_box" className={`${"secondary-title border"} ${styles.mapBox}`} >
                <canvas ref={mapRef} className={`${styles.reportMap}`} />
              </div>
              <button onClick={() => mapNext() } 
                className={`${styles.mapButton} ${"full border-button"}`}>
                  <Label text="label_next" rightIcon={<ArrowRight />} col={20} />
              </button>
            </div>
            <div className="cell padding-small third" >
              {createMapList()}
            </div>
            <div className="cell padding-small third" >
              {(getMapCtr(current.type, "map_edit"))?<div>
                <button onClick={() => moveUp() } 
                  className={`${styles.mapButton} ${"full border-button"}`}>
                    <Label text="label_move_up" leftIcon={<ArrowUp />} col={20} />
                </button>
                <button onClick={() => moveDown() } 
                  className={`${styles.mapButton} ${"full border-button"}`}>
                    <Label text="label_move_down" leftIcon={<ArrowDown />} col={20} />
                </button>
                <button onClick={() => deleteItem() } 
                  className={`${styles.mapButton} ${"full border-button"}`}>
                    <Label text="label_delete" leftIcon={<Times />} col={20} />
                </button>
                <div className={styles.separator} />
              </div>:null}
              {(getMapCtr(current.type, "map_insert"))?<div>
                <button onClick={() => addItem(current.add_item||"") } 
                  className={`${styles.mapButton} ${"border-button"}`}>
                    <Label text="label_add_item" leftIcon={<Plus />} col={20} />
                </button>
                <Select value={current.add_item||""} placeholder=""
                  onChange={(event)=>changeCurrentData("add_item",event.target.value)}
                  options={reportElements[current.type].map(
                    (item)=>{ return { value: item, text: item.toUpperCase() }
                  })} />
              </div>:null}
            </div>
          </div>
          {(current.type)?<div className={`${styles.title} ${"padding-small"}`}>
            <Label value={current.type.toUpperCase()} leftIcon={<Tag />} col={20} />
          </div>:null}
          {(current.type)?
          current.form.rows.map((row, index) =><div 
            className={`${"row full border"} ${styles.templateRow}`} key={index} ><FormRow
            row={row} 
            values={(current.type==="row" || current.type==="datagrid") ? current.item_base : current.item}
            rowdata={{
              audit: "all",
              current: current,
              dataset: template.data,
              onEdit: editTemplate
            }} 
          /></div>):null}
        </Fragment>:
        <div className="row full border padding-normal" >
        {(current_data && (current_data.type === "string"))?
          <div className="row full section-small">
            <div className="panel-title primary">
              <div className="row full">
                <div className="cell">
                  <Label value={current_data.name} />
                </div>
                <div className={`${"cell align-right"} ${styles.closeIcon}`}>
                  <Times onClick={()=>setCurrentData(null)} />
                </div>
              </div>
            </div>
            <textarea className="full section-small-top" 
              value={template.data[current_data.name]||""} rows={15}
              onChange={ (event)=>editDataItem({value: event.target.value}) } />
          </div>:null}
        {(current_data && (current_data.type === "list") && current_data.item)?
          <div className="row full section-small">
            <div className="panel-title primary">
              <div className="row full">
                <div className="cell">
                  <Label value={current_data.item} />
                </div>
                <div className={`${"cell align-right"} ${styles.closeIcon}`}>
                  <Times onClick={()=>setCurrentDataItem(null)} />
                </div>
              </div>
            </div>
            <textarea className="full section-small-top" 
              value={template.data[current_data.name][current_data.item]||""} rows={10}
              onChange={ (event)=>editDataItem({value: event.target.value}) } />
          </div>:null}
        {(current_data && (current_data.type === "table") && current_data.item)?
          <div className="row full section-small">
            <div className="panel-title primary">
              <div className="row full">
                <div className="cell">
                  <Label value={current_data.name+" - "+String(current_data.item._index+1)} />
                </div>
                <div className={`${"cell align-right"} ${styles.closeIcon}`}>
                  <Times onClick={()=>setCurrentDataItem(null)} />
                </div>
              </div>
            </div>
            {Object.keys(current_data.fields).map((field, index) => <div key={index} className="row full">
              <div className="padding-small">
                <Label className="bold" value={field} />
              </div>
              <textarea className="full section-small-top" 
                value={current_data.item[field]||""} rows={2}
                onChange={ (event)=>editDataItem({value: event.target.value, field: field, _index: current_data.item._index}) } />
            </div>)}
          </div>:null}
        {(current_data && (current_data.type === "list") && !current_data.item)?
          <div className="section-small" >
            <div className="panel-title primary">
              <div className="row full">
                <div className="cell">
                  <Label value={current_data.name} />
                </div>
                <div className={`${"cell align-right"} ${styles.closeIcon}`}>
                  <Times onClick={()=>setCurrentData(null)} />
                </div>
              </div>
            </div>
            <List rows={current_data.items}
              listFilter={true} filterPlaceholder={getText("placeholder_filter")}
              onAddItem={setCurrentDataItem} labelAdd={getText("label_new")}
              paginationPage={paginationPage} paginationTop={true} 
              onEdit={(row)=>setCurrentDataItem(row.lslabel)} 
              onDelete={(row)=>deleteDataItem({key: row.lslabel})} 
            />
          </div>:null}
          {(current_data && (current_data.type === "table") && !current_data.item)?
          <div className="section-small" >
            <div className="panel-title primary">
              <div className="row full">
                <div className="cell">
                  <Label value={current_data.name} />
                </div>
                <div className={`${"cell align-right"} ${styles.closeIcon}`}>
                  <Times onClick={()=>setCurrentData(null)} />
                </div>
              </div>
            </div>
            <Table rowKey="_index"
              fields={tableFields()} rows={current_data.items} tableFilter={true}
              filterPlaceholder={getText("placeholder_filter")}
              onAddItem={()=>setCurrentDataItem()}
              onRowSelected={(row)=>setCurrentDataItem(row)}
              labelAdd={getText("label_new")} 
              paginationPage={paginationPage} paginationTop={true}
            />
          </div>:null}
        {(!current_data)?
          <div className="section-small" >
            <List rows={dataset}
              listFilter={true} filterPlaceholder={getText("placeholder_filter")}
              onAddItem={addTemplateData} labelAdd={getText("label_new")}
              paginationPage={paginationPage} paginationTop={true} 
              onEdit={(row)=>setCurrentData({ name: row.lslabel, type: row.lsvalue })} 
              onDelete={(row)=>deleteData(row.lslabel)} 
            />
          </div>:null}
        </div>}  
      </div>
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})

export const Setting = memo((props) => {
  const { caption, icon, current, template } = props.data
  const { theme } = props
  const pageView = () => {
    if(template){
      return <TemplateEditor {...props} />
    } else if(current){
      return <SettingForm {...props} />
    }
    return <SettingView {...props} />
  }
  return (
    <Fragment>
      <div className={`${"page padding-normal"} ${theme}`} >
        <div className={`${"panel"} ${styles.width800}`} >
          <div className="panel-title primary">
            <Label bold primary xxxlarge value={caption} 
              leftIcon={createElement(icon)} col={20} />
          </div>
          <div className={`${"section"} ${styles.settingPanel}`} >
            <div className="row full container section-small-bottom" >
              {pageView()}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}, (prevProps, nextProps) => {
  return (
    (prevProps.data === nextProps.data)
  )
})