
Cobler.types.Image = function(container){
	function render() {
		// if(get().images.length >1){
		// 	return templates['widgets_slider'].render(get(), templates);
		// }else{
			return templates['widgets_image_header'].render(get(), templates);
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
		images: [{image: '' , url:'', text: '', overlay: ''}]
	}
	var fields = {
		"My Images":{label: false,fields:[
			{label: 'Title'},
			{name:'container',label: "Container?", type: 'checkbox'},
			{type: 'fieldset',name:"images", label: false, multiple: {duplicate: true}, fields: [
				// { name: 'image', type: 'image_picker', choices: '/images?group_id='+groupID, value_key: 'image_filename', label: 'Image'},
				{ name: 'image', label: 'Image', post: '<i class="fa fa-image"></i>'},
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
		initialize: function(el){$(el).find('.slider').nivoSlider({effect: 'fade'});}
	}
}
