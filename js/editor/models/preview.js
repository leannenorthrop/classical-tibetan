define([
  'underscore',
  'backbone'
], function(_, Backbone){

  var PreviewModel = Backbone.Model.extend({
    defaults: {
      text: ""
    }
  });

  return PreviewModel;
});
