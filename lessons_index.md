---
title: Learning to Read Classical Tibetan
layout: lessons
permalink: /lessons/index.html
stages:
  - stage0
  - stage1
  - stage2
  - stage3
  - stage4
stageTitles:
  - ignore
  - Getting Started
  - Stage 1 Beginners
  - Stage 2 Beginners
  - Stage 3 Beginners
  - Stage 4 Beginners
---
<p class="row">&nbsp;</p>

# Learning Resources

<div class="row">
  <div class="col-lg-3">
    <img class="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" style="width: 140px; height: 140px;">
    <h2>Getting Started</h2>
    <p>Materials for those completely new to reading Classical Tibetan. Contains lessons
    on the alphabet and sounds.</p>
    <p><a class="btn sbtn-default" href="#" role="button">View details &raquo;</a></p>
  </div>
  <div class="col-lg-3">
    <img class="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" style="width: 140px; height: 140px;">
    <h2>Stage 1</h2>
    <p>Materials for those who can recognise letters and moving towards reading words.</p>
    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
  </div>
  <div class="col-lg-3">
    <img class="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" style="width: 140px; height: 140px;">
    <h2>Stage 2</h2>
    <p>Materials for those who have basic vocabulary and wish to start reading sentences.</p>
    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
  </div>
  <div class="col-lg-3">
    <img class="img-circle" src="data:image/gif;base64,R0lGODlhAQABAIAAAHd3dwAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" alt="Generic placeholder image" style="width: 140px; height: 140px;">
    <h2>Stage 3</h2>
    <p>Materials for those with basic grasp of reading.</p>
    <p><a class="btn btn-default" href="#" role="button">View details &raquo;</a></p>
  </div>
</div>

<hr/>

## Lessons

{% assign lessonsByTitle = site.posts | where: "category", "lesson" | sort: "date" %}

<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
<div class="panel panel-default">
{% for stage in page.stages %}
    <div class="panel-heading" role="tab" id="{{stage}}">
      <h4 class="panel-title">
        <a data-toggle="collapse" data-parent="#accordion" href="#collapse{{forloop.index}}" aria-expanded="false" aria-controls="collapse{{forloop.index}}">
          {{page.stageTitles[forloop.index]}}
        </a>
      </h4>
    </div>
    <div id="collapse{{forloop.index}}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="{{stage}}">
      <div class="panel-body">
{% for lesson in lessonsByTitle %}
{% if lesson.tags contains stage %}
<h3><a href="{{site.url}}{{lesson.url}}">{{lesson.title}}</a></h3>
<p>{{lesson.excerpt}}</p>
<hr/>
{% endif %}
{% endfor %}
      </div>
    </div>
{% endfor %}
  </div>
</div>
