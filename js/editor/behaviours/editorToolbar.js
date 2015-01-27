define(['jquery',
        'bootstrap',
        'marionette',
        "editor/behaviours/editorMode",
        "editor/behaviours/doConfigEditor",
        "editor/behaviours/doImport",
        "editor/behaviours/doExport",
        "editor/behaviours/doOpen",
        "editor/behaviours/doClose",
        "editor/behaviours/doDelete",
        "editor/behaviours/doGetDescription",
        "editor/behaviours/doGetTags",
        "editor/behaviours/doToggleColumnSize",
        "editor/behaviours/process"
        ],
function(Jquery, Bootstrap, Marionette,
         OnEditorModeChange, OnConfigEditor,
         OnImport, OnExport, OnOpen, OnClose,
         OnDelete, OnGetDescription, OnGetTags,
         OnToggleColumnSize, OnTextChange){
  var EditorToolbarBehaviors = {
    behaviors: {
      EditorModeChange: {
        behaviorClass: OnEditorModeChange,
        app: this.app
      },
      Config: {
        behaviorClass: OnConfigEditor,
        app: this.app
      },
      Import: {
        behaviorClass: OnImport,
        app: this.app
      },
      Export: {
        behaviorClass: OnExport,
        app: this.app
      },
      Open: {
        behaviorClass: OnOpen,
        app: this.app
      },
      Close: {
        behaviorClass: OnClose,
        app: this.app
      },
      Delete: {
        behaviorClass: OnDelete,
        app: this.app
      },
      GetDescription: {
        behaviorClass: OnGetDescription,
        app: this.app
      },
      GetTags: {
        behaviorClass: OnGetTags,
        app: this.app
      },
      ToggleColumnSize: {
        behaviorClass: OnToggleColumnSize,
        app: this.app
      },
      TextChange: {
        behaviorClass: OnTextChange,
        app: this.app
      },
    },
  };

  return EditorToolbarBehaviors;
});
