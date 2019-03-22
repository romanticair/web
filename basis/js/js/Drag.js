function Drag(id) {
	var _this=this;
	this.disX=0;
	this.disY=0;
	this.oParent=document.getElementById(id);
	this.oParent.onmousedown=function(event){
		_this.down(event);
		return false;
	};
}

Drag.prototype.down=function(event) {
	var _this=this;
	this.disX=event.clientX-this.oParent.offsetLeft;
	this.disY=event.clientY-this.oParent.offsetTop;
	document.onmousemove=function(event){
		_this.moving(event);
	}
	document.onmouseup=function(){
		_this.upping();
	}
}

Drag.prototype.moving=function(event) {
	this.oParent.style.left=event.clientX-this.disX+'px';
	this.oParent.style.top=event.clientY-this.disY+'px';
}

Drag.prototype.upping=function() {
	document.onmousemove=null;
	document.onmouseup=null;
}