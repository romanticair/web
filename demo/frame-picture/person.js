/**
 * Created by User on 2018/10/21.
 */

// running man
var Person = function(ctx){
  // ֡ͼ���ߵ�����
  this.ctx = ctx || document.querySelector('canvas').getContext('2d')
  this.canvasWidth = this.ctx.canvas.width
  this.canvasHeight = this.ctx.canvas.height
  // ����Ĭ��ѡ��һ��ͼ, ��0 ��1 ��2 3��
  this.direction = 0
  // ����ͬһ�����в�ͬ����
  this.index = 0
  // �����ٶ�
  this.speed = 10
}

// ��ʼ��
Person.prototype.init = function(imageUrl) {
  this.loadImage(imageUrl)
}

// ����ͼƬ
Person.prototype.loadImage = function(imageUrl) {
  var that = this
  var image = new Image()
  image.onload = function(){
    // ����ͼƬ��ɺ�ִ�����´���
    // ��ȡͼƬ��С
    // �󶨼�������¼�
    that.imageWidth = image.width
    that.imageHeigth = image.height
    that.personWidth = that.imageWidth / 4
    that.personHeight = that.imageHeigth / 4
    // ԭ��
    that.x0 = that.canvasWidth / 2 - that.personWidth / 2
    that.y0 = that.canvasHeight / 2 - that.personHeight / 2
    // ͼƬ�󶥵�λ��,���ߺ�ı�
    that.location = {x:that.x0, y:that.x0}
    that.drawImage(image)
    that.controler(image)
  }
  image.src = imageUrl
}

// �滭ͼƬ
Person.prototype.drawImage = function(image) {
  // �����֮ǰ�Ļ滭
  this.ctx.clearRect(0,0,this.canvasWidth,this.canvasHeight)
  // index����ͬһ����Ĳ�ͬ����
  this.ctx.drawImage(image,
    this.index*this.personWidth, this.direction*this.personHeight,
    this.personWidth, this.personHeight,
    this.location.x, this.location.y,
    this.personWidth, this.personHeight
    )

  this.index++
  if (this.index > 3) {
      this.index = 0
  }
}

Person.prototype.controler = function(image){
  var that = this
  // ����֡ͼ
  document.onkeydown = function(event) {
    if(event.keyCode == 40) {
      // ǰ
      that.direction = 0
      that.location.y += that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 37) {
      // ��
      that.direction = 1
      that.location.x -= that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 39) {
      // ��
      that.direction = 2
      that.location.x += that.speed
      that.drawImage(image)
    }
    else if (event.keyCode == 38) {
      // ��
      that.direction = 3
      that.location.y -= that.speed
      that.drawImage(image)
    }
  }
}
