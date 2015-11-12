---
layout: default
title: Test Yourself
---
<div class="row">
  <ol class="breadcrumb">
    <li><a href="{{site.url}}">Home</a></li>
    <li class="active">Tests, Exercises &amp; Puzzles</li>
  </ol>
</div>

<div class="blog-header">
  <h1 class="blog-title">Tests, Exercises &amp; Puzzles</h1>
</div>

Coming soon but will be covering:

* Flash Cards for learning vocabulary
* Puzzles
    * Suduku for learning numbers
    * Find words grid for learning spelling, or vocabulary
* Translations

## Current Posts <small>Tagged as Test</small>

<div class="row">

  <div class="list-group">
{% assign posts = site.posts | where: "category","test" %}
{% for post in posts %}
    <a href="{{site.baseurl}}{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }}</h4>
      <p class="list-group-item-text">{{ post.tags }}</p>
    </a>
{% endfor %}
  </div>

</div>