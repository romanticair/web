function LimitDrag(id) {
	Drag.call(this, id);      //继承属性
}

for(var i in Drag.prototype) { //继承方法
	LimitDrag.prototype[i]=Drag.prototype[i];
}

LimitDrag.prototype.moving=function(event){ //方法重写
	var x=event.clientX-this.disX;
	var y=event.clientY-this.disY;
	if(x<0) {
		x=0;
	}
	else if(x>document.documentElement.clientWidth-this.oParent.offsetWidth) {
		x=document.documentElement.clientWidth-this.oParent.offsetWidth;
	}
	this.oParent.style.left=x+'px';
	this.oParent.style.top=y+'px';
}