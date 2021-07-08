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
				// this.app.update(data);
				_.extend(this.data, data || {});
				this.app.update();
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
	function update(newData,silent) {
		_.merge(this.data, newData || {});
		_.each(newData,function(i,name){
			this.collections.update(name,i);
			switch(name){
				case "user":
					if(typeof this.inline !== 'undefined'){
						this.inline.set(i.options);
					}
				case "options":
					break;
				default:
				this.eventBus.dispatch(name,i);

			}
		}.bind(this))
		if(typeof this.inline == 'object' && this.inline instanceof gform) {
			this.inline.set(this.data.user.options)
		}
		this.ractive.set(this.data);
		
		this.app.trigger('updated')
	}
	function click(selector, callback){
		this.$el.off('click', selector, callback);
		this.$el.on('click', selector, callback.bind(this));
	}
	// this.handlers = {initialize: []};
	// this.addSub = Berry.prototype.addSub;
	this.forms = {};
	this.grids = {};
	//{initialize: [],refetch:[this.handlers.refetch[0]]}
	this.eventBus = new gform.eventBus({owner:'instance',item:'resource', handlers:{}}, this);
	this.collections =  new gform.collectionManager(this.data)

	var returnable = {
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
		on: this.eventBus.on,
		// off: Berry.prototype.off.bind(this),
		trigger: this.eventBus.dispatch,
		options: function(newOptions){
			this.app.update( { user: $.extend(true,{},this.data.user,{ options: newOptions }  )});
			var url = '/api/apps/instances/' + this.config.app_instance_id + '/user_options';
			if(typeof this.data.user.id !== 'undefined') {
				$.ajax({
					type: 'POST',
					dataType : 'json',
					contentType: 'application/json',
					url:url,
					data: JSON.stringify({'options': newOptions}),
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
			var local_ractive = Ractive({
			template: this.partials[template],
			partials: this.partials,
			data: data
			});
			return local_ractive.toHTML();

			// return gform.m(this.partials[template],_.extend({}, this.partials, data));
			// return Hogan.compile(this.partials[template]).render(data || this.data);
		}.bind(this),
		version: function(){return '1.2.0'},
		findForm:function(name){
			var form = _.find(this.options.config.forms,{name:name})
			if(typeof form !== 'undefined'){
				try{
					form = JSON.parse(form.content);
					form.collections = this.collections;
					form.methods = this.method;
					return form;
				}catch(e){
					this.app.debug('Failed to parse form:'+name )
				}
			}
		}.bind(this),
    form: function(name, target){
		if(typeof this.forms[name] == 'undefined'){

			if(typeof target == 'string'){
				target = this.app.find(target)[0];
			}
			if(typeof name == 'string'){
				var formOptions = _.cloneDeep(this.app.findForm(name));//_.find(this.options.config.forms,{name:name})
				if(typeof formOptions !== 'undefined'){
					// var formOptions = JSON.parse(form.content);
					formOptions.private = true;
					formOptions.collections = this.collections;
					formOptions.selector = target;
					formOptions.methods = this.methods;
					formOptions.data = this.app;

					if(typeof target == 'string'){
						target = this.app.find(target)[0];
					}
					this.forms[name] = new gform(formOptions,target)

					return this.forms[name]
				}
			}else{
				var formOptions = name;
				formOptions.private = true;
				formOptions.collections = this.collections;
				formOptions.selector = target;
				formOptions.methods = this.methods;
				formOptions.data = this.app;
				var newForm = new gform(formOptions,target)
				this.forms[newForm.name] = newForm;
				return this.forms[newForm.name]
			}
		}

		return this.forms[name]

		}.bind(this),
		grid: function(name, options){
			if(typeof this.grids[name] == 'undefined'){
				// _.each(['create','edit','form'],function(i){
				// 	if(typeof options[i] == 'string'){
				// 		options[i] = this.app.findForm(options[i])
				// 	}
				// })
				options = options||{};
				if(typeof options.create == 'string'){
					options.create = _.cloneDeep(this.app.findForm(options.create))
				}
				if(typeof options.edit == 'string'){
					options.edit = _.cloneDeep(this.app.findForm(options.edit))
				}	
				if(typeof options.form == 'undefined'){
					this.app.debug('Form required for grid:'+name )
				}

				if(typeof options.form == 'string'){
					options.form = _.cloneDeep(this.app.findForm(options.form))
				}
				


				this.grids[name] = new GrapheneDataGrid(_.extend({methods:this.methods,collections:this.collections,data:this.data[options.resource||name]},options))//new gform(formOptions,this.app.find(target)[0])
				if(typeof options.resource !== 'undefined'){
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

			}
			return this.grids[name]
		}.bind(this),
		debug:function(text,type){
			if(this.data.user.site_developer){
				if(typeof text == 'string'){
				console.log('%c'+this.config.title+': %c'+text,'color: #d85e16','color: #333')
				}
				if(typeof text == 'object'){
					console[type||'log']('%c'+this.config.title+'','color: #d85e16')
					console[type||'log'](text)
				}
			}
		}.bind(this),
		
		modal:function(options,data){

			if(typeof options == 'string'){
				options = {content:options};
			}
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
			return new gform({legend:options.title,modal:{header_class:hClass},fields:[{type:'output',name:'modal',label:false,format:{},value:gform.m(options.content,_.extend({}, this.partials, data))}],actions:(options.actions||[{type:'cancel',label:'<i class="fa fa-times"></i> Close',"modifiers": "btn btn-default pull-right"}])}).modal().on('cancel',function(e){
				e.form.dispatch('close');
				e.form.destroy();
			});
		}.bind(this),
		alert:function(options,data){
			if(typeof options == 'string'){
				options = {content:options};
			}
			toastr[options.status||'info'](gform.m(options.content||'',_.extend({}, this.partials, data)),options.title )
		}.bind(this)
		//dialog

		//state
		//table/grid
		//chart
		//use promises and local fetch?
	}
	_.each(this.methods,function(method,key){
		if(typeof returnable[key] == 'undefined'){
			returnable[key] = method.bind(this);
		}
	})
	return returnable;
}
 
gAE_v0001 = options => {
		partials = _.reduce(options.config.templates,(partials,_partial)=>{
			partials[_partial.name] = _partial.content;
			return partials
		},{})

	if(typeof component == 'undefined'){
		component = Ractive.extend(
			{data: options.methods,css:options.config.css, template: partials[options.template || 'Main']|| partials['Main'] || partials['main'], partials: partials}
		)
	}
	ractive = component({data: options.data, el: options.$el[0], on: options.methods});

//return {...this};
return ()=>{
	return {...this};
}
}
