	$('.navbar-header .nav a h4').html('Users');
	$('#table').html('<div style="margin:40px 20px"><div class="col-md-5" id="search"></div><div class="col-md-7" style="border-left:solid 2px #ccc" id="user"></div></div>')
	new gform({
		name:'user_search',
		actions:[],
		label:false,
		fields:[
			{name:'query',label:false,placeholder:'Search', pre:'<i class="fa fa-filter"></i>',help:"Start typing a name to search i.e. john <hr>"},
			{type:'output',name:'results',label:false}
		]
	},'#search')
	.on('change:query',function(){
		if(typeof gform.instances.user !== 'undefined'){
			gform.instances.user.destroy();
		}
	})
	.on('change:query',_.debounce(function(e){
		$.ajax({
			url: '/api/users/search/'+this.toJSON().query,
			success: function(data) {
				e.form.find('results').update({value:templates['user_list'].render({users:data})})
			}.bind(e)
		})
	},500))


		$('body').on('click','.list-group-item.user', function(e){
			if(typeof gform.instances.user !== 'undefined'){
				gform.instances.user.destroy();
			}
			$.ajax({
				// url: '/api/users/search/'+this.toJSON().query,
				url: '/api/users/'+e.currentTarget.dataset.id+'/info',
				success: function(data) {
	
			new gform({
				actions:[{type:'save'}], 
				data:data,
				name:'user',
				strict:false,
				fields:[
				
					{name:'unique_id',label:'Unique ID',edit:false},
					{name:'first_name',label:'First Name',edit:false},
					{name:'last_name',label:'Last Name',edit:false},
					{name:'email',label:'Email', edit:false},
					{name:'id',label:false,inline:true, type:'output',format:{value:'<div><a class="btn btn-warning pull-right" href="/api/users/{{value}}/impersonate/">Impersonate this user</a></div>'}},
					{name:'site_members',label:false, type:'fieldset',array: {duplicate: false},fields:[
						{name:'site_admin',label:'Site Admin',type:'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}]},
						{name:'site_developer',label:'Site Developer',type:'checkbox',options:[{label:'No',value:false},{label:'Yes',value:true}],format:{value:e=>e.value}},
					]},						
					{name:'group_members',label:'Memberships',inline:true, type:'output',format:{value:'<div class="list-group" style="margin-bottom:0;max-height: 200px;overflow: auto;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{group.name}}</div>{{/value}}</div>'}},
					{name:'app_developers',label:"App Developer",inline:true, type:'output',format:{value:'<div class="list-group" style="margin-bottom:0;max-height: 200px;overflow: auto;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{app.name}}</div>{{/value}}</div>'}},
					{name:'group_admins',label:"Admin Of",inline:true, type:'output',format:{value:'<div class="list-group" style="margin-bottom:0;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{group.name}}{{#apps_admin}}<i class="fa fa-cubes text-info" style="position:absolute;top:10px;right:10px"></i>{{/apps_admin}}{{#content_admin}}<i class="fa fa-file text-info" style="position:absolute;top:10px;right:40px"></i>{{/content_admin}}</div>{{/value}}</div>'}},


					{type:'hidden', name:'id'}				
				]
			},'#user').on('save',function(e){
				$.ajax({
					url: '/api/users/'+e.form.get().id+'/info',
					type: 'PUT',
					dataType : 'json',
					contentType: 'application/json',
					data: JSON.stringify(e.form.get()),
					success: function(data) {
						// this.populate(data);	
				}.bind(this)})
			})
		}.bind(e)
	})
})
