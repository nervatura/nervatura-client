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
