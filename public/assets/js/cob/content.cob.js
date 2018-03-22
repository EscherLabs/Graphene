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
		"Container?":{name:'container', type: 'checkbox'},
		"Editor":{name:'editor', type:'radio',value:'contenteditable', options:[{'label':'WYSIWYG Editor',value:'contenteditable'},{'label':'HTML',value:'ace'}]},
		Text: {name:'text',type: 'ace', mode:'ace/mode/html', label: false,show:false},// show:{multiMatch:[{name:'editor',value:'raw'}]},parsable:'show'},
		// contenteditable: {name:'text', type: 'contenteditable', label: false},// show:{multiMatch:[{name:'editor',value:'html'}]},parsable:'show'},
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
			if(typeof this.get().editor !== 'undefined') {
				this.fields.Editor.show = false;
				this.fields.Text.show = true;
				this.fields.Text.type = this.get().editor;
			}
		}
	}
}



// Berry.btn.submit= {
// 		label: 'Submit',
// 		icon:'check',
// 		id: 'berry-submit',
// 		modifier: 'success pull-right',
// 		click: function() {
// 			if(this.options.autoDestroy) {
// 				this.on('saved', this.destroy);
// 			}
// 			this.trigger('save');
// 		}
// 	};
// Berry.btn.wait= {
// 		label: 'Submitting',
// 		icon:'spinner fa-spin',
// 		id: 'berry-wait',
// 		modifier: 'warning pull-right',
// 		click: function() {
// 		}
// 	};


