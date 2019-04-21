window.onload = function(){
    //1.顶部搜索透明度变化
    search();
    //2.轮播图
    banner();
    //3.秒杀倒计时
    countdown();
};

var search = function () {
    //默认固定顶部透明背景
    var searchBox = document.querySelector('.jd_search_box');
    var banner = document.querySelector('.jd_banner');
    var height = banner.offsetHeight;
    //监听页面滚动事件
    window.onscroll = function () {
        var scrollTop = this.scrollY;
        //默认透明度
        var opacity = 0;
        if (scrollTop < height) {
            //当页面滚动时,随着页面卷曲的高度变大时,透明度也变大
            opacity = scrollTop / height * 0.85;
        } else {
            //当页面滚动的页面卷曲高度超过轮播图起始位置时,透明度不再变化
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201,21,35,' + opacity + ')';
    };
};

var banner = function () {
    //1.自动轮播图且无缝,定时器+过渡
    //2.点击索引时图片也相应轮播
    //3.滑动效果,滑动图片时切换图片
    //3.1 滑动结束瞬间,滑动距离大于1/3屏幕的则滚动到下一张图
    //3.2 否则切回到当前图片
    var banner = document.querySelector('.jd_banner');
    //图片组
    var imgBox = banner.querySelector('ul:first-child');
    var oUl = banner.querySelector('ul:last-child');
    //索引组
    var indexBox = oUl.querySelectorAll('li');
    //屏幕宽度
    var width = banner.offsetWidth;
    
    var addTransition = function () {
        imgBox.style.transition = 'all 0.2s';
        imgBox.style.webkitTransition = 'all 0.2s';
    }
    var removeTransition = function () {
        imgBox.style.transition = 'none';
        imgBox.style.webkitTransition = 'none';
    }
    var setTranslateX = function (translateX) {
        imgBox.style.transform = 'translateX(' + translateX + 'px)';
        imgBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
    }

    //程序核心 index
    var index = 1
    var autoChange = function () {
        index++;
        //加过渡
        addTransition();
        //给图片做位移<<<
        setTranslateX(-index * width);
    }
    var timer = setInterval(autoChange, 1000);

    //每一张轮播动画结束时判断,到最后一张需定位到第一张
    imgBox.addEventListener('transitionend', function () {
        //实现无缝滚动衔接
        if (index >= 9) {
            index = 1;
            //瞬间定位回初始状态
            removeTransition();
            setTranslateX(-index * width);
        }
        //滑动时也需要无缝衔接
        else if (index <= 0) {
            index = 8;
            //瞬间定位,也先清过度
            removeTransition();
            setTranslateX(-index * width);
        }
        //根据索引设置点(轮播哪张图)
        setIndex();
    });

    //滑动效果
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    imgBox.addEventListener('touchstart', function (e) {
        //触摸开始,清除轮播定时器
        clearInterval(timer);
        //记录起始位置X坐标
        startX = e.touches[0].clientX;
    });
    imgBox.addEventListener('touchmove', function (e) {
        //记录滑动过程中的X坐标
        var moveX = e.touches[0].clientX;
        //计算位移--有正负方向
        distanceX = moveX - startX;
        //元素的定位=当前定位+触摸移动的距离
        var translateX = -index*width + distanceX;
        //做出滑动效果
        removeTransition();
        setTranslateX(translateX);
        isMove = true;
    });
    imgBox.addEventListener('touchend', function (e) {
       //移动距离
        if (isMove){
            if (Math.abs(distanceX) < width/3){
                //没过 1/3 屏幕,吸附回来
                addTransition();
                setTranslateX(-index * width);
            } else {
                //超过 1/3 屏幕,切换图片
                if (distanceX > 0){
                    //右滑动 上一张
                    index--;
                }
                else {
                    //左滑动 下一张
                    index++;
                }
                //根据 index 控制图片切换并轮播
                addTransition();
                setTranslateX(-index * width);
            }
        }
        //每次触摸滑动过后重置参数,并开始轮播定时器
        startX = 0;
        distanceX = 0;
        isMove = false;
        timer = setInterval(autoChange, 1000);
    });

    //轮播下面的索引点
    var setIndex = function(){
        //index 1-8
        //每次轮播都先清除先前的样式,再更新
        for (var i=0; i<indexBox.length; i++) {
            indexBox[i].classList.remove('now');
        }
        indexBox[index-1].classList.add('now');
    };
};

var countdown = function () {
    //距离秒杀时间 4 小时
    var time = 4 * 60 * 60;
    var spans = document.querySelectorAll('.time span');
    var timer = setInterval(function () {
        time--;
        //格式化时间
        var h = Math.floor(time/3600);
        var m = Math.floor(time%3600/60);
        var s = Math.floor(time%60);
        spans[0].innerHTMl = Math.floor(h/10);
        spans[1].innerHTML = h%10;
        spans[3].innerHTML = Math.floor(m/10);
        spans[4].innerHTML = m%10;
        spans[6].innerHTML = Math.floor(s/10);
        spans[7].innerHTML = s%10;
        if(time <= 0){
            clearInterval(timer);
        }
    }, 1000);
};