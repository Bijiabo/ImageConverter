const path = require("path")
const convertImageDir = require("./MVP/core")

// 设定输入和输出图片文件夹
const _originalDirPath = path.join(__dirname, "MVP", "originalImages")
const _outputDirPath = path.join(__dirname, "MVP", "output")

// 进行批量转换
convertImageDir(_originalDirPath, _outputDirPath, [152, 214, 93])

