# weeKit
It is a super-tiny jQuery-like API JavaScript library for modern browsers. It is an alternative—not a replacement—for jQuery. jQuery offers more features, handles more edge cases and supports more browsers. WeeKit is just a thin layer making the DOM friendlier without sacrificing on performance. It is open source software and is released under the developer and business-friendly MIT license.

### Browser support

```
Safari 6+ (Mac)
Chrome 30+ (Windows, Mac, Android, iOS, Linux, Chrome OS)
Firefox 24+ (Windows, Mac, Android, Linux, Firefox OS)
iOS 5+ Safari
Android 4.0+ Browser
Internet Explorer 10+ (Windows, Windows Phone)
```
### Comparison
|Size|weeKit|Zepto 1.2.0|jQuery Slim 3.4.1|
|--- |--- |--- |--- |
|Unminified|**16 KB**|58.7 KB|227 KB|
|Minified|**8 KB**|26 KB|89 KB|
|Minified & Gzipped|**3 KB**|9.8 KB|25.4 KB|

### Installation

Get WeeKit from this site and put it to your website:
 ```
<script src="YOUR_FOLDER/weekit.min.js"></script> 
```

### Usage

That you can then use like this:
##### DOM Ready?

```
$(function () {
  alert('Hey the DOM is ready ;)');
});
```

##### CSS Selectors

This is the main selector method for WeeKit. It returns an actionable collection of nodes.

```
$(node) // => collection
$(nodeList) // => collection
$(htmlString) // => collection
$(collection) // => self
```

