
gform.stencils.ace = `
<div class="row clearfix form-group" name="{{name}}">
	{{>_label}}
	{{#label}}
	{{#inline}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{^inline}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/inline}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<div class="formcontrol"><div placeholder="{{placeholder}}" style="min-height: 250px;outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" id="{{id}}container"></div></div>
	</div>
</div>`;
gform.types['ace'] = _.extend({}, gform.types['input'], {
  create: function(){
    var tempEl = document.createElement("span");
    tempEl.setAttribute("id", this.id);
    if(this.owner.options.clear){
      tempEl.setAttribute("class", ''+gform.columnClasses[this.columns]);
    }
    tempEl.innerHTML = this.render();
    return tempEl;
},
// render:function(){
//   return gform.render('textarea',this)
// },
  initialize: function(){
    //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
    //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
      this.onchangeEvent = function(input){
        //   this.input = input;
          this.value = this.get();
          if(this.el.querySelector('.count') != null){
            var text = this.value.length;
            if(this.limit){text+='/'+this.limit;}
            this.el.querySelector('.count').innerHTML = text;
          }
        //   this.update({value:this.get()},true);
        //   gform.types[this.type].focus.call(this)
          this.owner.trigger(['change:'+this.name,'change','input:'+this.name,'input'], this,{input:this.value});

        //   this.owner.pub('change:'+this.name, this,{input:this.value});
        //   this.owner.pub('change', this,{input:this.value});
        //   this.owner.pub('input:'+this.name, this,{input:this.value});
        //   this.owner.pub('input', this,{input:this.value});
      }.bind(this)
      this.input = this.input || false;
      this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

      this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
    this.editor = ace.edit(this.id+"container");
    this.editor.setTheme(this.item.theme || "ace/theme/chrome");
    this.editor.getSession().setMode({path: this.owner.options.default.mode || this.item.mode || "ace/mode/handlebars", inline:this.owner.options.default.inlinemode || this.item.inlinemode});
    this.editor.session.setValue(this.value);
   
  },
  // update: function(item, silent) {
  //   if(typeof item !== 'undefined' && (
  //       typeof item.options !== undefined ||
  //       typeof item.max !== undefined ||
  //       typeof item.action !== undefined 
  //       )
  //       && typeof this.mapOptions !== 'undefined'){
  //       delete this.mapOptions;
  //       this.item = _.defaults({},item,this.item);

  //       // this.item.options = _.assign([],this.item.options,item.options);
  //       this.options = _.extend([],this.item.options);
  //       this.max = this.item.max;
  //       this.min = this.item.min;
  //       this.path = this.item.path;
  //       this.action = this.item.action;
  //   }
  //   // else if(typeof this.mapOptions !== 'undefined'){
  //   // }
  //   if(typeof item === 'object') {
  //       _.extend(item,this);
  //   }
  //   this.label = gform.renderString((item||{}).label||this.item.label, this);

  //   // var oldDiv = document.getElementById(this.id);

  //   // var oldDiv = this.owner.el.querySelector('#'+this.id);
  //   var oldDiv = this.el;
  //   this.destroy();
  //   this.el = gform.types[this.type].create.call(this);
  //   oldDiv.parentNode.replaceChild(this.el,oldDiv);
  //   gform.types[this.type].initialize.call(this);

  //   if(!silent) {
  //       this.owner.pub(['change:'+this.name,'change'], this);
  //   }
  //   if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
    
  // },
  set:function(value){
    this.editor.session.setValue(value);
  },
  get:function(){
    return this.editor.getValue()
  },
  focus: function(){
    this.editor.focus();
  }
});

