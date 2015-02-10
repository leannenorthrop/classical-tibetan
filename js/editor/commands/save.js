define(['editor/app'],
function(App) {

  var onSaveError = function(err) {
    Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Failed to save document error (code:"+err.error+")", "danger", "Save Error!" );
  }

  var onSaveSuccess = function() {
    Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Saved document.", "success", "Success!" );
    Backbone.Wreqr.radio.commands.execute( 'editor', 'update-index');
  }

  App.save= function(doc, options) {
    require(['cookies'], function() {
      try {
        doc.save({name: options && options.name ? options.name : doc.get("name"),
                  username: options && options.un ? options.un : $.cookie('gu'),
                  password: options && options.pw ? options.pw : $.cookie('gp'),
                  uname: options && options.account ? options.account : "leannenorthrop",
                  token: options && options.token ? options.token : "2b0eb792116e96b059744ffdb21ab03a125625d3",
                  repositoryName: options && options.repo ? options.repo :"classical-tibetan",
                  format: options && options.format ? options.format : "article",
                  msg: options && options.msg ? options.msg : "Saved by editor.",
                  onSuccess: options && options.onSave ? options.onSave : onSaveSuccess,
                  onError: options && options.onError ? options.onError : onSaveError});
      } catch (e) {
        console.log("Unable to save document. Error:");
        console.log(e);
      }
    });
  };

});
