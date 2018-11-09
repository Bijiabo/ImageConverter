/*
* 使用浏览器来调试颜色转换方法
*
* */
var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");
ctx.fillStyle="#FF0000";
// ctx.fillRect(0,0,150,75);
var cw=canvas.width;
var ch=canvas.height;
var imgData,data,originalData;

var img=new Image();
img.crossOrigin='anonymous';
img.onload=start;
img.src="./icon.png";

function start() {
  ctx.drawImage(img, 0, 0);

  imgData=ctx.getImageData(0,0,cw,ch);
  data=imgData.data;
  imgData1=ctx.getImageData(0,0,cw,ch);
  originalData=imgData1.data;

}


$myslider=$('#myslider');
$myslider.attr({min:0,max:33}).val(0);
$myslider.on('input change',function(){
  var value=parseInt($(this).val());
  HueShift(30,300,-value/100);
});

$("#download").on("click", function () {
  var d=canvas.toDataURL("image/png");
  var w=window.open('about:blank','image from canvas');
  w.document.write("<img src='"+d+"' alt='from canvas'/>");
})

function HueShift(hue1,hue2,shift){

  for(var i=0;i<data.length;i+=4){
    red=originalData[i+0];
    green=originalData[i+1];
    blue=originalData[i+2];
    alpha=originalData[i+3];

    // skip transparent/semiTransparent pixels
    // console.log(red, green, blue, alpha)
    // if(alpha<230){continue;}
    if (alpha === 0) {
      continue;
    }

    var hsl=rgbToHsl(red,green,blue);
    var hue=hsl.h*360;

    // change redish pixels to the new color
    // if(hue<30 || hue>300){


      // var newRgb=hslToRgb(hsl.h+shift,hsl.s,hsl.l);
      var newRgb=hslToRgb(hsl.h+shift,100,100);
      data[i+0]=newRgb.r;
      data[i+1]=newRgb.g;
      data[i+2]=newRgb.b;
      data[i+3]=255;
    // }
  }
  ctx.putImageData(imgData,0,0);
}






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