var fileManager = function(selector, options){
  this.$el = $(selector);
  options.hasextra  = (typeof options.extra == 'function');
  options.u_id =  gform.getUID();
  options.label = options.label || 'Section';
  options.items = _.map(options.items, function(item) {
    item.key = options.u_id+item.name.toLowerCase().replace(/ /g,"_").split('.').join('_');
    return item;
  })
  options.fields = _.map(options.items, function(item) {
        return {target:'#'+item.key,name:item.key};        
  })  
  options.actions = [];
  options.clear = false;
  options.data  = {};
  _.each(options.items, function(item) {
    if(typeof item.content == 'object'){
      item.content = JSON.stringify(item.content)
    }
    options.data[item.key] = item.content;
  })
  options.default ={label: false,type:'ace',mode:options.mode || 'ace/mode/handlebars', inlinemode:options.inlinemode}
  this.options = $.extend(true,{editable: true},options);
  this.active = this.options.items[0].key;
  $(selector).html(templates.pages.render(this.options,templates));
  // this.gform = $(selector+' .dummyTarget').berry(this.options);
  this.gform = new gform(this.options,selector);
  this.render = function(){
    $(selector+' .list-group').empty().html(templates.pages_listgroupitem.render(this.options));
    $('[href="#'+this.active+'"]').click();
  }
  this.sorter = new Sortable(document.querySelector(selector+' .list-group'),{draggable:'.sortable'})

  $(selector+' .actions .pages_delete,'+selector+' .actions .pages_edit,'+selector+' .actions .pages_new,'+selector+' .pages_extra').on('click', function(e){
    var currentItem = _.findWhere(this.options.items, {key: this.active});
    if($(e.currentTarget).hasClass('pages_delete') && !currentItem.disabled){
      currentItem.removed = true;
      this.render();
    }else{
      if($(e.currentTarget).hasClass('pages_edit') && !currentItem.disabled){

        new gform({name:'page_name', legend: 'Edit '+options.label, data: {name: currentItem.name},fields: [{label:'Name'}]} ).on('save', function(e){
          _.findWhere(this.options.items, {key:this.active}).name = e.form.get().name;
          this.render();
          e.form.dispatch('close');
        }.bind(this)).on('cancel',function(e){e.form.dispatch('close')}).modal();
      }else{
        if($(e.currentTarget).hasClass('pages_new')){
          new gform({name:'page_name', legend: 'New '+options.label,fields: [{label:'Name'}]}).on('save', function(e){
            this.add(e.form.get().name,'')
            e.form.dispatch('close');
          }.bind(this)).on('cancel',function(e){e.form.dispatch('close')}).modal();
        }else{
          if($(e.currentTarget).hasClass('pages_extra')) {
            this.options.extra.call(this, currentItem);
          }else{
          	if(currentItem.disabled){
          		toastr.error('This action is disabled for this item','Disabled')
          	}
          }
        }
      }
    }
  }.bind(this));

  $(selector).on('click','.list-group-item.tab',function(e){
    $(e.currentTarget).parent().find('.list-group-item').removeClass('active');
    $(e.currentTarget).addClass('active');
    this.active = $(e.currentTarget).attr('aria-controls');
		$(e.currentTarget).parent().parent().find('button.dropdown-toggle').prop('disabled', 
		  (_.findWhere(this.options.items, {key: this.active}) || this.options.items[0]).disabled || false
		);
    if(typeof this.gform.find(this.active) !== 'undefined'){
      this.gform.find(this.active).editor.clearSelection();//.instances[0]
      gform.types['ace'].focus.call(this.gform.find(this.active))

    }
  }.bind(this))
  $(selector).find('.list-group-item.tab').first().click();
  this.getCurrent = function(){
      return _.findWhere(this.options.items, {key: this.active});
  }
  this.add = function(name, value){
    var key = this.options.u_id+name.toLowerCase().replace(/ /g,"_").split('.').join('_');;
    this.options.items.push({name: name,key:key, content:""})
    this.$el.find('.tab-content').append(templates.pages_tabpanel.render({name: name,key:key, content:""}));
    if(typeof this.gform.find(key) == 'undefined'){
      this.gform.fields.push(gform.createField.call(this.gform, this.gform, {}, null ,null, $.extend({name:key,target:'#'+key},this.gform.options.default)))
    }else{      
      var updateItem = _.findWhere(this.options.items, {name: name});
      
      updateItem.removed = false;
    }
    this.render();
    this.gform.find(key).set(value)
  }
  return {
    toJSON:function(){
      var options = this.options;

      var data = this.gform.toJSON();
      var order = _.map($(selector+' .list-group').children(),function(item){return $(item).attr('name')})

      var temp = _.map(order,function(item){
      var cachedItem = _.findWhere(options.items, {key:item});
        
        if(typeof cachedItem !== 'undefined' && !cachedItem.removed){
          return {name: _.findWhere(options.items, {key:item}).name, content: data[item]};
        }else{
          return false;
        }
      });


      // var temp = _.map(this.gform.toJSON(),function(item,i){
      //   var cachedItem = _.findWhere(options.items, {key:i});
        
      //   if(typeof cachedItem !== 'undefined' && !cachedItem.removed){
      //     return {name: _.findWhere(options.items, {key:i}).name, content: item};
      //   }else{
      //     return false;
      //   }
      // });



      return _.filter(temp, function(item){return item;});
    }.bind(this),
    getCurrent:this.getCurrent.bind(this),
    update:function(key,value){
      this.gform.find(key).set(value)
    }.bind(this),
    remove: function(name){
      var updateItem = _.findWhere(this.options.items, {name: name});
      this.options.items.splice(_.indexOf(this.options.items, updateItem),1)
      // updateItem.removed = true;
      this.render();      
    }.bind(this),
    add: this.add.bind(this),
    errors: function(){
    	// var errors = 0;
    	var errors = [];
    	_.each(this.options.items, function(item){
    		var items = _.where(this.gform.find(item.key).editor.session.getAnnotations(), {type:"error"});
    		for(var i in items){
    			items[i].name = item.name;
    		}
				errors = errors.concat(items);

    		var content = item.name;

    		if(items.length){
    			content = '<span class="badge badge-danger">'+items.length+ '</span> '+ item.name;
				}
    		if(item.disabled){
    			content = '<i class="fa fa-ban"></i> ' +content;
    		}
				this.$el.find('.list-group-item.tab[name="'+item.key+'"]').html(content);
    	}.bind(this))

    	return errors;
    }.bind(this)
  }
}
