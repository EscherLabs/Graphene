// Cobler.types.email = function(container){
// 	function get() {
// 		item.widgetType = 'email';
// 		return item;
// 	}
// 	var item = {
// 		guid: generateUUID()}
// 	var fields = {
// 		Target: {}
// 	}
// 	return {
//     container:container,
// 		fields: fields,
// 		render: function() {
//       var temp = get();
//       return gform.renderString('<div style="border:solid red 1px;height:40px">{{target}}</div>',temp);
// 		},
// 		edit: berryFormEditor.call(this, container, 'tabs'),
// 		toJSON: get,
// 		get: get,
// 		set: function (newItem) {
// 			$.extend(item, newItem);
// 		},
// 		initialize: function(el){

//     },    
//     toHTML:function(){
//       return gform.renderString('\nA[Submitted] -->|Pathway| {{guid}}[{{target}}];\nclick {{guid}} callback',get());
//     }
// 	}
// }
Cobler.types.state = function(container){
	function get() {
		item.widgetType = 'state';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
    State: {},
    Action: {},
    Target: {}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      return gform.renderString('<div style="border:solid red 1px;height:40px"><div>{{target}}</div><div>{{approver}}</div></div>',temp);
		},
		edit: berryFormEditor.call(this, container, 'tabs'),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
    },
		initialize: function(el){

		},    
    toHTML:function(){
      return gform.renderString('\n{{state}}[{{state}}] -->{{#action}}|{{action}}|{{/action}} {{target}}[{{target}}{{^target}}End{{/target}}];',get());
    }
	}
}