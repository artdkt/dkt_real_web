var DKTDesk = function() {
	var self = this;
	self.paper;
	self.deskWidth;
	self.deskHeight;
	self.materials;


	function init(){
		self.paper = Raphael("content", $("#content").width(), $("#content").height());
	}


	self.update = function(datas){
		self.deskWidth  = datas.deskSize.width;
		self.deskHeight = datas.deskSize.height;
		self.materials = datas.materials;
		self.draw();
	}


	self.draw = function(){
		if(!self.deskWidth || !self.deskHeight || !self.materials) return;

		var ww = $("#content").width();
		var wh = $("#content").height();
		var ratio = Math.max(ww/self.deskWidth, wh/self.deskHeight);

		self.paper.clear();
		self.paper.setSize(ww, wh);

		for(var i = 0; i < self.materials.length; i ++) {
			var material = self.materials[i];

			var coordinates = material.coordinates;
			var pathString = "";
			for(var n=0; n<coordinates.length; n++){
				pathString += (n==0) ? "M" : "L";
				pathString += (coordinates[n][0]*ratio)+","+(coordinates[n][1]*ratio);
			}
			pathString += "L"+(coordinates[0][0]*ratio)+","+(coordinates[0][1]*ratio);

			var obj = self.paper.path(pathString).attr({
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


	init();
};


$(function() {
	var desk = new DKTDesk();
	var handler = new DKTHandler();

	/*--- DKTリスナ設定 ---*/
	handler.listen(desk.update, 1000);

	/*--- リサイズハンドラバインド ---*/
	$(window).on("resize", desk.draw);
});