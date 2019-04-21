/**
 * Created by User on 2018/10/26.
 */
$(function () {
    //手势切换轮播图-无缝
    //1.自动播放
    //2.点随着变化
    //3.完成手势切换
    var $banner = $('.sn_banner');
    var width = $banner.width();
    var $imageBox = $banner.find('ul:first');
    var $pointBox = $banner.find('ul:last');
    var $points = $pointBox.find('li');

    var animationFunc = function () {
        //动画
        $imageBox.animate({transform:"translateX("+(-index*width)+"px)"}, 200, function () {
            //动画执行完的回调
            if(index >= 9) {
                //瞬间
                index = 1;
                $imageBox.css({transform:"translateX("+(-index*width)+"px)"});
            } else if (index <= 0){
                index = 8;
                $imageBox.css({transform:"translateX("+(-index*width)+"px)"});
            }
            //index 1-8
            //点随着变化
            $points.removeClass('now').eq(index-1).addClass('now');
        });
    };
    //自动轮播
    var index = 1;
    var timer = setInterval(function () {
        index++;
        animationFunc();
    }, 3000);

    //手势切换 android 4.0 兼容
    //左滑手势 下一张
    $banner.on('swipeLeft', function(){
        index++;
        animationFunc();
    });
    //右滑手势 上一张
    $banner.on('swipeRight', function(){
        index--;
        animationFunc();
    });
});