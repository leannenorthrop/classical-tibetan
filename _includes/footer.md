
    </div>

    <!-- FOOTER -->
    <footer>
      <hr/>
{% if site.footer-links.dribbble %}<a href="http://dribbble.com/{{ site.footer-links.dribbble }}"><i class="svg-icon dribbble"></i></a>{% endif %}
{% if site.footer-links.email %}<a href="mailto:{{ site.footer-links.email }}"><i class="svg-icon email"></i></a>{% endif %}
{% if site.footer-links.facebook %}<a href="http://facebook.com/{{ site.footer-links.facebook }}"><i class="svg-icon facebook"></i></a>{% endif %}
{% if site.footer-links.flickr %}<a href="http://flickr.com/{{ site.footer-links.flickr }}"><i class="svg-icon flickr"></i></a>{% endif %}
{% if site.footer-links.github %}<a href="{{ site.github.owner_url }}"><i class="svg-icon github"></i></a>{% endif %}
{% if site.footer-links.instagram %}<a href="http://instagram.com/{{ site.footer-links.instagram }}"><i class="svg-icon instagram"></i></a>{% endif %}
{% if site.footer-links.linkedin %}<a href="http://linkedin.com/in/{{ site.footer-links.linkedin }}"><i class="svg-icon linkedin"></i></a>{% endif %}
{% if site.footer-links.pinterest %}<a href="http://pinterest.com/{{ site.footer-links.pinterest }}"><i class="svg-icon pinterest"></i></a>{% endif %}
{% if site.footer-links.rss %}<a href="{{ site.baseurl }}/feed.xml"><i class="svg-icon rss"></i></a>{% endif %}
{% if site.footer-links.twitter %}<a href="http://twitter.com/{{ site.footer-links.twitter }}"><i class="svg-icon twitter"></i></a>{% endif %}
{% if site.footer-links.stackoverflow %}<a href="http://stackoverflow.com/{{ site.footer-links.stackoverflow }}"><i class="svg-icon stackoverflow"></i></a>{% endif %}

      <p class="pull-right"><a href="#">Back to top</a></p>
      <p>&copy; 2015 Leanne Northrop &middot; <a href="#">Privacy</a> &middot; <a href="#">Terms</a></p>
    </footer>

    <script src="https://code.jquery.com/jquery-1.10.2.min.js"></script>
    <script src="{{site.baseurl}}/js/bootstrap.js"></script>
{% if site.google_analytics %}
  <!-- Google Analytics -->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', '{{ site.google_analytics }}', 'auto');
    ga('send', 'pageview');
  </script>
  <!-- End Google Analytics -->
{% endif %}
  </body>
</html>
