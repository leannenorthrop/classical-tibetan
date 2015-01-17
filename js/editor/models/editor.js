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
      ace_theme: "",
      ace_wrap: false,
      ace_showMargin: false,
      ace_mode: ""
    }
  });

  return EditorModel;
});
