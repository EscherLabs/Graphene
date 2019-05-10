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
		_.merge(this.data, newData || {});
		_.each(newData,function(i,name){
			this.collections.update(name)
			this.eventBus.dispatch(name,i);
		}.bind(this))
		if(typeof this.inline == 'object' && this.inline instanceof gform) {
			this.inline.set(this.data.user.options)
		}
		this.ractive.set(this.data);
		this.app.trigger('updated')
	}
	function click(selector, callback){
		this.$el.off('click', selector, callback);
		this.$el.on('click', selector, callback);
	}
	// this.handlers = {initialize: []};
	// this.addSub = Berry.prototype.addSub;
	this.forms = {};
	this.grids = {};
	//{initialize: [],refetch:[this.handlers.refetch[0]]}
	this.eventBus = new gform.eventBus({owner:'instance',item:'resource', handlers:{}}, this);
	this.collections =  new gform.collectionManager(this.data)

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
		click: click,
		on: this.eventBus.on,
		// off: Berry.prototype.off.bind(this),
		trigger: this.eventBus.dispatch,
		options: function(newOptions){
			
			this.app.update( { user: $.extend(true,{},this.data.user,{ options: newOptions }  )});
				var url = '/api/apps/instances/' + this.config.app_instance_id + '/user_options';
				if(typeof this.data.user.id !== 'undefined') {
					$.ajax({
						type: 'POST',
						url:url,
						data: {'options': newOptions},
						success:function(data){
							this.app.update( { user: $.extend(true,{},this.data.user,{ options: data.options}  )});
							this.app.trigger('options');
						}.bind(this),
						error:function(data) {
							toastr.error(data.statusText, 'An error occured updating options')
						}
					})
				}else{
					Lockr.set(url, {'options': this.data.user.options})
					this.app.trigger('options');
				}

		}.bind(this),
		$el:this.$el,
		data:this.data,
		find:function(selectors){
			return this.$el[0].querySelectorAll(selectors)
		}.bind(this),
		render:function(template, data){
			return gform.m(this.partials[template],_.extend({}, this.partials, data));
			// return Hogan.compile(this.partials[template]).render(data || this.data);
		}.bind(this),
		version: function(){return '1.2.0'},
		findForm:function(name){
			var form = _.find(this.options.config.forms,{name:name})
			if(typeof form !== 'undefined'){
				try{
					return JSON.parse(form.content);
				}catch(e){}
			}
		}.bind(this),
    form: function(name, target){
		if(typeof this.forms[name] == 'undefined'){

			if(typeof target == 'string'){
				target = this.app.find(target)[0];
			}
			if(typeof name == 'string'){
				var formOptions = this.app.findForm(name);//_.find(this.options.config.forms,{name:name})
				if(typeof formOptions !== 'undefined'){
					try{
						// var formOptions = JSON.parse(form.content);
						formOptions.private = true;
						formOptions.collections = this.collections;
						formOptions.selector = target;
						if(typeof target == 'string'){
							target = this.app.find(target)[0];
						}
						this.forms[name] = new gform(formOptions,target)

						return this.forms[name]
					}catch(e){
						
					}
				}
			}else{
				try{
					var formOptions = name;
					formOptions.private = true;
					formOptions.collections = this.collections;
					formOptions.selector = target;
					var newForm = new gform(formOptions,target)
					this.forms[newForm.name] = newForm;
					return this.forms[newForm.name]
				}catch(e){
					
				}
			}
		}

		return this.forms[name]

		}.bind(this),
		grid: function(name,options){
			if(typeof this.grids[name] == 'undefined'){
				_.each(['create','edit','form'],function(){
					
				})
				if(typeof options.create == 'string'){
					options.create = this.app.findForm(options.create)
				}
				if(typeof options.edit == 'string'){
					options.edit = this.app.findForm(options.edit)
				}	
				if(typeof options.form == 'string'){
					options.form = this.app.findForm(options.form)
				}
				this.grids[name] = new GrapheneDataGrid(_.extend({collections:this.collections,data:this.data[options.resource||name]},options))//new gform(formOptions,this.app.find(target)[0])

				this.collections.on(options.resource,function(e){
					this.load(e.collection);
				}.bind(this.grids[name]))

				if(options.rest){
					this.grids[name].on('model:created',function(e){
						this.app.post(e.grid.resource,e.model.attributes)
					}.bind(this))
					this.grids[name].on('model:edited',function(e){
						this.app.put(e.grid.resource,e.model.attributes)
					}.bind(this))
					this.grids[name].on('model:deleted',function(e){
						this.app.delete(e.grid.resource,e.model.attributes)
					}.bind(this))
				}
			}
			return this.grids[name]
		}.bind(this),
		debug:function(text){
			if(this.data.user.site_developer){
				if(typeof text == 'string'){
				console.log('%c'+this.config.title+': %c'+text,'color: #d85e16','color: #333')
				}
				if(typeof text == 'object'){
					console.log('%c'+this.config.title+'','color: #d85e16')
					console.log(text)
				}
			}
		}.bind(this),
		
		modal:function(options,data){
			var hClass = ''
			switch(options.status){
				case 'error':
					hClass = 'bg-danger';
					break;
				case 'success':
					hClass = 'bg-success';
					break;
				case 'primary':
					hClass = 'bg-primary';
					break;
				case 'info':
					hClass = 'bg-info';
					break;
				case 'warning':
					hClass = 'bg-warning';
					break;
			}
			new gform({legend:options.title,modal:{header_class:hClass},fields:[{type:'output',name:'modal',label:false,format:{},value:gform.m(options.content,_.extend({}, this.partials, data))}],actions:[{type:'cancel',label:'<i class="fa fa-times"></i> Close',"modifiers": "btn btn-default pull-right"}]}).modal().on('cancel',function(e){
				e.form.dispatch('close');
				e.form.destroy();
			});
		}.bind(this),
		alert:function(options,data){
			toastr[options.status||'info'](gform.m(options.content||'',_.extend({}, this.partials, data)),options.title )
		}.bind(this)
		//dialog

		//state
		//table/grid
		//chart
		//use promises and local fetch?
	}
}
 
