define(['underscore','backbone'], function(_, Backbone){

  var EditorModel = Backbone.Model.extend({
    defaults: {
      state: "mode",
      mode: "plain-wylie",
      format: "html",
      currentDocument: undefined,
      editor: undefined
    }
  });

  return EditorModel;
});
