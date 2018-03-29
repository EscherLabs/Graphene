//		BerryJS 0.10.5
//		(c) 2011-2016 Adam Smallcomb
//		Licensed under the MIT license.
//		For all details and documentation:
//		https://github.com/Cloverstone/Berry
// 
// 

Berry = function(options, target) {
	/**
	 * Destroys the global reference to this form instance, empties the fieldsets that 
	 * were used and calls the destroy function on each field.
	 */
	this.destroy = function() {
		this.trigger('destroy');

		//Trigger the destroy methods for each field
		this.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
		//Clean up affected containers
		this.$el.empty();
		for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

		//Dispatch the destroy method of the renderer we used
		if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

		//Remove the global reference to our form
		delete Berry.instances[this.options.name];

		this.trigger('destroyed');
	};

	/**
	 * Gets the values for all of the fields and structures them according to the 
	 * configuration of the option 'flatten' and 'toArray'. If field name is requested
	 * then just the value of that field is returned.
	 *
	 * @param {string} s Name of the field to return the value of.
	 * @param {booleon} validate Indicates whether or not to validate
	 * the values befor returning the results.
	 */
	this.toJSON = function(s, validate) {
		// validate if desired this.valid will hold the result

		// if a search string return the valu of the field with that name
		if(typeof s === 'string' && s.length > 0){
			this.attributes = this.find(s).getValue();
		} else {
			this.attributes = processMultiples.call(this, this.parsefields(this.options));
		}
		if(validate || (typeof valid == 'undefined' && this.options.validate) || !this.valid) { this.validate(true); }
		return this.attributes;
	};


	var cloneMultiples = function(attributes, fields){
		this.each(function(attributes) {
			if(this.multiple) {

				var min = this.multiple.min || 1;
				if(typeof attributes !== 'undefined'){
					var items = Berry.search(attributes, this.getPath());
					var attcount = 0;
					if(items !== null){
						attcount = items.length;
					}
					if(min < attcount){min = attcount;}
				}
				var status = true;
				var root = this.fields;
				if(this.parent){root = this.parent.children;}
				if(root[this.name]){
					while(this.owner.find(this.getPath()).length < min && status){
						status = this.clone();
					}
				}
			}
		}, [attributes], fields);
		this.each(function(attributes) {
			if(this.multiple) {

				var min = this.multiple.min || 1;
				if(typeof attributes !== 'undefined'){
					var items = Berry.search(attributes, this.getPath());
					var attcount = 0;
					if(items !== null){
						attcount = items.length;
					}
					if(min < attcount){min = attcount;}
				}
				var status = true;
				var root = this.fields;
				if(this.parent){root = this.parent.children;}
				if(root[this.name]){
					while(this.owner.find(this.getPath()).length < min && status){
						status = this.clone();
					}
				}
			}
		}, [attributes], fields);
		return attributes;
	};




	/**
	 * Gets the values for all of the fields and structures them according to the 
	 * configuration of the option 'flatten' and 'toArray'
	 *
	 * @param {object} attributes The values for the fields to be populated
	 * @param {?array} fields These are the fields that the attributes will be applied to
	 * the values befor returning the results.
	 */
	this.populate = function(attributes, fields) {
		this.each(function(attributes) {
			if(!this.isContainer) {
				var temp = Berry.search(attributes, this.getPath());
				//if(typeof temp !== 'undefined' && typeof temp !== 'object') {
				// if(typeof temp !== 'object') { 

					this.setValue(temp);
					this.trigger('change');
					this.toJSON();
				// }
			}
		}, [attributes], fields);
	};

	
	/**
	 * 
	 *
	 * @param {function} toCall 
	 * @param {?array} args 
	 * @param {?array} fields 
	 */
	this.each = function(toCall, args, fields) {
		fields = (fields || this.fields);
		var c = true;
		for(var i in fields) {
			if(c !== false){
				var field = fields[i];
				if(field.item && field.isActive()) {
					c = toCall.apply(field, args);
				} else if(!$.isEmptyObject(field.instances)) {
					c = this.each(toCall, args, field.instances);
				}
				if(!$.isEmptyObject(field.children)) {
					c = this.each(toCall, args, field.children);
				}
			} else { break; }
		}
		if(c && (typeof args !== 'undefined')) {
			return args;
		} else {
			return c;
		}
	};

	/**
	 * 
	 *
	 * @param {string} s  This is the path or name of the field you are looking for
	 * @param {?array} fields These are the fields to be searched
	 */
	this.find = function(s, fields){
		var items = [];
		this.each(function(s, items) {
			if(this.getPath() == s || this.name == s){
				items.push(this);
			}
		}, [s, items], fields);
		if(items.length == 0){
			return false;
		}
		if(items.length > 1 || items[0].multiple){
			return items;
		}
		return items[0];
	};

	/**
	 * 
	 *
	 * @param {string} id This is the id you are looking for
	 * @param {?array} fields These are the fields to be searched
	 */
	this.findByID = function(id, fields){
		var items = [];
		this.each(function(id, items) {
				if(this.id == id){
					items.push(this);
				}
		}, [id, items], fields);
		return items[0];
	};

	/**
	 * Iterates over an array of fields and normalizes the field before passing it on to be 
	 * processed
	 *
	 * @param {?array} fields These are the fields we are going to process
	 * @param {element} target Target is the default element where new fields should be added
	 * @param {Berry.field} parent This is the parent field
	 */
	this.processfields = function(fields, target, parent) {
		for(var i in fields) {
			var state = this.createField(Berry.normalizeItem(fields[i], i, this.options.default), target, parent);
		}
	};



	/**
	 * 
	 *
	 * @param {object} item This is the field descriptor to be processed
	 * @param {element} target Target is the default element where new fields should be added
	 * @param {Berry.field} parent This is the parent field
	 * @param {string} insert Location relative to target to place the new field
	 */
	this.createField = function(item, target, parent, insert) {
		if(target[0] !== undefined){target = target[0];}
		var field = addField.call(this, item, parent, target, insert);
		// this.initializing[field.id] = true;
		if(typeof field.fieldset === 'undefined') { field.fieldset = target; }

		if(insert == 'before') {
			$(target).before(field.render());
		} else if(insert == 'after') {
			$(target).after(field.render());
		} else {
			if(field.type !== 'fieldset' ||  field.isChild() || !this.sectionsEnabled) {
				var cRow;
				if(typeof $(field.fieldset).children('.row').last().attr('id') !== 'undefined') {
					cRow = rows[$(field.fieldset).children('.row').last().attr('id')];		
				}
				if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > this.options.columns){
					var temp = Berry.getUID();
					cRow = {};
					cRow.used = 0;
					cRow.ref = $(Berry.render('berry_row', {id: temp}));
					rows[temp] = cRow;
					$(field.fieldset).append(cRow.ref);
				}
				cRow.used += parseInt(field.columns, 10);
				cRow.used += parseInt(field.offset, 10);
				cRow.ref.append( $('<div/>').addClass('col-md-' + field.columns).addClass('col-md-offset-' + field.offset).append(field.render()) );
			}else{
				$(field.fieldset).append(field.render() );
			}
		}
		field.initialize();
		return field;
	};

	var addField = function(item , parent, target, insert) {
		var field = new Berry.types[item.type](item, this);
		field.parent = parent;

		var root = this.fields;
		if(parent !== null && parent !== undefined) {
			root = parent.children;
		}

		var exists = (root[field.name] !== undefined);

		if(field.isContainer) {
			if(!exists) {
				root[field.name] = { isContainer: true , multiple: field.multiple , hasChildren: !$.isEmptyObject(item.fields) /*, toArray: (field.item.toArray || field.owner.options.flatten)*/, instances:[] };
			}
			var insertAt = root[field.name].instances.length;
			var targetId = $(target).attr('id');
			for(var j in root[field.name].instances){
				if(root[field.name].instances[j].id == targetId){
					insertAt = parseInt(j, 10) + 1;
					break;
				}
			}
			root[field.name].instances.splice(insertAt, 0, field);

			var index = 0;
			for(var k in root[field.name].instances){
				root[field.name].instances[k].instance_id = index++;
			}
		}else{
			if(exists || field.multiple){
				if(root[field.name].isContainer){
					var temp = [];
					temp.push(root[field.name]);
					temp = root[field.name];
					root[field.name] = {multiple: field.multiple, hasChildren:!$.isEmptyObject(item.fields), instances:[]};
					root[field.name].instances.push(temp);
				}else if(root[field.name] instanceof Berry.field){
					var temp = [];
					temp.push(root[field.name]);
					temp = root[field.name];
					root[field.name] = {instances: []};
					root[field.name].instances.push(temp);
				}
				root[field.name].instances.push(field);
			} else {
				root[field.name] = field;
			}
		}
		return field;
	};

	this.parsefields = function(options) {
		var newAttributes = {};//$.extend(true, {}, attributes);
		// var newAttributes = JSON.parse(JSON.stringify(attributes))
		this.each(function(newAttributes, options) {
			if(this.isParsable) {
				var root;
				if(this.isChild() && (!options.flatten || typeof this.parent.multiple !== 'undefined')/*|| (this.instance_id !== null)*/){
					root = Berry.search(newAttributes, this.parent.getPath());
				} else {
				//if(typeof root === 'undefined'){
					root = newAttributes;
				}
				if(!this.isContainer) {
					var value = this.getValue();
					if(value === null){
						value = '';
					}
					if($.isArray(root)){
						if(!root[this.parent.instance_id]) { root[this.parent.instance_id] = {}; }
						root[this.parent.instance_id][this.name] = value;
					}else{
						root[this.name] = value;
					}
				}else{
					if(this.multiple){
						// root[this.name] = root[this.name]||[];

						if(this.isChild() && this.parent.multiple && $.isArray(root) ){
							if(typeof root[this.parent.instance_id] == 'undefined'){root[this.parent.instance_id] = {}}
							root[this.parent.instance_id][this.name] = root[this.parent.instance_id][this.name]||[];
						}else{
							// root[this.name] = {};
							root[this.name] = root[this.name]||[];

						}
					}else if(!options.flatten){
						if(this.isChild() && this.parent.multiple && $.isArray(root) ){
							if(typeof root[this.parent.instance_id] == 'undefined'){root[this.parent.instance_id] = {}}
							root[this.parent.instance_id][this.name] = {};
						}else{
							root[this.name] = {};
						}
					}
				}

			}
		}, [newAttributes, options]);
		return newAttributes;
	};


	this.setActions = function(actions) {
		if(!this.options.actionTarget) {
			this.options.actionTarget = $('<div class="berry-actions" style="overflow:hidden;padding-bottom:10px"></div>');
			this.target.append(this.options.actionTarget);
		}
		this.options.actionTarget.empty();

		if(actions) {
			actions = containsKey(Berry.btn, actions);
			for(var action in actions) {
				actions[action].form = this.options.name;
				var temp = $(Berry.render('berry__action', actions[action]));
					if(typeof actions[action].click === 'function'){
						temp.click($.proxy(actions[action].click, this));
					}
				this.options.actionTarget.append(temp);
			}
		}
	};

	var inflate = function(atts) {
		var altered = {};
		this.each(function(atts, altered) {

			var val;

			if(this.isContainer){
				if(this.multiple){
					val = atts[this.name] || [];
				}else{
					val = {};
				}
			}else{
					val = atts[this.name];
			}

			if(this.isChild()){
				if(!this.parent.multiple){
					Berry.search(altered, this.parent.getPath())[this.name] = val;
				}
			} else {
				altered[this.name] = val;
			}

		}, [atts, altered]);

		return altered;
	};



	var processMultiples = function(attributes) {
		var altered = $.extend(true, {}, attributes);
		this.each(function(attributes, altered) {
			if(this.multiple && this.toArray){
				var root = attributes;
				var temp = Berry.search(root, this.getPath());
				if(this.isChild()){
					root = Berry.search(altered, this.parent.getPath());
				}
				root[this.name] = {};
				for(var i in this.children) {
					root[this.name][i] = $.pluck(temp,i);
				}
			}
		}, [attributes, altered]);
		return altered;
	};

	var importArrays = function(attributes) {
		var altered = $.extend(true, {}, attributes);
		this.each(function(attributes, altered) {
			if(this.isContainer && this.multiple && this.toArray){
				var target = Berry.search(altered, this.parent.getPath());
				var localAtts = target[this.name];
				var newAtts = [];
				var i = 0;
				while(i >= 0 && i< 20){
					for(var j in localAtts){
						if(localAtts[j].length > i){
							newAtts[i] = newAtts[i] || {};
							newAtts[i][j] = localAtts[j][i];
						}else{i = -2;break;}
					}
					i++;
				}
				target[this.name] = newAtts;
			}
		}, [attributes, altered]);

		return altered;
	};

	this.load = function(options){
		if(typeof options.attributes !== 'undefined') {
			if(typeof options.attributes === 'string') {
				$.ajax({
					url: this.options.attributes, 
					method: 'GET',
					success: $.proxy(function(data){
						this.options.attributes = data; 
						options = this.options;
						if(options.flatten) {
							options.attributes = inflate.call(this, options.attributes);
						}
						this.populate(cloneMultiples.call(this, importArrays.call(this, options.attributes)));
					}, this)
				});
			}else{
				if(options.flatten) {
					options.attributes = inflate.call(this, options.attributes);
				}
				this.populate(cloneMultiples.call(this, importArrays.call(this, options.attributes)));
			}
		}else{
			cloneMultiples.call(this);
		}

		//Sets the initial state of conditionals
		this.each(function() {
			if(!this.isContainer){
				this.trigger('change');
			}
		});
		if(options.autoFocus) {
			this.each(function() {
				if(!this.isContainer){
					this.focus();
					return false;
				}
			});
		}

			this.trigger('loaded');
	};


	this.$el = target;

	// Track sections for tabs, pages, wizard etc.
	this.section_count = 0;
	this.sectionsEnabled = false;
	this.sections = [];
	this.sectionList = [];
	// this.initializing = {};

	// flags for progress
	// this.fieldsinitialized = false;
	this.initialized = false;

	// Initialize objects/arrays
	var rows = {};
	this.fieldsets = [];
	this.fields = {};

	this.options = $.extend({name: Berry.getUID()}, Berry.options, options);
	this.events = $.extend(true, {}, Berry.prototype.events);


	this.trigger('initialize');

	// Give renderers and other plugins a chance to default this
	if(typeof this.$el === 'undefined') { this.$el = $('<div/>'); }

	// Now the we have an element to work with instantiate the renderer
	this.renderer = new Berry.renderers[this.options.renderer](this);

	// Render and get the target returned from the renderer
	this.target = this.renderer.render();

	// Create the legend if not disabled
	if(this.options.legend && this.options.legendTarget) { this.options.legendTarget.append(this.options.legend); }

	// Process the fields we were given and apply them to the target
	// we got from the renderer
	this.processfields(this.options.fields, this.target, null);

	this.setActions(this.options.actions);


	if(typeof this.renderer.initialize === 'function') {
		this.renderer.initialize();
	}
	this.$el.find('form').on('submit', $.proxy(function(){this.trigger('save')}, this) );

	if(typeof Berry.instances[this.options.name] !== 'undefined') {
		Berry.instances[this.options.name].on('destroyed', $.proxy(function(){
			Berry.instances[this.options.name] = this;
			this.initialized = true;
			this.load(this.options);
			this.trigger('initialized');
		},this));
		Berry.instances[this.options.name].destroy();
	}else{
		Berry.instances[this.options.name] = this;
		this.initialized = true;
		this.load(this.options);
		this.trigger('initialized');
	}
};

	/**
	 * Takes the item descriptor passed in and makes sure the required attributes
	 * are set and if they are not tries to apply sensible defaults
	 *
	 * @param {object} item This is the raw field descriptor to be normalized
	 * @param {string or int} i The key index of the item
	 */
	Berry.normalizeItem = function(item, i, defaultItem){
		if(typeof item === 'string') {
			item = { type : item, label : i };
		}
		if($.isArray(item)) {
			item = { options : item, label : i };
		}
		item = $.extend({}, defaultItem, item);

		//if no name given and a name is needed, check for a given id else use the key
		if((typeof item.name === 'undefined' || item.name.length === 0)  && !item.isContainer){
			if(typeof item.label !== 'undefined' && !isNaN(parseFloat(i))){
				item.name = item.label.toLowerCase().split(' ').join('_');
			}else if(typeof item.id !== 'undefined') {
				item.name = item.id;
			} else {
				item.name = i.toLowerCase().split(' ').join('_');
			}
		}
		if(typeof item.label === 'undefined' && item.label !== false) {
			item.label = i;
		}

		// Sync the validation with the 'required' shorthand
		if(item.required){
			$.extend(item, {validate: {required: true}});
		} else if(typeof item.validate !== 'undefined'){
			item.required = item.validate.required;
		}

		// Set a sensible type default if type is not defined or not found
		if(typeof Berry.types[item.type] === 'undefined') {
			// if(typeof item.choices === 'undefined' && typeof item.options === 'undefined'){

			// }else{
				var length = 0;
				if(typeof item.choices !== 'undefined'){length = item.choices.length;}
				if(typeof item.options !== 'undefined'){length = item.options.length;}

				// if(item.options)
				switch(length){
					case 0:
						if(typeof item.fields === 'undefined'){
							item.type = 'text';
						}else{
							item.type = 'fieldset';
						}						
						break;
					case 2:
						item.falsestate = item.options[1].toLowerCase().split(' ').join('_');
					case 1:
						item.type = 'checkbox';
						item.truestate = item.options[0].toLowerCase().split(' ').join('_');
						break;
					case 3:
					case 4:
						item.type = 'radio';
						break;
					default:
						item.type = 'select';
				}
				// if(item.options.length ==  1){
				// 	item.type = 'checkbox';
				// 	item.truestate = item.options[0].toLowerCase().split(' ').join('_');
				// }else 
				// if(item.options.length <= 4){
				// 	item.type = 'radio';
				// }else{
				// 	item.type = 'select';
				// }
			}
		// }
		return item;
		
	};
