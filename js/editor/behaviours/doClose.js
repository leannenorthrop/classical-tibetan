define(['jquery', 'bootstrap', 'marionette', 'cookies', 'editor/models/document', 'underscore', 'github'],
  function(Jquery, Bootstrap, Marionette, Cookies, DocumentModel, _, GitHub){

  var OnCloseBehavior = Backbone.Marionette.Behavior.extend({
    onClose: function(event) {
      console.log("Do editor close");

      var view = this.view;
      var model = this.view.model;
      if (event.save) {
        var doc = model.get("currentDocument");
        var callback = this.onSaveSuccess.bind(this);
        doc.save({name: doc.get("name"),
                  username: $.cookie('gu'),
                  password: $.cookie('gp'),
                  uname: "leannenorthrop",
                  repositoryName: "classical-tibetan",
                  format: "article",
                  msg: "Saved by editor.",
                  onSuccess: callback});
      } else {
        model.set("currentDocument", new DocumentModel({name: "New"}));
        view.getRegion('editor').currentView.setText(model.get("currentDocument").get("text"));
      }
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
