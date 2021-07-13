
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
		"My Images":{legend: "My Images",label:false,name:"images" ,type: 'fieldset', array: true, fields: [
				// { name: 'image', type: 'image_picker', choices: '/images?group_id='+groupID, value_key: 'image_filename', label: 'Image'},
				// { name: 'image', label: 'Image', post: '<i class="fa fa-image"></i>'},
				{label: 'Image',type: 'smallcombo', options: '/api/groups/'+group_id+'/images',custom:{name:"addFile",display:'<div style="padding:10px;color:#084010;border-top:solid 1px #333">Upload New File <span class="pull-right"><i class="fa fa-upload"></i></span></div>',action:function(e){
					window.open("/admin/groups/"+group_id+"/images", "_blank");
				  }},
				  format:{title:'Image',label:"{{name}}",value:"{{id}}",display:'<div style="height:50px;padding-left:60px;position:relative" href="/image/{{id}}.{{ext}}" target="_blank"><div style="outline:dashed 1px #ccc;display:inline-block;text-align:center;width:50px;;height:50px;background-image: url(/image/{{id}}.{{ext}});background-size: contain;background-repeat: no-repeat;background-position: center;position:absolute;top:0px;left:5px"></div> {{name}} </div>'}
				},

				{ name: 'text', label: 'Alt Text', required: true},
				
				{ name: 'url', label: 'Link', placeholder: 'http://', validate:[{type:'valid_url'}], post: '<i class="fa fa-link"></i>' },
				{ name: 'window', label: 'New Window?', type: 'checkbox' ,show:[{type:"not_matches",name:'url',value:''}] },
				// { name: 'overlay', label: 'Overlay'}
			]}
		
		}
	return {
	  container:container,
		fields: fields,
		render: render,
		toJSON: toJSON,
		edit: defaultCobEditor.call(this, container),
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
