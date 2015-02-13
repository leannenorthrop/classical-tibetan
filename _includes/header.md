<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="author" content="Leanne" />
    <meta name="description" content="{{ site.description }} &copy; 2015 Leanne Northrop">
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
            <li>
              <a href="{{site.baseurl}}/read/index.html" id="read">Read</a>
            </li>
            <li>
              <a href="{{site.baseurl}}/exercises/index.html" id="exercises">Test</a>
            </li>
            <li>
              <a href="{{site.baseurl}}/write/index.html" id="write">Write</a>
            </li>
            <li class="dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown" href="#" id="typeset">Create Your Own <span class="caret"></span></a>
              <ul class="dropdown-menu" aria-labelledby="typeset">
                <li><a href="{{site.baseurl}}/editor/?layout=private">Mixed Language Resources</a></li>
                <li><a href="{{site.baseurl}}/editor/?layout=contrib">Resources and Share on this Site</a></li>
              </ul>
            </li>
            <li>
              <a href="{{site.baseurl}}/blog.html" id="learn">Blog</a>
            </li>
            <li>
              <a href="{{site.baseurl}}/about/index.html" id="about">About</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>

    <div class="container">