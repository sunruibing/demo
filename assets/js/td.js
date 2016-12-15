$(document).ready(function(){
	$("#goods3 #del").click(function(){
			var trSeq = $(this).parent().parent().find("tr").index($(this).parent()[0]);
			alert("第" + (trSeq + 1) + "行");
			// alert("ddshdk");
		});
});