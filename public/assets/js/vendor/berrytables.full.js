function berryTable(options) {
	this.version = '0.1.0';
	options = $.extend(true, {filter: true, sort: true, search: true, download: true, upload: true, columns: true, id:Berry.getUID()}, options);
	options.events = _.map(options.events,function(event){
    return $.extend(true, {global:false},event)
	})

	var loaded = false;
	if (window.localStorage && options.name) {
		try{
		loaded = JSON.parse(localStorage.getItem('bt_'+options.name));
		}catch(e){};
	}
	if(options.item_template ){options.item_template= Hogan.compile(options.item_template)}else{
		if(window.outerWidth > 991){//767){
			options.item_template = templates['table_row'];
		}else{
			options.item_template = templates['mobile_row'];
		}
	}

	this.filterValues = {};
	this.draw = function() {
		_.each(this.summary.items, function(item){
			this.$el.find('.filter #'+item.id+',[data-sort='+item.id+']').toggle(item.isEnabled);
		}.bind(this))
		// if(this.$el.find('.filter').length){
			options.search = this.filterValues;
			_.each(options.search, function(item, index) {
				if(!item && (item !== 0)) {
					delete options.search[index];
				}
			});

			// options.search = o;
		// }else{
		// 	options.search = {};
		// }
		var pagebuffer = options.pagebuffer || 2;

		if(this.$el.find('[name="search"]').length && this.$el.find('[name="search"]').val().length){
			this.searchAll(this.$el.find('[name="search"]').val());
		}else{
			this.search(options);
		}

		var renderObj = {};
		options.pagecount = Math.ceil(this.lastGrabbed / options.count);
		renderObj.pages = [];

		if(options.page > options.pagecount){
				options.page = options.pagecount || 1;
		}
		var showing = (this.lastGrabbed>(options.count * options.page))? (options.count * options.page) : this.lastGrabbed;

		var newContainer = $('<tbody class="list-group">');
		var view = Hogan.compile(options.item_template.render(summary, templates));

		_.each(this.grab(options), function(model) {
			new viewitem({ 'model': model, container: newContainer, view: view});
		});
		var container = this.$el.find('.list-group').empty().replaceWith(newContainer);
		var startpage = options.page - pagebuffer;
		if(startpage < 1){startpage = 1;}
		var endpage = options.page + pagebuffer;
		if(endpage >options.pagecount){endpage = options.pagecount}

		for(var i = startpage; i <= endpage; i++){
			var page = {name: i};
			if(options.page == i){
				page.active = 'active';
			}
			renderObj.pages.push(page);
		}
		renderObj.size = this.lastGrabbed;
		renderObj.last = showing;
		renderObj.first = ( (options.count * (options.page-1) ) + 1);

		renderObj.multiPage = (endpage > startpage);
		renderObj.isFirst = (options.page == 1);
		renderObj.isLast = (options.page == options.pagecount);
		renderObj.showLast = (options.pagecount == endpage);
		renderObj.showFirst = (startpage == 1);
		renderObj.checked_count = _.where(this.models, {checked: true}).length;

		renderObj.entries = _.map(options.entries,function(item){
			return {value:item, selected: (item==options.count)}
		},options)

		this.renderObj = renderObj;
		this.$el.find('.paginate-footer').html(templates['table_footer'].render(this.renderObj, templates));
		this.summary.checked_count = _.where(this.models, {checked: true}).length;
		this.summary.multi_checked = (this.summary.checked_count>1);
		this.$el.find('[name="events"]').html(templates['events'].render(this.summary, templates));
		this.fixStyle();
		if (window.localStorage && options.name) {
			localStorage.setItem('bt_'+options.name, JSON.stringify(this.state.get())) ;
		}
	}

	this.drawHead = function(){

	}

	var changePage = function(e) {
		e.stopPropagation();
		e.preventDefault();
		if($(e.currentTarget).data('page') == 'inc') {
			options.page++;
			if(options.page > options.pagecount){options.page = options.pagecount}

		}else if($(e.currentTarget).data('page') == 'dec') {
			options.page--;
			if(options.page < 1){options.page = 1}
		}else{
			options.page = $(e.currentTarget).data('page') || options.pagecount;
		}
		this.draw();
	}

	var processSort = function(sortField, reverse) {
		if(sortField == true){
			this.$el.find('.reverse, [data-sort]').removeClass('text-primary').find('i').attr('class', 'fa fa-sort text-muted')
			this.$el.find('.sortBy').val('true');
			options.reverse = false;
		}else{
			if(typeof reverse == 'undefined') {
				if(options.sort == sortField) {
						options.reverse = !options.reverse;
				}else{
					options.reverse = false;
				}
			}else{
				options.reverse = reverse;
			}
			var current = this.$el.find('.reverse, [data-sort=' + _.findWhere(this.options.filterFields,{search:sortField}).id + ']')
			if(typeof current !== 'undefined'){
				if(options.reverse) {
					current.find('i').attr('class', 'fa fa-sort-asc');
				}else{
					current.find('i').attr('class', 'fa fa-sort-desc');
				}
				current.siblings('[data-sort]').removeClass('text-primary');
				current.siblings('[data-sort]').find('i').attr('class', 'fa fa-sort text-muted');
				current.addClass('text-primary');
			}
		}
		options.sort = sortField;

	}

	var options = $.extend({count: options.count || 25, page: 1, sort: 'createdAt', reverse: false}, options);
	self = this;
	options.schema = //_.map(
		_.map(options.schema, function(item){
		return Berry.processOpts(item,{update:function(options){
			this.item.choices = options.choices; 
			this.item.options = options.choices; 
			var schema = this.self.options.schema;
			_.each(this.self.models,function(model){
				model.schema = schema;
				model.pat();
			})
			this.self.draw();

		}.bind({item:item,self:self}) });
	} )
	// 	, function(item){
	// 	item.value = item.value || item.default;
	// 	delete item.default;
	// 	return item;
	// });

	if(typeof options.filters !== 'undefined'){
		options.filters = _.map(options.filters, Berry.processOpts)
	}
	options.filterFields = _.map($.extend(true, {}, options.filters || options.schema), function(val){
		val = Berry.normalizeItem(val);
		name = val.name;
		val.value = '';
		switch(val.type){
			case 'checkbox':
				val.choices = [{label: 'False', value: 'false'}, {label: val.truestate || 'True', value: val.truestate || 'true'}];
				if(typeof val.falsestate !== 'undefined'){
					val.choices[0].label = val.falsestate;
					val.choices[0].value = val.falsestate;
				}
			case 'radio':
				val.type = 'select';
			case 'select':
				val.default = {label: 'No Filter', value: ''};
				break;
		case 'hidden':
				break;
			default:
				val.type = 'text';
		}
		if(val.options){
			val.options = _.map(val.options, function(item){
				return _.omit(item, 'selected');
			})
		}
		val.id = val.id || Berry.getUID();
		val.search = val.name;
		val.name = val.id;
		val.show = {};
		// val.isEnabled = true;
		val.enabled = true;
		return val;
	});
	if(typeof options.columns == 'object'){
			options.filterFields = _.filter(options.filterFields, function(item){
					return (_.contains(options.columns, item.name) || _.contains(options.columns,item.id))
			})
	}

	var summary = {'start':'{{', 'end':'}}',checked_count:0,multi_checked:false,multiEdit:!!options.multiEdit ,'items': _.map(options.filterFields, function(val){
		var name = (val.search|| val.label.split(' ').join('_').toLowerCase());

		if(val.template){
			name = val.template.replace(/{{value}}/gi, '{{attributes.'+ name + '}}');

		}else{
			switch(val.type){
				case 'date':
					name = '<span data-moment="{{attributes.'+name+'}}" data-format="L"></span>'
					break;
				case 'select':
						if(options.inlineEdit){
							name = '<span data-popins="'+name+'"></span>';
						}else{
							name = '{{display.'+ name + '}}'
						}
					break;
				case 'color':
					name = '<div class="btn btn-default" style="background-color:{{attributes.'+name+'}}">{{attributes.'+name+'}}</div> {{attributes.'+name+'}}'
					break;
				default:
					// name = '{{attributes.'+ name + '}}'
					if(options.inlineEdit){
						name = '<span data-popins="'+name+'"></span>';
					}else{
						name = '{{attributes.'+ name + '}}'
					}
			}
		}
		return {'isEnabled': (typeof val.showColumn =='undefined' || val.showColumn), 'label': val.label, 'name': name, 'cname': (val.name|| val.label.split(' ').join('_').toLowerCase()), 'id': val.id, 'visible':!(val.type == 'hidden')} 
	})};
	options.hasActions = !!(options.edit || options.delete || options.events);
	options.hasEdit = !!(options.edit);
	options.hasDelete = !!(options.delete);
	options.entries = options.entries || [25, 50 ,100];
	summary.options = options;
	summary.showAdd = !!(options.add) || options.showAdd;

	this.defaults = {};
	_.map(options.filterFields, function(val){
		switch(val.type){
			case 'text':
				val.value = '';
				break;
			case 'checkbox':
				val.value = 'false';
			case 'radio':
				val.value = '';
			case 'select':
				val.value = '';
				break;
			default:
		}
		this.defaults[val.name] = val.value;
	}.bind(this));
	this.summary = summary;
	var template;
	if(options.template ){
		template= Hogan.compile(Hogan.compile(options.template).render(summary, templates));  
	}else{
		if(window.outerWidth > 991){//767){
			template = Hogan.compile(templates['table'].render(summary, templates));
		}else{
			template = Hogan.compile(templates['mobile_table'].render(summary, templates));
		}
	}

	function render(){
		return template.render();
	}
	var silentPopulate = function(attributes,fields) {this.each(function(attributes) {if(!this.isContainer) {this.setValue(Berry.search(attributes, this.getPath()));}}, [attributes], this.fields);}

	function handleFiles(table, e) {
		var files = this.files
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
      (function (fileToRead) {
	      var reader = new FileReader();
	      // Read file into memory as UTF-8      
	      reader.readAsText(fileToRead);
	      reader.onload = function (event) {
		      var csv = event.target.result;
		      var temp = CSVToArray(csv);
		      var valid = true;

					$('#myModal').remove();
					var ref = $(templates['modal'].render({title: "Importing CSV ",footer:'<div class="btn btn-danger" data-dismiss="modal">Cancel</div>', body:'<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100" style="width: 0%"><span class="sr-only">50% Complete</span></div></div><div class="status">Validating Items...</div>'}));
					ref.modal();
					ref.on('hidden.bs.modal', function () {
		      	this.importing = false;
					}.bind(this));

					var itemCount = temp.length-1;
					var totalProgress = itemCount*2;
					var items = [];
					this.importing = true;
					temp[0] = _.map(temp[0], function(item){
						var search = _.findWhere(options.schema, {label:item});
						if(search == null){
							search = item;
						}else{
							search = search.name;
						}
						return search;
					})
		      for(var i = 1; i<temp.length; i++){
		      	if(!this.importing) return false;
		      	if(temp[0].length == temp[i].length){
				      var newtemp = {}
				      for(var j in temp[0]){
				      	newtemp[temp[0][j]] = temp[i][j]
				      }
				      valid = table.validate(newtemp);
				      if(!valid){
								 break;
								}
				      items.push(valid);
			    	}else{
			    		itemCount--;
			    	}
						ref.find('.progress-bar').width((i/totalProgress)*100 +'%')
			    }

			    if(valid){
			    	ref.find('.status').html('Adding Items...');
			      for(var i = 0; i<items.length; i++){
			      	if(!this.importing) return false;
				      table.add(items[i]);
							ref.find('.progress-bar').width(((i+itemCount)/totalProgress)*100 +'%')
				    }
			    }else{
			    	ref.find('.btn').html('Done');
			    	ref.find('.status').html('<div class="alert alert-danger">Error(s) in row '+i+ ', failed to validate!<ul><li>'+_.filter(table.errors,function(item){return item.length;}).join('</li><li>')+'</li></div>')
			    	return;
			    }
		    	ref.find('.status').html('<div class="alert alert-success">Successfully processed file, '+itemCount+ ' rows were added!</div>')
		    	ref.find('.btn').toggleClass('btn-danger btn-success').html('Done');
		    	ref.find('.progress').hide();
					if(typeof table.options.defaultSort !== 'undefined'){
						table.models = _.sortBy(table.models, function(obj) { return obj.attributes[this.options.defaultSort]; }.bind(table)).reverse();
					}

		    	if(typeof table.options.onBulkLoad == 'function'){
						table.options.onBulkLoad();
					}		    	

		    }
	      reader.onerror = function (evt) {
		      if(evt.target.error.name == "NotReadableError") {
		          alert("Canno't read file !");
		      }
		    }
	    })(files[0]);
	    e.currentTarget.value = '';

    } else {
        alert('FileReader is not supported in this browser.');
    }
  }

	function onload($el){
		this.$el = $el;

		if(this.options.columns){
			this.$el.on('click', '.columnEnables label', function(e){
				e.stopPropagation();
				_.findWhere(this.summary.items, {id:e.currentTarget.dataset.field}).isEnabled = e.currentTarget.childNodes[0].checked;
				this.draw();
			}.bind(this));
		}

		this.$el.on('change', '.csvFileInput', _.partial(handleFiles, this));
		this.$el.on('change', '.sortBy', function(e) {
			if($(e.currentTarget).val() !== ''){
				processSort.call(this,(_.findWhere(this.options.filterFields, {id:$(e.currentTarget).val()}) || {search:true}).search)
				this.draw();
			}
		}.bind(this));		

		this.$el.on('click', '.reverse', function(e) {
				processSort.call(this, this.options.sort)
				this.draw();
		}.bind(this));

		this.$el.on('click', '.filterForm', function(e) {
				this.$el.find('[name="search"]').val('');

				$().berry({legend:"Filter By" ,name:'modal_filter'+this.options.id,attributes:this.filterValues, disableMath: true, suppress: true, fields: options.filterFields }).on('save', function(){
					this.filterValues = Berries['modal_filter'+this.options.id].toJSON();
					this.draw();					
					Berries['modal_filter'+this.options.id].trigger('close');

				}, this);
		}.bind(this));		

		this.$el.on('click','[name="bt-upload"]', function(){
			this.$el.find('.csvFileInput').click();
		}.bind(this));

		this.$el.on('click', '[data-event="delete"]', function(e){
				$(e.target).closest('.dropdown-menu').toggle()
				var model = _.findWhere(this.models, {id:e.currentTarget.dataset.id});
				if(confirm("Are you sure you want to delete? \nThis operation can not be undone.\n\n"+ _.values(model.attributes).join('\n') )){
		
					if(typeof this.options.delete == 'function'){
						this.options.delete(model);
					}
					model.delete();
					this.draw();
					this.updateCount(_.where(this.models, {checked: true}).length)
				}
		}.bind(this));

		this.$el.on('click', '[data-event="delete_all"]', function(e){
			  var checked_models = _.where(this.models, {checked: true})
				if (checked_models.length) {
					if(confirm("Are you sure you want to delete "+checked_models.length+" records? \nThis operation can not be undone.\n\n" )){
						_.each(checked_models, function(item){
							if(typeof this.options.delete == 'function'){
								this.options.delete(item);
							}
								item.delete();
						}.bind(this))
						this.draw();
						this.updateCount(_.where(this.models, {checked: true}).length)
					}	
				}

		}.bind(this));

		this.$el.on('click','[data-event].custom-event-all', function(e){
			e.stopPropagation();
			var event = _.findWhere(this.options.events, {name:e.target.dataset.event})

			if(typeof event !== 'undefined' && typeof event.callback == 'function'){
				if(event.multiEdit	&& _.where(this.models, {checked: true}).length >1) {
					_.each(_.where(this.models, {checked: true}), function(model){
						event.callback(model);
					})
				}else{
					event.callback(_.where(this.models, {checked: true})[0]);
				}
				if(typeof event.complete == 'function'){
					event.complete(_.where(this.models, {checked: true}),this);
				}

			}

		}.bind(this));
		this.$el.on('click','[data-event].custom-event-collection', function(e){
			e.stopPropagation();
			var event = _.findWhere(this.options.events, {name:e.target.dataset.event})

			if(typeof event !== 'undefined' && typeof event.callback == 'function'){
					event.callback.call(this,this.models);
			}

		}.bind(this));
		this.$el.on('click','[data-event="edit_all"]', function(e){
			e.stopPropagation();
			if(	typeof this.options.multiEdit !== 'undefined' && 
				this.options.multiEdit.length !== 0 &&
				_.where(this.models, {checked: true}).length >1) {

				this.editCommon();

			}else{
				$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Edit', model: _.where(this.models, {checked: true})[0]}, this.options.berry || {} ) ).on('saved', function() {
					if(typeof this.options.edit == 'function'){
						this.options.edit(_.where(this.models, {checked: true})[0]);
					}
					if(typeof this.options.editComplete === 'function'){
						this.options.editComplete(_.where(this.models, {checked: true}), this);
					}
					this.draw();
				}, this)
			}
		}.bind(this));

		this.$el.on('change', '[name="count"]', function(e) {
			options.count = parseInt($(e.currentTarget).val(),10);
			this.draw();
		}.bind(this))

		this.$el.on('input', '[name="search"]', _.debounce(function(e) {
			this.draw();
		}.bind(this), 300));


		if($el.find('.filter').length) {
			this.filter = $el.find('.filter').berry({name:'filter'+this.options.id,renderer: 'inline' ,disableMath: true, suppress: true, fields: options.filterFields }).on('change', function(){
				this.$el.find('[name="search"]').val('');
				this.filterValues = this.filter.toJSON();
				this.draw();
			}, this);
			silentPopulate.call(this.filter, this.defaults);

			//attributes: this.defaults
		}

		this.updateCount =function(count) {
			this.summary.checked_count = count;
			this.summary.multi_checked = (count>1);

			var checkbox = this.$el.find('[data-event="select_all"].fa');

			if(count>0 && count == this.models.length){
				checkbox.attr('class', 'fa fa-2x fa-check-square-o');
			}else if(count == 0){
				checkbox.attr('class', 'fa fa-2x fa-square-o');
			}else{
				checkbox.attr('class', 'fa fa-2x fa-minus-square-o');
			}

		}

		this.$el.on('click', '[data-event="select_all"]', function(e){
			  var checked_models = _.where(this.models, {checked: true});

				if (checked_models.length || this.models.length == 0) {						
					_.each(checked_models, function(item){item.toggle(false)})			
				} else {
					_.each(this.filtered, function(item){item.toggle(true)})			
				}		
			  checked_models = _.where(this.models, {checked: true})
				this.updateCount(checked_models.length);

		}.bind(this));


		if(options.data) {
			for(var i in options.data) {
				this.models.push(new tableModel(this, options.data[i]).on('check', function(){
						this.owner.updateCount(_.where(this.owner.models, {checked: true}).length);
						this.owner.$el.find('[name="events"]').html(templates['events'].render(this.owner.summary, templates));
					})
				);
			}
		}
		if(typeof this.options.defaultSort !== 'undefined'){
			this.models = _.sortBy(this.models, function(obj) { return obj.attributes[this.options.defaultSort]; }.bind(this)).reverse();
		}


		this.$el.on('click','[data-page]', changePage.bind(this));
		if(options.sort){
			this.$el.on('click','[data-sort]', function(e) {
				e.stopPropagation();
				e.preventDefault();
				var sortField = _.findWhere(this.options.filterFields, {name: $(e.currentTarget).data('sort')}).search;
				if(this.options.reverse && this.options.sort == sortField){
					processSort.call(this, true);
				}else{
					processSort.call(this, sortField);
				}
				//this.drawHead();
				this.draw();
			}.bind(this))
		}
		this.$el.on('click','[name="reset-search"]', function(){
			this.$el.find('[name="search"]').val('');
			// options.sort = null;
			processSort.call(this, true);

			if(this.filter) {
				silentPopulate.call(this.filter, this.defaults)
			}
			this.filterValues = {};
			this.draw();
		}.bind(this));
		this.$el.on('click','[name="bt-download"]', function(){
			this.getCSV();
		}.bind(this));
		this.$el.find('[data-event="add"]').on('click', function(){
			var event = _.findWhere(this.options.events, {name:'add'});

			if(typeof event !== 'undefined' && typeof event.callback == 'function'){
				event.callback.call(this);
			}else{
				$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Create New', fields: options.schema}, options.berry || {} )).on('save', function() {
					if(Berries.modal.validate()){
						var newModel = new tableModel(this, Berries.modal.toJSON()).on('check', function() {
							this.updateCount(_.where(this.models, {checked: true}).length);
							this.$el.find('[name="events"]').html(templates['events'].render(this.summary, templates));
						}.bind(this));
						this.models.push(newModel);
						if(typeof this.options.defaultSort !== 'undefined'){
							this.models = _.sortBy(this.models, function(obj) { return obj.attributes[this.options.defaultSort]; }.bind(this)).reverse();
						}
						Berries.modal.trigger('saved');
						this.draw();
						this.updateCount(this.summary.checked_count);
						
						if(typeof this.options.add == 'function') {
							this.options.add(newModel);
						}
					}
				}, this)
			}
		}.bind(this));


		this.draw();
	}
	this.validate = function(item){
		var status = false;
		var tempForm = this.$el.find('.hiddenForm').berry({fields: options.schema,attributes:item});
		if(tempForm.validate()){
			status = tempForm.toJSON();
		}else{
			this.errors = tempForm.errors;
			console.log('Model not valid');
		}
		tempForm.destroy();
		return status
	}


	this.add = function(item){
		var newModel = new tableModel(this, item).on('check', function(){
			this.owner.updateCount(_.where(this.owner.models, {checked: true}).length);
			this.owner.$el.find('[name="events"]').html(templates['events'].render(this.owner.summary, templates));
		});
		var tempForm = this.$el.find('.hiddenForm').berry({fields: options.schema,model:newModel});
		if(tempForm.validate()) {
			this.models.push(newModel);
			this.draw();
			this.updateCount(this.summary.checked_count);

			if(typeof this.options.add == 'function'){
				this.options.add(newModel);
			}
		}else{
			console.log('Model not valid');
		}
		tempForm.destroy();
		return newModel;
	}
	this.search = function(options) {
		var ordered = _.sortBy(this.models, function(obj) { return obj.attributes[options.sort]; });
		if(!options.reverse){
			ordered = ordered.reverse();
		}
		filterMap = this.filterMap;
		ordered = _.filter(ordered, function(anyModel) {

			var keep = $.isEmptyObject(options.search);
			for(var filter in options.search) {
					var temp;
					if(_.where(options.filterFields, {id:filter})[0] && typeof _.where(options.filterFields, {id:filter})[0].options == 'undefined') {
						temp = ($.score((anyModel.attributes[this.filterMap[filter]]+'').replace(/\s+/g, " ").toLowerCase(), (options.search[filter]+'').toLowerCase() ) > 0.40);
					}else{
						temp = (anyModel.attributes[this.filterMap[filter]]+'' == options.search[filter]+'')
					}
					keep = temp;
					if(!keep){break;}
			}
			
			return keep;
		})
		this.lastGrabbed = ordered.length;
		this.filtered = ordered;
	}

	this.find = function(search) {
		var keys = _.keys(search)
		return _.filter(this.models, function(anyModel) {
			return _.isEqual(search, _.pick(anyModel.attributes, keys));
		})
	}

	this.searchAll = function(search) {
		//reset sorts and filters
		options.sort = null;
		this.$el.find('[data-sort]').removeClass('text-primary');
		this.$el.find('[data-sort]').find('i').attr('class', 'fa fa-sort text-muted');
		if(this.filter){
			silentPopulate.call(this.filter, this.defaults)
		}

		search = search.toLowerCase()
		//score each model searching each field and finding a total 
		_.map(this.models, function(model){
			model.score = 0;
			for(var filter in options.filterFields) {
				model.score += $.score((model.display[options.filterFields[filter].search]+'').replace(/\s+/g, " ").toLowerCase(), search);
			}
		})

		//sort by score (highet first) and remove models with no score
		this.filtered = _.filter(_.sortBy(this.models, 'score'), function(model) {
				return (model.score > 0);
		}).reverse();

		this.lastGrabbed = this.filtered.length;
	}

	this.fixStyle = function(){
		if(this.options.autoSize){
			try{
				this.$el.find('.table-container > div').css('width', 'auto') 
				this.$el.find('.table-container > div').css('minWidth', 'auto') 
				this.$el.find('.table-container > div').css('height', $(window).height() - $('.table-container > div').offset().top - (88+ this.options.autoSize) +'px');
				_.each(	this.$el.find('.list-group tr:first td'), function(item, index){
					this.$el.find('.table-container > table tr th:visible')[index].style.width = item.offsetWidth+'px';
					this.$el.find('.table-container > table tr th:visible')[index].style.minWidth = item.offsetWidth+'px';

				}.bind(this))

				this.$el.find('.table-container > div').css('width', this.$el.find('.table-container > div table')[0].offsetWidth + 'px') 
				this.$el.find('.table-container > div').css('minWidth', this.$el.find('.table-container > div table')[0].offsetWidth + 'px') 
			}catch(e){}
		}
	}

	this.grab = function(options) {
		return this.filtered.slice((options.count * (options.page-1) ), (options.count * (options.page-1) ) + options.count)
	};

	this.editCommon = function (){
		if(typeof this.options.multiEdit == 'undefined' || this.options.multiEdit.length == 0){return;}
		var selectedModels = _.where(this.models, {checked: true});
		if(selectedModels.length == 0){ return; }
		//get the attributes from each model
		var temp = _.map(selectedModels,function(item){return item.attributes;})//_.pick(item.attributes;})
		//get the fields that are common between them
		var common_fields = _.filter(this.options.multiEdit, function(item){return _.unique(_.pluck(temp, item)).length == 1});
		//get the schema fields matching from above
		if(common_fields.length == 0) {
					$(templates['modal'].render({title: "Common Field Editor ",footer:'<div class="btn btn-danger" data-dismiss="modal">Done</div>', body:'<div class="alert alert-warning">No eligible fields have been found for editing.</div>'})).modal();
		} else {
			var newSchema = _.filter(this.options.schema, function(item){return common_fields.indexOf(item.name) >= 0})

			$().berry({legend:'('+selectedModels.length+') Common Field Editor', fields:newSchema, attributes: $.extend(true,{},_.pick(selectedModels[0].attributes, common_fields))}).on('save', function(){
				var newValues = this.toJSON();
				_.map(selectedModels,function(model){
					model.set($.extend(true,{}, model.attributes, newValues));
				})

				this.trigger('close');
			}).on('close', function(){
				this.draw();
				if(typeof this.options.editComplete === 'function'){
					this.options.editComplete(_.where(this.models, {checked: true}), this);
				}
			}, this )
		}
	}
	this.destroy = function(){
		this.$el.find('.list-group').empty();
		this.$el.off();
		this.$el.empty();
	}

		this.state = {
		get:function(){
			var temp = {count:this.options.count,page:this.options.page};
			if(this.$el.find('[name="search"]').length && this.$el.find('[name="search"]').val().length){
				temp.search = this.$el.find('[name="search"]').val();
			}else{
				temp.sort = options.sort;
				temp.reverse = options.reverse;
				if(typeof this.filter !== 'undefined'){
					temp.filters = {};
					_.each(this.options.filterFields, function(item){
						temp.filters[item.search] = this[item.id]
					}.bind(this.filter.toJSON()))
				}
			}
			temp.columns = _.map(_.pluck(_.filter(this.summary.items, function(item){return item.isEnabled}),'id'),function(id){
				return _.findWhere(this.options.filterFields, {id:id}).search;
			}.bind(this))
			return temp;
		}.bind(this),
		set: function(settings) {

			if(typeof settings.columns !== 'undefined' && settings.columns.length) {
				this.summary.items = _.map(this.summary.items, function(item) {
					item.isEnabled = _.contains(settings.columns, this.filterMap[item.cname])
					return item;
				})
				this.$el.find('.columnEnables [type="checkbox"]').each(function(e) {
					this.checked = false
				})
				if(options.columns) {
					_.each(settings.columns, function(item){
						var temp = this.$el.find('.columnEnables [data-field="'+_.findWhere(this.options.filterFields, {search: item}).id+'"] [type="checkbox"]');
						if(temp.length)temp[0].checked = true;
					}.bind(this))
				}
			}
			if(typeof settings.filters !== 'undefined') {
				this.filterValues = {};
				_.each(settings.filters, function(item, index) {
					this.filterValues[_.findWhere(this.options.filterFields, {search: index}).id] = item
				}.bind(this))
			}

			if(typeof settings.sort !== 'undefined') {
					processSort.call(this,settings.sort || options.sort, settings.reverse);
			}
			
			if(typeof this.filter !== 'undefined') {
				// this.filter.populate(this.filterValues);
				silentPopulate.call(this.filter, this.filterValues)
			}
			if(typeof settings.search !== 'undefined' && settings.search !== '') {
				this.$el.find('[name="search"]').val(settings.search)
			}

			this.options.page = settings.page || this.options.page;
			this.options.count = settings.count || this.options.count;
			this.draw();
		}.bind(this)
	}
	this.models = [];
	this.options = options;
	this.filterMap = {}
	_.map(options.filterFields, function(item){
			this.filterMap[item.id] = item.search ;
	}.bind(this));
	
	var fields = {
		Title: {},
		Feed: {type: 'select', label_key: 'title', value_key: '_id', required: true, default: {title: 'Current Collection', _id: 'collection'}},
	}
	$(options.container).html(render.call(this));
	onload.call(this, $(options.container));
	this.getCSV = function(title){
		var lookup = this.filterMap
		csvify(
			_.map(this.filtered, function(item){return item.attributes}),
			_.map(_.filter(this.summary.items, function(item){return item.isEnabled}) ,function(item){
				return {label:item.label,name:lookup[item.cname]} 
			}),
			title || this.options.title 
		)
	}

	this.$el.find('[name="search"]').focus();

	this.$el.find('.table-container > div').css('overflow', 'auto');
	$(window).on('resize orientationChange', this.fixStyle.bind(this));
	if(loaded){
		this.state.set(loaded);
	}
}
(function($) {
  $.score = function(base, abbr, offset) {
    
    offset = offset || 0; // TODO: I think this is unused... remove
    
    if(abbr.length === 0) return 0.9;
    if(abbr.length > base.length) return 0.0;
    
    for (var i = abbr.length; i > 0; i--) {
      var sub_abbr = abbr.substring(0,i);
      var index = base.indexOf(sub_abbr);
      
      if(index < 0) continue;
      if(index + abbr.length > base.length + offset) continue;
      
      var next_string = base.substring(index+sub_abbr.length);
      var next_abbr = null;
      
      if(i >= abbr.length) {
        next_abbr = '';
      } else {
        next_abbr = abbr.substring(i);
      }
      // Changed to fit new (jQuery) format (JSK)
      var remaining_score   = $.score(next_string, next_abbr,offset+index);
      
      if (remaining_score > 0) {
        var score = base.length-next_string.length;
        
        if(index !== 0) {     
          var c = base.charCodeAt(index-1);
          if(c==32 || c == 9) {
            for(var j=(index-2); j >= 0; j--) {
              c = base.charCodeAt(j);
              score -= ((c == 32 || c == 9) ? 1 : 0.15);
            }
          } else {
            score -= index;
          }
        }
        
        score += remaining_score * next_string.length;
        score /= base.length;
        return score;
      }
    }
    return 0.0;
  };
})(jQuery);


