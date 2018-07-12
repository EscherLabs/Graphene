Cobler.types.textbox = function(container) {
	function render(){
		if(item.type == 'textarea'){
			return templates['berry_textarea'].render(get(), templates);
		}
		return templates['berry_text'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'textbox';
		item.isEnabled = true;
		return item;
	}
	function toJSON(opts) {
		var temp = get();
		if(!opts.editor){
		var initial = {
			"type":"text",
			"isEnabled": true,
			"widgetType": "textbox",
			"placeholder": "",
			"value": "",
			"name": "",
			"help": "",
			"required": false
		}
		temp = _.omitBy(temp,'validate');
		temp = _.omitBy(Berry.normalizeItem(temp, 0), function(v, k) {
			return initial[k] === v;
		})
		}
		temp = _.omitBy(temp,'required');
		
		return temp;
	}
	function set(newItem){
		item = newItem;
	}
	var item = {
		widgetType: 'textbox',
		type: 'text',
		label: 'Label',
		isEnabled: true
	}
	var fields = [
		{type: 'fieldset', name:'basics', legend: 'General', hideLabel: true, inline: true, fields:[
			
		{type: 'text', required: true, label: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'select', label: 'Display', name: 'type', value: 'dropdown', 'choices': [
			{label: 'Single Line', value: 'text'},
			{label: 'Multi-line', value: 'textarea'},
			{label: 'Phone', value: 'phone'},
			{label: 'Email', value: 'email'},
			{label: 'Date', value: 'date'},
			{label: 'Number', value: 'number'},
			{label: 'Color', value: 'color'}
		]},
		{type: 'text', label: 'Placeholder', name: 'placeholder'},
		{type: 'text', label: 'Default value', name: 'value'},
		{type: 'fieldset', name:'validate', legend: false,label:false, fields:[
			{type: 'checkbox', label: 'Required', name: 'required'}
		]},
		{type: 'textarea', label: 'Instructions', name: 'help'},
	]}]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryFormEditor.call(this, container, 'tabs'),
		get: get,
		set: set
	}
}

Cobler.types.select = function(container) {
	function render() {
		return templates['berry_' + item.type].render(get(), templates);
	}
	function get() {		
		item.widgetType = 'select';
		item.isEnabled = true;
		return item;
	}
	function toJSON(opts) {
		var temp = get();
		if(!opts.editor){
			var initial = {
				"isEnabled": true,
				"widgetType": "select",
				"placeholder": "",
				"value": "",
				"help": "",
				"name": "",
				"required": false,
				"choices": "",
				"label_key": "",
				"value_key": "",
				"max": 0,
				"min": 0,
				"step": 0,
				"help": "",
				"options": [
					{
						"label": "",
						"value": ""
					}
				]
			}
			temp = _.omitBy(temp,'validate');
			
			temp = _.omitBy(Berry.normalizeItem(temp, 0), function(v, k) {
				return initial[k] === v;
			})
			temp = _.omitBy(temp,'required');
			if(typeof temp.options !== 'undefined' && temp.options.length == 1){
				if((typeof temp.options.label == 'undefined' || temp.options.label == '') && (typeof temp.options.value == 'undefined' || temp.options.value == '')){
					delete temp.options;
				}
			}

			}
				
			return temp;
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'select',
		type: 'select',
		label: 'Label',
		isEnabled: true
	}
	var fields = [
		{type: 'fieldset', name:'basics', legend: 'General', hideLabel: true, inline: true, fields:[
			{type: 'text', required: true, label: 'Field Label', name: 'label'},
			{type: 'text', label: 'Name', name: 'name'},
			{type: 'select', label: 'Display', name: 'type', value: 'dropdown', choices: [
				{name: 'Dropdown', value: 'select'},
				{name: 'Radio', value: 'radio'},
				{name: 'Range', value: 'range'}
			]},
			{type: 'text', label: 'Default Value', name: 'value'},
			{type: 'fieldset', name:'validate', legend: false,label:false, fields:[
				{type: 'checkbox', label: 'Required', name: 'required'}
			]},
			
			{type: 'textarea', label: 'Instructions', name: 'help'},
			
			{type: 'text', label: 'External List', name: 'choices'},

			{type: 'text', label: 'Label key', name: 'label_key',show:{'not_matches':{"name":"choices","value":""}}},
			{type: 'text', label: 'Value key', name: 'value_key'},

			{type: 'number', label: 'Max', name: 'max',show:{'matches':{"name":"choices","value":""}}},
			{type: 'number', label: 'Min', name: 'min',placeholder:'1',show:{'not_matches':{"name":"max","value":0}}},
			{type: 'number', label: 'Step', name: 'step',placeholder:'1',show:{'not_matches':{"name":"max","value":0}}},
			// {type: 'fieldset', name:'default', legend: 'default Option',flatten:false, fields:[
			// 	{type: 'fieldset', label: false, multiple: {duplicate: false},flatten:false, name: 'default', fields: [
			// 		{label: 'Label'},
			// 		{label: 'Value'}
			// 	]}
			// ]}
		]},
		{type: 'fieldset', name:'choices_c', legend: '<i class="fa fa-th-list"></i> Options', hideLabel: true,  inline: true, fields:[
			{type: 'fieldset', label: false, multiple: {duplicate: true}, name: 'options', fields: [
				{label: 'Label'},
				{label: 'Value',show:{'not_matches':{"name":"value_key","value":"index"}}}
			]}
		]}
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryFormEditor.call(this, container, 'tabs'),
		get: get,
		set: set
	}
}

