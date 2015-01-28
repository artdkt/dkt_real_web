var DKTHandler = function() {
  var self = this;
  self.call;
  

  function init() {
    self.fetch();
  }

  
  self.fetch = function() {
    $.ajax({
      type: 'GET',
      url: 'dummy.json',
      dataType: 'json',
      success: function(json){
        self.datas = json;
      }, 
      error: function() {
        self.datas = {status: "error"};
      },
      complete: function(){
        self.call(self.datas.materials);
      }
    });
  }


  self.listen = function(call, msec) {
    self.call = call;

    setInterval(function() {
      self.fetch();
    } , msec);
  }


  init();
};
