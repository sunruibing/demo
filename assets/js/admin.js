$(document).ready(function(){
	$ (".menu-icon").click (function (){ 

            $ (this).toggleClass ("menu-icon2"); 

           
        }); 
	//获取科室
	$.ajax({
		 url:"http://localhost:8080/worm/findSection",
         type:"post",
         dataType:"json",
         success:function(data){
        	 var sectionList = "<option value='0'>请选择科室</option>";
        	 $.each(data, function(index, section){
        		 sectionList += "<option value=" +section["id"]+ ">" +section["name"]+ "</option>";
        	 });
        	 $("#hour4").html(sectionList);

         }
	});
	//获取推荐医生
	$.ajax({
		 url:"http://localhost:8080/worm/frgodicDoctor",
         type:"post",
         dataType:"json",
         success:function(data){
        	 var sectionList = "<option value='0'>请选择医生</option>";
        	 $.each(data, function(index, doctor){
        		 sectionList += "<option value=" +doctor["id"]+ ">" +doctor["name"]+ "</option>";
        	 });
        	 $("#remdoctor").html(sectionList);

         }
	});
    /*疾病添加*/
    $(".btnjia").click(function(){
       $(".add_disease").show();
    });
    $('.baocunjibing').click(function() { 

        $.ajax({ 

        	url:"http://localhost:8080/worm/dddDisease", 

            type: 'post', 

            dataType:'json',

            data: $(".msg").serializeArray(), 

            success: function(msg) { 
                var diseasename = document.reg_disease.diseasename.value;
                var yongyaotext = document.reg_disease.yongyaotext.value;
                var disease = document.reg_disease.disease.value;
                var diseasetext = document.reg_disease.diseasetext.value;
                var ddisease = document.reg_disease.ddisease.value;
                var ddiseasetext = document.reg_disease.ddiseasetext.value;
                var bingyongyaotext = document.reg_disease.bingyongyaotext.value;
                var huyongyaotext = document.reg_disease.huyongyaotext.value;
                var tiyongyaotext = document.reg_disease.tiyongyaotext.value;
                var userIcon = document.reg_disease.userIcon.value;
                var doctorIcon = document.reg_disease.doctorIcon.value;
                
            		if (diseasename == "") {
            			alert("请输入疾病名");
            		} else if ("hour4.value" == "0") {
            			alert("请选择科室");
            		} else if(yongyaotext ==""){
            			alert("请输入简介");
            		}else if(userIcon == ""){
            			alert("请选择用户头像")
            		} else if(disease ==""){
            			alert("请输入妈妈名称");
            		} else if(diseasetext ==""){
            			alert("请输入妈妈提示内容");
            		}else if(doctorIcon ==""){
            			alert("请选择医生头衔");
            		} else if(ddisease ==""){
            			alert("请输入医生名称");
            		} else if(ddiseasetext ==""){
            			alert("请输入医生回复内容");
            		} else if(bingyongyaotext ==""){
            			alert("请输入病因");
            		} else if(huyongyaotext ==""){
            			alert("请输入护理知识");
            		} else if(tiyongyaotext ==""){
            			alert("请输入温馨提示");
            		}else if("remdoctor.value"=="0"){
            			alert("请选择医生");
            		}else{
            			alert("保存成功");
            			
            		} 
            		}
         });
        return false;
      });
    
    
    /*添加资讯文章*/
    $(".btnarticle").click(function(){
        alert("dsfdsjkhfsdjh");
    });
    /*关闭添加文章页面*/
   $(".add_disease a").click(function(){
	 $(".add_disease").hide();
   });
});

