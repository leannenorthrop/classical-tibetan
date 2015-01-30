var me = this;
importScripts('../js/lib/underscore.js');
// setup for github library
var window = {};
window.XMLHttpRequest = XMLHttpRequest;
window._ = _;
//
importScripts('../js/lib/github.js');
importScripts('../js/lib/js-yaml.js');

var gh = new window.Github({token: "2b0eb792116e96b059744ffdb21ab03a125625d3", auth: "oauth"});
var repo = gh.getRepo("leannenorthrop", "classical-tibetan");
var branch = "gh-pages";
var entries = []

me.addEventListener('message', function(e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      me.postMessage('WORKER STARTED.');
      break;
    case 'read':
      var file = data.file;
      repo.read(branch, file, function(err, contents) {
        if (!err) {
          if (contents && contents.indexOf("---") === 0) {
            var endIndex = contents.indexOf("---", 4);
            var yaml = contents.substring(4,endIndex);
            var json = window.jsyaml.load(yaml);
            entries.push({"file": json.permalink ? json.permalink : file,
                          "tags": json.tags ? json.tags.split(",") : [],
                          "title": json.title,
                          "category": json.category});
            me.postMessage({'cmd': 'read', 'file': file, 'fail': false});
          } else {
            me.postMessage({'cmd': 'read', 'file': data.file, 'fail': false, details: {}});
          }
        } else {
         me.postMessage({'cmd': 'read', 'file': data.file, 'fail': true});
        }
      });
      break;
    case 'postIndexesAndStop':
      var index = createJSONIndex(entries);
      repo.write(branch, 'post_index.json', index, 'Updated by editor', function(err) {
        me.close();
        e.postMessage('Update to post_index.' + fileFormats[i] + '?' + err);
      });
      break;
    case 'stop':
      me.postMessage('WORKER STOPPED.');
      me.close();
      break;
    default:
      me.postMessage('Unknown command: ' + data.msg);
  };
}, false);
