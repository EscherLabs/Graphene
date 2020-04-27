myconditions=[
	{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
		return true;
	}}]},
	{type: 'fieldset',label:false,name:"conditions",columns:12,fields:
	[
		{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires','conditions']},
		{label: 'Name',name:"name",show:[{type:'matches',name:"type",value:["matches","not_matches","contains","requires"]}]},
		{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1},show:[{type:'matches',name:"type",value:["matches","not_matches","contains"]}]},
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:'matches',name:"type",value:"conditions"}]},
		{label:'Condition',name:'conditions',columns:10,offset:1,type:'fieldset',array:true,show:[{type:'matches',name:"type",value:"conditions"}],fields:[
			{label:"Type",name:"type",type:"select",options:['matches','not_matches','contains','requires']},
			{label: 'Name',name:"name"},
			{ label: 'Value{{#index}}({{index}}){{/index}}',name:"value", array: {min:1}}
		]}
	]
	,array:true},

	
]
displayFields = _.map([

	{type: 'number', label: 'Size', name: 'size',min:1,parse:[{type:"requires",name:"size"}],show:[{name:"type",value:['textarea','select','radio'],type:"matches"}]},
	{name:"horizontal",label:"Horizontal",type:"select",value:"i",parse:[{type:"not_matches",name:"horizontal",value:"i"}],options:[{label:"Inherit",value:"i"},{label:"Yes",value:true},{label:"No",value:false}]},
	{type: 'switch', label: 'Force New Row {{#value}}- <span class="text-success">Yes</span>{{/value}}', name: 'forceRow',show:[{name:"columns",value:[12],type:"not_matches"},{name:"columns",type:"requires"}],parse:[{type:"requires"},{name:"columns",value:[12],type:"not_matches"},{name:"columns",type:"requires"}],format:{label:''}},

	{type: 'select', label: 'Width',forceRow:true, value:12, name: 'columns', min:1, max:12, format:{label:"{{value}} Column(s)",value:function(e){
		return parseInt(e.value);
	}},parse:[{type:"not_matches",name:"columns",value:12}],value:function(e){
			return parseInt(e.initial.value||12)
	} },

	{type: 'select', label: 'Offset',value:0, name: 'offset', min:0, max:11, format:{label:"{{value}} Column(s)",value:function(e){
		return parseInt(e.value);
	}},parse:[{type:"not_matches",name:"columns",value:12},{type:"not_matches",value:0}],show:[{name:"columns",value:[12],type:"not_matches"},{name:"columns",type:"requires"}],value:function(e){
		return parseInt(e.initial.value||0)
	}},	
	
	
	
	{type: 'switch', label: 'Allow duplication',forceRow:true,format:{label:''}, name: 'array',parse:[{type:"not_matches",name:"array",value:false}], show:[{name:"type",value:['output'],type:"not_matches"}]},

	{type: 'fieldset',columns:12, label:false,name:"array",show:[{name:"array",value:true,type:"matches"},{name:"type",value:['output'],type:"not_matches"}],fields:[
		{type: 'number', label: 'Minimum', name: 'min',placeholder:1},
		{type: 'number', label: 'Maximum', name: 'max',placeholder:5},


		// {type: 'fieldset',columns:12, label: 'Append', name: 'append',fields:[
		// 	{type: 'radio',size:0, label: 'Enable', name: 'enable',options:[{label:"No",value:false},{label:"Yes",value:true},{label:"Auto",value:'auto'}]},
		// 	{type: 'text', label: 'Label', name: 'label',placeholder:'default'}
		// ]},		
		{ type: 'fieldset',columns:12, label: 'Duplicate', name: 'duplicate',fields:[
			{type: 'radio', label: 'Enable', value:"auto", name: 'enable',options:[{label:"No",value:false},{label:"Yes",value:true},{label:"Auto",value:'auto'}]},
			{type: 'text', label: 'Label', name: 'label',placeholder:'default'}
		]},	
		{ type: 'fieldset',columns:12, label: 'Remove', name: 'remove',fields:[
			{type: 'radio', label: 'Enable', value:"auto", name: 'enable',options:[{label:"No",value:false},{label:"Yes",value:true},{label:"Auto",value:'auto'}]},
			{type: 'text', label: 'Label', name: 'label',placeholder:'default'}
		]},
	]},
	// {type: 'textarea',columns:12, label: 'Template', name: 'template',parse:[{type:"requires"}]}

],function(item){
	item.target = "#collapseDisplay .panel-body";
	return item;
})
baseFields = _.map([
	{type: 'text', required: true, title: 'Field Label', name: 'label'},
	{type: 'text', label: 'Name', name: 'name'},
	{type: 'text', label: 'Placeholder', name: 'placeholder',parse:[{type:"requires",name:"placeholder"}],show:[{name:"type",value:['radio','checkbox','switch'],type:"not_matches"}]},
	{type: 'text', label: 'Display', name: 'display',columns:12,parse:[{type:"requires"}],show:[{name:"type",value:['checkbox'],type:"matches"}]},
	{type: 'text', label: "&nbsp;", post:"Post", name: 'post',parse:[{type:"requires"}],show:[{name:"type",value:['select'],type:"matches"}]},
	{type: 'text', label: false, forceRow:true, pre: "Pre", name: 'pre',parse:[{type:"requires"}],show:[{name:"type",value:['radio','checkbox','switch','color','select'],type:"not_matches"}]},
	{type: 'text', label: false, post:"Post", name: 'post',parse:[{type:"requires"}],show:[{name:"type",value:['radio','checkbox','switch','color','select'],type:"not_matches"}]},

	// {type: 'switch', label: 'Validate', name: 'validate',format:{label:''},parse:[{type:"not_matches",name:"validate",value:false}]},


	{type: 'smallcombo', label: 'Value Calculation', name: 'method',columns:12,parse:[{type:"requires"},{name:"type",value:['color','checkbox','switch','textarea'],type:"not_matches"}],show:[{name:"type",value:['color',,'checkbox','switch','textarea'],type:"not_matches"}],options:[
		"None",{type:'optgroup',options:'methods',format:{label:"Method: {{label}}"}}]
	},
	{type: 'text', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires"},{name:"type",value:['color','number','checkbox','switch','textarea'],type:"not_matches"}],show:[{name:"type",value:['color','number','checkbox','switch','textarea'],type:"not_matches"}]},
	{type: 'textarea', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires"},{name:"type",value:'textarea',type:"matches"}],show:[{name:"type",value:'textarea',type:"matches"}]},
	{type: 'color', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires"},{type:"not_matches",name:"value",value:'#000000'},{name:"type",value:'color',type:"matches"}],show:[{name:"type",value:'color',type:"matches"}]},
	// {type: 'date', label: 'Default value', name: 'value',columns:6,show:[{name:"type",value:'date',type:"matches"}]},
	{type: 'number', label: 'Default value', name: 'value',columns:12,parse:[{type:"requires"},{name:"type",value:'number',type:"matches"}],show:[{name:"type",value:'number',type:"matches"}]},
	{type: 'checkbox', label: 'Default value', name: 'value',parse:[{type:"not_matches",name:"value",value:false},{type:"matches",name:"type",value:["checkbox","switch"]}],show:[{type:"matches",name:"type",value:["checkbox","switch"]}]},


	{type: 'number', label: "Min", name: 'min',placeholder:0,columns:4,show:[{type:"matches",name:"type",value:"number"}],parse:[{type:"matches",name:"type",value:"number"},{type:"requires"}]},
	{type: 'number', label: "Max", name: 'max',columns:4,show:[{type:"matches",name:"type",value:"number"}],parse:[{type:"matches",name:"type",value:"number"},{type:"requires"}]},
	{type: 'number', label: "Step", name: 'step',columns:4,show:[{type:"matches",name:"type",value:"number"}],parse:[{type:"matches",name:"type",value:"number"},{type:"requires"}]},
	
	{type: 'date', label: "Min", name: 'min',columns:4,show:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:false}],parse:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:false},{type:"requires"}]},
	{type: 'date', label: "Max", name: 'max',columns:4,show:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:false}],parse:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:false},{type:"requires"}]},
	{type: 'select', label: "Min", name: 'min',columns:4,show:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:true}],parse:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:true},{type:"requires"}],options:function(e){
		return [];//gform.instances.modal.filter({type:"date"});
	},placeholder:"None",format:{value:'{{name}}'}},
	{type: 'select', label: "Max", name: 'max',columns:4,show:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:true}],parse:[{type:"matches",name:"type",value:"date"},{type:"matches",name:"minMaxType",value:true},{type:"requires"}],options:function(e){
		return [];//gform.instances.modal.filter({type:"date"});

	},placeholder:"None",format:{value:'{{name}}'}},
	{type: 'switch', label: "",columns:4, name: 'minMaxType',show:[{type:"matches",name:"type",value:"date"}],parse:false,options:[{label:"Date",value:false},{label:"Field",value:true}]},
	
	{type: 'textarea',columns:12, label: 'Instructions', name: 'help',parse:[{type:"requires"}],show:[{name:"type",value:['output'],type:"not_matches"}]},
	{type: 'textarea',columns:12, label: 'More Information', name: 'info',parse:[{type:"requires"}]},
	{type: 'checkbox', label: 'Multiple Selections', name: 'multiple',min:1,show:[{name:"type",value:['select','radio'],type:"matches"}]},
	{type: 'number', label: 'Limit Selections',parse:[{type:"requires"}],placeholder:"No Limit", name: 'limit',min:1,show:[{name:"type",value:['select','radio'],type:"matches"},{name:"multiple",value:true,type:"matches"}]},
	{type: 'number', label: 'Limit Length', name: 'limit',min:1,parse:[{name:"type",value:['select','radio'],type:"not_matches"},{type:"requires"}],show:[{name:"type",value:['select','radio'],type:"not_matches"}]},
	{type: 'checkbox', label: 'Fillable',forceRow:true, value:true, name: 'fillable',parse:[{type:"not_matches",value:true}]}

],function(item){
	item.target = "#collapseBasic .panel-body";
	return item;
}).concat(displayFields)
minCond = [
	{type: 'select',other:true, columns:12, label:'Show the field <span class="pull-right text-muted">"show"</span>', value: true, name:"show",parse:[{type:"not_matches",name:"/show",value:true}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Edit"',value:'edit'}, {label:"Conditionally",value:"other"}]}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"show",fields:myconditions,array:{min:1,max:1},show:[{name:"/show",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:'Allow the field to be Edited <span class="pull-right text-muted">"edit"</span>', value:true,name:"edit",parse:[{type:"not_matches",name:"/edit",value:true}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"edit",fields:myconditions,array:{min:1,max:1},show:[{name:"/edit",value:['other'],type:"matches"}]},

]
baseCond =minCond.concat([

	{type: 'select',other:true, columns:12, label:'Include value in data <span class="pull-right text-muted">"parse"</span>', value:'show',name:"parse",parse:[{type:"not_matches",name:"parse",value:"show"}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"parse",fields:myconditions,array:{min:1,max:1},show:[{name:"parse",value:['other'],type:"matches"}]},
	

	{type: 'select',other:true, columns:12, label:"Required", value:false, name:"required",parse:[{type:"not_matches",name:"required",value:false}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'},{label:'Use same settings as "Parse"',value:'parse'}, {label:"Conditionally",value:"other"}]} ]	
	},
	{type: 'fieldset',columns:11,offset:'1', label:false, name:"required", fields:myconditions, array:{min:1,max:1}, show:[{name:"required",value:['other'], type:"matches"}]}
	
])

if(typeof workflow !== 'undefined'){

baseCond =[
	{type: 'select',other:true, columns:12, label:'Show the field <span class="pull-right text-muted">"show"</span>', value: true, name:"show",parse:[{type:"not_matches",name:"show",value:true}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Edit"',value:'edit'}, {label:"Conditionally",value:"other"}]},{type:'optgroup',label:"Methods",options:'methods',format:{value:"method:{{value}}",label:"Method: {{label}}"}}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"show",fields:myconditions,array:{min:1,max:1},show:[{name:"show",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:'Allow the field to be Edited <span class="pull-right text-muted">"edit"</span>', value:true,name:"edit",parse:[{type:"not_matches",name:"edit",value:true}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Parse"',value:'parse'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]},{type:'optgroup',label:"Methods",options:'methods',format:{value:"method:{{value}}",label:"Method: {{label}}"}}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"edit",fields:myconditions,array:{min:1,max:1},show:[{name:"edit",value:['other'],type:"matches"}]},

	{type: 'select',other:true, columns:12, label:'Include value in data <span class="pull-right text-muted">"parse"</span>', value:'show',name:"parse",parse:[{type:"not_matches",name:"parse",value:"show"}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]},{type:'optgroup',label:"Methods",options:'methods',format:{value:"method:{{value}}",label:"Method: {{label}}"}}]
	},
	{type: 'fieldset',columns:11,offset:'1', label:false,name:"parse",fields:myconditions,array:{min:1,max:1},show:[{name:"parse",value:['other'],type:"matches"}]},
	

	{type: 'select',other:true, columns:12, label:"Required", value:false, name:"required",parse:[{type:"not_matches",name:"required",value:false}],options:		
		[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'},{label:'Use same settings as "Parse"',value:'parse'}, {label:"Conditionally",value:"other"}]},{type:'optgroup',label:"Methods",options:'methods',format:{value:"method:{{value}}",label:"Method: {{label}}"}} ]	
	},
	{type: 'fieldset',columns:11,offset:'1', label:false, name:"required", fields:myconditions, array:{min:1,max:1}, show:[{name:"required",value:['other'], type:"matches"}]}
	
]

	baseCond.splice(6,0,	{type: 'select',other:true, columns:12, label:'Include value in report <span class="pull-right text-muted">"report"</span>', value:'show',name:"report",parse:[{type:"not_matches",name:"report",value:"show"}],options:		
			[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'},{label:'Use same settings as "Show"',value:'show'},{label:'Use same settings as "Parse"',value:'parse'}, {label:"Conditionally",value:"other"}]},{type:'optgroup',label:"Methods",options:'methods',format:{value:"method:{{value}}",label:"Method: {{label}}"}}]
		},
		{type: 'fieldset',columns:11,offset:'1', label:false,name:"report",fields:myconditions,array:{min:1,max:1},show:[{name:"report",value:['other'],type:"matches"}]},
	)
}



baseCond = _.map(baseCond,function(item){
	item.target = "#collapseConditions .panel-body";
	return item;
})


baseConditions = baseCond.concat(_.map([
	{type: 'switch', label: 'Validate', name: 'validate',format:{label:''},parse:[{type:"not_matches",name:"validate",value:false}]},

	{type: 'fieldset',columns:12, label:false, show:[{name:"validate",value:true,type:"matches"}],name:"validate",fields:[
		{label: false,columns:12,name:'op',type:"switch",format:{label:'{{label}}'},options:[{label:"or",value:'or'},{label:"and",value:'and'}],value:'and',show:[{type:"test",name:"op",test:function(field,args){
			return !!field.parent.index;
		}}]},
		{name:'type',label:'Type',type:'select',options:[
			{type:'optgroup',options:['none','matches','date','valid_url','valid_email','length','numeric','pattern','custom']}
		]
	},


	{name:'test',label:"Method",show:[{name:"type",value:['custom'],type:"matches"}],type:'smallcombo',options:	[{type:'optgroup',label:"Methods",options:'methods',format:{value:"{{value}}",label:"Method: {{label}}"}}]},
	{name:'regex',forceRow:true,label:"Regex",show:[{name:"type",value:['pattern'],type:"matches"}]},
	{name:'flags',label:"Flags",show:[{name:"type",value:['pattern'],type:"matches"}]},
	{name:'message',columns:12,label:"Message",show:[{name:"type",value:['pattern'],type:"matches"}]},
	{name:'name',label:"Name",show:[{name:"type",value:['matches'],type:"matches"}]},
		{type: 'number', label: 'Minimum', name: 'min',value:1,columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'number', label: 'Maximum', name: 'max',columns:3,show:[{name:"type",value:['numeric','length'],type:"matches"}]},
		{type: 'select',other:true,value:true,columns:12, label:"Apply",name:"conditions", show:[{name:"type",value:['none'],type:"not_matches"}], options:		
			[{label:'Always',value:true},{label:"Conditionally",value:"other"}]
		},
		{type: 'fieldset',columns:11,offset:1, label:"Conditions",name:"conditions",fields:myconditions,array:{min:1,max:1},show:[{name:"conditions",value:['other'],type:"matches"}]}
	],array:true}
],function(item){
	item.target = "#collapseValidation .panel-body";
	return item;
}))


if(typeof workflow == 'undefined'){
	baseConditions = baseConditions.concat(_.map([
		{type: 'textarea', label: 'DataGrid Template', name: 'template',columns:12,parse:[{type:"requires"}]},

		{type: 'table', label: 'Meta Data', array: {min:1,max:100},columns:12,parse:[{type:"requires"}],format:{template:"{{value.key}}:{{value.value}}"}, name: 'data', 
		fields: [
			{label: 'Key', name:"key",parse:[{type:"requires"},{type:"requires",name:"value"}]},
			{label: 'Value', name:"value",parse:[{type:"requires"},{type:"requires",name:"key"}]}
		]
	}
	],function(item){
		item.target = "#collapseGrid .panel-body";
		return item;
	}))
	// baseConditions = baseCond.concat(_.map([
	// 	{type: 'text', label: 'Template', name: 'template',parse:[{type:"requires"}]}
	// ],function(item){
	// 	item.target = "#collapseGrid .panel-body";
	// 	return item;
	// }))

}
gformEditor = function(container){
	return function(){
		var fieldConfig = this.get();
		_.each(['show','edit','parse','report','required'],function(index){
			if(_.isArray(fieldConfig[index]) && typeof fieldConfig[index][0].conditions == 'undefined'){
				fieldConfig[index] = [{conditions:fieldConfig[index]}]
			}
		})
		if(_.isArray(fieldConfig.validate)){
			_.each(fieldConfig.validate,function(item){
				if(_.isArray(item.conditions) && typeof item.conditions[0].conditions == 'undefined'){
					item.conditions = [{conditions:item.conditions}]
				}
			})
		}
		var formConfig = {
			// sections: 'tab'
			name:"editor",
			default:{type:"text",columns:6},
			data: fieldConfig,
			fields: this.fields,
			autoDestroy: true,
			legend: 'Edit '+ fieldConfig['widgetType'],
			cobler:this,
			actions:[{type:"button",name:"deativate",action:"deactivate",label:'<i class="fa fa-check"></i>',target:"#display",modifiers:"btn btn-info pull-right visible-lg"}],
			clear:false,
			// onSet:function(data){
			// 	data.events = {
			// 		first:'1',
			// 		last:'2'
			// 	}
			// 	if(typeof data.events !== 'undefined'){
			// 		data.events = _.map(data.events,function(e,i){
			// 			return {name:i,value:e}
			// 		})
			// 	}
			// 	return data;
			// },
			// onGet:function(data){
			// 	if(typeof data.events !== 'undefined'){
					
			// 		data.events = _.map(data.events,function(e,i){
			// 			return {name:i,value:e}
			// 		})
			// 	}
			// 	return data;
			// }
		}
		var opts = container.owner.options;

		if(typeof gform.instances.editor !== 'undefined'){
			gform.instances.editor.destroy();
		}
		$(opts.formTarget).html(gform.renderString(accordion))
		$('.panelOptions').toggle(!!_.find(formConfig.fields,{target:"#collapseOptions .panel-body"}));
		$('.panelValidation').toggle(!!_.find(formConfig.fields,{target:"#collapseValidation .panel-body"}));
		$('.panelBasic').toggle(!!_.find(formConfig.fields,{target:"#collapseBasic .panel-body"}));
		$('.panelConditions').toggle(!!_.find(formConfig.fields,{target:"#collapseConditions .panel-body"}));
		$('.panelDisplay').toggle(!!_.find(formConfig.fields,{target:"#collapseDisplay .panel-body"}));
		$('.panelEvents').toggle(!!_.find(formConfig.fields,{target:"#collapseEvents .panel-body"}));
		$('.panelGrid').toggle(!!_.find(formConfig.fields,{target:"#collapseGrid .panel-body"}));

		// $('.panelOptions').toggle(!!_.find(formConfig.fields,{target:"options"}));
		var temp = _.find(formConfig.fields,{name:"name"});
		temp.placeholder =  (formConfig.data['label']||"").toLowerCase().split(' ').join('_');


		var mygform = new gform(formConfig,$(opts.formTarget)[0] ||  $(container.elementOf(this))[0]);
		mygform.onGet = function(data){
			return data;
		}
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

			cb.deactivate();
			path.push(e.form.get('name'));
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


$('body').keydown(function(event) {
	switch(event.keyCode) {
	  case 27://escape
		  cb.deactivate();
		break;
	}
  });


Cobler.types.input = function(container) {
	function render(){
        var data = get();
        if(item.type == 'output'){
            data.display = gform.renderString((data.format|| {}).value||'{{{value}}}', data);
        }
        return (gform.types[item.type]||gform.types['text']).render.call(_.extend({},(gform.types[item.type]||gform.types['text']).defaults,myform.default,data));
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
	]}].concat(baseFields, baseConditions,[
		{target:"#collapseDisplay .panel-body",type: 'fieldset', label: false,columns:12, name: 'format',show:[{type:"matches",name:'type',value:"date"}],parse:[{type:"requires"}], fields:[
			{name:"input",type:"smallcombo",options:[
				{label:"Datetime",value:"MM/DD/YYYY h:mm A"},
				{label:"Date",value:"MM/DD/YYYY"},				
				{label:"Time",value:"h:mm A"},
				{label:"Month",value:"MM"},
				{label:"Year",value:"YYYY"},
				{label:"Month/Year",value:"MM/YYYY"},
				{label:"Day",value:"MM/DD"}

			],label:"Date Format",parse:[{type:"requires"}],format:{title:'Date Format <span class="pull-right" style="font-weight:normal">{{value}}</span>'}}
			,{name:"display",label:"Display",show:[{type:"matches",value:["template"],name:"/type"}]}

		] }
	])
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
		
		// var temp = _.find(options.options,{value: options.value}) || (options.options||[])[0]
		// if(typeof temp !== 'undefined') {
		// 	temp.selected = true;
		// }
		debugger;
		return gform.render(item.type, _.extend({},myform.default,options));
	}
	function get() {		
		item.widgetType = 'collection';
		item.editable = true;
		if(item.type == 'files'){
			delete item.options;
		}
		return item;
	}
	function toJSON() {
		return _.omit(get(),'widgetType','editable')
	}
	function set(newItem) {

		if(['user','group','files'].indexOf(newItem.type) ==  -1){
			if(typeof newItem.options == "string"){
				newItem.path = newItem.options
				delete newItem.options;
			}else{
				newItem.options = _.map(newItem.options, function(e) {
					if(typeof e == 'string'){
						return {label:e,value:e};
					}else{
						return e;
					}
				})
			}
			if(typeof newItem.options == 'undefined' || _.every(newItem.options, function(e) {return ((typeof e == 'object') && e.type !== 'optgroup');})){
				var temp = _.pick(newItem,['options','max','min','path','format'])
				newItem = _.omit(newItem,['options','max','min','path','format'])
				temp.type = 'optgroup';
				temp.label = temp.label||"";
				newItem.options =[temp]
			}
		}else{
			delete newItem.options;
		}
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

			{label: 'User', value: 'user'},
			{label: 'User Email', value: 'user_email'},
			{label: 'Groups', value: 'Groups'},

			{label: 'File', value: 'files'},
			// {label: 'Grid', value: 'grid'},
		]}

	].concat(baseFields,baseConditions,_.map([
		// {type: 'fieldset', label: "Format",columns:12, name: 'format',parse:[{type:"requires",name:"format"}], fields:[
		// 	{name:"label",label:"Label",parse:[{type:"requires",name:"label"}]},
		// 	{name:"value",label:"Value",parse:[{type:"requires",name:"value"}]},
		// 	{name:"display",label:"Display",show:[{type:"matches",value:"smallcombo",name:"type"}]}
		// 	// {name:"Title",label:"title"}
		// ] },
		{type: 'fieldset', label: false, array: {min:1,max:100},columns:12,parse:[{type:"requires"},{type:"not_matches",name:"type",value:["user","groups","files"]}],show:[{type:"not_matches",name:"type",value:["user","groups","files"]}], name: 'options', 
			fields: [
				{label: 'Section Label (optional)', name:"label"},
				{label: 'Type',type:"select",parse:false, name:"options_type",options:[{label:"Resource",value:"string"},{label:"Derived",value:"int"},{label:"Manual",value:"object"}],value:function(e){
					if(e.event == 'initialized'){
						var result = "object";
						if(typeof e.initial.parent.initialValue['max'] !== 'undefined' && !isNaN(e.initial.parent.initialValue['max'])){
							result = "int";
						}
						if(typeof e.initial.parent.initialValue['path'] !== 'undefined' &&  e.initial.parent.initialValue['path'].length){
							result = "string";
						}
						
						return result;
					}else{
						return e.initial.value
					}
				}},
				{name:"type",type:"hidden",value:"optgroup"},
				{type: 'fieldset', label: false, array: {min:1,max:100},columns:12, name: 'options', fields:[
					{name:"label",label:"Label",parse:[{type:"requires"}]},
					{name:"value",label:"Value",parse:[{type:"requires"}]}
				],parse:[{type:"requires"},{type:"matches",name:"options_type",value:"object"}],show:[{type:"matches",name:"options_type",value:"object"}]},

				{type: 'text', label: "Resource Name", name: 'path',show:[{type:"matches",name:"options_type",value:"string"}]},
				{type: 'number', label: "Min", name: 'min',placeholder:"0",show:[{type:"matches",name:"options_type",value:"int"}]},
				{type: 'number', label: "Max", name: 'max',required:true,show:[{type:"matches",name:"options_type",value:"int"}]},
				{type: 'fieldset', label: "Format",columns:12, name: 'format',parse:[{type:"requires"}], fields:[
					{name:"label",label:"Label",parse:[{type:"requires"}]},
					{name:"value",label:"Value",parse:[{type:"requires"}]},
					{name:"display",label:"Display",show:[{type:"matches",value:["smallcombo"],name:"/type"},]},
					// {name:"Title",label:"title"}
				] },
				{type: 'select',other:true, columns:12, label:'Show the Options <span class="pull-right text-muted">"show"</span>', value: true, name:"show",parse:[{type:"not_matches",name:"show",value:true}],options:		
					[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Edit"',value:'edit'}, {label:"Conditionally",value:"other"}]}]
				},
				{type: 'fieldset',columns:11,offset:'1', label:false,name:"show",fields:myconditions,array:{min:1,max:1},show:[{name:"show",value:['other'],type:"matches"}]},
			
				{type: 'select',other:true, columns:12, label:'Allow the options to be Chosen <span class="pull-right text-muted">"edit"</span>', value:true,name:"edit",parse:[{type:"not_matches",name:"edit",value:true}],options:		
					[{type:"optgroup",options:[{label:'Always',value:true},{label:'Never',value:false},{label:'Use same settings as "Show"',value:'show'}, {label:"Conditionally",value:"other"}]}]
				},
				{type: 'fieldset',columns:11,offset:'1', label:false,name:"edit",fields:myconditions,array:{min:1,max:1},show:[{name:"edit",value:['other'],type:"matches"}]},
			
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
		var temp = _.omit(get(),'widgetType','editable')
		temp.options = _.map(temp.options,function(i){return _.omit(i,'selected')});
		if(_.isEmpty(temp.options[0]) && _.isEmpty(temp.options[1])){
			temp = _.omit(temp,'options')
		}
		return temp;
	}
	function set(newItem) {
		newItem.display = newItem.display||newItem.details;
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
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Label','name':'label',parse:[{type:"requires"}]},
		{title: '{{#parent.index}}True{{/parent.index}}{{^parent.index}}False{{/parent.index}} Value','name':'value',parse:[{type:"requires"}]},
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
function clean(field){
	var temp = _.omit(field,'widgetType','editable');
	if(typeof temp.fields !== 'undefined'){
		temp.fields = _.map(temp.fields,function(field){
			return clean(field);
		})
	}
	return temp;
}
Cobler.types.section = function(container) {
	function render() {
		var temp = get();

		var content = "";
		_.each(temp.fields,function(e){
			
			var nTemp = new Cobler.types[gform.types[e.type||'text'].base]()
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
		// item.type = 'fieldset';

		item.fields = item.fields ||[];
		return item;
	}
	function toJSON() {
		
		// var temp = _.omit(get(),'widgetType','editable');
		// if(0 in temp.fields){
		// 	temp.fields = _.map(temp.fields,function(field){
		// 		return _.omit(field,'widgetType','editable');
		// 	})
		// }

		return clean(get());
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

		{target:"#display",type: 'smallcombo',columns:9, label: false, name: 'type', value: 'text', 'options': [
			{label: 'Fieldset', value: 'fieldset'},
			{label: 'Template', value: 'template'},
			{label: 'Table', value: 'table'},
			// {label: 'Scale', value: 'scale'},
			// {label: 'Grid', value: 'grid'},
		]},
		{target: "#collapseBasic .panel-body", type: 'text', required: true, label: 'Section Label', name: 'label'},
		{target: "#collapseBasic .panel-body", type: 'text', required: true, label: 'Name', name: 'name'},
		{target:"#collapseDisplay .panel-body",type: 'fieldset', label: false,columns:12, name: 'format',show:[{type:"matches",name:'/type',value:"template"}],parse:[{type:"requires"}], fields:[
			{name:"display",type:"textarea",columns:12,label:"Display",show:[{type:"matches",value:["template"],name:"/type"}]}

		] },
		// {target:"#collapseDisplay .panel-body", type: 'textarea',columns:12, label: 'Template', name: 'template',parse:[{type:"requires"}]},

		{target: "#display",columns:9, type:"button",modifiers:"btn btn-default pull-left margin-bottom",label:"Manage Section",action:"manage",name:"manage",show:[{type:"test",name:"manage",test:function(e){
            return !e.owner.options.nomanage;
		}}]}
	].concat(baseCond).concat(displayFields)
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

<div class="panel panel-default panelBasic">
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


<div class="panel panel-default panelDisplay">
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



<div class="panel panel-default panelConditions">
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


<div class="panel panel-default panelValidation">
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

<div class="panel panel-default panelEvents">
  <div class="panel-heading" role="tab" id="headingEvents">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseEvents" aria-expanded="false" aria-controls="collapseEvents">
Events
      </a>
    </h4>
  </div>
  <div id="collapseEvents" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingEvents">
    <div class="panel-body">
    </div>
  </div>
</div>

<div class="panel panel-default panelGrid">
  <div class="panel-heading" role="tab" id="headingGrid">
    <h4 class="panel-title">
      <a class="collapsed" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseGrid" aria-expanded="false" aria-controls="collapseGrid">
Other
      </a>
    </h4>
  </div>
  <div id="collapseGrid" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingGrid">
    <div class="panel-body">
    </div>
  </div>
</div>

</div>
</form>
`