/**
 * Created by User on 2018/10/26.
 */
$(function () {
    //�����л��ֲ�ͼ-�޷�
    //1.�Զ�����
    //2.�����ű仯
    //3.��������л�
    var $banner = $('.sn_banner');
    var width = $banner.width();
    var $imageBox = $banner.find('ul:first');
    var $pointBox = $banner.find('ul:last');
    var $points = $pointBox.find('li');

    var animationFunc = function () {
        //����
        $imageBox.animate({transform:"translateX("+(-index*width)+"px)"}, 200, function () {
            //����ִ����Ļص�
            if(index >= 9) {
                //˲��
                index = 1;
                $imageBox.css({transform:"translateX("+(-index*width)+"px)"});
            } else if (index <= 0){
                index = 8;
                $imageBox.css({transform:"translateX("+(-index*width)+"px)"});
            }
            //index 1-8
            //�����ű仯
            $points.removeClass('now').eq(index-1).addClass('now');
        });
    };
    //�Զ��ֲ�
    var index = 1;
    var timer = setInterval(function () {
        index++;
        animationFunc();
    }, 3000);

    //�����л� android 4.0 ����
    //������ ��һ��
    $banner.on('swipeLeft', function(){
        index++;
        animationFunc();
    });
    //�һ����� ��һ��
    $banner.on('swipeRight', function(){
        index--;
        animationFunc();
    });
});