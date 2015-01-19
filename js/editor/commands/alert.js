define(['jquery', 'bootstrap'], function(Jquery, Bootstrap){
  var Alert = (function(jq, bs){
    return function(options) {
      return {
        execute: function() {
          if (!options.mode) {
            options.mode = "info";
          }
          jq("div.modal-content").attr( "class", "modal-content panel-" + options.mode);
          jq("div.modal-body").html(options.msg);
          if (options.title) {
            jq("h4.modal-title").html(options.title);
          }
          jq("div.modal").modal(options);
          jq("div.modal").modal('show');
        }
      }
    };
  })(Jquery, Bootstrap);

  return Alert;
});
