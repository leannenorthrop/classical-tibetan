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
    <span class="tb" style="display:none;">Schedule date: {{entry.wordOfTheDayOn}}<br>
      {% assign h = entry.wylie | append: '.' %}      
      {% assign posts = site.posts | where: "category", page.category %}
      <a href="https://twitter.com/share" class="twitter-share-button" data-url="{{site.baseurl}}resource/dictionary/index.html#{{h | uri_escape}}" data-text="Tibetan Word of the Day {{ entry.uchen }} ({{ entry.phonetics}}) {{ entry.english }}" data-size="large" data-hashtags="wotd,tibetan">Tweet</a>
    </span>
  </li>
{% endif %}
{% endfor %}
</ul>

<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>

<script src="{{site.baseurl}}/js/lib/jquery-1.11.2.js"></script>
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
var isme = GetURLParameter("leanne");
if (isme) {
  $("li span.tb").show();
}
</script>
