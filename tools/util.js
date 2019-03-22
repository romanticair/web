// 转换图片为 base64
function conversionImageToBase64(file, cb) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function() {
  cb(this.result);
  }
}
