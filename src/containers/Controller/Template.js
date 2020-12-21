import { useContext } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
import { useApp, saveToDisk } from 'containers/App/actions'
import { InputForm, DataForm } from 'containers/ModalForm'
import { Report } from 'containers/Report'
//import { useReport } from 'containers/Report/actions'
import { TextHeight } from 'components/Icons';

export const useTemplate = () => {
  const { data, setData } = useContext(AppStore)
  const app = useApp()
  const showInput =  InputForm()
  const addData =  DataForm()
  //const report = useReport()

  const elements = {
    report:{
      options: {
        title: "REPORT"},
      rows: [
        {rowtype:"flip", name:"title", datatype:"string", default:"Nervatura Report"},
        {rowtype:"flip", name:"author", datatype:"string"},
        {rowtype:"flip", name:"creator", datatype:"string"},
        {rowtype:"flip", name:"subject", datatype:"string"},
        {rowtype:"flip", name:"keywords", datatype:"string"},
        {rowtype:"groupline"},
        {rowtype:"flip", name:"font-family", datatype:"select", default: "times", 
          options: [["times","times"],["helvetica","helvetica"],["courier","courier"]], 
          info: app.getText("info_font-family")},
        {rowtype:"flip", name:"font-style", datatype:"select", default: "",
          options: [["",""],["bold","bold"],["italic","italic"],["bolditalic","bolditalic"]], 
          info: app.getText("info_font-style")},
        {rowtype:"flip", name:"font-size", datatype:"integer", default: 12},
        {rowtype:"flip", name:"color", datatype:"color", info:app.getText("info_color")},
        {rowtype:"flip", name:"border-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_border-color")},
        {rowtype:"flip", name:"background-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_background-color")},
        {rowtype:"groupline"},
        {rowtype:"flip", name:"left-margin", datatype:"integer", default: 12},
        {rowtype:"flip", name:"right-margin", datatype:"integer", default: 12},
        {rowtype:"flip", name:"top-margin", datatype:"integer", default: 12}
      ]
    },
    row:{
      options: {
        title: "ROW"},
      rows: [
        {rowtype:"flip", name:"height", datatype:"float", default: 0},
        {rowtype:"flip", name:"hgap", datatype:"integer", default: 0, info: app.getText("info_hgap")},
        {rowtype:"flip", name:"visible", datatype:"string", info: app.getText("info_visible")}
      ]
    },
    cell:{
      options: {
        title: "CELL"},
      rows: [
        {rowtype:"flip", name:"name", datatype:"string", default: "head", info: app.getText("info_name")},
        {rowtype:"flip", name:"value", datatype:"string", info: app.getText("info_value")},
        {rowtype:"flip", name:"width", datatype:"percent", info: app.getText("info_width")},
        {rowtype:"flip", name:"align", datatype:"select", default: "left",
          options: [["left","left"],["right","right"],["center","center"]], info: app.getText("info_align")},
        {rowtype:"flip", name:"multiline", datatype:"select", default: "false",
          options: [["false","false"],["true","true"]], info: app.getText("info_multiline")},
        {rowtype:"groupline"},
        {rowtype:"flip", name:"font-family", datatype:"select", default: "times", 
          options: [["times","times"],["helvetica","helvetica"],["courier","courier"]], 
          info: app.getText("info_font-family")},
        {rowtype:"flip", name:"font-style", datatype:"select", default: "",
          options: [["",""],["bold","bold"],["italic","italic"],["bolditalic","bolditalic"]], 
          info: app.getText("info_font-style")},
        {rowtype:"flip", name:"font-size", datatype:"integer", default: 12},
        {rowtype:"flip", name:"color", datatype:"color", info:app.getText("info_color")},
        {rowtype:"flip", name:"border-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_border-color")},
        {rowtype:"flip", name:"background-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_background-color")},
        {rowtype:"flip", name:"border", datatype:"checklist", 
          values: ["1|All", "L|Left", "T|Top", "R|Right", "B|Bottom"]}
      ]
    },
    image:{
      options: {
        title: "IMAGE"},
      rows: [
        {rowtype:"flip", name:"src", datatype:"image", info: app.getText("info_src")},
        {rowtype:"flip", name:"width", datatype:"percent", info: app.getText("info_width")}
      ]
    },
    barcode:{
      options: {
        title: "BARCODE"},
      rows: [
        {rowtype:"flip", name:"code-type", datatype:"select", default: "ITF",
          options: [["ITF","ITF"],["CODE_39","CODE_39"]], info: app.getText("info_code-type")},
        {rowtype:"flip", name:"value", datatype:"string", default: "", info: app.getText("info_barcode_value")},
        {rowtype:"flip", name:"visible-value", datatype:"select", default: "0",
          options: [["0","0"],["1","1"]], info: app.getText("info_visible-value")},
        {rowtype:"flip", name:"wide", datatype:"float", default: 0, info: app.getText("info_optional")},
        {rowtype:"flip", name:"narrow", datatype:"float", default: 0, info: app.getText("info_optional")}
          ]
    },
    separator:{
      options: {
        title: "SEPARATOR"},
      rows: [
        {rowtype:"flip", name:"hgap", datatype:"integer", default: 0, info: app.getText("info_hgap")}]
    },
    vgap:{
      options: {
        title: "VGAP"},
      rows: [
        {rowtype:"flip", name:"height", datatype:"float", default: 0, info: app.getText("info_height")}]
    },
    hline:{
      options: {
        title: "HLINE"},
      rows: [
        {rowtype:"flip", name:"width", datatype:"percent", info: app.getText("info_width")},
        {rowtype:"flip", name:"gap", datatype:"integer", default:0, info: app.getText("info_gap")},
        {rowtype:"flip", name:"border-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_border-color")}
        ]
    },
    html:{
      options: {
        title: "HTML"},
      rows: [
        {rowtype:"flip", name:"html", datatype:"text", default: "", info: app.getText("info_html")}]
    },
    datagrid:{
      options: {
        title: "DATAGRID"},
      rows: [
        {rowtype:"flip", name:"name", datatype:"string", default: "items", info: app.getText("info_datagrid_name")},
        {rowtype:"flip", name:"databind", datatype:"string", default: "", info: app.getText("info_databind")},
        {rowtype:"flip", name:"width", datatype:"percent", info: app.getText("info_width")},
        {rowtype:"flip", name:"merge", datatype:"select", default: "0",
          options: [["0","0"],["1","1"]], info: app.getText("info_merge")},
        {rowtype:"flip", name:"font-size", datatype:"integer", default: 12},
        {rowtype:"flip", name:"border", datatype:"checklist", 
          values: ["1|All", "L|Left", "T|Top", "R|Right", "B|Bottom"]},
        {rowtype:"flip", name:"color", datatype:"color", info:app.getText("info_color")},
        {rowtype:"flip", name:"border-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_border-color")},
        {rowtype:"flip", name:"background-color", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_background-color")},
        {rowtype:"flip", name:"header-background", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_background-color")},
        {rowtype:"flip", name:"footer-background", datatype:"integer", default: 0, max: 255, min: 0,
          info: app.getText("info_background-color")}
        ]
    },
    column:{
      options: {
        title: "COLUMN"},
      rows: [
        {rowtype:"flip", name:"fieldname", datatype:"string", default: "", info: app.getText("info_fieldname")},
        {rowtype:"flip", name:"label", datatype:"string", default: "", info: app.getText("info_label")},
        {rowtype:"flip", name:"width", datatype:"percent", info: app.getText("info_width")},
        {rowtype:"flip", name:"align", datatype:"select", default: "left",
          options: [["left","left"],["right","right"],["center","center"]], info: app.getText("info_align")},
        {rowtype:"flip", name:"header-align", datatype:"select", default: "left",
          options: [["left","left"],["right","right"],["center","center"]], info: app.getText("info_align")},
        {rowtype:"flip", name:"footer-align", datatype:"select", default: "left",
          options: [["left","left"],["right","right"],["center","center"]], info: app.getText("info_align")},
        {rowtype:"flip", name:"thousands", datatype:"string", default: "", info: app.getText("info_thousands")},
        {rowtype:"flip", name:"digit", datatype:"integer", default: 0, info: app.getText("info_digit")},
        {rowtype:"flip", name:"footer", datatype:"string", default: "", info: app.getText("info_footer")}
      ]
    },
    header:{
      options: {
        title: "HEADER"},
      rows: []
    },
    details:{
      options: {
        title: "DETAILS"},
      rows: []
    },
    footer:{
      options: {
        title: "FOOTER"},
      rows: []
    }
  }

  const getElementType = (element) => {
    if (Object.getOwnPropertyNames(element).length>0) {
      return Object.getOwnPropertyNames(element)[0];
    } else {
      return null;
    }
  }
  
  const xml2json = (options) => {
    let rpt = new Report(
      options.orient || app.getSetting("page_orient"), "pt", 
      options.size || app.getSetting("page_size")
    );
    rpt.loadDefinition(options.template);
    return rpt.template.elements;
  }

  const json2xml = (options) => {
    let rpt = new Report(
      options.orient || app.getSetting("page_orient"), "pt", 
      options.size || app.getSetting("page_size")
    )
    rpt.loadJsonDefinition(options.template);
    return rpt.getXmlTemplate();
  }
 
  const getDataset = (data)=>{
    let dataset = [];
    Object.keys(data).forEach((dskey) => {
      if (typeof data[dskey] === "string"){
        dataset.push({ lslabel: dskey, lsvalue: "string" })
      } else {
        if (Array.isArray(data[dskey])){
          dataset.push({ lslabel: dskey, lsvalue: "table" }) 
        } else {
          dataset.push({ lslabel: dskey, lsvalue: "list" })
        }
      }
    });
    return dataset;
  }

  const getMapCtr = (type, key) => {
    switch (key) {
      case "map_edit":
        switch (type) {
          case "data":
            return false;
          case "report":
            return false;
          case "header":
          case "footer":
            return false;
          case "details":
            return false;
          case "row":
          case "datagrid":
            return true;
          default:
            return true;
        }
      case "map_insert":
        switch (type) {
          case "data":
            return false;
          case "report":
            return false;
          case "header":
          case "footer":
            return true;
          case "details":
            return true;
          case "row":
          case "datagrid":
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
  }

  const setCurrent = (options) => {
    const item = options.tmp_id.split("_");
    let setting = update(options.setting||data.setting, {template: {$merge: {
      current: {
        id: options.tmp_id,
        section: item[1]
      }
    }}})
    switch (item.length) {
      case 2:
        setting = update(setting, {template: {current: {$merge: {
          type: item[1],
          item: setting.template.template[setting.template.current.section],
          index: null,
          parent: null,
          parent_type: null,
          parent_index: null
        }}}})
        break;
      case 4:
        setting = update(setting, {template: {current: {$merge: {
          type: item[3],
          index: parseInt(item[2],10),
          parent: setting.template.template[setting.template.current.section],
          parent_type: setting.template.current.section,
          parent_index: null
        }}}})
        if ((setting.template.current.type==="row") || (setting.template.current.type==="datagrid")) {
          setting = update(setting, {template: {current: {$merge: {
            item: setting.template.template[setting.template.current.section][parseInt(item[2],10)][item[3]].columns,
            item_base: setting.template.template[setting.template.current.section][parseInt(item[2],10)][item[3]]
          }}}})
        } else {
          setting = update(setting, {template: {current: {$merge: {
            item: setting.template.template[setting.template.current.section][parseInt(item[2],10)][item[3]]
          }}}})
        }
        break;
      case 6:
        setting = update(setting, {template: {current: {$merge: {
          type: item[5],
          item: setting.template.template[setting.template.current.section][parseInt(item[2],10)][item[3]].columns[parseInt(item[4],10)][item[5]],
          index: parseInt(item[4],10),
          parent: setting.template.template[setting.template.current.section][parseInt(item[2],10)][item[3]].columns,
          parent_type: item[3],
          parent_index: parseInt(item[2],10)
        }}}})
        break;
      default:
        break;
    }
    setting = update(setting, {template: {current: {$merge: {
      form: elements[setting.template.current.type]
    }}}})
    if(options.set_dirty && (setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
      setting = update(setting, {$merge: {
        dirty: true
      }})
    }
    setData("setting", setting)
  }

  const setTemplate = (options) => {
    let setting = update(data.setting, {$merge: {
      type: "template_editor",
      dataset: options.dataset,
      current: null,
      filter: "",
      result: [],
      caption: options.dataset.template[0].repname,
      icon: TextHeight,
      template: {
        key: options.dataset.template[0].reportkey,
        title: options.dataset.template[0].repname,
        template: xml2json({template: options.dataset.template[0].report}),
        current: {},
        current_data: null,
        dataset: [],
        docnumber: "",
        tabView: "template"
      }
    }})
    setting = update(setting, {template: {$merge: {
      dataset: getDataset(setting.template.template.data)
    }}})
    setCurrent({tmp_id: "tmp_report", setting: setting})
    setData("current", { module: "setting" })
  }

  const createMap = (cv) => {
    const { template, current } = data.setting.template
    let cont = cv.getContext('2d')
    let cell_color = "#CCCCCC"; let row_color = "#FFFF00"; let sel_color = "#00EE00";
    let cell_size = 8; let cell_pad = 1; let page_pad = 3; let rows = [];
    let def_height = 165;

    cv.height = page_pad;
    let sections = ["header","details","footer"];
    for(let s = 0; s < sections.length; s++) {
      for(let i = 0; i < template[sections[s]].length; i++) {
        let row = {};
        row.type = getElementType(template[sections[s]][i]);
        let item = template[sections[s]][i][row.type];
        if (row.type==="row" || row.type==="datagrid") {
          row.cols = template[sections[s]][i][row.type].columns.length;
          row.selected = (item.columns===current.item || item.columns===current.parent);
          row.selcol = -1;
          if (row.selected) {
            for(let c = 0; c < row.cols; c++) {
              let cname = getElementType(template[sections[s]][i][row.type].columns[c]);
              if (template[sections[s]][i][row.type].columns[c][cname]===current.item) {
                row.selcol = c;
              }
            }
          }
          if (row.cols*(cell_size+cell_pad)+2*page_pad > cv.width)
            cv.width = row.cols*(cell_size+cell_pad)+2*page_pad;
        } else {
          row.selected = (item===current.item); row.cols = 1;
        }
        switch (row.type) {
          case "vgap":
            if (template[sections[s]][i][row.type].height>2) {
              row.height = template[sections[s]][i][row.type].height;
            } else {
              row.height = 2;
            }
            cv.height += row.height;
            break;
          case "hline":
            cv.height += 2;
            break;
          case "datagrid":
            cv.height += 2*cell_size + 4*cell_pad;
            break;
          default:
            cv.height += cell_size + cell_pad;
            break;}
        if (template[sections[s]]===current.item || template.report===current.item) {
          row.selected = true;
        }
        rows.push(row);
      }
    }
    cv.height += page_pad;
    if (cv.height<def_height) {
      cv.height = def_height;
    }

    let x = page_pad; let y = page_pad; let coldif = 0;
    for(let r = 0; r < rows.length; r++) {
      switch (rows[r].type) {
        case "row":
          coldif = (cv.width - (rows[r].cols*(cell_size+cell_pad)+2*page_pad))/rows[r].cols;
          for(let cr = 0; cr < rows[r].cols; cr++) {
            if (rows[r].selected) {
              if (rows[r].selcol === cr || rows[r].selcol === -1) {
                cont.fillStyle = sel_color;
              } else {
                cont.fillStyle = row_color;
              }
            } else {
              cont.fillStyle = cell_color;
            }
            cont.fillRect(x, y, cell_size+coldif, cell_size);
            x += cell_size + coldif + cell_pad;
          }
          y += cell_size + cell_pad;
          break;
        case "datagrid":
          if (rows[r].selected) {
            cont.fillStyle = sel_color;
          } else {
            cont.fillStyle = cell_color;
          }
          cont.fillRect(x, y, cv.width-2*page_pad-cell_pad, cell_size/2);
          coldif = (cv.width - (rows[r].cols*(cell_size+cell_pad)+2*page_pad))/rows[r].cols;
          for(let cc = 0; cc < rows[r].cols; cc++) {
            if (rows[r].selected) {
              if (rows[r].selcol === cc || rows[r].selcol === -1) {
                cont.fillStyle = sel_color;
              } else {
                cont.fillStyle = row_color;
              }
            } else {
              cont.fillStyle = cell_color;
            }
            cont.fillRect(x, y+cell_size/2+cell_pad, cell_size+coldif, cell_size/2);
            cont.fillRect(x, y+cell_size+2*cell_pad, cell_size+coldif, cell_size/2);
            cont.fillRect(x, y+1.5*cell_size+3*cell_pad, cell_size+coldif, cell_size/2);
            x += cell_size + coldif + cell_pad;
          }
          y += 2*cell_size + 4*cell_pad;
          break;
        case "vgap":
          if (rows[r].selected) {
            cont.fillStyle = sel_color;
            cont.fillRect(x, y-cell_pad, cv.width-2*page_pad-cell_pad, rows[r].height);
          }
          y += rows[r].height;
          break;
        case "hline":
          if (rows[r].selected) {
            cont.strokeStyle = sel_color;
          } else {
            cont.strokeStyle = cell_color;
          }
          cont.beginPath();
          cont.moveTo(x, y);
          cont.lineTo(cv.width-page_pad-cell_pad, y);
          cont.stroke();
          y += 2;
          break;
        case "html":
          if (rows[r].selected) {
            cont.fillStyle = sel_color;
          } else {
            cont.fillStyle = cell_color;
          }
          cont.fillRect(x, y, cv.width-2*page_pad-cell_pad, cell_size);
          y += cell_size + cell_pad;
          break;
        default:
          break;
      }
      x = page_pad;
    }
  }
  
  const getNextItemId = (setting) => {
    //tmp_section_index_type_subindex_subtype
    const { current, template } = setting.template
    let section = current.section;
    let index = current.parent_index;
    let subindex = current.index;
    if (current.parent_index===null) {
      index = current.index; subindex = null;
    }
    let etype; let subtype;
    let sections = ["report","header","details","footer"];
    if (subindex!==null) {
      etype = getElementType(template[section][index]);
      if (subindex < template[section][index][etype].columns.length-1) {
        subtype = getElementType(template[section][index][etype].columns[subindex+1]);
        return {tmp_id: "tmp_"+section+"_"+index.toString()+"_"+etype+"_"+(subindex+1).toString()+"_"+subtype, setting: setting};
      }
    }
    if (index!==null) {
      if (subindex===null) {
        etype = getElementType(template[section][index]);
        if (etype==="row" || etype==="datagrid") {
          if (template[section][index][etype].columns.length>0) {
            subtype = getElementType(template[section][index][etype].columns[0]);
            return {tmp_id: "tmp_"+section+"_"+index.toString()+"_"+etype+"_0_"+subtype, setting: setting};
          }
        }
      }
      if (index < template[section].length-1) {
        etype = getElementType(template[section][index+1]);
        return {tmp_id: "tmp_"+section+"_"+(index+1).toString()+"_"+etype, setting: setting};
      }
      if (section==="footer") {
        if (subindex!==null) {
          subtype = getElementType(template[section][index][etype].columns[subindex]);
          return {tmp_id: "tmp_"+section+"_"+(index).toString()+"_"+etype+"_"+(subindex).toString()+"_"+subtype, setting: setting};
        } else {
          return {tmp_id: "tmp_"+section+"_"+(index).toString()+"_"+etype, setting: setting};
        }
      } else {
        section = sections[sections.indexOf(section)+1];
      }
    }
    if (template[section].length>0) {
      etype = getElementType(template[section][0]);
      return {tmp_id: "tmp_"+section+"_0_"+etype, setting: setting};
    } else {
      if (section!=="footer") {
        section = sections[sections.indexOf(section)+1];
      }
      return {tmp_id: "tmp_"+section, setting: setting};
    }
  };

  const getPrevItemId = (setting) => {
    //tmp_section_index_type_subindex_subtype
    const { current, template } = setting.template
    let section = current.section;
    let index = current.parent_index;
    let subindex = current.index;
    if (current.parent_index===null) {
      index = current.index; subindex = null;
    }
    if (section==="report") {
      return {tmp_id: "tmp_report", setting: setting};
    }
    let etype; let subtype;
    if (subindex!==null) {
      etype = getElementType(template[section][index]);
      if (subindex>0) {
        subtype = getElementType(template[section][index][etype].columns[subindex-1]);
        return {tmp_id: "tmp_"+section+"_"+index.toString()+"_"+etype+"_"+(subindex-1).toString()+"_"+subtype, setting: setting};
      }
      return {tmp_id: "tmp_"+section+"_"+index.toString()+"_"+etype, setting: setting};
    }
    if (index!==null) {
      if (index>0) {
        etype = getElementType(template[section][index-1]);
        if (etype==="row" || etype==="datagrid") {
          subindex = template[section][index-1][etype].columns.length;
          if (subindex>0) {
            subtype = getElementType(template[section][index-1][etype].columns[subindex-1]);
            return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype+"_"+(subindex-1).toString()+"_"+subtype, setting: setting};
          } else {
            return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype, setting: setting};
          }
        } else {
          return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype, setting: setting};
        }
      }
      return {tmp_id: "tmp_"+section, setting: setting};
    }
    let sections = ["report","header","details","footer"];
    section = sections[sections.indexOf(section)-1];
    if (section==="report") {
      return {tmp_id: "tmp_report", setting: setting};
    }
    index = template[section].length;
    if (index>0) {
      etype = getElementType(template[section][index-1]);
      if (etype==="row" || etype==="datagrid") {
        subindex = template[section][index-1][etype].columns.length;
        if (subindex>0) {
          subtype = getElementType(template[section][index-1][etype].columns[subindex-1]);
          return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype+"_"+(subindex-1).toString()+"_"+subtype, setting: setting};
        } else {
          return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype, setting: setting};
        }
      } else {
        return {tmp_id: "tmp_"+section+"_"+(index-1).toString()+"_"+etype, setting: setting};
      }
    } else {
      return {tmp_id: "tmp_"+section, setting: setting};
    }
  }

  const goPrevious = (setting) => {
    setCurrent(getPrevItemId(setting))
  }

  const goNext = (setting) => {
    setCurrent(getNextItemId(setting))
  }

  const moveDown = (setting) => {
    const { current } = setting.template;
    if (current.parent!==null && current.index!==null) {
      if (current.index<current.parent.length-1) {
        let next_item = current.parent[current.index+1];
        current.parent[current.index+1] = current.parent[current.index];
        current.parent[current.index] = next_item;
        let id = "tmp_"+current.section+"_";
        if (current.parent_index!==null) {
          id += current.parent_index.toString()+"_"+current.parent_type+"_";
        }
        id += (current.index+1).toString()+"_"+current.type;
        setCurrent({ tmp_id: id, set_dirty: true, setting: setting})
      }
    }
  }

  const moveUp = (setting) => {
    const { current } = setting.template;
    if (current.parent!==null && current.index!==null) {
      if (current.index>0) {
        let prev_item = current.parent[current.index-1];
        current.parent[current.index-1] = current.parent[current.index];
        current.parent[current.index] = prev_item;
        //tmp_section_index_type_subindex_subtype
        let id = "tmp_"+current.section+"_";
        if (current.parent_index!==null) {
          id += current.parent_index.toString()+"_"+current.parent_type+"_";
        }
        id += (current.index-1).toString()+"_"+current.type;
        setCurrent({ tmp_id: id, set_dirty: true, setting: setting})
      }
    }
  }

  const deleteItem = (setting) => {
    const { current } = setting.template;
    if (current.parent!==null && current.index!==null) {
      current.parent.splice(current.index, 1);
      let id = "tmp_"+current.section;
      if (current.parent_index!==null) {
        id += "_"+current.parent_index.toString()+"_"+current.parent_type;
      }
      setCurrent({ tmp_id: id, set_dirty: true, setting: setting})
    }
  }

  const addItem = (value, setting) => {
    const { current } = setting.template;
    if (value !== "") {
      let ename = value.toString().toLowerCase();
      let element = {}; element[ename] = {};
      let id = current.id+"_"+current.item.length.toString()+"_"+ename;
      if (ename==="datagrid" || ename==="row") {
        element[ename].columns=[];
      }
      current.item.push(element);
      setCurrent({ tmp_id: id, set_dirty: true, setting: setting})
    }
  }

  const editItem = (options) => {
    let setting = update(options.setting||data.setting, {})
    const itemId = setting.template.current.id.split("_");

    const setItemBase = (key, value) => {
      if(value === null){
        setting = update(setting, {template: {current: {item_base: {
          $unset: [key]
        }}}})
      } else {
        setting = update(setting, {template: {current: {item_base: {$merge: {
          [key]: value
        }}}}})
      }
      setting = update(setting, {template: {template: {
        [setting.template.current.section]: {[parseInt(itemId[2],10)]: {[itemId[3]]: { 
          $set: setting.template.current.item_base
      }}}}}})
    }

    const setItem = (key, value) => {
      if(value === null){
        setting = update(setting, {template: {current: {item: {
          $unset: [key]
        }}}})
      } else {
        setting = update(setting, {template: {current: {item: {$merge: {
          [key]: value
        }}}}})
      }
      switch (itemId.length) {
        case 2:
          setting = update(setting, {template: {template: {[setting.template.current.section]: {
            $set: setting.template.current.item
          }}}})
          break;

        case 4:
          if ((setting.template.current.type==="row") || (setting.template.current.type==="datagrid")) {
            setting = update(setting, {template: {template: {[setting.template.current.section]: { [parseInt(itemId[2],10)]: {[itemId[3]]: {columns: {
              $set: setting.template.current.item
            }}}}}}})
          } else {
            setting = update(setting, {template: {template: {[setting.template.current.section]: { [parseInt(itemId[2],10)]: {[itemId[3]]: {
              $set: setting.template.current.item
            }}}}}})
          }
          break;

        case 6:
          setting = update(setting, {template: {template: {[setting.template.current.section]: { [parseInt(itemId[2],10)]: {[itemId[3]]: {columns: {[parseInt(itemId[4],10)]: {[itemId[5]]: {
            $set: setting.template.current.item
          }}}}}}}}})
          break;

        default:
      }
    }

    if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
      setting = update(setting, {$merge: {
        dirty: true
      }})
    }

    if(options.selected){
      let value = ""
      if(options.value){
        if(options.defvalue){
          value = options.defvalue
        } else {
          switch (options.datatype) {
            case "float":
            case "integer":
              value = 0
              break;
            default:
              value = "";
              break;
          }
        }
        if(setting.template.current.item_base){
          setItemBase(options.name, value)
        } else {
          setItem(options.name, value)
        }
      } else {
        if(setting.template.current.item_base){
          setItemBase(options.name, null)
        } else {
          setItem(options.name, null)
        }
      }
    } else if(options.file){
      if (options.value.length > 0) {
        let file = options.value[0]
        let fileReader = new FileReader();
        fileReader.onload = function(event) {
          if(setting.template.current.item_base){
            setItemBase(options.name, event.target.result)
          } else {
            setItem(options.name, event.target.result)
          }
          setData("setting", setting)
        }
        fileReader.readAsDataURL(file);
      }
    } else if(options.checklist){
      let ovalue = ((setting.template.current.item_base) ? 
        setting.template.current.item_base[options.name] : 
        setting.template.current.item[options.name]) || ""
      let value = options.value
      if(options.checked){
        if(value !== "1"){
          if((ovalue !== "1")){
            value = ovalue + value
          }
        }
      } else {
        if(setting.template.current.item_base){
          value = ovalue.replace(value,"")
        } else {
          value = ovalue.replace(value,"")
        }
      }
      if(setting.template.current.item_base){
        setItemBase(options.name, value)
      } else {
        setItem(options.name, value)
      }
    } else {
      if(setting.template.current.item_base){
        setItemBase(options.name, options.value)
      } else {
        setItem(options.name, options.value)
      }
    }

    if(!options.file){
      setData("setting", setting)
    }
  }

  const exportTemplate = (ftype) => {
    const { template } = data.setting
    const xtempl = (ftype === "xml") ? 
      json2xml({template: template.template}) : 
      JSON.stringify(template.template)
    let fUrl = URL.createObjectURL(new Blob([xtempl], 
      {type : 'text/'+ftype+';charset=utf-8;'}));
    saveToDisk(fUrl, template.key+"."+ftype)
  }

  const newBlank = () => {
    let setting = update(data.setting, {$merge: {
      type: "template_editor",
      caption: app.getText("title_report_editor"),
      icon: TextHeight,
      dataset: {},
      current: null,
      filter: "",
      result: [],
      template: {
        key: "_blank",
        title: "Nervatura Report",
        template: {
          report: {}, 
          header: [],
          details: [],
          footer: [], 
          data: {}
        },
        current: {},
        current_data: null,
        dataset: [],
        docnumber: "",
        tabView: "template"
      }
    }})
    setCurrent({tmp_id: "tmp_report", setting: setting})
    setData("current", { module: "setting" })
  }

  const newSample = () => {
    let sample = require('../../config/sample.json')
    let setting = update(data.setting, {$merge: {
      type: "template_editor",
      caption: sample.report.title,
      icon: TextHeight,
      dataset: {},
      current: null,
      filter: "",
      result: [],
      template: {
        key: "_sample",
        title: sample.report.title,
        template: sample,
        current: {},
        current_data: null,
        dataset: [],
        docnumber: "",
        tabView: "template"
      }
    }})
    setting = update(setting, {template: {$merge: {
      dataset: getDataset(setting.template.template.data)
    }}})
    setCurrent({tmp_id: "tmp_report", setting: setting})
    setData("current", { module: "setting" })
  }

  const saveTemplate = async (warning) => {
    const updateData = async ()=>{
      let setting = update(data.setting, {})
      let values = { 
        id: setting.dataset.template[0].id,
        report: json2xml({ template: setting.template.template })
      }
      let result = await app.requestData("/ui_report", { method: "POST", data: [values] })
      if(result.error){
        app.resultError(result)
        return null
      }
      setting = update(setting, {$merge: {
        dirty: false
      }})
      return setting
    }
    if(warning){
      showInput({
        title: app.getText("template_label_template"), message: app.getText("msg_dirty_info"),
        infoText: app.getText("msg_delete_info"), 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, async ()=>{
            const result = await updateData()
            if(result){
              setData("setting", result)
            }
          })
        }
      })
    } else {
      return await updateData()
    }
  }

  const deleteTemplate = async (id) => {
    const result = await app.requestData("/ui_report", 
      { method: "DELETE", query: { id: id } })
    if(result && result.error){
      app.resultError(result)
      return false
    }
    return true
  }

  const deleteData = (dskey) => {
    showInput({
      title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
      infoText: app.getText("msg_delete_info"), 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      cbCancel: () => {
        setData("current", { modalForm: null })
      },
      cbOK: () => {
        setData("current", { modalForm: null }, async ()=>{
          let setting = update(data.setting, {template: {template: {data: {
            $unset: [dskey]
          }}}})
          if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
            setting = update(setting, {$merge: {
              dirty: true
            }})
          }
          setting = update(setting, {template: { $merge: {
            dataset: getDataset(setting.template.template.data)
          }}})
          setData("setting", setting)
        })
      }
    })
  }
  
  const getDataList = (data)=>{
    let datalist = [];
    Object.keys(data).forEach((key) => {
      datalist.push({ lslabel: key, lsvalue: data[key] }) 
    });
    return datalist;
  }

  const getDataTable = (data)=>{
    let table = { fields: {}, items: []};
    if(data.length > 0){
      Object.keys(data[0]).forEach((key) => {
        table.fields[key] = { fieldtype: 'string', label: key }
      })
      for (var index = 0; index < data.length; index++) {
        const item = update(data[index], {$merge: {
          _index: index
        }})
        table.items.push(item) 
      } 
    }
    return table;
  }

  const setCurrentData = (cdata) => {
    let setting = update(data.setting, {})

    const setCData=(values) => {
      if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
        setting = update(setting, {$merge: {
          dirty: true
        }})
      }
      setting = update(setting, {template: { $merge: {
        current_data: values
      }}})
      setData("setting", setting)
    }

    if(cdata){
      switch (cdata.type) {
        case "new":
          if (Object.keys(setting.template.template.data).includes(cdata.values.name) || cdata.values.name==="") {
            app.showToast({ type: "error",
              title: app.getText("msg_warning"), 
              message: app.getText("msg_value_exists") })
          } else if((cdata.values.type === "table") && (cdata.values.columns === "")) {
            app.showToast({ type: "error",
              title: app.getText("msg_warning"), 
              message: app.getText("template_missing_columns") })
          } else {
            let values = update({}, {$set: {
              name: cdata.values.name, 
              type: cdata.values.type 
            }})
            switch (values.type) {
              case "string":
                setting = update(setting, {template: { template: {data: {$merge: {
                  [values.name]: ""
                }}}}})
                break;

              case "list":
                setting = update(setting, {template: { template: {data: {$merge: {
                  [values.name]: {}
                }}}}})
                values.items = getDataList({})
                break;
              
              case "table":
                setting = update(setting, {template: { template: {data: {$merge: {
                  [values.name]: []
                }}}}})
                let columns = cdata.values.columns.split(",")
                let item = {}
                for(let i = 0; i < columns.length; i++) {
                  item[String(columns[i]).trim()] = ""
                }
                setting = update(setting, {template: { template: {data: {
                  [values.name]: {$push: [item]}
                }}}})
                const table_data = getDataTable([item])
                values.items = table_data.items
                values.fields = table_data.fields
                break;

                default:
                  break;
            }
            setting = update(setting, {template: {$merge: {
              dataset: getDataset(setting.template.template.data)
            }}})
            setCData(values)
          }
          break;

        case "list":
          cdata.items = getDataList(setting.template.template.data[cdata.name])
          setCData(cdata)
          break;
        
        case "table":
          const table_data = getDataTable(setting.template.template.data[cdata.name])
          cdata.items = table_data.items
          cdata.fields = table_data.fields
          setCData(cdata)
          break;
      
        default:
          setCData(cdata)
          break;
      }
    } else {
      setCData(cdata)
    }
  }

  const setCurrentDataItem = (value) => {
    let setting = update(data.setting, {})

    const setItem=(item) => {
      if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
        setting = update(setting, {$merge: {
          dirty: true
        }})
      }
      setting = update(setting, {template: {current_data: { $merge: {
        item: item
      }}}})
      setData("setting", setting)
    }
    
    const newList=() => {
      showInput({
        title: app.getText("msg_input_title"), message: app.getText("msg_new_fieldname"),
        value: "", 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, async ()=>{
            if (value !== "") { 
              if (Object.keys(setting.template.template.data[setting.template.current_data.name]).includes(value)) {
                app.showToast({ type: "error",
                  title: app.getText("msg_warning"), 
                  message: app.getText("msg_value_exists") })
              } else {
                setting = update(setting, {template: { template: {data: {[setting.template.current_data.name]: {$merge: {
                  [value]: ""
                }}}}}})
                setting = update(setting, {template: { current_data: {$merge: {
                  items: getDataList(setting.template.template.data[setting.template.current_data.name])
                }}}})
                setItem(value)
              }
            }
          })
        }
      })
    }

    const newTable=() => {      
      let item = update(setting.template.template.data[setting.template.current_data.name][0], {$merge:{
        _index: setting.template.template.data[setting.template.current_data.name].length-1
      }})
      Object.keys(item).forEach((fieldname) => {
        if(fieldname !== "_index"){
          item[fieldname] = ""
        }
      })
      setting = update(setting, {template: { template: {data: {
        [setting.template.current_data.name]: {$push: [item]
      }}}}})
      setting = update(setting, {template: { current_data: {$merge: {
        items: getDataTable(setting.template.template.data[setting.template.current_data.name]).items
      }}}})
      setItem(item)
    }

    if(typeof value === "undefined"){
      if(setting.template.current_data.type === "list"){
        newList()
      } else if(setting.template.current_data.type === "table"){
        newTable()
      }
    } else {
      setItem(value)
    }

  }

  const deleteDataItem = (options) => {
    showInput({
      title: app.getText("msg_warning"), message: app.getText("msg_delete_text"),
      infoText: app.getText("msg_delete_info"), 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      cbCancel: () => {
        setData("current", { modalForm: null })
      },
      cbOK: () => {
        setData("current", { modalForm: null }, async ()=>{
          let setting = update(data.setting, {})

          switch (setting.template.current_data.type) {
            case "list":
              setting = update(setting, {template: {template: {data: {[setting.template.current_data.name]: {
                $unset: [options.key]
              }}}}})
              setting = update(setting, {template: { current_data: {$merge: {
                items: getDataList(setting.template.template.data[setting.template.current_data.name])
              }}}})
              break;
  
            case "table":
            default:
              if (setting.template.template.data[setting.template.current_data.name].length===1){
                setting = update(setting, {template: {template: {data: {
                  $unset: [setting.template.current_data.name]
                }}}})
                setting = update(setting, {template: {$merge: {
                  current_data: null,
                  dataset: getDataset(setting.template.template.data)
                }}})
              } else {
                setting = update(setting, {template: {template: {data: {[setting.template.current_data.name]: {
                  $splice: [[options._index, 1]]
                }}}}})
                setting = update(setting, {template: { current_data: {$merge: {
                  items: getDataTable(setting.template.template.data[setting.template.current_data.name]).items
                }}}})
              }
              break;
          }
          
          setting = update(setting, {template: { $merge: {
            dataset: getDataset(setting.template.template.data)
          }}})

          if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
            setting = update(setting, {$merge: {
              dirty: true
            }})
          }
          setData("setting", setting)
        })
      }
    })
  }

  const editDataItem = (options) => {
    let setting = update(data.setting, {})
    if((setting.template.key !== "_blank") && (setting.template.key !== "_sample")){
      setting = update(setting, {$merge: {
        dirty: true
      }})
    }
    switch (setting.template.current_data.type) {
      case "string":
        setting = update(setting, {template: { template: {data: {$merge: {
          [setting.template.current_data.name]: options.value
        }}}}})
        break;
      
      case "list":
        setting = update(setting, {template: { template: {data: {[setting.template.current_data.name]: {$merge: {
          [setting.template.current_data.item]: options.value
        }}}}}})
        setting = update(setting, {template: { current_data: {$merge: {
          items: getDataList(setting.template.template.data[setting.template.current_data.name])
        }}}})
        break;

      default:
        setting = update(setting, {template: { current_data: {item: {$merge: {
          [options.field]: options.value
        }}}}})
        setting = update(setting, {template: { template: {data: {
          [setting.template.current_data.name]: {[options._index]: {$merge: {
          [options.field]: options.value
        }}}}}}})
        setting = update(setting, {template: { current_data: {$merge: {
          items: getDataTable(setting.template.template.data[setting.template.current_data.name]).items
        }}}})
        break;
    }
    setData("setting", setting)
  }

  const addTemplateData = () => {
    addData({ 
      onChange: (form) => {
        setData("current", { modalForm: form })
      }, 
      updateData: (values) => {
        setData("current", { modalForm: null }, async ()=>{
          setCurrentData({ name: "new", type: "new", values: {...values} })
        })
      }
    })
  }

  const showPreview = () => {
    let setting = update(data.setting, {})
    const params = {
      module: "setting",
      type: "auto",
      template: setting.template.key, 
      title: setting.template.title,
      orient: app.getSetting("page_orient"), 
      size: app.getSetting("page_size"),
      report: json2xml({ template: setting.template.template })
    }
    if((setting.template.key === "_blank") || (setting.template.key === "_sample")){
      //report.loadPreview(params)
    } else {
      params.nervatype = setting.dataset.template[0].ntype
      showInput({
        title: app.getText("template_preview_data"), 
        message: app.getText("template_preview_input").replace("docname",params.nervatype),
        value: setting.template.docnumber, 
        onChange: (form) => {
          setData("current", { modalForm: form })
        }, 
        cbCancel: () => {
          setData("current", { modalForm: null })
        },
        cbOK: (value) => {
          setData("current", { modalForm: null }, async ()=>{
            if(value !== ""){
              params.refnumber = value
              //report.loadPreview(params)
            }
          })
        }
      })
    }
  }

  return {
    getMapCtr: getMapCtr,
    setTemplate: setTemplate,
    setCurrent: setCurrent,
    getElementType: getElementType,
    createMap: createMap,
    goPrevious: goPrevious,
    goNext: goNext,
    moveUp: moveUp, 
    moveDown: moveDown, 
    deleteItem: deleteItem,
    addItem: addItem,
    editItem: editItem,
    exportTemplate: exportTemplate,
    newBlank: newBlank,
    newSample: newSample,
    saveTemplate: saveTemplate,
    deleteTemplate: deleteTemplate,
    json2xml: json2xml,
    deleteData: deleteData,
    addTemplateData: addTemplateData,
    setCurrentData: setCurrentData,
    editDataItem: editDataItem,
    setCurrentDataItem: setCurrentDataItem,
    deleteDataItem: deleteDataItem,
    showPreview: showPreview
  }
}