Cobler.types.uApp = function(container){
	function get() {
		item.widgetType = 'uApp';
		return item;
	}
	var item = {}
	var fields = {
		Title: {},
		'App ID': {type: 'select', choices: '/api/appinstances'},
		'Template': {}
	}
	return {
		fields: fields,
		render: function() {
			return templates['widgets_content'].render(get(), templates);
		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
      $.ajax({
          url: 'http://localhost:8000/api/fetch/'+this.get().app_id,
          dataType : 'json',
					type: 'GET',

					success  : function(data){
            var opts = {
              template: this.get().template || 'dashboard',
              $el: $(el).find('.collapsible'),
              crud: function(name, data, callback, verb){
                $.ajax({
                url      : '/api/app_data/'+ this.config.app_id + '/' +name+ '?verb='+verb,
                // dataType : 'json',
                type: 'POST',
                data: {request: data},
                error: function (data) {
                }.bind(this),
                success  : callback.bind(this)
                });
              }
            }
            opts.data = data;
            opts.config = JSON.parse(_.find(apps, {id: parseInt(this.get().app_id,10)}).app.code);
            opts.config.app_id = this.get().app_id;
            $('body').append('<style>'+opts.config.css+'</style>');

            this.bae = new berryAppEngine(opts);
            
            var refetch = function(data){
              this.bae.destroy();
              delete bae;
              this.bae = new berryAppEngine(opts);
              this.bae.app.on('refetch', refetch) 
              // console.log('fetch')
            }.bind(this)
            this.bae.app.on('refetch', refetch) 
          }.bind(this)
      })
		}
	}
}