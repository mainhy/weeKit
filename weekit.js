/*!
* WeeKit.js - It is a very micro Javascript library for modern browsers with a largely jQuery-compatible API.
* Author - BestAddon.com
* Released under MIT license
*/
(function (W, D, S) {
  'use strict'
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
  var getBCR = 'getBoundingClientRect'
  var int = W.parseInt
  var float = W.parseFloat
  var div = D.createElement('div')
  var docEle = D.documentElement
  var checkableRe = /radio|checkbox/i
  var addPx = ['top', 'right', 'bottom', 'left', 'width', 'height', 'minWidth', 'minHeight', 'maxWidth', 'maxHeight', 'fontSize']

  function isWindow (x) { return !!x && x === x.window }
  function isSelf (x) { return x instanceof Q }
  function isType (el) { return {}.toString.call(el).slice(8, -1).toLowerCase() }
  'Element,Document,String,Number,Boolean,Null,Undefined,Array,Object,Function,Date'.split(',').forEach(function (type, id) { // Type of Object
    Q['is' + type] = _[type.slice(0, 3)] = function (o) { // Create private VARIABLE by 3 chars, EX: _.Doc = isDocument
      if (['Element', 'Document'].indexOf(type) > -1) return o && o.nodeType === Math.pow(9, id)
      else return isType(o) === type.toLowerCase()
    }
  })
  function funcArg (context, arg, idx, payload) {
    return _.Fun(arg) ? arg.call(context, idx, payload) : arg
  }
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
  function isValid (el, arg, idx, payload) {
    if (typeof arg === 'object') {
      Object.keys(arg).length > 0 ? map.call(arg, function (e) { div.appendChild(e) }) : div.appendChild(arg)
      var divInner = div.innerHTML
      div.textContent = ''
    }
    return _.Str(divInner) ? divInner : funcArg(el, arg, idx, payload)
  }
  function getStyle (el, prop) {
    return (el.currentStyle ? el.currentStyle : (W.getComputedStyle ? W.getComputedStyle(el, null) : el.style))[prop]
  }
  function getCompare (item) {
    return !item ? false
      : _.Fun(item) ? item
        : _.Str(item) ? function (i, ele) {
          return isMatches(ele, item)
        } : isSelf(item) ? function (i, ele) {
          return item.is(ele)
        } : function (i, ele) {
          return ele === item
        }
  }

  function goStyle (obj, name, value) {
    if (!obj.length) return
    return _.Und(value) ? getStyle(obj[0], name) : each(obj, function (i, el) {
      var addSufix = Q.inArray(name, addPx) > -1 ? 'px' : ''
      el.style[name] = funcArg(el, value, i, getStyle(el, name)) + addSufix
    })
  }

  function goTo (obj, prop, selector, deep, until) {
    var group = []
    var isUntil = until && getCompare(until)
    var compare = getCompare(deep === 'closest' ? selector : selector || '*')
    var applied = function (el, fn) {
      return push.apply(group, fn || filter.call(el, function (ele, i) { return compare.call(ele, i, ele) }))
    }
    if (!prop) { // For Fn.Filter
      applied(obj)
    } else {
      each(obj, function (i, el) {
        if (_.Fun(prop)) {
          applied(el, prop(el))
        } else {
          el = el[prop]
          while (el !== null) {
            if (until && isUntil(-1, el)) break
            if (!_.Ele(el)) { // For Fn.Children
              applied(el)
            } else if (compare(i, el)) {
              group.push(el)
              if (deep === 'closest') break
            }
            el = deep ? el[prop] : null
          }
        }
      })
    }
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
    var deep; var args = slice.call(arguments, 1)
    if (_.Boo(target)) {
      deep = target
      target = args.shift()
    }
    args.forEach(function (arg) {
      for (var key in arg) {
        if (deep && (isPlainObject(arg[key]) || _.Arr(arg[key]))) {
          if (isPlainObject(arg[key]) && !isPlainObject(target[key])) { target[key] = {} }
          if (_.Arr(arg[key]) && !_.Arr(target[key])) { target[key] = [] }
          extend(target[key], arg[key], deep)
        } else if (!_.Und(arg[key])) target[key] = arg[key]
      }
    })
    return target
  }
  function ready (callback) {
    return D.readyState !== 'loading' ? callback() : D[addEvent]('DOMContentLoaded', callback)
  }

  function Init (el, context) { // el = selector, dom element or function
    var ctx = context ? (isSelf(context) ? context[0] : context.nodeType ? Q(context)[0] : D[s](context)) : D
    push.apply(this, el && (el.nodeType || el === W) ? [el] : _.Str(el) ? (isSelector(el) ? ctx[sa](el) : parseHTML(el)) : el)
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
      return Q(concat.apply([], map.call(this, function (ele, i) {
        return callback.call(ele, i, ele)
      })))
    },
    filter: function (selector) {
      return goTo(this, false, selector)
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
      return indexOf.call(_.Und(selector) ? this[0][parent][children] : this, _.Und(selector) ? this[0] : Q(selector)[0])
    },
    size: function () {
      return this.length
    },

    // /////////*  ATTRIBUTES GROUP  *//////////////// //
    css: function (name, value) {
      var self = this
      var group = {}
      if (_.Str(name)) { return goStyle(self, name, value) }
      each(name, function (prop, val) {
        if (_.Obj(name)) goStyle(self, prop, val)
        else group[val] = goStyle(self, val) // An array of one or more CSS properties.
      })
      return _.Obj(name) ? self : group
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
        if (isMatches(el, selector || '*')) { el[parent].removeChild(el) }
      })
    },
    detach: function (selector) {
      this.remove(selector)
      return this
    },
    empty: function () {
      return this.each(function (i, el) {
        el.textContent = ''
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
        Q(el).parent(selector).replaceWith(el)
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
        return slice.call(isSelector(selector) ? el[sa](selector) : Q(selector).filter(function (i, ele) {
          return el.contains(ele)
        }))
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
    siblings: function (selector) {
      return goTo(this, function (el) {
        return filter.call(el[parent][children], function (item) {
          return item !== el && isMatches(item, selector || '*')
        })
      })
    },

    // /////////*  OFFSETS GROUP  *//////////////// //
    position: function () {
      return this[0] && {
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
  each({ append: 'beforeend', prepend: 'afterbegin', after: 'afterend', before: 'beforebegin' }, function (type, position) {
    Q.fn[type] = function (html) {
      return _.Und(html) ? this : each(this, function (idx, el) {
        el.insertAdjacentHTML(position, isValid(el, html, idx, el[position]))
      })
    }
    // 'appendTo', 'prependTo', 'insertBefore', 'insertAfter'
    Q.fn[type.indexOf('pend') > -1 ? type + 'To' : 'insert' + (type === 'after' ? 'After' : 'Before')] = function (html) {
      Q(html)[type](this)
      return this
    }
  })
  each({ text: 'textContent', html: 'innerHTML' }, function (type, position) {
    Q.fn[type] = function (value) {
      return _.Und(value) ? this[0][position] : each(this, function (idx, el) {
        el[position] = isValid(el, value, idx, el[position])
      })
    }
  })

  // //////////////////////// //
  // *  ATTRIBUTES GROUP  * //
  // /////////////////////// //
  each(['has', 'add', 'remove', 'toggle'], function (i, type) {
    Q.fn[type + 'Class'] = function (className) {
      if (type === 'has' && _.Str(className)) return this[0].classList.contains(className)
      return this.each(function (idx, el) {
        el.classList[type].apply(el.classList, _.Arr(className) ? className.map(function (str) { return str.replace(/\s/g, '') }) : funcArg(el, className, idx, el.className).split(/\s+/))
      })
    }
  })
  each({ attr: ['get', 'set'], removeAttr: 'remove', hasAttr: ['has'], data: ['get', 'set'] }, function (type, prop) {
    var dataAttr = (type === 'data' ? 'data-' : '')
    Q.fn[type] = function (name, value) {
      if (_.Str(name) && _.Und(value) && _.Arr(prop)) return this[0][prop[0] + 'Attribute'](dataAttr + name)
      return this.each(function (i, el) {
        var isProp = (_.Arr(prop) && prop[1] ? prop[1] : prop) + 'Attribute'
        if (_.Obj(name)) each(name, function (id, val) { el[isProp](dataAttr + id, val) })
        else el[isProp](dataAttr + name, funcArg(el, value, i, el.getAttribute(dataAttr + name)))
      })
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
  each({ 'show': 'block', 'hide': 'none', 'toggle': [] }, function (type, prop) {
    Q.fn[type] = function (duration) {
      this.css({ 'visibility': 'initial', 'opacity': 1 })
      this.each(function (i, el) {
        el.style.display = _.Arr(prop) ? (getStyle(el, 'display') !== 'none' ? 'none' : 'block') : prop
      })
    }
  })

  // //////////////////////// //
  // *  DIMENSIONS GROUP  * //
  // /////////////////////// //
  each(['Width', 'Height'], function (id, prop) {
    var property = prop.toLowerCase()
    Q.fn[property] = function (value) {
      var el = this[0]
      if (_.Und(value)) {
        return isWindow(el) ? el['inner' + prop]
          : _.Doc(el) ? el.documentElement['scroll' + prop]
            : el[getBCR]()[property]
      }
      return goStyle(this, property, value)
    }
    each(['outer', 'inner'], function (i, name) {
      Q.fn[name + prop] = function (includeMargins) {
        var el = this[0]
        return el && el[(!i ? 'offset' : 'client') + prop] + (includeMargins && !i ? float(getStyle(el, 'margin' + (id ? 'Top' : 'Left'))) + float(getStyle(el, 'margin' + (id ? 'Bottom' : 'Right'))) : 0)
      }
    })
  })

  Q.inArray = function (value, array, index) { return indexOf.call(array, value, index) }
  Q.isWindow = isWindow
  Q.type = isType
  Q.extend = extend
  Q.each = each
  Q.isPlainObject = isPlainObject
  Q.parseHTML = parseHTML
  W[S] = W['Q'] = Q
  _.Und(W.$) && (W.$ = Q)
})(window, document, 'weeKit')
