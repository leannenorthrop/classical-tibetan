---
layout: blog
title: About This Site
---
<div class="row">
  <ol class="breadcrumb">
    <li><a href="{{site.url}}">Home</a></li>
    <li class="active">About This Site</li>
  </ol>
</div>

<div class="blog-header">
  <h1 class="blog-title">About This Site</h1>
</div>

Coming soon but will be covering:

* Inspiration
* Resources
* Code frameworks for editor

## Current Posts <small>Tagged as About</small>

<div class="row">

  <div class="list-group">
{% assign posts = site.posts | where: "category","about" %}
{% for post in posts %}
    <a href="{{site.baseurl}}{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }}</h4>
      <p class="list-group-item-text">{{ post.tags }}</p>
    </a>
{% endfor %}
  </div>

</div>