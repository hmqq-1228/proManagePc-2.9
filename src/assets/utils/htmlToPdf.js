import html2Canvas from 'html2canvas'
import JsPDF from 'jspdf'
export default{
  install (Vue, options) {
    Vue.prototype.getPdf = function (dom, title) {
      var c = document.createElement('canvas')
      var opts = {
        scale: 2,
        canvas: c,
        logging: true,
        width: document.querySelector(dom).getBoundingClientRect().width,
        height: document.querySelector(dom).getBoundingClientRect().height
      }
      c.width = document.querySelector(dom).getBoundingClientRect().width * 2
      c.height = document.querySelector(dom).getBoundingClientRect().height * 2
      c.getContext('2d').scale(2, 2)
      html2Canvas(document.querySelector(dom), opts).then(function (canvas) {
        let contentWidth = canvas.width
        let contentHeight = canvas.height
        let pageHeight = contentWidth / 592.28 * 841.89
        let leftHeight = contentHeight
        let position = 0
        let imgWidth = 595.28
        let imgHeight = 592.28 / contentWidth * contentHeight
        let pageData = canvas.toDataURL('image/jpeg', 1.0)
        let PDF = new JsPDF('', 'pt', 'a4')
        if (leftHeight < pageHeight) {
          PDF.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
        } else {
          while (leftHeight > 0) {
            PDF.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
            leftHeight -= pageHeight
            position -= 841.89
            if (leftHeight > 0) {
              PDF.addPage()
            }
          }
        }
        PDF.save(title + '.pdf')
      }
      )
    }
  }
}
