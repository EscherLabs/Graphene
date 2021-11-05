$('.navbar-header .nav a h4').html('Links');
if(resource_id !== ''){
	$('[href="/admin/groups"]').parent().addClass('active');
}

var schema = [
	fieldLibrary.group,
	{label: 'Title', name:'title', required: true},
	{label: 'Link', name:'link', required: true, template:'<a href="{{value}}">{{value}}</a>'},
	{label: 'Image', name:'image', required: false,template:'<img src="{{value}}" style="height:18px;">',showColumn: false},
	{label: 'Icon', name:'icon', type:'smallcombo', format: {
		title:'Icon <span class="pull-right"><i class="{{value}}"></i></span>',
		label:function(item){
			return item.name.replace(/(\r\n|\s)/gm, "");
		}, 
		value:"{{value}}",
		display:'<span style = "text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}'
	}, options:'icons',
	required: false,template:'{{#attributes.image}}<img src="{{attributes.image}}" style="height:18px;">{{/attributes.image}}{{^attributes.image}}<i class="{{value}}" style="color:{{attributes.color}}"></i>{{/attributes.image}}'},
	{label: 'Color', name:'color', required: false,template:'<div style="background-color:{{value}};width:30px;height:18px;"></div>',showColumn: false},
	{label: 'List In Menu {{#value}}<span style="float:right;color:#b88">(This will NOT be listed)</span>{{/value}}{{^value}}<span style="float:right;color:#8b8">(This will be listed)</span>{{/value}}',format:{label:""}, name:'unlisted', type: 'checkbox',options:[{label:"Hidden",value:1},{label:'Listed',value:0}],value:1 },
	{label: 'Limit Device (In Menu)', type:"select", name: 'device', format:{value:"{{index}}"}, value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},			
	{name: 'id', type:'hidden'}
];

$g.getData([url,'/api/groups','/assets/data/icons.json'], (links, groups, icons) => {
	new GrapheneDataGrid({...tableConfig,
		schema: [
			fieldLibrary.group,
			{label: 'Title', name:'title', required: true},
			{label: 'Link', name:'link', required: true, template:'<a href="{{value}}">{{value}}</a>'},
			{label: 'Image', name:'image', required: false,template:'<img src="{{value}}" style="height:18px;">',showColumn: false},
			{label: 'Icon', name:'icon', type:'smallcombo', format: {
				title:'Icon <span class="pull-right"><i class="{{value}}"></i></span>',
				label:function(item){
					return item.name.replace(/(\r\n|\s)/gm, "");
				}, 
				value:"{{value}}",
				display:'<span style = "text-transform:capitalize;"><i class="{{value}}"></i> {{{label}}}'
			}, options:'icons',
			required: false,template:'{{#attributes.image}}<img src="{{attributes.image}}" style="height:18px;">{{/attributes.image}}{{^attributes.image}}<i class="{{value}}" style="color:{{attributes.color}}"></i>{{/attributes.image}}'},
			{label: 'Color', name:'color', required: false,template:'<div style="background-color:{{value}};width:30px;height:18px;"></div>',showColumn: false},
			{label: 'List In Menu',format:{label:""}, name:'unlisted', type: 'checkbox',options:[{label:"Hidden",value:1},{label:'Listed',value:0}],value:1 },
			{label: 'Limit Device (In Menu)', type:"select", name: 'device', format:{value:"{{index}}"}, value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},			
			{name: 'id', type:'hidden'}
		],
		create: {fields:schema},
		edit: {fields:schema},
		data: links,
		name: 'links'	
	})
});