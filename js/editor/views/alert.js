define(["jquery",
        "backbone",
        "marionette",
        "text!templates/alert.html",
        "underscore"],

function($, Backbone, Marionette, Template, _) {
  var template = Template;
  var AlertView = Backbone.Marionette.ItemView.extend({
    __name__: 'AlertView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    ui: {
      closeBtn: 'button.close'
    },
    events: {
      'click @ui.closeBtn': 'onClose'
    },
    getTemplate: function(){
      return _.template(template)({title: this.title, c: this.c, message: this.message});
    },
    initialize: function(options) {
      this.title = options && options.title ? options.title : "Alert!";
      this.c = options && options.c ? options.c : "alert-error";
      this.message = options && options.message ? options.message : "Hello";
    },
    show: function() {
      this.render();
      $("body").prepend(this.el);
      $('#alert').modal('show');
    },
    onClose: function() {
      var me = this;
      $('#alert').modal('hide');
      $('#alert').on('hidden.bs.modal', function (e) {
        me.destroy();
      });
    }
  });

  return AlertView;
});