function savei18ninfo() {
	var i18ninfo = geti18ninfo();
	alert(i18ninfo);

}
//获取i18n值 
function geti18ninfo() {
	var key = "";
	var value = "";
	var i18ndata = "";
	var table = $("#i18ntable");
	var tbody = table.children();
	var trs = tbody.children();
	for(var i = 1; i < trs.length; i++) {
		var tds = trs.eq(i).children();
		for(var j = 0; j < tds.length; j++) {
			if(j == 0) {
				if(tds.eq(j).text() == null || tds.eq(j).text() == "") {
					return null;
				}
				key = "key\":\"" + tds.eq(j).text();
			}
			if(j == 1) {
				if(tds.eq(j).text() == null || tds.eq(j).text() == "") {
					return null;
				}
				value = "value\":\"" + tds.eq(j).text();
			}
		}
		if(i == trs.length - 1) {
			i18ndata += "{\"" + key + "\",\"" + value + "\"}";
		} else {
			i18ndata += "{\"" + key + "\",\"" + value + "\"},";
		}
	}
	i18ndata = "[" + i18ndata + "]";
	return i18ndata;
}
var clientWidth = document.documentElement.clientWidth;
var clientHeight = document.documentElement.clientHeight;
var div_left_width = 200;
var tempWidth = 0;

function resizeLayout() {
	try {
		clientWidth = document.documentElement.clientWidth;
		var div_left_width = $("#left").width() + 11;
		$("#cc").layout("resize");
		$('#userquery').panel('resize', {
			width: clientWidth - div_left_width
		});
		$('#10100801').datagrid('resize', {
			width: clientWidth - div_left_width
		});

		$('#userrange').combobox({
			width: $('#right').width() * 0.35
		});
	} catch(e) {}
}

function initResize() {
	//自动适应页面大小 
	$(".layout-button-left").bind("click", function() {
		$('#userquery').panel('resize', {
			width: clientWidth - 28
		});
		$('#10100801').datagrid('resize', {
			width: clientWidth - 28
		});
		$(".layout-button-right").bind("click", function() {
			$('#userquery').panel('resize', {
				width: tempWidth
			});
			$('#10100801').datagrid('resize', {
				width: tempWidth
			});
		});
	});
}

function tdclick(tdobject) {
	var td = $(tdobject);
	td.attr("onclick", "");
	//1,取出当前td中的文本内容保存起来 
	var text = td.text();
	//2,清空td里面的内容 
	td.html(""); //也可以用td.empty(); 
	//3，建立一个文本框，也就是input的元素节点 
	var input = $("<input>");
	//4，设置文本框的值是保存起来的文本内容 
	input.attr("value", text);
	input.bind("blur", function() {
		var inputnode = $(this);
		var inputtext = inputnode.val();
		var tdNode = inputnode.parent();
		tdNode.html(inputtext);
		tdNode.click(tdclick);
		td.attr("onclick", "tdclick(this)");
	});
	input.keyup(function(event) {
		var myEvent = event || window.event;
		var kcode = myEvent.keyCode;
		if(kcode == 13) {
			var inputnode = $(this);
			var inputtext = inputnode.val();
			var tdNode = inputnode.parent();
			tdNode.html(inputtext);
			tdNode.click(tdclick);
		}
	});

	//5，将文本框加入到td中 
	td.append(input);
	var t = input.val();
	input.val("").focus().val(t);
	//6,清除点击事件 
	td.unbind("click");
}

function addtr() {
	var table = $("#goods");
	var tr = $("<tr><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' text-align: center; id='del'><font size='2' color='red'>" +
		"删除" + "</font></td></tr>");
	table.append(tr);
}
function addtr2() {
	var table = $("#goods2");
	var tr = $("<tr><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' text-align: center; id='del'><font size='2' color='red'>" +
		"删除" + "</font></td></tr>");
	table.append(tr);
}
function addtr3() {
	var table = $("#goods3");
	var tr = $("<tr id='nihao'><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)' name='userName'>" +
		"</td><td height='20px' onclick='tdclick(this)' name='phone'>" +
		"</td><td height='20px' onclick='tdclick(this)' name='Code'>" +
		"</td><td height='20px' onclick='tdclick(this)' name='time'>" +
		"</td><td height='20px' text-align: center; id='del'><font size='2' color='red'>" +
		"删除" + "</font></td></tr>");
	table.append(tr);
}function addtr4() {
	var table = $("#goods4");
	var tr = $("<tr><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' onclick='tdclick(this)'>" +
		"</td><td height='20px' text-align: center; id='del'><font size='2' color='red'>" +
		"删除" + "</font></td></tr>");
	table.append(tr);
}