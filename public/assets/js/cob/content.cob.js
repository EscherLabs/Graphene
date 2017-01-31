Cobler.types.Content = function(container){
	function render() {
		return templates['widgets_content'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'Content';
		return item;
	}
	function set(newItem) {
		$.extend(item, newItem);
	}
	var item = {
		title: 'This is the title',
		text: 'Here is some text'
	}
	var fields = {
		Title: {},
		Text: {type: 'contenteditable', label: false}
	}
	return {
		fields: fields,
		render: render,
		toJSON: get,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
	}
}

Cobler.types.Image = function(container){
	function render() {
		return templates['widgets_image_header'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'Image';
		return item;
	}
	function toJSON(){
		return get();
	}
	function set(newItem) {
		$.extend(item, newItem);
	}
	var item = {
	}
	var fields = {
		Title: {},
		Container: {label: "Container?", type: 'checkbox'},
		Image: {type: 'image_picker', choices: '/images?group_id='+groupID, reference: 'image_filename', value_key: 'image_filename'},
		Text: {label: 'Alt Text', required: true}
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
	}
}


Cobler.types.Slider = function(container){
	function render() {
		return templates['widgets_slider'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'Slider';
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		$.extend(item, newItem);
	}
	var item = {
		images: [{image: '' , url:'', text: '', overlay: ''}]
	}
	var fields = {
		"My Images":{label: false,fields:[
			{type: 'fieldset',name:"images", label: false, multiple: {duplicate: true}, fields: [
				{ name: 'image', type: 'image_picker', choices: '/images?group_id='+groupID, value_key: 'image_filename', label: 'Image'},
				{ name: 'url', label: 'Link', placeholder: 'http://'},
				{ name: 'window', label: 'New Window?', type: 'checkbox'},
				{ name: 'text', label: 'Alt Text', required: true},
				{ name: 'overlay', label: 'Overlay'}
			]}
		]}
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		initialize: function(el){$(el).find('.slider').nivoSlider({effect: 'fade'});}
	}
}


Cobler.types.Html = function(container){
	function render() {
		var temp = get();//$.extend(true, {}, get());
		temp.html = temp.html.replace(/<\\\/script>/g, "</script>");
		if(item.container){
			return templates['widgets_html_container'].render(temp, templates);
		}else{
			return templates['widgets_html'].render(temp, templates);
		}
	}
	function get() {
		item.widgetType = 'Html';
		item.html = item.html.replace(/<\/script>/g, "<\\/script>");

		return item;
	}
	function toJSON(){
		return get();
	}
	function set(newItem) {
		$.extend(item, newItem);
		item.html =  item.html.replace(/<\\\/script>/g, "</script>");
	}
	var item = {
		html: ''
	}
	var fields = {
			Container: {label: "Container?", type: 'checkbox'},
			Title: {},
			HTML: {type: 'ace', label:false}
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		initialize: function(el){
				$(el).html($(el).html())
				$(el).find('[data-toggle="tooltip"]').tooltip();
	    	$(el).find('[data-toggle="popover"]').popover();
		}
	}
}

Cobler.types.RSS = function(container) {
	// var container = container;
	function render() {	
		var temp = get()
		if(typeof temp.loaded === 'undefined' && temp.count > 0 && temp.url){
				$.ajax({
				  url      : document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num='+temp.count+'&callback=?&q=' + encodeURIComponent(temp.url),
				  dataType : 'json',
				  success  : $.proxy(function (data) {
				  	var feed = data.responseData.feed
				    if (feed && feed.entries) {
				    	for(var i in feed.entries){
								feed.entries[i].contentSnippet = feed.entries[i].contentSnippet.replace(/&lt;/,"<").replace(/&gt;/,">").replace(/&amp;/,"&");
				    	}
				    	var temp = get();
				    	temp.loaded = feed;
				    	container.update(temp, this);
				    }
				  }, this)
				});
			}
		return templates['widgets_rss'].render(temp, templates);
	}
	function get() {
		item.widgetType = 'RSS';
		return item;
	}
	function toJSON(){
		var temp = get();
		delete temp.loaded;
		return temp;
	}
	function set(newItem) {
		item = newItem;
	}
	var item = {

	};
	var fields = {
		Title: {},
		Url: {value: 'http://www.binghamton.edu/photos/index.php/feed/'},
		Count: {value: 5, type: 'number'},
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set
	}
}

Cobler.types.Poll = function(container){
	function render() {
		return templates['widgets_poll'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'Poll';
		return item;
	}
	function toJSON(){
		var temp = get();
		delete temp.loaded;
		return temp;
	}
	function set(newItem) {
		this.changed = (typeof newItem.poll !== 'undefined' && item.poll !== newItem.poll);
		$.extend(item, newItem);
	}
	var item = {
	}
	var fields = {
		Title: {},
		Poll: {type: 'select', choices: '/polls?group_id='+groupID, label_key: 'poll_name'}
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		container: container,
		generateTable: function(data){
				var temp = {results:[], total: data.total};
				for(var i in data.results){
					temp.results.push({name:i, value: data.results[i], percent: ((data.results[i]/data.total)*100).toFixed(1) })
				}								
				this.$el.find('.poll_content').html(templates.poll_table.render(temp, templates));
			}, 
		initialize: function(el){
			if(!item.loaded || this.changed){
				$.ajax({
					url      : '/polllive/' + item.poll,
					dataType : 'json',
					success  : $.proxy(function (data) {
					this.data = data;
					this.container.update({loaded: {choices: JSON.parse(data.content), poll_name: data.poll_name, shuffle: data.shuffle} },this);
					this.container.deactivate()
					}, this)
				});
			}
			this.$el = $(el);		
			if(item.loaded){
				if(container.owner.options.disabled && this.data.results){
					this.generateTable(this.data);
				} else {
					var choices = _.pluck(JSON.parse(this.data.content), 'label');
					if(item.loaded.shuffle){
						choices = _.shuffle(choices);
					}
					this.berry = this.$el.find('.poll_content').berry({name: item.guid, actions:['save'], fields:[{label:false, name:'choice', type:'radio',choices: choices}]}).on('save',$.proxy(function(){
						$.ajax({
							url      : '/pollsubmit',
							dataType : 'json',
							data: {poll_id: item.poll, choice: this.berry.toJSON().choice},
							method: 'post',
							success  : $.proxy(function (data) {
								this.generateTable(data);
							}, this)
						});
					},this));
				}
			}
		}
	}
}

Berry.btn.submit= {
		label: 'Submit',
		icon:'check',
		id: 'berry-submit',
		modifier: 'success pull-right',
		click: function() {
			if(this.options.autoDestroy) {
				this.on('saved', this.destroy);
			}
			this.trigger('save');
		}
	};
Berry.btn.wait= {
		label: 'Submitting',
		icon:'spinner fa-spin',
		id: 'berry-wait',
		modifier: 'warning pull-right',
		click: function() {
		}
	};
Cobler.types.Form = function(container){
	function render() {
		if(item.container){
			return templates['widgets_form_container'].render(get(), templates);
		}else{
			return templates['widgets_form_container'].render(get(), templates);
		}
	}
	function get() {
		item.widgetType = 'Form';
		return item;
	}
	function toJSON(){
		var temp = get();
		delete temp.loaded;
		return temp;
	}
	function set(newItem) {
		this.changed = (typeof newItem.form !== 'undefined' && item.form !== newItem.form);

		$.extend(item, newItem);
	}
	var item = {
		title: 'This is the title',
		text: 'Here is some text'
	}
	var fields = {
		Title: {},
		Form: {type: 'select', choices: '/forms?group_id='+groupID, label_key: 'form_name'},
		Container: {label: "Container?", type: 'checkbox'}
	}
	return {
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,		
		container: container,
		initialize: function(el){
				if(!item.loaded || this.changed){
					$.ajax({
						url      : '/forms/' + item.form,
						dataType : 'json',
						success  : $.proxy(function (data) {
								this.container.update({loaded: {fields: JSON.parse(data.fields||"{}"),options: JSON.parse(data.options||"{}"), name: data.name} },this);
								this.container.deactivate()
						}, this)
					});
				}

				this.$el = $(el);		
				if(typeof item.loaded !== 'undefined' && (typeof item.loaded.fields !== 'undefined' || item.loaded.data_type == 'None' )) {

					this.berry = this.$el.find('.form_content').berry({name:item.form ,autoDestroy: false, inline: item.loaded.options.inline , action: '/formsubmit/'+item.form ,actions:['submit'], fields: item.loaded.fields});
					this.berry.on('saveing', function(){
						this.setActions(['wait']);
					});
					this.berry.on('saved', function(data){
						if(data.success){
							this.berry.destroy();
							this.$el.html('<div class="alert alert-success">Thank you for your submission. It has been successfully logged!</div>')
						}else{
							message({title:'Error', text: 'Form failed to submit', color: '#ff0000'});
							this.berry.setActions(['submit']);
						}
					}, this);
				}
		}
	}
}


Cobler.types.Links = function(container){
	function get() {
		item.widgetType = 'Links';
		return item;
	}
	var item = {}
	return {
		render: function() {
			//item.groups[0].links
			return templates['widgets_links'].render(get(), templates);
		},
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		}
	}
}

