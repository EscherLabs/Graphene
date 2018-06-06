Cobler.types.uApp = function(container){
	function get() {
		item.widgetType = 'uApp';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
		'App ID': {type: 'select', choices: '/api/groups/'+group_id+'/appinstances'},
    'User Options':{name:'user_edit',type:'checkbox'},
		// 'Template': {}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
			return templates['widgets_microapp'].render(get(), templates);
		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
    if(typeof this.get().app_id == 'undefined'){return false;};
      this.fields['App ID'].enabled = false;
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:false}).collapsed;
	  		  this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
          //$(el).find('.collapsible').toggle(!collapsed)
      }

      $.ajax({
          url: '/api/fetch/'+this.get().app_id,
          dataType : 'json',
					type: 'GET',

					success  : function(data){
            var opts = {
              template: this.get().template || 'dashboard',
              $el: $(el).find('.collapsible'),
              crud: function(name, data, callback, verb){
                $.ajax({
                url: '/api/app_data/'+ this.config.app_instance_id + '/' +name+ '?verb='+verb,
                // dataType : 'json',
                type: 'POST',
                data: {request: data},
                error: function (data) {
                  if(data.responseJSON.error) {
                    toastr.error(data.responseJSON.error.message || data.responseJSON.error,'ERROR')
                  }else{
                    toastr.error(data.statusText, 'ERROR')
                  }
                }.bind(this),
                success  : callback.bind(this)
                });
              }
            }
            opts.data = data;
            opts.config = (_.find(apps, {id: parseInt(this.get().app_id,10)}) || _.find(Berry.collection.get('/api/groups/'+group_id+'/appinstances'), {id: parseInt(this.get().app_id,10)})).app.code || {};
            // opts.config = _.find(Berry.collection.get('/api/appinstances'), {id: parseInt(this.get().app_id,10)}).app.code;
            opts.config.app_instance_id = this.get().app_id;
            $('body').append('<style>'+opts.config.css+'</style>');
            this.bae = new berryAppEngine(opts);
            
            this.bae.app.on('refetch', function(data){
              $.ajax({
                type: 'GET',
                url:'/api/fetch/'+this.get().app_id,
                success:function(data){
                  this.bae.app.update(data);
                  // toastr.success('', 'Data refetched Successfully');
                }.bind(this),
                error:function(data){
                    toastr.error(data.statusText, 'An error occured updating App')
                }
              })
            }.bind(this));
          }.bind(this)
      })
		}
	}
}