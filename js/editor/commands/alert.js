define(['editor/app', "editor/views/alert"],
function(App, AlertView) {

  App.alert = function(msg, type, heading) {
    var c, strong;
    switch(type) {
      case "info": c = "alert-info"; strong = "Information"; break;
      case "warning": c = "alert-warning"; strong = "Warning!"; break;
      case "danger": c = "alert-danger"; strong = "Error!"; break;
      case "success": default: c = "alert-success";strong = "Success!";break;
    }
    var alertView = new AlertView({c: c, message: msg, title: (heading?heading:strong)});
    alertView.show();
  };

});