[See a list of all CSS selectors](https://drafts.csswg.org/selectors-3/#selectors "See a list of all CSS selectors")

For example:
```
$(function () {
  $("body").addClass ("body-ok");
});
```

### How to make plugins?
Just add your methods to the prototype of WeeKit and you're done. For example:
```
$.fn.myPlugin = function () {
return this.each(function (element) {
    element.textContent = "YOUR TEXT"
  })
};
```
Now use the plugin just like the other methods:
```
$(function () {
  // set the text
  $('p').myPlugin(); // bye
});
```

### API

The methods supported by WeeKit are, for the most part, identical to jQuery's. The few small differences with jQuery are explained below.

#### $.each

    $.each(collection, function(index, item){ ... })  ⇒ collection

Iterate over array elements or object key-value pairs. Returning false from the iterator function stops the iteration.

```javascript
$.each(['a', 'b', 'c'], function(index, item){
  console.log('item %d is: %s', index, item)
})

var hash = { name: 'WeeKit', size: 'Nano' }
$.each(hash, function(key, value){
  console.log('%s: %s', key, value)
})
```

#### $.extend

    $.extend(target, [source, [source2, ...]])  ⇒ target
    $.extend(true, target, [source, ...])  ⇒ target

Extend target object with properties from each of the source objects, overriding the properties on target.

By default, copying is shallow. An optional true for the first argument triggers deep (recursive) copying.

```javascript
var target = { one: 'patridge' },
    source = { two: 'turtle doves' }

$.extend(target, source)
//=> { one: 'patridge',
//     two: 'turtle doves' }
```

#### $.fn

$.fn is an object that holds all of the methods that are available on WeeKit collections, such as addClass(), attr(), and other. Adding a function to this object makes that method available on every WeeKit collection.

Here’s an example implementation of WeeKit’s empty() method:

$.fn.empty = function(){
  return this.each(function(){ this.innerHTML = '' })
}


#### $.inArray

    $.inArray(element, array, [fromIndex])  ⇒ number

Get the position of element inside an array, or -1 if not found.

#### $.isArray

    $.isArray(object)  ⇒ boolean

True if the object is an array.

#### $.isFunction

    $.isFunction(object)  ⇒ boolean

True if the object is a function.

#### $.isNumeric

    $.isNumeric(value)  ⇒ boolean

True if the value is a finite Number or a String representing a number.

#### $.isPlainObject

    $.isPlainObject(object)  ⇒ boolean

True if the object is a “plain” JavaScript object, which is only true for object literals and objects created with new Object.

```javascript
$.isPlainObject({})         // => true
$.isPlainObject(new Object) // => true
$.isPlainObject(new Date)   // => false
$.isPlainObject(window)     // => false
```

#### $.isWindow

    $.isWindow(object)  ⇒ boolean

True if the object is a window object. This is useful for iframes where each one has its own window, and where these objects fail the regular obj === window check.

#### $.map

    $.map(collection, function(item, index){ ... })  ⇒ collection

Iterate through elements of collection and return all results of running the iterator function, with null and undefined values filtered out.

#### $.type

    $.type(object)  ⇒ string

Get string type of an object. Possible types are: null undefined boolean number string function array date regexp object error.

For other objects it will simply report “object”. To find out if an object is a plain JavaScript object, use isPlainObject.

#### add

    add(selector, [context])  ⇒ self

Modify the current collection by adding the results of performing the CSS selector on the whole document, or, if context is given, just inside context elements.

#### addClass

    addClass(name)  ⇒ self
    addClass(function(index, oldClassName){ ... })  ⇒ self

Add class name to each of the elements in the collection. Multiple class names can be given in a space-separated string.

#### after

    after(content)  ⇒ self

Add content to the DOM after each elements in the collection. The content can be an HTML string, a DOM node or an array of nodes.

```javascript
$('form label').after('<p>A note below the label</p>')
```

#### append

    append(content)  ⇒ self

Append content to the DOM inside each individual element in the collection. The content can be an HTML string, a DOM node or an array of nodes.

```javascript
$('ul').append('<li>new list item</li>')
```

#### appendTo

    appendTo(target)  ⇒ self

Append elements from the current collection to the target element. This is like append, but with reversed operands.

```javascript
$('<li>new list item</li>').appendTo('ul')
```

#### attr

    attr(name)  ⇒ string
    attr(name, value)  ⇒ self
    attr({ name: value, name2: value2, ... })  ⇒ self

Read or set DOM attributes. When no value is given, reads specified attribute from the first element in the collection. When value is given, sets the attribute to that value on each element in the collection. 

To read DOM properties such as checked or selected, use prop.

```javascript
var form = $('form')
form.attr('action')             //=> read value
form.attr('action', '/create')  //=> set value
```


#### before

    before(content)  ⇒ self

Add content to the DOM before each element in the collection. The content can be an HTML string, a DOM node or an array of nodes.

```javascript
$('table').before('<p>See the following table:</p>')
```

#### children

    children([selector])  ⇒ collection

Get immediate children of each element in the current collection. If selector is given, filter the results to only include ones matching the CSS selector.

```javascript
$('ol').children('*:nth-child(2n)')
//=> every other list item from every ordered list
```

#### clone 

    clone()  ⇒ collection

Duplicate all elements in the collection via deep clone.

This method doesn't have an option for copying data and event handlers over to the new elements, as it has in jQuery.

#### closest

    closest(selector)  ⇒ collection
    closest(collection)  ⇒ collection 
    closest(element)  ⇒ collection

Traverse upwards from the current element to find the first element that matches the selector. If context node is given, consider only elements that are its descendants. This method is similar to parents(selector), but it only returns the first ancestor matched.

```javascript
var input = $('input[type=text]')
input.closest('form')
```

#### contents

    contents()  ⇒ collection

Get the children of each element in the collection, including text and comment nodes.

#### css

    css(property)  ⇒ value
    css(property, value)  ⇒ self
    css({ property: value, property2: value2, ... })  ⇒ self

Read or set CSS properties on DOM elements. When no value is given, returns the CSS property from the first element in the collection. When a value is given, sets the property to that value on each element of the collection.

Multiple properties can be set by passing an object to the method.

```javascript
var elem = $('h1')
elem.css('background-color')          // read property
elem.css('background-color', '#369')  // set property

// set multiple properties:
elem.css({ backgroundColor: '#8EE', fontSize: 28 })
```

#### data

    data(name)  ⇒ value
    data(name, value)  ⇒ self

Read or write data-* DOM attributes. Behaves like attr, but prepends data- to the attribute name.

#### each

    each(function(index, item){ ... })  ⇒ self

Iterate through every element of the collection. Inside the iterator function, this keyword refers to the current item (also passed as the second argument to the function). If the iterator function returns false, iteration stops.

```javascript
$('form input').each(function(index){
  console.log('input %d is: %o', index, this)
})
```

#### empty

    empty()  ⇒ self

Clear DOM contents of each element in the collection.

#### eq

    eq(index)  ⇒ collection

Get the item at position specified by index from the current collection.

```javascript
$('li').eq(0)   //=> only the first list item
$('li').eq(-1)  //=> only the last list item
```

#### filter

    filter(selector)  ⇒ collection
    filter(function(index){ ... })  ⇒ collection

Filter the collection to contain only items that match the CSS selector. If a function is given, return only elements for which the function returns a truthy value. Inside the function, the this keyword refers to the current element.

#### find

    find(selector)  ⇒ collection
    find(collection)  ⇒ collection
    find(element)  ⇒ collection

Find elements that match CSS selector executed in scope of nodes in the current collection.

If a collection or element is given, filter those elements down to only ones that are descendants of element in the current collection.

```javascript
var form = $('#myform')
form.find('input, select')
```

#### first

    first()  ⇒ collection

Get the first element of the current collection.

```javascript
$('form').first()
```

#### get

    get()  ⇒ array
    get(index)  ⇒ DOM node

Get all elements or a single element from the current collection. When no index is given, returns all elements in an ordinary array. When index is specified, return only the element at that position. 

    var elements = $('h2')
    elements.get()   //=> get all headings as an array
    elements.get(0)  //=> get first heading node

#### has

    has(selector)  ⇒ collection
    has(node)  ⇒ collection

Filter the current collection to include only elements that have any number of descendants that match a selector, or that contain a specific DOM node.

```javascript
$('ol > li').has('a[href]')
//=> get only LI elements that contain links
```

#### hasClass

    hasClass(name)  ⇒ boolean

Check if any elements in the collection have the specified class.

#### height

    height()  ⇒ number
    height(value)  ⇒ self

Get the height of the first element in the collection; or set the height of all elements in the collection.

```javascript
$('#foo').height()   // => 123
```


#### hide

    hide()  ⇒ self

Hide elements in this collection by setting their display CSS property to none.

#### html

    html()  ⇒ string
    html(content)  ⇒ self
    html(function(){ ... })  ⇒ self

Get or set HTML contents of elements in the collection. When no content given, returns innerHTML of the first element. When content is given, use it to replace contents of each element. Content can be any of the types described in append.

```javascript
$('.comment p').html('<span>Your Text</span>')
```

#### index

    index([element])  ⇒ number

Get the position of an element. When no element is given, returns position of the current element among its siblings. When an element is given, returns its position in the current collection. Returns -1 if not found.

```javascript
$('li:nth-child(2)').index()  //=> 1
```

#### insertAfter

    insertAfter(target)  ⇒ self

Insert elements from the current collection after the target element in the DOM. This is like after, but with reversed operands.

```javascript
$('<p>Emphasis mine.</p>').insertAfter('blockquote')
```

#### insertBefore

    insertBefore(target)  ⇒ self

Insert elements from the current collection before each of the target elements in the DOM. This is like before, but with reversed operands.

```javascript
$('<p>See the following table:</p>').insertBefore('table')
```

#### is

    is(selector)  ⇒ boolean

Check if the first element of the current collection matches the CSS selector. 

#### last

    last()  ⇒ collection

Get the last element of the current collection.

```javascript
$('li').last()
```

#### map

    map(function(index, item){ ... })  ⇒ collection

Iterate through all elements and collect the return values of the iterator function. Inside the iterator function, this keyword refers to the current item (also passed as the second argument to the function).

Returns a collection of results of iterator function, with null and undefined values filtered out.

```javascript
// get text contents of all elements in collection
elements.map(function(){ return $(this).text() }).get().join(', ')
```

#### next

    next()  ⇒ collection
    next(selector)  ⇒ collection

Get the next sibling–optionally filtered by selector–of each element in the collection.

```javascript
$('dl dt').next()   //=> the DD elements
```

#### not

    not(selector)  ⇒ collection
    not(collection)  ⇒ collection
    not(function(index){ ... })  ⇒ collection

Filter the current collection to get a new collection of elements that don’t match the CSS selector. If another collection is given instead of selector, return only elements not present in it. If a function is given, return only elements for which the function returns a falsy value. Inside the function, the this keyword refers to the current element.

#### offset

    offset()  ⇒ object

Get position of the element in the document. Returns an object with properties: top, left

#### offsetParent

    offsetParent()  ⇒ collection

Find the first ancestor element that is positioned, meaning its CSS position value is “relative”, “absolute” or “fixed”.

#### parent

    parent([selector])  ⇒ collection

Get immediate parents of each element in the collection. If CSS selector is given, filter results to include only ones matching the selector.

#### parents

    parents([selector])  ⇒ collection

Get all ancestors of each element in the collection. If CSS selector is given, filter results to include only ones matching the selector.

To get only immediate parents, use parent. To only get the first ancestor that matches the selector, use closest.

```javascript
$('h1').parents()   //=> [<div#container>, <body>, <html>]
```

#### position

    position()  ⇒ object

Get the position of the first element in the collection, relative to the offsetParent. This information is useful when absolutely positioning an element to appear aligned with another.

Returns an object with properties: top, left.

```javascript
var pos = element.position()

// position a tooltip relative to the element
$('#tooltip').css({
  position: 'absolute',
  top: pos.top - 30,
  left: pos.left
})
```

#### prepend

    prepend(content)  ⇒ self

Prepend content to the DOM inside each element in the collection. The content can be an HTML string, a DOM node or an array of nodes.

```javascript
$('ul').prepend('<li>first list item</li>')
```

#### prependTo

    prependTo(target)  ⇒ self

Prepend elements of the current collection inside each of the target elements. This is like prepend, only with reversed operands.

```javascript
$('<li>first list item</li>').prependTo('ul')
```

#### prev

    prev()  ⇒ collection
    prev(selector)  ⇒ collection

Get the previous sibling–optionally filtered by selector–of each element in the collection.

#### ready

    ready(function($){ ... })  ⇒ self

Attach an event handler for the “DOMContentLoaded” event that fires when the DOM on the page is ready. It’s recommended to use the $() function instead of this method.

#### remove

    remove()  ⇒ self

Remove elements in the current collection from their parent nodes, effectively detaching them from the DOM.

#### removeAttr

    removeAttr(name)  ⇒ self

Remove the specified attribute from all elements in the collection. 

#### removeClass

    removeClass([name])  ⇒ self

Remove the specified class name from all elements in the collection. 

#### replaceWith

    replaceWith(content)  ⇒ self

Replace each element in the collection–both its contents and the element itself–with the new content. Content can be of any type described in before.

#### show

    show()  ⇒ self

Restore the default value for the “display” property of each element in the array, effectively showing them if they were hidden with hide.

#### siblings

    siblings([selector])  ⇒ collection

Get all sibling nodes of each element in the collection. If CSS selector is specified, filter the results to contain only elements that match the selector.

#### size

    size()  ⇒ number

Get the number of elements in this collection.

#### slice

    slice(start, [end])  ⇒ array

Extract the subset of this array, starting at start index. If end is specified, extract up to but not including end index.

#### text

    text()  ⇒ string
    text(content)  ⇒ self

Get or set the text content of elements in the collection. When no content is given, returns the text contents of all the elements in the collection, if no element exists, null will be returned. When content is given, uses it to replace the text contents of each element in the collection. This is similar to html, with the exception it can’t be used for getting or setting HTML.

#### toggle

    toggle()  ⇒ self

Toggle between showing and hiding each of the elements.

```javascript
var input = $('input[type=text]')
input.on('change', function (e){
$('#too_long').toggle()
})
```

#### toggleClass

    toggleClass(names)  ⇒ self

Toggle given class name in each element in the collection. 

#### unwrap

    unwrap()  ⇒ self

Remove immediate parent nodes of each element in the collection and put their children in their place. Basically, this method removes one level of ancestry while keeping current elements in the DOM.

```javascript
$(document.body).append('<div id=wrapper><p>Content</p></div>')
$('#wrapper p').unwrap().parents()
```

#### val

val()  ⇒ string
val(value)  ⇒ self

Get or set the value of form controls. When no value is given, return the value of the first element.

#### width

    width()  ⇒ number
    width(value)  ⇒ self

Get the width of the first element in the collection; or set the width of all elements in the collection.

#### wrap

    wrap(structure)  ⇒ self

Wraps a structure around each element.

```javascript
// wrap each button in a separate span:
$('.buttons a').wrap('<span>')
```


#### wrapInner

    wrapInner(structure)  ⇒ self

Wraps a structure around all children.

```javascript
// wrap the contents of each navigation link in a span:
$('nav a').wrapInner('<span>')
```

#### on

    $(element).on ( eventName, eventHandler ) // => collection
Adds event listener to collection elements.

```javascript
var elem = $('#content')
// observe all clicks inside #content:
elem.on('click', function(e){ ... })
```
#### off
    $(element).off ( eventName ) // => collection

Removes event listener from collection elements.

#### animate
```
animate(properties, [duration, [easing, [function(){ ... }]]])  ⇒ self
animate(properties, { duration: msec, easing: type, complete: fn })  ⇒ self
```

Smoothly transition CSS properties of elements in the current collection.

   -  properties: object that holds CSS values to animate
   -  duration (default 400): duration in milliseconds
   - easing (default linear): specifies the type of animation easing to use, one of:
     - ease
     - linear
     - ease-in / ease-out
     - ease-in-out
     - [cubic-bezier(...)](https://cubic-bezier.com "cubic-bezier(...)")
   -  complete: callback function for when the animation finishes

Example: 
```javascript
$("#some_element").animate({
  opacity: 0.2, 
  left: '50px',
  width: '300px'
}, 500, 'ease-out')
```

### Contributing

If you found a problem, or have a feature request, please open an [issue](https://github.com/mainhy/weeKit/issues "issue") about it.

### License

Released under the MIT license
