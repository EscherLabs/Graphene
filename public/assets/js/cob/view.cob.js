$(function(){
	widgetViewItem = Backbone.View.extend({
		events: {
			'click [data-event]': 'triggerEvent',
			'click [data-popins]': 'blockEvent',
			'click [data-inline]': 'blockEvent',
			'click': 'triggerEvent'
		},
		blockEvent: function(e){
			e.stopPropagation();
		},
		getAttString: function(i){
			return this.model.workflows[i].attrName+'_'+this.model.get(this.model.workflows[i].attrName);
		},
		triggerEvent: function(e) {
				e.stopPropagation();
				if(typeof $(e.currentTarget).data('event') !== 'undefined') {
					switch($(e.currentTarget).data('event')) {
						case 'delete':
							//if(this.berry) { this.berry.destroy(); }
							this.destroy(e);
						break;
						case 'edit':		
							$().berry({legend: '<i class="fa fa-'+myApp.attributes.icon+'"></i> Edit: ' + myApp.attributes.title, model: this.model, fields: myApp.fields});
						break;
						default:
							for(var i in this.model.workflows){
								try{
									var temp = {};
									temp[this.getAttString(i)] = false;
									this.model.triggerEvent($(e.currentTarget).data('event'), this.model.workflows[i].name);
									temp[this.getAttString(i)] = true;
									this.model.save(temp);
								}catch(e){}
							}
					}
				}
				if(typeof $(e.currentTarget).data('href') !== 'undefined') {
					myrouter.navigate($(e.currentTarget).data('href'), {trigger: true});
				}
		},
		render: function() {
			debugger;
			
			if(this.$el.find('[data-popins]').length > 0){
				this.berry = this.$el.berry({ popins: {container: '#content'}, renderer: 'popins', model: this.model, fields: myApp.fields});
			}
			if(this.$el.find('[data-inline]').length > 0){
				this.berry_inline = this.$el.berry({renderer: 'inline', model: this.model, fields: myApp.fields}).delay('change', function(){
					// debugger;
					this.preventRedraw = true;
					this.options.model.save(this.toJSON());
				});
			}
			this.$el.find('[data-event]').hide();
			var list = _.pluck(_.where(this.model.workflows[0].events, {from: this.model.get(this.model.workflows[0].attrName)}), 'name');

			this.$el.find('[data-event="delete"]').show();
			this.$el.find('[data-event="edit"]').show();
			for(var i in list) {
				this.$el.find('[data-event="'+list[i]+'"]').show();
			}
		},
		initialize: function(options) {
			this.template = options.template;
			this.model = options.model;
			this.target = options.target;
			this.setElement(renderMath((render(this.template, this.model.attributes ) || '<i></i>'), this.model.attributes));
			this.model.on('change', function() {
				if(this.berry_inline) {
					if(typeof this.berry_inline.preventRedraw !== 'undefined' && this.berry_inline.preventRedraw == true){
						this.berry_inline.preventRedraw = false;
						return;
					}
				 this.berry_inline.destroy(); }
				if(this.berry) { this.berry.destroy(); }
				this.$el.replaceWith(this.setElement(renderMath((render(this.template, this.model.attributes ) || '<i></i>'), this.model.attributes)).$el);
				this.render()
			}, this);
			this.target[(options.method || 'append')](this.$el);
			this.render()				
		}
	});

	widget_factory.register({
		type: 'view',
		label: 'View',
		icon: 'fa fa-eye-o',
		view: {
			template: 'widgets_view',
			render: function() {
				if(this.model.attributes.view){
					this.stuff = _.where(myApp.views.models, {id: this.model.attributes.view})[0].attributes;
					if(this.model.attributes.use == 'model'){
							new widgetViewItem({template: this.stuff.title, model: appModel, target: this.$el, method: 'html'});
					}else{
						if(this.model.attributes.feed == 'collection'){
							this.collection = stacks;
						}else{
							try{
								this.collection = new dataCollection([], myApp.feeds.findWhere({_id: this.model.attributes.feed}).attributes);
								this.collection.fetch();
							}catch(e){
								this.collection = stacks;
							}
						}
						this.collection.each($.proxy(function(model){
							new widgetViewItem({template: this.stuff.title, model: model, target: this.$el});
						}, this));
					}
				}
			},
			initialize: function(){
				this.setElement(render(this.template, this.model.attributes ));
				// var atts = _.pluck(myApp.views.models, 'attributes')
				this.model.schema.View.choices = _.pluck(myApp.views.models, 'attributes');
				this.model.schema.Feed.choices = _.pluck(myApp.feeds.models, 'attributes')
				// this.model.schema.Sort.choices = _.pluck(myApp.feeds.models[0].attributes.columns, 'label');
			}
		},
		model: {
			schema:{
				Title: {},
				View: {type: 'select', key: 'title', reference: '_id', required: true},
				Use: {type: 'radio', choices: ['model', 'collection'], value: 'model'},
				Feed: {type: 'select', key: 'title', reference: '_id', value: 'collection', required: true, default: {title: 'Current Collection', _id: 'collection'}, parsable: {not_matches:{name: 'use', value: 'model'}}, show: 'parsable'},
				Sort: {type: 'select', reference: 'key', choices: loadCollections, parsable: {not_matches:{name: 'use', value: 'model'}}, show: 'parsable'},
			},
		},
	});
});

// function loadCollections(){
// 	if(this.toJSON('use') == 'model' || this.toJSON('feed') == 'collection'){
// 		return _.values(myApp.fieldmap);
// 	} else {
// 		return _.pluck(myApp.feeds.models[0].attributes.columns, 'label');
// 	}
// }