grapheneAppEngine = 
function(options){

  var temp = function(options) {
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
			app = this.app;
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

			this.inline = new gform({default:{hideLabel:true,type:'text',format:{label: '{{label}}', value: '{{value}}'}},clear:false,data:this.options.data.user.options,fields: JSON.parse(this.options.config.forms[1].content).fields, legend: 'Edit ' + this.type},this.$el[0])
			.on('save', function(e) {
				this.app.options(e.form.get())
			// this.app.update( { user: $.extend(true,{},this.data.user,{ options: this.inline.toJSON() }  )});
			// 	var url = '/api/apps/instances/' + this.config.app_instance_id + '/user_options';
			// 	if(typeof this.data.user.id !== 'undefined') {
			// 		$.ajax({
			// 			type: 'POST',
			// 			url:url,
			// 			data: {'options': this.inline.toJSON()},
			// 			success:function(data){
			// 				this.app.update( { user: $.extend(true,{},this.data.user,{ options: data.options}  )});
			// 				this.optionsupdated();
			// 			}.bind(this),
			// 			error:function(data) {
			// 				toastr.error(data.statusText, 'An error occured updating options')
			// 			}
			// 		})
			// 	}else{
			// 		Lockr.set(url, {'options': this.data.user.options})
			// 		this.optionsupdated();
			// 	}

			}.bind(this));
						// this.inline = this.$el.berry({attributes: this.options.data.user.options, renderer: 'inline', fields: JSON.parse(this.options.config.forms[1].content).fields, legend: 'Edit ' + this.type})


			this.$el.find('form').on('submit', function(e){
				e.preventDefault();
				this.inline.trigger('save');
			}.bind(this) );

			this.$el.find('[data-inline="submit"]').on('click', function(){
				this.inline.trigger('save');
			}.bind(this) );
			

			this.$el.find('[data-form]').each(function(index, form){
				this.app.form(form.dataset.form,form)
			}.bind(this))

			// _.each(this.forms,function(form, name){
			// 	var selector = form.options.selector;
			// 	form.destroy();
			// 	delete this.forms[name];
			// 	this.app.form(name,selector);
			// }.bind(this))
		}


		// _.each(this.forms,function(form, name){
		// }.bind(this))


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
		// this.handlers = {initialize: [],refetch:[this.handlers.refetch[0]]};
			//
			this.eventBus.handlers = {};
	// this.eventBus.handlers = {initialize: [],refetch:[this.eventBus.handlers.refetch[0]]};// = new gform.eventBus({owner:'app',item:'resource',handlers:{initialize: [],refetch:[this.eventBus.handlers.refetch[0]]}}, this);
		if(typeof this.inline == 'object' && this.inline instanceof gform) {
			this.inline.destroy();
		}
		_.each(this.forms,function(form, name){
			form.destroy();
			delete this.forms[name];
		}.bind(this))

		_.each(this.grids,function(grid, name){
			grid.destroy();
			delete this.grids[name];
		}.bind(this))
		this.app.trigger('destroy')
		this.ractive.teardown();
	}
	this.options = $.extend(true, {}, options);
	this.options.initializer = this.options.initializer || 'callback'
	this.config = this.options.config;

	this.get = function() {
		return this.data;
	}
	setTimeout(this.load.bind(this), 0)
}

var newtemp =  new temp(options);

var app = {};
return newtemp;
}