csvify = function(data, columns, title){

  var csv = '"'+_.pluck(columns,'label').join('","')+'"\n';
  this.labels = _.pluck(columns,'name')
	var empty = _.object(this.labels, _.map(this.labels, function() { return '';}))
  csv += _.map(data,function(d){
      return JSON.stringify(_.values(_.extend(empty,_.pick(d,this.labels))))
  },this)
  .join('\n') 
  .replace(/(^\[)|(\]$)/mg, '')
  .split('\"').join("")

  var link = document.createElement("a");
  link.setAttribute("href", 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  link.setAttribute("download", (title||"berryTable")+".csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link); 
}


function CSVToArray( strData, strDelimiter ){
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
        );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if ( strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter ){
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );
        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
                new RegExp( "\"\"", "g" ),
                "\""
                );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];

        }


        // Now that we have our value string, let's add
        // it to the data array.

        // if(arrData.length >1){
        //  var temp = {};
        //  temp[arrData[0][arrData[ arrData.length - 1 ].length]] = strMatchedValue;
    //        arrData[ arrData.length - 1 ].push( temp );
    //        strMatchedValue = temp;

    //      }
        arrData[ arrData.length - 1 ].push( strMatchedValue );

    }

    // Return the parsed data.
    return( arrData );
}
function tableModel (owner, initial) {
	this.owner = owner;
	this.id = Berry.getUID();
	this.attributes = {};
	this.display = {};
	this.attribute_history = [];
	this.schema = owner.options.schema;
	var processAtts = function() {
		_.each(this.schema, function(item){
			if(typeof item.options !== 'undefined'){
				var option;
				if(typeof item.value_key !== 'undefined'){
					var search = {};
					search[item.value_key] = this.attributes[item.name];
					option = _.findWhere(item.options, search);
          if($.isNumeric(this.attributes[item.name])){
            search[item.value_key] = parseInt(this.attributes[item.name]);
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, search);
            }
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, search);
            }
          }
				}else{
					option =  _.findWhere(item.options, {value:this.attributes[item.name]});
					if(typeof option === 'undefined'){
						option = _.findWhere(item.options, {id:this.attributes[item.name]});
					}
          if($.isNumeric(this.attributes[item.name])){
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, {value:parseInt(this.attributes[item.name], 10)});
            }
            if(typeof option === 'undefined'){
              option = _.findWhere(item.options, {id:parseInt(this.attributes[item.name], 10)});
            }
          }
				}
				if(typeof option === 'object') {
					this.display[item.name] = option[item.label_key] || option.label || option.name;
				}else{
					this.display[item.name] = this.attributes[item.name];
				}
			}else{
				this.display[item.name] = this.attributes[item.name];
			}
		}.bind(this))
	}
	this.set = function(newAtts){
		this.attribute_history.push($.extend(true, {}, this.attributes));
		this.attributes = newAtts;
		processAtts.call(this);
	}
	this.pat =function(){
		processAtts.call(this);
	}
	this.checked = false;
	this.toggle = function(statem) {
		if(typeof state === 'bool') {
			this.checked = state;
		}else{
			this.checked = !this.checked;
		}
		this.trigger('check');
	}
	$.extend(true, this.attributes, initial);
	processAtts.call(this);
	this.toJSON = function() {return this.attributes}
	this.undo = function() {
		if(this.attribute_history.length){
			this.attributes = this.attribute_history.pop();
			processAtts.call(this);
			this.owner.draw();
		}
	}
	this.delete = function(){
		this.owner.models.splice(_.indexOf(_.pluck(this.owner.models, 'id'), this.id),1);
	}
	
	this.events = {initialize: []};
	this.addSub = Berry.prototype.addSub;
	this.on = Berry.prototype.on;
	this.off = Berry.prototype.off;
	this.trigger = Berry.prototype.trigger;

};
function viewitem(options){
	this.update = function() {
		if(typeof this.berry !== 'undefined'){this.berry.destroy();}

		this.$el.find('[data-event]').off();
		this.$el.off();
		if(typeof this.model.owner.options.preDraw !== 'undefined'){
			this.model.owner.options.preDraw(this.model);
		}
		this.$el.replaceWith(this.setElement(options.view.render(this.model , templates)).$el);

		if(this.$el.find('[data-popins]').length > 0){
			this.berry = this.$el.berry({ popins: {container: '#first', viewport:{ selector: 'body', padding: 20 }}, renderer: 'popins', model: this.model});
		}

		if(typeof this.model.owner.options.click == 'function'){
			this.$el.on('click',function(e){
				if(typeof e.target.dataset.event ==  'undefined'){
					this.model.owner.options.click(this.model, this);
				}
			}.bind(this))
		}

		this.$el.find('[data-event].custom-event').on('click', $.proxy(function(e){
			e.stopPropagation();
			$(e.target).closest('.dropdown-menu').toggle()
			var event = _.findWhere(this.model.owner.options.events, {name:e.target.dataset.event})
			if(typeof event !== 'undefined' && typeof event.callback == 'function'){
				event.callback(this.model);
			}
		},this));


		this.$el.find(".btn-group > .dropdown-toggle").on('click',function(e) {
		    e.stopPropagation();
		    $(this).next('.dropdown-menu').toggle();
		})

		this.$el.find('[data-event="edit"]').on('click', $.proxy(function(e){
			e.stopPropagation();
			$(e.target).closest('.dropdown-menu').toggle()
			this.edit();
		},this));

		this.edit = function(){
			$().berry($.extend(true,{},{name:'modal', legend: '<i class="fa fa-pencil-square-o"></i> Edit', model: this.model}, this.model.owner.options.berry || {} ) ).on('saved', function() {
				if(typeof this.model.owner.options.edit == 'function') {
					this.model.owner.options.edit(this.model);
				}
				this.update();
			}, this)
		}

		this.$el.find('[data-event="mark"]').on('click', $.proxy(function(e){
			e.stopPropagation();
			this.model.toggle(e.currentTarget.checked);
		},this));

		this.$el.find("[data-moment]").each(function(item){
			$(this).html(moment.utc($(this).data('moment')).format($(this).data('format')) );
		});
		this.$el.find(".sparkline").each(function(){
			$(this).peity($(this).data('type'), {radius: $(this).data('radius')});
		});
	}

	this.setElement = function(html){
		this.$el = $(html);
		return this;
	}

	this.model = options.model;
	this.model.on('check', this.update.bind(this))

	this.$el  = $('<tr>');
	if(options.container){
		options.container.append(this.$el);
	}
	this.model.on('change', this.update, this);
	this.model.on('destroy', $.proxy(function(){
		this.$el.fadeOut('fast', $.proxy(function() {
			this.remove();
		}, this));
	}, this) );
	this.update();
}

