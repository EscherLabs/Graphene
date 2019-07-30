$('.navbar-header .nav a h4').html('Workflow Instance');
$('[href="/admin/workflowinstances"]').parent().addClass('active');

$.ajax({
	url: '/api/workflowinstances/'+resource_id,
	success: function(data) {
		$('.navbar-header .nav a h4').append(' - '+data.workflow.name+'');
		
		$.ajax({
			url: '/api/workflows/'+data.workflow_id+'/versions',
			success: function(data, versions) {
				versions.unshift({id:0,label:'Latest Published'})
				versions.unshift({id:-1,label:'Latest (Working or Published)'})

				$('#table').html(templates.workflow_instance.render(data));
					viewTemplate = Hogan.compile('<div class="list-group">{{#items}}<div class="list-group-item"><a target="_blank" href="/page/{{group.slug}}/{{slug}}">{{name}}</a></div>{{/items}}</div>');

					$('#find').on('click', function(){
						$.get('/api/workflowinstances/'+data.id+'/pages', function(data){
							if(data.length > 0){
								modal({title:'This Workflow Instance was found on the following pages', content:viewTemplate.render({items:data})});
							}else{
								modal({title: 'No pages Found', content:'This Workflow Instance is not currently placed on any pages.'});
							}
						})
					})			 
					$('body').on('click','#version', function(){
						
						// $.ajax({
						// 	url: '/api/workflows/'+data.workflow_id+'/versions',
						// 	success: function(versions) {
						// 		versions.unshift({id:0,label:'Latest Published'})
						// 		versions.unshift({id:-1,label:'Latest (working or Published)'})
								$().berry({name:'versionForm',attributes:data,legend:'Select Version',fields:[
										{label: 'Version', name:'workflow_version_id', required:true, options:versions,type:'select', value_key:'id',label_key:'label'},
								]}).on('save',function(){

									$.ajax({url: '/api/workflowinstances/'+data.id, type: 'PUT', data: Berries.versionForm.toJSON(),
									success:function(data) {
										window.location.reload(true);
									},
									error:function(e) {
										toastr.error(e.statusText, 'ERROR');
									}
								});
								},this)
						// 	}.bind(data)
						// })
					})			 
				$('#main .col-sm-9').berry({fields: [
					{label: 'Group', name:'group_id', required: true, type:'hidden'},
					{label: 'Version', name:'workflow_version_id', enabled: false,options:versions,type:'select', value_key:'id',label_key:'label',after:'<i class="fa fa-pencil" id="version"></i>'},
					{label: 'Name', name:'name', required: true},
					// {label: 'Workflow', name:'workflow_name', enabled: false,parseable:false,value:},
					{label: 'Slug', name:'slug', required: true},
					{label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
					{label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0 },
					{label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
					{label: 'Workflow', name:'workflow_id', required: true, type:'hidden'},
					{name: 'workflow', type:'hidden'},
					{name: 'id', type:'hidden'}
				],attributes:data, actions:false, name:'main'})

				// if(typeof data.workflow.code.forms !== 'undefined' && _.findWhere(data.workflow.code.forms,{name:"Options"}).content){
				// 	$('#optionstab').show();
				// 	var options = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.workflow.code.forms,{name:"Options"}).content)) 
				// 	$('#optionstab').toggle(!!options.fields.length);
				// 	options.attributes = data.options || {};
				// 	options.attributes.id = data.id;
				// 	options.name = 'options';
				// 	$('#options .col-sm-9').berry(options);
				// }
				// if(typeof data.workflow.code.forms !== 'undefined' && _.findWhere(data.workflow.code.forms,{name:"User Options"}).content){
				// 	var user_options_default = $.extend(true,{actions:false}, JSON.parse(_.findWhere(data.workflow.code.forms,{name:"User Options"}).content)) 
				// 	$('#useroptionstab').toggle(!!user_options_default.fields.length);
				// 	user_options_default.attributes = data.user_options_default || {};
				// 	user_options_default.attributes.id = data.id;
				// 	user_options_default.name = 'user_options_default';
				// 	$('#user_options_default .col-sm-9').berry(user_options_default);
				// }
				// if(typeof data.workflow.code.resources !== 'undefined' && data.workflow.code.resources[0].name !== '') {	
				// 	$('#resoucestab').show();
				// 	var attributes = _.map(data.workflow.code.resources,function(resource){
				// 		resource.endpoint = (_.find(this.resources,{name:resource.name}) ||{endpoint:'none'}).endpoint
				// 		return resource
				// 	}.bind({resources:data.resources}))
				// 	// var attributes = $.extend(true, [], data.resources,data.workflow.code.resources);
				var valueField = {columns:8,name:'value',label:'Value <span class="text-success pull-right">{{value}}</span>'}

				r_options = {data:{resources:_.map(data.workflow.code.resources,function(resource){
					resource.value = (_.find(data.configuration.resources,{name:resource.name})||{value:''}).value 
					return resource;
				})}, actions:[],fields:[
			
					{name:"resources",label:false,array:{min:data.workflow.code.resources.length,max:data.workflow.code.resources.length},type:"fieldset",fields:[
						{name:"name",label:false, columns:8,type:"output",format:{value:'<h4>{{value}} <span class="text-muted pull-right">({{parent.value.type}})</span></h4>'}},

						{columns:0,name:"type",label:false,edit:false},
						_.extend({show:[{type:"matches",name:"type",value:"string"}]},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"user"}]},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"group"}],type:"combo",options:'/api/groups',format:{label:"{{name}}",value:"{{id}}"}},valueField),
						_.extend({show:[{type:"matches",name:"type",value:"endpoint"}],type:"select",options:'/api/groups/'+data.group_id+'/endpoints',format:{label:"{{name}}",value:"{{id}}"}},valueField),
					]}
				]}
				resources = new gform(r_options,'#resources .col-sm-9');
					// $('#resources .col-sm-9').berry({name:'resources', actions:false,attributes: {},fields:[
					// 	{name:'container', label: false,  type: 'fieldset', fields:[

					// 		{"multiple": {"duplicate": false},label: '', name: 'resources', type: 'fieldset', fields:[
					// 			{label:false, name: 'name',columns:4, type:'raw', template:'<label class="control-label" style="float:right">{{value}}: </lable>'},
					// 			{name: 'endpoint',label:false,columns:8, type: 'select',default: {name:'None', value:'none'}, choices: '/api/groups/'+data.group_id+'/endpoints'},
					// 			{label:false, name: 'name',columns:0, type:'hidden'}
					// 		]}
					// 	]},
					// ]} ).on('change',function(item, b, c){
					// 	var item = Berries.resources.findByID(item.id)
					// 	var url = '';
					// 	url += (_.findWhere(Berry.collection.get('/api/groups/'+this.group_id+'/endpoints'),{id:parseInt(item.value)})||{config:{url:''} }).config.url;
					// 	url+=(_.findWhere(this.workflow.code.resources,{name:item.parent.children.name.instances[1].value})||{path:''}).path				
					// 	item.update({help:url, value:item.value}, true)
					// }.bind(data))
				// }
				$('#save').on('click',function(){
					var item = Berries.main.toJSON();
					// if(typeof Berries.options !== 'undefined') {
					// 	item.options = Berries.options.toJSON();
					// }			
					// if(typeof Berries.user_options_default !== 'undefined') {
					// 	item.user_options_default = Berries.user_options_default.toJSON();
					// }
					// if(typeof Berries.resources !== 'undefined') {
					// 	item.resources = Berries.resources.toJSON().resources;
					// }
					if(typeof resources !== 'undefined') {
						item.configuration = {resources:resources.toJSON().resources};
					}
					$.ajax({url: '/api/workflowinstances/'+item.id, type: 'PUT', data: item, success:function(){
							toastr.success('', 'Successfully updated Workflow Instance')
						}.bind(this),
						error:function(e) {
							toastr.error(e.statusText, 'ERROR');
						}
					});
				})
			}.bind(null,data)
		})
	}
	
});

