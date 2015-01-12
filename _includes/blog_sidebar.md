---
---

### About Me

Donec libero libero, bibendum non condimentum ac, ullamcorper at sapien.\
 Duis feugiat urna vel justo cursus facilisis. Vivamus ligula dui, convalli\
s a varius vitae, facilisis eget magna.

{% for category in site.categories %}
{% if category[0] != "lessons" %}
<h2>{{ category[0] }}</h2>
<ul class="posts">
  {% for post in category[1] %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>
{% endif %}
{% endfor %}
