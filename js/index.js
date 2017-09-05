// 顶部通栏
$(function () {
    $('.shopping').mouseover(function () {
        $('.shopping_list').stop().slideDown();
    }).mouseout(function () {
        $('.shopping_list').stop().slideUp();
    })

})
//导航栏
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/nav',
        success: function (data) {
            var reserve = JSON.parse(data);
            $('.navTemplate').append(template('navTemplate', reserve));
            //找到导航中的所有li标签
            var lis = $('.navTemplate').find('li');
            //将有下拉菜单的鼠标遍历出来
            // console.log(lis);
            for (var i = 0; i < 7; i++) {
                //给有下拉菜单的li标签设置鼠标移入事件
                $(lis[i]).find('a').mouseover(function () {
                    // console.log($(this));                    
                    $.ajax({
                        url: 'http://127.0.0.1:9900/api/nav',
                        dataType: "json",
                        data: { type: this.parentNode.type },
                        success: function (data) {
                            // var res = JSON.parse(data);
                            var reserve = "";
                            for (var i = 0; i < data.length; i++) {
                                var obj = {
                                    sourcePath: data[i]['sourcePath'],
                                    imgUrl: data[i]['imgUrl'],
                                    name: data[i]['name'],
                                    price: data[i]['price']
                                }
                                // console.log(obj);
                                reserve += template('downTemplate', obj)
                            }
                            $('.navDown').find('ul').html(reserve)
                        }
                    })
                    $('.navDown').stop().slideDown()
                }).mouseout(function () {
                    $('.navDown').stop().slideUp()
                })
            }
            $('#nav .navDown').mouseover(function () {
                $(this).stop().slideDown();
            }).mouseout(function () {
                $(this).stop().slideUp();
            })
        }

    })








})
// 轮播图
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/lunbo',
        // dataType:'json',
        success: function (data) {
            var obj = JSON.parse(data);
            // console.log(obj)
            var slideDown = '';
            for (var i = 0; i < obj.length; i++) {
                var slide = {
                    sourceUrl: obj[i]['sourceUrl'],
                    imgUrl: obj[i]['imgUrl']
                }
                slideDown += template('slideTemplate', slide);
            }
            $('.slideshow').find('ul').html(slideDown);
            $('.slideshow').find('li').first().clone().appendTo($('.slideshow').find('ul'))
            var time = 0;
            var timeId = null;
            // 自动轮播
            autoLb()
            function autoLb() {
                clearInterval(timeId)
                timeId = setInterval(function () {
                    selfMotion()
                }, 2000)
            }
            function selfMotion() {
                if (time == 5) {
                    time = 0;
                }
                time++;
                $('.slideshow').find('li').eq(time).siblings('li').fadeOut(300);
                $('.slideshow').find('li').eq(time).fadeIn(300);
            }

            //鼠标移入停止轮播，鼠标离开自动轮播
            $('.slideshow').mouseover(function () {
                clearInterval(timeId)
            }).mouseout(function () {
                autoLb()
            })

            // 点击下一张
            $('.slideshow .btn_right').click(function () {
                selfMotion();
            })
            // 点击上一张
            $('.slideshow .btn_left').click(function () {
                if (time == 0) {
                    time = 5;
                }
                time--;
                $('.slideshow').find('li').eq(time).siblings('li').fadeOut(300);
                $('.slideshow').find('li').eq(time).fadeIn(300);
            })
        }

    })
})

