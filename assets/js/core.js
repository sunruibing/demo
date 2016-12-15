//初始化
JIM.init();
var auth_platform = {
	"appkey" : "5c5f32b0db563635235360d7",
	"random_str" : "022cd9fd995849b58b3ef0e943421ed9",
	"signature" : "5AB96F6E6B63999E75A83DEE06CBCC20",//D97C2DDA3E46E5E6D482E9E8EE84AF93
	"timestamp" : "1467967210887"
};

function resp(data) {
	console.log("resp : " + JSON.stringify(data));
	
}

function ack(data) {
	console.log("ack : " + JSON.stringify(data));
}

function timeout(data) {
	console.log("timeout : " + JSON.stringify(data));
}
var fromId=null;
/*登录*/
function login() {

	//获取参数
	var username = $.trim($("#username").val());
	var password = $.trim($("#password").val());

	//调用IM登录函数
	JIM.login(username, password, auth_platform, function(data) {
	    console.log("login success:" + JSON.stringify(data));

	    if("success" == data.message){
	    	$.cookies.set("username", username);
	    	$.cookies.set("password", password);
	    	location.href = "index.html";
	    }else{
	    	alert("登录失败");
	    }
	    
	}, ack, timeout);
};
/*保持登录*/
function logged(){
	
	var username = $.cookies.get("username");
	var password = $.cookies.get("password");
	
	JIM.login(username, password, auth_platform, function(data) {
	    console.log("login success:" + JSON.stringify(data));

	    console.log("保持登录:" + data.message);

	    var notif; // 消息对象
		var i = 0;
		
	   		
	    // 聊天消息监听接收消息
	    JIM.onMsgReceive(function(data) {
	    	
	    	$("#nowChat").val(data.from_name);
	    	var chatContent = $(".chatContent").find("#chat"+data.from_id);//初始化文本聊天记录框
			
	    	if(chatContent.length == 0){//不存在
				$(".chatContent").append("<div id='chat"+data.from_id+"'></div>");
				var chatContent = $(".chatContent").find("#chat"+data.from_id);//初始化文本聊天记录框	
			}
	    	
	    	if(data.msg_type == "text"){
	    		var msg = '<span class="chatter_msg_item chatter_msg_item_admin"><a href="" class="chatter_avatar"><img src="http://www.gbtags.com/gb/networks/avatars/1679dd15-8c8e-4c35-ae18-365c523562be.JPG" /></a>'+data.msg_body.text+'</span>'; 
	    		
	    	}else{
	    		var msg ='<span class="chatter_msg_item chatter_msg_item_admin"><a href="" class="chatter_avatar"><img src="http://www.gbtags.com/gb/networks/avatars/1679dd15-8c8e-4c35-ae18-365c523562be.JPG" /></a><img src="'+data.msg_body.media_url+'" id="talkImg"/></span>';
	    	}
	    	//消息提示    	
	        if(window.Notification) { // 判断浏览器是否支持Notification特性，Chrome与Firefox支持，IE内核暂不支持
			   if(Notification.permission == 'granted') { // 判断浏览器是否允许此站点发送桌面消息；granted为允许
				  notif = new Notification(data.from_id, {
						body: data.msg_body.text,
						icon: 'http://www.gbtags.com/gb/networks/avatars/1679dd15-8c8e-4c35-ae18-365c523562be.JPG',
						tag: ++i // ID，如果ID重复则前者会被覆盖，如果ID不重复则一直叠加显示。
						});
						notif.onclick = function() { // 当Notification被单击时触发
							$('.chat').css('display','block').removeClass('mins');
							$(data.from_id).html($(this).find('h3').html());		
							var from_id = $.trim($(this).text());
							var nowChat = $(".chatContent").find("#chat"+from_id);
							if(nowChat.length == 0){//不存在
								$(".chatContent").append("<div id='chat"+from_id+"'></div>");
							}else{
								//showMsg('chatContent');//显示聊天记录
								$(".chatContent").find("div").hide();
								nowChat.show();
							}
							$("#nowChat").val(from_id);
						}
					} else {
						Notification.requestPermission();
					}
				}
	    	    chatContent.append(msg);//追加聊天消息
         	  ///  savemsg(msg);//保存聊天消息
	    	    
			var leftli = $(".user");
			
			var friendName ='<ul>';
				friendName +='<li>';
				friendName +='<img src="http://www.gbtags.com/gb/networks/avatars/1679dd15-8c8e-4c35-ae18-365c523562be.JPG" />';
				friendName +='<h3  class="userName">'+data.from_id+'</h3>';
				friendName +='<p>我是一个好医生</p>';
   				friendName +='</li>';
   				friendName +='</ul>';
				var nameArrys = leftli.find(".userName");
				var flag = false;
				if(nameArrys.length > 0){
					$.each(nameArrys,function(i,obj){
						var userName = $(this).text();
						if(userName == data.from_id){
							flag = true; 
						}
					});
				}
				if(!flag){
					leftli.append(friendName);
					//savemsg(friendName);//保存聊天消息
					var h3 = leftli.find("h3");
					h3.unbind("click");
					h3.on("click",function(event){//用户列表单击
						$('.chat').css('display','block').removeClass('mins');
					   	$('.username').html($.trim($(this).html())); 		
						var from_id = $.trim($(this).text());
						var nowChat = $(".chatContent").find("#chat"+from_id);
						if(nowChat.length == 0){//不存在
							$(".chatContent").append("<div id='chat"+from_id+"'></div>");
						}else{
							showMsg('chatContent');//显示聊天记录
							$(".chatContent").find("div").hide();
							nowChat.show();
						}
						$("#nowChat").val(from_id);
					});
				}
				/***
				 * 图片放大
				 */
				var isopen = false;
				var newImg;
				var w = 130; //将图片宽度+200 
				var h = 130; // 将图片高度 +200 
				$(document).ready(function() {
					$(".chatContent img").unbind("click");
					$(".chatContent img").click(function() {
						newImg = this;
						if(!isopen) {
							isopen = true;
							$(this).width($(this).width() + w);
							$(this).height($(this).height() + h);
						} else {
							isopen = false;
							$(this).width($(this).width() - w);
							$(this).height($(this).height() - h);
						}

					});
				});
	      console.log('onMsgReceive : ' + JSON.stringify(data)); 
	      fromId = data.from_id;
	    });
	    
	    // 事件监听
	    JIM.onEvent(function(data) {
	      console.log('onEvent : ' + JSON.stringify(data));
	    }); 
	    for(var i = 0; i < localStorage.length; i++) {
			var key = localStorage.key(i);
			var leftli = $(".user");
		}
	     
	}, ack, timeout);
}