Cobler.types.checkbox = function(container) {
	function render() {
		item.container = 'span';
		return templates['berry_checkbox'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'checkbox';
		item.isEnabled = true;

		item.type = 'checkbox';
		return item;
	}

	function toJSON(opts) {
		var temp = get();
		
		if(!opts.editor){
			var initial = {
				"isEnabled": true,
				"widgetType": "checkbox",
				"placeholder": "",
				"value": false,
				"name": "",
				"help": "",
				"required": false
			}
			temp = _.omitBy(temp,'validate');
			
			temp = _.omitBy(Berry.normalizeItem(temp, 0), function(v, k) {
				return initial[k] === v;
			})
			temp = _.omitBy(temp,'required');
			}

			return temp;
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'checkbox',
		type: 'checkbox',
		label: 'Label',
		isEnabled: true
	}
	var fields = [
		{type: 'fieldset', name:'basics', legend: 'General', hideLabel: true, inline: true, fields:[
			
		{type: 'text', required: true, label: 'Field Label', name: 'label'},
		{type: 'text', label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Default Value', name: 'value'},
		{type: 'fieldset', name:'validate', legend: false,label:false, fields:[
			{type: 'checkbox', label: 'Required', name: 'required'}
			]},
		{type: 'textarea', label: 'Instructions', name: 'help'},
	]}]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryFormEditor.call(this, container, 'tabs'),
		get: get,
		set: set,
	}
}

Cobler.types.fieldset = function(container) {
	function render() {
		var temp = get();
		temp.item = {legend : temp.legend};
		return templates['berry_base_fieldset'].render(temp, templates);
	}
	function get() {
		item.widgetType = 'fieldset';
		item.isEnabled = true;

		item.type = 'fieldset';
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'fieldset',
		type: 'fieldset',
		legend: 'Label',
		duplicate: false
	}
	var fields = [
		{type: 'text', required: true, label: 'Fieldset Legend', name: 'legend'},
		{type: 'text', required: true, label: 'Name', name: 'name'},
		{type: 'checkbox', label: 'Duplicate', name: 'duplicate'},
	]
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryFormEditor.call(this, container, 'tabs'),
		get: get,
		set: set,
	}
}

berryFormEditor = function(container, renderer){
	return function(){
		var formConfig = $.extend(true, {}, {
			renderer: renderer || 'base', 
			attributes: this.get(), 
			fields: this.fields,
			autoDestroy: true,
			inline:true
		}, this.formOptions || {});

		var opts = container.owner.options;
		var events = 'save';
		if(typeof opts.formTarget !== 'undefined' && opts.formTarget.length){
			formConfig.actions = false;
			events = 'change';
		}	
		var myBerry = new Berry(formConfig, opts.formTarget || $(container.elementOf(this)));
		myBerry.on(events, function(){
			if(myBerry.validate()){
				// debugger;
		 	container.update($.extend({},this.get(),myBerry.toJSON()), this);
		 	// container.deactivate();
		 	// myBerry.trigger('saved');
			}
		}, this);
		myBerry.on('cancel',function(){
		 	container.update(this.get(), this)
		 	container.deactivate();
		}, this)
		return myBerry;
	}
}
