function App() {
	function router(verb, name, data, callback){
		var callback = callback || function(data){
		if(data.error){
				if (data.error.message) {
					modal({title: "ERROR",content: data.error.message, modal:{header_class:"bg-danger"}});
				} else {
					modal({title: "ERROR",content: data.error, modal:{header_class:"bg-danger"}});
				}
			}else{
				console.log(data);
			}
		};
		(this.options[verb] || _.partial(this.options.crud, _, _, _, verb) || function(){}).call(this, name, data, callback.bind(this))
	}
	function redraw() {
		if(typeof this.inline == 'object' && this.inline instanceof Berry) {
			this.inline.destroy();
		}
		this.$el.off('click');
		this.app.trigger('teardown')
		this.view.teardown();
		this.draw();
	}
	function refresh() {
		this.$el.off('click');
		this.app.trigger('teardown')
		this.view.teardown();

		this.config = $.extend(true, {}, this.options.config);
		this.load();
		this.app.trigger('refreshed')
	}
	function update(newData) {
		$.extend(true, this.data, newData || {});
		this.view.set(this.data);
		this.app.trigger('updated')
	}
	function click(selector, callback){
		// this.$el.off('click', selector, callback.bind(this));
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
		update: update.bind(this),
		click: click.bind(this),
		
		on: Berry.prototype.on.bind(this),
		off: Berry.prototype.off.bind(this),
		trigger: Berry.prototype.trigger.bind(this)
	}
}
 
berryAppEngine = function(options) {
  this.load = function() {
  // var parsed_template = this.config.templates;
  this.partials = {};
  for(var i in this.config.templates) {
  	this.partials[this.config.templates[i].name] = this.config.templates[i].content;
  }
  
  try{
		var temp = JSON.parse(this.config.scripts);
		this.config.script = temp;
  }catch(e){}
  if(typeof this.config.scripts == 'object') {
  	this.config.script = _.map(this.config.scripts, 'content').join(';');
  }
  var mountResult = (function(data, script) {
  try{
		eval('function mount(){'+script+';return this;}');
		return mount.call({data:data});
  }catch(e) {
		console.log(e);
		return undefined;
  }
  })(this.options.data || {}, this.config.script)
  if(typeof mountResult !== undefined) {
    this.data= mountResult.data;
    
    this.methods = {};
    for(var i in mountResult) {
			if(typeof mountResult[i] == 'function') {
				this.methods[i] = mountResult[i];
			}
    }
  }
    if(typeof this.app == 'undefined'){
      this.app = App.call(this)
    }
    this.$el = this.options.$el;
    this.draw()
  }
 
  this.draw = function() {
    this.view = new Ractive({el: this.$el[0], template: this.partials[this.options.template || 'main'], data: this.data, partials: this.partials});
    if(typeof this.methods[this.options.initializer] !== 'undefined') {
      this.methods[this.options.initializer].call(this);
      this.app.on('call', function(name, args){
        if(typeof this.methods[args.name] !== 'undefined'){this.methods[args.name].call(this,args.args)}
      })
      this.app.on('apply', function(name, args){
        if(typeof this.methods[args.name] !== 'undefined'){this.methods[args.name].apply(this, args.args)}
      }) 
    }
  }
	this.destroy = function(){
			this.$el.off('click');
			this.app.trigger('teardown')
			this.view.teardown();
	}
	this.options = $.extend(true, {}, options);
	this.options.initializer = this.options.initializer || 'callback'
	this.config = this.options.config;
	this.load();
}