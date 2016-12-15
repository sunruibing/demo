$(document).ready(function(){
	//极光登录
	logged();
	/* 获取医生信息*/
	$.ajax({
		url: 'http://localhost:8080/worm/findDoctor',  
        type: 'post',  
        dataType: 'json',
        success:function(data){
        	  $.each(data, function(commentIndex, comment){
                  
        		 // console.log("姓名:"+ comment['name'],comment['icon'],comment['section']);
        		  
        		  $(".information").html($(".information").html() +  "<img src=" + comment['icon'] +" />" + "<div class='section'>"+"<span>"+comment['name'] + "</span>"+"<li>" +comment['section'] + "</li>"+"</div>");
        	  });
        }
	});
	//获取用户
	$.ajax({
		 url:"http://localhost:8080/worm/FindUserList",
         type:"post",
         dataType:"json",
         success:function(data){
        	 var userList = "<option value='0'>请选择</option>";
        	 $.each(data, function(index, user){
        		 userList += "<option value=" +user["id"]+ ">" +user["name"]+ "</option>";
        	 });
        	 $("#renm").html(userList);

         }
	});
	
	//获取挂号列表
	$.ajax({
		url: 'http://localhost:8080/worm/findUser',  
        type: 'post',  
        dataType: 'json',
        success:function(data){
        	  $.each(data, function(commentIndex, comment){
        		  //console.log("姓名:"+ comment['name'],comment['phone'],comment['order_code'],comment['reservation_date']);
        		  $("#goods3").html($("#goods3").html()+ "<tr id='theader'>"+
        		  			"<td height='20px' onclick='tdclick(this)' class='td_center' width='9%'>"+ +"</td>"+
        		  			"<td height='20px' onclick='tdclick(this)'>"+comment['name']+"</td>"+
        		  			"<td height='20px' onclick='tdclick(this)'>"+comment['phone']+"</td>"+
        		  			"<td height='20px' onclick='tdclick(this)'>"+comment['order_code']+"</td>"+
        		  			"<td height='20px' onclick='tdclick(this)'>"+comment['reservation_date']+"</td>"+
        					"<td height='20px' text-align: center; id='del'><font size='2' color='red'>"+"删除"+"</font></td>" +
        					"</tr>");
        		  $("#goods4").html($("#goods4").html() +"<tr id='theader' >" +
      		  			"<td height='20px' onclick='tdclick(this)' class='td_center' width='9%'>"+ +"</td>"+
      		  			"<td height='20px' onclick='tdclick(this)'>"+comment['name']+"</td>"+
      		  			"<td height='20px' onclick='tdclick(this)'>"+comment['phone']+"</td>"+
      		  			"<td height='20px' onclick='tdclick(this)'>"+comment['order_code']+"</td>"+
      		  			"<td height='20px' onclick='tdclick(this)'>"+comment['reservation_date']+"</td>"+
      					"<td height='20px' text-align: center; id='del'><font size='2' color='red'>"+"删除"+"</font></td>" +
      					"</tr>");
        		
        	  });
        }
	});
	/*添加挂号用户*/
	$(".guahaotijiao").click(function(){
		
			 var name = document.form3_1.name.value;
			 var phone = document.form3_1.phone.value;
			 var order_code = document.form3_1.order_code.value;
			 var reservation_date = document.form3_1.reservation_date.value;
			 
			 if(name==""){
			 alert("请输入");
			 }else if(phone==""){
			 alert("请输入");
			 }else if(order_code==""){
			 alert("不能为空");
			 }else if(reservation_date==""){
			 alert("不能为空");
			 }else{
		$.ajax({
			url:'http://localhost:8080/worm/addUser',
			type:'post',
			dataType:'json',
			data: $("#huanzhe").serializeArray(), 
			success:function(huanzhe){
				alert("保存成功");
				}	
				});
			 }
				return false;
			});
			
	/* 按钮发送消息 */
	$("#send").click(function() {
		var msg = $("#sendMsg").val();
		sendSingleMsg(msg);
	});
    var degree = 0;

    $(".menu-trigger").on("click",function(){
        $(this).next().toggle(500);
        if(degree = 0){
            alert("0000");
            degree += 90;
            $(this).children("div").css({"transform":"rotate("+degree+"deg)"});
        }else{
            degree += 0;
            $(this).children("div").css({"transform":"rotate("+degree+"deg)"});
        }
    });
    /*弹出会话框*/
	
	$("#user h3").unbind("click");
	$("#user h3").on("click",function(event){//用户列表单击
		$('.chat').css('display','block').removeClass('mins');
	   	$('.userName').html($(this).find('h3').html()); 		
	var from_id = $.trim($(this).html());
	var nowChat = $("#ChatContent").find("#chat"+from_id);
	if(nowChat.length == 0){//不存在
		$(".chatContent").append("<div id='chat"+from_id+"'></div>");
	}else{
		$(".chatContent").find("div").hide();
		nowChat.show();
	}
	$("#nowChat").val(from_id);
	});		
    
   /*患者管理列表*/
   	$(".subMenu li").click(function() {
	$("#content b").html($(this).html());
	});
   /*关闭对话框*/	
    $('.close').click(function(){
    $('.chat').css('display','none')
    });
   /*挂号医生提醒用户*/
    $("table img").click(function(){
      $(".reply").show();
    });
   /*用药提醒设置*/
    $(".add input").click(function(){
    $(".renm").show();
    });
    /*医生嘱咐*/
    $(".tijiaoreply").click(function tijiaoreply(){
    var con = document.form2.con.value;
    	if(con == ""){
    		alert("请输入提醒内容");
    	}else{
    		document.form2.submit();
    		$(".reply").hide();
    		
    	}
    });
    /*添加用药*/
    $(".renm").change(function(){
    	$("#remind").show();
    });
    /*保存提醒*/
    $(".sumbaocun").click(function(){
        var startDay = document.reg_testdate.startDay.value;	
     	var endDay = document.reg_testdate.startDay.value;
        var time1 = document.reg_testdate.time1.value;
        var time2 = document.reg_testdate.time2.value;
        var time3 = document.reg_testdate.time3.value;
      	var yongyaotext1 = document.reg_testdate.yongyaotext1.value;
      	var yongyaotext2 = document.reg_testdate.yongyaotext2.value;
      	var yongyaotext3 = document.reg_testdate.yongyaotext3.value;
      	 if(startDay == "" && endDay == ""){
      		alert("请选择提醒时间")
      	 }else if(time1 =="" && time2=="" && time3 ==""){
      		 alert("用药时间不能为空");
      	 }else if(yongyaotext1=="" && yongyaotext2=="" && yongyaotext3==""){
      		 alert("用药编辑不能为空");
      	 }else{
    	$.ajax({ 
        	url:"http://localhost:8080/worm/remind", 
            type: 'post', 
            dataType:'json',
            data: $(".sum").serializeArray(), 
            success:function(msg){
            	alert("保存成功");
           	 } 
       });
      }
      	 return false;
    });
    /*取消添加用药*/
    $("#remind .sumquxiao").click(function(){
	   $("#remind").hide();
    });
    /*获取行号*/
    $("#goods3,#del").unbind("click");
    $("#goods3,#del").click(function(){  
        var trSeq = $(this).parent().parent().find("tr").index($(this).parent()[0]); 
        alert("行号："+(trSeq+1));
        
		var id = $(trSeq+1).data("id");
		$.ajax({
		url:"http://localhost:8080/worm/delectUser",
	    type:"post",
	    data:{"id":id},
	    dataType:"json",
	    success:function(){
			   //提示成功
			   alert("删除成功");
		   }
		});
		return false;
    });
    /*录入患者*/
    $("#wwwzzjsnet_zzjs_2 .addtr3").click(function(){
    	$(".guahao").show();
    });
    /*取消录入框*/
    $(".guahaoquxiao").click(function(){
    	$(".guahao").hide();
    });
    /*搜索*/
    $(".search img").click(function() {
		var txt = $(".searchtext").val();
		if($.trim(txt) != "") {
			//$("#goods3 tr:not('#theader')").hide().filter(":contains('" + txt + "')").show().css("background", "red");
			$("#goods3").find("tr").hide();
			$("#goods3").find("tr").filter(":contains('" + txt + "')").show().css("background", "#CCFFFF");
		} else {
			$("#goods3 tr:not('#theader')").css("background", "#fff").show();
		}
	});
    
    
    
    
    $('.hour1').timepick();
	$('.hour2').timepick();
	$('.hour3').timepick();
	
});
	
/*患者管理列表打开*/
	function setTab(name, cursel, n) {
	  for(i = 1; i <= n; i++) {
		var menu = document.getElementById(name + i);
		var zzjs = document.getElementById("wwwzzjsnet_" + name + "_" + i);
		menu.className = i == cursel ? "hover" : "";
		zzjs.style.display = i == cursel ? "block" : "none";
	} 
}
/* 管理后台列表打开 */
function administratorTab(name, cursel, n) {
	for (i = 1; i <= n; i++) {
		var menu = document.getElementById(name + i);
		var admin = document.getElementById("wwwadmin_" + name + "_" + i);
		menu.className = i == cursel ? "hover" : "";
		admin.style.display = i == cursel ? "block" : "none";
	}
}
/*添加用药时间*/
window.onload=function () {
	var oTable = document.getElementById("goods3");
	for(var i = 0; i < oTable.rows.length; i++) {
		oTable.rows[i].cells[0].innerHTML = (i + 1);
	}
	var oTable = document.getElementById("goods4");
	for(var i = 0; i < oTable.rows.length; i++) {
		oTable.rows[i].cells[0].innerHTML = (i + 1);
	}
}













