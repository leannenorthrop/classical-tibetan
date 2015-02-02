define(['jquery',
        'bootstrap',
        'marionette',
        'cookies',
        'editor/models/document',
        'underscore',
        'github',
        'editor/views/configDocument'],
function(Jquery, Bootstrap, Marionette, Cookies, DocumentModel, _, GitHub, ConfigDocumentView){

  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function(event) {
      console.log("Do editor close");

      if (event.save) {
        var modalView = new ConfigDocumentView({model:this.view.model, app: this.options.app});
        this.listenToOnce(modalView, "saved", this.doClose);
        modalView.render();
      } else {
        model.set("currentDocument", new DocumentModel({name: "New"}));
        view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
      }
    },
    doClose: function() {
      var view = this.view;
      var model = this.view.model;
      var doc = model.get("currentDocument");
      var onSave = this.onSaveSuccess.bind(this);
      var onError = this.onSaveError.bind(this);
      doc.save({name: doc.get("name"),
                username: $.cookie('gu'),
                password: $.cookie('gp'),
                uname: "leannenorthrop",
                repositoryName: "classical-tibetan",
                format: "article",
                msg: "Saved by editor.",
                onSuccess: onSave,
                onError: onError});
    },
    onSaveError: function(err) {
      require(["editor/app"], function(App){
        App.alert("Failed to save document error (code:"+err.error+")", "danger", "Save Error!");
      });
    },
    onSaveSuccess: function() {
      var gh = new Github({token: "2b0eb792116e96b059744ffdb21ab03a125625d3", auth: "oauth"});
      var repo = gh.getRepo("leannenorthrop", "classical-tibetan");
      repo.contents("gh-pages", "_posts", function(err, contents) {
        var dirList = $.parseJSON(contents);
        var worker = new Worker('../js/listposts.js');

        var seen = 0;
        worker.addEventListener('message', function(e) {
          var data = e.data;
          switch (data.cmd) {
            case 'read':
              seen++;
              console.log("Read file " + data.file + "? " + !data.fail);
              if (seen == dirList.length) {
                worker.postMessage({'cmd': 'postIndexesAndStop'});
              }
            break;
            default:
              console.log(data);
          }
        }, false);

        worker.postMessage({'cmd': 'start'});
        for (i in dirList) {
          var file = dirList[i].path;
          worker.postMessage({'cmd': 'read', 'file': file});
        }
      }, false);
    }
  });

  return OnCloseBehavior;
});
