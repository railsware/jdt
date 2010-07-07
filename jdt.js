var JDT = {
	jquery_defined : function() {
		return typeof jQuery != 'undefined';
	},

	process : function(data, context) {
		if (!this.jquery_defined()) { return; };
		if ( typeof context == 'undefined' ) { context = document.body; };
		this.process_map(data, context);
	},

	process_map: function (data, parent) {
		console.log('process_map', data, parent)
		var wrapper = this;
		jQuery.each(data, function(key, value){
			wrapper.process_element(value, wrapper.find_closest_child(parent, key));
		})	
	},


	process_array: function (array, parent) {
		var list_object = this.find_closest_child(parent, 'list');
		// list class is not defined. Use parent as list class
		if ( typeof list_object == 'undefined') { list_object = parent }

		var item_templates = this.find_closest_childen(list_object, 'item');
		if ( item_templates.length < 1 ) {
			console.log("ERROR: object", parent, "doesn't contains an element with css class 'item'")
			throw "sopping execution, check console.log"
		}
		var item_template = item_templates[0];
		var item_parent = item_template.parentNode;
		jQuery(item_templates).remove();

		var delimiter = jQuery(item_parent).find('>.delimiter');
		delimiter.remove();	

		var wrapper = this;
		jQuery.each(array, function(index, value){
			var item = jQuery(item_template).clone()[0];
			 wrapper.process_element(value, item);
			if (index > 0 ) { jQuery(item_parent).append( jQuery(delimiter).clone()); };
			jQuery(item_parent).append(item);
		})	

	},

	process_element: function (value, parent) {
		if ( typeof parent == 'undefined' ) { return; } // nothing to do. We don't have an element for the json
	
		if ( value instanceof Array) { this.process_array(value, parent); }
		else if ( value instanceof Object) { this.process_map(value, parent); }
		else { this.process_value(value, parent); }
	},


	process_value: function (value, parent) {
		var value_object = jQuery(parent).find('.value');
		var text_container = value_object.length>0 ? value_object[0] : parent;
		jQuery(text_container).text(value);
	},


	find_closest_childen: function (parent, key) {
		// if parent has the class itself, let's return it right away
		if ( jQuery(parent).hasClass(key)) { return [parent]; };

		var children = jQuery(parent).find('.'+key)

		// has one child ?
		if (children.length <= 1) { return children; };
	
		// let's find only closest depth children is to the parent
		var closest = [];
		var iterated_parent_nodes = jQuery(children); // clone
		while ( closest.length == 0 ) {

			// every iteration will go up 1 parentNode and search for children with parentNode == parent
			jQuery( iterated_parent_nodes ).each( function( index, previous_parent_node ) {
				var current_parent_node = previous_parent_node.parentNode;

				if ( current_parent_node == parent ) { closest[closest.length++] = children[index]; }
			
				// set next iteration of parent_node for element
				iterated_parent_nodes[index] = current_parent_node;
			} )

		}
	
		return closest;
	}, 
	
	find_closest_child: function (parent, key) {
		var children = this.find_closest_childen(parent, key);

		if ( children.length > 1 ) {
			console.log('ERROR: you have more than one element for parent: ', parent, ' with class: ', key, '. Consider refactoring your HTML or JSON structure');
			throw "stopping execution, check console.log"
		}

		return children[0];
	}
}
