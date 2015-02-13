---
layout: blog
title: Reading Classical Tibetan
---
<div class="row">
  <ol class="breadcrumb">
    <li><a href="{{site.url}}">Home</a></li>
    <li class="active">Reading Classical Tibetan: Uchen, Wylie &amp; Grammar</li>
  </ol>
</div>

<div class="blog-header">
  <h1 class="blog-title">Reading Classical Tibetan: Uchen, Wylie &amp; Grammar</h1>
</div>

Coming soon but will be covering:

* Readings in Uchen Tibetan script with vocabulary lists, optional phonetics, markup for hi-lighting structures and more.

## Current Posts <small>Tagged as Write</small>

<div class="row">

  <div class="list-group">
{% assign posts = site.posts | where: "category","read" %}
{% for post in posts %}
    <a href="{{site.baseurl}}{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }}</h4>
      <p class="list-group-item-text">{{ post.tags }}</p>
    </a>
{% endfor %}
  </div>

</div>