/*获取用户个人信息*/
function getUserInfo() {
	var friend_name = $.cookies.get("username");
	console.log('getUserInfo...');
	JIM.getUserInfo(friend_name, resp, ack, timeout);
}

//发送事件
function sendSingleMsg(obj) { 
	
	var nowChat = $.trim($("#nowChat").val());
	var chatContent = $(".chatContent").find("#chat"+nowChat);//初始化文本聊天记录框
	if (obj.length > 0) {                                       
		msg = obj;                                              
		JIM.sendSingleMsg(nowChat, msg, resp, ack,timeout); 
			
			var msg ='<span class="chatter_msg_item chatter_msg_item_user"><a href="" class="chatter_avatar"><img src="http://p1.bpimg.com/573844/77fa9c6705d14a9f.jpg"></a>'+obj+'</span>';
			                                
			chatContent.append(msg);//追加聊天消息
			
			//savemsg(msg);//保存聊天消息
			
		$("#sendMsg").val("");                                    
	}else{                                                      
		alert("请输入消息内容");                                       
	}                                                           
}

var key = fromId;
//保存事件
function savemsg(key){
	var savemsg = document.getElementById(key);
	var msg = savemsg.value;
	localStorage.setItem(fromId, msg);
}
//显示聊天记录
function showMsg(key){
	var showMsg = document.getElementById(key);
	showMsg.innerHTML=localStorage.getItem(fromId);
}







