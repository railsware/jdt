(function ($, undefined) {

// a handy traversal method, which is used in JDT Engine
$.fn.findClosestChildren = function (selector) {
  var children = $(this).find(selector);

  if (children.length <= 1) return children;

  var childLevels = [];
  for (var i = 0; i < children.length; i++) {
    var child = $(children[i]);
    childLevels.push( child.parentsUntil(this).length );
  }

  var minLevel = Math.min.apply(Math, childLevels);

  var result = [];
  for (var i = 0; i < children.length; i++) {
    if (childLevels[i] == minLevel) result.push(children[i]);
  }

  return $(result);
}

/*
    $('div.library p.stats').jdt({
        'book-count': '4',
        'currently-reading': 'The Plantation'
    });
*/
$.fn.jdt = function (data) {
  return JDT.process(this, data);
}



var DEBUG                = false;

var LIST_SELECTOR        = '.list';
var ITEM_SELECTOR        = '.item';
var DELIMITER_SELECTOR   = '.delimiter';
var VALUE_SELECTOR       = '.value';


function log() {
  if (!DEBUG) return;
  try { console.log(arguments); } catch (e) { alert(arguments); }
}


function process(data) {
  log('process', this, data);
  switch (true) {
    case $.isArray(data): processArray.call(this, data); break;
    case $.isPlainObject(data): processObject.call(this, data); break;
    default: processValue.call(this, data);
  }
}

function processArray(array) {
  log('array', this, array);
  var list = this;
  var itemTemplate = list;
  var delimiter;

  // we need all lists because unnecessary ones should be removed from DOM
  var lists = this.findClosestChildren(LIST_SELECTOR);
  if (lists.length) list = $(lists[0]);

  // also we need all item templates for the same reason
  var itemTemplates = list.findClosestChildren(ITEM_SELECTOR);
  if (itemTemplates.length) itemTemplate = $(itemTemplates[0]);
  else
    throw {
      message: "JDT Error: specified context doesn't contain an element with specified css class.",
      context: lists,
      klass: ITEM_SELECTOR
    }

  var delimiters = itemTemplate.siblings(DELIMITER_SELECTOR);
  if (delimiters.length) delimiter = $(delimiters[0]);

  delimiters.remove();
  lists.remove();
  itemTemplate.remove();
  itemTemplates.remove();

  for (var i = 0; i < array.length; i++) {
    var item = itemTemplate.clone();
    process.call(item, array[i]);
    list.append(item);
    if (delimiter && i >= 0 && i < (array.length - 1)) list.append(delimiter.clone());
  }
}

function processObject(obj) {
  log('object', this, obj);
  for (key in obj) {
    if (key[0] == '_') {
      processAttribute.call(this, key.slice(1), obj[key]);
    }
    else {
      var context = this.findClosestChildren('.' + key).first();
      if (context.length) process.call(context, obj[key]);
      else {
        if ($.isPlainObject(obj[key]))
          for (var k in obj[key]) {
            if (k[0] == '_') {
              processAttribute.call(this, k.slice(1), obj[key][k]);
            }
          }
      }
    }
  }
}

function processValue(value) {
  log('value', this, value);
  var valueObject = this.findClosestChildren(VALUE_SELECTOR).first();
  if (!valueObject.length) valueObject = this;

  // tags like <input .. have only value attribute, so use .val() on them
  // others have children, so use .text()
  if (valueObject[0].tagName == 'INPUT') $(valueObject).val(value);
  else $(valueObject).text(value);
}

function processAttribute(key, value) {
  log('attribute', this, key, value);
  if (key == 'html') { $(this).html(value); return; }
  if (key == 'class') { value += ' ' + $(this).attr(key); }
  $(this).attr(key, value);
}


function Engine () {
  /*
   * JDT.debug();     // turns debug mode on
   */
  this.debug = function () { DEBUG = true; }

  /*
   * JDT.process({ ... });
   * JDT.process('div.contents', { ... });
   */
  this.process = function () {
    if (arguments.length != 1 && arguments.length != 2) return;

    var context = 'body';
    var data;

    if (arguments.length == 1) {
      data = arguments[0];
    }
    else {
      context = arguments[0];
      data = arguments[1];
    }

    switch (true) {
      case $.isPlainObject(data): break;
      case $.isArray(data): break;
      case 'string' == typeof(data): try { data = $.parseJSON(data); } catch (e) { /* invalid json, so data is string */ }; break;
      default: throw "JDT Error: data passed to JDT.process is invalid!";
    }

    if (context.jquery && context.length) context = context[0];

    context = $(context);

    if (typeof(data) == 'string') return context.html(data);

    try {
      process.call(context, data);
    } catch (e) {
      if (!DEBUG) return;
      try { console.error(e); } catch (ee) { alert(e); }
    }

    return context;
  }
}

this.JDT = new Engine;

})(jQuery);
