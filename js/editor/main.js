define(["jquery",
        "editor/views/preview",
        "editor/views/editor"],

  function($, PreviewView, EditorView) {
    $(function() {
      var preview = new PreviewView({el: $("#content")});
      var editor = new EditorView({el: $("#editor")});
      preview.model.listenTo(editor.model, "change", preview.process);
    });
});
