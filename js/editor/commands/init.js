define(['editor/commands/commands',
        'editor/commands/alert',
        'editor/commands/markdownModeChange'],

function(Commands,
         Alert,
         MarkdownModeChange){

  var allCommands = new Commands();
  allCommands.register("showAlert", Alert);
  allCommands.register("modeChange", MarkdownModeChange);
  return allCommands;
});
