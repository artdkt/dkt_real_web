$(function() {
	var ww = $("#content").width();
	var wh = $("#content").height();
	var paper = Raphael("content", ww, wh);

	var deskWidth;
	var deskHeight;
	var ratio;
	var desk = null;


	/*--- 描画 ---*/
	function draw() {
		if(!desk) return;

		deskWidth = desk.deskSize.width;
		deskHeight = desk.deskSize.height;

		paper.clear();

		for(var i = 0; i < desk.materials.length; i ++) {
			var material = desk.materials[i];

			var coordinates = material.coordinates;
			var pathString = "";
			for(var n=0; n<coordinates.length; n++){
				pathString += (n==0) ? "M" : "L";
				pathString += (coordinates[n][0]*ratio)+","+(coordinates[n][1]*ratio);
			}
			pathString += "L"+(coordinates[0][0]*ratio)+","+(coordinates[0][1]*ratio);


			var obj = paper.path(pathString).attr({
				fill: "red",
				'fill-opacity': 0,
				cursor: 'pointer'
			});
			obj.node.id = material.url; 

			obj.mouseover(function(e) {
				// console.log("over")
			}).mouseout(function(e) {
				// console.log("out")
			}).mouseup(function(e) {
				location.href = e.toElement.id;
			});
		}
	}


	/*--- リサイズ処理 ---*/
	function windowResizeHandler() {
		ww = $("#content").width();
		wh = $("#content").height();
		
		ratio = Math.max(ww/deskWidth, wh/deskHeight);

		paper.setSize(ww, wh);
		draw();
	}


	/*--- リサイズハンドラバインド ---*/
	$(window).on("resize", windowResizeHandler);
	windowResizeHandler();


	/*--- DKTリスナ設定 ---*/
	var handler = new DKTHandler();
	handler.listen(function(datas) {
		desk = datas;
		draw();
	}, 10000);
});