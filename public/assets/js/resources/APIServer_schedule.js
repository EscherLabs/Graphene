$('.navbar-header .nav a h4').html('Schedule');
url = "/api/proxy/"+slug+"/scheduler";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		if(typeof data !== 'object'){ data = []; }
        data = _.map(data,function(attributes){
			var duration = moment.duration(moment(attributes.last_exec_start).diff(moment(attributes.last_exec_stop)))
			attributes.execution_time = {scheduled:moment(attributes.last_exec_cron).fromNow(), minutes:duration.minutes(),seconds:duration.seconds()};
            return attributes;	
		});
		tableConfig.schema = [
			{label: 'Name', name:'name', required: true},
			{label: 'Schedule', name:'cron', required: true},
			{label: 'Verb',name:'verb', type:'select', options:["GET", "POST", "PUT", "DELETE"]},			
			{label: 'Environment Type', name:'type', type:'select', options:['dev','test','prod'], required: true},			
			{label: 'Service Instance', name:'api_instance_id', required: true,type:'select', options:'/api/proxy/'+slug+'/api_instances',format:{label:"{{name}}",value:"{{id}}"}},			
			{label: 'Route', name:'route', required: true},
			{label: 'Enabled', name:'enabled',value:true,type:'checkbox',"template":'{{#attributes.enabled}}Yes{{/attributes.enabled}}{{^attributes.enabled}}No{{/attributes.enabled}}'},			
			{
				"show":false,
				"name": "args_view",
				"label": "Arguments",
				"template":'{{#attributes.args}}{{name}}=>{{value}}<br>{{/attributes.args}}',
			},
			{
				"show":false,
				"name": "times",
				"label": "Status",
				"template":'Last executed: {{attributes.execution_time.scheduled}}<br>Ran for {{attributes.execution_time.minutes}} minutes and {{attributes.execution_time.seconds}} seconds',
			},
			{name: 'id', type:'hidden'}
		];
        tableConfig.actions = [
			{'name':'delete',max:1},'|',
            {'name':'edit',max:1},
            {'name':'params',max:1,min:1, 'label': 'Configure Parameters'},
            {'name':'report',max:1,min:1, 'label': 'View Report'},
            {'name':'run',max:1,min:1, 'label': 'Run Manually'},'|',
			{'name':'create'}
		]
		tableConfig.data = data;
		tableConfig.name = "schedule";
        grid = new GrapheneDataGrid(tableConfig)

        grid.on('model:params',function(grid_event){
            new gform({name:'param_form',legend:'Args',fields:[
                {
                    "name": "args",
                    "label": false,
                    "array":true,
                    "type":"fieldset",
                    fields:[
                        {'name':'name','label':'Name',"inline":true,columns:6},
                        {'name':'value','label':'Value',"inline":true,columns:6},
                    ]
                }
            ]}).on('save',function(form_event){
                var form_data = form_event.form.get();
                grid_event.model.attributes.args = form_data.args;
                grid_event.model.set(grid_event.model.attributes)
                $.ajax({url:url+'/'+grid_event.model.attributes.id,type:'PUT',data:grid_event.model.attributes,
                    success:function() {
                        form_event.form.trigger('close');
                    },
                    error:function(e) {
                        toastr.error(e.statusText, 'ERROR');
                    }
                });
            }).on('cancel',function(form_event) {
                form_event.form.trigger('close')
            }).modal().set(grid_event.model.attributes);
		}).on('model:report',function(grid_event){
            var data = {};
            grid_event.model.attributes.scheduled_times = _.map(grid_event.model.attributes.next_runtimes,function(item){return {text:moment(item).fromNow(),value:item}})
            if(typeof grid_event.model.attributes.last_response == 'object'){
                grid_event.model.attributes.last_response = JSON.stringify(grid_event.model.attributes.last_response, null,'\t');
            }
            var templateString = gform.m('Last executed {{execution_time.scheduled}}<br>Ran for {{execution_time.minutes}} minutes and {{execution_time.seconds}} seconds<br><br>Last Results: <pre>{{last_response}}</pre><br>Scheduled to run:<pre>{{#scheduled_times}}{{text}} ({{value}})<br>{{/scheduled_times}}</pre>',grid_event.model.attributes)
            modal({title:'Report', content:templateString})
        }).on('model:run',function(grid_event){
            if (prompt("Are you sure you want to run this Scheduled Job?  This action cannot be undone!")) {
                $.ajax({url:url+'/'+grid_event.model.attributes.id+'/run',type:'GET',
                    success:function(response) {
                        modal({title:'Response',content:'<pre>'+JSON.stringify(response,null,'\t')+'</pre>'})
                    },
                    error:function(response) {
                        toastr.error(e.statusText, 'ERROR');
                    }
                });
            }
        });
	}
});