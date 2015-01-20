define([
  'underscore',
  'backbone',
  'editor/models/ace',
  'editor/models/document'
], function(_, Backbone, AceModel, Document){

  var EditorModel = Backbone.Model.extend({
    defaults: {
      state: "",
      mode: "",
      currentDocument: undefined,
      editor: undefined
    }
  });

  return EditorModel;
});