Berry.field = function(item, owner) {
	this.children = {};
	this.owner = owner;
	this.hidden = false;
	this.item = $.extend(true, {}, this.defaults, item);

	this.owner.trigger('initializeField', {field: this});

	$.extend(this, this.owner.options, this.item);
	if(this.item.value !== 0){
		if(typeof item.value === 'function') {
			this.valueFunc = item.value;
			this.liveValue = function() {
				return this.valueFunc.call(this.owner.toJSON());
			};
			item.value = this.item.value = this.liveValue();
			this.owner.on('change', $.proxy(function(){
				this.set(this.liveValue());
			},this));
		} else if(typeof this.item.value === 'string' && this.item.value.indexOf('=') === 0 && typeof math !== 'undefined') {
			this.formula = this.item.value.substr(1);
			this.enabled = false;
			this.liveValue = function() {
				try {
					var temp = math.eval(this.formula, this.owner.toJSON());
					if($.isNumeric(temp)){
						return temp.toFixed((this.item.precision || 0));
					}
					return temp;
				}catch(e){
					 return this.formula;
				}
			};
			item.value = this.item.value = this.liveValue();
			this.owner.on('change', $.proxy(function() {
				this.set(this.liveValue());
			}, this));
		} else {
			this.value = (item.value || this.value || item.default || '');
		}
	} else {
		this.value = 0;
	}
	this.lastSaved = this.liveValue();
	this.id = (item.id || Berry.getUID());
	this.self = undefined;
	this.fieldset = undefined;

	if(typeof this.item.fieldset !== 'object'){
		if(this.item.fieldset !== undefined && $('.' + this.item.fieldset).length > 0) {
			this.fieldset = $('.' + this.item.fieldset)[0];
			this.owner.fieldsets.push(this.fieldset);
		}else{
			if(this.item.fieldset !== undefined && $('[name=' + this.item.fieldset + ']').length > 0) {
				this.fieldset = $('[name=' + this.item.fieldset + ']')[0];
				this.owner.fieldsets.push(this.fieldset);
			}
		}
	}else{
		if(this.item.fieldset.length){
			this.fieldset = this.item.fieldset;
		}
	}

	this.val = function(value) {
		if(typeof value !== 'undefined') {
			this.set(value);
		}
		return this.getValue();
	};
	this.columns = (this.columns || this.owner.options.columns);
	if(this.columns > this.owner.options.columns) { this.columns = this.owner.options.columns; }
};

