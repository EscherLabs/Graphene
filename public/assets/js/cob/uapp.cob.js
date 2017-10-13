Cobler.types.uApp = function(container){
	function get() {
		item.widgetType = 'uApp';
		return item;
	}
	var item = {}
	var fields = {
		Title: {},
		'App ID': {type: 'select', choices: '/api/appinstances'},
		// 'Template': {}
	}
	return {
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
            opts.config = _.find(apps, {id: parseInt(this.get().app_id,10)}).app.code;
            opts.config.app_instance_id = this.get().app_id;
            $('body').append('<style>'+opts.config.css+'</style>');

            this.bae = new berryAppEngine(opts);
            
            var refetch = function(data){
              $.ajax({
                type: 'GET',
                url:'/api/fetch/'+this.get().app_id,
                success:function(data){
                  this.bae.app.update(data);
                  toastr.success('', 'Data refetch Successfully');
                }.bind(this),
                error:function(data){
                    toastr.error(data.statusText, 'An error occured updating App')
                }
              })
            }.bind(this)
            this.bae.app.on('refetch', refetch);
          }.bind(this)
      })
		}
	}
}