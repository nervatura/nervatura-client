import { useContext } from 'react';
import update from 'immutability-helper';

import AppStore from 'containers/App/context'
//import { useApp } from 'containers/App/actions'

export const useTemplate = () => {
  const { data, setData } = useContext(AppStore)
  //const app = useApp()

/*  
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
*/
  const setTemplate = (options) => {
    let setting = update(data.setting, {$merge: {
      type: "template_editor",
      dataset: options.dataset,
      current: null,
      filter: "",
      result: [],
      caption: options.dataset.template[0].repname,
      icon: "text-height",
      template: {
        key: options.dataset.template[0].reportkey,
        title: options.dataset.template[0].repname,
        template: {},//dispatch(xml2json({template: options.dataset.template[0].report})),
        current: {},
        current_data: null,
        dataset: [],
        docnumber: ""
      }
    }})
    //setting = update(setting, {template: {$merge: {
    //  dataset: getDataset(setting.template.template.data)
    //}}})
    setData("setting", setting)
    //setCurrent("tmp_report")
    setData("current", { module: "setting" })
  }

  return {
    setTemplate: setTemplate
  }
}