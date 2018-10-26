	$('.navbar-header .nav a h4').html('Users');
	$('#table').html('<div style="margin:40px 20px"><div class="col-md-6 well" id="search"></div><div class="col-md-6" id="user"></div></div>')
	$('#search').berry({
				name:'user_search',
				actions:false,
				label:false,
				fields:[
					{name:'query',label:'Search'},
					{type:'raw',value:'',name:'results',label:false}
				]}).on('change',function(){

					if(typeof Berries.user !== 'undefined'){
						Berries.user.destroy();
					}
				}).delay('change:query',function(){
					$.ajax({
						url: '/api/users/search/'+this.toJSON().query,
						success: function(data) {
							this.fields.results.update({value:templates['user_list'].render({users:data})})
						}.bind(this)
					})
				})
		$('body').on('click','.list-group-item.user', function(e){
			if(typeof Berries.user !== 'undefined'){
				Berries.user.destroy();
			}
			$('#user').berry({actions:['save'], flatten:true, attributes:'/api/users/'+e.currentTarget.dataset.id+'/info',name:'user',fields:[
				
				{name:'unique_id',label:'Unique ID',enabled:false},
				{name:'first_name',label:'First Name',enabled:false},
				{name:'last_name',label:'Last Name',enabled:false},
				{name:'email',label:'Email', enabled:false},
				{name:'id',label:false,inline:true, type:'raw',template:'<div><a class="btn btn-warning pull-right" href="/api/users/{{value}}/impersonate/">Impersonate this user</a></div>'},
				{name:'site_members',label:false, type:'fieldset',multiple: {duplicate: false},fields:[
					{name:'site_admin',label:'Site Admin',type:'custom_radio',options:[{label:'Yes',value:1},{label:'No',value:0}]},
					{name:'site_developer',label:'Site Developer',type:'custom_radio',options:[{label:'Yes',value:1},{label:'No',value:0}]}
				]},						
				{name:'group_members',label:'Member Of',inline:true, type:'raw',template:'<div class="list-group" style="margin-bottom:0;max-height: 200px;overflow: auto;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{group.name}}</div>{{/value}}</div>'},
				{name:'app_developers',label:"App Developer",inline:true, type:'raw',template:'<div class="list-group" style="margin-bottom:0;max-height: 200px;overflow: auto;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{app.name}}</div>{{/value}}</div>'},
				{name:'group_admins',label:"Admin Of",inline:true, type:'raw',template:'<div class="list-group" style="margin-bottom:0;">{{^value.length}}None{{/value.length}}{{#value}}<div class="list-group-item" style="padding: 8px 15px;position:relative">{{group.name}}{{#apps_admin}}<i class="fa fa-cubes text-info" style="position:absolute;top:10px;right:10px"></i>{{/apps_admin}}{{#content_admin}}<i class="fa fa-file text-info" style="position:absolute;top:10px;right:40px"></i>{{/content_admin}}</div>{{/value}}</div>'},


				{type:'hidden', name:'id'}
				
				
			]}).on('save',function(){
				$.ajax({
					url: '/api/users/'+this.toJSON().id+'/info',
					type: 'PUT',
					data:this.toJSON(),
					success: function(data) {
						this.populate(data);	
				}.bind(this)})
			})
			Berries.user_search.trigger('close');
		})
