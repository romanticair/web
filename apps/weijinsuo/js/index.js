/**
 * Created by User on 2018/10/24.
 */
$(function () {
    //��̬�ֲ�ͼ
    banner();
    //�����Ʒҳǩ����
    initMobileTab();
    //��ʼ��������ʾ(��Ʒ��ǩ����)
    $('[data-toggle="tooltip"]').tooltip();
});
var banner = function () {
    //1.��ȡ�ֲ�ͼ���� ajax
    //2.�������ݶ�̬��Ⱦ ���ݵ�ǰ�豸��Ļ����ж�
    //2.1 ׼������
    //2.2 ������ת����html��ʽ�ַ���(��̬����Ԫ��)
    //2.3 ���ַ�����Ⱦ��ҳ����
    //3.���Թ��� ҳ��ߴ緢���ı�������Ⱦ
    //4.�ƶ��������л� - touch

    /*ui��ܣ�bootstrap,����UI,jqueryUI,easyUI,jqueryMobile,mui,framework7*/
    /*�����ƶ��˵�UI��ܣ�bootstrap,jqueryMobile,mui,framework7*/
    /*ģ�����棺artTemplate,handlebars,mustache,baiduTemplate,velocity,underscore*/

    //1.���ݻ���
    var getData = function (callback) {
        //�ѻ�������?
        if(window.data){
            callback && callback(window.data);
        } else {
            //��ȡ�ֲ�ͼ����
            $.ajax({
                type:'get',
                url:'js/data.json',
                //ǿ��ת����̨���ص�����Ϊjson����
                //ǿ��ת�����ɹ����򱨴�,����ִ��success,ִ��error�ص�
                dataType: 'json',
                data: '',
                success: function (data) {
                    window.data = data;
                    callback && callback(window.data);
                }
            });
        }
    };

    //2.ģ����Ⱦ
    var render = function () {
        getData(function (data) {
            var isMobile = $(window).width() < 768 ? true: false;
            //��ʹ��ģ������: html��̬�������ɶ�̬
            //������+ͼƬ����+�½�ģ��
            //<% console.log(list); %> ģ�������ڲ���ʹ���ⲿ����
            var pointHtml = template('pointTemplate', {list:data});
            var imageHtml = template('imageTemplate', {list:data,isMobile:isMobile});
            //��Ⱦҳ��
            $('.carousel-indicators').html(pointHtml);
            $('.carousel-inner').html(imageHtml);
        });
    };

    //3.���Թ���
    $(window).on('resize', function () {
        render();
        //ͨ��js���������¼�
    }).trigger('resize');

    //4.�ƶ��������л�
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    //originalEvent ����jsԭ���¼�
    $('.wjs_banner').on('touchstart',function (e) {
        startX = e.originalEvent.touches[0].clientX;
    }).on('touchmove', function (e) {
        var moveX = e.originalEvent.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    }).on('touchend',function (e) {
        /*�����㹻 50px һ��Ҫ������*/
        if(isMove && Math.abs(distanceX) > 50){
            /*����*/
            /*������*/
            if(distanceX < 0){
                //console.log('next');
                $('.carousel').carousel('next');
            }
            /*�һ�����*/
            else {
                //console.log('prev');
                $('.carousel').carousel('prev');
            }
        }
        startX = 0;
        distanceX = 0;
        isMove = false;
    });
};

var initMobileTab = function () {
    /*1.�����������*/
    var $navTabs = $('.wjs_product .nav-tabs');
    var length = 0;
    $navTabs.find('li').each(function (i, item) {
        var $currentLi = $(this);
        /*
         * width()  ����
         * innerWidth() ����+�ڱ߾�
         * outerWidth() ����+�ڱ߾�+�߿�
         * outerWidth(true) ����+�ڱ߾�+�߿�+��߾�
         * */
        var width = $currentLi.outerWidth(true);
        length += width;
    });
    /*2.�޸Ľṹʹ֮���򻬶��Ľṹ*/
    //��һ���������� .nav-tabs ��  .nav-tabs-parent
    $navTabs.width(length);
    /*3.�Լ�ʵ�ֻ���Ч�� ���� ʹ��iscroll */
    new IScroll($('.nav-tabs-parent')[0], {
        scrollX:true,
        scrollY:false,
        click:true,
    });
};
