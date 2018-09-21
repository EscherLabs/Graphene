$('.navbar-header .nav a h4').html('Schedule');
url = "/api/proxy/"+slug+"/scheduler";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		if(typeof data !== 'object'){ data = []; }
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Schedule', name:'cron', required: true},
          	{label: 'Verb',name:'verb',type:'hidden',options:["GET", "POST", "PUT", "DELETE"]},
			{label: 'Service Instance', name:'service_instance_id', required: true,type:'select', choices:'/api/proxy/'+slug+'/service_instances',label_key:'summary',value_key:'id'},			
			{label: 'Route', name:'route', required: true},
			{
				"show":false,
				"name": "args",
				"label": "Arguments",
				"template":'{{#attributes.args}}{{name}}=>{{ value }}<br>{{/attributes.args}}',
			},
			{name: 'id', type:'hidden'}
		];
		tableConfig.events=[
			{'name': 'params', 'label': '<i class="fa fa-code"></i> Args', callback: function(model){
				$().berry({
					name:'param_form',
					attributes:model.attributes,
					legend:'Args',
					fields:[
						{
							"name": "parameters",
							"label": false,
							"fields": {
								"args": {
									"label": false,
									"multiple": {
										"duplicate": true
									},
									fields:[
									{'name':'name','label':'Name',"inline":true,columns:6},
										{'name':'value','label':'Value',"inline":true,columns:6},
									]
								}
							}
						}
					]
					}).on('save',function(){
						var temp = this.attributes;
						temp.args = Berries.param_form.toJSON().args
						this.set(temp)
						this.owner.options.edit(this);
						this.owner.draw();
						Berries.param_form.trigger('close')
					}.bind(model))
			}, multiEdit: false},
	
		],
		tableConfig.data = data;
		tableConfig.name = "schedule";
		bt = new berryTable(tableConfig)
	}
});