$('.navbar-header .nav a h4').html('Links');

$.ajax({
	url: url,		
	success: function(data){
		tableConfig.schema = [
			{label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
			{label: 'Title', name:'title', required: true},
			{label: 'Link', name:'link', required: true, template:'<a href="{{value}}">{{value}}</a>'},
			{label: 'Image', name:'image', required: false,template:'<img src="{{value}}" style="height:18px;">',showColumn: false},
			{label: 'Icon', name:'icon', 
			type:'select', choices:'/assets/data/icons.json',
			required: false,template:'{{#attributes.image}}<img src="{{attributes.image}}" style="height:18px;">{{/attributes.image}}{{^attributes.image}}<i class="{{value}}" style="color:{{attributes.color}}"></i>{{/attributes.image}}'},
			{label: 'Color', name:'color', required: false,template:'<div style="background-color:{{value}};width:30px;height:18px;"></div>',showColumn: false},
			{name: 'id', type:'hidden'}
		];
		if(resource_id !== ''){
			tableConfig.schema[0].enabled = false;
			tableConfig.schema[0].value = resource_id;
		}
		tableConfig.data = data;
		tableConfig.name = "links";
		bt = new berryTable(tableConfig)
	}
});