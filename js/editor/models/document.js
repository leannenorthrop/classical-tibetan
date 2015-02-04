define([
  'underscore',
  'backbone',
  'jquery',
  'github',
  'js-yaml',
  "markdown"
], function(_, Backbone, $, GitHub, JsYaml, Markdown){

  var token = "2b0eb792116e96b059744ffdb21ab03a125625d3";
  var uname = "leannenorthrop";
  var repositoryName = "classical-tibetan";
  var branch = "gh-pages";
  var markdown = Markdown;
  function currentTime() {
    var d = new Date();
    var curr_date = d.getDate();
    var curr_month = d.getMonth()+1;
    var curr_year = d.getFullYear();
    return curr_year + "-" + curr_month + "-" + curr_date;
  }

  var DocumentModel = Backbone.Model.extend({
    defaults: {
      text: "",
      description: "",
      tags: [],
      name: "New",
      category: "lesson",
      file: '_posts/' + currentTime() + "-New.md",
      created: currentTime(),
      format: ""
    },
    initialize: function(options) {
      this.listenTo(this, "change:name", function(event){
        this.set("file", '_posts/' + event.get("created") + "-" + event.get("name")+".md");
      });
      if (options && options.name && !options.file) {
        this.set("file", '_posts/' + currentTime() + "-" + options.name+".md");
      }
    },
    toFormat: function(format,options) {
      var result = "";
      switch(format) {
        case "html": return this.toHTML(options); break;
        case "article": return this.toArticle(options); break;
        case "raw": return this.get("text");
      }
      return result;
    },
    toHTML: function(options) {
        var text = this.get("text");
        if (options.isWylieOnly === true) {
          text = ":::\n" + text + ":::";
        }

        var tree = markdown.parse(text, "ExtendedWylie");
        var jsonml = markdown.toHTMLTree( tree );
        var html = markdown.renderJsonML( jsonml );

        return html;
    },
    toArticle: function(options) {
      var header = "---\n" + JsYaml.dump({"layout": this.get("category"),
        "category": this.get("category"),
        "tags": this.get("tags") ? this.get("tags").join(" ") : "",
        "title": this.get("name"),
        "description": this.get("description")
      }) + "---\n\n\n";

      var body = this.get("text");
      if (!options || options && !options.parse) {
        var text = this.get("text");
        var dialect = "Wylie";
        var tree = markdown.parse(text, dialect);
        var jsonml = markdown.toHTMLTree(tree, dialect, {skipParas:true});
        body = markdown.renderJsonML(jsonml);
      }

      return header + body;
    },
    load: function(text) {
      // strip any yaml
      if (text && text.indexOf("---") === 0) {
        var endIndex = text.indexOf("---", 4);
        var yaml = text.substring(4,endIndex);
        var json = JsYaml.load(yaml);
        this.set("description", json.description ? json.description : "");
        this.set("category", json.category ? json.category : "");
        this.set("tags", json.tags ? json.tags : "");
        text = text.substring(endIndex+4);
      }
      this.set("text", text.trim());
    },
    open: function(options) {
      var me = this;
      var github = new Github({
        token: token,
        auth: "oauth"
      });
      var repo = github.getRepo(uname, repositoryName);
      repo.read(branch, me.get("file"), function(err, data) {
        if (!err) {
          if (!options || options && options.parse)
            me.load(data);
          else
            me.set("text", data);
          if (options && options.onSuccess)
            options.onSuccess();
        } else {
          console.log(err);
          if (options && options.onError)
            options.onError();
        }
      });
    },
    save: function(options) {
      if (options) {
        var me = this;
        var github = new Github({
          username: options.username,
          password: options.password,
          auth: "basic"
        });
        var repo = github.getRepo(options.uname, options.repositoryName);
        if (repo) {
          repo.write(branch, me.get("file"), me.toFormat(options.format), options.msg, function(err) {
            if (!err) {
              if (options && options.onSuccess)
                options.onSuccess();
            } else {
              if (options && options.onError)
                options.onError(err);
              else
                console.log(err);
            }
          });
        }
      }
    },
    close: function() {}
  });

  return DocumentModel;
});