$.extend(Berry.field.prototype, {
	type: 'text',
	offset: 0,
	version: '1.0',
	isContainer: false,
	isParsable: true,
	isVisible: true,
	isEnabled: true,
	instance_id: null,
	path: '',
	defaults: {},
	parent: null,
	getPath: function(force) {
		var path = '';
		if(this.parent !== null && this.parent !== undefined) {
			path = this.parent.getPath(force) + '.';
			if(this.parent.multiple || force){
				path += this.parent.instance_id + '.';
			}
		}
		return path + this.name;
	},
	isActive: function() {
		return this.parent === null || this.parent.isEnabled !== false;
	},
	isChild: function(){
		return  this.parent !== null;
	},
	set: function(value){
		if(this.value != value) {
			//this.value = value;
			this.setValue(value);
			this.trigger('change');
		}
	},
	revert: function(){
		this.item.value = this.lastSaved;
		this.setValue(this.lastSaved);
		return this;
	},
	hasChildren: function() {return !$.isEmptyObject(this.children);},
	create: function() {return Berry.render('berry_' + (this.elType || this.type), this);},
	render: function() {
		if(typeof this.self === 'undefined') {
			this.self = $(this.create()).attr('data-Berry', this.owner.options.name);
		} else {
			this.self.html($(this.create()).html());
		}
		this.display = this.getDisplay();
		return this.self;
	},
	getValue: function() { return this.$el.val(); },
	toJSON: function() {
		this.value = this.getValue();
		this.lastSaved = this.value;
		this.display = this.getDisplay();
		return this.lastSaved;
	},
	liveValue: function() {
		return this.value;
	},
	setup: function() {
		this.$el = this.self.find('input');
		this.$el.off();
		if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
		this.$el.on('input', $.proxy(function() {
			this.trigger('change');
		}, this));

		if(this.item.mask && $.fn.mask) {
			this.$el.mask(this.item.mask);
		}
	},
	initialize: function() {
		this.setup();
		if(typeof this.show !== 'undefined') {
			this.isVisible = (typeof this.show == 'undefined' || $.isEmptyObject(this.show));
		    this.self.toggle(this.isVisible);
		  //  this.update({}, true);

			this.showConditions = Berry.processConditions.call(this, this.show,
				function(bool, token) {
					if(typeof bool == 'boolean') {
					   // var temp = this.isVisible;
						this.showConditions[token] = bool;
						// this.self.show();
						this.isVisible = true;
						for(var c in this.showConditions) {
							if(!this.showConditions[c]) {
								this.isVisible = false;
								// this.self.hide();
								break;
							}
						}
						this.self.toggle(this.isVisible);
					}
				}
			);

			if(typeof this.showConditions === 'boolean') {
				this.self.toggle(this.showConditions);
				this.isVisible = this.showConditions;
				this.update({}, true);
			}
		}
		if(typeof this.enabled !== 'undefined') {
			this.enabledConditions = Berry.processConditions.call(this, this.enabled,
				function(bool, token) {
					if(typeof bool == 'boolean') {
						this.enabledConditions[token] = bool;
						this.isEnabled = true;
						this.enable();
						for(var c in this.enabledConditions) {
							if(!this.enabledConditions[c]) {
								this.isEnabled = false;
								this.disable();
								break;
							}
						}
					}
				}
			);
			if(typeof this.enabledConditions == 'boolean'){
				this.isEnabled = this.enabledConditions;
				this.update({}, true);
			}
		}
		if(typeof this.parsable !== 'undefined') {
			this.parsableConditions = Berry.processConditions.call(this, this.parsable,
				function(bool, token) {
					if(typeof bool == 'boolean') {
					    var temp = this.isParsable;
						this.parsableConditions[token] = bool;
						this.isParsable = true;
						for(var c in this.parsableConditions) {
							if(!this.parsableConditions[c]) {
								this.isParsable = false;
								break;
							}
						}
						if(temp !== this.isParsable){
						    this.trigger('change');
						}
					}
				}
			);
			if(typeof this.parsableConditions == 'boolean'){this.isParsable = this.parsableConditions;}
		}
		
		this.owner.trigger('initializedField', {field: this});
	},
	on: function(topic, func) {
		this.owner.on(topic + ':' + this.name, func);
	},
	delay: function(topic, func) {
		this.owner.delay(topic + ':' + this.name, func);
	},
	trigger: function(topic) {
		this.value = this.getValue();
		this.owner.trigger(topic + ':' + this.name, {
			// type: this.type,
			// name: this.name,
			id: this.id,
			value: this.value,
			// path: this.getPath()
		});
		//this.owner.trigger(topic);
	},
	setValue: function(value) {
		if(typeof value !== 'object'){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			return this.$el.val(value);
		}
		return this.value;
	},
	update: function(item, silent) {
		if(typeof item === 'object') {
			$.extend(this.item, item);
		}
		$.extend(this, this.item);
		this.setValue(this.value);
		this.render();
		this.setup();
		if(!silent) {
			this.trigger('change');
		}
	},
	blur: function() {
		this.$el.blur();
	},
	focus: function() {
		this.$el.focus().val('').val(this.value);
	},
	disable: function() {
		this.$el.prop('disabled', true);
	},
	enable: function() {
		this.$el.prop('disabled', false);
	},
	satisfied: function(){
		return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '');
	},
	displayAs: function() {
		return this.lastSaved;
	},
	getDisplay: function() {
		if(this.displayAs !== undefined) {
			if(this.item.template !== undefined) {
				this.display = this.displayAs();
				return Berry.render(this.item.template, this);
			} else {
				return this.displayAs() || this.item.default || this.item.value  || 'Empty';
			}
		}else{
			if(this.item.template !== undefined) {
				return Berry.render(this.item.template, this);
			} else {
				return this.lastSaved || this.item.default || this.item.value  ||  'Empty';
			}
		}
	},
	destroy: function() {
		if(this.$el){
			this.$el.off();
		}
 },

});

Berry.field.extend = function(protoProps) {
	var parent = this;
	var child = function() { return parent.apply(this, arguments); };
	var Surrogate = function() { this.constructor = child; };
	Surrogate.prototype = parent.prototype;
	child.prototype = new Surrogate;
	if (protoProps) $.extend(child.prototype, protoProps);
	return child;
};
/*********************************/
/*             Events            */
/*********************************/
Berry.prototype.events = {initialize:[]};

Berry.prototype.addSub = function(topic, func){
	if (!this.events[topic]) {
		this.events[topic] = [];
	}
	var token = Berry.getUID();
	this.events[topic].push({
		token: token,
		func: func
	});
	return token;
};
Berry.prototype.on = function(topic, func, context, execute) {
	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			if(typeof context !== 'undefined'){
				this.addSub(list[t], $.proxy(func, context));
			}else{
				this.addSub(list[t], func);
			}
		}
	}else{
		if(typeof context !== 'undefined'){
			this.lastToken = this.addSub(topic, $.proxy(func, context));
		}else{
			this.lastToken = this.addSub(topic, func);
		}
	}
	if(execute){
		func.call(this, null, topic);
	}
	return this;
};

//add code to handle parameters and cancelation of events for objects/forms that are deleted
Berry.prototype.delay = function(topic, func, context, execute, delay) {
	var temp = function(args, topic, token){
		clearTimeout(this.events[token].timer);
		this.events[token].timer = setTimeout($.proxy(function(){
			this.events[token].func.call(this);
		}, context || this) , (delay || 250));
	};

	var eventSplitter = /\s+/;
	if(eventSplitter.test(topic)){
		var list = topic.split(eventSplitter);
		for (var t in list) {
			this.lastToken = this.addSub(list[t], temp);
			this.events[this.lastToken] = {func: func, timer: null};
		}
	}else{
		this.lastToken = this.addSub(topic, temp);
		this.events[this.lastToken] = {func: func, timer: null};
	}
	if(execute){
		func.call(context || this, null, topic);
	}
	return this;
};
Berry.prototype.off = function(token) {
	for (var m in this.events) {
		if (this.events[m]) {
			for (var i = 0, j = this.events[m].length; i < j; i++) {
				if (this.events[m][i].token === token) {
					this.events[m].splice(i, 1);
					return token;
				}
			}
		}
	}
	return this;
};
Berry.prototype.trigger = function(topic, args) {
	if (this.events[topic]) {
		var t = this.events[topic],
			len = t ? t.length : 0;
		while (len--) {
			t[len].func.call(this, args, topic, t[len].token);
		}
	}
	//this.processTopic(topic, args);
	newtopic = topic.split(':')[0];	
	if(newtopic !== topic){
		topic = newtopic;
		if (this.events[topic]) {
			var t = this.events[topic],
				len = t ? t.length : 0;
			while (len--) {
				t[len].func.call(this, args, topic, t[len].token);
			}
		}
	}

	return this;
};
/*********************************/
/*         End  Events           */
/*********************************/Berries = Berry.instances = {};
Berry.counter = 0;
Berry.types = {};
Berry.options = {
	errorClass: 'has-error',
	errorTextClass: 'font-xs.text-danger',
	inline: false,
	modifiers: '',
	renderer: 'base',
	flatten: true,
	columns: 12,
	autoDestroy: true,
	autoFocus: true,
	validate: false,
	actions: ['cancel', 'save']
};

Berry.register = function(elem) {
	if(elem.extends && typeof Berry.types[elem.extends] !== 'undefined'){
		Berry.types[elem.type] = Berry.types[elem.extends].extend(elem);
	}else{
		Berry.types[elem.type] = Berry.field.extend(elem);
	}
}

/**
 * 
 *
 * @param {array} o The array of fields to be searched
 * @param {string} s The path 
 * @internal
 */
Berry.search = function(o, s) {
		s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
		var a = s.split('.');
		while (a.length) {
			var n = a.shift();
			if (typeof o !== 'undefined' && o !== null && typeof o !== 'string' && n in o) {
				o = o[n];
			} 
		}
		return o;
	}
Berry.collection = function(Berry){
	var collections = {};
	this.events = {initialize: []};
	this.addSub = Berry.prototype.addSub;
	this.on = Berry.prototype.on;
	this.off = Berry.prototype.off;
	this.trigger = Berry.prototype.trigger;
	return {
		add: function(name, data){
			collections[name] = data;
		},
		get: function(name){
			return collections[name];
		},
		update: function(name, data){
			collections[name] = data;
			this.trigger(name);
		}.bind(this),
		on: this.on.bind(this),
		off: this.off.bind(this)
	}
}(Berry)


