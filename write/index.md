---
layout: blog
title: Writing Classical Tibetan
---
<div class="row">
  <ol class="breadcrumb">
    <li><a href="{{site.url}}">Home</a></li>
    <li class="active">Writing Classical Tibetan: Uchen, Wylie &amp; Calligraphy</li>
  </ol>
</div>

<div class="blog-header">
  <h1 class="blog-title">Writing Classical Tibetan: Uchen, Wylie &amp; Calligraphy</h1>
</div>

Coming soon but will be covering:

* Typing Tibetan
    * Wylie input for creating Uchen Tibtan Script (use "Create Your Own" menu options above to try this out)
    * Uchen input configuration for direct typing
* Calligraphy

## Current Posts <small>Tagged as Write</small>

<div class="row">

  <div class="list-group">
{% assign posts = site.posts | where: "category","write" %}
{% for post in posts %}
    <a href="{{site.baseurl}}{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }}</h4>
      <p class="list-group-item-text">{{ post.tags }}</p>
    </a>
{% endfor %}
  </div>

</div>