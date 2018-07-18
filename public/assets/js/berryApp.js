function App() {
	function router(verb, name, data, callback) {
		var callback = callback || function(data) {
		if(data.error) {
				if (data.error.message) {
					modal({title: "ERROR", content: data.error.message, modal:{header_class:"bg-danger"}});
				} else {
					modal({title: "ERROR", content: data.error, modal:{header_class:"bg-danger"}});
				}
			}else{
				console.log(data);
			}
		};
		(this.options[verb] || _.partial(this.options.crud, _, _, _, verb) || function(){}).call(this, name, data, callback.bind(this))
	}
	function redraw() {
		this.destroy();
		this.draw();
	}
	function refresh(skipFetch) {
		this.destroy();
		this.config = $.extend(true, {}, this.options.config);
		this.$el.html(this.options.defaultHtml);
		if(!skipFetch){
			$.ajax({
			type: 'POST',
			url:'/api/fetch/'+this.config.app_instance_id,
			data: (Lockr.get('/api/apps/instances/'+this.config.app_instance_id+'/user_options')|| {options:{}}),
			success:function(data){	
				if(typeof data.user.id == 'undefined') {
					var url = '/api/apps/instances/'+this.config.app_instance_id+'/user_options';
					data.user.options = (Lockr.get(url)|| {options:{}}).options;
				}
				this.app.update(data);
				this.load();
			}.bind(this),
				error:function(data){
					toastr.error(data.statusText, 'An error occured updating App')
				}
			})
		}else{		
			this.load();
		}
	}
	function update(newData) {
		$.extend(this.data, newData || {});
		this.ractive.set(this.data);
		this.app.trigger('updated')
	}
	function click(selector, callback){
		this.$el.off('click', selector, callback.bind(this));
		this.$el.on('click', selector, callback.bind(this));
	}
	this.events = {initialize: []};
	this.addSub = Berry.prototype.addSub;
	return {
		post:_.partial(router, 'POST').bind(this),
		get:_.partial(router, 'GET').bind(this),
		put:_.partial(router, 'PUT').bind(this),
		delete:_.partial(router, 'DELETE').bind(this),
		
		redraw: redraw.bind(this),
		refresh: refresh.bind(this),

		refetch: function(){
			this.app.trigger('refetch');
		}.bind(this),		

		update: update.bind(this),

		click: click.bind(this),

		on: Berry.prototype.on.bind(this),
		off: Berry.prototype.off.bind(this),
		trigger: Berry.prototype.trigger.bind(this),

		$el:this.$el,

		find:function(selectors){
			return this.$el[0].querySelectorAll(selectors)
		}.bind(this),
		render:function(template, data){
			return Hogan.compile(this.partials[template]).render(data || this.data);
		}.bind(this),
		version: function(){return '1.0.0'}
		// debug:function(text){
		// 	if(this.data.user.site_developer){
		// 		console.log(text)
		// 	}
		// }.bind(this)
		
		//modal
		//message
		//dialog
		//debug
		//form
			//alert?

		//state
		//table
		
		//chart
		//use promises and local fetch?
	}
}
 
berryAppEngine = function(options) {
  this.load = function() {
		this.partials = {};
		for(var i in this.config.templates) {
			this.partials[this.config.templates[i].name] = this.config.templates[i].content;
		}

		if(typeof this.config.scripts == 'object') {

			this.config.script = _.reduce(this.config.scripts, function(sum, n) {
				return sum+';\n\n\n/*-- New File - ' + n.name+' --*/\n\n' + n.content;
			}, '//'+this.config.title+' ('+this.config.app_instance_id+')\nfunction mount(){var context = this;\n/*- Custom Code starts Here -*/');
			this.config.script+='\n\n/*- Custom Code Ends Here -*/;return this;}'

		}

		var mountResult = (function(data, script) {
			// try{
				eval(script);
				return mount.call({data:data});	
			// }catch(e){
			// }		
		})(this.options.data || {}, this.config.script)

		if(typeof mountResult !== 'undefined') {
			this.data= mountResult.data;
			this.methods = {};
			for(var i in mountResult) {
				if(typeof mountResult[i] == 'function') {
					this.methods[i] = mountResult[i].bind(this);
				}
			}
		} else {
			this.data = this.options.data;
		}

		this.data.options = $.extend({}, this.data.options);

    this.$el = this.options.$el;
    if(typeof this.app == 'undefined'){
      this.app = App.call(this)
    }
		this.draw()
		if(typeof this.options.onLoad == 'function'){
			this.options.onLoad.call(this);
		}
  }

  this.draw = function() {
		this.options.defaultHtml = this.$el.html();
    this.ractive = new Ractive({el: this.$el[0], template: this.partials[this.options.template || 'Main']|| this.partials['Main'] || this.partials['main'], data: this.data, partials: this.partials});

		this.$el.find('[data-toggle="tooltip"]').tooltip();
		this.$el.find('[data-toggle="popover"]').popover();

		if(this.$el.find('[data-inline]').length && this.options.config.forms[1].content.length) {//} > 0 && this.userEdit.length > 0){
			this.inline = this.$el.berry({attributes: this.options.data.user.options, renderer: 'inline', fields: JSON.parse(this.options.config.forms[1].content).fields, legend: 'Edit ' + this.type}).on('save', function() {
			this.app.update( { user: $.extend(true,{},this.data.user,{ options: this.inline.toJSON() }  )});
				var url = '/api/apps/instances/' + this.config.app_instance_id + '/user_options';
				if(typeof this.data.user.id !== 'undefined') {
					$.ajax({
						type: 'POST',
						url:url,
						data: {'options': this.inline.toJSON()},
						success:function(data){
							this.app.update( { user: $.extend(true,{},this.data.user,{ options: data.options}  )});
							this.optionsupdated();
						}.bind(this),
						error:function(data) {
							toastr.error(data.statusText, 'An error occured updating options')
						}
					})
				}else{
					Lockr.set(url, {'options': this.data.user.options})
					this.optionsupdated();
				}

			},this);

			this.$el.find('form').on('submit', $.proxy(function(e){
				e.preventDefault();
			}, this) );

			this.$el.find('[data-inline="submit"]').on('click', $.proxy(function(){
				this.inline.trigger('save');
			}, this) );
		}

		if(typeof this.methods !== 'undefined' && typeof this.methods[this.options.initializer] !== 'undefined') {
	
      this.methods[this.options.initializer].call(this,this);
      this.app.on('call', function(name, args) {
        if(typeof this.methods[name] !== 'undefined'){ this.methods[name].call(this, args.args) }
      })
      this.app.on('apply', function(name, args) {
        if(typeof this.methods[name] !== 'undefined'){ this.methods[name].apply(this, args.args) }
      }) 
    }
  }
  this.call = function(method, args) {
    this.app.trigger('call', method, args);
  }
	this.destroy = function() {
		this.$el.off('click');
		this.events = {initialize: [],refetch:[this.events.refetch[0]]};
		if(typeof this.inline == 'object' && this.inline instanceof Berry) {
			this.inline.destroy();
		}
		this.app.trigger('destroy')
		this.ractive.teardown();
	}
	this.options = $.extend(true, {}, options);
	this.options.initializer = this.options.initializer || 'callback'
	this.config = this.options.config;

	this.get = function() {
		return this.data;
	}

	this.optionsupdated = function() {
		this.app.trigger('options');
	}
	setTimeout(this.load.bind(this), 0)
}