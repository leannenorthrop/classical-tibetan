define([
  'backbone',
  'editor/models/help'
], function(Backbone, Help){

  var PostsFiles = Backbone.Collection.extend({
    model: Help,
    url: "../post_index.json",
    __name__: 'Posts',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    }
  });

  return PostsFiles;
});
