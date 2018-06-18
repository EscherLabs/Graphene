Cobler.types.Links = function(container){
	function render() {
		var temp = get();
		temp.link_admin = group_admin;
		temp.group_id = group_id;
		console.log(temp);
		return templates['widgets_links_container'].render(temp, templates);
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
		show_all: false,
		guid: generateUUID(),
		no_minimize:true
	}
	var fields = {
		Title: {},
		// "Container?":{name:'container', type: 'checkbox'},
		"Show All":{name:'show_all', type: 'checkbox'}
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
			$(el).on('click','.favorites',function(e){
				e.preventDefault();
				_.findWhere(this.links,{id:parseInt(e.currentTarget.parentElement.dataset.guid)}).favorite = !_.findWhere(this.links,{id:parseInt(e.currentTarget.parentElement.dataset.guid)}).favorite
				Lockr.set('links',_.map(_.where(this.links,{favorite:true}),function(item){return _.pick(item, 'id', 'favorite')}))
				$(el).find('.link_collection').html(templates['widgets_links'].render($.extend({},this.get(),{links:this.links}), templates))

			}.bind(this))

			var url = '/api/user_links/'
			if(!this.get().show_all){
				url = url+group_id;
			}
			$.ajax({
			url: url,
			dataType : 'json',
				type: 'GET',
				success  : function(el,data){
					_.each(Lockr.get('links'),function(links){
						_.findWhere(data,{id:links.id}).favorite = links.favorite;
					})
					this.links = data
					$(el).find('.link_collection').html(templates['widgets_links'].render($.extend({},this.get(),{links:this.links}), templates))
				}.bind(this,el)
			})
		}
	}
}
