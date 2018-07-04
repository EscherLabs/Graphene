
Cobler.types.Image = function(container){
	function render() {
		// if(get().images.length >1){
		// 	return templates['widgets_slider'].render(get(), templates);
		// }else{
		var temp = get();
		temp.image_admin = group_admin;
		temp.group_id = group_id;		
		return templates['widgets_image_header'].render(temp, templates);
		// }
	}
	function get() {
		item.widgetType = 'Image';
		return item;
	}
	function toJSON() {
		return get();
	}
	function set(newItem) {
		$.extend(item, newItem);
	}
	var item = {
		images: [{image: '' , url:'', text: '', overlay: ''}],
		guid: generateUUID()
	}
	var fields = {
		// 'Start Collapsed':{name:'collapsed',type:'checkbox'},
		"Title":{label: 'Title'},
		// "Container":{name:'container',label: "Container?", type: 'checkbox'},
		"My Images":{label: false,fields:[			
			{type: 'fieldset',name:"images", label: false, multiple: {duplicate: true}, fields: [
				// { name: 'image', type: 'image_picker', choices: '/images?group_id='+groupID, value_key: 'image_filename', label: 'Image'},
				// { name: 'image', label: 'Image', post: '<i class="fa fa-image"></i>'},
				{label: 'Image',type: 'image_picker', choices: '/api/groups/'+group_id+'/images', reference: 'id', path:'/image/', value_key: 'id'},

				{ name: 'text', label: 'Alt Text', required: true},
				
				{ name: 'url', label: 'Link', placeholder: 'http://', validate:{'valid_url':true}, post: '<i class="fa fa-link"></i>' },
				{ name: 'window', label: 'New Window?', type: 'checkbox' ,show:{not_matches:{name:'url',value:''}}},
				// { name: 'overlay', label: 'Overlay'}
			]}
		]}
	}
	return {
	  container:container,
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: berryEditor.call(this, container),
		get: get,
		set: set,
		initialize: function(el){
			$(el).find('.slider').nivoSlider({effect: 'fade'});
				if(this.container.owner.options.disabled && this.get().enable_min){					
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
	  		  this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
		}
	}
}
