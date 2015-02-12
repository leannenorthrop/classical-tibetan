define(["jquery",
        "backbone",
        "marionette",
        "text!templates/document_details_modal.html"],
function($, Backbone, Marionette, Template) {
  var template = Template;
  var ConfigDocumentModalView = Backbone.Marionette.ItemView.extend({
    __name__: 'ConfigDocumentView',
    toString: function() {
      return this.__name__ + "(" + (this.attributes ? JSON.stringify(this.attributes) : "") + ")";
    },
    ui: {
      cancelBtn: '#documentConfigModal button.btn-cancel',
      saveBtn: '#documentConfigModal button.btn-save',
      name: '#documentName',
      details: '#documentDetails',
      category: '#documentCategory',
      dialog: '#documentConfigModal',
      gitHubUsername: '#inputUserName',
      gitHubPassword: '#inputPassword'
    },
    events: {
      'click @ui.saveBtn': 'onSave',
      'show.bs.modal @ui.dialog': 'onDisplay',
      'hidden.bs.modal @ui.dialog': 'onHidden'
    },
    initialize: function(options) {
      this.doc = this.model;
      this.onBeforeDestroy = options.onSave;
    },
    getTemplate: function(){
      return _.template(template);
    },
    onRender: function() {
      var me = this;
      require(["cookies",'bootstrap.tagsinput'], function(){
        var controls = [me.ui.name, me.ui.category, me.ui.gitHubUsername, me.ui.gitHubPassword];
        for (var i = 0; i < controls.length; i++) {
          controls[i].prop('required',true);
        }
        $("body").append(me.el);
        me.$el.updatePolyfill();
        $('#documentCategory').selectpicker({
            style: 'btn-default',
            size: 7,
            mobile: true,
            showSubtext: true
          });
        $('#documentTags').tagsinput({trimValue: true, tagClass: 'label label-primary'});
        $(".collapse").on('shown.bs.collapse', me.onUncollapse);
        $(".collapse").on('hidden.bs.collapse', me.onCollapse);
        $('#documentConfigModal').modal({
          show: true,
          keyboard: true
        });
      });
    },
    onDisplay: function(event) {
      try {
        var doc = this.doc;
        this.ui.name.val(doc.get("name"));
        this.ui.details.val(doc.get("description"));
        this.ui.category.val(doc.get("category"));
        this.ui.category.selectpicker('render');
        this.ui.gitHubUsername.val($.cookie('gu'));
        this.ui.gitHubPassword.val($.cookie('gp'));
        _.each(doc.get("tags"), function(tag){$('#documentTags').tagsinput('add', tag);});
      }catch(e){
        console.log(e);
      }
    },
    onHidden: function(event) {
      event.data.view.destroy();
      $("body").removeClass("modal-open");
    },
    onSave: function(e) {
      var doc = this.doc;
      try {
        doc.set("name", this.ui.name.val());
        doc.set("description", this.ui.details.val());
        var selected = $("#documentCategory option:selected");
        var category = selected.val();
        doc.set("category", category);
        $.cookie('gu', this.ui.gitHubUsername.val(), { expires: 31 });
        var p = this.ui.gitHubPassword.val();
        if (!p) {
          $('#ghf').collapse('show');
        } else {
          $.cookie('gp', p, { expires: 1 });
        }
        doc.set("tags", $("#documentTags").val().split(","));
      } catch(e) {
        console.log(e);
      }
      finally {
        if ($('#documentConfigModal form').checkValidity()) {
          $(this.selector).modal('hide');
          this.onBeforeDestroy(doc);
          $("body").removeClass("modal-open");
          this.destroy();
        }
      }
    },
    onUncollapse: function(e) {
      $("a[href='#" + e.currentTarget.id + "'] span").removeClass('glyphicon-collapse-down').addClass('glyphicon-collapse-up');
    },
    onCollapse: function(e) {
      $("a[href='#" + e.currentTarget.id + "'] span").removeClass('glyphicon-collapse-up').addClass('glyphicon-collapse-down');
    }
  });

  return ConfigDocumentModalView;
});
