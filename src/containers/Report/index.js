import NtReport from './NtReport'

export { Preview } from './Report'

export const pageRender = (viewerRef, canvasRef, data) => {
  const { scale, page } = data || {}
  if (page && viewerRef && canvasRef) {
    const viewer = viewerRef
    const canvas = canvasRef
    const context = canvas.getContext('2d')
    let viewport = page.getViewport({ scale: 1 })

    if(scale === "page-width"){
      viewport = page.getViewport({ scale: (viewer.clientWidth-48)/viewport.width })
    } else if(scale !== 1){
      viewport = page.getViewport({ scale: scale })
    }

    canvas.width = viewport.width
    canvas.height = viewport.height

    page.render({
      canvasContext: context,
      viewport
    })
  }
}

export class Report extends NtReport {
	constructor(_orientation, _unit, _format) {
    
    let options = { 
      orientation: _orientation || "portrait",
      unit: _unit || "mm",
      format: _format || "a4",
      textFilter: [["Ő","Ô"],["ő","ô"],["Ű","Û"],["ű","û"]],
      fontFamily: "times", fontSize: 11
    }
    super(options);
  }

  getXmlTemplate() {
    return super.getXmlTemplate(new DOMParser(), new XMLSerializer())
  }

  loadDefinition(data) {
    return super.loadDefinition(data, new DOMParser())
  }

  save2PdfFile(fileName){
  }

  save2DataUrl(){
  }

}