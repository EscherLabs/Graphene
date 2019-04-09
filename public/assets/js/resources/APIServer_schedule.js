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
			{label: 'Verb',name:'verb', type:'select', options:["GET", "POST", "PUT", "DELETE"]},			
			{label: 'Environment Type', name:'type', type:'select', options:['dev','test','prod'], required: true},			
			{label: 'Service Instance', name:'api_instance_id', required: true,type:'select', choices:'/api/proxy/'+slug+'/api_instances',label_key:'summary',value_key:'id'},			
			{label: 'Route', name:'route', required: true},
			{label: 'Enabled', name:'enabled',value:true,type:'checkbox',truestate:1,falsestate:0},			
			{
				"show":false,
				"name": "args_view",
				"label": "Arguments",
				"template":'{{#attributes.args}}{{name}}=>{{ value }}<br>{{/attributes.args}}',
			},
			{
				"show":false,
				"name": "times",
				"label": "Status",
				"template":'Last executed: {{execution_time.scheduled}}<br>Ran for {{execution_time.minutes}} minutes and {{execution_time.seconds}} seconds',
			},
			{name: 'id', type:'hidden'}
		];
		tableConfig.preDraw = function(model){
			var duration = moment.duration(moment(model.attributes.last_exec_start).diff(moment(model.attributes.last_exec_stop)))
			model.execution_time = {scheduled:moment(model.attributes.last_exec_cron).fromNow(), minutes:duration.minutes(),seconds:duration.seconds()};	
		},
		tableConfig.click = function(model){
			model.last_response = model.attributes.last_response;
			model.scheduled_times = _.map(model.attributes.next_runtimes,function(item){return {text:moment(item).fromNow(),value:item}})
			
			if(typeof model.last_response == 'object'){
				model.last_response = JSON.stringify(model.last_response, null,'\t');
			}
			var templateString = Hogan.compile('Last executed {{execution_time.scheduled}}<br>Ran for {{execution_time.minutes}} minutes and {{execution_time.seconds}} seconds<br><br>Last Results: <pre>{{last_response}}</pre><br>Scheduled to run:<pre>{{#scheduled_times}}{{text}} ({{value}})<br>{{/scheduled_times}}</pre>').render(model)
			
			modal({title:'Status Summary', content:templateString})
			// window.location.href = '/admin/appinstances/'+model.attributes.id
		
		};		
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