// 侧边栏
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/items',
        success: function (data) {
            var arr = JSON.parse(data)
            // console.log(arr);
            var side = "";
            for (var i = 0; i < arr.length; i++) {
                var obj = {
                    type: arr[i]['type'],
                    content: arr[i]['content']
                }
                side += template('barTemplate', obj)
            }
            $('.sidebar').find('ul').html(side);
            // 获取所有的li标签，给li标签注册一个移动事件 
            var lis = $('.sidebar ul').find('li');
            for (var i = 0; i < lis.length; i++) {
                $(lis[i]).mouseover(function () {
                    $.ajax({
                        url: 'http://127.0.0.1:9900/api/items',
                        dataType: 'json',
                        data: {
                            type: this.type
                        },
                        success: function (data) {
                            // console.log(data);
                            var n = Math.ceil(data.length / 6)
                            $('.right_frame').css('width', n * 265 + 'px')
                            var str = '';
                            for (var i = 0; i < data.length; i++) {
                                var obj = {
                                    sourceUrl: data[i]['sourceUrl'],
                                    imgUrl: data[i]['imgUrl'],
                                    name: data[i]['name']
                                }
                                var flag = data[i]['buyStatus'];
                                if (flag === 'true') {
                                    str += template('frameTemplate1', obj)
                                } else {
                                    str += template('frameTemplate2', obj)
                                }
                            }
                            $('.right_frame').html(str);
                        }
                    })
                    $('.right_frame').stop().show();
                }).mouseout(function () {
                    $('.right_frame').stop().hide();
                })
            }
            $('.right_frame').mouseover(function () {
                $(this).show()
            }).mouseout(function () {
                $(this).hide();
            })
        }
    })



})
// 智能硬件
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/hardware',
        dataType: 'json',
        success: function (data) {
            //    console.log(data);
            var str = '';
            for (var i = 0; i < data.length; i++) {
                var obj = {
                    discount: data[i]['discount'],
                    sourceUrl: data[i]['sourceUrl'],
                    imgUrl: data[i]['imgUrl'],
                    title: data[i]['title'],
                    desc: data[i]['desc'],
                    price: data[i]['price']
                }
                if (data[i]['discount'] == '') {
                    str += template('hardwareTemplate2', obj);
                } else {
                    str += template('hardwareTemplate1', obj);
                }
            }
            $('.hardware').find('ul').html(str);
        }
    })
})
// 搭配，配件，周边
$(function () {

    function capacity(js) {
        $.ajax({
            url: 'http://127.0.0.1:9900/api/product',
            data: { toptitle: js.match },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                $(js.title).html(template('matchTemplate', data))
                var lis = $(js.titleul).find('li');
                $(lis).eq(0).addClass('active');
                $(js.left).html(template('leftGoods', data))
                var str = "";
                var hot = data[js.length]
                // console.log(hot)
                for (var i = 0; i < hot.length; i++) {
                    var obj = {
                        sourceUrl: hot[i]['sourceUrl'],
                        imgUrl: hot[i]['imgUrl'],
                        title: hot[i]['title'],
                        price: hot[i]['price'],
                        heat: hot[i]['heat'],
                        reviewDesc: hot[i]['reviewDesc'],
                        reviewAuthor: hot[i]['reviewAuthor']
                    }
                    if (hot[i]['reviewDesc'] == "") {
                        str += template('hotgoods2', obj)
                    } else {
                        str += template('hotgoods1', obj)
                    }
                }
                $(js.right).find('ul').html(str)
                // console.log(lis);
                for (var i = 0; i < lis.length; i++) {
                    $(lis[i]).mouseover(function () {
                        // console.log($(this).attr('key'))
                        $(this).addClass('active');
                        $(this).siblings().removeClass('active');
                        $.ajax({
                            url: 'http://127.0.0.1:9900/api/product',
                            data: {
                                key: $(this).attr('key')
                            },
                            dataType: 'json',
                            success: function (data) {
                                // console.log(data)
                                var ret = "";
                                for (var i = 0; i < data.datas.length; i++) {
                                    var obje = {
                                        sourceUrl: data.datas[i]['sourceUrl'],
                                        imgUrl: data.datas[i]['imgUrl'],
                                        title: data.datas[i]['title'],
                                        price: data.datas[i]['price'],
                                        heat: data.datas[i]['heat'],
                                        reviewDesc: data.datas[i]['reviewDesc'],
                                        reviewAuthor: data.datas[i]['reviewAuthor']
                                    }
                                    if (data.datas[i]['reviewDesc'] == "") {
                                        ret += template('hotgoods2', obje)
                                    } else {
                                        ret += template('hotgoods1', obje)
                                    }
                                }
                                $(js.right).find('ul').html(ret)
                            }
                        })
                    })
                }
            }
        })
    }
    // 搭配
    var js = {
        match: 'match',
        title: '.mat_ti',
        titleul: '.mat_ti ul',
        left: '.mat_le',
        right: '.mat_ri',
        length: 'hotgoods'
    }
    capacity(js)
    //配件
    var par = {
        match: 'accessories',
        title: '.parts_ti',
        titleul: '.parts_ti ul',
        left: '.parts_le',
        right: '.parts_ri',
        length: 'hot'
    }
    capacity(par)
    //周边
    var rim = {
        match: 'around',
        title: '.rim_ti',
        titleul: '.rim_ti ul',
        left: '.rim_le',
        right: '.rim_ri',
        length: 'hotcloths'
    }
    capacity(rim)
})
// 为你推荐
$(function () {
    var activeIndex = 1;
    $.ajax({
        url: 'http://127.0.0.1:9900/api/recommend',
        data: { page: activeIndex },
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            $('.recList').html(template('listTemplate', data))
        }
    })
    $('.head .but .ri_but').click(function () {
        if (activeIndex >= 4) {
            activeIndex = 4
            $('.ri_but').siblings().addClass('active');
            $('.ri_but').removeClass('active');
        } else {
            activeIndex++
            $('.le_but').siblings().addClass('active');
            $('.le_but').addClass('active');
        }
        $.ajax({
            url: 'http://127.0.0.1:9900/api/recommend',
            data: { page: activeIndex },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                $('.recList').append(template('listTemplate', data));
                $('.recList').css('transition', 'all 1s')
                $('.recList').css('transform', 'translateX(-' + 1226 * (activeIndex - 1) + 'px)')
            }
        })
    })
    $('.head .but .le_but').click(function () {
        if (activeIndex <= 1) {
            activeIndex = 1
            $('.le_but').siblings().addClass('active');
            $('.le_but').removeClass('active');
        } else {
            activeIndex--
            $('.le_but').siblings().addClass('active');
            $('.le_but').addClass('active');
        }
        $.ajax({
            url: 'http://127.0.0.1:9900/api/recommend',
            data: { page: activeIndex },
            dataType: 'json',
            success: function (data) {
                // console.log(data);
                $('.recList').append(template('listTemplate', data));
                $('.recList').css('transition', 'all 1s')
                $('.recList').css('transform', 'translateX(-' + 1226 * (activeIndex - 1) + 'px)')
            }
        })
    })

})
//热评产品
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/hotcomment',
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            $('.bulist').html(template('buzz_Template', data))
        }
    })
})
// 内容
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/content',
        dataType: 'json',
        success: function (data) {
            console.log(data)
            $('.matlist').html(template('matTem', data))
            var mySwiper = new Swiper('.swiper-container', {
                // direction: 'vertical',   
                loop: true,
                // 如果需要分页器
                pagination: '.swiper-pagination',
                // 如果需要前进后退按钮
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: true,
            })
        }
    })
})
// 视频
$(function () {
    $.ajax({
        url: 'http://127.0.0.1:9900/api/video',
        dataType: 'json',
        success: function (data) {
            // console.log(data)
            $('.video_list').html(template('videpTemplate', data))
        }
    })
})