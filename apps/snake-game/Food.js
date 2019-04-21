/**
 * Created by User on 2018/10/3.
 */

// ʳ�����{�ú���
(function () {
  // ��������ÿ��ʳ��
  var foods = [];

  function Food(map, x, y, width, height, color) {
    this.map = map;
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 20;
    this.height = height || 20;
    this.color = color || "deeppink";
    //������ʳ��Ĵ�������
    this.count = 0;
  };

  // �ڵ�ͼ������ʳ�ÿ�γ�ʼ������ȥ������ʳ��
  Food.prototype.init = function () {
    // console.dir(this);
    this.remove();
    var food = document.createElement("div");
    this.x = parseInt(Math.random() * this.map.offsetWidth / this.width) * this.width;
    this.y = parseInt(Math.random() * this.map.offsetHeight / this.height) * this.height;
    food.style.position = "absolute";
    food.style.width = this.width + "px";
    food.style.height = this.height + "px";
    food.style.left = this.x + "px";
    food.style.top = this.y + "px";
    food.style.backgroundColor = this.color;
    this.map.appendChild(food);
    foods.push(food);
    this.count++;
  };

  // ���ʳ��
  Food.prototype.remove = function () {
    for (var i = 0; foods.length > 0; i++) {
      var food = foods[i];
      food.parentNode.removeChild(food);
      // ͬʱ��������洢��ʳ��Ҳɾȥ��
      foods.splice(i, 1);
    }
  };

  window.Food = Food;
}());
