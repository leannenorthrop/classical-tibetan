define(['underscore','backbone'], function(_, Backbone){

  var EditorModel = Backbone.Model.extend({
    __name__: 'EditorModel',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
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
