/**
 * Created by User on 2018/10/3.
 */

//��Ϸ���á��������
(function () {
  var that = null;

  function Game(map) {
    this.map = map;
    this.food = new Food(map);
    this.snake = new Snake(map);
    this.x = this.map.offsetWidth / this.snake.width;
    this.y = this.map.offsetHeight / this.snake.height;
    that = this;
  };

  //�������ó�ʼ��
  Game.prototype.init = function () {
    this.food.init();
    this.snake.init();
    this.runSnake();
    this.bindKey();
  };

  // �������Ƿ񳬳����޺��Ƿ�Ե�ʳ��
  Game.prototype.check = function (timer) {
    var snakeX = this.snake.body[0].x;
    var snakeY = this.snake.body[0].y;
    if (0 > snakeX || snakeX >= this.x || 0 > snakeY || snakeY >= this.y) {
      clearInterval(timer);
      window.alert("������");
    }
  };

  //���������¼�
  Game.prototype.bindKey = function () {
    document.addEventListener("keydown", function (e) {
      switch (e.keyCode) {
        //������µļ��̷����������ƶ��ķ���һ�£�����߼���
        case 37:
          if (this.snake.direction == "left") {
            this.snake.speedup('left');
          }
          else {
            this.snake.direction = "left";
          }
          break;
        case 38:
          if (this.snake.direction == "top") {
            this.snake.speedup('top');
          }
          else {
            this.snake.direction = "top";
          }
          break;
        case 39:
          if (this.snake.direction == "right") {
            this.snake.speedup('right');
          }
          else {
            this.snake.direction = "right";
          }
          break;
        case 40:
          if (this.snake.direction == "bottom") {
            this.snake.speedup('bottom');
          }
          else {
            this.snake.direction = "bottom";
          }
          break;
      }
      //.bind(that)��ʹ�������п�ʹ��ʵ��������this
    }.bind(that), false);
  };

  // ʹ�߶�ʱ�����˶�����0.1���ƶ�һ��
  Game.prototype.runSnake = function () {
    var timer = setInterval(function () {
      this.snake.move(this.food);
      this.snake.init();
      //�ϵ�ģʽ����check������ע�͵�
      this.check(timer);
    }.bind(that), 100);
  };

  window.Game = Game;
}());