$(document).keydown(function(e) {
  if ((e.which == '115' || e.which == '83' ) && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      $('#save').click()
  }
  return true;
});


/* =============================================================
 * bootstrap-combobox.js v1.1.8
 * =============================================================
 * Copyright 2012 Daniel Farrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */

(function( $ ) {

  "use strict";
 
  /* COMBOBOX PUBLIC CLASS DEFINITION
   * ================================ */
 
   var Combobox = function ( element, options ) {
     this.options = $.extend({}, $.fn.combobox.defaults, options);
     this.template = this.options.template || this.template
     this.$source = $(element);
     this.$container = this.setup();
     this.$element = this.$container.find('input[type=text]');
     this.$target = this.$container.find('input[type=hidden]');
     this.$button = this.$container.find('.dropdown-toggle');
     this.$menu = $(this.options.menu).appendTo('body');
     this.matcher = this.options.matcher || this.matcher;
     this.sorter = this.options.sorter || this.sorter;
     this.highlighter = this.options.highlighter || this.highlighter;
     this.shown = false;
     this.selected = false;
     this.renderLimit = this.options.renderLimit || -1;
     this.clearIfNoMatch = this.options.clearIfNoMatch;
     this.refresh();
     this.transferAttributes();
     this.listen();
   };
 
   Combobox.prototype = {
 
     constructor: Combobox
 
   , setup: function () {
       var combobox = $(this.template());
       this.$source.before(combobox);
       this.$source.hide();
       return combobox;
     }
 
   , disable: function() {
       this.$element.prop('disabled', true);
       this.$button.attr('disabled', true);
       this.disabled = true;
       this.$container.addClass('combobox-disabled');
     }
 
   , enable: function() {
       this.$element.prop('disabled', false);
       this.$button.attr('disabled', false);
       this.disabled = false;
       this.$container.removeClass('combobox-disabled');
     }
   , parse: function () {
       var that = this
         , map = {}
         , source = []
         , selected = false
         , selectedValue = '';
       this.$source.find('option').each(function() {
         var option = $(this);
         if (option.val() === '') {
           that.options.placeholder = option.text();
           return;
         }
         map[option.text()] = option.val();
         source.push(option.text());
         if (option.prop('selected')) {
           selected = option.text();
           selectedValue = option.val();
         }
       })
       this.map = map;
       if (selected) {
         this.$element.val(selected);
         this.$target.val(selectedValue);
         this.$container.addClass('combobox-selected');
         this.selected = true;
       }
       return source;
     }
 
   , transferAttributes: function() {
     this.options.placeholder = this.$source.attr('data-placeholder') || this.options.placeholder
     if(this.options.appendId !== undefined) {
       this.$element.attr('id', this.$source.attr('id') + this.options.appendId);
     }
     this.$element.attr('placeholder', this.options.placeholder)
     this.$target.prop('name', this.$source.prop('name'))
     this.$target.val(this.$source.val())
     this.$source.removeAttr('name')  // Remove from source otherwise form will pass parameter twice.
     this.$element.attr('required', this.$source.attr('required'))
     this.$element.attr('rel', this.$source.attr('rel'))
     this.$element.attr('title', this.$source.attr('title'))
     this.$element.attr('class', this.$source.attr('class'))
     this.$element.attr('tabindex', this.$source.attr('tabindex'))
     this.$source.removeAttr('tabindex')
     if (this.$source.attr('disabled')!==undefined)
       this.disable();
   }
 
   , select: function () {
       var val = this.$menu.find('.active').attr('data-value');
       this.$element.val(this.updater(val)).trigger('change');
       this.$target.val(this.map[val]).trigger('change');
       this.$source.val(this.map[val]).trigger('change');
       this.$container.addClass('combobox-selected');
       this.selected = true;
       return this.hide();
     }
 
   , updater: function (item) {
       return item;
     }
 
   , show: function () {
       var pos = $.extend({}, this.$element.position(), {
         height: this.$element[0].offsetHeight
       });
 
       this.$menu
         .insertAfter(this.$element)
         .css({
           top: pos.top + pos.height
         , left: pos.left
         })
         .show();
 
       $('.dropdown-menu').on('mousedown', $.proxy(this.scrollSafety, this));
 
       this.shown = true;
       return this;
     }
 
   , hide: function () {
       this.$menu.hide();
       $('.dropdown-menu').off('mousedown', $.proxy(this.scrollSafety, this));
       this.$element.on('blur', $.proxy(this.blur, this));
       this.shown = false;
       return this;
     }
 
   , lookup: function (event) {
       this.query = this.$element.val();
       return this.process(this.source);
     }
 
   , process: function (items) {
       var that = this;
 
       items = $.grep(items, function (item) {
         return that.matcher(item);
       })
 
       items = this.sorter(items);
 
       if (!items.length) {
         return this.shown ? this.hide() : this;
       }
 
       return this.render(items.slice(0, this.options.items)).show();
     }
 
   , template: function() {
       if (this.options.bsVersion == '2') {
         return '<div class="combobox-container"><input type="hidden" /> <div class="input-append"> <input type="text" autocomplete="off" /> <span class="add-on dropdown-toggle" data-dropdown="dropdown"> <span class="caret"/> <i class="icon-remove"/> </span> </div> </div>'
       } else {
         return '<div class="combobox-container"> <input type="hidden" /> <div class="input-group"> <input type="text" autocomplete="off" /> <span class="input-group-addon dropdown-toggle" data-dropdown="dropdown"> <span class="caret" /> <span class="fa fa-times" /> </span> </div> </div>'
       }
     }
 
   , matcher: function (item) {
       return ~item.toLowerCase().indexOf(this.query.toLowerCase());
     }
 
   , sorter: function (items) {
       var beginswith = []
         , caseSensitive = []
         , caseInsensitive = []
         , item;
 
       while (item = items.shift()) {
         if (!item.toLowerCase().indexOf(this.query.toLowerCase())) {beginswith.push(item);}
         else if (~item.indexOf(this.query)) {caseSensitive.push(item);}
         else {caseInsensitive.push(item);}
       }
 
       return beginswith.concat(caseSensitive, caseInsensitive);
     }
 
   , highlighter: function (item) {
       var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
       return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
         return '<strong>' + match + '</strong>';
       })
     }
 
   , render: function (items) {
       var that = this;
 
       items = $(items).map(function (i, item) {
         if(~that.renderLimit && i >= that.renderLimit)
           return;
         i = $(that.options.item).attr('data-value', item);
         i.find('a').html(that.highlighter(item));
         return i[0];
       })
 
       items.first().addClass('active');
       this.$menu.html(items);
       return this;
     }
 
   , next: function (event) {
       var active = this.$menu.find('.active').removeClass('active')
         , next = active.next();
 
       if (!next.length) {
         next = $(this.$menu.find('li')[0]);
       }
 
       next.addClass('active');
     }
 
   , prev: function (event) {
       var active = this.$menu.find('.active').removeClass('active')
         , prev = active.prev();
 
       if (!prev.length) {
         prev = this.$menu.find('li').last();
       }
 
       prev.addClass('active');
     }
 
   , toggle: function () {
     if (!this.disabled) {
       if (this.$container.hasClass('combobox-selected')) {
         this.clearTarget();
         this.triggerChange();
         this.clearElement();
       } else {
         if (this.shown) {
           this.hide();
         } else {
           this.clearElement();
           this.lookup();
         }
       }
     }
   }
 
   , scrollSafety: function(e) {
       if (e.target.tagName == 'UL') {
           this.$element.off('blur');
       }
   }
   , clearElement: function () {
     this.$element.val('').focus();
   }
 
   , clearTarget: function () {
     this.$source.val('');
     this.$target.val('');
     this.$container.removeClass('combobox-selected');
     this.selected = false;
   }
 
   , triggerChange: function () {
     this.$source.trigger('change');
   }
 
   , refresh: function () {
     this.source = this.parse();
     this.options.items = this.source.length;
   }
 
   , listen: function () {
       this.$element
         .on('focus',    $.proxy(this.focus, this))
         .on('blur',     $.proxy(this.blur, this))
         .on('keypress', $.proxy(this.keypress, this))
         .on('keyup',    $.proxy(this.keyup, this));
 
       if (this.eventSupported('keydown')) {
         this.$element.on('keydown', $.proxy(this.keydown, this));
       }
 
       this.$menu
         .on('click', $.proxy(this.click, this))
         .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
         .on('mouseleave', 'li', $.proxy(this.mouseleave, this));
 
       this.$button
         .on('click', $.proxy(this.toggle, this));
     }
 
   , eventSupported: function(eventName) {
       var isSupported = eventName in this.$element;
       if (!isSupported) {
         this.$element.setAttribute(eventName, 'return;');
         isSupported = typeof this.$element[eventName] === 'function';
       }
       return isSupported;
     }
 
   , move: function (e) {
       if (!this.shown) {return;}
 
       switch(e.keyCode) {
         case 9: // tab
         case 13: // enter
         case 27: // escape
           e.preventDefault();
           break;
 
         case 38: // up arrow
           e.preventDefault();
           this.prev();
           this.fixMenuScroll();
           break;
 
         case 40: // down arrow
           e.preventDefault();
           this.next();
           this.fixMenuScroll();
           break;
       }
 
       e.stopPropagation();
     }
 
   , fixMenuScroll: function(){
       var active = this.$menu.find('.active');
       if(active.length){
           var top = active.position().top;
           var bottom = top + active.height();
           var scrollTop = this.$menu.scrollTop();
           var menuHeight = this.$menu.height();
           if(bottom > menuHeight){
               this.$menu.scrollTop(scrollTop + bottom - menuHeight);
           } else if(top < 0){
               this.$menu.scrollTop(scrollTop + top);
           }
       }
   }
 
   , keydown: function (e) {
       this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40,38,9,13,27]);
       this.move(e);
     }
 
   , keypress: function (e) {
       if (this.suppressKeyPressRepeat) {return;}
       this.move(e);
     }
 
   , keyup: function (e) {
       switch(e.keyCode) {
         case 40: // down arrow
          if (!this.shown){
            this.toggle();
          }
          break;
         case 39: // right arrow
         case 38: // up arrow
         case 37: // left arrow
         case 36: // home
         case 35: // end
         case 16: // shift
         case 17: // ctrl
         case 18: // alt
           break;
 
         case 9: // tab
         case 13: // enter
           if (!this.shown) {return;}
           this.select();
           break;
 
         case 27: // escape
           if (!this.shown) {return;}
           this.hide();
           break;
 
         default:
           this.clearTarget();
           this.lookup();
       }
 
       e.stopPropagation();
       e.preventDefault();
   }
 
   , focus: function (e) {
       this.focused = true;
     }
 
   , blur: function (e) {
       var that = this;
       this.focused = false;
       var val = this.$element.val();
       if (!this.selected && val !== '' ) {
         if(that.clearIfNoMatch)
           this.$element.val('');
         this.$source.val('').trigger('change');
         this.$target.val('').trigger('change');
       }
       if (!this.mousedover && this.shown) {setTimeout(function () { that.hide(); }, 200);}
     }
 
   , click: function (e) {
       e.stopPropagation();
       e.preventDefault();
       this.select();
       this.$element.focus();
     }
 
   , mouseenter: function (e) {
       this.mousedover = true;
       this.$menu.find('.active').removeClass('active');
       $(e.currentTarget).addClass('active');
     }
 
   , mouseleave: function (e) {
       this.mousedover = false;
     }
   };
 
   /* COMBOBOX PLUGIN DEFINITION
    * =========================== */
   $.fn.combobox = function ( option ) {
     return this.each(function () {
       var $this = $(this)
         , data = $this.data('combobox')
         , options = typeof option == 'object' && option;
       if(!data) {$this.data('combobox', (data = new Combobox(this, options)));}
       if (typeof option == 'string') {data[option]();}
     });
   };
 
   $.fn.combobox.defaults = {
     bsVersion: '4'
   , menu: '<ul class="typeahead typeahead-long dropdown-menu"></ul>'
   , item: '<li><a href="#" class="dropdown-item"></a></li>'
   , clearIfNoMatch: true
   };
 
   $.fn.combobox.Constructor = Combobox;
 
 }( window.jQuery ));