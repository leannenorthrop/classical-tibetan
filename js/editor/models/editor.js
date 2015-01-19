define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var EditorModel = Backbone.Model.extend({
    defaults: {
      textBuffer: "",
      state: "",
      text: "",
      mode: "",
    }
  });

  return EditorModel;
});
