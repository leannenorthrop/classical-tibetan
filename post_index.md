---
layout: plain
title: Posts
---


<div class="blog-header">
  <h1 class="blog-title">Resources <small>For the Curious</small></h1>
  <p class="lead blog-description">Collection of materials.</p>
</div>

{% assign posts = site.posts | sort: "date" %}

<div class="row">
<div class="list-group">
{% for post in posts %}
<div class="{{post.category}} {{post.tags}}" style="display:none">
<a href="{{site.url}}{{ post.url }}" class="list-group-item">
  <h4 class="list-group-item-heading">{{ post.title }}</h4>
  <p class="list-group-item-text">{{ post.excerpt }}</p>
</a>
</div>
{% endfor %}
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

var type = GetURLParameter("type");
var tag = GetURLParameter("tag");
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

function capitalize(text) {
    return text.substr(0,1).toUpperCase() + text.substr(1);
}

$('h1.blog-title small').text(capitalize(tag) + " " + capitalize(type) + " Posts");
document.title = document.title.replace("Posts", capitalize(tag) + " " + capitalize(type) + " Posts");
</script>
