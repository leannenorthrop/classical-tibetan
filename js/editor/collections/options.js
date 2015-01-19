define([
  'backbone',
  'editor/models/option'
], function(Backbone, OptionModel){

  var Options = Backbone.Collection.extend({
    model: OptionModel
  });

  return Options;
});
