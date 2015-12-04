define(['editor/app'],
function(App) {

  App.reqres.setHandler("convert", function(doc, srcFormat, dstFormat){
    var result = "";
    if (doc) {
      try {
        var options = {};
        options.isWylieOnly = srcFormat === "plain-wylie";
        result = doc.toFormat(dstFormat, options);
      } catch(e) {
        console.log("Unable to convert document. Error:");
        console.log(e);
      }
    }
    return result;
  });

  App.processing = undefined;

  App.process = function() {
    function convertDocument() {
      try {
        var editorView = App.editor;
        var editorModel = editorView.model;
        var previewView = App.preview;
        var previewModel = previewView.model;
        var doc = editorModel.get("currentDocument");
        var srcFormat = editorModel.get("mode");
        var dstFormat = previewModel.get("format");

        var result = App.reqres.request("convert", doc, srcFormat, dstFormat);
        result = dstFormat === "html" ? result : "<pre>" + result + "</pre>";
        require(["editor/commands/updatePreview"],function() {
          App.preview.update(result);
        });
      } catch (e) {
        console.log("Unable to update preview. Error:");
        console.log(e);
      }
      App.processing = undefined;
    }

    if (App.processing !== undefined) {
      clearTimeout(App.processing);
      App.processing = undefined;
    }
    App.processing = setTimeout(convertDocument, 250);
  };

});
