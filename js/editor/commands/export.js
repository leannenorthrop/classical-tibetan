define(['editor/app', "underscore", "text!templates/export.html"],
function(App, _, Template) {
  var template = Template;
  var compiledTemplate = _.template(template);
  App.export = function(doc) {
    require(['fileSaver'], function(FileSaver){
      var name = doc.get("name");
      if (name.lastIndexOf("/") >= 0) {
        name = name.substr(name.lastIndexOf("/")+1);
      }
      var isHtml = doc.get("format") === "html";
      var type = isHtml ? "text/html;charset=utf-8" : "text/plain;charset=utf-8";
      var content = doc.get("text");
      if (isHtml) {
        content = compiledTemplate({title: name, content: content});
      }
      var blob = new Blob([content], {type: type});
      new FileSaver(blob, name);
    });
  };

});