Berry.processOpts = function(item, object) {
 
	// If max is set on the item, assume a number set is desired. 
	// min defaults to 0 and the step defaults to 1.
	if(typeof item.max !== 'undefined') {
		item.min = (item.min || 0);
		item.choices = (item.choices || []);
		if(item.step != 0){
			if(item.min <= item.max) {
				for (var i = item.min; i <= item.max; i=i+(item.step || 1) ) { 
					item.choices.push(i.toString());
				}
			}
		}

	}

	// If a function is defined for choices use that.
	if(typeof item.choices === 'function') {
		item.options = item.choices.call(this, item);
	}

	if(typeof item.choices !== 'undefined' && item.choices.length > 0) {
		if(typeof item.choices === 'string' ) {

			item.optionPath = item.choices;
			// if(typeof Berry.collections[item.choices] === 'undefined') {
			if(typeof Berry.collection.get(item.optionPath) === 'undefined'){// && Berry.collection.get(item.choices) !== 'pending') {
				// Berry.collections[item.choices] = [];
				Berry.collection.add(item.optionPath, []);
				//var getAttributes = 

				(function(object) {
					$.ajax({
						url: item.optionPath,
						type: 'get',
						success: function(data) {
							Berry.collection.on(item.optionPath,function(item){
								item.waiting = false;
								this.update({choices: Berry.collection.get(item.optionPath),options: Berry.collection.get(item.optionPath)});//,value: Berry.search(object.owner.options.attributes, object.getPath())});

								if(this.parent && this.parent.multiple){
									if(typeof this.owner !== 'undefined') {
										this.update({value: Berry.search(this.owner.options.attributes, this.getPath())});
									}
								}
							}.bind(object, item))
							Berry.collection.update(item.optionPath, data);
						}
					});
				}(object))


				//getAttributes(object);
				item.waiting = true;
				item.options = [];
				return item;
			} else {
				Berry.collection.on(item.optionPath,function(item, path){
					this.item.waiting = false;					
					this.update({choices: Berry.collection.get(path),options: Berry.collection.get(path)});

					if(this.parent && this.parent.multiple){
						if(typeof this.owner !== 'undefined') {
							this.update({value: Berry.search(this.owner.options.attributes, this.getPath())});
						}
					}
				}.bind(object))

				if(Berry.collection.get(item.optionPath).length){
					item.choices = Berry.collection.get(item.optionPath);
				}
			}
		}

		if(typeof item.choices === 'object' && !$.isArray(item.choices)) {
			// item.choices = item.choices.toJSON();

			for(var c in conditions) {
				Berry.conditions[c].call(this, this.owner, conditions[c], function(bool, token) {
					// conditions[c].callBack
				});
			}
		}

		// Insert the default value at the beginning 
		// if(typeof item.default !== 'undefined') {
		// 	item.choices.unshift(item.default);
		// }
		if(typeof item.choices === 'object'){
			item.options = $.map(item.choices, function(value, index) {
				return [value];
			});
		}
	}
	// else{
	// 			// Insert the default value at the beginning 
	// 	if(typeof item.default !== 'undefined' && typeof item.options !== 'undefined') {
	// 		item.options.unshift(item.default);
	// 	}
	// }
	if(typeof item.default !== 'undefined' && typeof item.options !== 'undefined' && item.options[0] !== item.default) {
		item.options.unshift(item.default);
	}

	if(typeof item.options !== 'undefined' && item.options.length > 0) {
		var set = false;
		for ( var o in item.options ) {
			var cOpt = item.options[o];

			if(typeof cOpt === 'string' || typeof cOpt === 'number') {
				cOpt = {label: cOpt};
				if(item.value_key !== 'index'){
					cOpt.value = cOpt.label;
				}
			}

			if(typeof item.value_key !== 'undefined' && item.value_key !== ''){
				if(item.value_key === 'index'){
					cOpt.value = o;
				}else{
					cOpt.value = cOpt[item.value_key];
				}
			}
			if(typeof cOpt.value === 'undefined'){
				cOpt.value = cOpt.id;
			}

			if(typeof item.label_key !== 'undefined' && item.label_key !== ''){
				cOpt.label = cOpt[item.label_key];
			}
			
			if(typeof cOpt.label === 'undefined'){
				cOpt.label = cOpt.label || cOpt.name || cOpt.title;
			}


			item.options[o] = cOpt;//$.extend({label: cOpt.name, value: o}, {label: cOpt[(item.label_key || 'title')], value: cOpt[(item.value_key || 'id')]}, cOpt);

			//if(!set) {
				if(typeof item.value !== 'undefined' && item.value !== '') {
					if(!$.isArray(item.value)) {
						item.options[o].selected = (cOpt.value == item.value);
					} else {
						item.options[o].selected = ($.inArray(cOpt.value, item.value) > -1);
					}
				}
				// else {
				// 	item.options[o].selected = true;
				// 	item.value = item.options[o].value;
				// }
				// set = item.options[o].selected;
			// } else {
			// 	item.options[o].selected = false;
			// }
		}
	}
	return item;
}


Berry.getUID = function() {
	return 'b' + (Berry.counter++);
};

Berry.render = function(name , data) {
	return (templates[name] || templates['berry_text']).render(data, templates);
};

Berry.register({
	type: 'fieldset',
	getValue: function() { return null;},
	create: function() {
		this.name = this.name || Berry.getUID();
		if(typeof this.multiple !== 'undefined'){
			this.multiple.min = this.multiple.min || 1;
			if(typeof this.multiple.max !== 'undefined'){
				if(this.multiple.max > this.multiple.min){
					this.multiple.duplicate = true;
				}else if(this.multiple.min > this.multiple.max){
					this.multiple.min = this.multiple.max;
				}
			}//else{this.multiple.duplicate = true;}
		}
		if(!this.isChild()){
			++this.owner.section_count;
			this.owner.sections.push(this);
			this.owner.sectionList.push({'index': this.owner.section_count, 'text': this.item.legend || this.item.label, state: 'disabled', completed: false, active: false, error: false});
		}

		this.owner.fieldsets.push( $('[name="' + this.name + '"]')[0]);
		return this.owner.renderer.fieldset(this);
	},
	focus: function(){
		this.owner.each(function(){
			this.focus();
			return false;
		}, {}, this.children);
		return false;
	},
	setValue: function(value) {return true;},
	setup: function() {
		if(this.fields !== undefined) {
			return this.owner.processfields(this.fields, this.self, this);
		}
	},
	isContainer: true
});


Berry.renderers = {
	base: function(owner) {
		this.owner = owner;
		this.initialize = function() {
			$(this.owner.$el).keydown($.proxy(function(event) {
				switch(event.keyCode) {
					case 27://escape
						$('#close').click();
						break;
					case 13://enter
						if (event.ctrlKey) {
							this.owner.$el.find('[data-id=berry-submit]').click();
						}
						break;
				}
			}, this));
		};
		this.fieldset = function(data) {
			return Berry.render('berry_' + this.owner.options.renderer + '_fieldset',data);
		};
		this.destroy = function() {
			$(this.owner.$el).off();
			this.owner.$el.empty();
		};
		this.render = function() {
			this.owner.$el.html(Berry.render('berry_' + this.owner.options.renderer + '_form' , this.owner.options));
			return this.owner.$el.find('form');
		};
	}
};

Berry.btn = {
	save: {
		label: 'Save',
		icon:'check',
		id: 'berry-submit',
		modifier: 'success pull-right',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	},
	cancel: {
		label: 'Cancel',
		icon: 'times',
		id: 'berry-close',
		modifier:'default pull-left',
		click: function() {
			if(this.options.autoDestroy) {this.destroy();}
			this.trigger('cancel');
		}
	}
};

Berry.prototype.events.save = [{
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.action === 'string') {
		if(this.validate()){
			this.trigger('saveing');
			$.ajax({
				url: this.options.action, 
				data: this.toJSON(),
				method: this.options.method || 'POST',
				success: $.proxy(function(data){this.trigger('saved', data)}, this)
			});
			}
		}
	}
}];

function containsKey(l,k){var r={};for(var j in k){if(typeof l[k[j]]!=='undefined'){r[k[j]]=l[k[j]];}}return r;}
Berry.prototype.sum = function(search) {
	var inputs = this.toJSON(search);
	var val = 0;
	if(typeof inputs === 'object') {
		for(var i in inputs) {
			val += (parseInt(inputs[i] , 10) || 0);
		}
		return val;
	}
	return inputs;
};

$((function($){
	$.fn.berry = function(options) {
		return new Berry(options, this);
	}
})(jQuery));

$.pluck = function(arr, key) {
	return $.map(arr, function(e) { return e[key]; });
};Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		Berry.field.prototype.clone = function(options) {
			// var target = this.self;
			var max = this.multiple.max;
			if(typeof max === 'undefined' || max > this.parent.children[this.name].instances.length){
				var item = $.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name});
				this.owner.createField(
					$.extend({}, this.owner.options.default, this.item, {id: Berry.getUID(), name: this.name}),
					$(this.self), this.parent, 'after');
				this.trigger('change');
				return true;
			}
			return false;
		}

		Berry.field.prototype.remove = function() {
			// if((this.multiple.min || 1) < this.parent.children[this.name].instances.length){
			if((this.multiple.min || 1) < this.owner.find(this.getPath()).length){

				$(this.self).empty().remove();
				this.trigger('dropped');

				var fields = this.owner.fields;
				if(this.isChild()){
					fields = this.parent.children;
				}
				fields[this.name].instances.splice(this.instance_id, 1);

				var index=0;
				var instances = this.owner.find(this.getPath());
				for(var j in instances){
					instances[j].instance_id = index++;
				}

				this.trigger('change');
				return true;
			}
			return false;
		}

		// this.on('dropped', function(info){
		// 	var temp = this.findByID(info.id);
		// 	var target = this.fields;
		// 	if(temp.isChild()){
		// 		target = temp.parent.children;
		// 	}
		// 	target[temp.name].instances.splice(temp.instance_id, 1);
		// }, this);

		this.on('initializedField', function(opts){
			if(opts.field.multiple && opts.field.multiple.duplicate) {
				opts.field.self.find('.duplicate').on('click', $.proxy(opts.field.clone, opts.field) );
				opts.field.self.find('.remove').on('click', $.proxy(opts.field.remove, opts.field) );
			}
		});
	}
});Berry.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'enabled'  || conditions === 'parsable') {
			conditions = this.item[conditions];
		}else if(conditions === 'enable') {
			conditions = this.item.enable;
		}
	}
	if (typeof conditions === 'boolean') {
		return conditions;
	}
	if (typeof conditions === 'object') {
		var keys = [];
		for(var c in conditions){
			keys.push(Berry.conditions[c].call(this, this.owner, conditions[c], (func || conditions[c].callBack)));
		}
		return keys;
	}
	return true;
};

Berry.conditions = {
	requires: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (local.value !== null && local.value !== ''), token);
			}, this, args)
		).lastToken;
	},
	// valid_previous: function(Berry, args) {},
	not_matches: function(Berry , args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  !== local.value), token);
			}, this, args)
		).lastToken;
	},
	matches: function(Berry, args, func) {
		return Berry.on('change:' + args.name, $.proxy(function(args, local, topic, token) {
				func.call(this, (args.value  === local.value), token);
			}, this, args)
		).lastToken;
	},
	test: function(Berry, args, func) {
		return Berry.on('change:' + this.name, $.proxy(function(args, local, topic, token) {
				func.call(this, args(), token);
			}, this, args)
		).lastToken;
	},
	multiMatch: function(Berry, args, func) {
		Berry.on('change:' + _.map(args, 'name').join(' change:'), $.proxy(function(args, local, topic) {
			func.call(this, function(args,form){
				var status = false;
				for(var i in args) {
					var val = args[i].value; 
					var localval = form.toJSON()[args[i].name];
					
					if(typeof val == 'object' && localval !== null){
						status = (val.indexOf(localval) !== -1);
					}else{
						status = (val == localval);
					}
					if(!status)break;
				}
				return status;
			}(args, Berry), 'mm');
		}, this, args))
		return 'mm';
	}
};


