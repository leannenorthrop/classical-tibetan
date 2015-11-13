---
layout: default
title: Gathering Understanding| Tibetan Blog ~ Word of the Day
heading: Word of the Day Index
archive-path: /resources/archive.html
archive-name: All Resources
category: resource
catheading: Resources
---
<ul>
{% for entry in site.data.dictionary.all %}
{% if entry.wordOfTheDayOn %}
  <li data-scheduled-date="{{entry.wordOfTheDayOn}}">
    <dt lang="bo"><a href="{{site.baseurl}}/resource/dictionary/index.html#{{ entry.wylie | append: '.'}}">{{ entry.uchen }}</a></dt>
    <dd>({{ entry.phonetics}}) {{ entry.english }}</dd>
  </li>
{% endif %}
{% endfor %}
</ul>