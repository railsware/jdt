var JDT = {
	LIST_CLASS_MARKER 		: 'list', 
	ITEM_CLASS_MARKER 		: 'item', 
	DELIMITER_CLASS_MARKER 	: 'delimiter', 
	VALUE_CLASS_MARKER 		: 'value', 

	process : function(data, context) {
		if (!this.helper.dependencies_present()) { return; };
		
		if ( context === undefined ) { context = document.body; } // no context - use top
		else if ( typeof data == "string" ) { data = this.helper.parseJSON( data ) } // if it's a string - parse as JSON
		else if ( context.length != undefined ) { context = context[0]; }; // extract context as array to be the first element
		

		this.process_element(data, context);
	},

	process_element: function (value, parent) {
		if ( value instanceof Array) { this.process_array(value, parent); }
		else if ( value instanceof Object) { this.process_map(value, parent); }
		else { this.process_value(value, parent); };
	},

	process_map: function (data, parent) {
		this.helper.log('process_map', data, parent);
		for ( key in data ) {
  		var child = this.find_closest_child(parent, key);
  		if ( child !== undefined ) { 
  			this.process_element(data[key], child);
  		} else {
  			this.process_attribute(key, data[key], parent);
  		}
		}
	},

  process_attribute: function (key, value, object) {
    var wrapedObject = jQuery(object);
    if ( key == 'class' ) { value += ' ' + wrapedObject.attr(key) };
    // for class attribute in data, we append value to class, as we use class to markup the data placeholders
    wrapedObject.attr(key, value);
  },

	process_value: function (value, parent) {
		var value_object = this.find_closest_child(parent, this.VALUE_CLASS_MARKER);
		var value_container = (value_object === undefined) ? parent : value_object;

		// tags like <input .. have only value attribute, so use .val() on them
		// others have children, so use .text()
		var modification_function = value_container.tagName == 'INPUT' ? this.helper.val : this.helper.text;

		modification_function(value_container, value);
	},

	process_array: function (array, parent) {
		var list_object = this.find_closest_child(parent, this.LIST_CLASS_MARKER);
		// list class is not defined. Use parent as list class
		if ( list_object === undefined) { list_object = parent };

		var item_templates = this.find_closest_childen(list_object, this.ITEM_CLASS_MARKER);
		if ( item_templates.length < 1 ) {
			this.helper.error("ERROR: object", parent, "doesn't contains an element with css class '"+this.ITEM_CLASS_MARKER+"'");
		};
		var item_template = item_templates[0];
		var item_parent = item_template.parentNode;
		this.helper.remove(item_templates);

		var delimiter = this.helper.find(item_parent, '>.'+this.DELIMITER_CLASS_MARKER);
		delimiter.remove();	

		for ( var index=0; index < array.length; index ++) {
			var item = this.helper.clone(item_template);
			this.process_element(array[index], item);
			if (index > 0 ) { this.helper.append(item_parent,  this.helper.clone(delimiter)); };
			this.helper.append(item_parent, item);
		}
	},
	
	find_closest_childen: function (parent, key) {
		// if parent has the class itself, let's return it right away
		if ( this.helper.hasClass(parent, key)) { return [parent]; };

		var children = this.helper.find(parent, '.'+key);

		// has one child ?
		if (children.length <= 1) { return children; };
	
		// let's find only closest depth children is to the parent
		var closest = [];

		var iterated_parent_nodes = []; // storage
		var length = children.length;
		for ( var index=0; index < length; index++) {iterated_parent_nodes[index]=children[index];};
		
		while ( closest.length == 0 ) {

			// every iteration will go up 1 parentNode and search for children with parentNode == parent
			for ( var index=0; index < length; index++) {
				var current_parent_node = iterated_parent_nodes[index].parentNode;
				this.helper.log(' key', key, 'parent', parent, 'current_parent_node', current_parent_node);

				if ( current_parent_node == parent ) { closest[closest.length++] = children[index]; };
			
				// set next iteration of parent_node for element
				iterated_parent_nodes[index] = current_parent_node;
			}

		}

		return closest;
	}, 
	
	find_closest_child: function (parent, key) {
		var children = this.find_closest_childen(parent, key);

		if ( children.length > 1 ) {
			this.helper.error('you have more than one element for parent: ', parent, ' with class: ', key, '. Consider refactoring your HTML or JSON structure');
		}

		return children[0];
	},
	
	helper: {
		ERROR : true,
		DEBUG : false,
		
		dependencies_present: function() { return jQuery !== undefined; },
		parseJSON: jQuery.parseJSON,
		each     : function (object, arg) { return jQuery.each(object, arg) }, 
		remove   : function (object) { return jQuery(object).remove() },
		clone    : function (object) { return jQuery(object).clone()[0] },
		text     : function (object, arg) { return jQuery(object).text(arg) },
		val      : function (object, arg) { return jQuery(object).val(arg) },
		find     : function (object, arg) { return jQuery(object).find(arg) },
		append   : function (object, arg) { return jQuery(object).append(arg) },
		hasClass : function (object, arg) { return jQuery(object).hasClass(arg) },
		out      : function (args) { (typeof console == 'object' && typeof console.log == 'function') ? console.log.apply(this, args) : alert(arguments[0]) },
		log      : function () { if (this.DEBUG) { this.out(arguments); } },
		error    : function () { if (this.ERROR) { this.out(arguments); throw "stopping execution, check console.log" } }
	}

}
