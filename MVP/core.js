const fs = require("fs")
const path = require("path")
const convertImageByColorAndPathConfig = require("./converter")

const _originalDirPath = path.join(__dirname, "originalImages")
const _outputDirPath = path.join(__dirname, "output")

const convertImageDir = (originalDirPath, outputDirPath) => {

  if (!fs.existsSync(originalDirPath)) {
    console.log(`[Error] originalDirPath is not exists: ${originalDirPath}`)
    return
  }

  if (!fs.existsSync(outputDirPath)) {
    console.log(`[Create] outputDirPath is not exists: ${outputDirPath}`)
    fs.mkdirSync(outputDirPath, 0777);
  }

  var files = fs.readdirSync(originalDirPath);
  files.map((item, index) => {
    const fileFullPath = path.join(originalDirPath, item)
    const fileOutputPath = path.join(outputDirPath, item)
    const fileStats = fs.statSync(fileFullPath)
    const fileIsDirectory = fileStats.isDirectory()

    console.log(`[${index}] [${item}] [${fileIsDirectory}]`)

    if (!fileIsDirectory) {
      // 非文件夹

      // 不是 PNG 图片，则跳过
      if (!/\.png$/ig.test(item)) {
        console.log(`[Warning] file is not a PNG file, skip it: ${fileFullPath}`)
      } else {
        convertImageByColorAndPathConfig(fileFullPath, fileOutputPath, [152, 214, 93])
      }
    } else {
      convertImageDir(
        path.join(originalDirPath, item),
        path.join(outputDirPath, item)
      )
    }

  })
}

// convertImageDir(_originalDirPath, _outputDirPath)
module.exports = convertImageDir

