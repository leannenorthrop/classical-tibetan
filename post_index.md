---
layout: plain_no_cache
title: Posts
---

<div class="row">
  <ol class="breadcrumb">
    <li><a href="{{site.url}}">Home</a></li>
    <li class="active">Site Resources</li>
  </ol>
</div>

<div class="blog-header">
  <h1 class="blog-title">Resources <small>For the Curious</small></h1>
  <p class="lead blog-description">Collection of materials.</p>
</div>

<div class="row">
<div class="list-group">
</div>
<div class="row notfound" style="display:none">
<div class="jumbotron">
  <h1>Sorry!</h1>
  <h2>The material you were searching for can not be found.</h2>
</div>
</div>
</div>

<script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
<script>
var baseurl = {{site.baseurl}};
function GetURLParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++)
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
        {
            return sParameterName[1];
        }
    }
}

function capitalize(text) {
  if (text)
    return text.substr(0,1).toUpperCase() + text.substr(1);
  else
    return "";
}

$.getJSON( "post_index.json", function( data ) {
  var items = [];
  $.each( data, function( key, val ) {
    items.push('<div class="' + val.category + ' ' + val.tags.join(" ") + ' style="display:none"><a href="' + baseurl + val.file + '" class="list-group-item"><h4 class="list-group-item-heading">' + val.title + '</h4><p class="list-group-item-text">' + val.description + '</p></a></div>');
  });

  $(".list-group").html(items.join(""));

  var type = GetURLParameter("type");
  var tag = GetURLParameter("tag");

  var title = capitalize(tag) + " " + capitalize(type) + " Posts";
  $('h1.blog-title small').text(title);
  $('li.active').text(capitalize(type) + " Posts");
  document.title = document.title.replace("Posts", title);

  if (type) {
    if (!tag) {
      $('div[class*=' + type + ']').show();
    } else {
      $('div[class*=' + type + ']').filter('.' + tag).show();
    }
  }
  if ($('div.row div:visible').length === 0) {
    $('div.notfound').show();
  }
});
</script>
