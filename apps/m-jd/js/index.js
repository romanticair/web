window.onload = function(){
    //1.��������͸���ȱ仯
    search();
    //2.�ֲ�ͼ
    banner();
    //3.��ɱ����ʱ
    countdown();
};

var search = function () {
    //Ĭ�Ϲ̶�����͸������
    var searchBox = document.querySelector('.jd_search_box');
    var banner = document.querySelector('.jd_banner');
    var height = banner.offsetHeight;
    //����ҳ������¼�
    window.onscroll = function () {
        var scrollTop = this.scrollY;
        //Ĭ��͸����
        var opacity = 0;
        if (scrollTop < height) {
            //��ҳ�����ʱ,����ҳ������ĸ߶ȱ��ʱ,͸����Ҳ���
            opacity = scrollTop / height * 0.85;
        } else {
            //��ҳ�������ҳ������߶ȳ����ֲ�ͼ��ʼλ��ʱ,͸���Ȳ��ٱ仯
            opacity = 0.85;
        }
        searchBox.style.background = 'rgba(201,21,35,' + opacity + ')';
    };
};

var banner = function () {
    //1.�Զ��ֲ�ͼ���޷�,��ʱ��+����
    //2.�������ʱͼƬҲ��Ӧ�ֲ�
    //3.����Ч��,����ͼƬʱ�л�ͼƬ
    //3.1 ��������˲��,�����������1/3��Ļ�����������һ��ͼ
    //3.2 �����лص���ǰͼƬ
    var banner = document.querySelector('.jd_banner');
    //ͼƬ��
    var imgBox = banner.querySelector('ul:first-child');
    var oUl = banner.querySelector('ul:last-child');
    //������
    var indexBox = oUl.querySelectorAll('li');
    //��Ļ���
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

    //������� index
    var index = 1
    var autoChange = function () {
        index++;
        //�ӹ���
        addTransition();
        //��ͼƬ��λ��<<<
        setTranslateX(-index * width);
    }
    var timer = setInterval(autoChange, 1000);

    //ÿһ���ֲ���������ʱ�ж�,�����һ���趨λ����һ��
    imgBox.addEventListener('transitionend', function () {
        //ʵ���޷�����ν�
        if (index >= 9) {
            index = 1;
            //˲�䶨λ�س�ʼ״̬
            removeTransition();
            setTranslateX(-index * width);
        }
        //����ʱҲ��Ҫ�޷��ν�
        else if (index <= 0) {
            index = 8;
            //˲�䶨λ,Ҳ�������
            removeTransition();
            setTranslateX(-index * width);
        }
        //�����������õ�(�ֲ�����ͼ)
        setIndex();
    });

    //����Ч��
    var startX = 0;
    var distanceX = 0;
    var isMove = false;
    imgBox.addEventListener('touchstart', function (e) {
        //������ʼ,����ֲ���ʱ��
        clearInterval(timer);
        //��¼��ʼλ��X����
        startX = e.touches[0].clientX;
    });
    imgBox.addEventListener('touchmove', function (e) {
        //��¼���������е�X����
        var moveX = e.touches[0].clientX;
        //����λ��--����������
        distanceX = moveX - startX;
        //Ԫ�صĶ�λ=��ǰ��λ+�����ƶ��ľ���
        var translateX = -index*width + distanceX;
        //��������Ч��
        removeTransition();
        setTranslateX(translateX);
        isMove = true;
    });
    imgBox.addEventListener('touchend', function (e) {
       //�ƶ�����
        if (isMove){
            if (Math.abs(distanceX) < width/3){
                //û�� 1/3 ��Ļ,��������
                addTransition();
                setTranslateX(-index * width);
            } else {
                //���� 1/3 ��Ļ,�л�ͼƬ
                if (distanceX > 0){
                    //�һ��� ��һ��
                    index--;
                }
                else {
                    //�󻬶� ��һ��
                    index++;
                }
                //���� index ����ͼƬ�л����ֲ�
                addTransition();
                setTranslateX(-index * width);
            }
        }
        //ÿ�δ��������������ò���,����ʼ�ֲ���ʱ��
        startX = 0;
        distanceX = 0;
        isMove = false;
        timer = setInterval(autoChange, 1000);
    });

    //�ֲ������������
    var setIndex = function(){
        //index 1-8
        //ÿ���ֲ����������ǰ����ʽ,�ٸ���
        for (var i=0; i<indexBox.length; i++) {
            indexBox[i].classList.remove('now');
        }
        indexBox[index-1].classList.add('now');
    };
};

var countdown = function () {
    //������ɱʱ�� 4 Сʱ
    var time = 4 * 60 * 60;
    var spans = document.querySelectorAll('.time span');
    var timer = setInterval(function () {
        time--;
        //��ʽ��ʱ��
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