	function initDatabase() { //初始化数据库
		var db = getCurrentDb();
		if(!db) {
			alert("您的浏览器不支持HTML5");
			return;
		}

		db.transaction(function(trans) {
			trans.executeSql("create table if not exists Demo(name text null,icon text null, selfdom null)", [], function(trans, result) {

			}, function(trans, message) {
				alert(message);
			});
		}, function(trans, result) {}, function(trans, message) {});
	}

$(function() {

	initDatabase();

	$("#btnSave").click(function() {
		var txtName = $("#txtName").val();
		var txtTitle = $("#txtTitle").val();
		var txtWords = $("#txtWords").val();

		var db = getCurrentDb();

		//插入数据
		db.transaction(function(trans) {

			trans.executeSql("insert into Demo(name,icon,selfdom) values(?,?,?) ", [txtName, txtTitle, txtWords], function(ts, data) {

			}, function(ts, message) {
				alert(message);
			});

		});
		showAllTheData();

	});
});

function getCurrentDb() {
	//打开数据库，或者直接连接数据库参数：数据库名称，版本，概述，大小
	var db = openDatabase("talk", "1.0", "it's to save demo data!", 1024 * 1024);;
	return db;

}

function showAllTheData() {
	$("#tblData").empty();
	var db = getCurrentDb();

	db.transaction(function(trans) {
		trans.executeSql("select * from Demo ", [], function(ts, data) {
			if(data) {
				for(var i = 0; i < data.rows.length; i++) {
					appendDataToTable(data.rows.item(i)); //获取某行数据的json对象
				}
			}
		}, function(ts, message) {
			alert(message);
			var tst = message;
		});

	});
}

function appendDataToTable(data) { //将数据展示到表格里面
	//uName,title,words
	var txtName = data.uName;
	var txtTitle = data.title;
	var words = data.words;

	var strHtml = "";
	strHtml += "<tr>";
	strHtml += "<td>" + txtName + "</td>";
	strHtml += "<td>" + txtTitle + "</td>";
	strHtml += "<td>" + words + "</td>";
	strHtml += "</tr>";
	$("#tblData").append(strHtml);
}
