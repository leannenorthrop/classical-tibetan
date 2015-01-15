define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var EditorModel = Backbone.Model.extend({
    defaults: {
      text: ""
    }
  });

  return EditorModel;
});
