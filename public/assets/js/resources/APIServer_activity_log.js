$('.navbar-header .nav a h4').html('Activity Log');
// url = "/admin/apiserver/fetch/api_versions";
url = "/api/proxy/"+slug+"/activity_log";
api = url;
$.ajax({
	url: url,		
	success: function(data){
		
		// tableConfig.add = false;
		// tableConfig.delete = false;
		// tableConfig.edit = false;
		tableConfig.upload = false,
		tableConfig.schema = [
			{label: 'Event Type', name:'event'},			
			{label: 'Event', name:'event_id', template:'{{event}}'},
			{label: 'Type', name:'type',type:'select', options:['dev','test','prod']},			
			{label: 'User', name:'user_id',type:'select', options:'/api/sites/1/admins',format:{value:'{{unique_id}}',label:'{{last_name}}'}},
			{label: 'Comment', name: 'comment'},
			{label: 'Old', name:'old', template:'<pre>{{old}}</pre>'},
			{label: 'New', name:'new', template:'<pre>{{new}}</pre>'},
			{label: 'Time Stamp', name:'created_at',},
			// {label: 'Updated At', name:'updated_at', showColumn: false},
			{name: 'id', type:'hidden'}
		];

		tableConfig.preDraw = function(model){
			model.old = JSON.stringify(model.attributes.old , null,'\t');
			model.new = JSON.stringify(model.attributes.new , null,'\t');
			model.event = model.attributes.old.name;
			if(model.attributes.old.name !== model.attributes.new.name){
				if(typeof model.attributes.old.name !== 'undefined'){
					model.event = '('+model.event+') '+model.attributes.new.name;
				}else{
					model.event = model.attributes.new.name;
				}
			}
		}

		tableConfig.click = function(model){
			model.last_response = model.attributes.last_response;
			// model.scheduled_times = _.map(model.attributes.next_runtimes,function(item){return {text:moment(item).fromNow(),value:item}})
			
			// TJC -- This desperately needs to be cleaned up to better escape special characters
			var templateString = '<pre>'+htmldiff(model.old.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"),model.new.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"))+'</pre>';
			modal({title:'Status Summary', content:templateString})		
		};		



		tableConfig.data = data;
		tableConfig.name = "activity_log";
		// tableConfig.add = false;
		tableConfig.actions = false;
		tableConfig.events={'model:draw':function(e){
			e.model.old = JSON.stringify(e.model.attributes.old , null,'\t');
			e.model.new = JSON.stringify(e.model.attributes.new , null,'\t');
			e.model.event = e.model.attributes.old.name;
			if(e.model.attributes.old.name !== e.model.attributes.new.name){
				if(typeof e.model.attributes.old.name !== 'undefined'){
					e.model.event = '('+e.model.event+') '+e.model.attributes.new.name;
				}else{
					e.model.event = e.model.attributes.new.name;
				}
			}
		}}			
		tableConfig.hideCheck = true;
		grid = new GrapheneDataGrid(tableConfig)
		
		grid.on('click',function(e){
			e.model.last_response = e.model.attributes.last_response;
			// model.scheduled_times = _.map(model.attributes.next_runtimes,function(item){return {text:moment(item).fromNow(),value:item}})
			
			// TJC -- This desperately needs to be cleaned up to better escape special characters
			var templateString = '<pre>'+htmldiff(e.model.old.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"),e.model.new.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;"))+'</pre>';
			modal({title:'Status Summary', content:templateString})		
		})

	}
});


// "id": 1,
// "event_id": 1,
// "action": "PUT",
// "event": "Environment",
// "type": "prod",
// "user_id": "B00505893",
// "comment": "",
// "new": {
// "id": 1,
// "name": "localdev",
// "type": "prod",
// "domain": "localhost:8000",
// "created_at": "2018-09-21 22:58:26",
// "deleted_at": null,
// "updated_at": "2018-09-21 22:58:36"
// },
// "old": {
// "id": 1,
// "name": "localdev",
// "type": "dev",
// "domain": "localhost:8000",
// "created_at": "2018-09-21 22:58:26",
// "deleted_at": null,
// "updated_at": "2018-09-21 22:58:26"
// },
// "created_at": "2018-09-21 22:58:36",
// "updated_at": "2018-09-21 22:58:36"