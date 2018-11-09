const fs = require("fs")
const path = require("path")
const {createCanvas, loadImage} = require("canvas")

// Draw cat with lime helmet

const convertImageByFilePath = (originalFilePath, outputFilePath, targetColor=[255,0,0]) => {
  loadImage(originalFilePath).then((image) => {
    console.log("image width and height: ", image.width, image.height)

    const canvas = createCanvas(image.width, image.height)
    const ctx = canvas.getContext("2d")

    // Draw image
    ctx.drawImage(image, 0, 0, image.width, image.height)

    let imgData = ctx.getImageData(0, 0, image.width, image.height)
    let data = imgData.data

    let originalData = ctx.getImageData(0, 0, image.width, image.height).data

    for (var i = 0; i < data.length; i += 4) {
      red = originalData[i + 0]
      green = originalData[i + 1]
      blue = originalData[i + 2]
      alpha = originalData[i + 3]

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

    saveFile(canvas)
  })


  const saveFile = (canvas) => {
    // const outputPath = path.join(__dirname, "output", "test.png")
    const out = fs.createWriteStream(outputFilePath)
    const stream = canvas.createPNGStream()
    stream.pipe(out)
    out.on("finish", () => console.log("The PNG file was created."))
  }

}

// convertImageByFilePath(path.join(__dirname, "originalImages", "icon_dengpao@3x.png"))

module.exports = convertImageByFilePath

////////////////////////
// Helper functions
//

function rgbToHsl(r, g, b){
  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;
  if(max == min){
    h = s = 0; // achromatic
  }else{
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return({ h:h, s:s, l:l });
}

function hslToRgb(h, s, l){
  var r, g, b;
  if(s == 0){
    r = g = b = l; // achromatic
  }else{
    function hue2rgb(p, q, t){
      if(t < 0) t += 1;
      if(t > 1) t -= 1;
      if(t < 1/6) return p + (q - p) * 6 * t;
      if(t < 1/2) return q;
      if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return({
    r:Math.round(r * 255),
    g:Math.round(g * 255),
    b:Math.round(b * 255),
  });
}