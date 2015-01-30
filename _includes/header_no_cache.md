<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Leanne" />
    <meta name="description" content="{{ site.description }}">
    <meta http-equiv="cache-control" content="max-age=0" />
    <meta http-equiv="cache-control" content="no-cache" />
    <meta http-equiv="expires" content="0" />
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />
    <meta http-equiv="pragma" content="no-cache" />

    <title>{% if page.title %}{{ page.title }} – {% endif %}{{ site.github.project_title }} – {{ site.github.project_tagline }}</title>
    <link href="{{ site.baseurl }}/css/bootstrap.css" rel="stylesheet">
    <style>
      body {
        padding-top: 60px;
      }
    </style>
    <link href="{{ site.baseurl }}/css/bootstrap-responsive.css" rel="stylesheet">

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></sc\
ript>
    <![endif]-->


  </head>

  <body>

    <div class="navbar navbar-default navbar-fixed-top">
      <div class="container">
      <div class="navbar-wrapper">
        <div class="navbar-header">
          <button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a href="../" class="navbar-brand">{{  site.name  }}</a>
        </div>
        <div class="navbar-collapse collapse" id="navbar-main">
          <ul class="nav navbar-nav">
            <li>
              <a href="{{site.baseurl}}/lessons/index.html" id="learn">Learn</a>
            </li>
            <!--li>
              <a href="{{site.baseurl}}/exercises/index.html" id="exercises">Exercises</a>
            </li-->
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" id="typeset">Create Your Own <span class="caret"></span></a>
              <ul class="dropdown-menu" aria-labelledby="typeset">
                <li><a href="{{site.baseurl}}/editor/">Mixed Language Resources</a></li>
                <li><a href="{{site.baseurl}}/editor/">Typeset Language Resources</a></li>
                <li><a href="{{site.baseurl}}/editor/">Resources and Share on this Site</a></li>
              </ul>
            </li>
          </ul>

          <!--ul class="nav navbar-nav navbar-right">
            <li><a href="blog.html" target="_blank">Blog</a></li>
          </ul-->

        </div>
      </div>
    </div>
    </div>

    <div class="container">