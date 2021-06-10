$('.navbar-header .nav a h4').html('App Instance');
$('[href="/admin/appinstances"]').parent().addClass('active');
root = '/api/appinstances/'+resource_id;
getData([root,'/assets/data/icons.json','/api/groups/'+group.id+'/endpoints'], (appinstance, icons, endpoints) => {
	$g.collections.add('composites',group.composites);
	$('.navbar-header .nav a h4').append(' - '+appinstance.app.name+'');
	const {forms=[], resources=[]} = appinstance.app.code;
	$.ajax({
		url: '/api/apps/'+appinstance.app_id+'/versions',
		success: function(versions) {
			$('#table').html(templates.app_instance.render(appinstance));
				viewTemplate = '<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>';

				$('#find').on('click', function(){
					$.get(root+'/pages', pages => {
						if(pages.length > 0){
							modal({title:'This App Instance was found on the following pages', content: $g.render(viewTemplate, {items: pages})});
						}else{
							modal({title: 'No pages Found', content:'This App Instance is not currently placed on any pages.'});
						}
					})
				})			 
				$('body').on('click', '#version', function(){
					
					new gform({
						name:'versionForm',
						data:appinstance,
						legend:'Select Version',
						fields:[
							{label: 'Version', name:'app_version_id', required:true, options: [
								{id:null,label:'Latest (Working or Published)'},
								...(versions.length)?[{id:0,label:'Latest Published'}]:[],
								...versions
							], type:'select', format:{value: version=>version.id, label: "{{label}}"}},
						]
					}).on('save', e => {
						$.ajax({
							url: root, 
							type: 'PUT', 
							dataType : 'json',
							contentType: 'application/json',
							data: JSON.stringify(e.form.get()),
							success: () => {
								window.location.reload();
							},
							error: e => {
								toastr.error(e.statusText, 'ERROR');
							}
						});
					}).on('cancel', e =>{ e.form.trigger('close') }).modal()
				})
			new gform({
				fields: [
					{name:'group_id', required: true, type:'hidden'},
					{label: 'Version', name:'app_version_id', edit: false, options: [
						{id:null,label:'Latest (Working or Published)'},
						...(versions.length)?[{id:0,label:'Latest Published'}]:[],
						...versions
					], type: 'select', format:{ value: version => version.id, label: "{{label}}"} ,post:'<i class="fa fa-pencil" id="version"></i>'},
					...fieldLibrary.content,
					{name:'app_id', required: true, type:'hidden'},
					// {name: 'app', type:'hidden'},
					{name: 'id', type:'hidden'}
				],
				data: appinstance, 
				actions:[], 
				name:'main'
			},'#main .col-sm-9')
			
			$('#save').on('click',function(){
				if(!$g.forms.main.validate()){$g.alert({status:'error',content:'Check Configuration'});return;}
				if(typeof $g.forms.options !== 'undefined'){
					if(!$g.forms.options.validate()){$g.alert({status:'error',content:'Check Options'});return;}
				}
				if(typeof $g.forms.resources !== 'undefined'){
					if(!$g.forms.resources.validate()){$g.alert({status:'error',content:'Check Resources'});return;}
				}

				$.ajax({
						url: root, 
						type: 'PUT', 
						dataType : 'json',
						contentType: 'application/json', 
						data: JSON.stringify({
							...$g.forms.main.get(),
							options: (typeof $g.forms.options !== 'undefined')?$g.forms.options.get(): {},
							user_options_default: (typeof $g.forms.user_options_default !== 'undefined')?$g.forms.user_options_default.get(): {},
							resources: (typeof $g.forms.resources !== 'undefined')? $g.forms.resources.get().resources: []
						}), 
					success: () => {
						toastr.success('', 'Successfully updated App Instance')
					},
					error: e => {
						toastr.error(e.statusText, 'ERROR');
					}
				});

			})
			if(forms.find(form => form.name == "Options").content){
				new gform({...JSON.parse(forms.find(form => form.name == "Options").content),
					name: 'options',
					data: appinstance.options || {},
					id: appinstance.id,
					actions: []
				},'#options .col-sm-9')
				$('#optionstab').toggle(!!$g.forms.options.fields.length);
			}
			if(forms.find(form => form.name == "User Options").content){
				new gform({...JSON.parse(forms.find(form => form.name == "User Options").content),
					name: 'user_options_default',
					data: appinstance.user_options_default || {},
					id: appinstance.id,
					actions: []
				},'#user_options_default .col-sm-9')
				$('#useroptionstab').toggle(!!$g.forms.user_options_default.fields.length);
			}
			if(resources.length && resources[0].name !== '') {	
				$('#resourcestab').show();
				new gform({
					fields: [
						{name:'resources',label:false,type:"fieldset",array:{min:0,max:20,duplicate:false,remove:false},fields:[
							{label:false, name: 'name',columns:0, type:'hidden'},
							{name: 'endpoint', type: 'endpoint',required:true},
						]}
					],
					name: 'resources',
					actions: [],
					data: {
						resources: resources.map(resource => {
							return {...resource,endpoint:((appinstance.resources||[]).find((r)=>r.name==resource.name)||{enpoint:'none'}).endpoint+''}
						})
					}
				},'#resources .col-sm-9')
				.on('input:endpoint', function(e){
					let endpoint = $g.collections.get('endpoints').find(endpoint=>endpoint.id == e.field.value);
					let help = (typeof endpoint !== 'undefined')? endpoint.config.url : "";
					let resource = resources.find(resource=>resource.name = e.field.parent.get('name'));
						
					help+=(typeof resource !== 'undefined')? resource.path : "";
					
					if(e.field.help !== help ) {						
						e.field.update({help:help}, true)
						e.field.focus();
					}
				})
			}
	
		}
	})
})

$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});