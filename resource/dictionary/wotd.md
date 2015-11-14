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
    <dt lang="bo"><a name="{{entry.wordOfTheDayOn}}" href="{{site.baseurl}}/resource/dictionary/index.html#{{ entry.wylie | append: '.'}}">{{ entry.uchen }}</a></dt>
    <dd>({{ entry.phonetics}}) {{ entry.english }}</dd>
    <a class="twitter-share-button" href="https://twitter.com/intent/tweet?text={{ entry.uchen }} {{ entry.phonetics}} {{ entry.english }}&amp;url=http://{{site.baseurl}}{{page.url}}&amp;hashtags=wotd,tibetan&amp;via=flowerdew" data-count="horizontal" data-size="large"  data-counturl="{{site.baseurl}}/resource/dictionary/index.html#{{ entry.wylie | append: '.'}}">
Tweet</a>
  </li>
{% endif %}
{% endfor %}
</ul>

<!-- https://dev.twitter.com/web/javascript/loading -->
<script>window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
 
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
 
  return t;
}(document, "script", "twitter-wjs"));</script>