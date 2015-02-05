define(['editor/app'],
function(App) {

  var seen = 0;
  var dirList = [];
  var worker = null;

  var onWorkerCommand = function(e) {
    var data = e.data;
    switch (data.cmd) {
      case 'read':
        seen++;
        console.log("Read file " + data.file + "? " + !data.fail);
        if (seen == dirList.length) {
          worker.postMessage({'cmd': 'postIndexesAndStop'});
          console.log("Posts read. Generating index");
        }
        break;
      case 'done':
        console.log(data);
        var e = data.error;
        if (!e) {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Index generated.", "success", "Saved");
        } else {
          Backbone.Wreqr.radio.commands.execute( 'editor', 'alert', "Save partially successful. Document saved but update to post_index.json failed. (Error = " + e + ")", "warning", "Saved");
        }
        break;
      default:
        console.log(data);
        break;
    }
  }

  var onRetrievedPosts = function(err, contents) {
    seen = 0;
    dirList = $.parseJSON(contents);

    // Start Web Backgroun Worker to read post files & generate index
    worker = new Worker('../js/listposts.js');
    worker.addEventListener('message', onWorkerCommand, false);
    worker.postMessage({'cmd': 'start'});

    // Process posts
    for (i in dirList) {
      var file = dirList[i].path;
      worker.postMessage({'cmd': 'read', 'file': file});
    }
  };

  App.updateIndex = function() {
    var gh = new Github({token: "2b0eb792116e96b059744ffdb21ab03a125625d3", auth: "oauth"});
    var repo = gh.getRepo("leannenorthrop", "classical-tibetan");
    repo.contents("gh-pages", "_posts", onRetrievedPosts, false);
  };

});
