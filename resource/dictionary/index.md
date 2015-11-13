---
layout: default
title: Gathering Understanding| Tibetan Blog ~ Dictionary
heading: Dictionary
archive-path: /resources/archive.html
archive-name: All Resources
category: resource
catheading: Resources
---

<dl class="dl-horizontal">
{% for entry in site.data.dictionary.all %}
  <dt lang="bo"><a name="{{entry.wylie| append: '.'}}">{{ entry.uchen }}</a></dt>
  <dd>({{ entry.phonetics}}) {{ entry.english }}</dd>
{% endfor %}
</dl>

