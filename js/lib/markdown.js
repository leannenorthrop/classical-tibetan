/*!
 * Markdown
 * Released under MIT license
 * Copyright (c) 2009-2010 Dominic Baggott
 * Copyright (c) 2009-2010 Ash Berlin
 * Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)
 * Version: 0.6.0-beta1
 * Date: 2015-01-29T13:51Z
 */

(function(expose) {

  var MarkdownHelpers = {};

  // For Spidermonkey based engines
  function mk_block_toSource() {
    return "Markdown.mk_block( " +
            uneval(this.toString()) +
            ", " +
            uneval(this.trailing) +
            ", " +
            uneval(this.lineNumber) +
            " )";
  }

  // node
  function mk_block_inspect() {
    var util = require("util");
    return "Markdown.mk_block( " +
            util.inspect(this.toString()) +
            ", " +
            util.inspect(this.trailing) +
            ", " +
            util.inspect(this.lineNumber) +
            " )";

  }

  MarkdownHelpers.mk_block = function(block, trail, line) {
    // Be helpful for default case in tests.
    if ( arguments.length === 1 )
      trail = "\n\n";

    // We actually need a String object, not a string primitive
    /* jshint -W053 */
    var s = new String(block);
    s.trailing = trail;
    // To make it clear its not just a string
    s.inspect = mk_block_inspect;
    s.toSource = mk_block_toSource;

    if ( line !== undefined )
      s.lineNumber = line;

    return s;
  };

  var isArray = MarkdownHelpers.isArray = Array.isArray || function(obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
  };

  // Don't mess with Array.prototype. Its not friendly
  if ( Array.prototype.forEach ) {
    MarkdownHelpers.forEach = function forEach( arr, cb, thisp ) {
      return arr.forEach( cb, thisp );
    };
  }
  else {
    MarkdownHelpers.forEach = function forEach(arr, cb, thisp) {
      for (var i = 0; i < arr.length; i++)
        cb.call(thisp || arr, arr[i], i, arr);
    };
  }

  MarkdownHelpers.isEmpty = function isEmpty( obj ) {
    for ( var key in obj ) {
      if ( hasOwnProperty.call( obj, key ) )
        return false;
    }
    return true;
  };

  MarkdownHelpers.extract_attr = function extract_attr( jsonml ) {
    return isArray(jsonml)
        && jsonml.length > 1
        && typeof jsonml[ 1 ] === "object"
        && !( isArray(jsonml[ 1 ]) )
        ? jsonml[ 1 ]
        : undefined;
  };

 /**
   *  class Markdown
   *
   *  Markdown processing in Javascript done right. We have very particular views
   *  on what constitutes 'right' which include:
   *
   *  - produces well-formed HTML (this means that em and strong nesting is
   *    important)
   *
   *  - has an intermediate representation to allow processing of parsed data (We
   *    in fact have two, both as [JsonML]: a markdown tree and an HTML tree).
   *
   *  - is easily extensible to add new dialects without having to rewrite the
   *    entire parsing mechanics
   *
   *  - has a good test suite
   *
   *  This implementation fulfills all of these (except that the test suite could
   *  do with expanding to automatically run all the fixtures from other Markdown
   *  implementations.)
   *
   *  ##### Intermediate Representation
   *
   *  *TODO* Talk about this :) Its JsonML, but document the node names we use.
   *
   *  [JsonML]: http://jsonml.org/ "JSON Markup Language"
   **/
  var Markdown = function(dialect) {
    switch (typeof dialect) {
    case "undefined":
      this.dialect = Markdown.dialects.Gruber;
      break;
    case "object":
      this.dialect = dialect;
      break;
    default:
      if ( dialect in Markdown.dialects )
        this.dialect = Markdown.dialects[dialect];
      else
        throw new Error("Unknown Markdown dialect '" + String(dialect) + "'");
      break;
    }
    this.em_state = [];
    this.strong_state = [];
    this.debug_indent = "";
  };

  /**
   * Markdown.dialects
   *
   * Namespace of built-in dialects.
   **/
  Markdown.dialects = {};

  // Imported functions
  var mk_block = Markdown.mk_block = MarkdownHelpers.mk_block,
      isArray = MarkdownHelpers.isArray;

  /**
   *  parse( markdown, [dialect] ) -> JsonML
   *  - markdown (String): markdown string to parse
   *  - dialect (String | Dialect): the dialect to use, defaults to gruber
   *
   *  Parse `markdown` and return a markdown document as a Markdown.JsonML tree.
   **/
  Markdown.parse = function( source, dialect ) {
    // dialect will default if undefined
    var md = new Markdown( dialect );
    return md.toTree( source );
  };

  /**
   *  count_lines( str ) -> count
   *  - str (String): String whose lines we want to count
   *
   *  Counts the number of linebreaks in `str`
   **/
  function count_lines( str ) {
    return str.split("\n").length - 1;
  }

  // Internal - split source into rough blocks
  Markdown.prototype.split_blocks = function splitBlocks( input ) {
    // Normalize linebreaks to \n.
    input = input.replace(/\r\n?/g, "\n");
    // Match until the end of the string, a newline followed by #, or two or more newlines.
    // [\s\S] matches _anything_ (newline or space)
    // [^] is equivalent but doesn't work in IEs.
    var re = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,
        blocks = [],
        m;

    var line_no = 1;

    if ( ( m = /^(\s*\n)/.exec(input) ) !== null ) {
      // skip (but count) leading blank lines
      line_no += count_lines( m[0] );
      re.lastIndex = m[0].length;
    }

    while ( ( m = re.exec(input) ) !== null ) {
      if (m[2] === "\n#") {
        m[2] = "\n";
        re.lastIndex--;
      }
      blocks.push( mk_block( m[1], m[2], line_no ) );
      line_no += count_lines( m[0] );
    }

    return blocks;
  };

  /**
   *  Markdown#processBlock( block, next ) -> undefined | [ JsonML, ... ]
   *  - block (String): the block to process
   *  - next (Array): the following blocks
   *
   * Process `block` and return an array of JsonML nodes representing `block`.
   *
   * It does this by asking each block level function in the dialect to process
   * the block until one can. Succesful handling is indicated by returning an
   * array (with zero or more JsonML nodes), failure by a false value.
   *
   * Blocks handlers are responsible for calling [[Markdown#processInline]]
   * themselves as appropriate.
   *
   * If the blocks were split incorrectly or adjacent blocks need collapsing you
   * can adjust `next` in place using shift/splice etc.
   *
   * If any of this default behaviour is not right for the dialect, you can
   * define a `__call__` method on the dialect that will get invoked to handle
   * the block processing.
   */
  Markdown.prototype.processBlock = function processBlock( block, next ) {
    var cbs = this.dialect.block,
        ord = cbs.__order__;

    if ( "__call__" in cbs )
      return cbs.__call__.call(this, block, next);

    for ( var i = 0; i < ord.length; i++ ) {
      //D:this.debug( "Testing", ord[i] );
      var res = cbs[ ord[i] ].call( this, block, next );
      if ( res ) {

        if ( !isArray(res) || ( res.length > 0 && !( isArray(res[0]) ) && ( typeof res[0] !== "string")) ) {
          this.debug(ord[i], "didn't return proper JsonML");
        }

        return res;
      }
    }

    // Uhoh! no match! Should we throw an error?
    return [];
  };

  Markdown.prototype.processInline = function processInline( block ) {
    return this.dialect.inline.__call__.call( this, String( block ) );
  };

  /**
   *  Markdown#toTree( source ) -> JsonML
   *  - source (String): markdown source to parse
   *
   *  Parse `source` into a JsonML tree representing the markdown document.
   **/
  // custom_tree means set this.tree to `custom_tree` and restore old value on return
  Markdown.prototype.toTree = function toTree( source, custom_root ) {
    var blocks = source instanceof Array ? source : this.split_blocks( source );

    // Make tree a member variable so its easier to mess with in extensions
    var old_tree = this.tree;
    try {
      this.tree = custom_root || this.tree || [ "markdown" ];

      blocks_loop:
      while ( blocks.length ) {
        var b = this.processBlock( blocks.shift(), blocks );

        // Reference blocks and the like won't return any content
        if ( !b.length )
          continue blocks_loop;

        this.tree.push.apply( this.tree, b );
      }
      return this.tree;
    }
    finally {
      if ( custom_root )
        this.tree = old_tree;
    }
  };

  // Noop by default
  Markdown.prototype.debug = function () {
    var args = Array.prototype.slice.call( arguments);
    args.unshift(this.debug_indent);
    if ( typeof print !== "undefined" )
      print.apply( print, args );
    if ( typeof console !== "undefined" && typeof console.log !== "undefined" )
      console.log.apply( null, args );
  };

  Markdown.prototype.loop_re_over_block = function( re, block, cb ) {
    // Dont use /g regexps with this
    var m,
        b = block.valueOf();

    while ( b.length && (m = re.exec(b) ) !== null ) {
      b = b.substr( m[0].length );
      cb.call(this, m);
    }
    return b;
  };

  // Build default order from insertion order.
  Markdown.buildBlockOrder = function(d) {
    var ord = [];
    for ( var i in d ) {
      if ( i === "__order__" || i === "__call__" )
        continue;
      ord.push( i );
    }
    d.__order__ = ord;
  };

  // Build patterns for inline matcher
  Markdown.buildInlinePatterns = function(d) {
    var patterns = [];

    for ( var i in d ) {
      // __foo__ is reserved and not a pattern
      if ( i.match( /^__.*__$/) )
        continue;
      var l = i.replace( /([\\.*+?^$|()\[\]{}])/g, "\\$1" )
               .replace( /\n/, "\\n" );
      patterns.push( i.length === 1 ? l : "(?:" + l + ")" );
    }

    patterns = patterns.join("|");
    d.__patterns__ = patterns;
    //print("patterns:", uneval( patterns ) );

    var fn = d.__call__;
    d.__call__ = function(text, pattern) {
      if ( pattern !== undefined )
        return fn.call(this, text, pattern);
      else
        return fn.call(this, text, patterns);
    };
  };

  var extract_attr = MarkdownHelpers.extract_attr;

  /**
   *  renderJsonML( jsonml[, options] ) -> String
   *  - jsonml (Array): JsonML array to render to XML
   *  - options (Object): options
   *
   *  Converts the given JsonML into well-formed XML.
   *
   *  The options currently understood are:
   *
   *  - root (Boolean): wether or not the root node should be included in the
   *    output, or just its children. The default `false` is to not include the
   *    root itself.
   */
  Markdown.renderJsonML = function( jsonml, options ) {
    options = options || {};
    // include the root element in the rendered output?
    options.root = options.root || false;

    jsonml = JSON.parse(JSON.stringify(jsonml)); // Clone to prevent mutation of original reference.
    var content = [];

    if ( options.root ) {
      content.push( render_tree( jsonml ) );
    }
    else {
      jsonml.shift(); // get rid of the tag
      if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) )
        jsonml.shift(); // get rid of the attributes

      while ( jsonml.length )
        content.push( render_tree( jsonml.shift() ) );
    }

    return content.join( "\n\n" );
  };

  /**
   *  toHTMLTree( markdown, [dialect] ) -> JsonML
   *  toHTMLTree( md_tree ) -> JsonML
   *  - markdown (String): markdown string to parse
   *  - dialect (String | Dialect): the dialect to use, defaults to gruber
   *  - md_tree (Markdown.JsonML): parsed markdown tree
   *
   *  Turn markdown into HTML, represented as a JsonML tree. If a string is given
   *  to this function, it is first parsed into a markdown tree by calling
   *  [[parse]].
   **/
  Markdown.toHTMLTree = function toHTMLTree( input, dialect , options ) {

    // convert string input to an MD tree
    if ( typeof input === "string" )
      input = this.parse( input, dialect );

    // Now convert the MD tree to an HTML tree

    // remove references from the tree
    var attrs = extract_attr( input ),
        refs = {};

    if ( attrs && attrs.references )
      refs = attrs.references;

    var html = convert_tree_to_html( input, refs , options );
    merge_text_nodes( html );
    return html;
  };

  /**
   *  toHTML( markdown, [dialect]  ) -> String
   *  toHTML( md_tree ) -> String
   *  - markdown (String): markdown string to parse
   *  - md_tree (Markdown.JsonML): parsed markdown tree
   *
   *  Take markdown (either as a string or as a JsonML tree) and run it through
   *  [[toHTMLTree]] then turn it into a well-formated HTML fragment.
   **/
  Markdown.toHTML = function toHTML( source , dialect , options ) {
    var input = this.toHTMLTree( source , dialect , options );

    return this.renderJsonML( input );
  };

  function escapeHTML( text ) {
    if (text && text.length > 0) {
      return text.replace( /&/g, "&amp;" )
                 .replace( /</g, "&lt;" )
                 .replace( />/g, "&gt;" )
                 .replace( /"/g, "&quot;" )
                 .replace( /'/g, "&#39;" );
    } else {
      return "";
    }
  }

  function render_tree( jsonml ) {
    // basic case
    if ( typeof jsonml === "string" )
      return escapeHTML( jsonml );

    var tag = jsonml.shift(),
        attributes = {},
        content = [];

    if ( jsonml.length && typeof jsonml[ 0 ] === "object" && !( jsonml[ 0 ] instanceof Array ) )
      attributes = jsonml.shift();

    while ( jsonml.length )
      content.push( render_tree( jsonml.shift() ) );

    var tag_attrs = "";
    if (typeof attributes.src !== 'undefined') {
      tag_attrs += ' src="' + escapeHTML( attributes.src ) + '"';
      delete attributes.src;
    }

    for ( var a in attributes ) {
      var escaped = escapeHTML( attributes[ a ]);
      if (escaped && escaped.length) {
        tag_attrs += " " + a + '="' + escaped + '"';
      }
    }

    // be careful about adding whitespace here for inline elements
    if ( tag === "img" || tag === "br" || tag === "hr" )
      return "<"+ tag + tag_attrs + "/>";
    else
      return "<"+ tag + tag_attrs + ">" + content.join( "" ) + "</" + tag + ">";
  }

  function convert_tree_to_html( tree, references, options ) {
    var i;
    options = options || {};

    // shallow clone
    var jsonml = tree.slice( 0 );

    if ( typeof options.preprocessTreeNode === "function" )
      jsonml = options.preprocessTreeNode(jsonml, references);

    // Clone attributes if they exist
    var attrs = extract_attr( jsonml );
    if ( attrs ) {
      jsonml[ 1 ] = {};
      for ( i in attrs ) {
        jsonml[ 1 ][ i ] = attrs[ i ];
      }
      attrs = jsonml[ 1 ];
    }

    // basic case
    if ( typeof jsonml === "string" )
      return jsonml;

    // convert this node
    switch ( jsonml[ 0 ] ) {
    case "header":
      jsonml[ 0 ] = "h" + jsonml[ 1 ].level;
      delete jsonml[ 1 ].level;
      break;
    case "bulletlist":
      jsonml[ 0 ] = "ul";
      break;
    case "numberlist":
      jsonml[ 0 ] = "ol";
      break;
    case "listitem":
      jsonml[ 0 ] = "li";
      break;
    case "para":
      jsonml[ 0 ] = "p";
      break;
    case "markdown":
      jsonml[ 0 ] = "html";
      if ( attrs )
        delete attrs.references;
      break;
    case "code_block":
      jsonml[ 0 ] = "pre";
      i = attrs ? 2 : 1;
      var code = [ "code" ];
      code.push.apply( code, jsonml.splice( i, jsonml.length - i ) );
      jsonml[ i ] = code;
      break;
    case "uchen_block":
      jsonml[ 0 ] = "p";
      var wylie = attrs.wylie;
      delete attrs.wylie;
      attrs["data-wylie"] = wylie.trim();
      break;
    case "uchen":
      jsonml[ 0 ] = "span";
      var wylie = attrs.wylie;
      delete attrs.wylie;
      attrs["data-wylie"] = wylie;
      break;
    case "inlinecode":
      jsonml[ 0 ] = "code";
      break;
    case "img":
      jsonml[ 1 ].src = jsonml[ 1 ].href;
      delete jsonml[ 1 ].href;
      break;
    case "linebreak":
      jsonml[ 0 ] = "br";
      break;
    case "link":
      jsonml[ 0 ] = "a";
      break;
    case "link_ref":
      jsonml[ 0 ] = "a";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.href = ref.href;
        if ( ref.title )
          attrs.title = ref.title;

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
    case "img_ref":
      jsonml[ 0 ] = "img";

      // grab this ref and clean up the attribute node
      var ref = references[ attrs.ref ];

      // if the reference exists, make the link
      if ( ref ) {
        delete attrs.ref;

        // add in the href and title, if present
        attrs.src = ref.href;
        if ( ref.title )
          attrs.title = ref.title;

        // get rid of the unneeded original text
        delete attrs.original;
      }
      // the reference doesn't exist, so revert to plain text
      else {
        return attrs.original;
      }
      break;
    }

    // convert all the children
    i = 1;

    // deal with the attribute node, if it exists
    if ( attrs ) {
      // if there are keys, skip over it
      for ( var key in jsonml[ 1 ] ) {
        i = 2;
        break;
      }
      // if there aren't, remove it
      if ( i === 1 )
        jsonml.splice( i, 1 );
    }

    for ( ; i < jsonml.length; ++i ) {
      jsonml[ i ] = convert_tree_to_html( jsonml[ i ], references, options );
    }

    return jsonml;
  }

  // merges adjacent text nodes into a single node
  function merge_text_nodes( jsonml ) {
    // skip the tag name and attribute hash
    var i = extract_attr( jsonml ) ? 2 : 1;

    while ( i < jsonml.length ) {
      // if it's a string check the next item too
      if ( typeof jsonml[ i ] === "string" ) {
        if ( i + 1 < jsonml.length && typeof jsonml[ i + 1 ] === "string" ) {
          // merge the second string into the first and remove it
          jsonml[ i ] += jsonml.splice( i + 1, 1 )[ 0 ];
        }
        else {
          ++i;
        }
      }
      // if it's not a string recurse
      else {
        merge_text_nodes( jsonml[ i ] );
        ++i;
      }
    }
  }

  var DialectHelpers = {};
  DialectHelpers.inline_until_char = function( text, want ) {
    var consumed = 0,
        nodes = [];

    while ( true ) {
      if ( text.charAt( consumed ) === want ) {
        // Found the character we were looking for
        consumed++;
        return [ consumed, nodes ];
      }

      if ( consumed >= text.length ) {
        // No closing char found. Abort.
        return [consumed, null, nodes];
      }

      var res = this.dialect.inline.__oneElement__.call(this, text.substr( consumed ) );
      consumed += res[ 0 ];
      // Add any returned nodes.
      nodes.push.apply( nodes, res.slice( 1 ) );
    }
  };

  // Helper function to make sub-classing a dialect easier
  DialectHelpers.subclassDialect = function( d ) {
    function Block() {}
    Block.prototype = d.block;
    function Inline() {}
    Inline.prototype = d.inline;

    return { block: new Block(), inline: new Inline() };
  };

  var forEach = MarkdownHelpers.forEach,
      extract_attr = MarkdownHelpers.extract_attr,
      mk_block = MarkdownHelpers.mk_block,
      isEmpty = MarkdownHelpers.isEmpty,
      inline_until_char = DialectHelpers.inline_until_char;

  // A robust regexp for matching URLs. Thanks: https://gist.github.com/dperini/729294
  var urlRegexp = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/i.source;

  /**
   * Gruber dialect
   *
   * The default dialect that follows the rules set out by John Gruber's
   * markdown.pl as closely as possible. Well actually we follow the behaviour of
   * that script which in some places is not exactly what the syntax web page
   * says.
   **/
  var Gruber = {
    block: {
      atxHeader: function atxHeader( block, next ) {
        var m = block.match( /^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/ );

        if ( !m )
          return undefined;

        var header = [ "header", { level: m[ 1 ].length } ];
        Array.prototype.push.apply(header, this.processInline(m[ 2 ]));

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [ header ];
      },

      setextHeader: function setextHeader( block, next ) {
        var m = block.match( /^(.*)\n([-=])\2\2+(?:\n|$)/ );

        if ( !m )
          return undefined;

        var level = ( m[ 2 ] === "=" ) ? 1 : 2,
            header = [ "header", { level : level } ].concat( this.processInline(m[ 1 ]) );

        if ( m[0].length < block.length )
          next.unshift( mk_block( block.substr( m[0].length ), block.trailing, block.lineNumber + 2 ) );

        return [ header ];
      },

      code: function code( block, next ) {
        // |    Foo
        // |bar
        // should be a code block followed by a paragraph. Fun
        //
        // There might also be adjacent code block to merge.

        var ret = [],
            re = /^(?: {0,3}\t| {4})(.*)\n?/;

        // 4 spaces + content
        if ( !block.match( re ) )
          return undefined;

        block_search:
        do {
          // Now pull out the rest of the lines
          var b = this.loop_re_over_block(
                    re, block.valueOf(), function( m ) { ret.push( m[1] ); } );

          if ( b.length ) {
            // Case alluded to in first comment. push it back on as a new block
            next.unshift( mk_block(b, block.trailing) );
            break block_search;
          }
          else if ( next.length ) {
            // Check the next block - it might be code too
            if ( !next[0].match( re ) )
              break block_search;

            // Pull how how many blanks lines follow - minus two to account for .join
            ret.push ( block.trailing.replace(/[^\n]/g, "").substring(2) );

            block = next.shift();
          }
          else {
            break block_search;
          }
        } while ( true );

        return [ [ "code_block", ret.join("\n") ] ];
      },

      horizRule: function horizRule( block, next ) {
        // this needs to find any hr in the block to handle abutting blocks
        var m = block.match( /^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/ );

        if ( !m )
          return undefined;

        var jsonml = [ [ "hr" ] ];

        // if there's a leading abutting block, process it
        if ( m[ 1 ] ) {
          var contained = mk_block( m[ 1 ], "", block.lineNumber );
          jsonml.unshift.apply( jsonml, this.toTree( contained, [] ) );
        }

        // if there's a trailing abutting block, stick it into next
        if ( m[ 3 ] )
          next.unshift( mk_block( m[ 3 ], block.trailing, block.lineNumber + 1 ) );

        return jsonml;
      },

      // There are two types of lists. Tight and loose. Tight lists have no whitespace
      // between the items (and result in text just in the <li>) and loose lists,
      // which have an empty line between list items, resulting in (one or more)
      // paragraphs inside the <li>.
      //
      // There are all sorts weird edge cases about the original markdown.pl's
      // handling of lists:
      //
      // * Nested lists are supposed to be indented by four chars per level. But
      //   if they aren't, you can get a nested list by indenting by less than
      //   four so long as the indent doesn't match an indent of an existing list
      //   item in the 'nest stack'.
      //
      // * The type of the list (bullet or number) is controlled just by the
      //    first item at the indent. Subsequent changes are ignored unless they
      //    are for nested lists
      //
      lists: (function( ) {
        // Use a closure to hide a few variables.
        var any_list = "[*+-]|\\d+\\.",
            bullet_list = /[*+-]/,
            // Capture leading indent as it matters for determining nested lists.
            is_list_re = new RegExp( "^( {0,3})(" + any_list + ")[ \t]+" ),
            indent_re = "(?: {0,3}\\t| {4})";

        // TODO: Cache this regexp for certain depths.
        // Create a regexp suitable for matching an li for a given stack depth
        function regex_for_depth( depth ) {

          return new RegExp(
            // m[1] = indent, m[2] = list_type
            "(?:^(" + indent_re + "{0," + depth + "} {0,3})(" + any_list + ")\\s+)|" +
            // m[3] = cont
            "(^" + indent_re + "{0," + (depth-1) + "}[ ]{0,4})"
          );
        }
        function expand_tab( input ) {
          return input.replace( / {0,3}\t/g, "    " );
        }

        // Add inline content `inline` to `li`. inline comes from processInline
        // so is an array of content
        function add(li, loose, inline, nl) {
          if ( loose ) {
            li.push( [ "para" ].concat(inline) );
            return;
          }
          // Hmmm, should this be any block level element or just paras?
          var add_to = li[li.length -1] instanceof Array && li[li.length - 1][0] === "para"
                     ? li[li.length -1]
                     : li;

          // If there is already some content in this list, add the new line in
          if ( nl && li.length > 1 )
            inline.unshift(nl);

          for ( var i = 0; i < inline.length; i++ ) {
            var what = inline[i],
                is_str = typeof what === "string";
            if ( is_str && add_to.length > 1 && typeof add_to[add_to.length-1] === "string" )
              add_to[ add_to.length-1 ] += what;
            else
              add_to.push( what );
          }
        }

        // contained means have an indent greater than the current one. On
        // *every* line in the block
        function get_contained_blocks( depth, blocks ) {

          var re = new RegExp( "^(" + indent_re + "{" + depth + "}.*?\\n?)*$" ),
              replace = new RegExp("^" + indent_re + "{" + depth + "}", "gm"),
              ret = [];

          while ( blocks.length > 0 ) {
            if ( re.exec( blocks[0] ) ) {
              var b = blocks.shift(),
                  // Now remove that indent
                  x = b.replace( replace, "");

              ret.push( mk_block( x, b.trailing, b.lineNumber ) );
            }
            else
              break;
          }
          return ret;
        }

        // passed to stack.forEach to turn list items up the stack into paras
        function paragraphify(s, i, stack) {
          var list = s.list;
          var last_li = list[list.length-1];

          if ( last_li[1] instanceof Array && last_li[1][0] === "para" )
            return;

          if ( i + 1 === stack.length ) {
            // Last stack frame
            // Keep the same array, but replace the contents
            last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ) );
          }
          else {
            var sublist = last_li.pop();
            last_li.push( ["para"].concat( last_li.splice(1, last_li.length - 1) ), sublist );
          }
        }

        // The matcher function
        return function( block, next ) {
          var m = block.match( is_list_re );
          if ( !m )
            return undefined;

          function make_list( m ) {
            var list = bullet_list.exec( m[2] )
                     ? ["bulletlist"]
                     : ["numberlist"];

            stack.push( { list: list, indent: m[1] } );
            return list;
          }

          var stack = [], // Stack of lists for nesting.
              list = make_list( m ),
              last_li,
              loose = false,
              ret = [ stack[0].list ],
              i;

          // Loop to search over block looking for inner block elements and loose lists
          loose_search:
          while ( true ) {
            // Split into lines preserving new lines at end of line
            var lines = block.split( /(?=\n)/ );

            // We have to grab all lines for a li and call processInline on them
            // once as there are some inline things that can span lines.
            var li_accumulate = "", nl = "";

            // Loop over the lines in this block looking for tight lists.
            tight_search:
            for ( var line_no = 0; line_no < lines.length; line_no++ ) {
              nl = "";
              var l = lines[line_no].replace(/^\n/, function(n) { nl = n; return ""; });

              // TODO: really should cache this
              var line_re = regex_for_depth( stack.length );

              m = l.match( line_re );
              //print( "line:", uneval(l), "\nline match:", uneval(m) );

              // We have a list item
              if ( m[1] !== undefined ) {
                // Process the previous list item, if any
                if ( li_accumulate.length ) {
                  add( last_li, loose, this.processInline( li_accumulate ), nl );
                  // Loose mode will have been dealt with. Reset it
                  loose = false;
                  li_accumulate = "";
                }

                m[1] = expand_tab( m[1] );
                var wanted_depth = Math.floor(m[1].length/4)+1;
                //print( "want:", wanted_depth, "stack:", stack.length);
                if ( wanted_depth > stack.length ) {
                  // Deep enough for a nested list outright
                  //print ( "new nested list" );
                  list = make_list( m );
                  last_li.push( list );
                  last_li = list[1] = [ "listitem" ];
                }
                else {
                  // We aren't deep enough to be strictly a new level. This is
                  // where Md.pl goes nuts. If the indent matches a level in the
                  // stack, put it there, else put it one deeper then the
                  // wanted_depth deserves.
                  var found = false;
                  for ( i = 0; i < stack.length; i++ ) {
                    if ( stack[ i ].indent !== m[1] )
                      continue;

                    list = stack[ i ].list;
                    stack.splice( i+1, stack.length - (i+1) );
                    found = true;
                    break;
                  }

                  if (!found) {
                    //print("not found. l:", uneval(l));
                    wanted_depth++;
                    if ( wanted_depth <= stack.length ) {
                      stack.splice(wanted_depth, stack.length - wanted_depth);
                      //print("Desired depth now", wanted_depth, "stack:", stack.length);
                      list = stack[wanted_depth-1].list;
                      //print("list:", uneval(list) );
                    }
                    else {
                      //print ("made new stack for messy indent");
                      list = make_list(m);
                      last_li.push(list);
                    }
                  }

                  //print( uneval(list), "last", list === stack[stack.length-1].list );
                  last_li = [ "listitem" ];
                  list.push(last_li);
                } // end depth of shenegains
                nl = "";
              }

              // Add content
              if ( l.length > m[0].length )
                li_accumulate += nl + l.substr( m[0].length );
            } // tight_search

            if ( li_accumulate.length ) {

              var contents = this.processBlock(li_accumulate, []),
                  firstBlock = contents[0];

              if (firstBlock) {
                firstBlock.shift();
                contents.splice.apply(contents, [0, 1].concat(firstBlock));
                add( last_li, loose, contents, nl );

                // Let's not creating a trailing \n after content in the li
                if(last_li[last_li.length-1] === "\n") {
                  last_li.pop();
                }

                // Loose mode will have been dealt with. Reset it
                loose = false;
                li_accumulate = "";
              }
            }

            // Look at the next block - we might have a loose list. Or an extra
            // paragraph for the current li
            var contained = get_contained_blocks( stack.length, next );

            // Deal with code blocks or properly nested lists
            if ( contained.length > 0 ) {
              // Make sure all listitems up the stack are paragraphs
              forEach( stack, paragraphify, this);

              last_li.push.apply( last_li, this.toTree( contained, [] ) );
            }

            var next_block = next[0] && next[0].valueOf() || "";

            if ( next_block.match(is_list_re) || next_block.match( /^ / ) ) {
              block = next.shift();

              // Check for an HR following a list: features/lists/hr_abutting
              var hr = this.dialect.block.horizRule.call( this, block, next );

              if ( hr ) {
                ret.push.apply(ret, hr);
                break;
              }

              // Add paragraphs if the indentation level stays the same
              if (stack[stack.length-1].indent === block.match(/^\s*/)[0]) {
                forEach( stack, paragraphify, this);
              }

              loose = true;
              continue loose_search;
            }
            break;
          } // loose_search

          return ret;
        };
      })(),

      blockquote: function blockquote( block, next ) {

        // Handle quotes that have spaces before them
        var m = /(^|\n) +(\>[\s\S]*)/.exec(block);
        if (m && m[2] && m[2].length) {
          var blockContents = block.replace(/(^|\n) +\>/, "$1>");
          next.unshift(blockContents);
          return [];
        }

        if ( !block.match( /^>/m ) )
          return undefined;

        var jsonml = [];

        // separate out the leading abutting block, if any. I.e. in this case:
        //
        //  a
        //  > b
        //
        if ( block[ 0 ] !== ">" ) {
          var lines = block.split( /\n/ ),
              prev = [],
              line_no = block.lineNumber;

          // keep shifting lines until you find a crotchet
          while ( lines.length && lines[ 0 ][ 0 ] !== ">" ) {
            prev.push( lines.shift() );
            line_no++;
          }

          var abutting = mk_block( prev.join( "\n" ), "\n", block.lineNumber );
          jsonml.push.apply( jsonml, this.processBlock( abutting, [] ) );
          // reassemble new block of just block quotes!
          block = mk_block( lines.join( "\n" ), block.trailing, line_no );
        }

        // if the next block is also a blockquote merge it in
        while ( next.length && next[ 0 ][ 0 ] === ">" ) {
          var b = next.shift();
          block = mk_block( block + block.trailing + b, b.trailing, block.lineNumber );
        }

        // Strip off the leading "> " and re-process as a block.
        var input = block.replace( /^> ?/gm, "" ),
            old_tree = this.tree,
            processedBlock = this.toTree( input, [ "blockquote" ] ),
            attr = extract_attr( processedBlock );

        // If any link references were found get rid of them
        if ( attr && attr.references ) {
          delete attr.references;
          // And then remove the attribute object if it's empty
          if ( isEmpty( attr ) )
            processedBlock.splice( 1, 1 );
        }

        jsonml.push( processedBlock );
        return jsonml;
      },

      referenceDefn: function referenceDefn( block, next) {
        var re = /^\s*\[([^\[\]]+)\]:\s*(\S+)(?:\s+(?:(['"])(.*)\3|\((.*?)\)))?\n?/;
        // interesting matches are [ , ref_id, url, , title, title ]

        if ( !block.match(re) )
          return undefined;

        var attrs = create_attrs.call( this );

        var b = this.loop_re_over_block(re, block, function( m ) {
          create_reference(attrs, m);
        } );

        if ( b.length )
          next.unshift( mk_block( b, block.trailing ) );

        return [];
      },

      para: function para( block ) {
        // everything's a para!
        return [ ["para"].concat( this.processInline( block ) ) ];
      }
    },

    inline: {

      __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
        var m,
            res;

        patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
        var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

        m = re.exec( text );
        if (!m) {
          // Just boring text
          return [ text.length, text ];
        }
        else if ( m[1] ) {
          // Some un-interesting text matched. Return that first
          return [ m[1].length, m[1] ];
        }

        var res;
        if ( m[2] in this.dialect.inline ) {
          res = this.dialect.inline[ m[2] ].call(
                    this,
                    text.substr( m.index ), m, previous_nodes || [] );
        }
        // Default for now to make dev easier. just slurp special and output it.
        res = res || [ m[2].length, m[2] ];
        return res;
      },

      __call__: function inline( text, patterns ) {

        var out = [],
            res;

        function add(x) {
          //D:self.debug("  adding output", uneval(x));
          if ( typeof x === "string" && typeof out[out.length-1] === "string" )
            out[ out.length-1 ] += x;
          else
            out.push(x);
        }

        while ( text.length > 0 ) {
          res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
          text = text.substr( res.shift() );
          forEach(res, add );
        }

        return out;
      },

      // These characters are interesting elsewhere, so have rules for them so that
      // chunks of plain text blocks don't include them
      "]": function () {},
      "}": function () {},

      __escape__ : /^\\[\\`\*_{}<>\[\]()#\+.!\-]/,

      "\\": function escaped( text ) {
        // [ length of input processed, node/children to add... ]
        // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
        if ( this.dialect.inline.__escape__.exec( text ) )
          return [ 2, text.charAt( 1 ) ];
        else
          // Not an esacpe
          return [ 1, "\\" ];
      },

      "![": function image( text ) {

        // Without this guard V8 crashes hard on the RegExp
        if (text.indexOf('(') >= 0 && text.indexOf(')') === -1) { return; }

        // Unlike images, alt text is plain text only. no other elements are
        // allowed in there

        // ![Alt text](/path/to/img.jpg "Optional title")
        //      1          2            3       4         <--- captures
        //
        // First attempt to use a strong URL regexp to catch things like parentheses. If it misses, use the
        // old one.
        var m = text.match(new RegExp("^!\\[(.*?)][ \\t]*\\((" + urlRegexp + ")\\)([ \\t])*([\"'].*[\"'])?")) ||
                text.match( /^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/ );

        if ( m ) {
          if ( m[2] && m[2][0] === "<" && m[2][m[2].length-1] === ">" )
            m[2] = m[2].substring( 1, m[2].length - 1 );

          m[2] = this.dialect.inline.__call__.call( this, m[2], /\\/ )[0];

          var attrs = { alt: m[1], href: m[2] || "" };
          if ( m[4] !== undefined)
            attrs.title = m[4];

          return [ m[0].length, [ "img", attrs ] ];
        }

        // ![Alt text][id]
        m = text.match( /^!\[(.*?)\][ \t]*\[(.*?)\]/ );

        if ( m ) {
          // We can't check if the reference is known here as it likely wont be
          // found till after. Check it in md tree->hmtl tree conversion
          return [ m[0].length, [ "img_ref", { alt: m[1], ref: m[2].toLowerCase(), original: m[0] } ] ];
        }

        // Just consume the '!['
        return [ 2, "![" ];
      },

      "[": function link( text ) {

        var open = 1;
        for (var i=0; i<text.length; i++) {
          var c = text.charAt(i);
          if (c === '[') { open++; }
          if (c === ']') { open--; }

          if (open > 3) { return [1, "["]; }
        }

        var orig = String(text);
        // Inline content is possible inside `link text`
        var res = inline_until_char.call( this, text.substr(1), "]" );

        // No closing ']' found. Just consume the [
        if ( !res[1] ) {
          return [ res[0] + 1, text.charAt(0) ].concat(res[2]);
        }

        // empty link
        if ( res[0] === 1 ) { return [ 2, "[]" ]; }

        var consumed = 1 + res[ 0 ],
            children = res[ 1 ],
            link,
            attrs;

        // At this point the first [...] has been parsed. See what follows to find
        // out which kind of link we are (reference or direct url)
        text = text.substr( consumed );

        // [link text](/path/to/img.jpg "Optional title")
        //                 1            2       3         <--- captures
        // This will capture up to the last paren in the block. We then pull
        // back based on if there a matching ones in the url
        //    ([here](/url/(test))
        // The parens have to be balanced
        var m = text.match( /^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/ );
        if ( m ) {
          var url = m[1].replace(/\s+$/, '');
          consumed += m[0].length;

          if ( url && url[0] === "<" && url[url.length-1] === ">" )
            url = url.substring( 1, url.length - 1 );

          // If there is a title we don't have to worry about parens in the url
          if ( !m[3] ) {
            var open_parens = 1; // One open that isn't in the capture
            for ( var len = 0; len < url.length; len++ ) {
              switch ( url[len] ) {
              case "(":
                open_parens++;
                break;
              case ")":
                if ( --open_parens === 0) {
                  consumed -= url.length - len;
                  url = url.substring(0, len);
                }
                break;
              }
            }
          }

          // Process escapes only
          url = this.dialect.inline.__call__.call( this, url, /\\/ )[0];

          attrs = { href: url || "" };
          if ( m[3] !== undefined)
            attrs.title = m[3];

          link = [ "link", attrs ].concat( children );
          return [ consumed, link ];
        }

        m = text.match(new RegExp("^\\((" + urlRegexp + ")\\)"));
        if (m && m[1]) {
          consumed += m[0].length;
          link = ["link", {href: m[1]}].concat(children);
          return [consumed, link];
        }

        // [Alt text][id]
        // [Alt text] [id]
        m = text.match( /^\s*\[(.*?)\]/ );
        if ( m ) {

          consumed += m[ 0 ].length;

          // [links][] uses links as its reference
          attrs = { ref: ( m[ 1 ] || String(children) ).toLowerCase(),  original: orig.substr( 0, consumed ) };

          if (children && children.length > 0) {
            link = [ "link_ref", attrs ].concat( children );

            // We can't check if the reference is known here as it likely wont be
            // found till after. Check it in md tree->hmtl tree conversion.
            // Store the original so that conversion can revert if the ref isn't found.
            return [ consumed, link ];
          }
        }

        // Another check for references
        m = orig.match(/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/);
        if (m) {
          var attrs = create_attrs.call(this);
          create_reference(attrs, m);
          return [ m[0].length ];
        }

        // [id]
        // Only if id is plain (no formatting.)
        if ( children.length === 1 && typeof children[0] === "string" ) {

          var normalized = children[0].toLowerCase().replace(/\s+/, ' ');
          attrs = { ref: normalized,  original: orig.substr( 0, consumed ) };
          link = [ "link_ref", attrs, children[0] ];
          return [ consumed, link ];
        }

        // Just consume the "["
        return [ 1, "[" ];
      },

      "<": function autoLink( text ) {
        var m;

        if ( ( m = text.match( /^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/ ) ) !== null ) {
          if ( m[3] )
            return [ m[0].length, [ "link", { href: "mailto:" + m[3] }, m[3] ] ];
          else if ( m[2] === "mailto" )
            return [ m[0].length, [ "link", { href: m[1] }, m[1].substr("mailto:".length ) ] ];
          else
            return [ m[0].length, [ "link", { href: m[1] }, m[1] ] ];
        }

        return [ 1, "<" ];
      },

      "`": function inlineCode( text ) {
        // Inline code block. as many backticks as you like to start it
        // Always skip over the opening ticks.
        var m = text.match( /(`{1,2})(([\s\S]*?)\1)/ );

        if ( m && m[2] )
          return [ m[1].length + m[2].length, [ "inlinecode", m[3] ] ];
        else {
          // TODO: No matching end code found - warn!
          return [ 1, "`" ];
        }
      },

      "  \n": function lineBreak() {
        return [ 3, [ "linebreak" ] ];
      }

    }
  };

  // Meta Helper/generator method for em and strong handling
  function strong_em( tag, md ) {

    var state_slot = tag + "_state",
        other_slot = tag === "strong" ? "em_state" : "strong_state";

    function CloseTag(len) {
      this.len_after = len;
      this.name = "close_" + md;
    }

    return function ( text ) {

      if ( this[state_slot][0] === md ) {
        // Most recent em is of this type
        //D:this.debug("closing", md);
        this[state_slot].shift();

        // "Consume" everything to go back to the recursion in the else-block below
        return[ text.length, new CloseTag(text.length-md.length) ];
      }
      else {
        // Store a clone of the em/strong states
        var other = this[other_slot].slice(),
            state = this[state_slot].slice();

        this[state_slot].unshift(md);

        //D:this.debug_indent += "  ";

        // Recurse
        var res = this.processInline( text.substr( md.length ) );
        //D:this.debug_indent = this.debug_indent.substr(2);

        var last = res[res.length - 1];

        //D:this.debug("processInline from", tag + ": ", uneval( res ) );

        var check = this[state_slot].shift();
        if ( last instanceof CloseTag ) {
          res.pop();
          // We matched! Huzzah.
          var consumed = text.length - last.len_after;
          return [ consumed, [ tag ].concat(res) ];
        }
        else {
          // Restore the state of the other kind. We might have mistakenly closed it.
          this[other_slot] = other;
          this[state_slot] = state;

          // We can't reuse the processed result as it could have wrong parsing contexts in it.
          return [ md.length, md ];
        }
      }
    }; // End returned function
  }

  // A helper function to create attributes
  function create_attrs() {
    if ( !extract_attr( this.tree ) ) {
      this.tree.splice( 1, 0, {} );
    }

    var attrs = extract_attr( this.tree );

    // make a references hash if it doesn't exist
    if ( attrs.references === undefined ) {
      attrs.references = {};
    }

    return attrs;
  }

  // Create references for attributes
  function create_reference(attrs, m) {
    if ( m[2] && m[2][0] === "<" && m[2][m[2].length-1] === ">" )
      m[2] = m[2].substring( 1, m[2].length - 1 );

    var ref = attrs.references[ m[1].toLowerCase() ] = {
      href: m[2]
    };

    if ( m[4] !== undefined )
      ref.title = m[4];
    else if ( m[5] !== undefined )
      ref.title = m[5];
  }

  Gruber.inline["**"] = strong_em("strong", "**");
  Gruber.inline["__"] = strong_em("strong", "__");
  Gruber.inline["*"]  = strong_em("em", "*");
  Gruber.inline["_"]  = strong_em("em", "_");

  Markdown.dialects.Gruber = Gruber;
  Markdown.buildBlockOrder ( Markdown.dialects.Gruber.block );
  Markdown.buildInlinePatterns( Markdown.dialects.Gruber.inline );

  var Maruku = DialectHelpers.subclassDialect( Gruber ),
      extract_attr = MarkdownHelpers.extract_attr,
      forEach = MarkdownHelpers.forEach;

  Maruku.processMetaHash = function processMetaHash( meta_string ) {
    var meta = split_meta_hash( meta_string ),
        attr = {};

    for ( var i = 0; i < meta.length; ++i ) {
      // id: #foo
      if ( /^#/.test( meta[ i ] ) )
        attr.id = meta[ i ].substring( 1 );
      // class: .foo
      else if ( /^\./.test( meta[ i ] ) ) {
        // if class already exists, append the new one
        if ( attr["class"] )
          attr["class"] = attr["class"] + meta[ i ].replace( /./, " " );
        else
          attr["class"] = meta[ i ].substring( 1 );
      }
      // attribute: foo=bar
      else if ( /\=/.test( meta[ i ] ) ) {
        var s = meta[ i ].split( /\=/ );
        attr[ s[ 0 ] ] = s[ 1 ];
      }
    }

    return attr;
  };

  function split_meta_hash( meta_string ) {
    var meta = meta_string.split( "" ),
        parts = [ "" ],
        in_quotes = false;

    while ( meta.length ) {
      var letter = meta.shift();
      switch ( letter ) {
      case " " :
        // if we're in a quoted section, keep it
        if ( in_quotes )
          parts[ parts.length - 1 ] += letter;
        // otherwise make a new part
        else
          parts.push( "" );
        break;
      case "'" :
      case '"' :
        // reverse the quotes and move straight on
        in_quotes = !in_quotes;
        break;
      case "\\" :
        // shift off the next letter to be used straight away.
        // it was escaped so we'll keep it whatever it is
        letter = meta.shift();
        /* falls through */
      default :
        parts[ parts.length - 1 ] += letter;
        break;
      }
    }

    return parts;
  }

  Maruku.block.document_meta = function document_meta( block ) {
    // we're only interested in the first block
    if ( block.lineNumber > 1 )
      return undefined;

    // document_meta blocks consist of one or more lines of `Key: Value\n`
    if ( ! block.match( /^(?:\w+:.*\n)*\w+:.*$/ ) )
      return undefined;

    // make an attribute node if it doesn't exist
    if ( !extract_attr( this.tree ) )
      this.tree.splice( 1, 0, {} );

    var pairs = block.split( /\n/ );
    for ( var p in pairs ) {
      var m = pairs[ p ].match( /(\w+):\s*(.*)$/ ),
          key = m[ 1 ].toLowerCase(),
          value = m[ 2 ];

      this.tree[ 1 ][ key ] = value;
    }

    // document_meta produces no content!
    return [];
  };

  Maruku.block.block_meta = function block_meta( block ) {
    // check if the last line of the block is an meta hash
    var m = block.match( /(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/ );
    if ( !m )
      return undefined;

    // process the meta hash
    var attr = this.dialect.processMetaHash( m[ 2 ] ),
        hash;

    // if we matched ^ then we need to apply meta to the previous block
    if ( m[ 1 ] === "" ) {
      var node = this.tree[ this.tree.length - 1 ];
      hash = extract_attr( node );

      // if the node is a string (rather than JsonML), bail
      if ( typeof node === "string" )
        return undefined;

      // create the attribute hash if it doesn't exist
      if ( !hash ) {
        hash = {};
        node.splice( 1, 0, hash );
      }

      // add the attributes in
      for ( var a in attr )
        hash[ a ] = attr[ a ];

      // return nothing so the meta hash is removed
      return [];
    }

    // pull the meta hash off the block and process what's left
    var b = block.replace( /\n.*$/, "" ),
        result = this.processBlock( b, [] );

    // get or make the attributes hash
    hash = extract_attr( result[ 0 ] );
    if ( !hash ) {
      hash = {};
      result[ 0 ].splice( 1, 0, hash );
    }

    // attach the attributes to the block
    for ( var a in attr )
      hash[ a ] = attr[ a ];

    return result;
  };

  Maruku.block.definition_list = function definition_list( block, next ) {
    // one or more terms followed by one or more definitions, in a single block
    var tight = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,
        list = [ "dl" ],
        i, m;

    // see if we're dealing with a tight or loose block
    if ( ( m = block.match( tight ) ) ) {
      // pull subsequent tight DL blocks out of `next`
      var blocks = [ block ];
      while ( next.length && tight.exec( next[ 0 ] ) )
        blocks.push( next.shift() );

      for ( var b = 0; b < blocks.length; ++b ) {
        var m = blocks[ b ].match( tight ),
            terms = m[ 1 ].replace( /\n$/, "" ).split( /\n/ ),
            defns = m[ 2 ].split( /\n:\s+/ );

        // print( uneval( m ) );

        for ( i = 0; i < terms.length; ++i )
          list.push( [ "dt", terms[ i ] ] );

        for ( i = 0; i < defns.length; ++i ) {
          // run inline processing over the definition
          list.push( [ "dd" ].concat( this.processInline( defns[ i ].replace( /(\n)\s+/, "$1" ) ) ) );
        }
      }
    }
    else {
      return undefined;
    }

    return [ list ];
  };

  // splits on unescaped instances of @ch. If @ch is not a character the result
  // can be unpredictable

  Maruku.block.table = function table ( block ) {

    var _split_on_unescaped = function( s, ch ) {
      ch = ch || '\\s';
      if ( ch.match(/^[\\|\[\]{}?*.+^$]$/) )
        ch = '\\' + ch;
      var res = [ ],
          r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
          m;
      while ( ( m = s.match( r ) ) ) {
        res.push( m[1] );
        s = m[2];
      }
      res.push(s);
      return res;
    };

    var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
        // find at least an unescaped pipe in each line
        no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
        i,
        m;
    if ( ( m = block.match( leading_pipe ) ) ) {
      // remove leading pipes in contents
      // (header and horizontal rule already have the leading pipe left out)
      m[3] = m[3].replace(/^\s*\|/gm, '');
    } else if ( ! ( m = block.match( no_leading_pipe ) ) ) {
      return undefined;
    }

    var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

    // remove trailing pipes, then split on pipes
    // (no escaped pipes are allowed in horizontal rule)
    m[2] = m[2].replace(/\|\s*$/, '').split('|');

    // process alignment
    var html_attrs = [ ];
    forEach (m[2], function (s) {
      if (s.match(/^\s*-+:\s*$/))
        html_attrs.push({align: "right"});
      else if (s.match(/^\s*:-+\s*$/))
        html_attrs.push({align: "left"});
      else if (s.match(/^\s*:-+:\s*$/))
        html_attrs.push({align: "center"});
      else
        html_attrs.push({});
    });

    // now for the header, avoid escaped pipes
    m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
    for (i = 0; i < m[1].length; i++) {
      table[1][1].push(['th', html_attrs[i] || {}].concat(
        this.processInline(m[1][i].trim())));
    }

    // now for body contents
    forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
      var html_row = ['tr'];
      row = _split_on_unescaped(row, '|');
      for (i = 0; i < row.length; i++)
        html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
      table[2].push(html_row);
    }, this);

    return [table];
  };

  Maruku.inline[ "{:" ] = function inline_meta( text, matches, out ) {
    if ( !out.length )
      return [ 2, "{:" ];

    // get the preceeding element
    var before = out[ out.length - 1 ];

    if ( typeof before === "string" )
      return [ 2, "{:" ];

    // match a meta hash
    var m = text.match( /^\{:\s*((?:\\\}|[^\}])*)\s*\}/ );

    // no match, false alarm
    if ( !m )
      return [ 2, "{:" ];

    // attach the attributes to the preceeding element
    var meta = this.dialect.processMetaHash( m[ 1 ] ),
        attr = extract_attr( before );

    if ( !attr ) {
      attr = {};
      before.splice( 1, 0, attr );
    }

    for ( var k in meta )
      attr[ k ] = meta[ k ];

    // cut out the string and replace it with nothing
    return [ m[ 0 ].length, "" ];
  };

  Markdown.dialects.Maruku = Maruku;
  Markdown.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/;
  Markdown.buildBlockOrder ( Markdown.dialects.Maruku.block );
  Markdown.buildInlinePatterns( Markdown.dialects.Maruku.inline );

  var ExtendedGruber = DialectHelpers.subclassDialect( Gruber ),
      forEach = MarkdownHelpers.forEach;

  ExtendedGruber.block.hlcode = function code( block, next ) {
        var ret = [],
            re = /(```)(.*\n)(([\s\S\W\w\n\r]*?)\1)/,
            reStartBlock = /(```)(.*\n)(([\s\S\W\w\n\r]*?))/,
            reEndBlock = /(.*)(```$)/;

        if ( !block.match( reStartBlock ) )
          return undefined;

        var content = "";
        var type = "";
        if ( block.match( re ) ) {
          content = block.match( re )[4];
          type = block.match( re )[2];
          type = type ? (type.indexOf("highlight") >= 0 ? "nohighlight" : type.replace(/\n/g, '')) : "";
        } else {
          content = "";

          var seen = false;
          var b = block;
          while ( next.length && !seen) {
            seen = b.match(reEndBlock);
            if (!seen && b.indexOf("```") === 0) {
              type = b.split("\n")[0].replace("```","");
              type = type ? (type.indexOf("highlight") >= 0 ? "nohighlight" : type.replace(/\n/g, '')) : "";
              b = type.length ? b.replace(type, "") : b;
            }
            content += b.replace(/```/g,"") + (seen ? "" : "\n\n");
            b = seen ? "" : next.shift();
          }
        }

        return [ [ "code_block", { class: type }, content ] ];
      };

  ExtendedGruber.block.table = function table ( block ) {

    var _split_on_unescaped = function( s, ch ) {
      ch = ch || '\\s';
      if ( ch.match(/^[\\|\[\]{}?*.+^$]$/) )
        ch = '\\' + ch;
      var res = [ ],
          r = new RegExp('^((?:\\\\.|[^\\\\' + ch + '])*)' + ch + '(.*)'),
          m;
      while ( ( m = s.match( r ) ) ) {
        res.push( m[1] );
        s = m[2];
      }
      res.push(s);
      return res;
    };

    var leading_pipe = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,
        // find at least an unescaped pipe in each line
        no_leading_pipe = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,
        i,
        m;
    if ( ( m = block.match( leading_pipe ) ) ) {
      // remove leading pipes in contents
      // (header and horizontal rule already have the leading pipe left out)
      m[3] = m[3].replace(/^\s*\|/gm, '');
    } else if ( ! ( m = block.match( no_leading_pipe ) ) ) {
      return undefined;
    }

    var table = [ "table", [ "thead", [ "tr" ] ], [ "tbody" ] ];

    // remove trailing pipes, then split on pipes
    // (no escaped pipes are allowed in horizontal rule)
    m[2] = m[2].replace(/\|\s*$/, '').split('|');

    // process alignment
    var html_attrs = [ ];
    forEach (m[2], function (s) {
      if (s.match(/^\s*-+:\s*$/))
        html_attrs.push({align: "right"});
      else if (s.match(/^\s*:-+\s*$/))
        html_attrs.push({align: "left"});
      else if (s.match(/^\s*:-+:\s*$/))
        html_attrs.push({align: "center"});
      else
        html_attrs.push({});
    });

    // now for the header, avoid escaped pipes
    m[1] = _split_on_unescaped(m[1].replace(/\|\s*$/, ''), '|');
    for (i = 0; i < m[1].length; i++) {
      table[1][1].push(['th', html_attrs[i] || {}].concat(
        this.processInline(m[1][i].trim())));
    }

    // now for body contents
    forEach (m[3].replace(/\|\s*$/mg, '').split('\n'), function (row) {
      var html_row = ['tr'];
      row = _split_on_unescaped(row, '|');
      for (i = 0; i < row.length; i++)
        html_row.push(['td', html_attrs[i] || {}].concat(this.processInline(row[i].trim())));
      table[2].push(html_row);
    }, this);

    return [table];
  };

  Markdown.dialects.ExtendedGruber = ExtendedGruber;
  Markdown.buildBlockOrder ( Markdown.dialects.ExtendedGruber.block );

    // Implementation of http://www.thlib.org/reference/transliteration/#!essay=/thl/ewts/intro/
    // Rules http://www.thlib.org/reference/transliteration/#!essay=/thl/ewts/rules/
    //
    // TODO
    // - Rule 2: Better implementation
    // - Rule 4: support sanskrit characters
    // - Rules 8 onwards
    // - Check ~ is not affected
    var UChenMap = {};
    // Consonants
    UChenMap["k"] = "\u0F40";
    UChenMap["kh"] = "\u0F41";
    UChenMap["g"] = "\u0F42";
    UChenMap["ng"] = "\u0F44";
    UChenMap["c"] = "\u0F45";
    UChenMap["ch"] = "\u0F46";
    UChenMap["j"] = "\u0F47";
    UChenMap["ny"] = "\u0F49";
    UChenMap["t"] = "\u0F4F";
    UChenMap["th"] = "\u0F50";
    UChenMap["d"] = "\u0F51";
    UChenMap["n"] = "\u0F53";
    UChenMap["p"] = "\u0F54";
    UChenMap["ph"] = "\u0F55";
    UChenMap["b"] = "\u0F56";
    UChenMap["m"] = "\u0F58";
    UChenMap["ts"] = "\u0F59";
    UChenMap["tsh"] = "\u0F5A";
    UChenMap["dz"] = "\u0F5B";
    UChenMap["w"] = "\u0F5D";
    UChenMap["zh"] = "\u0F5E";
    UChenMap["z"] = "\u0F5F";
    UChenMap["'"] = "\u0F60";
    UChenMap["y"] = "\u0F61";
    UChenMap["r"] = "\u0F62";
    UChenMap["l"] = "\u0F63";
    UChenMap["sh"] = "\u0F64";
    UChenMap["s"] = "\u0F66";
    UChenMap["h"] = "\u0F67";
    UChenMap["a"] = "\u0F68";
    UChenMap["'"] = "\u0F68";

    UChenMap[".k"] = "\u0F40";
    UChenMap[".kh"] = "\u0F41";
    UChenMap[".g"] = "\u0F42";
    UChenMap[".ng"] = "\u0F44";
    UChenMap[".c"] = "\u0F45";
    UChenMap[".ch"] = "\u0F46";
    UChenMap[".j"] = "\u0F47";
    UChenMap[".ny"] = "\u0F49";
    UChenMap[".t"] = "\u0F4F";
    UChenMap[".th"] = "\u0F50";
    UChenMap[".d"] = "\u0F51";
    UChenMap[".n"] = "\u0F53";
    UChenMap[".p"] = "\u0F54";
    UChenMap[".ph"] = "\u0F55";
    UChenMap[".b"] = "\u0F56";
    UChenMap[".m"] = "\u0F58";
    UChenMap[".ts"] = "\u0F59";
    UChenMap[".tsh"] = "\u0F5A";
    UChenMap[".dz"] = "\u0F5B";
    UChenMap[".w"] = "\u0F5D";
    UChenMap[".zh"] = "\u0F5E";
    UChenMap[".z"] = "\u0F5F";
    UChenMap[".'"] = "\u0F60";
    UChenMap[".y"] = "\u0F61";
    UChenMap[".r"] = "\u0F62";
    UChenMap[".l"] = "\u0F63";
    UChenMap[".sh"] = "\u0F64";
    UChenMap[".s"] = "\u0F66";
    UChenMap[".h"] = "\u0F67";
    UChenMap[".a"] = "\u0F68";
    UChenMap[".'"] = "\u0F68";

    UChenMap["ka"] = "\u0F40";
    UChenMap["kha"] = "\u0F41";
    UChenMap["ga"] = "\u0F42";
    UChenMap["nga"] = "\u0F44";
    UChenMap["ca"] = "\u0F45";
    UChenMap["cha"] = "\u0F46";
    UChenMap["ja"] = "\u0F47";
    UChenMap["nya"] = "\u0F49";
    UChenMap["ta"] = "\u0F4F";
    UChenMap["tha"] = "\u0F50";
    UChenMap["da"] = "\u0F51";
    UChenMap["na"] = "\u0F53";
    UChenMap["pa"] = "\u0F54";
    UChenMap["pha"] = "\u0F55";
    UChenMap["ba"] = "\u0F56";
    UChenMap["ma"] = "\u0F58";
    UChenMap["tsa"] = "\u0F59";
    UChenMap["tsha"] = "\u0F5A";
    UChenMap["dza"] = "\u0F5B";
    UChenMap["wa"] = "\u0F5D";
    UChenMap["zha"] = "\u0F5E";
    UChenMap["za"] = "\u0F5F";
    UChenMap["ya"] = "\u0F61";
    UChenMap["ra"] = "\u0F62";
    UChenMap["la"] = "\u0F63";
    UChenMap["sha"] = "\u0F64";
    UChenMap["sa"] = "\u0F66";
    UChenMap["ha"] = "\u0F67";

    UChenMap[".ka"] = "\u0F40";
    UChenMap[".kha"] = "\u0F41";
    UChenMap[".ga"] = "\u0F42";
    UChenMap[".nga"] = "\u0F44";
    UChenMap[".ca"] = "\u0F45";
    UChenMap[".cha"] = "\u0F46";
    UChenMap[".ja"] = "\u0F47";
    UChenMap[".nya"] = "\u0F49";
    UChenMap[".ta"] = "\u0F4F";
    UChenMap[".tha"] = "\u0F50";
    UChenMap[".da"] = "\u0F51";
    UChenMap[".na"] = "\u0F53";
    UChenMap[".pa"] = "\u0F54";
    UChenMap[".pha"] = "\u0F55";
    UChenMap[".ba"] = "\u0F56";
    UChenMap[".ma"] = "\u0F58";
    UChenMap[".tsa"] = "\u0F59";
    UChenMap[".tsha"] = "\u0F5A";
    UChenMap[".dza"] = "\u0F5B";
    UChenMap[".wa"] = "\u0F5D";
    UChenMap[".zha"] = "\u0F5E";
    UChenMap[".za"] = "\u0F5F";
    UChenMap[".ya"] = "\u0F61";
    UChenMap[".ra"] = "\u0F62";
    UChenMap[".la"] = "\u0F63";
    UChenMap[".sha"] = "\u0F64";
    UChenMap[".sa"] = "\u0F66";
    UChenMap[".ha"] = "\u0F67";

    // Sanskrit & Subjoined Sanskrit
    UChenMap["gh"] = "\u0F43";
    UChenMap["g+h"] = "\u0F43";
    UChenMap["dh"] = "\u0F52";
    UChenMap["d+h"] = "\u0F52";
    UChenMap["bh"] = "\u0F57";
    UChenMap["b+h"] = "\u0F57";
    UChenMap["dzh"] = "\u0F5C";
    UChenMap["dz+h"] = "\u0F5C";
    UChenMap["kSh"] = "\u0F69";
    UChenMap["k+Sh"] = "\u0F69";
    UChenMap["T"] = "\u0F4A";
    UChenMap["Th"] = "\u0F4B";
    UChenMap["D"] = "\u0F4C";
    UChenMap["Dh"] = "\u0F4D";
    UChenMap["D+h"] = "\u0F4D";
    UChenMap["N"] = "\u0F4E";
    UChenMap["Sh"] = "\u0F65";
    UChenMap["oM"] = "\u0F00";
    UChenMap["+W"] = "\u0FBA";
    UChenMap["+Y"] = "\u0FBB";
    UChenMap["+R"] = "\u0FBC";
    UChenMap["H"] = "\u0F7F";
    UChenMap["M"] = "\u0F7E";
    UChenMap["~M"] = "\u0F83";
    UChenMap["~M'"] = "\u0F82";
    UChenMap["~?"] = "\u0F84";
    UChenMap["&"] = "\u0F85";

    //UChenMap[""] = "\u";

    // Subjoined Consonants
    UChenMap["+k"] = "\u0F90";
    UChenMap["+kh"] = "\u0F91";
    UChenMap["+g"] = "\u0F92";
    UChenMap["+gh"] = "\u0F93";
    UChenMap["+ng"] = "\u0F94";
    UChenMap["+c"] = "\u0F95";
    UChenMap["+ch"] = "\u0F96";
    UChenMap["+j"] = "\u0F97";
    UChenMap["+ny"] = "\u0F99";
    UChenMap["+th"] = "\u0FA0";
    UChenMap["+n"] = "\u0F9E";
    UChenMap["+t"] = "\u0F9F";
    UChenMap["+d"] = "\u0FA1";
    UChenMap["+dh"] = "\u0FA2";
    UChenMap["+n"] = "\u0FA3";
    UChenMap["+p"] = "\u0FA4";
    UChenMap["+ph"] = "\u0FA5";
    UChenMap["+b"] = "\u0FA6";
    UChenMap["+bh"] = "\u0FA7";
    UChenMap["+m"] = "\u0FA8";
    UChenMap["+ts"] = "\u0FA9";
    UChenMap["+tsh"] = "\u0FAA";
    UChenMap["+dz"] = "\u0FAB";
    UChenMap["+dzh"] = "\u0FAC";
    UChenMap["+w"] = "\u0FAD";
    UChenMap["+zh"] = "\u0FAE";
    UChenMap["+z"] = "\u0FAF";
    UChenMap["+a"] = "\u0FB0";
    UChenMap["+'"] = "\u0FB0";
    UChenMap["+y"] = "\u0FB1";
    UChenMap["+r"] = "\u0FB2";
    UChenMap["+l"] = "\u0FB3";
    UChenMap["+sh"] = "\u0FB4";
    UChenMap["+s"] = "\u0FB6";
    UChenMap["+h"] = "\u0FB7";
    UChenMap["+A"] = "\u0FB8";
    UChenMap["+ksh"] = "\u0FB9";
    UChenMap["+.w"] = "\u0FBA";
    UChenMap["+.y"] = "\u0FBB";
    UChenMap["+.r"] = "\u0FBC";

    UChenMap["+ka"] = "\u0F90";
    UChenMap["+kha"] = "\u0F91";
    UChenMap["+ga"] = "\u0F92";
    UChenMap["+gha"] = "\u0F93";
    UChenMap["+nga"] = "\u0F94";
    UChenMap["+ca"] = "\u0F95";
    UChenMap["+cha"] = "\u0F96";
    UChenMap["+ja"] = "\u0F97";
    UChenMap["+nya"] = "\u0F99";
    UChenMap["+tha"] = "\u0FA0";
    UChenMap["+na"] = "\u0F9E";
    UChenMap["+ta"] = "\u0F9F";
    UChenMap["+da"] = "\u0FA1";
    UChenMap["+dha"] = "\u0FA2";
    UChenMap["+na"] = "\u0FA3";
    UChenMap["+pa"] = "\u0FA4";
    UChenMap["+pha"] = "\u0FA5";
    UChenMap["+ba"] = "\u0FA6";
    UChenMap["+bha"] = "\u0FA7";
    UChenMap["+ma"] = "\u0FA8";
    UChenMap["+tsa"] = "\u0FA9";
    UChenMap["+tsha"] = "\u0FAA";
    UChenMap["+dza"] = "\u0FAB";
    UChenMap["+dzha"] = "\u0FAC";
    UChenMap["+wa"] = "\u0FAD";
    UChenMap["+zha"] = "\u0FAE";
    UChenMap["+za"] = "\u0FAF";
    UChenMap["+ya"] = "\u0FB1";
    UChenMap["+ra"] = "\u0FB2";
    UChenMap["+la"] = "\u0FB3";
    UChenMap["+sha"] = "\u0FB4";
    UChenMap["+sa"] = "\u0FB6";
    UChenMap["+ha"] = "\u0FB7";
    UChenMap["+A"] = "\u0FB8";
    UChenMap["+.wa"] = "\u0FBA";
    UChenMap["+.ya"] = "\u0FBB";
    UChenMap["+.ra"] = "\u0FBC";
    //UChenMap["+"] = "\u";

    // Vowels
    UChenMap["i"] = "\u0F72";
    UChenMap["u"] = "\u0F74";
    UChenMap["e"] = "\u0F7A";
    UChenMap["o"] = "\u0F7C";
    UChenMap["A"] = "\u0F71";
    UChenMap["I"] = "\u0F73";
    UChenMap["U"] = "\u0F75";
    UChenMap["r-i"] = "\u0F76";
    UChenMap["l-i"] = "\u0F78";
    UChenMap["-i"] = "\u0F80";
    UChenMap["ai"] = "\u0F7B";
    UChenMap["au"] = "\u0F7D";
    UChenMap["r-I"] = "\u0F77";
    UChenMap["l-I"] = "\u0F79";
    UChenMap["-I"] = "\u0F81";

    // Numbers
    UChenMap["0"] = "\u0F20";
    UChenMap["1"] = "\u0F21";
    UChenMap["2"] = "\u0F22";
    UChenMap["3"] = "\u0F23";
    UChenMap["4"] = "\u0F24";
    UChenMap["5"] = "\u0F25";
    UChenMap["6"] = "\u0F26";
    UChenMap["7"] = "\u0F27";
    UChenMap["8"] = "\u0F28";
    UChenMap["9"] = "\u0F29";

    //Punctuation
    UChenMap["_"] = " ";
    UChenMap[" "] = "\u0F0B";
    UChenMap["*"] = "\u0F0C";
    UChenMap["/"] = "\u0F0D";
    UChenMap["//"] = "\u0F0E";
    UChenMap[";"] = "\u0F0F";
    UChenMap["|"] = "\u0F11";
    UChenMap["!"] = "\u0F08";
    UChenMap[":"] = "\u0F14";
    UChenMap["£"] = "\u0F10";
    UChenMap["¬"] = "\u0F12";
    UChenMap["="] = "\u0F34";
    UChenMap["x"] = "\u0FBE";
    UChenMap["x."] = "\u0FBF";
    UChenMap["...."] = "\u0F36";
    UChenMap["o...."] = "\u0F13";
    UChenMap["H1"] = "\u0F01";
    UChenMap["H2"] = "\u0F02";
    UChenMap["H3"] = "\u0F03";
    UChenMap["@"] = "\u0F04";
    UChenMap["#"] = "\u0F05";
    UChenMap["$"] = "\u0F06";
    UChenMap["%"] = "\u0F07";
    UChenMap["H4"] = "\u0F09";
    UChenMap["H5"] = "\u0F0A";
    UChenMap["H6"] = "\u0FD0";
    UChenMap["H7"] = "\u0FD1";
    UChenMap["<"] = "\u0F3A";
    UChenMap[">"] = "\u0F3B";
    UChenMap["("] = "\u0F3C";
    UChenMap[")"] = "\u0F3D";

    // Ligatures & Special Character or Character COmbinations
    UChenMap.Ligatures = {};
    UChenMap.Ligatures["rk"] = "r+k";
    UChenMap.Ligatures["rg"] = "r+g";
    UChenMap.Ligatures["rng"] = "r+ng";
    UChenMap.Ligatures["rj"] = "r+j";
    UChenMap.Ligatures["rny"] = "r+ny";
    UChenMap.Ligatures["rt" ] = "r+t";
    UChenMap.Ligatures["rd"] = "r+d";
    UChenMap.Ligatures["rn"] = "r+n";
    UChenMap.Ligatures["rb" ] = "r+b";
    UChenMap.Ligatures["rm" ] = "r+m";
    UChenMap.Ligatures["rts"] = "r+ts";
    UChenMap.Ligatures["rdz"] = "r+dz";
    UChenMap.Ligatures["lk"] = "l+k";
    UChenMap.Ligatures["lg"] = "l+g";
    UChenMap.Ligatures["lng"] = "l+ng";
    UChenMap.Ligatures["lc"] = "l+c";
    UChenMap.Ligatures["lj"] = "l+j";
    UChenMap.Ligatures["lt"] = "l+t";
    UChenMap.Ligatures["ld"] = "l+d";
    UChenMap.Ligatures["lp"] = "l+p";
    UChenMap.Ligatures["lb"] = "l+b";
    UChenMap.Ligatures["lh"] = "l+h";
    UChenMap.Ligatures["sk"] = "s+k";
    UChenMap.Ligatures["sg"] = "s+g";
    UChenMap.Ligatures["sng"] = "s+ng";
    UChenMap.Ligatures["sny"] = "s+ny";
    UChenMap.Ligatures["st"] = "s+t";
    UChenMap.Ligatures["sd"] = "s+d";
    UChenMap.Ligatures["sn"] = "s+n";
    UChenMap.Ligatures["sp"] = "s+p";
    UChenMap.Ligatures["sb"] = "s+b";
    UChenMap.Ligatures["sm"] = "s+m";
    UChenMap.Ligatures["sts"] = "s+ts";
    UChenMap.Ligatures["kw"] = "k+w";
    UChenMap.Ligatures["khw"] = "kh+w";
    UChenMap.Ligatures["gw"] = "g+w";
    UChenMap.Ligatures["cw"] = "c+w";
    UChenMap.Ligatures["nyw"] = "ny+w";
    UChenMap.Ligatures["tw"] = "t+w";
    UChenMap.Ligatures["dw"] = "d+w";
    UChenMap.Ligatures["tsw"] = "ts+w";
    UChenMap.Ligatures["tshw"] = "tsh+w";
    UChenMap.Ligatures["zhw"] = "zh+w";
    UChenMap.Ligatures["zw"] = "z+w";
    UChenMap.Ligatures["rw"] = "r+w";
    UChenMap.Ligatures["shw"] = "sh+w";
    UChenMap.Ligatures["sw"] = "s+w";
    UChenMap.Ligatures["hw"] = "h+w";
    UChenMap.Ligatures["ky"] = "k+y";
    UChenMap.Ligatures["khy"] = "kh+y";
    UChenMap.Ligatures["gy"] = "g+y";
    UChenMap.Ligatures["py"] = "p+y";
    UChenMap.Ligatures["phy"] = "ph+y";
    UChenMap.Ligatures["by"] = "b+y";
    UChenMap.Ligatures["my"] = "m+y";
    UChenMap.Ligatures["kr"] = "k+r";
    UChenMap.Ligatures["khr"] = "kh+r";
    UChenMap.Ligatures["gr"] = "g+r";
    UChenMap.Ligatures["tr"] = "t+r";
    UChenMap.Ligatures["thr"] = "th+r";
    UChenMap.Ligatures["dr"] = "d+r";
    UChenMap.Ligatures["pr"] = "p+r";
    UChenMap.Ligatures["phr"] = "ph+r";
    UChenMap.Ligatures["br"] = "b+r";
    UChenMap.Ligatures["mr"] = "m+r";
    UChenMap.Ligatures["shr"] = "sh+r";
    UChenMap.Ligatures["sr"] = "s+r";
    UChenMap.Ligatures["hr"] = "h+r";
    UChenMap.Ligatures["kl"] = "k+l";
    UChenMap.Ligatures["gl"] = "g+l";
    UChenMap.Ligatures["bl"] = "b+l";
    UChenMap.Ligatures["zl"] = "z+l";
    UChenMap.Ligatures["rl"] = "r+l";
    UChenMap.Ligatures["sl"] = "s+l";
    UChenMap.Ligatures["rky"] = "r+k+y";
    UChenMap.Ligatures["rgy"] = "r+g+y";
    UChenMap.Ligatures["rmy"] = "r+m+y";
    UChenMap.Ligatures["rgw"] = "r+g+w";
    UChenMap.Ligatures["rtsw"] = "r+ts+w";
    UChenMap.Ligatures["sky"] = "s+k+y";
    UChenMap.Ligatures["sgy"] = "s+g+y";
    UChenMap.Ligatures["spy"] = "s+p+y";
    UChenMap.Ligatures["sby"] = "s+b+y";
    UChenMap.Ligatures["smy"] = "s+m+y";
    UChenMap.Ligatures["skr"] = "s+k+r";
    UChenMap.Ligatures["sgr"] = "s+g+r";
    UChenMap.Ligatures["snr"] = "s+n+r";
    UChenMap.Ligatures["spr"] = "s+p+r";
    UChenMap.Ligatures["sbr"] = "s+b+r";
    UChenMap.Ligatures["smr"] = "s+m+r";
    UChenMap.Ligatures["grw"] = "g+r+w";
    UChenMap.Ligatures["drw"] = "d+r+w";
    UChenMap.Ligatures["phyw"] = "ph+y+w";
    UChenMap.Ligatures["~om"] = "\u0F00";
    UChenMap.Ligatures["~athung"] = "\u0F01";
    UChenMap.Ligatures["~namcheyma"] = "\u0F02";
    UChenMap.Ligatures["~tertsekma"] = "\u0F03";
    UChenMap.Ligatures["~dunma"] = "\u0F04";
    UChenMap.Ligatures["~kabma"] = "\u0F05";
    UChenMap.Ligatures["~pursheyma"] = "\u0F06";
    UChenMap.Ligatures["~tseksheyma"] = "\u0F07";
    UChenMap.Ligatures["~drulshey"] = "\u0F08";
    UChenMap.Ligatures["~kuryikgo"] = "\u0F09";
    UChenMap.Ligatures["~kashoyikgo"] = "\u0F0A";
    UChenMap.Ligatures["~tsek"] = "\u0F0B";
    UChenMap.Ligatures["~tsektar"] = "\u0F0C";
    UChenMap.Ligatures["~shey"] = "\u0F0D";
    UChenMap.Ligatures["~nyishey"] = "\u0F0E";
    UChenMap.Ligatures["~tsekshey"] = "\u0F0F";
    UChenMap.Ligatures["~nyitsekshey"] = "\u0F10";
    UChenMap.Ligatures["~rinchenpungshey"] = "\u0F11";
    UChenMap.Ligatures["~gyatramshey"] = "\u0F12";
    UChenMap.Ligatures["~dzutamelongchen"] = "\u0F13";
    UChenMap.Ligatures["~tertsek"] = "\u0F14";
    UChenMap.Ligatures["~cheta"] = "\u0F15";
    UChenMap.Ligatures["~lakta"] = "\u0F16";
    UChenMap.Ligatures["~trachencharta"] = "\u0F17";
    UChenMap.Ligatures["~kyupa"] = "\u0F18";
    UChenMap.Ligatures["~dongtsu"] = "\u0F19";
    UChenMap.Ligatures["~dekachig"] = "\u0F1A";
    UChenMap.Ligatures["~dekanyi"] = "\u0F1B";
    UChenMap.Ligatures["~dekasum"] = "\u0F1C";
    UChenMap.Ligatures["~denachig"] = "\u0F1D";
    UChenMap.Ligatures["~denanyi"] = "\u0F1E";
    UChenMap.Ligatures["~dekadena"] = "\u0F1F";
    UChenMap.Ligatures["~duta"] = "\u0F34";
    UChenMap.Ligatures["~ngezungnyida"] = "\u0F35";
    UChenMap.Ligatures["~dzutashimigchen"] = "\u0F36";
    UChenMap.Ligatures["~ngezunggorta"] = "\u0F37";
    UChenMap.Ligatures["~chego"] = "\u0F38";
    UChenMap.Ligatures["~tsatru"] = "\u0F39";
    UChenMap.Ligatures["~gugtayun"] = "\u0F3A";
    UChenMap.Ligatures["~gugtaye"] = "\u0F3B";
    UChenMap.Ligatures["~angkangyun"] = "\u0F3C";
    UChenMap.Ligatures["~angkangye"] = "\u0F3D";
    UChenMap.Ligatures["~yartse"] = "\u0F3E";
    UChenMap.Ligatures["~martse"] = "\u0F3F";
    UChenMap.Ligatures["~kuruka"] = "\u0FBE";
    UChenMap.Ligatures["~kurukashimikchen"] = "\u0FBF";
    UChenMap.Ligatures["~HEAVY"] = "\u0FC0";
    UChenMap.Ligatures["~LIGHT"] = "\u0FC1";
    UChenMap.Ligatures["~CANGTE"] = "\u0FC2";
    UChenMap.Ligatures["~SBUB"] = "\u0FC3";
    UChenMap.Ligatures["~drilbu"] = "\u0FC4";
    UChenMap.Ligatures["~dorje"] = "\u0FC5";
    UChenMap.Ligatures["~pemaden"] = "\u0FC6";
    UChenMap.Ligatures["~dorjegyadram"] = "\u0FC7";
    UChenMap.Ligatures["~phurba"] = "\u0FC8";
    UChenMap.Ligatures["~norbu"] = "\u0FC9";
    UChenMap.Ligatures["~norbunyikhyi"] = "\u0FCA";
    UChenMap.Ligatures["~norbusumkhyi"] = "\u0FCB";
    UChenMap.Ligatures["~norbushikhyi"] = "\u0FCC";
    UChenMap.Ligatures["~denasum"] = "\u0FCF";

    UChenMap.toUnicode = function(text) {
        function escapeRegEx(str) {
          return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        }
        function compareLength(a,b) {
            if (a.length > b.length) return -1;
            if (a.length < b.length) return 1;
            return 0;
          }

        function sortProperties(object) {
          var arr = [];
          for (var property in object) {
            if (object.hasOwnProperty(property) && typeof(object[property]) === "string") {
              arr.push(property);
            }
          }
          arr.sort(compareLength);
          return arr;
        }

        var sortedLigatures = sortProperties(UChenMap.Ligatures);
        var sortedMap = sortProperties(UChenMap);

        function apply(string, substitutions, map) {
          var result = string;
          for (var i = 0; i < substitutions.length; i++) {
            var regEx = escapeRegEx(substitutions[i]);
            result = result.replace(new RegExp(regEx, 'g'), map[substitutions[i]]);
          }
          return result;
        }

        function parseSyllable (syllable) {
          var result = "";
          result = apply(apply(syllable, sortedLigatures, UChenMap.Ligatures), sortedMap, UChenMap);
          return result;
        }

        return (function(text) {
            var result = "";

            var syllables = text.split(" ");
            for (var i = 0; i < syllables.length; i++) {
              result += parseSyllable(syllables[i]) + (i === syllables.length -1 ? "" : UChenMap[" "]);
            }

            return result;
          }(text));
      };

  var inline_until_char = DialectHelpers.inline_until_char;
  var mk_block = MarkdownHelpers.mk_block;
  var forEach = MarkdownHelpers.forEach;
  var uChenMap = UChenMap;

  var Wylie = {
    block: {
      wylie: function wylie(block, next) {
        var ret = [],
            re = /^(:::\n*)([\s\S\W\w\n\r]*?)(\1)/,
            reStartBlock = /^:::\n*/,
            reEndBlock = /([\s\S\W\w\n\r]*?)(\n*:::)(.*)/;

        if ( !block.match( reStartBlock ) )
          return undefined;

        var wylie = "";
        var groups = block.match( re );
        if ( groups ) {
          wylie = groups[2];
        } else {
          var seen = false;
          var b = block.replace(":::", "");
          while ( next.length && !seen) {
            seen = b.match(reEndBlock);
            wylie += seen ? seen[1] : b;
            b = seen ? "" : next.shift();
          }
        }

        return wylie.length > 0 ? [ [ "uchen_block", { "class": "uchen", "wylie": wylie }, uChenMap.toUnicode(wylie) ] ] : [];
      },
      para: function para( block ) {
        // everything's a para!
        return [ ["para"].concat( this.processInline( block ) ) ];
      }
    },
    inline: {
      __oneElement__: function oneElement( text, patterns_or_re, previous_nodes ) {
        var m,
            res;

        patterns_or_re = patterns_or_re || this.dialect.inline.__patterns__;
        var re = new RegExp( "([\\s\\S]*?)(" + (patterns_or_re.source || patterns_or_re) + ")" );

        m = re.exec( text );
        if (!m) {
          // Just boring text
          return [ text.length, text ];
        }
        else if ( m[1] ) {
          // Some un-interesting text matched. Return that first
          return [ m[1].length, m[1] ];
        }

        var res;
        if ( m[2] in this.dialect.inline ) {
          res = this.dialect.inline[ m[2] ].call(
                    this,
                    text.substr( m.index ), m, previous_nodes || [] );
        }
        // Default for now to make dev easier. just slurp special and output it.
        res = res || [ m[2].length, m[2] ];
        return res;
      },

      __call__: function inline( text, patterns ) {

        var out = [],
            res;

        function add(x) {
          //D:self.debug("  adding output", uneval(x));
          if ( typeof x === "string" && typeof out[out.length-1] === "string" )
            out[ out.length-1 ] += x;
          else
            out.push(x);
        }

        while ( text.length > 0 ) {
          res = this.dialect.inline.__oneElement__.call(this, text, patterns, out );
          text = text.substr( res.shift() );
          forEach(res, add );
        }

        return out;
      },
      __escape__ : /^\\[\\`\*_{}<>\[\]()#\+.!\-]/,

      "\\": function escaped( text ) {
        // [ length of input processed, node/children to add... ]
        // Only esacape: \ ` * _ { } [ ] ( ) # * + - . !
        if ( this.dialect.inline.__escape__.exec( text ) )
          return [ 2, text.charAt( 1 ) ];
        else
          // Not an esacpe
          return [ 1, "\\" ];
      },
      "  \n": function lineBreak() {
        return [ 3, [ "linebreak" ] ];
      }
    }
  };

  Wylie.inline[ "::" ] = function inlineWylie( text ) {
        // Inline wylie block.
        var m = text.match( /(::)((\s|\S|\W|\w)*?)(\1)/ );

        if ( m && m[2] ) {
          var txt = uChenMap.toUnicode(m[2]);
          return [ (m[1].length*2) + m[2].length, [ "uchen", { "class": "uchen", "wylie": m[2]}, txt ] ];
        }
        else {
          // TODO: No matching end code found - warn!
          return [ 2, "::" ];
        }
      };

  Markdown.dialects.Wylie = Wylie;
  Markdown.buildBlockOrder ( Markdown.dialects.Wylie.block );
  Markdown.buildInlinePatterns( Markdown.dialects.Wylie.inline );

  var ExtendedWylie = DialectHelpers.subclassDialect( ExtendedGruber );
  var inline_until_char = DialectHelpers.inline_until_char;
  var mk_block = MarkdownHelpers.mk_block;
  var uChenMap = UChenMap;

  ExtendedWylie.inline[ "::" ] = function inlineWylie( text ) {
        // Inline wylie block.
        var m = text.match( /(::)((\s|\S|\W|\w)*?)(\1)/ );

        if ( m && m[2] ) {
          var txt = uChenMap.toUnicode(m[2]);
          return [ (m[1].length*2) + m[2].length, [ "uchen", { "class": "uchen", "wylie": m[2]}, txt ] ];
        }
        else {
          // TODO: No matching end code found - warn!
          return [ 2, "::" ];
        }
      };

  ExtendedWylie.block.wylie = function(block, next) {
        var ret = [],
            re = /^(:::\n*)([\s\S\W\w\n\r]*?)(\1)/,
            reStartBlock = /^:::\n*/,
            reEndBlock = /([\s\S\W\w\n\r]*?)(\n*:::)(.*)/;

        if ( !block.match( reStartBlock ) )
          return undefined;

        var wylie = "";
        var groups = block.match( re );
        if ( groups ) {
          wylie = groups[2];
        } else {
          var seen = false;
          var b = block.replace(":::", "");
          while ( next.length && !seen) {
            seen = b.match(reEndBlock);
            wylie += seen ? seen[1] : b;
            b = seen ? "" : next.shift();
          }
        }

        return wylie.length > 0 ? [ [ "uchen_block", { "class": "uchen", "wylie": wylie }, uChenMap.toUnicode(wylie) ] ] : [];
      };

  Markdown.dialects.ExtendedWylie = ExtendedWylie;
  Markdown.buildBlockOrder ( Markdown.dialects.ExtendedWylie.block );
  Markdown.buildInlinePatterns( Markdown.dialects.ExtendedWylie.inline );

// Include all our dependencies and return the resulting library.

  expose.Markdown = Markdown;
  expose.parse = Markdown.parse;
  expose.toHTML = Markdown.toHTML;
  expose.toHTMLTree = Markdown.toHTMLTree;
  expose.renderJsonML = Markdown.renderJsonML;
  expose.DialectHelpers = DialectHelpers;

})(function() {
  window.markdown = {};
  return window.markdown;
}());
