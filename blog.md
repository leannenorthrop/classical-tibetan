---
layout: plain_no_cache
title: Blog
---
<div class="blog-header">
  <h1 class="blog-title">Miscellaneous Materials <small>For the Curious</small></h1>
  <p class="lead blog-description">Random collection of materials &amp; musings.</p>
</div>

<div class="list-group">
{% assign posts = site.posts | where: "category","blog" %}
{% for post in posts %}
    <a href="{{ post.url }}" class="list-group-item">
      <h4 class="list-group-item-heading">{{ post.title }} <small>{{ post.url }}</small></h4>
      <p class="list-group-item-text">{{ post.excerpt }} {{ post.url }}</p>
    </a>
{% endfor %}
</div>
