---
layout: default
title: All Posts
no_cache: true
heading: All Posts
sitemap: true
---

<div class="row">
  <div class="list-group">
  {% assign posts = site.posts %}
  {% for post in posts %}
      <a href="{{site.baseurl}}{{ post.url }}" class="list-group-item">
        <h4 class="list-group-item-heading">{{ post.title }}</h4>
        <p class="list-group-item-text">{{ post.excerpt }}</p>
      </a>
  {% endfor %}
  </div>
</div>

<div class="row notfound" style="display:none">
  <div class="jumbotron">
    <h1>Sorry!</h1>
    <h2>The material you were searching for can not be found.</h2>
  </div>
</div>

<script src="{{site.baseurl}}/js/lib/jquery-1.11.2.js"></script>
<script>
var base-url = {{site.baseurl}};
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
    items.push('<div class="' + val.category + ' ' + val.tags.join(" ") + ' style="display:none"><a href="' + base-url + val.file + '" class="list-group-item"><h4 class="list-group-item-heading">' + val.title + '</h4><p class="list-group-item-text">' + val.description + '</p></a></div>');
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
