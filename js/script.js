$(function(){
	var ww = $("#content").width();
	var wh = $("#content").height();
	var paper = Raphael("content", ww, wh);

	var deskWidth = 1320;
	var deskHeight = 900;
	var ratio;
	var materials = null;


	/*--- 描画 ---*/
	function draw(){
		if(!materials) return;

		paper.clear();

		for(var i = 0; i < materials.length; i ++) {
			var data = materials[i];
		
			var obj = paper.rect(data.top*ratio, data.left*ratio, data.width*ratio, data.height*ratio).attr({
				fill: "red",
				'fill-opacity': 0,
				cursor: 'pointer'
			});
			obj.node.id = data.url; 

			obj.mouseover(function(e) {
				// console.log("over")
			}).mouseout(function(e) {
				// console.log("out")
			}).mouseup(function(e) {
				location.href = e.toElement.id;
			})
		}
	}


	/*--- リサイズ処理 ---*/
	function windowResizeHandler(){
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
		materials = [];
		for(var i = 0; i < datas.length; i ++) {
			materials[i] = datas[i];
		}
		draw();
	}, 10000);
});