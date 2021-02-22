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

The methods supported by WeeKit are, for the most part, identical to jQuery's. The few small differences with jQuery are explained below. If nothing is mentioned, you can assume jQuery's documentation applies.

|Attributes|Collection|CSS|Data|Dimensions|Effects|
|--- |--- |--- |--- |--- |--- |
|[addClass](http://api.jquery.com/addClass/)|[add](http://api.jquery.com/add/)|[css](http://api.jquery.com/css/)|[data](http://api.jquery.com/data/)|[height](http://api.jquery.com/height/)|[hide](http://api.jquery.com/hide/)|
|[attr](http://api.jquery.com/attr/)|[each](http://api.jquery.com/each/)|||[innerHeight](http://api.jquery.com/innerheight/)|[show](http://api.jquery.com/show/)|
|[hasClass](http://api.jquery.com/hasClass/)|[eq](http://api.jquery.com/eq/)|||[outerHeight](http://api.jquery.com/outerheight/)|[toggle](http://api.jquery.com/toggle/)|
|hasAttr|[filter](http://api.jquery.com/filter/)|||[width](http://api.jquery.com/width/)||
|[removeAttr](http://api.jquery.com/removeAttr/)|[first](http://api.jquery.com/first/)|||[innerWidth](http://api.jquery.com/innerwidth/)||
|[removeClass](http://api.jquery.com/removeClass/)|[get](http://api.jquery.com/get/)|||[outerWidth](http://api.jquery.com/outerwidth/)||
|[toggleClass](http://api.jquery.com/toggleClass/)|[index](http://api.jquery.com/index/)|||||
||[last](http://api.jquery.com/last/)|||||
||[map](http://api.jquery.com/map/)|||||
||[slice](http://api.jquery.com/slice/)||||||

|Events|Forms|Manipulation|Offset|Traversal|
|--- |--- |--- |--- |--- |
|[on](http://api.jquery.com/on/)|[val](http://api.jquery.com/val/)|[after](http://api.jquery.com/after/)|[position](http://api.jquery.com/position/)|[children](http://api.jquery.com/children/)|
|[off](http://api.jquery.com/off/)||[append](http://api.jquery.com/append/)||[closest](http://api.jquery.com/closest/)|
|[ready](http://api.jquery.com/ready/)||[appendTo](http://api.jquery.com/appendTo/)||[contents](http://api.jquery.com/contents/)|
|[trigger](http://api.jquery.com/trigger/)||[before](http://api.jquery.com/before/)||[find](http://api.jquery.com/find/)|
|||[clone](http://api.jquery.com/clone/)||[has](http://api.jquery.com/has/)|
|||[detach](http://api.jquery.com/detach/)||[is](http://api.jquery.com/is/)|
|||[empty](http://api.jquery.com/empty/)||[next](http://api.jquery.com/next/)|
|||[html](http://api.jquery.com/html/)||[nextAll](http://api.jquery.com/nextAll/)|
|||[insertAfter](http://api.jquery.com/insertAfter/)||[nextUntil](http://api.jquery.com/nextUntil/)|
|||[insertBefore](http://api.jquery.com/insertBefore/)||[not](http://api.jquery.com/not/)|
|||[prepend](http://api.jquery.com/prepend/)||[parent](http://api.jquery.com/parent/)|
|||[prependTo](http://api.jquery.com/prependTo/)||[parents](http://api.jquery.com/parents/)|
|||[remove](http://api.jquery.com/remove/)||[parentsUntil](http://api.jquery.com/parentsuntil/)|
|||[replaceAll](http://api.jquery.com/replaceAll/)||[prev](http://api.jquery.com/prev/)|
|||[replaceWith](http://api.jquery.com/replaceWith/)||[prevAll](http://api.jquery.com/prevAll/)|
|||[text](http://api.jquery.com/text/)||[prevUntil](http://api.jquery.com/prevUntil/)|
|||[unwrap](http://api.jquery.com/unwrap/)||[siblings](http://api.jquery.com/siblings/)|
|||[wrap](http://api.jquery.com/wrap/)|||
|||[wrapAll](http://api.jquery.com/wrapAll/)|||
|||[wrapInner](http://api.jquery.com/wrapInner/)|||


### Contributing

If you found a problem, or have a feature request, please open an [issue](https://github.com/mainhy/weeKit/issues "issue") about it.

### License

Released under the MIT license
