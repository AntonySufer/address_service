/***
 *@author antonty
 *@param  服务区选择
 *@date 2016.12.21
 */

 //初始化配置
    var getAddressUrl ="http://saas.mljia.cn/saas.shop/location";//请求sass地区接口 /province/25329/city/25330/region//直辖市省直接返回区
    var levelPrivenceList =[];//直辖市

     //如果是修改
    var privence_value=$('input[name=province_value]').val();// 省值
    var city_value=$('input[name=city_value]').val();;//市
    var area_value=$('input[name=area_value]').val();;//区



var show_adress = {
    _init: function () {
        this.bindEvent();
        this.getPrivence();//获取省份

    },//绑定方法
    bindEvent: function () {
        var _this = this ;
        //获取省份
        $('#address_but').on('click',function () {
            _this.getPrivence();//获取省份


        })
         //关闭地
        $('#close_but').on('click',function () {
            $('#chose_address_win').hide();//地区
            $('#shawn_show').hide();//遮罩

        })

        //确定省份
        $('#sure_but').on('click',function () {
            var privence_str="";// 省值
            var city_str="";//市
            var area_str="";//区
            /***********************省end********************************************/
            $("input[name=privence]:checked").each(function() {
                //确定省
                var privenceId = $(this).val();//当前值


                //判断当前是否展开
                var isClass =$("i[data-privence_code="+privenceId+"]").hasClass('fa-chevron-right');//一级
                if(!isClass){
                    //以展开
                      //这里得区分是否是直辖市 直辖市通过区判断是否全选 上海（1），北京（4463），天津（18077），重庆（56322）
                    if(privenceId==1 ||privenceId==4463 |privenceId==18077||privenceId==56322){
                        var area_length= $("input[data-city_code="+privenceId+"]").attr('data-area_length');//获取当前直辖市下有多少区
                        var city_checked =$("input[data-city_code="+privenceId+"]:checked").length;//获取获取选择多少区
                        if(area_length==city_checked){
                            //市被全选
                            privence_str+=privenceId+","; //储存省
                        }else {
                            privence_str += "";
                        }
                    }else{
                        var city_length= $("input[data-privence_code="+privenceId+"]").attr('data-city_length');//获取当前省份下有多少市
                        var city_checked =$("input[data-privence_code="+privenceId+"]:checked").length;//获取获取选择多少市
                        if(city_length==city_checked){
                            //市被全选
                            privence_str+=privenceId+","; //储存省
                        }else {
                            privence_str += "";
                        }
                    }

                }else{
                    //没展开
                    privence_str+=privenceId+","; //储存省
                }

                /***********************省end********************************************/
            });
            /***********************市s********************************************/
            $("input[name=city]:checked").each(function(){

                var cityId = $(this).val();
                var privenced = $(this).attr('data-privence_code');//获取省id
                var city_length= $(this).attr('data-city_length');//获取当前省份下有多少市
                var city_checked =$("input[data-privence_code="+privenced+"]:checked").length;//获取获取选择多少市
                if(city_length==city_checked){
                    //市被全选
                    city_str+="";
                }else {
                    //存储
                    city_str+=cityId+",";
                }

            })


            /***********************市e********************************************/

            /**********************区s********************************************/
            $("input[name='area']:checked").each(function(){
                var areaid = $(this).val();
                var  priOrcity_code= $(this).attr('data-city_code');//获取市id //如果是直辖市，这里是省id
                var area_length= $(this).attr('data-area_length');//获取当前省份下有多少市
                var city_checked =$("input[data-city_code="+priOrcity_code+"]:checked").length;//获取获取选择多少市
                if(area_length==city_checked){
                    //市被全选
                    area_str+="";
                }else {
                    //存储
                    area_str+=areaid+",";
                }
            })
            /**********************区e********************************************/
           // console.log(privence_str+"///"+city_str+"///"+area_str);
             if(privence_str){
                 privence_value = privence_str.substring(0, privence_str.lastIndexOf(','));//去逗号
                 console.log('省：'+privence_value);
             }
            if(city_str){
                city_value =  city_str.substring(0, city_str.lastIndexOf(','));//去逗号
                console.log('市：'+city_value);
            }
            if(area_str){
                area_value =  area_str.substring(0, area_str.lastIndexOf(','));
                console.log('区：'+area_value);
            }

 
            /**給隐藏域  form 提交**/
            $('input[name=province_value]').val(privence_value);
            $('input[name=city_value]').val(city_value);
            $('input[name=area_value]').val(area_value);
           
           $('.privence_value').html('省'+privence_value);
           $('.city_value').html('市'+city_value);
           $('.area_value').html('区'+area_value);

            $('#chose_address_win').hide();//地区
            $('#shawn_show').hide();//遮罩

    })




},
//获取省列表
getPrivence :function () {
    var _this = this ;
    $.ajax({
        url: getAddressUrl+'/province',
        type: 'get',
        dataType: 'json',
        //async:false,
        success: function (data) {
            if (data.status == 200 && data.content) {
                var  privenceList =JSON.parse($.base64.decode(data.content, "utf-8"));
                if(privenceList.length>0){
                    _this.insertPrivenceHtml(privenceList);
                }else{
                    console.log('结果为空');
                }
            }else{
                console.log('获取失败:'+data.errorMessage);
            }
        },
        fail:function(err){
            console.log("fail: "+err);
        }
    });
},
//获取市列表
getCityList :function (privence_id) {
    var _this = this ;
    $.ajax({
        url: getAddressUrl+'/province/'+privence_id+'/city',
        type: 'get',
        dataType: 'json',
        //async:false,
        success: function (data) {
            if (data.status == 200 && data.content) {
                var  cityList =JSON.parse($.base64.decode(data.content, "utf-8"));
                if(cityList.length>0){
                    _this.insertCityHtml(cityList,privence_id);//获取市
                }else{
                    console.log('结果为空');
                }
            }else{
                console.log('获取市失败:'+data.errorMessage);
            }
        },
        fail:function(err){
            console.log("fail: "+err);
        }
    });
},
/**
 *
 * @param priOrCityid  省id
 * @param levelCitys   直辖市 1
 */
getAreaList :function (privenceIds,cityIds,levelCitys) {
    var _this = this;
    var requestUrls="";
    if(levelCitys==1){
        //直辖市
        requestUrls=getAddressUrl+'/province/'+privenceIds+'/city';
    }else{
        requestUrls=getAddressUrl+'/province/'+privenceIds+'/city/'+cityIds+'/region';
    }

    $.ajax({
        url: requestUrls,
        type: 'get',
        dataType: 'json',
        //async:false,
        success: function (data) {
            if (data.status == 200 && data.content) {
                var  areaList =JSON.parse($.base64.decode(data.content, "utf-8"));
                if(areaList.length>0){
                    _this.insertAreaHtml(areaList,privenceIds,cityIds,levelCitys);//填充区
                }else{
                    console.log('结果为空');
                }
            }else{
                console.log('获取市失败:'+data.errorMessage);
            }
        },
        fail:function(err){
            console.log("fail: "+err);
        }
    });
},
//填充省
insertPrivenceHtml :function (resultLists) {
    var _this = this;
    var insertHtml ="";
    resultLists.forEach(function(item,index) {
        if(item.name.indexOf("上海")!=-1 ||item.name.indexOf("重庆")!=-1 ||item.name.indexOf("天津")!=-1 ||item.name.indexOf("北京")!=-1){
            var parm={
                privence_name : item.name,
                privence_id : item.id
            };
            levelPrivenceList.push(parm);//存储直辖市的id；
        }
        insertHtml += ' <div class="panel panel-primary" name="privence" value="' + item.id + '" style="margin-bottom:2px">'
            + '     <div class="panel-heading" style="font-size:16px;padding: 1px 15px;background-color: #96d0f0;color: #31708f;">'
            + '       <input type="checkbox" id="ischeck_privence'+item.id+'" name="privence" data-privenced="privence' + item.id + '"  value="'+item.id+'"/>' + item.name
            + '       <i class="fa fa-chevron-right" name="openCity" data-privence_code="' + item.id + '"  aria-hidden="true"></i>'
            + '     </div>'
            + '     <div class="panel-body" id="privence'+item.id+'"  style="padding:0px;margin:2px 0 2px 25px;">'
            + '     </div>'
            + '   </div>';

        $('#select_show').html(insertHtml); //填充省
        $('#shawn_show').show();//遮罩
        $('#chose_address_win').show();//地区

        //如果是修改，初始化已经选中
            resultLists.forEach(function(item,index) {
                if(privence_value){
                    if (privence_value.indexOf(item.id) != -1) {
                        $('#ischeck_privence'+item.id).prop("checked",true);
                    }
                }
            });

        //操作省  checkbox
        $('input[name=privence]').on('click',function () {
            var privenceid=$(this).val();
            var isCheck =$(this).is(':checked');
            if(isCheck){
                $('#privence'+privenceid).find('input').prop("checked",true);
            }else{
                $('#privence'+privenceid).find('input').prop("checked",false);;
            }
        });





        //操作  张开市
        $('i[name=openCity]').on('click',function () {
            var hasClass =$(this).hasClass('fa-chevron-right');//张开
            var privence_id = $(this).data('privence_code');//省id
            if(hasClass){
                //展开
                $(this).removeClass('fa-chevron-right');
                $(this).addClass('fa-chevron-down');

                //查询市列表
                _this.getCityList(privence_id);

            }else{
                $(this).removeClass('fa-chevron-down');
                $(this).addClass('fa-chevron-right');
                $('#privence'+privence_id).hide();

            }

        });
    });


},
//获取市列表
insertCityHtml:function(cityLists,privenceId){
    var _this =this;
    var insertCityHtml ="";
    var cityLength =cityLists.length;//获取有多少个市；
    cityLists.forEach(function(item,index) {
        //判断是否直辖市 上海（1），北京（4463），天津（18077），重庆（56322）
        //此处用循环判断，浏览器直接崩溃
        if(privenceId==1 ||privenceId==4463 |privenceId==18077||privenceId==56322){
            if(privenceId==1){
                item.name="上海市";
            }else if(privenceId==4463){
                item.name="北京市";
            }else if(privenceId==18077){
                item.name="天津市";
            }else if(privenceId==56322){
                item.name="重庆市";
            }
            insertCityHtml = ' <div class="panel panel-info" style="margin-bottom:0px">'
                +'       <div class="panel-heading" style="font-size:16px;padding: 1px 15px;background-color: #d9edf7;">'
                +           item.name
                +'           <i class="fa fa-chevron-right" name="openArea"     data-level_city="1"  data-privence_code="' + privenceId + '" aria-hidden="true"></i>'
                +'       </div>'
                +'       <div class="panel-body" id="city'+privenceId+'"  data-city_length="'+cityLength+'"     style="padding: 1px 30px;">'
                +'      </div>'
                +'  </div>';
            return;

        }else{
            insertCityHtml += ' <div class="panel panel-info" style="margin-bottom:0px">'
                +'       <div class="panel-heading" style="font-size:16px;padding: 1px 15px;background-color: #d9edf7;">'
                +'            <input type="checkbox" name="city" id="ischeck_city'+item.id+'" data-city="city'+item.id+'" data-privence_code="' + privenceId + '"  data-city_length="'+cityLength+'"  value="'+item.id+'" >'+item.name
                +'           <i class="fa fa-chevron-right" name="openArea" data-privence_code="' + privenceId + '" data-city_code="' + item.id + '" aria-hidden="true"></i>'
                +'       </div>'
                +'       <div class="panel-body" id="city'+item.id+'"  data-city_length="'+cityLength+'"   style="padding: 1px 30px;">'
                +'      </div>'
                +'  </div>';
        }

    });
    //填充市
    $('#privence'+privenceId).html(insertCityHtml);

    //判断省是否选中，选择则全部选中
    var checked_pirvence= $('input[data-privenced=privence'+privenceId+']').is(':checked');
    if(checked_pirvence){
        $('#privence'+privenceId).find('input').prop("checked",true);

    }else{
        $('#privence'+privenceId).find('input').prop("checked",false);
    }

    //判断是否是修改
    //如果是修改，初始化已经选中
    cityLists.forEach(function(item,index) {
        if(city_value){
            if (city_value.indexOf(item.id) != -1) {
                $('#ischeck_city'+item.id).prop("checked",true);
            }
        }
    });

    $('#privence'+privenceId).show();

    //操作市 checkbox
    $('input[name=city]').on('click',function () {
        var cityid=$(this).val();
        var privenceid =$(this).data('privence_code');//省id
        var isCheck =$(this).is(':checked');
        if(isCheck){
            $('#city'+cityid).find('input').prop("checked",true);
            //判断是否选中当前城市所有的市
            var newCheckNum =$("input[data-privence_code="+privenceId+"]:checked").length;
            if(cityLength==newCheckNum){
                //市全部选中
                $('input[data-privenced=privence'+privenceid+']').prop("checked",true);;//省也中
            }


        }else{
            $('input[data-privenced=privence'+privenceid+']').prop("checked",false);;//省也未中
            $('#city'+cityid).find('input').prop("checked",false);

        }
    });



    //操作  张开区
    $('i[name=openArea]').on('click',function () {
        var hasClass =$(this).hasClass('fa-chevron-right');//张开
        //存在两中情况，直辖市没有多省概念，直接用 市id查询
        var isLeverCity =$(this).data('level_city');//直辖市省id
        //直辖市，直接用省id差区
        var privence_id = $(this).data('privence_code');//省id
        var city_id = $(this).data('city_code');//市id

        //判断是否选中市
        var isCheck = $('input[data-city=city'+city_id+']').is(':checked');
        if(isCheck){
            $('#city'+city_id).find('input').prop("checked",true);
        }else{
            $('#city'+city_id).find('input').prop("checked",false);;
        }

        if(hasClass){
            //展开
            $(this).removeClass('fa-chevron-right');
            $(this).addClass('fa-chevron-down');

            //查询区列表
            _this.getAreaList(privence_id,city_id,isLeverCity);

        }else{
            $(this).removeClass('fa-chevron-down');
            $(this).addClass('fa-chevron-right');
            if(isLeverCity==1){
                $('#city'+privence_id).hide();
            }else{
                $('#city'+city_id).hide();
            }


        }

    });



},

/***
 *
 * @param resultLists
 */
insertAreaHtml :function (areaLists,privenceIds,cityIds,levelCitys) {
    var _this = this;
    var insertHtml ="";
    var areaLength =areaLists.length;//当前市有多少区
    areaLists.forEach(function(item,index) {
        if(levelCitys==1){
            insertHtml += ' <input type="checkbox" id="ischeck_area'+item.id+'" name="area"  data-city_code="'+privenceIds+'" data-area_length="'+areaLength+'" value="'+item.id+'"/>'+item.name;
        }else{
            insertHtml += ' <input type="checkbox" name="area" id="ischeck_area'+item.id+'"  data-city_code="'+cityIds+'" data-area_length="'+areaLength+'" value="'+item.id+'"/>'+item.name;
        }
    });

    if(levelCitys==1){
        $('#city'+privenceIds).html(insertHtml); //填充区

        //直辖市判断省是否选中，选择则全部选中
        var checked_pirvence= $('input[data-privenced=privence'+privenceIds+']').is(':checked');
        if(checked_pirvence){
            $('#privence'+privenceIds).find('input').prop("checked",true);

        }else{
            $('#privence'+privenceIds).find('input').prop("checked",false);
        }

        $('#city'+privenceIds).show();
    }else{
        $('#city'+cityIds).html(insertHtml); //填充区
        //判断市是否选中，选择则全部选中
        var checked_city = $('input[data-city=city'+cityIds+']').is(':checked');
        if(checked_city){
            $('#city'+cityIds).find('input').prop("checked",true);
        }else{
            $('#city'+cityIds).find('input').prop("checked",false);
        }
        $('#city'+cityIds).show();
    }

    //如果是修改，初始化已经选中

    areaLists.forEach(function(item,index) {
        if(area_value){
            if (area_value.indexOf(item.id) != -1) {
                $('#ischeck_area'+item.id).prop("checked",true);
            }
        }

    });


    //操作区 checkbox
    $('input[name=area]').on('click',function () {
        var isCheck =$(this).is(':checked');
        if(isCheck){
            //判断是否选中当前城市所有的区
            var newCheckNum ="";
            if(levelCitys ==1){
                newCheckNum=$("input[data-city_code="+privenceIds+"]:checked").length;
            }else{
                newCheckNum=$("input[data-city_code="+cityIds+"]:checked").length;
            }

            if(areaLength==newCheckNum){
                //市all选中
                if(levelCitys ==1){
                    //直辖市直接all中省
                    $('input[data-privenced=privence'+privenceIds+']').prop("checked",true);;//省也中
                }else{

                    $('input[data-city=city'+cityIds+']').prop("checked",true);;//市也中
                        //判断是否选中当前城市所有的市
                        var cityLength =$('#city'+cityIds).data('city_length');//获取当前城市的所有市数量
                        var newCheckNum =$("input[data-privence_code="+privenceIds+"]:checked").length;

                        if(cityLength==newCheckNum){
                            //市全部选中
                            $('input[data-privenced=privence'+privenceIds+']').prop("checked",true);;//省也中
                        }
                    }

                }
            }else{
                $('input[data-privenced=privence'+privenceIds+']').prop("checked",false);;//省也未中
                $('input[data-city=city'+cityIds+']').prop("checked",false);;//市也未中


            }
        });





    }

}

//执行
show_adress._init();

