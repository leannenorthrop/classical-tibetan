define([
  'underscore',
  'backbone',
  'jquery',
  'github',
  'js-yaml'
], function(_, Backbone, $, GitHub, JsYaml){

  var DocumentModel = Backbone.Model.extend({
    defaults: {
      text: "",
      description: "",
      tags: [],
      name: "",
      category: ""
    },
    load: function(text) {
      // strip any yaml
      if (text && text.indexOf("---") === 0) {
        var endIndex = text.indexOf("---", 4);
        var yaml = text.substring(4,endIndex);
        var json = JsYaml.load(yaml);
      }
      this.set("text", text);
    },
    open: function(options) {
      var me = this;
      var github = new Github({
        username: "leannenorthrop",
        password: "***REMOVED***",
        auth: "basic"
      });
      var repo = github.getRepo("leannenorthrop", "classical-tibetan");
      repo.read('gh-pages', me.get("name"), function(err, data) {
        if (!err) {
          me.load(data);
        } else {
          console.log(err);
        }
      });
    },
    close: function(options) {
      if (options && options.save) {
        var me = this;
        var github = new Github({
          username: "leannenorthrop",
          password: "",
          auth: "basic"
        });
        /* lib broken var repo = github.getRepo("leannenorthrop", "classical-tibetan");
        repo.write('gh-pages', '_posts/'+options.name+".md", this.get("text"), 'updated by javascript api', function(err) {
          console.log(err);
        });*/
      }
    }
  });

  return DocumentModel;
});
