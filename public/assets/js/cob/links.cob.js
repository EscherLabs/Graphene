Cobler.types.Links = function(container){
	function render() {
		var temp = get();
		temp.link_admin = group_admin;
		temp.group_id = group_id;
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
			this.state = Lockr.get('links') || {favorites:[],toggle:false};
			// if(this.state.toggle){
			// 	$(el).find('#available_links').click();
			// }
			$(el).on('click','#available_links',function(e){
				this.state.toggle  = !this.state.toggle;
				Lockr.set('links', this.state)
			}.bind(this))


			$(el).on('click','.favorites',function(e){
				e.preventDefault();
				_.findWhere(this.links,{id:parseInt(e.currentTarget.parentElement.dataset.guid)}).favorite = !_.findWhere(this.links,{id:parseInt(e.currentTarget.parentElement.dataset.guid)}).favorite
				this.state.favorites = _.map(_.where(this.links,{favorite:true}),function(item){return _.pick(item, 'id', 'favorite', 'link')});
				Lockr.set('links',this.state)
				$(el).find('.link_collection').html(templates['widgets_links'].render($.extend({},this.get(),{links:this.links,toggle:this.state.toggle}), templates))
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
					if(typeof this.state.favorites !== 'undefined'){
						_.each(this.state.favorites,function(links){
							var temp = _.findWhere(data,{id: links.id});
							if(typeof temp !== 'undefined') {
								temp.favorite = links.favorite;
							}else{
								temp = _.findWhere(data, {link: links.link});
								if(typeof temp !== 'undefined') {
									temp.favorite = links.favorite;
								}
							}
						})
					}
					this.links = data;
					$(el).find('.link_collection').html(templates['widgets_links'].render($.extend({},this.get(),{links:this.links,toggle:this.state.toggle}), templates))
				}.bind(this,el)
			})
		}
	}
}
