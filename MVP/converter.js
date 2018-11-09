const fs = require("fs")
const path = require("path")
const {createCanvas, loadImage} = require("canvas")

// 工作队列
global.workQueue = []
global.isWorking = false
global.convertCount = 0


const convertImageByFilePath = (originalFilePath, outputFilePath, targetColor=[255,0,0]) => {

  workQueue.push({
    originalFilePath,
    outputFilePath,
    targetColor,
  })

  startWork()
}

const startWork = () => {
  if (isWorking) {
    return
  }
  // isWorking = true
  convert()
}


const convert = () => {
  if (workQueue.length === 0) {
    console.log(`[Done]. Convert image finished: ${convertCount}`)
    isWorking = false
    return
  }

  if (isWorking) {
    return
  }

  isWorking = true
  const workItem = workQueue.shift()
  const {
    originalFilePath,
    outputFilePath,
    targetColor,
  } = workItem

  loadImage(originalFilePath).then((image) => {
    console.log("image width and height: ", image.width, image.height)

    let canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext("2d")

    // Draw image
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let imgData = ctx.getImageData(0, 0, image.width, image.height)
    let data = imgData.data

    let originalData = ctx.getImageData(0, 0, image.width, image.height).data

    for (var i = 0; i < data.length; i += 4) {
      const red = originalData[i + 0]
      const green = originalData[i + 1]
      const blue = originalData[i + 2]
      const alpha = originalData[i + 3]

      // skip transparent/semiTransparent pixels
      // console.log(red, green, blue, alpha)
      // if(alpha<230){continue;}
      if (alpha === 0) {
        continue
      }

      // console.log(red, green, blue, alpha)
      // change redish pixels to the new color
      data[i + 0] = targetColor[0]
      data[i + 1] = targetColor[1]
      data[i + 2] = targetColor[2]
      data[i + 3] = alpha
    }
    ctx.putImageData(imgData, 0, 0)

    const out = fs.createWriteStream(outputFilePath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on("finish", () => {
      console.log("The PNG file was created.")
      isWorking = false
      convertCount++
      convert()
      canvas = null
    })
  })


}

// convertImageByFilePath(path.join(__dirname, "originalImages", "icon_dengpao@3x.png"))

module.exports = convertImageByFilePath