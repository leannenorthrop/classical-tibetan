define(["jquery",
        "backbone",
        "marionette",
        "text!templates/document_details_modal.html",
        "cookies",
        'bootstrap.tagsinput'],
function($, Backbone, Marionette, Template, Cookies, Tags) {
  var template = Template;
  var ConfigDocumentModalView = Backbone.Marionette.ItemView.extend({
    ui: {
      cancelBtn: '#documentConfigModal button.btn-default',
      saveBtn: '#documentConfigModal button.btn-primary',
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
      this.doc = this.model.get("currentDocument");
      this.onBeforeDestroy = options.onSave;
    },
    getTemplate: function(){
      return _.template(template);
    },
    onRender: function() {
      var controls = [this.ui.name, this.ui.category, this.ui.gitHubUsername, this.ui.gitHubPassword];
      for (var i = 0; i < controls.length; i++) {
        controls[i].prop('required',true);
      }
      $("body").append(this.el);
      this.$el.updatePolyfill();
      $('#documentCategory').selectpicker({
          style: 'btn-default',
          size: 7,
          mobile: true,
          showSubtext: true
        });
      $('#documentTags').tagsinput({trimValue: true, tagClass: 'label label-primary'});
      $(".collapse").on('shown.bs.collapse', this.onUncollapse);
      $(".collapse").on('hidden.bs.collapse', this.onCollapse);
      $('#documentConfigModal').modal({
        show: true,
        keyboard: true
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
      this.destroy();
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
