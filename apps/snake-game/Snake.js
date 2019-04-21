/**
 * Created by User on 2018/10/3.
 */

// ���Ե�����
(function () {
  // �洢����ɵ�����
  var elements = [];

  function Snake(map, width, height, direction) {
    //�ߵȼ�,ÿ������ʳ��,����һ��
    this.level = 0;
    //��ǰ����8����ɫ��ÿ��һ������һ��ɫ����ɫΪ��߼�����ɫ
    this.colorArr = [
      'white', 'green', 'blue', 'orange',
      'purple', 'pink', 'red', 'yellow'
    ];
    // �ߵ�������ɣ���ʼ������Ϊ3��ͷ��Ϊ����0
    this.body = [
      {x: 2, y: 2, color: this.colorArr[0]},
      {x: 1, y: 2, color: "blue"},
      {x: 0, y: 2, color: "blue"}
    ];
    this.map = map;
    // �ߵ�������ɶ�����ȵ�
    this.width = width || 20;
    this.height = height || 20;
    this.direction = direction || "right";
    // Ĭ���ٶ�
    this.speed = 1;

  };

  // �����߳�ʼ��
  Snake.prototype.init = function () {
    this.remove();
    for (var i = 0; i < this.body.length; i++) {
      // ��ͷ����ʼ����
      var aDiv = document.createElement("div");
      aDiv.style.position = "absolute";
      aDiv.style.width = this.width + "px";
      aDiv.style.height = this.height + "px";
      aDiv.style.backgroundColor = this.body[i].color;
      aDiv.style.left = this.body[i].x * this.width + "px";
      aDiv.style.top = this.body[i].y * this.height + "px";
      //aDiv.style.borderRadius = 5 + 'px';
      this.map.appendChild(aDiv);
      elements.push(aDiv);
    }
  };

  // ���߶�̬������
  Snake.prototype.move = function (food, speed) {
    // �Ͷ�Ӧ����������
    speed = speed || this.speed;
    var i = this.body.length - 1;
    for (; i > 0; i--) {
      this.body[i].x = this.body[i - 1].x;
      this.body[i].y = this.body[i - 1].y;
    }
    // ͷ���ƶ�
    switch (this.direction) {
      case "top":
        this.body[0].y -= speed;
        break;
      case "right":
        this.body[0].x += speed;
        break;
      case "bottom":
        this.body[0].y += speed;
        break;
      case "left":
        this.body[0].x -= speed;
        break;
    }
    //����Ƿ�Ե����е�ʳ����
    var headX = this.body[0].x * this.width;
    var headY = this.body[0].y * this.height;
    if (headX == food.x && headY == food.y) {
      this.grow();
      //����֮�󣬸���ʳ��λ��
      food.init();
      //�ж��Ƿ�ﵽ��������,ע�⣺���˲��ܱ䣬����Ҫ��1
      if ((food.count - 1) % 3 == 0) {
        this.level++;
        //�ﵽ����������ı���ɫ
        this.changeColor();
      }
    }
  };

  // ���ƶ�ʱ��ɾ���ɽ�㣬��������λ��
  Snake.prototype.remove = function () {
    var index = elements.length - 1;
    for (; index >= 0; index--) {
      // ��β����ʼɾ��
      var aDiv = elements[index];
      aDiv.parentNode.removeChild(aDiv);
      // ͬʱɾ������
      elements.splice(index, 1);
    }
  };

  // �߳Ե�ʳ��������
  Snake.prototype.grow = function () {
    var last = this.body[this.body.length - 1];
    this.body.push({
      x: last.x,
      y: last.y,
      color: last.color
    });
  };

  //������ʱ����
  Snake.prototype.speedup = function (direction) {
    for (var i = 0; this.body.length > i; i++) {
      switch (direction) {
        case 'left':
          this.body[i].x--;
          break;
        case 'right':
          this.body[i].x++;
          break;
        case 'top':
          this.body[i].y--;
          break;
        case 'bottom':
          this.body[i].y++;
      }
    }
  };

  //������������ɫ
  Snake.prototype.changeColor = function () {
    this.body[0].color = this.colorArr[this.level];
  };

  window.Snake = Snake;
}());