Berry.prototype.valid = true;
Berry.prototype.validate = function(processed){
	if(!processed) {
		this.toJSON();
	}
	//this.parsefields(this.options);
	this.clearErrors();
	this.each(this.validateItem);
	return this.valid;
};
Berry.prototype.validateItem = function(){
	this.owner.performValidate(this);
	this.owner.errors[this.item.name] = this.errors;
	this.owner.valid = this.valid && this.owner.valid;
};
Berry.prototype.performValidate = function(target, pValue){
	var item = target.item;
	var value = target.value;
	if(typeof pValue !== 'undefined'){value = pValue;}
	target.valid = true;
	target.errors = '';

	if(typeof item.validate !== 'undefined' && typeof item.validate === 'object'){
		for(var r in item.validate){
			if(!Berry.validations[r].method.call(target, value, item.validate[r])){
				if((typeof item.show === 'undefined') || target.isVisible){
					target.valid = false;
					var estring = Berry.validations[r].message;
					if(typeof item.validate[r] == 'string') {
						estring = item.validate[r];
					}
					target.errors = estring.replace('{{label}}', item.label).replace('{{value}}', value);
				}
			}
			target.self.toggleClass(target.owner.options.errorClass, !target.valid);
			target.self.find('.' + target.owner.options.errorTextClass).html(target.errors);
		}
	}
};
Berry.prototype.errors = {};
Berry.prototype.clearErrors = function() {
	this.valid = true;
	this.errors = {};
	this.$el.find("." + this.options.errorClass).removeClass(this.options.errorClass).find("." + this.options.errorTextClass).html("");
};
//var ruleRegex = /^(.+)\[(.+)\]$/,
Berry.regex = {};
Berry.regex.numeric = /^[0-9]+$/;
Berry.regex.integer = /^\-?[0-9]+$/;
Berry.regex.decimal = /^\-?[0-9]*\.?[0-9]+$/;
Berry.regex.email = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i;
Berry.regex.alpha = /^[a-z]+$/i;
Berry.regex.alphaNumeric = /^[a-z0-9]+$/i;
Berry.regex.alphaDash = /^[a-z0-9_-]+$/i;
Berry.regex.natural = /^[0-9]+$/i;
Berry.regex.naturalNoZero = /^[1-9][0-9]*$/i;
Berry.regex.ip = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i;
Berry.regex.base64 = /[^a-zA-Z0-9\/\+=]/i;
Berry.regex.url = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
Berry.regex.date = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/;

Berry.validations = {
	required:{
		method: function(value, args) {
//      var value = field.value;
//      if (field.type === 'checkbox') {
//          return (field.checked === true);
//      }
			return this.satisfied();
			// return (value !== null && value !== '');
		},
		message: 'The {{label}} field is required.'
	},
	matches:{
		method: function(value, matchName) {
			if (el == this.Berry[matchName]) {
				return value === el.value;
			}
			return false;
		},
		message: 'The {{label}} field does not match the {{value}} field.'
	},
	valid_email:{
		method: function(value) {
			return (Berry.regex.email.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid email address.'
	},
	valid_emails:{
		method: function(value) {
			var result = value.split(",");
			for (var i = 0; i < result.length; i++) {
				if (!Berry.regex.email.test(result[i])) {
					return false;
				}
			}
			return true;
		},
		message: 'The {{label}} field must contain all valid email addresses.'
	},
	min_length:{
		method: function(value, length) {
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length >= parseInt(length, 10));
		},
		message: 'The {{label}} field must be at least {{value}} characters in length.'
	},
	max_length:{
		method: function(value, length) {
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length <= parseInt(length, 10));
		},
		message: 'The {{label}} field must not exceed {{value}} characters in length.'
	},
	exact_length:{
		method: function(value, length) {
			if (!Berry.regex.numeric.test(length)) {
				return false;
			}
			return (value.length === parseInt(length, 10));
		},
		message: 'The {{label}} field must be exactly {{value}} characters in length.'
	},
	greater_than:{
		method: function(value, param) {
			if (!Berry.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) > parseFloat(param));
		},
		message: 'The {{label}} field must contain a number greater than {{value}}.'
	},
	less_than:{
		method: function(value, param) {
			if (!Berry.regex.decimal.test(value)) {
				return false;
			}
			return (parseFloat(value) < parseFloat(param));
		},
		message: 'The {{label}} field must contain a number less than {{value}}.'
	},
	alpha:{
		method: function(value) {
			return (Berry.regex.alpha.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alphabetical characters.'
	},
	alpha_numeric:{
		method: function(value) {
			return (Berry.regex.alphaNumeric.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters.'
	},
	alpha_dash:{
		method: function(value) {
			return (Berry.regex.alphaDash.test(value) || value === '');
		},
		message: 'The {{label}} field must only contain alpha-numeric characters, underscores, and dashes.'
	},
	numeric:{
		method: function(value) {
			return (Berry.regex.decimal.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only numbers.'
	},
	integer:{
		method: function(value) {
			return (Berry.regex.integer.test(value) || value === '');
		},
		message: 'The {{label}} field must contain an integer.'
	},
	decimal:{
		method: function(value) {
			return (Berry.regex.decimal.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a decimal number.'
	},
	is_natural:{
		method: function(value) {
			return (Berry.regex.natural.test(value) || value === '');
		},
		message: 'The {{label}} field must contain only positive numbers.'
	},
	is_natural_no_zero:{
		method: function(value) {
			return (Berry.regex.naturalNoZero.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a number greater than zero.'
	},
	valid_ip:{
		method: function(value) {
			return (Berry.regex.ip.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid IP.'
	},
	valid_url:{
		method: function(value) {
			return (Berry.regex.url.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a valid Url.'
	},
	valid_base64:{
		method: function(value) {
			return (Berry.regex.base64.test(value) || value === '');
		},
		message: 'The {{label}} field must contain a base64 string.'
	},
	date:{
		method: function(value, args) {
	        return (Berry.regex.date.test(value) || value === '');
		},
		message: 'The {{label}} field should be in the format MM/DD/YYYY.'
	}
};(function(b, $){
	b.register({ type: 'checkbox',
		defaults: {container: 'span'},
		create: function() {
			this.checkStatus(this.value);
			return b.render('berry_checkbox', this);
		},
		checkStatus: function(value){
			if(value === true || value === "true" || value === 1 || value === "1" || value === "on" || value == this.truestate){
				this.value = true;
			}else{
				this.value = false;
			}
		},
		setup: function() {
			this.$el = this.self.find('[type=checkbox]');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');},this));
		},
		getValue: function() {
			if(this.$el.is(':checked')){
				return this.truestate || true
			}else{
				if(typeof this.falsestate !== 'undefined') return this.falsestate;
				return  false;
			};
		},
		setValue: function(value) {
			this.checkStatus(value);
			this.$el.prop('checked', this.value);
			this.value = value;
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].name;
				}
			}
		},
		focus: function(){
			this.$el.focus();
		},
		satisfied: function(){
			return this.$el.is(':checked');
		},
	});
})(Berry, jQuery);(function(b, $){
	b.register({ type: 'radio',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('[type=radio]');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		getValue: function() {
			if(this.item.waiting){
				return this.value;
			}
			var selected = this.self.find('[type="radio"]:checked').data('label');
			for(var i in this.item.options) {
				if(this.item.options[i].label == selected) {
					return this.item.options[i].value;
				}
			}
		},
		setValue: function(value) {
			if(typeof value !== 'object' && this.item.waiting || (typeof _.findWhere(this.options, {value:  value}) !== 'undefined' || typeof _.findWhere(this.options, {value:  value+=''}) !== 'undefined' || typeof _.findWhere(this.options, {value:  parseInt(value, 10)}) !== 'undefined') ){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
			//if(typeof _.findWhere(this.options, {value: value}) !== 'undefined'){
				this.value = value;
				this.self.find('[value="' + this.value + '"]').prop('checked', true);
			}
		},
		displayAs: function() {
			for(var i in this.item.options) {
				if(this.item.options[i].value == this.lastSaved) {
					return this.item.options[i].label;
				}
			}
		},
		focus: function(){
			this.self.find('[type="radio"]:checked').focus();
		}
	});
})(Berry, jQuery);(function(b, $){
	b.register({ type: 'select',
		// value: '',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('select');
			this.$el.off();
			this.setValue(this.value);
			if(this.onchange !== undefined){
				this.on('change', this.onchange);
			}
			this.$el.change($.proxy(function(){this.trigger('change');}, this));
		},
		displayAs: function() {
			var o = this.options;
			for(var i in o) {
				if(o[i].value == this.lastSaved) {
					return o[i].label;
				}
			}
		},		
		getValue: function() {
			if(this.item.waiting){
				return this.value;
			}
		 return this.$el.val(); 
		},
		setValue: function(value){
			if(typeof value !== 'object' && this.item.waiting || (typeof _.findWhere(this.options, {value:  value}) !== 'undefined' || typeof _.findWhere(this.options, {value:  value+=''}) !== 'undefined' || typeof _.findWhere(this.options, {value:  parseInt(value, 10)}) !== 'undefined') ){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				this.$el.val(value);
			}
			return this.value;
		}
	});
})(Berry, jQuery);(function(b, $){
	b.register({type: 'text' });
	b.register({type: 'raw' ,
		setValue: function(value) {
			// if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				if(this.item.template){
					debugger;
					this.value = Hogan.compile(this.item.template).render(this, templates);
				}
				this.render();
			// }
			return this.value;
		}
	});
	b.register({type: 'password' });
	b.register({type: 'date' ,
		setValue: function(value) {		
			if(typeof value !== 'object'){
				if(typeof moment !== 'undefined'){value = moment.utc(value).format('YYYY-MM-DD');}
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				return this.$el.val(value);
			}
			return this.value;
		}
	});
	b.register({type: 'range' });

	b.register({type: 'hidden',
		create: function() {
			return '<div><input type="hidden"  name="'+this.name+'" value="'+this.value+'" /></div>';}
	});

	b.register({ type: 'url',
		defaults: {
			post: '<i class="fa fa-link"></i>',
			validate: {'valid_url': true }
		}
	});

	b.register({ type: 'phone',
		defaults: {
			mask: '(999) 999-9999',
			post: '<i class="fa fa-phone"></i>' ,
			placeholder: '+1'
		}
	});
	b.register({ type: 'color',
		defaults: {
			pre: '<i></i>' ,
			type: 'text'
		},	
		setValue: function(value) {
			if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				this.$el.parent().colorpicker('setValue', this.value)
				return this.$el.val(value);
			}
			return this.value;
		},
		setup: function() {
				this.$el = this.self.find('input');
				this.$el.off();
				if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
				this.$el.on('input', $.proxy(function() {this.trigger('change');}, this));
				this.$el.attr('type','text');
				this.$el.parent().colorpicker({format: 'hex'}).on('changeColor', $.proxy(function(ev){
				  this.trigger('change');
				}, this));
			}
	});
	b.register({ type: 'email',
		defaults: {
		post: '<i class="fa fa-envelope"></i>' ,
		validate: { 'valid_email': true }
		}
	});

	b.register({ type: 'number',
		defaults: { elType: 'text' },
		value: 0,
		getValue: function() {
			var temp = this.$el.val();
			if(temp === '') {
					return 0;
			}else{
				if( $.isNumeric( temp ) ){
					return parseFloat(temp, 10);
				}
			}

			// if( $.isNumeric( temp ) ){
			// 	return parseFloat(temp, 10);
			// }else{
			// 	if(temp === '') {
			// 		return temp;
			// 	}
			// 	this.revert();
			// 	return 0;
			// }
		},
		satisfied: function(){
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== 0);
		}

	});

	b.register({ type: 'tags',
		defaults: { elType: 'text' },
		setup: function() {
			this.$el = this.self.find('input');
			this.$el.off();
			if(this.onchange !== undefined){ this.$el.on('input',this.onchange);}
			this.$el.on('input', $.proxy(function(){this.trigger('change');}, this));
			if($.fn.tagsInput){
				this.$el.tagsInput();
			}
		},
		setValue: function(value) {
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.$el.importTags(value);
			return this.$el.val(value);
	}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'textarea',
		default: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('textarea');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

			if(this.item.advanced && $.fn.htmlarea){
				this.$el.css({height: '300px'}).htmlarea({
					toolbar: (this.item.toolbar || [
						//['html'],
						['bold', 'italic', 'underline'],
						['superscript', 'subscript'],
						['justifyleft', 'justifycenter', 'justifyright'],
						['indent', 'outdent'],
						['orderedList', 'unorderedList'],
						['link', 'unlink'],
						['horizontalrule']
					])
				});
				this.$el.on('change', $.proxy(function(){this.trigger('change');},this));
			}
			if((this.autosize !== false) && $.fn.autosize){
				this.$el.autosize();
			}
		},
		setValue: function(value){
			if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				this.$el.val(value)

				if((this.autosize !== false) && $.fn.autosize){
					this.$el.trigger('autosize.resize');
				}
				if(this.item.advanced && $.fn.htmlarea){
					this.$el.htmlarea('updateHtmlArea', value);
				}	
			}
			return this.$el;

		},
		focus: function(){
			this.$el.focus().val('').val(this.value);
			this.self.find('iframe').focus();
		}
	});
})(Berry,jQuery);Berry.backbone = true;
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.model !== 'undefined'){
			this.on('save', function() {
				if(this.validate()){
					// this.options.model.save(this.toJSON() , {wait: true, patch: true, success: $.proxy(function(){
					// 	this.trigger('saved');
					// }, this)});
					this.trigger('saveing');
					this.options.model.set(this.toJSON());
					this.trigger('saved');
				}
				return this.valid;
			});
			
			
			//may be more universal way to do thisd
			var list = this.options.model.schema;
			var returnArray = {};
			var keys = this.options.fields;
			if(keys === 'all' || typeof this.options.fields === 'undefined'){
				this.options.fields = list;
			}else{
				for (var key in keys) {
					if(typeof keys[key] === 'string'){
						if(typeof list[keys[key]] !== 'undefined'){
							returnArray[keys[key]] = list[keys[key]];
						}
					}else{
						returnArray["key_"+key] = keys[key];
					}
				}
				this.options.fields = returnArray;
			}

			if(typeof this.options.attributes === 'undefined' || $.isEmptyObject(this.options.attributes)) {
				this.options.attributes = this.options.model.toJSON();

				this.options.model.on('change', function(){
					for(var i in this.options.model.changed){
						var temp = this.find(i);
						if(temp && !$.isArray(temp)) {
							temp.set(this.options.model.changed[i]);
						}
					}
				}, this);

				this.on('destroy',function(){
					this.options.model.off('change', null, this);
				});
			}
		}
	}
});

