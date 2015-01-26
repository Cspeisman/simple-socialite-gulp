
/*
Simple-Socialite
----------------

A silently failing, HTML tag-based abstraction API for socialite.js

Usage:
<div class="share-buttons" data-socialite="auto" data-services="twitter, facebook"></div>
 */

/*
Global object for classes
 */
var check, tries,
  __slice = [].slice;

if (window.SimpleSocialite == null) {
  window.SimpleSocialite = {};
}


/*
check() ensures all dependencies are loaded
before defining any classes that reference them.
 */

tries = 0;

check = (function(_this) {
  return function() {
    var $, DEBUG, OptionMapper, ShareBar, ShareButton, debug, htmlEscaper, htmlEscapes, _base;
    if (typeof jQuery === "undefined" || jQuery === null) {
      if (tries < 6000) {
        tries++;
        return setTimeout(check, 10);
      } else {
        return (typeof console !== "undefined" && console !== null) && console.log('Gave up trying to render your social buttons. Make sure jQuery is getting on the page at some point.');
      }
    } else {
      $ = jQuery;
      DEBUG = ("false".toLowerCase() === "true") || false;
      debug = function() {
        var msgs;
        msgs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return DEBUG && (typeof console !== "undefined" && console !== null) && console.log.apply(console, msgs);
      };

      /*
      Tiny plugin to return a nested object of all data-foo options on an element
       */
      $.fn.getDataOptions = function() {
        var el, opts;
        opts = {};
        el = $(this)[0];
        $.each(el.attributes, (function(_this) {
          return function(i, att) {
            var key, qs;
            if (!att.nodeName.match(/^data-/)) {
              return true;
            }
            qs = att.nodeValue;
            key = att.nodeName.replace(/^data-/, '');
            if (key.match(/options$/)) {
              return opts[key] = $.optionsFromQueryString(qs);
            } else {
              return opts[key] = qs;
            }
          };
        })(this));
        return opts;
      };
      $.optionsFromQueryString = function(qs) {
        var opts, parts;
        opts = {};
        parts = qs.split(/(?:&(?:amp;)?|=)/);
        $.each(parts, (function(_this) {
          return function(i, part) {
            if (i % 2) {
              return opts[parts[i - 1]] = decodeURIComponent(part);
            }
          };
        })(this));
        debug(opts);
        return opts;
      };
      htmlEscapes = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      htmlEscaper = /[&<>"'\/]/g;
      $.safeString = function(s) {
        return ('' + s).replace(htmlEscaper, function(match) {
          return htmlEscapes[match];
        });
      };

      /*
      Individual share button class
      Takes a string @provider and object @options
       */
      ShareButton = (function() {
        if (ShareButton._customNames == null) {
          ShareButton._customNames = {
            "twitter-share": "Twitter",
            "facebook-like": "Facebook",
            "pinterest-pinit": "Pinterest",
            "googleplus-one": "Google Plus"
          };
        }

        ShareButton.customNames = function() {
          return this._customNames;
        };

        ShareButton.registerCustomName = function(name, displayName) {
          if (this.customNames()[name] != null) {
            throw "Custom name " + name + " is already registered.";
          }
          return this._customNames[name] = displayName;
        };

        function ShareButton(provider, options) {
          this.provider = provider;
          this.options = options;
        }

        ShareButton.prototype.to_html_params = function() {
          var opts;
          opts = '';
          this.options = new OptionMapper(this.provider, this.options).translate();
          $.each(this.options, (function(_this) {
            return function(key, val) {
              var escaped_val;
              escaped_val = $.safeString(val);
              return opts += "data-" + key + "=\"" + escaped_val + "\" ";
            };
          })(this));
          return opts.replace(/\ $/, '');
        };

        ShareButton.prototype.provider_display = function() {
          return this.constructor.customNames()[this.provider] || ((function(_this) {
            return function() {
              var name, parts;
              name = _this.provider.replace(/-simple$/, '');
              parts = name.split(' ');
              $.each(parts, function(i, part) {
                return parts[i] = part.charAt(0).toUpperCase() + part.slice(1);
              });
              return parts.join(' ');
            };
          })(this))();
        };

        ShareButton.prototype.render = function() {
          return "<a href='' class='socialite " + this.provider + "' " + (this.to_html_params()) + ">Share on " + (this.provider_display()) + "</a>";
        };

        return ShareButton;

      })();
      window.SimpleSocialite.ShareButton = ShareButton;

      /*
      Share bar class
      Takes a DOM or jQuery element @wrapper, such as:
      new ShareBar $('<div class="share-buttons" data-socialite="auto" data-services="facebook,twitter"></div>')
       */
      ShareBar = (function() {
        ShareBar._container = $("<table style='vertical-align:middle;'><tbody></tbody></table>");

        ShareBar._defaults = {
          layout: 'horizontal',
          shortURLs: 'never',
          showTooltips: false
        };

        ShareBar._services = {
          "twitter-simple": {},
          "twitter-share": {},
          "twitter-follow": {},
          "twitter-mention": {},
          "twitter-hashtag": {},
          "twitter-embed": {},
          "facebook-like": {},
          "facebook-simple": {},
          "googleplus-simple": {},
          "googleplus-one": {},
          "linkedin-share": {},
          "linkedin-simple": {},
          "linkedin-recommend": {},
          "pinterest-pinit": {},
          "spotify-play": {},
          "hackernews-share": {},
          "github-watch": {},
          "github-fork": {},
          "github-follow": {},
          "tumblr-simple": {},
          "email-simple": {}
        };

        ShareBar._serviceMappings = {
          "twitter": "twitter-simple",
          "twitter-tweet": "twitter-share",
          "facebook": "facebook-simple",
          "googleplus": "googleplus-simple",
          "google-plusone": "googleplus-one",
          "linkedin": "linkedin-simple",
          "pinterest": "pinterest-pinit",
          "tumblr": "tumblr-simple",
          "email": "email-simple"
        };

        ShareBar.container = function() {
          return this._container.clone();
        };

        ShareBar.setContainer = function(str) {
          return this._container = $(str);
        };

        ShareBar.defaults = function() {
          return this._defaults;
        };

        ShareBar.setDefault = function(key, val) {
          if (this._defaults == null) {
            this._defaults = this.defaults();
          }
          this._defaults[key] = val;
          return this._defaults;
        };

        ShareBar.services = function() {
          return this._services;
        };

        ShareBar.serviceMappings = function() {
          return this._serviceMappings;
        };

        ShareBar.registerButton = function(opts) {
          var defaults, displayName, name, nickname;
          name = opts.name;
          nickname = opts.nickname;
          defaults = opts.defaults || {};
          if (opts.displayName != null) {
            displayName = opts.displayName;
          }
          if (opts.name == null) {
            throw 'You must provide a name to register.';
          }
          if ((this.services()[name] != null) || (this.serviceMappings()[nickname] != null)) {
            throw "Name " + name + " is already registered.";
          }
          if (this.serviceMappings()[nickname] != null) {
            throw "Nickname " + nickname + " is already registered.";
          }
          this._services[name] = defaults;
          this._serviceMappings[nickname] = name;
          if (displayName != null) {
            return ShareButton.registerCustomName(name, displayName);
          }
        };

        function ShareBar(wrapper) {
          this.wrapper = wrapper;
          this.wrapper = $(this.wrapper);
          this.options = $.extend({}, this.constructor.defaults(), $(this.wrapper).getDataOptions());
          this.buttons = [];
          $.each(this.options.services.split(/, ?/), (function(_this) {
            return function(i, service) {
              var resolvedService;
              resolvedService = _this.constructor.serviceMappings()[service] || service;
              return _this.buttons.push(new ShareButton(resolvedService, $.extend({}, _this.constructor.services()[resolvedService], _this.options.options, _this.options["" + resolvedService + "-options"], _this.options["" + service + "-options"])));
            };
          })(this));
        }

        ShareBar.prototype.render = function() {
          var cursor;
          this.rendered = this.constructor.container();
          cursor = this.rendered.find('tbody');
          if (this.options.layout === 'horizontal') {
            cursor = cursor.append('<tr></tr>').find('tr');
          }
          $.each(this.buttons, (function(_this) {
            return function(i, button) {
              var btn;
              btn = $("<td>" + (button.render()) + "</td>");
              if (_this.options.layout === 'vertical') {
                btn = btn.wrap('<tr></tr>').parents('tr');
              }
              return cursor.append(btn);
            };
          })(this));
          this.wrapper.empty().append(this.rendered);
          debug("loading contents of " + this.wrapper);
          return Socialite.load(this.wrapper[0]);
        };

        return ShareBar;

      })();
      if ((_base = window.SimpleSocialite).ShareBar == null) {
        _base.ShareBar = ShareBar;
      }

      /*
      Option mapper class
      Normalizes a set of options to a given service's specific params
       */
      OptionMapper = (function() {
        function OptionMapper(provider, options) {
          this.provider = provider;
          this.options = options;
          this.translations = {
            "twitter-share": (function(_this) {
              return function() {
                if (!_this.options['size']) {
                  (_this.options['size'] = _this.options['width']) && delete _this.options['width'];
                }
                if (!_this.options['text']) {
                  (_this.options['text'] = _this.options['defaultText']) && delete _this.options['defaultText'];
                }
                if (!_this.options['text']) {
                  (_this.options['text'] = _this.options['title']) && delete _this.options['title'];
                }
                if (_this.options['lang']) {
                  _this.options['lang'] = _this.options['lang'].replace(/-.+$/, '');
                }
                return _this.options;
              };
            })(this),
            "twitter-simple": (function(_this) {
              return function() {
                return _this.translations["twitter-share"]();
              };
            })(this),
            "facebook-like": (function(_this) {
              return function() {
                if (!_this.options['href']) {
                  (_this.options['href'] = _this.options['url']) && delete _this.options['url'];
                }
                if (!_this.options['layout']) {
                  if (_this.options['showCounts'] === 'right') {
                    _this.options['layout'] = 'button_count';
                  }
                }
                if (_this.options['lang']) {
                  _this.options['lang'] = _this.options['lang'].replace('-', '_');
                }
                return _this.options;
              };
            })(this),
            "googleplus-one": (function(_this) {
              return function() {
                var _ref;
                if (!_this.options['showCounts'] && !_this.options['annotation']) {
                  _this.options['annotation'] = 'none';
                }
                if (_this.options['showCounts'] && !_this.options['annotation']) {
                  if ((_ref = _this.options['showCounts']) === 'right' || _ref === 'top') {
                    delete _this.options['annotation'];
                    if (_this.options['showCounts'] === 'top') {
                      _this.options['size'] = 'tall';
                    }
                  }
                }
                if (_this.options['size'] === 24 || (_this.options['size'] === 16 && _this.options['showCounts'] === 'right')) {
                  delete _this.options['size'];
                }
                if (_this.options['size'] === 16) {
                  _this.options['size'] = 'small';
                }
                if (!_this.options['href']) {
                  (_this.options['href'] = _this.options['url']) && delete _this.options['url'];
                }
                return _this.options;
              };
            })(this),
            "googleplus-share": (function(_this) {
              return function() {
                if (!_this.options['showCounts'] && !_this.options['annotation']) {
                  _this.options['annotation'] = 'none';
                }
                if (!_this.options['annotation']) {
                  if (_this.options['showCounts'] === 'right') {
                    _this.options['annotation'] = 'bubble';
                  }
                  if (_this.options['showCounts'] === 'top') {
                    _this.options['annotation'] = 'vertical-bubble';
                  }
                }
                if (_this.options['size'] === 16) {
                  delete _this.options['size'];
                }
                if (_this.options['size'] === 24) {
                  _this.options['height'] = 24;
                  delete _this.options['size'];
                }
                if (!_this.options['href']) {
                  (_this.options['href'] = _this.options['url']) && delete _this.options['url'];
                }
                return _this.options;
              };
            })(this),
            "linkedin-share": (function(_this) {
              return function() {
                if (_this.options['showCounts'] && !_this.options['counter']) {
                  return (_this.options['counter'] = _this.options['showCounts']) && delete _this.options['showCounts'];
                }
              };
            })(this)
          };
          window.optionMapper = this;
        }

        OptionMapper.prototype.provider_icon_name = function() {
          return {
            "facebook-simple": "facebook",
            "googleplus-one": "googleplus",
            "googleplus-simple": "google-plus"
          }[this.provider] || this.provider.replace(/-simple$/, '');
        };

        OptionMapper.prototype.button_img = function() {
          return "images/" + this.options['size'] + "/" + (this.provider_icon_name()) + ".png";
        };

        OptionMapper.prototype.translate = function() {
          var e, _ref, _ref1;
          if (this.options['size'] == null) {
            this.options['size'] = 16;
          }
          if (typeof this.options['size'] === 'string' && !isNaN(parseInt(this.options['size'], 10))) {
            this.options['size'] = parseInt(this.options['size'], 10);
          }
          if (typeof this.options['size'] === 'number') {
            this.options['size'] = (_ref = this.options.size) === 16 || _ref === 24 ? this.options.size : 16;
          }
          if (!this.options['url']) {
            if (this.options['linkBack'] != null) {
              (this.options['url'] = this.options['linkBack']) && delete this.options['linkBack'];
            }
          }
          if (!this.options['url']) {
            this.options['url'] = $('meta[property="og:url"]').attr('content') || location.href;
          }
          if (!this.options['title']) {
            this.options['title'] = $('meta[property="og:title"]').attr('content') || document.title;
          }
          if (!(this.options['icon'] || this.options['image'])) {
            this.options['icon'] = "sficon-" + (this.provider_icon_name());
          }
          if (this.options['icon'] != null) {
            (this.options['sficon'] = this.options['icon']) && delete this.options['icon'];
          }
          if ((_ref1 = this.options['showCounts']) === 'none' || _ref1 === 'false' || _ref1 === 'never') {
            delete this.options['showCounts'];
          }
          if (!this.options['lang']) {
            this.options['lang'] = "en-US";
          }
          try {
            this.translations[this.provider]();
          } catch (_error) {
            e = _error;
            debug("Totally failed to resolve options: " + e + ". Falling back to defaults");
            this.options;
          }
          return this.options;
        };

        return OptionMapper;

      })();

      /*
      Main bootstrap on dom ready
       */
      return $(function() {
        var e, initFB, initShareBar, register, selector, trackBasic, trackTwitter;
        debug("running onready bootstrap");
        selector = '.share-buttons[data-socialite], .share-buttons[data-gigya]';
        initShareBar = function(el) {
          var e;
          try {
            $(el).data('sharebar', new ShareBar(el));
            return $(el).data('sharebar');
          } catch (_error) {
            e = _error;
            return debug("Caught error initializing sharebar: " + e);
          }
        };
        register = function(el) {
          var e, trigger;
          el = $(el);
          trigger = el.attr('data-gigya') || $(el).attr('data-socialite');
          try {
            el.on(trigger, (function(_this) {
              return function() {
                return initShareBar(el[0]).render();
              };
            })(this));
          } catch (_error) {
            e = _error;
            el.bind(trigger, (function(_this) {
              return function() {
                return initShareBar(el[0]).render();
              };
            })(this));
          }
          return el.trigger('auto');
        };
        try {
          $('body').on('register.simplesocialite', selector, function() {
            return register(this);
          });
        } catch (_error) {
          e = _error;
          $('body').delegate(selector, 'register.simplesocialite', function() {
            return register(this);
          });
        }
        $(selector).each(function() {
          return register(this);
        });

        /*
        Set up GA tracking for the basic social networks and for clicks
        that bubble through `.socialite-instance`s, if _gaq is present
         */
        if (window._gaq != null) {
          initFB = function() {
            FB.Event.subscribe('edge.create', function(url) {
              debug('tracking facebook');
              return _gaq.push(['_trackSocial', 'facebook', 'like', url]);
            });
            return FB.Event.subscribe('edge.remove', function(url) {
              return _gaq.push(['_trackSocial', 'facebook', 'unlike', url]);
            });
          };
          window._fbAsyncInit = window.fbAsyncInit;
          window.fbAsyncInit = function() {
            if (typeof window._fbAsyncInit === 'function') {
              window._fbAsyncInit();
            }
            return initFB();
          };
          if (window.FB != null) {
            initFB();
          }
          if (window.twttr != null) {
            trackTwitter = function(evt) {
              var path;
              debug('tracking twitter');
              try {
                path = evt && evt.target && evt.target.nodeName === 'IFRAME' ? $.optionsFromQueryString(evt.target.src.split('?')[1]).url : null;
              } catch (_error) {
                e = _error;
                path = null;
              }
              return _gaq.push(['_trackSocial', 'twitter', 'tweet', path || location.href]);
            };
            twttr.ready(function(twttr) {
              return twttr.events.bind('tweet', trackTwitter);
            });
          }
          trackBasic = function(evt) {
            var button, el;
            if ($(evt.target).hasClass('.socialite-instance')) {
              el = $(evt.target);
            } else {
              el = $(evt.target).parents('.socialite-instance').eq(0);
            }
            button = el.attr('class').split(' ')[1];
            if (button.match(/twitter/) && (window.twttr != null)) {
              return;
            }
            debug("tracking " + button);
            return _gaq.push(['_trackSocial', button, 'share', location.href]);
          };
          return (($().on != null) && $('body').on('click', '.socialite-instance', trackBasic)) || $('body').delegate('.socialite-instance', 'click', trackBasic);
        }
      });
    }
  };
})(this);


/*
Kick off the jQuery check
 */

check();
