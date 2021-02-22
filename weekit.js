/*!
* WeeKit.js - It is a very micro Javascript library for modern browsers with a largely jQuery-compatible API.
* Author - BestAddon.com
* Released under MIT license
*/
(function (W, D, S) {
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
  var removeEvent = 'removeEventListener'
  var s = 'querySelector'
  var sa = s + 'All'
  var int = W.parseInt
  var float = W.parseFloat
  var div = D.createElement('div')
  var checkableRe = /radio|checkbox/i
  function _ (el) { return el === []._ || void 0 } // CHECK ITEM IS UNDEFINED: []._ == void 0 == undefined
  function isType (el) { return {}.toString.call(el).slice(8, -1).toLowerCase() }
  function isFunction (el) { return isType(el) === 'function' }
  function isString (el) { return isType(el) === 'string' }
  function isArray (el) { return isType(el) === 'array' }
  function isObject (el, self) { return self ? isType(el) === 'object' : typeof el === 'object' } // Check if an item is a weeKit[self] object ({}) or not.
  function isSelf (x) { return x instanceof Q }
  function isPlainObject (obj) {
    if (!isObject(obj) || obj === null) return false
    var prot = Object.getPrototypeOf(obj)
    return prot === null || prot === Object.prototype
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
    if (isObject(el)) {
      isObject(el, true) ? map.call(el, function (e, i) { div.appendChild(e) }) : div.appendChild(el)
      var divInner = div.innerHTML
      div.textContent = ''
    }
    return (isFunction(el) ? el() : isObject(el) ? divInner : el)
  }
  function getStyle (el, prop) {
    return (el.currentStyle ? el.currentStyle : (W.getComputedStyle ? W.getComputedStyle(el, null) : el.style))[prop]
  }
  function getValue (ele) {
    if (ele.multiple && ele.options) {
      return goTo(filter.call(ele.options, function (option) {
        return option.selected && !option.disabled && !option.parentNode.disabled
      }), 'value')
    }
    return ele.value || ''
  }
  function getCompare (item) {
    return !item ? function () {
      return false
    } : isString(item) ? function (i, ele) {
      return isMatches(ele, item)
    } : isFunction(item) ? item : isSelf(item) ? function (i, ele) {
      return item.is(ele)
    } : function (i, ele) {
      return ele === item
    }
  }

  function goClass (obj, prop, className) {
    if (prop === 'contains' && isString(className)) obj[0].classList[prop](className)
    else {
      className = isString(className) ? className.split(/\s+/) : className
      map.call(obj, function (el) {
        el.classList[prop].apply(el.classList, className)
      })
    }
    return obj
  }
  function goAttr (obj, prop, name, value) {
    if (isString(name)) {
      if ((_(value) && prop === 'get') || prop === 'has') return obj[0][prop + 'Attribute'](name)
      else {
        return each(obj, function (i, el) {
          el[(prop === 'get' ? 'set' : prop) + 'Attribute'](name, value)
        })
      }
    } else return obj
  }
  function goContent (obj, prop, value) { // textContent|innerHTML
    if (isString(prop)) {
      return _(value) ? obj[0][prop] : each(obj, function (i, el) {
        el[prop] = isValid(value)
      })
    }
  }
  function goStyle (obj, name, value, extra) {
    if (obj.length > 0) {
      // Check name is array for inner/outer of width & height
      var getSize = float(isArray(obj[0][name]) ? (obj[0][name]).join('') : getStyle(obj[0], name))
      var extraSize = isArray(extra) && extra.reduce(function (total, val) {
        total += float(getStyle(obj[0], val))
        return total
      }, 0)
      return _(value) ? getSize
        : (value === true && isArray(extra) ? (getSize + extraSize) // FOR outerWidth & outerHeight
          : each(obj, function (i, el) {
            name = isArray(name) ? name[1].toLowerCase() : name
            value = value === 'showToggle' ? (getStyle(el, 'display') !== 'none' ? 'none' : 'block') : (isString(value) ? value : float(value) + 'px')
            el.style[name] = value
          }))
    }
  }
  function goEvent (obj, prop, event, callback) { // prop = 'addEventListener|removeEventListener', event = 'click', callback = function
    return each(obj, function (i, el) {
      isString(event) && event.split(/\s+/).forEach(function (e) {
        el[prop](e, callback)
      })
    })
  }
  function goInsert (obj, prop, item) {
    return _(item) ? obj : each(obj, function (i, el) {
      el.insertAdjacentHTML(prop, isValid(item))
    })
  }
  function goTo (obj, prop, selector, deep, until) {
    var group = []
    var compare = until && getCompare(until)
    map.call(obj, function (el, i) {
      if (isFunction(prop) || prop === children) {
        push.apply(group, isFunction(prop) ? prop(el) : el[prop])
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
    return group
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
  function extend () {
    var sources = []
    for (var _i = 0; _i < arguments.length; _i++) {
      sources[_i] = arguments[_i]
    }
    var deep = isType(sources[0]) === 'boolean' ? sources.shift() : false
    var target = sources.shift()
    var length = sources.length
    if (!target) return {}
    if (!length) return extend(deep, Q, target)
    for (var i = 0; i < length; i++) {
      var source = sources[i]
      for (var key in source) {
        if (deep && (isArray(source[key]) || isPlainObject(source[key]))) {
          if (!target[key] || target[key].constructor !== source[key].constructor) target[key] = new source[key].constructor()
          extend(deep, target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    }
    return target
  }
  function ready (callback) {
    return D.readyState !== 'loading' ? callback() : D[addEvent]('DOMContentLoaded', callback)
  }

  function Init (el, context) { // el = selector, dom element or function
    if (isString(el)) {
      if (isSelector(el)) var ctx = ((isSelf(context) ? context[0] : D[s](context)) || D); else div.innerHTML = el
    }
    push.apply(this, el && el.nodeType ? [el] : isString(el) ? (isSelector(el) ? ctx[sa](el) : [div.lastChild]) : el)
  }
  function Q (el, context) { // el = selector, dom element or function
    return isFunction(el) ? ready(el) : new Init(el, context)
  }

  Q.extend = extend
  Q.each = each
  Q.fn = Q.prototype = Init.prototype = {
    version: '1.0.0',
    length: 0, // default length
    splice: splice, // for some reason is needed to get an array-like

    // /////////*  EVENTS GROUP  *//////////////// //
    on: function (event, callback) { // event = 'click' | callback = function
      return goEvent(this, addEvent, event, callback)
    },
    off: function (event, callback) {
      return goEvent(this, removeEvent, event, callback)
    },
    ready: function (callback) {
      return ready(callback)
    },
    trigger: function (ev) {
      if (D.createEvent) {
        var event = D.createEvent('HTMLEvents')
        event.initEvent(ev, true, false)
        this.each(function (i, el) {
          el.dispatchEvent(event)
        })
      } else {
        this.each(function (i, el) {
          el.fireEvent('on' + ev)
        })
      }
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
      return _(index) ? slice.call(this) : this[int(index) < 0 ? int(index) + this.length : int(index)]
    },
    index: function (selector) {
      return indexOf.call(_(selector) ? this[0].parentNode.children : this, _(selector) ? this[0] : Q(selector)[0])
    },
    extend: function (plugins) {
      return extend(Q.fn, plugins)
    },

    // /////////*  ATTRIBUTES GROUP  *//////////////// //
    hasClass: function (className) {
      return goClass(this, 'contains', className)
    },
    addClass: function (className) {
      return goClass(this, 'add', className)
    },
    removeClass: function (className) {
      return goClass(this, 'remove', className)
    },
    toggleClass: function (className) {
      return goClass(this, 'toggle', className)
    },
    attr: function (name, value) {
      return goAttr(this, 'get', name, value)
    },
    removeAttr: function (name) {
      return goAttr(this, 'remove', name)
    },
    hasAttr: function (name) {
      return goAttr(this, 'has', name)
    },
    data: function (name, value) {
      return goAttr(this, 'get', 'data-' + name, value)
    },
    css: function (name, value) {
      if (isObject(name)) {
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
    append: function (item) {
      return goInsert(this, 'beforeend', item)
    },
    appendTo: function (selector) {
      return Q(selector).append(this).children(selector)
    },
    prepend: function (item) {
      return goInsert(this, 'afterbegin', item)
    },
    prependTo: function (selector) {
      return Q(selector).prepend(this).children(selector)
    },
    before: function (item) {
      return goInsert(this, 'beforebegin', item)
    },
    insertBefore: function (selector) {
      return Q(selector).before(this).prev()
    },
    after: function (item) {
      return goInsert(this, 'afterend', item)
    },
    insertAfter: function (selector) {
      return Q(selector).after(this).next()
    },
    text: function (text) {
      return goContent(this, 'textContent', text)
    },
    html: function (html) {
      return goContent(this, 'innerHTML', html)
    },
    contents: function () {
      return Q(unique(goTo(this, function (el) {
        return el.tagName === 'IFRAME' ? [el.contentDocument] : el.tagName === 'TEMPLATE' ? el.content.childNodes : el.childNodes
      })))
    },
    replaceWith: function (selector) {
      return this.before(selector).remove()
    },
    replaceAll: function (selector) {
      Q(selector).replaceWith(this)
      return this
    },
    clone: function (deep) {
      return this[0].cloneNode(_(deep) ? true : deep)
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
      return _(selector) ? this : this.each(function (i, el) {
        Q(el).before(isObject(selector, true) ? selector[0] : selector).prev().append(el)
      })
    },
    wrapInner: function (selector) {
      return _(selector) ? this : this.each(function (i, el) {
        Q(el).append(isObject(selector, true) ? selector[0] : selector)
        while (el.firstChild !== el.lastChild) {
          el.lastChild.appendChild(el.firstChild)
        }
      })
    },
    unwrap: function (selector) { // selector : String
      this.each(function (i, el) {
        var item = el.parentNode
        if (isMatches(item, selector || ':not(body)')) {
          Q(item).before(el).remove()
        }
      })
      return this
    },

    // /////////*  TRAVERSAL GROUP  *//////////////// //
    next: function (selector) {
      return Q(unique(goTo(this, next, selector)))
    },
    nextAll: function (selector) {
      return Q(unique(flat(goTo(this, next, selector, true))))
    },
    nextUntil: function (until, selector) {
      return Q(unique(flat(goTo(this, next, selector, true, until))))
    },
    prev: function (selector) {
      return Q(unique(goTo(this, prev, selector)))
    },
    prevAll: function (selector) {
      return Q(unique(flat(goTo(this, prev, selector, true))))
    },
    prevUntil: function (until, selector) {
      return Q(unique(flat(goTo(this, prev, selector, true, until))))
    },
    find: function (selector) {
      return Q(flat(this.map(function (i, el) {
        return slice.call(isSelector(selector) ? el[sa](selector) : selector)
      })))
    },
    children: function (selector) {
      return Q(unique(flat(goTo(this, children, selector))))
    },
    parent: function (selector) {
      return Q(unique(goTo(this, parent, selector)))
    },
    parents: function (selector) {
      return Q(unique(flat(goTo(this, parent, selector, true))))
    },
    parentsUntil: function (until, selector) {
      return Q(unique(flat(goTo(this, parent, selector, true, until))))
    },
    closest: function (selector) {
      return Q(unique(flat(goTo(this, parent, selector, 'closest'))))
    },
    has: function (selector) {
      var comparator = isString(selector) ? function (i, ele) {
        return Q(ele).find(selector).length
      } : function (i, ele) {
        return ele.contains(selector)
      }
      return this.filter(comparator)
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
      return Q(unique(goTo(this, function (ele) {
        return Q(ele).parent().children().not(ele)
      })))
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

    // /////////*  FORM GROUP  *//////////////// //
    val: function (value) {
      return _(value) ? getValue(this[0]) : this.each(function (i, ele) {
        var isSelect = ele.multiple && ele.options
        if (isSelect || checkableRe.test(ele.type)) {
          var eleValue = isArray(value) ? map.call(value, String) : value === null ? [] : [String(value)]
          if (isSelect) {
            each(ele.options, function (i, option) {
              option.selected = eleValue.indexOf(option.value) >= 0
            }, true)
          } else {
            ele.checked = eleValue.indexOf(ele.value) >= 0
          }
        } else {
          ele.value = value || ''
        }
      })
    }
    // END //////////
  }
  W[S] = W['Q'] = Q
})(window, document, 'weeKit')
