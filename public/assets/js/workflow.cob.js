myconditions=[
	{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
		return !!field.parent.index;
	}}]},
	{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
	{label: 'Name',name:"name",show:[{type:'matches',name:"type",value:["matches","not_matches","contains","requires"]}]},
	{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1},show:[{type:'matches',name:"type",value:["matches","not_matches","contains"]}]},
	{name:'conditions',columns:10,offset:1,type:'fieldset',array:true,show:[{type:'matches',name:"type",value:"conditions"}],fields:[
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
			return !!field.parent.index;
		}}]},
		{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires']},
		{label: 'Name',name:"name"},
		{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1}}
	]}
]

baseFields = _.map([
	{type: 'text', required: true, title: 'Field Label', name: 'label'},
	{type: 'text', label: 'Name', name: 'name'},
	{type: 'text', label: 'Placeholder', name: 'placeholder',parse:[{type:"requires",name:"placeholder"}],show:[{name:"type",value:['radio','checkbox','switch'],type:"not_matches"}]},
	{type: 'text', label: false, forceRow:true, pre: "Pre", name: 'pre',parse:[{type:"requires",name:"pre"}],show:[{name:"type",value:['radio','checkbox','switch','color'],type:"not_matches"}]},
	{type: 'text', label: false, post:"Post", name: 'post',parse:[{type:"requires",name:"post"}],show:[{name:"type",value:['radio','checkbox','switch'],type:"not_matches"}]},
	{type: 'text', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires",name:"value"},{name:"type",value:['color','number','checkbox','switch','textarea'],type:"not_matches"}],show:[{name:"type",value:['color','number','checkbox','switch','textarea'],type:"not_matches"}]},
	{type: 'textarea', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires",name:"value"},{name:"type",value:'textarea',type:"matches"}],show:[{name:"type",value:'textarea',type:"matches"}]},
	{type: 'color', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires",name:"value"},{type:"not_matches",name:"value",value:'#000000'},{name:"type",value:'color',type:"matches"}],show:[{name:"type",value:'color',type:"matches"}]},
	// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
	{type: 'number', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires",name:"value"},{name:"type",value:'number',type:"matches"}],show:[{name:"type",value:'number',type:"matches"}]},
	{type: 'checkbox', label: 'Default value', name: 'value',parse:[{type:"not_matches",name:"value",value:false},{type:"matches",name:"type",value:["checkbox","switch"]}],show:[{type:"matches",name:"type",value:["checkbox","switch"]}]},
	{type: 'textarea',columns:12, label: 'Instructions', name: 'help',parse:[{type:"requires",name:"help"}],show:[{name:"type",value:['output'],type:"not_matches"}]},
	{type: 'checkbox', label: 'Mupltiple Selections', name: 'multiple',min:1,show:[{name:"type",value:['select','radio'],type:"matches"}]},
	{type: 'number', label: 'Limit Selections',parse:[{type:"requires",name:"limit"}],placeholder:"No Limit", name: 'limit',min:1,show:[{name:"type",value:['select','radio'],type:"matches"},{name:"multiple",value:true,type:"matches"}]},
	{type: 'number', label: 'Limit Length', name: 'limit',min:1,parse:[{type:"requires",name:"limit"}],show:[{name:"type",value:['select','radio'],type:"not_matches"}]}
],function(item){
	item.target = "#collapseBasic .panel-body";
	return item;
}).concat(_.map([

	{type: 'number', label: 'Size', name: 'size',min:1,parse:[{type:"requires",name:"size"}],show:[{name:"type",value:['textarea','select','radio'],type:"matches"}]},

	{type: 'select', label: 'Width', value:"12", name: 'columns', min:1, max:12, format:{label:"{{value}} Column(s)"},parse:[{type:"not_matches",name:"columns",value:"12"}] },
	{type: 'checkbox', label: 'Force New Row', name: 'forceRow',show:[{name:"columns",value:["12"],type:"not_matches"}]},

	{name:"horizontal",label:"Horizontal",type:"select",value:"i",parse:[{type:"not_matches",name:"horizontal",value:"i"}],options:[{label:"Inherit",value:"i"},{label:"Yes",value:true},{label:"No",value:false}]},
	{type: 'switch', label: 'Allow duplication', name: 'array',parse:[{type:"not_matches",name:"array",value:false}], show:[{name:"type",value:['output'],type:"not_matches"}]},
	{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
		{type: 'number', label: 'Minimum', name: 'min',value:1,placeholder:1},
		{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
	]}
],function(item){
	item.target = "#collapseDisplay .panel-body";
	return item;
})


)
baseCond = _.map([
	{type: 'select',other:true, columns:12, label:'Show the field <span class="pull-right text-muted">"show"</span>', value:true, name:"show",parse:[{type:"not_matches",name:"show",value:true}],options:		
		[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Edit"',value:'edit'}, {label:"Conditionally",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"show",fields:myconditions,array:true,show:[{name:"show",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:'Allow the field to be Edited <span class="pull-right text-muted">"edit"</span>', value:true,name:"edit",parse:[{type:"not_matches",name:"edit",value:true}],options:		
		[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"edit",fields:myconditions,array:true,show:[{name:"edit",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:'Include value in results <span class="pull-right text-muted">"parse"</span>', value:'show',name:"parse",parse:[{type:"not_matches",name:"parse",value:"show"}],options:		
		[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}",name:"parse",fields:myconditions,array:true,show:[{name:"parse",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:"Required", value:false, name:"required",parse:[{type:"not_matches",name:"required",value:false}],options:		
		[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Show"',value:'show'},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Parse"',value:'show'}, {label:"Conditionally",value:"other"}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:"{{index}}", name:"required", fields:myconditions, array:true, show:[{name:"required",value:['other'], type:"matches"}]}
],function(item){
	item.target = "#collapseConditions .panel-body";
	return item;
})


baseConditions = baseCond.concat(_.map([
	{type: 'switch', label: 'Validate', name: 'validate',parse:[{type:"not_matches",name:"validate",value:false}]},
	{type: 'fieldset',columns:12, label:"{{index}}{{^index}}Validations{{/index}}", show:[{name:"validate",value:true,type:"matches"}],name:"validate",fields:[
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
			return !!field.parent.index;
		}}]},
		{name:'type',label:'Type',type:'select',options:['none','matches','date','valid_url','valid_email','length','numeric','pattern']},
		{name:'regex',label:"Regex",show:[{name:"type",value:['pattern'],type:"matches"}]},
		{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
		{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'select',other:true,value:true,columns:12, label:"Apply",name:"conditions", show:[{name:"type",value:['none'],type:"not_matches"}], options:		
			[{label:'Always',value:true},{label:"Conditionally",value:"other"}]
		},
		{type: 'fieldset',columns:11,offset:1, label:"{{index}}{{^index}}Conditions{{/index}}",name:"conditions",fields:myconditions,array:true,show:[{name:"conditions",value:['other'],type:"matches"}]}
	],array:true}
],function(item){
	item.target = "#collapseValidation .panel-body";
	return item;
}))
gformEditor = function(container){
	return function(){
		var formConfig = {
			// sections: 'tab'
			name:"editor",
			default:{type:"text",columns:6},
			data: this.get(),
			fields: this.fields,
			autoDestroy: true,
			legend: 'Edit '+ this.get()['widgetType'],
			cobler:this,
			actions:[{type:"button",name:"deativate",action:"deactivate",label:"Done",target:"#display",modifiers:"btn btn-info pull-right"}],
			clear:false
		}
		var opts = container.owner.options;

		if(typeof gform.instances.editor !== 'undefined'){
			// debugger;
			gform.instances.editor.destroy();
		}
		$(opts.formTarget).html(gform.renderString(accordion))

		$('.panelOptions').toggle(!!_.find(formConfig.fields,{name:"options"}));
		var temp = _.find(formConfig.fields,{name:"name"});
		temp.placeholder =  formConfig.data['label'].toLowerCase().split(' ').join('_');
		var mygform = new gform(formConfig,$(opts.formTarget)[0] ||  $(container.elementOf(this))[0]);
		mygform.on('change:label',function(e){
			if(e.field.name == 'label' && e.form.get('name') == ""){
				e.form.find('name').update({placeholder:e.form.get('label').toLowerCase().split(' ').join('_')})
			}		
		}.bind(this))
		mygform.on('input', function(e){
		 	container.update(e.form.get(), this);
		}.bind(this));
		mygform.on('cancel',function(){
		 	container.update(this.get(), this)
		}.bind(this));
		mygform.on('manage',function(e){
			var testForm = new gform(myform)
			
			if(e.form.get('name') == ""){
				if(typeof testForm.find(e.form.get('label').toLowerCase().split(' ').join('_')) == 'undefined'){
					e.form.find('name').update({value:e.form.get('label').toLowerCase().split(' ').join('_')})
				}else{
					e.form.find('name').update({value:gform.getUID()})
				}
			}
		 	container.update(mygform.toJSON(), this);
			path.push(e.form.get('name'));
			cb.deactivate();
			renderBuilder()
		}.bind(this))

		mygform.on('destroy',function(e){
			if(container.indexOf(this) !== -1){

				var testForm = new gform(myform)

				if(e.form.get('name') == "" && typeof e.form.get('label') !== 'undefined'){
					if(typeof testForm.find(e.form.get('label').toLowerCase().split(' ').join('_')) == 'undefined'){
						e.form.find('name').set(e.form.get('label').toLowerCase().split(' ').join('_'))
					}else{
						e.form.find('name').set(gform.getUID())
					}
					container.update(e.form.get(), this);
				}
			}

		}.bind(this))
		mygform.on('deactivate',cb.deactivate)
	}
}
Cobler.types.input = function(container) {
	function render(){
        var data = get();
        if(item.type == 'output'){
            data.display = gform.renderString((data.format|| {}).value||'{{{value}}}', data);
        }
        
        return gform.types[item.type].render.call(_.extend({},(gform.types[item.type]||gform.types['text']).defaults,myform.default,data));
	}
	function get() {
		item.widgetType = 'input';
		item.editable = true;
		item.type = item.type || 'text';
		return _.extend({},item);
	}
	function toJSON() {
		return _.omit(get(),'widgetType','editable')
	}
	function set(newItem){
		item = newItem;
	}
	var item = {
		widgetType: 'input',
		label: 'Label',
		editable: true
	}

	var fields = [{target:"#display", type: 'smallcombo',columns:9, label: false, name: 'type', value: 'text', parse: [{type:"not_matches",name:"type",value:"text"}], 'options': [
		{label: 'Single Line', value: 'text'},
		{label: 'Multi-line', value: 'textarea'},
		{label: 'Phone', value: 'tel'},
		{label: 'Url', value: 'url'},
		{label: 'Email', value: 'email'},
		{label: 'Date', value: 'date'},
		{label: 'Number', value: 'number'},
		{label: 'Password', value: 'password'},
		{label: 'Color', value: 'color'},
		{label: 'Output', value: 'output'},
		{label: 'Hidden', value: 'hidden'}
	]}].concat(baseFields, baseConditions)
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set
	}
}

Cobler.types.collection = function(container) {
	function render() {
		var options = get()
		
		var temp = _.find(options.options,{value: options.value}) || (options.options||[])[0]
		if(typeof temp !== 'undefined') {
			temp.selected = true;
		}
		// options.multiple = (options.limit>1 || options.limit == 0);
		
		return gform.render(item.type, _.extend({},myform.default,options));
	}
	function get() {		
		item.widgetType = 'collection';
		item.editable = true;
		return item;
	}
	function toJSON() {
		return _.omit(get(),'widgetType','editable')
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'collection',
		type: 'select',
		label: 'Label',
		editable: true
	}
	var fields = [

		{target:"#display",type: 'smallcombo',columns:9, label: false, name: 'type', value: 'text', 'options': [
			{label: 'Dropdown', value: 'select'},
			{label: 'List', value: 'radio'},
			{label: 'Combobox', value: 'smallcombo'},
			// {label: 'Scale', value: 'scale'},
			{label: 'Range', value: 'range'},
			// {label: 'Grid', value: 'grid'},
		]}
	].concat(baseFields,baseConditions,_.map([
		{type: 'fieldset', label: "Format",columns:12, name: 'format',parse:[{type:"requires",name:"format"}], fields:[
			{name:"label",label:"Label",parse:[{type:"requires",name:"label"}]},
			{name:"value",label:"Value",parse:[{type:"requires",name:"value"}]},
			{name:"display",label:"Display",show:[{type:"matches",value:"smallcombo",name:"type"}]}
			// {name:"Title",label:"title"}
		] },
		{type: 'fieldset', label: false, array: true,columns:12, name: 'options', 
			fields: [
				{label: 'Section Label (optional)', name:"label"},
				{label: 'Type',type:"select",parse:false, name:"options_type",options:[{label:"External",value:"string"},{label:"Derived",value:"int"},{label:"Manual",value:"object"}],value:function(e){
					var result = "object";
					// if(result == 'undefined' && (typeof e.field.parent.get()['max'] !== 'undefined')) {
					// 	result = 'int';
					// }
					if(typeof e.field.parent.value['max'] !== 'undefined'){
						result = "int";
					}
					if(typeof e.field.parent.value['path'] !== 'undefined'){
						result = "string";
					}
					return result;

				}},
				{name:"type",type:"hidden",value:"optgroup"},
				{type: 'fieldset', label: false, array: true, name: 'options', fields:[
					{name:"label",label:"Label",parse:[{type:"requires",name:"label"}]},
					{name:"value",label:"Value",parse:[{type:"requires",name:"value"}]}
				],show:[{type:"matches",name:"options_type",value:"object"}]},

				{type: 'text', label: "Url", name: 'path',show:[{type:"matches",name:"options_type",value:"string"}]},
				{type: 'number', label: "Min", name: 'min',placeholder:"1",show:[{type:"matches",name:"options_type",value:"int"}]},
				{type: 'number', label: "Max", name: 'max',required:true,show:[{type:"matches",name:"options_type",value:"int"}]},
				{type: 'fieldset', label: "Format",columns:12, name: 'format',parse:[{type:"requires",name:"format"}], fields:[
					{name:"label",label:"Label",parse:[{type:"requires",name:"label"}]},
					{name:"value",label:"Value",parse:[{type:"requires",name:"value"}]},
					{name:"display",label:"Display",show:[{type:"matches",value:"smallcombo",name:"type"}]}
					// {name:"Title",label:"title"}
				] }
				// {label: 'Option Type',name:"options"}
			]
		}
	],function(item){
		item.target = "#collapseOptions .panel-body";
		return item;
	}))
//{type:"optgroup",label:"stuff",format:{"label":'{{label}}'}, options:[3,4,5,9]},
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set
	}
}

Cobler.types.bool = function(container) {
	function render() {
	
	var options = get();

	(_.defaults(options.options,[{value:false},{value:true}]) ) [options.value?1:0].selected = true;
	return gform.render(item.type, _.extend({},myform.default,options));

	}
	function get() {
		item.widgetType = 'bool';
		item.editable = true;

		// item.type = 'checkbox';
		return _.extend({},item);
	}
	function toJSON() {

		return _.omit(get(),'widgetType','editable')
		// return  _.transform(get(),function(r,v) {_.extend(r,v)},{});//get();
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {
		widgetType: 'bool',
		type: 'checkbox',
		label: 'Label',
		editable: true
	}
	var fields = [
		{target:"#display",type: 'select',columns:9, label: false, name: 'type', value: 'text', 'options': [
			{label: 'Checkbox', value: 'checkbox'},
			{label: 'Switch', value: 'switch'}
		]}
	].concat(baseFields,baseConditions,_.map([{type: 'fieldset', label: false, array: {min:2,max:2},columns:12, name: 'options', fields: [
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Label','name':'label'},
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Value','name':'value'},
	]}],function(item){
		item.target = "#collapseOptions .panel-body";
		return item;
	}))
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set,
	}
}

Cobler.types.section = function(container) {
	function render() {
		var temp = get();

		var content = "";
		_.each(temp.fields,function(e){
			var nTemp = new Cobler.types[gform.types[e.type].base]()
			nTemp.set(e);
			content += nTemp.render()
		})
		var html = $(gform.render('_fieldset', _.extend({},myform.default,temp)));
		html.find('fieldset').append(content)
    	return html.html();
	}
	function get() {
		item.widgetType = 'section';
		item.editable = true;
		item.type = 'fieldset';

		item.fields = item.fields ||[];
		return item;
	}
	function toJSON() {
		return _.omit(get(),'widgetType','editable')
	}
	function set(newItem) {
		var fields = item.fields||newItem.fields;
		item = newItem;
		item.fields = fields;
	}
	var item = {
		widgetType: 'section',
		type: 'fieldset',
		label: 'Label'
	}
	var fields = [
		{target: "#collapseBasic .panel-body", type: 'text', required: true, label: 'Group Label', name: 'label'},
		{target: "#collapseBasic .panel-body", type: 'text', required: true, label: 'Name', name: 'name'},
		{target: "#collapseBasic .panel-body", type: 'switch', label: 'Allow duplication', name: 'array', show:[{name:"type",value:['output'],type:"not_matches"}]},
		{target: "#collapseBasic .panel-body", type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
			{type: 'number', label: 'Minimum', name: 'min',value:1,placeholder:1},
			{type: 'number', label: 'Maximum', name: 'max',placeholder:5}
        ]},
		{target: "#display",columns:9, type:"button",modifiers:"btn btn-default pull-left margin-bottom",label:"Manage Fields",action:"manage",name:"manage",show:[{type:"test",name:"manage",test:function(e){
            return !e.owner.options.nomanage;
		}}]}
	].concat(baseCond)
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: gformEditor.call(this, container),
		get: get,
		set: set,
	}
}



var accordion = `
<form>
<div id="display"></div>
<div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">

<div class="panel panel-default">
  <div class="panel-heading" role="tab" id="headingBasic">
    <h4 class="panel-title">
      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseBasic" aria-expanded="true" aria-controls="collapseBasic">
Basic
      </a>
    </h4>
  </div>
  <div id="collapseBasic" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingBasic">
    <div class="panel-body">
    </div>
  </div>
</div>


<div class="panel panel-default">
  <div class="panel-heading" role="tab" id="headingDisplay">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseDisplay" aria-expanded="false" aria-controls="collapseDisplay">
Display
      </a>
    </h4>
  </div>
  <div id="collapseDisplay" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingDisplay">
    <div class="panel-body">
    </div>
  </div>
</div>



<div class="panel panel-default">
  <div class="panel-heading" role="tab" id="headingConditions">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseConditions" aria-expanded="false" aria-controls="collapseConditions">
Conditions
      </a>
    </h4>
  </div>
  <div id="collapseConditions" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingConditions">
    <div class="panel-body">
    </div>
  </div>
</div>


<div class="panel panel-default">
  <div class="panel-heading" role="tab" id="headingValidation">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseValidation" aria-expanded="false" aria-controls="collapseValidation">
Validation
      </a>
    </h4>
  </div>
  <div id="collapseValidation" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingValidation">
    <div class="panel-body">
    </div>
  </div>
</div>



<div class="panel panel-default panelOptions">
  <div class="panel-heading" role="tab" id="headingOptions">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOptions" aria-expanded="false" aria-controls="collapseOptions">
Options
      </a>
    </h4>
  </div>
  <div id="collapseOptions" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOptions">
    <div class="panel-body">
    </div>
  </div>
</div>

</div>
</form>
`