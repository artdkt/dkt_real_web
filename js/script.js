var DKTDesk = function() {
	var self = this;
	self.paper;
	self.deskWidth;
	self.deskHeight;
	self.materials;
	self.objectClickbehavior;


	function init() {
		self.paper = Raphael("content", $("#content").width(), $("#content").height());
		self.objectClickbehavior = function(url) {
			location.href = url;
		};
	}


	self.update = function(datas) {
		self.deskWidth  = datas.deskSize.width;
		self.deskHeight = datas.deskSize.height;
		self.materials = datas.materials;
		self.draw();
	}


	self.draw = function() {
		if(!self.deskWidth || !self.deskHeight || !self.materials) return;

		var ww = window.innerWidth;
		var wh = window.innerHeight;
		var ratio = Math.max(ww/self.deskWidth, wh/self.deskHeight);

		self.paper.clear();
		self.paper.setSize(self.deskWidth*ratio, self.deskHeight*ratio);

		$("#wrapper").width(self.deskWidth*ratio);
		$("#wrapper").height(self.deskHeight*ratio);

		for(var i = 0; i < self.materials.length; i ++) {
			var material = self.materials[i];

			var coordinates = material.coordinates;
			var pathString = "";
			for(var n=0; n<coordinates.length; n++) {
				pathString += (n==0) ? "M" : "L";
				pathString += (coordinates[n][0]*ratio)+","+(coordinates[n][1]*ratio);
			}
			pathString += "L"+(coordinates[0][0]*ratio)+","+(coordinates[0][1]*ratio);

			var obj = self.paper.path(pathString).attr({
				fill: "red",
				'fill-opacity': 0,
				cursor: 'pointer',
				//stroke: "none"
			});

			obj.node.id = material.url; 

			obj.mouseover(function(e) {
				// console.log("over")
			}).mouseout(function(e) {
				// console.log("out")
			}).mouseup(function(e) {
				var url = e.toElement.id;
				self.objectClickbehavior(url);
			});
		}
	}


	init();
};


var DKTModal = function() {
	var self = this;
	var modalContainer = $("#modal");
	var modalWindow = $("#window");
	var modalLoading = $("#modalLoading");
	var modalBG = $("#modalBg");
	var modalClose = $("#modalClose");
	var deskScrollTop = 0;
	var deskScrollLeft = 0;
	var isModalVisible = false;


	function init() {
		modalContainer.hide();
		modalBG.on("click", self.closeModal);
		modalClose.on("click", self.closeModal);
	}


	function attachArticle(html) {
		if(!isModalVisible) return;

		modalWindow.find("#windowInner").html($("<div>").append($.parseHTML(html)).find("#article_container"));
		modalLoading.animate({opacity:0}, 500, "easeOutExpo", function(){
			modalWindow.show();
		});
	}


	self.openModal = function(url) {
		isModalVisible = true;
		modalContainer.show();
		modalWindow.hide();
		modalLoading.stop(true).css("opacity", 1).show();
		modalBG.css("opacity", 0);
		modalBG.animate({opacity:0.8}, 300, "easeOutExpo");

		deskScrollTop = $("body").scrollTop();
		deskScrollLeft = $("body").scrollLeft();
		$("#wrapper").css({
			top: -deskScrollTop,
			left: -deskScrollLeft
		});
		$("html,body").css({
			overflow:"hidden",
			width: "100%",
			height: "100%"
		});

		$.ajax({
			type: 'GET',
			url: url,
			dataType: 'html',
			success: function(html){
				attachArticle(html);
			}, 
			error: function() {
				self.closeModal();
			}
		});
	}


	self.closeModal = function() {
		isModalVisible = false;
		modalWindow.hide();
		modalLoading.hide();
		modalBG.stop(true).animate({opacity:0}, 300, "linear", function() {
			modalContainer.hide();
			$("html,body").css({
				overflow:"visible",
				width: "auto",
				height: "auto"
			});
			$("body").scrollTop(deskScrollTop).scrollLeft(deskScrollLeft);
			$("#wrapper").css({
				top: "auto",
				left: "auto"
			});
		});
	}


	init();
}


$(function() {
	var desk = new DKTDesk();
	var modal = new DKTModal();
	var handler = new DKTHandler();

	desk.objectClickbehavior = modal.openModal;

	/*--- DKTリスナ設定 ---*/
	handler.listen(desk.update, 10000);

	/*--- リサイズハンドラバインド ---*/
	$(window).on("resize", desk.draw);
});