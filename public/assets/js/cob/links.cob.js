Cobler.types.Links = function(container){
	function render() {
		return templates['widgets_links_container'].render(get(), templates);
	}
	function get() {
		item.widgetType = 'Links';
		return item;
	}
	function set(newItem) {
		$.extend(item, newItem);
	}
	var item = {
		title: 'Links',
	}
	var fields = {
		Title: {},
		"Container?":{name:'container', type: 'checkbox'},
		"Limit to Group":{name:'group_limit', type: 'checkbox'},
	}
	return {
	  container:container,
		fields: fields,
		render: render,
		toJSON: get,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		initialize: function(el){
			var url = '/api/user_links/'
			if(this.get().group_limit){
				url = url+group_id;
			}
			$.ajax({
			url: url,
			dataType : 'json',
				type: 'GET',
				success  : function(el,data){
					$(el).find('.link_collection').html(templates['widgets_links'].render($.extend({},this.get(),{links:data}), templates))
				}.bind(this,el)
			})
		}
	}
}
