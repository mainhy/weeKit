/*!
* WeeKit.js - It is a very micro Javascript library for modern browsers with a largely jQuery-compatible API.
* Author - BestAddon.com
* Released under MIT license
*/
(function (W, D, S) {
  var _ = {}
  var filter = [].filter
  var map = [].map
  var forEach = [].forEach
  var push = [].push
  var concat = [].concat
  var slice = [].slice
  var splice = [].splice
  var some = [].some
  var indexOf = [].indexOf
  var next = 'nextElementSibling' // OR 'nextSibling'
  var prev = 'previousElementSibling' // OR 'previousSibling'
  var parent = 'parentElement' // OR 'parentNode'
  var children = 'children' // OR 'childNodes'
  var addEvent = 'addEventListener'
  var s = 'querySelector'
  var sa = s + 'All'
  var int = W.parseInt
  var float = W.parseFloat
  var div = D.createElement('div')
  var docEle = D.documentElement
  var checkableRe = /radio|checkbox/i

  function isWindow (x) { return !!x && x === x.window }
  function isSelf (x) { return x instanceof Q }
  function isType (el) { return {}.toString.call(el).slice(8, -1).toLowerCase() }
  'Element,Document,String,Number,Boolean,Null,Undefined,Array,Object,Function,Date'.split(',').forEach(function (type, id) { // Type of Object
    Q['is' + type] = _[type.slice(0, 3)] = function (o) { // Create private VARIABLE by 3 chars, EX: _.Doc = isDocument
      if (['Element', 'Document'].indexOf(type) > -1) return o && o.nodeType === Math.pow(9, id)
      else return isType(o) === type.toLowerCase()
    }
  })
  function parseHTML (str) {
    var tmp = D.implementation.createHTMLDocument()
    tmp.body.innerHTML = str
    return tmp.body.children
  }
  function isPlainObject (obj) {
    return _.Obj(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype
  }
  function isSelector (el) {
    if (!el) return false
    try {
      D.createDocumentFragment().querySelector(el)
    } catch (e) { return false }
    return true
  }
  function isMatches (ele, selector) {
    var matches = ele && (ele.matches || ele.webkitMatchesSelector || ele.msMatchesSelector)
    return !!matches && isSelector(selector) && matches.call(ele, selector)
  }
  function isValid (el) {
    if (typeof el === 'object') {
      Object.keys(el).length > 0 ? map.call(el, function (e) { div.appendChild(e) }) : div.appendChild(el)
      var divInner = div.innerHTML
      div.textContent = ''
    }
    return (_.Fun(el) ? el() : _.Str(divInner) ? divInner : el)
  }
  function getStyle (el, prop) {
    return (el.currentStyle ? el.currentStyle : (W.getComputedStyle ? W.getComputedStyle(el, null) : el.style))[prop]
  }
  function getCompare (item) {
    return !item ? function () {
      return false
    } : _.Str(item) ? function (i, ele) {
      return isMatches(ele, item)
    } : _.Fun(item) ? item : isSelf(item) ? function (i, ele) {
      return item.is(ele)
    } : function (i, ele) {
      return ele === item
    }
  }

  function goStyle (obj, name, value, extra) {
    if (obj.length > 0) {
      // Check name is array for inner/outer of width & height
      var getSize = float(_.Arr(obj[0][name]) ? (obj[0][name]).join('') : getStyle(obj[0], name))
      var extraSize = _.Arr(extra) && extra.reduce(function (total, val) {
        total += float(getStyle(obj[0], val))
        return total
      }, 0)
      return _.Und(value) ? getSize
        : (value === true && _.Arr(extra) ? (getSize + extraSize) // FOR outerWidth & outerHeight
          : each(obj, function (i, el) {
            name = _.Arr(name) ? name[1].toLowerCase() : name
            value = (value === 'showToggle' ? (getStyle(el, 'display') !== 'none' ? 'none' : 'block') : value)
            el.style[name] = value
          }))
    }
  }

  function goTo (obj, prop, selector, deep, until) {
    var group = []
    var compare = until && getCompare(until)
    map.call(obj, function (el, i) {
      if (_.Fun(prop) || prop === children) {
        push.apply(group, _.Fun(prop) ? prop(el) : el[prop])
      } else {
        el = el[prop]
        while (el !== null) {
          if (until && compare(-1, el)) break
          if (isMatches(el, deep === 'closest' ? selector : selector || '*')) {
            group.push(el)
            if (deep === 'closest') break
          }
          el = deep ? el[prop] : null
        }
      }
    })
    return Q(unique(flat(group)))
  }

  function unique (arr) {
    return arr.length > 1 ? filter.call(arr, function (el, i, all) { return el && all.indexOf(el) === i }) : arr
  }
  function flat (arr) {
    return concat.apply([], arr)
  }

  function each (obj, callback) {
    if (isPlainObject(obj)) {
      for (var i in obj) {
        if (obj.hasOwnProperty(i)) callback.call(obj[i], i, obj[i])
      }
    } else {
      forEach.call(obj, function (ele, i, obj) {
        callback.call(ele, i, ele, obj)
      })
    }
    return obj
  }
  function extend (target) {
    var i, property, result
    for (i = 1; i < arguments.length; i++) {
      if (_.Obj(arguments[i])) {
        for (property in arguments[i]) {
          if ({}.hasOwnProperty.call(arguments[i], property)) { result[property] = arguments[i][property] }
        }
      }
    }
    return result
  }
  function ready (callback) {
    return D.readyState !== 'loading' ? callback() : D[addEvent]('DOMContentLoaded', callback)
  }

  function Init (el, context) { // el = selector, dom element or function
    push.apply(this, el && el.nodeType ? [el] : _.Str(el) ? (isSelector(el) ? (isSelf(context) ? context[0] : D[s](context) || D)[sa](el) : parseHTML(el)) : el)
  }
  function Q (el, context) { // el = selector, dom element or function
    return _.Fun(el) ? ready(el) : new Init(el, context)
  }

  Q.fn = Q.prototype = Init.prototype = {
    version: '1.0.0',
    length: 0, // default length
    splice: splice, // for some reason is needed to get an array-like

    // /////////*  EVENTS GROUP  *//////////////// //
    ready: function (callback) {
      return ready(callback)
    },
    trigger: function (eventName, options) {
      var event = D.createEvent(_.Und(options) ? 'HTMLEvents' : 'CustomEvent')
      if (_.Und(options)) event.initEvent(eventName, true, false)
      else event.initCustomEvent(eventName, true, true, options)
      this.each(function (i, el) {
        el.dispatchEvent(event)
      })
    },

    // /////////*  COLLECTION GROUP  *//////////////// //
    each: function (callback) { // callback = function
      return each(this, callback)
    },
    map: function (callback) {
      return unique(map.call(this, function (ele, i) {
        return callback.call(ele, i, ele)
      }))
    },
    filter: function (selector) {
      return Q(filter.call(this, function (ele, i) {
        return getCompare(selector).call(ele, i, ele)
      }))
    },
    add: function (selector, context) {
      return Q(unique(this.get().concat(Q(selector, context).get())))
    },
    slice: function (start, end) {
      return Q(slice.call(this, start, end))
    },
    first: function () {
      return this.eq(0)
    },
    last: function () {
      return this.eq(-1)
    },
    eq: function (index) {
      return Q(this.get(index))
    },
    get: function (index) {
      return _.Und(index) ? slice.call(this) : this[int(index) < 0 ? int(index) + this.length : int(index)]
    },
    index: function (selector) {
      return indexOf.call(_.Und(selector) ? this[0].parentNode.children : this, _.Und(selector) ? this[0] : Q(selector)[0])
    },
    extend: function (plugins) {
      return extend(Q.fn, plugins)
    },
    size: function () {
      return this.length
    },

    // /////////*  ATTRIBUTES GROUP  *//////////////// //
    css: function (name, value) {
      if (_.Obj(name)) {
        for (var prop in name) {
          goStyle(this, prop, name[prop])
        }
        return this
      } else {
        return goStyle(this, name, value)
      }
    },

    // /////////*  EFFECTS GROUP  *//////////////// //
    hide: function () {
      return goStyle(this, 'display', 'none')
    },
    show: function () {
      return goStyle(this, 'display', 'initial')
    },
    toggle: function () {
      return goStyle(this, 'display', 'showToggle')
    },

    // /////////*  MANIPULATION GROUP  *//////////////// //
    contents: function () {
      return goTo(this, function (el) {
        return el.contentDocument || el.childNodes
      })
    },
    replaceWith: function (selector) {
      return this.before(selector).remove()
    },
    replaceAll: function (selector) {
      Q(selector).replaceWith(this)
      return this
    },
    clone: function (deep) {
      return this[0].cloneNode(_.Und(deep) ? true : deep)
    },
    remove: function (selector) { // selector : String
      this.each(function (i, el) {
        if (isMatches(el, selector || '*')) { el.parentNode.removeChild(el) }
      })
    },
    detach: function (selector) {
      this.remove(selector)
      return this
    },
    empty: function () {
      return this.each(function (i, el) {
        while (el.lastChild) {
          el.removeChild(el.lastChild)
        }
      })
    },
    wrap: function (selector) {
      return _.Und(selector) ? this : this.each(function (i, el) {
        Q(el).before(_.Obj(selector) ? selector[0] : selector).prev().append(el)
      })
    },
    wrapInner: function (selector) {
      return _.Und(selector) ? this : this.each(function (i, el) {
        Q(el).append(_.Obj(selector) ? selector[0] : selector)
        while (el.firstChild !== el.lastChild) {
          el.lastChild.appendChild(el.firstChild)
        }
      })
    },
    unwrap: function (selector) { // selector : String
      this.each(function (i, el) {
        $(el).parent(selector).replaceWith(el)
      })
      return this
    },

    // /////////*  TRAVERSAL GROUP  *//////////////// //
    next: function (selector) {
      return goTo(this, next, selector)
    },
    nextAll: function (selector) {
      return goTo(this, next, selector, true)
    },
    nextUntil: function (until, selector) {
      return goTo(this, next, selector, true, until)
    },
    prev: function (selector) {
      return goTo(this, prev, selector)
    },
    prevAll: function (selector) {
      return goTo(this, prev, selector, true)
    },
    prevUntil: function (until, selector) {
      return goTo(this, prev, selector, true, until)
    },
    find: function (selector) {
      return Q(flat(this.map(function (i, el) {
        return slice.call(isSelector(selector) ? el[sa](selector) : selector)
      })))
    },
    children: function (selector) {
      return goTo(this, children, selector)
    },
    parent: function (selector) {
      return goTo(this, parent, selector)
    },
    parents: function (selector) {
      return goTo(this, parent, selector, true)
    },
    parentsUntil: function (until, selector) {
      return goTo(this, parent, selector, true, until)
    },
    closest: function (selector) {
      return goTo(this, parent, selector, 'closest')
    },
    has: function (selector) {
      return this.filter(function (i, ele) {
        return _.Str(selector) ? Q(ele).find(selector).length : ele.contains(selector)
      })
    },
    is: function (el) {
      return some.call(this, function (ele, i) {
        return getCompare(el).call(ele, i, ele)
      })
    },
    not: function (el) {
      return this.filter(function (i, ele) {
        return !getCompare(el).call(ele, i, ele)
      })
    },
    siblings: function (el) {
      return goTo(this, function (ele) {
        return Q(ele).parent().children().not(ele)
      })
    },

    // /////////*  DIMENSIONS GROUP  *//////////////// //
    width: function (value) {
      return goStyle(this, 'width', value)
    },
    innerWidth: function (value) {
      return goStyle(this, ['client', 'Width'], value)
    },
    outerWidth: function (value) {
      return goStyle(this, ['offset', 'Width'], value, ['marginLeft', 'marginRight'])
    },
    height: function (value) {
      return goStyle(this, 'height', value)
    },
    innerHeight: function (value) {
      return goStyle(this, ['client', 'Height'], value)
    },
    outerHeight: function (value) {
      return goStyle(this, ['offset', 'Height'], value, ['marginTop', 'marginBottom'])
    },

    // /////////*  OFFSETS GROUP  *//////////////// //
    position: function () {
      if (this[0]) return
      return {
        left: float(this[0].offsetLeft),
        top: float(this[0].offsetTop)
      }
    },
    offset: function () {
      if (this[0]) return
      var box = this[0].getBoundingClientRect()
      return {
        left: box.left + W.pageXOffset - docEle.clientLeft,
        top: box.top + W.pageYOffset - docEle.clientTop
      }
    },
    offsetParent: function () {
      return this.map(function () {
        var parent = this.offsetParent
        while (parent && getStyle(parent, 'position') === 'static') { parent = parent.offsetParent }
        return parent || D.body
      })
    },

    // /////////*  FORM GROUP  *//////////////// //
    val: function (value) {
      if (_.Und(value)) return this[0] && (this[0].options && this[0].multiple ? filter.call(this[0].options, function (o) { return o.selected }).map(function (v) { return v.value }) : this[0].value)
      return this.each(function (i, el) {
        if (el.multiple && el.options) {
          each(el.options, function (i, option) {
            option.selected = value.indexOf(option.value) >= 0
          }, true)
        } else if (checkableRe.test(el.type)) el.checked = value.indexOf(el.value) >= 0
        else el.value = value || ''
      })
    }
    // END //////////
  }

  // //////////////////////// //
  // *  MANIPULATION GROUP  * //
  // /////////////////////// //
  each({ after: 'afterend', prepend: 'afterbegin', before: 'beforebegin', append: 'beforeend' }, function (type, position) {
    Q.fn[type] = function (html) {
      return _.Und(html) ? this : each(this, function (i, el) {
        el.insertAdjacentHTML(position, isValid(html))
      })
    }
    // 'appendTo', 'prependTo', 'insertBefore', 'insertAfter'
    Q.fn[type.indexOf('pend') > -1 ? type + 'To' : 'insert' + (type === 'after' ? 'After' : 'Before')] = function (html) {
      $(html)[type](this)
      return this
    }
  })
  each({ text: 'textContent', html: 'innerHTML' }, function (type, position) {
    Q.fn[type] = function (value) {
      return _.Und(value) ? this[0][position] : each(this, function (i, el) {
        el[position] = isValid(value)
      })
    }
  })

  // //////////////////////// //
  // *  ATTRIBUTES GROUP  * //
  // /////////////////////// //
  each(['has', 'add', 'remove', 'toggle'], function (i, type) {
    Q.fn[type + 'Class'] = function (className) {
      if (type === 'has' && _.Str(className)) return this[0].classList.contains(className)
      else {
        className = _.Str(className) ? className.split(/\s+/) : className
        return this.each(function (i, el) {
          el.classList[type].apply(el.classList, className)
        })
      }
    }
  })
  each({ attr: ['get', 'set'], removeAttr: 'remove', hasAttr: ['has'], data: ['get', 'set'] }, function (type, prop) {
    Q.fn[type] = function (name, value) {
      if (_.Und(value) && _.Arr(prop)) return this[0][prop[0] + 'Attribute']((type === 'data' ? 'data-' : '') + name)
      else {
        return this.each(function (i, el) {
          el[(_.Arr(prop) && prop[1] ? prop[1] : prop) + 'Attribute']((type === 'data' ? 'data-' : '') + name, value)
        })
      }
    }
  })

  // //////////////////////// //
  // *  EVENTS GROUP  * //
  // /////////////////////// //
  each({ on: 'addEventListener', off: 'removeEventListener' }, function (type, position) {
    Q.fn[type] = function (event, callback) {
      return this.each(function (i, el) {
        _.Str(event) && event.split(/\s+/).forEach(function (e) {
          el[position](e, callback)
        })
      })
    }
  })

  // //////////////////////// //
  // *  EFFECTS GROUP  * //
  // /////////////////////// //
  Q.fn.animate = function (css, duration, ease, callback) {
    if (_.Obj(css)) {
      var self = this
      duration = _.Und(duration) ? 600 : float(duration)
      ease = ease || 'linear'
      Object.keys(css).forEach(function (name) {
        self.css(name, goStyle(self, name))
      })
      this.css('transition', 'all ' + duration + 'ms ' + ease).css(css)
      setTimeout(function () {
        self.css('transition', 'none')
        callback && callback.call(self)
      }, duration)
      return this
    }
  }

  Q.inArray = function (value, array) { return array.indexOf(value) }
  Q.type = isType
  Q.extend = extend
  Q.each = each
  Q.isPlainObject = isPlainObject
  Q.parseHTML = parseHTML
  W[S] = W['Q'] = Q
  _.Und(W.$) && (W.$ = Q)
})(window, document, 'weeKit')