if (!!!templates) var templates = {};
templates["events"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);t.b("	<span class=\"hidden-xs\">");t.b("\n" + i);if(t.s(t.d("options.hasDelete",c,p,1),c,p,0,55,245,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<a href=\"javascript:void(0);\" data-event=\"delete_all\" class=\"btn btn-danger ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};t.b("\" style=\"margin-right:15px\"><i class=\"fa fa-times\"></i> Delete</a>");t.b("\n" + i);});c.pop();}t.b("	<div class=\"btn-group\"role=\"group\" aria-label=\"...\">");t.b("\n");t.b("\n" + i);t.b("	    ");if(t.s(t.d("options.hasEdit",c,p,1),c,p,0,348,607,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<a href=\"javascript:void(0);\" data-event=\"edit_all\" class=\"btn btn-primary ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,499,507,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-pencil\"></i> Edit</a>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.events",c,p,1),c,p,0,653,942,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	    	");if(!t.s(t.f("global",c,p,1),c,p,1,0,0,"")){t.b("<a href=\"javascript:void(0);\" data-event=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" class=\"custom-event-all btn btn-default ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,839,847,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\">");t.b(t.t(t.f("label",c,p,0)));t.b("</a>");};t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	</span>");t.b("\n" + i);t.b("	<div class=\"btn-group visible-xs\">");t.b("\n" + i);t.b("		<button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("			<i class=\"fa fa-cogs\"></i> <span class=\"caret\"></span>");t.b("\n" + i);t.b("		</button>");t.b("\n" + i);t.b("		<ul class=\"dropdown-menu\">");t.b("\n" + i);t.b("				");if(t.s(t.d("options.hasEdit",c,p,1),c,p,0,1270,1525,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li  class=\" ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,1359,1367,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\"><a href=\"javascript:void(0);\" data-event=\"edit_all\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-pencil\"></i> Edit</a></li> ");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.events",c,p,1),c,p,0,1570,1858,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("					");if(!t.s(t.f("global",c,p,1),c,p,1,0,0,"")){t.b("<li class=\"");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};if(!t.s(t.f("multiEdit",c,p,1),c,p,1,0,0,"")){if(t.s(t.f("multi_checked",c,p,1),c,p,0,1674,1682,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("disabled");});c.pop();}};t.b("\"><a href=\"javascript:void(0);\" data-event=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" class=\"custom-event-all\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\">");t.b(t.t(t.f("label",c,p,0)));t.b("</a></li>");};t.b("\n" + i);});c.pop();}if(t.s(t.d("options.hasDelete",c,p,1),c,p,0,1904,2144,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("					<li role=\"separator\" class=\"divider\"></li>");t.b("\n" + i);t.b("					<li class=\" ");if(!t.s(t.f("checked_count",c,p,1),c,p,1,0,0,"")){t.b("disabled");};t.b("\"><a href=\"javascript:void(0);\" data-event=\"delete_all\" style=\"margin-right:15px\"><i class=\"fa fa-times\"></i> Delete</a></li>");t.b("\n" + i);});c.pop();}t.b("		</ul>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	");if(t.s(t.f("checked_count",c,p,1),c,p,0,2202,2315,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<h5 class=\"range badge alert-info checked_count\" style=\"margin:7px 15px;\">");t.b(t.v(t.f("checked_count",c,p,0)));t.b(" item(s) selected</h5>");});c.pop();}t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["mobile_head"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div style=\"clear:both;\">");t.b("\n");t.b("\n" + i);if(t.s(t.d("options.sort",c,p,1),c,p,0,46,1261,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("\n" + i);t.b("  <div class=\"row\" style=\"margin-bottom:10px\">");t.b("\n");t.b("\n" + i);t.b("    <div class=\"col-xs-6\">");t.b("\n" + i);if(t.s(t.d("options.filter",c,p,1),c,p,0,146,494,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("\n" + i);t.b("      <div name=\"reset-search\" style=\"position:relative\" class=\"btn btn-default\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Clear Filters\">");t.b("\n" + i);t.b("        <i class=\"fa fa-filter\"></i>");t.b("\n" + i);t.b("        <i class=\"fa fa-times text-danger\" style=\"position: absolute;right: 5px;\"></i>");t.b("\n" + i);t.b("      </div>    ");t.b("\n");t.b("\n" + i);t.b("    <div class=\"btn btn-info filterForm\">Filter</div>");t.b("\n" + i);});c.pop();}t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"col-xs-6\">");t.b("\n" + i);t.b("    		");if(t.s(t.d("options.search",c,p,1),c,p,0,577,661,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<input type=\"text\" name=\"search\" class=\"form-control\" style=\"\" placeholder=\"Search\">");});c.pop();}t.b("\n" + i);t.b("        </div>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("    <div class=\"input-group\">");t.b("\n" + i);t.b("      <span class=\"\" style=\"display: table-cell;width: 1%;white-space: nowrap;vertical-align: middle;padding-right:5px\">");t.b("\n" + i);t.b("        <button class=\"btn btn-default reverse\" type=\"button\" tabindex=\"-1\"><i class=\"fa fa-sort text-muted\"></i></button>");t.b("\n" + i);t.b("      </span>");t.b("\n" + i);t.b("        <select class=\"form-control sortBy\">");t.b("\n" + i);t.b("          <option value=true>None</option>");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,1103,1220,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,1128,1197,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("              <option value=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\">");t.b(t.v(t.f("label",c,p,0)));t.b("</option>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("        <select>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["mobile_row"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr><td colspan=\"100%\" class=\"filterable\">		");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,70,497,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<div data-event=\"mark\" style=\"text-align:left;padding:0;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;\">");t.b("\n" + i);t.b("	<span class=\"text-muted fa ");t.b(t.v(t.f("start",c,p,0)));t.b("#checked");t.b(t.v(t.f("end",c,p,0)));t.b("fa-check-square-o");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b(" ");t.b(t.v(t.f("start",c,p,0)));t.b("^checked");t.b(t.v(t.f("end",c,p,0)));t.b("fa-square-o");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b("\" style=\"margin:6px; cursor:pointer;font-size:24px\"></span>");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);});c.pop();}t.b(" <div>");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,540,740,"{{ }}")){t.rs(c,p,function(c,p,t){t.b(" 	");if(t.s(t.f("visible",c,p,1),c,p,0,555,725,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("isEnabled",c,p,1),c,p,0,569,711,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"row\" style=\"min-width:85px\"><span class=\"col-sm-3\"><b>");t.b(t.v(t.f("label",c,p,0)));t.b("</b></span><span class=\"col-sm-9 col-xs-12\">");t.b(t.t(t.f("name",c,p,0)));t.b("</span></div>");});c.pop();}});c.pop();}t.b("\n" + i);});c.pop();}t.b(" 	</div>");t.b("\n" + i);t.b("</td></tr>");return t.fl(); },partials: {}, subs: {  }});
templates["mobile_table"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"well\" style=\"background:#fff\">");t.b("\n" + i);t.b("	<div style=\"height:40px;\">");t.b("\n" + i);t.b("    <div name=\"events\" class=\" pull-left\" style=\"margin-bottom:10px;width:62%\" ></div>");t.b("\n");t.b("\n" + i);t.b("		<input type=\"file\" class=\"csvFileInput\" accept=\".csv\" style=\"display:none\">");t.b("\n");t.b("\n" + i);t.b("		<div class=\"hiddenForm\" style=\"display:none\"></div>");t.b("\n" + i);t.b("		<div class=\"btn-group pull-right\" style=\"margin-bottom:10px\" role=\"group\" aria-label=\"...\">");t.b("\n" + i);if(t.s(t.f("showAdd",c,p,1),c,p,0,401,502,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div data-event=\"add\" class=\"btn btn-success\"><i class=\"fa fa-pencil-square-o\"></i> New</div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.d("options.events",c,p,1),c,p,0,539,691,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				");if(t.s(t.f("global",c,p,1),c,p,0,555,676,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"btn btn-default custom-event-collection\" data-event=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\">");t.b(t.t(t.f("label",c,p,0)));t.b("</div>");});c.pop();}t.b("\n" + i);});c.pop();}if(t.s(t.d("options.download",c,p,1),c,p,0,735,898,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-download\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Download\"><i class=\"fa fa-download\"></i></div>");t.b("\n" + i);});c.pop();}if(t.s(t.d("options.upload",c,p,1),c,p,0,942,1099,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-upload\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Upload\"><i class=\"fa fa-upload\"></i></div>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.columns",c,p,1),c,p,0,1144,1905,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn-group columnEnables\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Display Columns\">");t.b("\n" + i);t.b("			  <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">");t.b("\n" + i);t.b("			    <i class=\"fa fa-list\"></i>");t.b("\n" + i);t.b("			    <span class=\"caret\"></span>");t.b("\n" + i);t.b("			  </button>");t.b("\n" + i);t.b("			  <ul class=\"dropdown-menu pull-right\" style=\"padding-top:10px\" aria-labelledby=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,1624,1870,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,1643,1850,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			    <li><label data-field=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" style=\"width:100%;font-weight:normal\"><input type=\"checkbox\" ");if(t.s(t.f("isEnabled",c,p,1),c,p,0,1757,1774,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("checked=\"checked\"");});c.pop();}t.b(" style=\"margin: 5px 0 5px 15px;\"> ");t.b(t.v(t.f("label",c,p,0)));t.b("</label></li>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("			  </ul>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("		</div>");t.b("\n");t.b("\n");t.b("\n" + i);t.b("	</div>	");t.b("\n" + i);t.b(t.rp("<mobile_head0",c,p,"			"));t.b("\n");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,1992,2099,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("  <div style=\"padding: 16px 0 0 15px;\"><i data-event=\"select_all\" class=\"fa fa-2x fa-square-o\"></i></div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("	<div class=\"table-container\" style=\"width:100%;overflow:auto\">");t.b("\n");t.b("\n" + i);t.b("	<div style=\"min-height:100px\">");t.b("\n" + i);t.b("		<table class=\"table ");if(!t.s(t.d("options.noborder",c,p,1),c,p,1,0,0,"")){t.b("table-bordered");};t.b(" table-striped table-hover dataTable\" style=\"margin-bottom:0px\">");t.b("\n" + i);t.b("			<tbody class=\"list-group\">");t.b("\n" + i);t.b("				<tr><td>");t.b("\n" + i);t.b("					<div class=\"alert alert-info\" role=\"alert\">You have no items.</div>");t.b("\n" + i);t.b("				</td></tr>");t.b("\n" + i);t.b("			</tbody>");t.b("\n");t.b("\n" + i);t.b("		</table>");t.b("\n" + i);t.b("	</div>");t.b("\n");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden;margin-top:10px\"></div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<mobile_head0":{name:"mobile_head", partials: {}, subs: {  }}}, subs: {  }});
templates["table"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div class=\"well\" style=\"background:#fff\">");t.b("\n" + i);t.b("	<div style=\"height:40px\">");t.b("\n" + i);t.b("		<div name=\"events\" class=\" pull-left\" style=\"margin-bottom:10px;width:62%\" ></div>");t.b("\n");t.b("\n" + i);t.b("		<input type=\"file\" class=\"csvFileInput\" accept=\".csv\" style=\"display:none\">");t.b("\n");t.b("\n" + i);t.b("		<div class=\"hiddenForm\" style=\"display:none\"></div>");t.b("\n" + i);t.b("		<div class=\"btn-group pull-right\" style=\"margin-bottom:10px;margin-left:10px\" role=\"group\" aria-label=\"...\">");t.b("\n" + i);if(t.s(t.f("showAdd",c,p,1),c,p,0,415,516,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div data-event=\"add\" class=\"btn btn-success\"><i class=\"fa fa-pencil-square-o\"></i> New</div>");t.b("\n" + i);});c.pop();}if(t.s(t.d("options.events",c,p,1),c,p,0,553,716,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				");if(t.s(t.f("global",c,p,1),c,p,0,569,701,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<div class=\"btn btn-default custom-event-collection ");t.b(t.v(t.f("global",c,p,0)));t.b("\" data-event=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\">");t.b(t.t(t.f("label",c,p,0)));t.b("</div>");});c.pop();}t.b("\n" + i);});c.pop();}if(t.s(t.d("options.download",c,p,1),c,p,0,760,923,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-download\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Download\"><i class=\"fa fa-download\"></i></div>");t.b("\n" + i);});c.pop();}if(t.s(t.d("options.upload",c,p,1),c,p,0,967,1124,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn btn-default hidden-xs\" name=\"bt-upload\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Upload\"><i class=\"fa fa-upload\"></i></div>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.d("options.columns",c,p,1),c,p,0,1169,1930,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<div class=\"btn-group columnEnables\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Display Columns\">");t.b("\n" + i);t.b("			  <button class=\"btn btn-default dropdown-toggle\" type=\"button\" id=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">");t.b("\n" + i);t.b("			    <i class=\"fa fa-list\"></i>");t.b("\n" + i);t.b("			    <span class=\"caret\"></span>");t.b("\n" + i);t.b("			  </button>");t.b("\n" + i);t.b("			  <ul class=\"dropdown-menu pull-right\" style=\"padding-top:10px\" aria-labelledby=\"enables_");t.b(t.v(t.d("options.id",c,p,0)));t.b("\">");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,1649,1895,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,1668,1875,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			    <li><label data-field=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\" style=\"width:100%;font-weight:normal\"><input type=\"checkbox\" ");if(t.s(t.f("isEnabled",c,p,1),c,p,0,1782,1799,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("checked=\"checked\"");});c.pop();}t.b(" style=\"margin: 5px 0 5px 15px;\"> ");t.b(t.v(t.f("label",c,p,0)));t.b("</label></li>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("			  </ul>");t.b("\n" + i);t.b("			</div>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("		</div>");t.b("\n");t.b("\n" + i);t.b("		");if(t.s(t.d("options.search",c,p,1),c,p,0,1983,2113,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<input type=\"text\" name=\"search\" class=\"form-control pull-right\" style=\"max-width:300px; margin-bottom:10px\" placeholder=\"Search\">");});c.pop();}t.b("\n");t.b("\n" + i);t.b("	</div>	");t.b("\n");t.b("\n" + i);if(!t.s(t.d("options.autoSize",c,p,1),c,p,1,0,0,"")){t.b("	<div class=\"paginate-footer hidden-xs\" style=\"overflow:hidden;margin-top:10px;clear:both\"></div>");t.b("\n" + i);};t.b("\n" + i);t.b("	<div class=\"table-container\" style=\"width:100%;overflow:auto\">");t.b("\n" + i);if(t.s(t.d("options.autoSize",c,p,1),c,p,0,2375,2542,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<table class=\"table ");if(!t.s(t.d("options.noborder",c,p,1),c,p,1,0,0,"")){t.b("table-bordered");};t.b("\" style=\"margin-bottom:0px\">");t.b("\n" + i);t.b("	<thead class=\"head\">");t.b("\n" + i);t.b(t.rp("<table_head0",c,p,"	"));t.b("	</thead>");t.b("\n" + i);t.b("	</table>");t.b("\n" + i);});c.pop();}t.b("\n");t.b("\n" + i);t.b("	<div style=\"min-height:100px\">");t.b("\n" + i);t.b("		<table class=\"table ");if(!t.s(t.d("options.noborder",c,p,1),c,p,1,0,0,"")){t.b("table-bordered");};t.b(" table-striped table-hover dataTable\" style=\"margin-bottom:0px\">");t.b("\n" + i);if(!t.s(t.d("options.autoSize",c,p,1),c,p,1,0,0,"")){t.b("			<thead class=\"head\">");t.b("\n" + i);t.b(t.rp("<table_head1",c,p,"			"));t.b("			</thead>");t.b("\n" + i);};t.b("\n" + i);t.b("			<tbody class=\"list-group\">");t.b("\n" + i);t.b("				<tr><td>");t.b("\n" + i);t.b("					<div class=\"alert alert-info\" role=\"alert\">You have no items.</div>");t.b("\n" + i);t.b("				</td></tr>");t.b("\n" + i);t.b("			</tbody>");t.b("\n");t.b("\n" + i);t.b("		</table>");t.b("\n" + i);t.b("	</div>");t.b("\n");t.b("\n" + i);t.b("	</div>");t.b("\n" + i);t.b("	<div class=\"paginate-footer\" style=\"overflow:hidden;margin-top:10px\"></div>");t.b("\n" + i);t.b("</div>");return t.fl(); },partials: {"<table_head0":{name:"table_head", partials: {}, subs: {  }},"<table_head1":{name:"table_head", partials: {}, subs: {  }}}, subs: {  }});
templates["table_footer"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<div>");t.b("\n" + i);if(t.s(t.f("multiPage",c,p,1),c,p,0,21,930,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	<nav class=\"pull-right\" style=\"margin-left: 10px;\">");t.b("\n" + i);if(t.s(t.f("size",c,p,1),c,p,0,85,910,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<ul class=\"pagination\" style=\"margin:0\">");t.b("\n" + i);if(!t.s(t.f("isFirst",c,p,1),c,p,1,0,0,"")){t.b("			");if(!t.s(t.f("showFirst",c,p,1),c,p,1,0,0,"")){t.b("<li class=\"pagination-first\"><a data-page=\"1\" href=\"javascript:void(0);\" aria-label=\"First\"><span aria-hidden=\"true\">&laquo;</span></a></li>");};t.b("\n" + i);t.b("			<li><a data-page=\"dec\" href=\"javascript:void(0);\" aria-label=\"Previous\"><span aria-hidden=\"true\">&lsaquo;</span></a></li>");t.b("\n" + i);};if(t.s(t.f("pages",c,p,1),c,p,0,471,571,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("				<li class=\"");t.b(t.v(t.f("active",c,p,0)));t.b("\"><a data-page=\"");t.b(t.v(t.f("name",c,p,0)));t.b("\" href=\"javascript:void(0);\">");t.b(t.v(t.f("name",c,p,0)));t.b("</a></li>");t.b("\n" + i);});c.pop();}if(!t.s(t.f("isLast",c,p,1),c,p,1,0,0,"")){t.b("			<li><a data-page=\"inc\" href=\"javascript:void(0);\" aria-label=\"Next\"><span aria-hidden=\"true\">&rsaquo;</span></a></li>");t.b("\n" + i);t.b("			");if(!t.s(t.f("showLast",c,p,1),c,p,1,0,0,"")){t.b("<li class=\"pagination-last\"><a data-page=\"\" href=\"javascript:void(0);\" aria-label=\"Last\"><span aria-hidden=\"true\">&raquo;</span></a></li>");};t.b("\n" + i);};t.b("\n" + i);t.b("		</ul>");t.b("\n" + i);});c.pop();}t.b("	</nav>");t.b("\n");t.b("\n" + i);});c.pop();}t.b("	<h5 class=\"range badge ");if(!t.s(t.f("size",c,p,1),c,p,1,0,0,"")){t.b("alert-danger");};t.b(" pull-left\" style=\"margin-right:15px;\">");if(t.s(t.f("size",c,p,1),c,p,0,1048,1097,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("Showing ");t.b(t.v(t.f("first",c,p,0)));t.b(" to ");t.b(t.v(t.f("last",c,p,0)));t.b(" of ");t.b(t.v(t.f("size",c,p,0)));t.b(" results");});c.pop();}if(!t.s(t.f("size",c,p,1),c,p,1,0,0,"")){t.b("No matching results");};t.b("</h5>");t.b("\n" + i);if(t.s(t.d("entries.length",c,p,1),c,p,0,1170,1540,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("		<span class=\"pull-left\">");t.b("\n" + i);t.b("			<select class=\"form-control\" style=\"display:inline-block;width:auto;min-width:50px\" name=\"count\">");t.b("\n" + i);t.b("			<option value=\"10000\">All</option>");t.b("\n" + i);if(t.s(t.f("entries",c,p,1),c,p,0,1352,1450,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("			<option value=\"");t.b(t.v(t.f("value",c,p,0)));t.b("\" ");if(t.s(t.f("selected",c,p,1),c,p,0,1395,1414,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("selected=\"selected\"");});c.pop();}t.b(">");t.b(t.v(t.f("value",c,p,0)));t.b("</option>");t.b("\n" + i);});c.pop();}t.b("\n" + i);t.b("			</select>");t.b("\n" + i);t.b("			<span class=\"hidden-xs\">results per page</span>");t.b("\n" + i);t.b("		</span>");t.b("\n" + i);});c.pop();}t.b("</div>");return t.fl(); },partials: {}, subs: {  }});
templates["table_head"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr style=\"background:#fff;cursor:pointer\" class=\"noselect\">");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,88,223,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <th style=\"width: 60px;min-width:60px;padding: 0 0 0 20px;\"><i data-event=\"select_all\" class=\"fa fa-2x fa-square-o\"></i></th>");t.b("\n" + i);});c.pop();}t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,262,482,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,279,465,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <th data-sort=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\"><h6 style=\"margin: 2px;font-size:13px;white-space: nowrap\">");if(t.s(t.d("options.sort",c,p,1),c,p,0,386,424,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<i class=\"fa fa-sort text-muted\"></i> ");});c.pop();}t.b(t.v(t.f("label",c,p,0)));t.b("</h6></th>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("  </tr>");t.b("\n" + i);if(t.s(t.d("options.filter",c,p,1),c,p,0,522,1048,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("  <tr style=\"background:#fff;\" class=\"filter\">");t.b("\n" + i);t.b("    ");if(t.s(t.d("options.hasActions",c,p,1),c,p,0,597,876,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td>");t.b("\n" + i);t.b("    <div name=\"reset-search\" style=\"position:relative\" class=\"btn\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"Clear Filters\">");t.b("\n" + i);t.b("      <i class=\"fa fa-filter\"></i>");t.b("\n" + i);t.b("      <i class=\"fa fa-times text-danger\" style=\"position: absolute;right: 5px;\"></i>");t.b("\n" + i);t.b("    </div>");t.b("\n" + i);t.b("    </td>");});c.pop();}t.b("\n");t.b("\n" + i);if(t.s(t.f("items",c,p,1),c,p,0,915,1027,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("visible",c,p,1),c,p,0,932,1010,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("    <td data-inline=\"");t.b(t.v(t.f("cname",c,p,0)));t.b("\" style=\"min-width:85px\" id=\"");t.b(t.v(t.f("id",c,p,0)));t.b("\"></td>");t.b("\n" + i);});c.pop();}});c.pop();}t.b("  </tr>");t.b("\n" + i);});c.pop();}return t.fl(); },partials: {}, subs: {  }});
templates["table_row"] = new Hogan.Template({code: function (c,p,i) { var t=this;t.b(i=i||"");t.b("<tr class=\"filterable\">		");t.b("\n" + i);if(t.s(t.d("options.hasActions",c,p,1),c,p,0,50,1280,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("\n" + i);t.b("	<td data-event=\"mark\" style=\"width: 60px;min-width:60px;text-align:left;padding:0;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;\">");t.b("\n" + i);t.b("<!-- 		<div class=\"btn-group\">");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info go\">Actions</button>");t.b("\n" + i);t.b("		  <button type=\"button\" class=\"btn btn-xs btn-info dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">");t.b("\n" + i);t.b("		    <span class=\"caret\"></span>");t.b("\n" + i);t.b("		    <span class=\"sr-only\">Toggle Dropdown</span>");t.b("\n" + i);t.b("		  </button>");t.b("\n" + i);t.b("		  <ul class=\"dropdown-menu dropdown-menu-right\">");t.b("\n" + i);t.b("		    ");if(t.s(t.d("options.hasEdit",c,p,1),c,p,0,698,821,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li><a href=\"javascript:void(0);\" data-event=\"edit\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-pencil\"></i> Edit</a></li>");});c.pop();}t.b("\n" + i);t.b("		    ");if(t.s(t.d("options.hasDelete",c,p,1),c,p,0,870,996,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<li><a href=\"javascript:void(0);\" data-event=\"delete\" data-id=\"");t.b(t.v(t.f("start",c,p,0)));t.b("id");t.b(t.v(t.f("end",c,p,0)));t.b("\"><i class=\"fa fa-times\"></i> Delete</a></li>");});c.pop();}t.b("\n" + i);t.b("		  </ul>");t.b("\n" + i);t.b("		</div> -->");t.b("\n" + i);t.b("		<span class=\"text-muted fa ");t.b(t.v(t.f("start",c,p,0)));t.b("#checked");t.b(t.v(t.f("end",c,p,0)));t.b("fa-check-square-o");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b(" ");t.b(t.v(t.f("start",c,p,0)));t.b("^checked");t.b(t.v(t.f("end",c,p,0)));t.b("fa-square-o");t.b(t.v(t.f("start",c,p,0)));t.b("/checked");t.b(t.v(t.f("end",c,p,0)));t.b("\" style=\"margin:6px 0 6px 20px; cursor:pointer;font-size:24px\"></span>");t.b("\n" + i);t.b("   	</td>");t.b("\n");t.b("\n" + i);});c.pop();}if(t.s(t.f("items",c,p,1),c,p,0,1315,1413,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("	");if(t.s(t.f("visible",c,p,1),c,p,0,1329,1399,"{{ }}")){t.rs(c,p,function(c,p,t){if(t.s(t.f("isEnabled",c,p,1),c,p,0,1343,1385,"{{ }}")){t.rs(c,p,function(c,p,t){t.b("<td style=\"min-width:85px\">");t.b(t.t(t.f("name",c,p,0)));t.b("</td>");});c.pop();}});c.pop();}t.b("\n" + i);});c.pop();}t.b("</tr>");return t.fl(); },partials: {}, subs: {  }});