Berry.register({
	type: 'fieldset',
	getValue: function() { return null;},
	create: function() {
		this.name = this.name || Berry.getUID();
		this.owner.fieldsets.push(this.name);
		if(!this.isChild()){
			++this.owner.section_count;
			this.owner.sections.push(this);
			this.owner.sectionList.push({'index': this.owner.section_count, 'text': this.item.legend, state: 'disabled', completed: false, active: false, error: false});
		}
		return this.owner.renderer.fieldset(this);
	},
	focus: function(){
		this.owner.each(function(){
			this.focus();
			return false;
		}, {}, this.children);
		return false;
	},
	setValue: function(value){return true;},
	setup: function() {

		if(typeof this.fields !== 'undefined') {
			// if(typeof this.owner.options.model !== 'undefined') {
			// 	var list = this.owner.options.model.schema;
			// 	var returnArray = {};
			// 	var keys = this.fields;
			// 	for (var key in keys) {
			// 		if(typeof keys[key] === 'string'){
			// 			if(typeof list[keys[key]] !== 'undefined'){
			// 				returnArray[keys[key]] = list[keys[key]];
			// 			}
			// 		}else{
			// 			returnArray["key_"+key] = keys[key];
			// 		}
			// 	}
			// 	this.fields = returnArray;
			// }

			this.owner.processfields(this.fields, this.self, this);
		}
	},
	isContainer: true
});Berry.extract = true;
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(typeof this.options.template !== 'undefined'){
			
			var myRegexp = /\{\{\{?(.[\s\S]*?)\}\}\}?/g;
			text = this.options.template;
			var tempdiv = text;
			var match = myRegexp.exec(text);
			this.options.fields = this.options.fields || {};
			while (match != null) {
				//split into the constituent parts
				var splits = match[1].split(':{');

				var pre = '{{';
				//if this is a comment we still want to process it and return it to its status as a comment
				if(splits[0].substr(0,1) == '!'){splits[0] = splits[0].substr(1);pre += '!';}

				//ignore advanced types in the mustache
				if($.inArray( splits[0].substr(0,1) , [ "^", "#", "/", ">" ] ) < 0  ){
					var cobj = {};

					//identify if there is more info about this field, if so map it to an object
					if(splits.length>1){cobj = JSON.parse('{'+splits[1] )}

					//update the fields array with the the values
					this.options.fields[splits[0]] = $.extend(this.options.fields[splits[0]], cobj);

					//replace with the mustache equivilent with the key
					tempdiv = tempdiv.replace(match[0], pre+(this.options.fields[splits[0]].name || splits[0].toLowerCase().split(' ').join('_'))+"}}");
				}

				//check if there is more
				match = myRegexp.exec(text);
			}
			this.options.template = Hogan.compile(tempdiv);
		}
	}
});Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if((typeof this.$el == 'undefined') || !this.$el.length) {
			this.autoDestroy = false;

			this.$el = $('<div/>');
			this.options.modal = (this.options.modal || {});
			this.options.modal.header_class = this.options.modal.header_class || 'bg-success';
			this.ref = $(Berry.render('modal', this.options));
			$(this.ref).appendTo('body');

			this.options.legendTarget = this.ref.find('.modal-title');
			this.options.actionTarget = this.ref.find('.modal-footer');
			this.$el = this.ref.find('.modal-body');

			this.ref.modal(this.options.modal);

			this.ref.on('shown.bs.modal', $.proxy(function () {
				if(this.options.autoFocus){
					this.$el.find('.form-control:first').focus();
				}
			},this));

			//Add two more ways to hide the modal (escape and X)
			this.on('cancel', $.proxy(function(){
				this.ref.modal('hide');
			},this));

			this.on('saved, close', $.proxy(function(){
				this.ref.modal('hide');
				this.closeAction = 'save';
			},this));

			//After the modal is hidden destroy the form that it contained
			this.ref.on('hidden.bs.modal', $.proxy(function () {

				this.closeAction = (this.closeAction || 'cancel');
				this.destroy();

			},this));

			//After the form has been destroyed remove it from the dom
			this.on('destroyed', $.proxy(function(){
				// this.ref.remove();
				this.ref.modal('hide');
				this.trigger('completed');
			},this));
		}
	}
});
(function(b, $){
	
	b.register({
		type: 'cselect',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			if(this.reference){
				for(var i in this.options){
					this.options[i].image = this.options[i][this.reference];
				}
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.dropdown');
			this.$el.find('li > a').off();
			this.$el.find('li > a').on('click', $.proxy(function(e){
				this.$el.find('a').removeClass('list-group-item-success');
				$(e.target).closest('a').addClass('list-group-item-success');
				this.$el.find('button').html(_.findWhere(this.options,{value:$(e.target).closest('a').attr('data-value')}).label+' <span class="caret"></span>')
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			if(this.$el.find('.list-group-item-success').length){
				return this.$el.find('.list-group-item-success').attr('data-value');
			}else{
				return this.value;
			}
		},
		setValue: function(val) {
			if(this.$el.find('[data-value="'+val+'"]').length){
				this.value = val;
				return this.$el.find('[data-value="'+val+'"]').click();
			}else if(typeof val !== 'object' && val && val.length){
				this.$el.find('a').removeClass('list-group-item-success');
				this.value = val;
				this.$el.find('button').html(val+' <span class="caret"></span>')
			}
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'ace',
		create: function() {
				return b.render('berry_ace', this);
			},
		setup: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));

			this.editor = ace.edit(this.id+"container");
	    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
	    this.editor.getSession().setMode(this.item.mode || "ace/mode/handlebars");

		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			this.editor.session.setValue(value);
			return this.$el;
		},
		getValue: function(){
			return this.editor.getValue()
		},
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		focus: function(){
			this.editor.focus();
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'base64',
		defaults: { elType: 'file' },
		create: function() {
			return b.render('berry_text', this);
		},
		// defaults: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('input');
			this.$el.off();
			this.$el.on('change', _.partial(function (field, e) {
				var files = this.files
		    // Check for the various File API support.
		    if (window.FileReader) {
		        // FileReader are supported.
		      (function (fileToRead, field) {
			      var reader = new FileReader();
			      // Read file into memory as UTF-8      
			      reader.readAsDataURL(fileToRead);
			      reader.onload = function (event) {
			      	// event.target.result;
				    	this.set(event.target.result);//.split(',').pop());

				    }.bind(field)
			      reader.onerror = function (evt) {
				      if(evt.target.error.name == "NotReadableError") {
				          alert("Canno't read file !");
				      }
				    }
			    })(files[0],field);
			    e.currentTarget.value = '';

		    } else {
		        alert('FileReader is not supported in this browser.');
		    }
		  }, this));
		},	
		setValue: function(value) {
			if(typeof value !== 'object'){
				if(typeof this.lastSaved === 'undefined'){
					this.lastSaved = value;
				}
				this.value = value;
				return this.value;
			}
			return this.value;
		},	
		getValue: function() { return this.value; }
	});
})(Berry,jQuery);
(function(b, $){

// 	var oldEditor = $.summernote.options.modules.editor;
// $.summernote.options.modules.editor = function() {
//     oldEditor.apply(this, arguments);
//     var oldCreateRange = this.createRange;
//     var oldFocus = this.focus;

//     this.createRange = function () {
//         this.focus = function() {};
//         var result = oldCreateRange.apply(this, arguments);
//         this.focus = oldFocus;
//         return result;
//     };
// };

	b.register({
		type: 'contenteditable',
		create: function() {
				return b.render('berry_contenteditable', this);
			},
		setup: function() {
			this.$el = this.self.find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			// this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
			this.$el.summernote({
				disableDragAndDrop: true,
		    dialogsInBody: true,
				toolbar: [
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
			    ['link', ['linkDialogShow', 'unlink']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']]
				]
			});
			this.$el.on('summernote.change', $.proxy(function(){this.trigger('change');},this));

// this.$el.on('summernote.blur', $.proxy(function() {
//   this.$el.summernote('saveRange');
// },this));

// this.$el.on('summernote.focus', $.proxy(function() {
//   this.$el.summernote('restoreRange');
// },this));

		 //  this.editor = new Pen({
		 //  	editor: this.$el[0], // {DOM Element} [required]
		 //  	//textarea: '<textarea name="content"></textarea>', // fallback for old browsers
		 //  	//list: ['bold', 'italic', 'underline'] // editor menu list
			// });

			// tinymce.init({
			//   selector: '.formcontrol > div',  // change this value according to your HTML
			//   plugins: ['autolink link code image'],      
			//   inline: true,
			//   toolbar1: 'undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
			// });

			// this.editor = tinyMCE.editors[tinyMCE.editors.length-1];
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			this.value = value;
			// this.$el.html(value)

			return this.$el;
		},
		getValue: function(){
			return this.$el.summernote('code')
			// return this.editor.getContent()
			// return this.$el.html();
		},satisfied: function(){
			this.value = this.getValue()
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== "<p><br></p>");
		},	destroy: function() {
		this.$el.summernote('destroy');
		if(this.$el){
			this.$el.off();
		}
 }
		// destroy: function(){
		// 	this.editor.destroy();
		// }
		// focus: function(){
		// 	this.$el.focus().val('').val(this.value);
		// 	this.self.find('iframe').focus();
		// }
	});
})(Berry,jQuery);
$(document).on('focusin', function(e) {
    if ($(e.target).closest(".note-editable").length) {
        e.stopImmediatePropagation();
			
    }
});
$(document).on('click', function(e) {
    if ($(e.target).hasClass(".note-editor")) {
        e.stopImmediatePropagation();

			$(e.target).find('.open').removeClass('open')
    }
});
(function(b, $){
	b.register({
		type: 'custom_radio',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);
		},
		defaults: {
			selectedClass: 'btn-success',
			defaultClass: 'btn-default',
		},
		setup: function() {
			this.$el = this.self.find('.custom-group');
			this.$el.children('.btn').off();
			this.$el.children('.btn').on('click', $.proxy(function(e){
				this.$el.children('.' + this.selectedClass).toggleClass(this.selectedClass + ' ' + this.defaultClass);
				$(e.target).closest('.btn').toggleClass(this.selectedClass + ' ' + this.defaultClass);
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.' + this.selectedClass).attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'custom_select',
		create: function() {
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			if(this.reference){
				for(var i in this.options){
					this.options[i].image = this.options[i][this.reference];
				}
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.list-group');
			this.$el.children('.list-group-item').off();
			this.$el.children('.list-group-item').on('click', $.proxy(function(e){
				this.$el.children('.list-group-item-success').removeClass('list-group-item-success');
				$(e.target).closest('.list-group-item').addClass('list-group-item-success');
				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.list-group-item-success').attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'dropdown',
		create: function() {
			// return f.render('berry_dropdown', f.processOpts(this.item));
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			return b.render('berry_' + (this.elType || this.type), this);

		},
		setup: function() {
			this.$el = this.self.find('.btn-group');
			this.$el.find('a').on('click',$.proxy(function(e){
				e.preventDefault();
				this.setValue($(e.target).data('value'));
				this.trigger('change');
				if(this.onchange !== undefined){
					this.onchange();
				}
			}, this));
		},
		setValue: function(value) {
			this.$el.find('ul').attr('data-value',value);
			return this.$el.find('button').html(this.displayAs(value) + ' <span class="caret"></span>');
		},
		getValue: function() {
			return this.$el.find('ul').attr('data-value');
		},
		displayAs: function(value) {
			for(var i in this.options) {
				if(this.options[i].value == (value || this.value)) {
					return this.options[i].label;
				}
			}
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({ type: 'grid_select',
		defaults: {select_class: "text-info",},
		create: function() {
			//return f.render('berry_grid_select', f.processOpts(this.item));
			this.options = b.processOpts.call(this.owner, this.item, this).options;
			// if(this.value_key){
				for(var i in this.options){
					this.options[i].image = this.options[i][(this.value_key || 'value')];
				// }
			}
			return b.render('berry_' + (this.elType || this.type), this);
		},
		setup: function() {
			this.$el = this.self.find('.list');
			this.$el.children('.col-md-3').off();
			this.$el.children('.col-md-3').on('click', $.proxy(function(e){
				this.$el.children('.'+this.select_class).removeClass(this.select_class);
				$(e.target).closest('.col-md-3').addClass(this.select_class);

				if(typeof this.onchange === 'function'){
					this.onchange();
				}
				this.trigger('change');
			}, this));
		},
		getValue: function() {
			return this.$el.children('.'+this.select_class).attr('data-value');
		},
		setValue: function(val) {
			return this.$el.children('[data-value="'+val+'"]').click();
		}
	});
})(Berry,jQuery);(function(b, $){
  b.register({
    type: 'image_picker',
    default: {autosize: true, advanced: false},
    setup: function() {
      this.$el = this.self.find('input');
      this.$el.off();
      if(this.onchange !== undefined){ this.$el.on('input', this.onchange);}
      this.$el.on('input', $.proxy(function() {
        this.trigger('change');
      }, this));
      this.self.find('button,img').on('click', $.proxy(function(){
        this.modal = $().berry({legend:(this.label || "Choose One"), fields:{
          Image:{
            label: false,
            value: this.value, 
            options: this.options,
            choices: this.choices,
            value_key: this.value_key,
            label_key: this.label_key,
            root: this.path,
            type:'grid_select'
          }
        } }).on('save', function(){
          this.update({value:this.modal.fields.image.toJSON()})
          this.modal.trigger('close');
        }, this)
      },this));
    },
    setValue: function(value){
      if(this.value != value) {
        this.update({value:value})
      }
    }
  });
})(Berry,jQuery);(function(b, $){
	b.register({ type: 'rateit',
		create: function() {
			return b.render('berry_rateit', this);
		},
		setup: function() {
			this.render();
			this.$el = this.self.find('.rateit');
			this.$el.rateit();
			this.$el.rateit('value', this.value);
			this.$el.bind('rated reset', $.proxy(function (e) {
				this.$el.focus();
				this.trigger('change');
				if(this.onchange !== undefined){
					this.onchange();
				}
			},this));
		},
		setValue: function(value) {
			this.value = value;
			return this.$el.rateit('value', value);
		},
		getValue: function() {
			return this.$el.rateit('value');
		},
		getDisplay: function() {
			for(var i in this.options) {
				if(this.options[i].value == this.lastSaved) {
					return this.options[i].label;
				}
			}
			var rstring = "";
			for(var i = 1; i<= this.value; i++){
				rstring += '<i class="fa fa-star"></i>';
			}
			var temp = Math.floor(this.value);
			if(this.value - temp >= 0.5){
				rstring += '<i class="fa fa-star-half-full"></i>';
			}
			for(var i = Math.round(this.value); i< 5; i++){
				rstring += '<i class="fa fa-star-o"></i>';
			}
			return rstring;
		}
	});
})(Berry,jQuery);(function(b, $){
	b.register({
		type: 'upload',
		defaults: {autosize: true, advanced: false},
		setup: function() {
			this.$el = this.self.find('form input');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.on('input', $.proxy(function(){this.trigger('change');},this));
			this.myDropzone = new Dropzone('#' + this.name, { method: 'post', paramName: this.name, success: $.proxy(function(message,response){
				//contentManager.currentView.model.set(this.name, response[this.name]);
				//myDropzone.removeAllFiles();

				//this.setValue(response[this.name]);
				this.setValue(response);
				this.trigger('uploaded');
			}, this)});
			// myDropzone.on("complete", function(file) {
			// 	myDropzone.removeFile(file);
			// });
		},
		getValue: function() {
		 return this.value; 
		},
		setValue: function(value){
			if(typeof this.lastSaved === 'undefined'){
				this.lastSaved = value;
			}
			this.value = value;
			return this.$el;
		},
		update: function(item, silent) {
			if(typeof item === 'object') {
				$.extend(this.item, item);
			}
			$.extend(this, this.item);
			this.setValue(this.value);
			this.myDropzone.destroy();
			this.render();
			this.setup();
			if(!silent) {
				this.trigger('change');
			}
		},
		render: function() {
			if(typeof this.self === 'undefined') {
				this.self = $(this.create()).attr('data-Berry', this.owner.options.name);
			} else {
				this.self.find('div:first').replaceWith($(this.create()).html())
			}
			this.display = this.getDisplay();
			return this.self;
		}
	});
})(Berry,jQuery);Berry.renderers['inline'] = function(owner) {
	this.owner = owner;
	// this.selector = 
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset', data);
	};
	this.render = function() {
		return $('<div/>');
	};

};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'inline'){
			this.options.inline = true;
			this.options.autoFocus = false;
			this.options.default = {hideLabel: true,};
			this.on('initializeField', function(opts){

					opts.field.item.fieldset = this.$el.find('[data-inline="'+opts.field.item.name+'"]');
					if(opts.field.item.fieldset.length > 1){
						var test = this.$el.find('[data-inline="'+opts.field.item.name+'"][id='+opts.field.item.id+']');
						if(test.length > 0){
								

							opts.field.item.fieldset = test;
						}
					}
					if(opts.field.item.fieldset){$.extend(opts.field.item, opts.field.item.fieldset.data());}
//					return temp;
				});
			//  fieldset: function(){
			// 	// debugger;
			// 		var temp = this.owner.$el.find('[data-inline='+this.item.name+']');
			// 		if(temp){$.extend(this.item, temp.data());}
			// 		return temp;
			// 	}
			// };
		}
	}
});
Berry.renderers['popins'] = function(owner) {
	this.owner = owner;
	// this.selector = 
	this.fieldset = function(data) {
		Berry.render('berry_base_fieldset', data);
	};
	this.render = function() {
		return $('<div/>');
	};
	this.initialize = function() {
		this.owner.on('destroy', function(){
			$('.row.form-group[data-berry='+this.options.name+']').closest('.popover').remove();
		})
		if(typeof this.owner.options.popins_template === 'string'){
			this.owner.$el.html(Berry.render(this.owner.options.popins_template , {fields: _.toArray(this.owner.fields)}));
		}
		this.owner.each(function(_this) {
			_this.create(this);
		}, [this]);
		$('body').off('click', '.popoverCancel');
		$('body').on('click', '.popoverCancel', function(){
			$('[data-popins]').popover('hide');
			var fl = Berry.instances[$(this).data('berry')];
			var field = fl.find($(this).data('name'));
			field.revert();
			//fl.$el.find('[name="' + field.name + '"].popins').popover('destroy').siblings('.popover').remove();
			//Berry.renderers.popins.prototype.create(field);
			$('[data-popins="' + $(this).data('name') + '"]').focus();
		});
		$('body').off('click', '.popoverSave');
		$('body').on('click', '.popoverSave', function() {
			var fl = Berry.instances[$(this).data('berry')];
			var name = $(this).data('name');
			var field = fl.find(name);
			$(field.self).find('.form-control').blur();
			fl.performValidate(field, field.getValue());
			if(field.valid) {
				field.toJSON();
				fl.$el.find('[data-popins="' + name + '"]').focus().html(field.display).popover('hide');
				// fl.$el.find('[name="' + name + '"].popins')
				fl.trigger('updated');
				fl.trigger('save');
			}else{
				field.focus();
			}
		});


		$('body').keydown(function(event) {
			switch(event.keyCode) {
				case 27://escape
					$('.popover.in .popoverCancel').click();
					break;
				case 13://enter
					$('.popover.in .popoverSave').click();
					break;
			}
		});
		this.owner.on('loaded', $.proxy(function(){
			this.owner.each(function() {
				this.owner.$el.find('[data-popins="' + this.name + '"]').html(this.display);
			});
		},this))

	};
};

Berry.renderers.popins.prototype.create = function(field){
	var target = field.owner.$el.find('[data-popins="' + field.name + '"]');
	var pOpts = $.extend(/*{trigger: "manual" , html: true, animation:false},*/{container: '#'+field.owner.$el.attr('id'), viewport:{ selector: '#content', padding: 20 }}, {    title:'<div style="padding-left:0"><div class="btn-group pull-right"><div style="margin-left:2px;" class="btn-xs popoverCancel fa fa-times btn btn-danger" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div><div class="btn-xs fa fa-check btn btn-success popoverSave" data-name="'+field.name+'" data-berry="'+field.owner.options.name+'"></div></div></div>'+(field.prompt || field.label), content: field.self, html: true, placement: 'left auto', template: '<div class="popover berry"><div class="arrow"></div><h3 class="popover-title"></h3><div style="min-width:270px" class="popover-content"></div></div>'}, field.owner.options.popins, field.popins);

	target.popover(pOpts);
	target.on('hidden.bs.popover', function () {
		$('.berry.popover').css({display:"none"});
	});
	target.on('show.bs.popover', function () {
		$('.popover.in .popoverCancel').click();
	});
	target.on('shown.bs.popover', function () {
		var field = Berry.instances[$('.berry.popover').find('.row').data('berry')].find($('.berry.popover').find('.row').attr('name'));
		field.initialize(); //maybe not needed
		field.focus();
	});
};

Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'popins'){
			this.options.default = {hideLabel: true};
			this.options.inline = true;
			$.extend(this.options.default,{hideLabel: true});
		}
	}
});Berry.renderers['tabs'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data){
		if(data.parent === null){
			return Berry.render('berry_tabs_fieldset', data);
		}
		return Berry.render('berry_base_fieldset', data);
	};
	this.render = function(){

		this.owner.$el.html(Berry.render('berry_base_form', this.owner.options));
		return this.owner.$el.find('form');
	};

	this.initialize = function() {
		if(this.owner.options.tabsTarget){
			this.owner.on('destroy', function(){
				this.options.tabsTarget.empty();
			});
		}else{
			this.owner.options.tabsTarget = this.owner.$el;
		}
		this.owner.options.tabsTarget.prepend(Berry.render('berry_tabs', this.owner)).find('a:first').tab('show');
	};
};
Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function() {
		if(this.options.renderer == 'tabs') {
			this.sectionsEnabled = true;
			this.options.modifiers += " tab-content";
		}
	}
});
Berry.renderers['wizard'] = function(owner) {
	this.owner = owner;
	this.fieldset = function(data){
		return Berry.render('berry_' + this.owner.options.renderer + '_fieldset', data);
	};
	this.render = function(){
		this.owner.$el.html(Berry.render('berry_' + this.owner.options.renderer + '_form', this.owner.options));
		return this.owner.$el.find('form');
	};
	this.$element = null;
	this.update = function(){
		this.$element.find('ul').html(Berry.render('berry_wizard_steps',this.owner));
		$('[data-id=berry-submit],[data-id=wizard-next]').hide();
		$('.step-pane').removeClass('active');
		$('#step' + (this.owner.currentSection + 1)).addClass('active');
		if((this.owner.currentSection + 1) != this.owner.section_count){
			$('[data-id=wizard-next]').show();
		}else{
			$('[data-id=berry-submit]').show();
		}
		if(this.owner.currentSection === 0){
			$('[data-id=wizard-previous]').hide();
		}else{
			$('[data-id=wizard-previous]').show();
		}
		// reset the wizard position to the left
		this.$element.find('ul').first().attr('style','margin-left: 0');

		// check if the steps are wider than the container div
		var totalWidth = 0;
		this.$element.find('ul > li').each(function () {
			totalWidth += $(this).outerWidth();
		});
		var containerWidth = 0;
		if (this.$element.find('.actions').length) {
			containerWidth = this.$element.width() - this.$element.find('.actions').first().outerWidth();
		} else {
			containerWidth = this.$element.width();
		}
		if (totalWidth > containerWidth) {
		
			// set the position so that the last step is on the right
			var newMargin = totalWidth - containerWidth;
			this.$element.find('ul').first().attr('style','margin-left: -' + newMargin + 'px');
			
			// set the position so that the active step is in a good
			// position if it has been moved out of view
			if (this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left < 200) {
				newMargin += this.$element.find('li.' + this.owner.sectionList[this.owner.currentSection].state ).first().position().left - 200;
				if (newMargin < 1) {
					this.$element.find('ul').first().attr('style','margin-left: 0');
				} else {
					this.$element.find('ul').first().attr( 'style' , 'margin-left: -' + newMargin + 'px');
				}
			}
		}
	};
	this.next = function(){
		this.owner.valid = true;
		this.owner.toJSON();
		this.owner.each(this.owner.validateItem, null, this.owner.sections[this.owner.currentSection].children);
		if(this.owner.valid){
			if(this.owner.currentSection < (this.owner.section_count - 1)){
				this.owner.sectionList[this.owner.currentSection].state = 'complete';
				this.owner.currentSection++;
				this.owner.clearErrors();
				this.owner.sectionList[this.owner.currentSection].state = 'active';
			}
		}else{
			this.owner.sectionList[this.owner.currentSection].state = 'error';
		}
		this.update();
	};
	this.previous = function(){
		if(this.owner.currentSection > 0){
			this.owner.sectionList[this.owner.currentSection].state = 'disabled';
			this.owner.currentSection--;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.sectionClick = function(e){
		var clickedSection = parseInt($(e.currentTarget).data('target').replace('#step', ''), 10) - 1;
		if(clickedSection < this.owner.currentSection) {
			for(var i = clickedSection; i <= this.owner.currentSection;  i++){
				this.owner.sectionList[i].state = 'disabled';
			}
			this.owner.currentSection = clickedSection;
			this.owner.sectionList[this.owner.currentSection].state = 'active';
		}
		this.update();
	};
	this.initialize = function() {
		this.owner.sectionList[0].state = 'active';
		this.owner.currentSection = 0;
		if((this.owner.currentSection + 1) == this.owner.section_count){
			$('[data-id=wizard-next]').hide();
		}else{
			$('[data-id=berry-submit]').hide();
		}
		if(this.owner.currentSection === 0){
			$('[data-id=wizard-previous]').hide();
		}else{
			$('[data-id=wizard-previous]').show();
		}

		this.$element = this.owner.$el.find('.wizard');
		this.$element.find('ul').html(Berry.render('berry_wizard_steps',this.owner));
		$('#step1').addClass('active');
		$('body').on('click','.wizard li',$.proxy(this.sectionClick,this));
		$('body').on('click','[data-id=wizard-next]',$.proxy(this.next,this));
		$('body').on('click','[data-id=wizard-previous]',$.proxy(this.previous,this));
	};
};

Berry.btn['previous'] = {
			'label': "Previous",
			'icon':'arrow-left',
			'id': 'wizard-previous',
			'modifier': 'danger pull-left'
		};
Berry.btn['next'] = {
			'label': "Next",
			'icon':'arrow-right',
			'id': 'wizard-next',
			'modifier': 'success pull-right'
		};
Berry.btn['finish'] = $.extend({}, Berry.btn['save'], {label: 'Finish'});


Berry.prototype.events.initialize.push({
	token: Berry.getUID(),
	func: function(){
		if(this.options.renderer == 'wizard') {
			this.sectionsEnabled = true;
			this.options.actions = ['finish', 'next', 'previous'];
		}
	}
});
