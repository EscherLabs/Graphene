gform.types = {
  'input':{
      base:'input',
      defaults:{},
      row:function(){
        return '<div></div>';
      },
      setup:function(){
          this.labelEl = this.el.querySelector('label');
          gform.types[this.type].setLabel.call(this)
          this.infoEl = this.el.querySelector('.gform-info');
      },
      setLabel:function(){
        // var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this)+this.suffix;
        // if(this.required){
        //     label+=this.requiredText+this.suffix;
            
        // }
        // var labelEl = this.el.querySelector('label');
        gform.toggleClass(this.labelEl,'required',this.required)

        if(this.label !== false && typeof this.labelEl !== 'undefined' && this.labelEl !== null){
            this.labelEl.innerHTML = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this)+this.suffix;
        }
      },
      create: function(){
        var tempEl = document.createElement("span");
        tempEl.setAttribute("id", "el_"+this.id);
        gform.addClass(tempEl,gform.columnClasses[this.columns])
        gform.addClass(tempEl,gform.offsetClasses[this.offset])
        gform.toggleClass(tempEl,'gform_isArray',!!this.array)
        //   if(this.owner.options.clear){
            // tempEl.setAttribute("class", gform.columnClasses[this.columns]+' '+gform.offsetClasses[this.offset]);
        //   }
          tempEl.innerHTML = this.render();
          return tempEl;
      },
      render: function(){
        //   return gform.render(this.type, this);
          return gform.render(this.type, this).split('value=""').join('value="'+_.escape(this.value)+'"')

      },
      destroy:function(){
          this.el.removeEventListener('change',this.onchangeEvent );		
        //   this.el.removeEventListener('change',this.onchange );		
          this.el.removeEventListener('input', this.onchangeEvent);
      },
      initialize: function(){
        //   this.iel = this.el.querySelector('input[name="' + this.name + '"]')
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.onchangeEvent = function(input){
            //   this.input = input;
              this.value = this.get();
              if(this.el.querySelector('.count') != null){
                var text = (this.value+"").length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
            //   this.update({value:this.get()},true);
            //   gform.types[this.type].focus.call(this)
                gform.types[this.type].setup.call(this);
              this.parent.trigger(['change'], this,{input:this.value});
              if(input){
                this.parent.trigger(['input'], this,{input:this.value});
              }
          }.bind(this)
          this.input = this.input || false;
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
          gform.types[this.type].setup.call(this);

      },
      update: function(item, silent) {
        var oldDiv = this.el;

        if(typeof item !== 'undefined' && (
            typeof item.options !== 'undefined' ||
            typeof item.max !== 'undefined' ||
            typeof item.action !== 'undefined' 
            )
            && typeof this.mapOptions !== 'undefined'){
            delete this.mapOptions;
            this.item = _.defaults({},item,this.item);

            // this.item.options = _.assign([],this.item.options,item.options);
            this.options = _.extend([],this.item.options);
            this.max = this.item.max;
            this.min = this.item.min;
            this.path = this.item.path;
            this.action = this.item.action;
        }
        // else if(typeof this.mapOptions !== 'undefined'){
        // }
        if(typeof item === 'object') {
            _.extend(this, item);
            this.item = _.extend(this.item, item);
        }
        //should be able to remove the or and just use this.item.label
        // this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        this.destroy();
        this.el = gform.types[this.type].create.call(this);
        oldDiv.parentNode.replaceChild(this.el,oldDiv);
        gform.types[this.type].initialize.call(this);
        gform.types[this.type].show.call(this,this.visible);
        gform.types[this.type].edit.call(this,this.editable);

        if(!silent) {
            this.parent.trigger(['change'], this);
        }
        // if(typeof gform.types[this.type].setup == 'function') {
            //removed because its called in initialize
    //        gform.types[this.type].setup.call(this);
        // }
        
      },
      get: function() {
          return this.el.querySelector('input[name="' + this.name + '"]').value;
      },

      set: function(value) {
          this.el.querySelector('input[name="' + this.name + '"]').value = value;
      },
      toString: function(name,report){
          if(!report){
            return '<dt>'+this.label+'</dt> <dd>'+(this.value||'<span class="text-muted">(empty)</span>')+'</dd><hr>'
          }else{
              return this.value
          }
      },
      display: function(){
        return (typeof this.value !== 'undefined' && this.value !== '')?this.value:'(empty)';
      },
      satisfied: function(value) {
        value = value||this.value;
        if(_.isArray(value)){return !!value.length;}
        return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'number' && isNaN(value)));            
      },
      edit: function(state) {
        this.editable = state;

        this.el.querySelector('[name="'+this.name+'"]').disabled = !state;
      },
      show: function(state) {
        this.el.style.display = state ? "block" : "none";
      },

      find:function() {
        return this;
      },
      focus:function(timeout) {
        //   .focus();
        window.setTimeout(function(){
            if(this.el.querySelector('input[name="' + this.name + '"]') !== null && typeof this.el.querySelector('input[name="' + this.name + '"]').focus == "function"){


                this.el.querySelector('input[name="'+this.name+'"]').focus();
                var temp = this.value;
                this.set('');
                this.set(temp);
            }
        }.bind(this), timeout||0); 

         
        //   this.el.querySelector('[name="'+this.name+'"]').select();
      }
      //display
  },
//   'textarea':,
  'bool':{

      base:'bool',
      setup: function(){
        this.labelEl = this.el.querySelector('label');
        gform.types[this.type].setLabel.call(this)
        this.infoEl = this.el.querySelector('.gform-info');
      },

      display: function(){
        //   return (_.find(this.options,{value:this.value})||{label:''}).label
        return ((_.find(this.options,{value:this.value})||{label:''}).label || this.value);
      },
      defaults:{options:[false, true],format:{value:function(e){return e.value}}},
      render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(!this.strict && this.options[0]==false && this.options[1]==true){
            this.value = (!!this.value);
        }
        if(typeof this.mapOptions == 'undefined'){
        
          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change',function(){
              this.options = this.mapOptions.getoptions()
              if(typeof this.options[0].value == 'undefined'){this.options[0].value = false;this.options[0].selected = (this.value == false);}
              if(typeof this.options[1].value == 'undefined'){this.options[1].value = true;this.options[1].selected = (this.value == true);}

              this.update();
          }.bind(this))
        }
        this.options = this.mapOptions.getoptions()
        if(typeof this.options[0].value == 'undefined'){this.options[0].value = false;this.options[0].selected = (this.value == false);}
        if(typeof this.options[1].value == 'undefined' || (this.options[0].value == '' && this.options[1].value == '')){this.options[1].value = true;this.options[1].selected = (this.value == true);}
        //   this.selected = (this.value == this.options[1].value);
          return gform.render(this.type, this);

      },
      setLabel:function(){
        var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this);
        if(this.required){
            label+=this.requiredText+this.suffix;
        }
        var labelEl = this.el.querySelector('label[for='+this.name+']');
        if(labelEl !== null){
            labelEl.innerHTML = label
        }
          
      },
      initialize: function(){
          this.onchangeEvent = function(input){
              this.value = this.get();
              (_.find(this.options,{selected:true})||{selected:null}).selected = false;
              (_.find(this.options,{value:this.value})||this.options[0]||{value:""}).selected = true;
              gform.types[this.type].setup.call(this);

              this.parent.trigger(input?'change':'input', this,{input:this.value});
          }.bind(this)
          this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
          this.el.addEventListener('change', this.onchangeEvent.bind(null,false));
          gform.types[this.type].setup.call(this);

      },
      set: function(value) {
            this.el.querySelector('input[name="' + this.name + '"]').checked = (value == this.options[1].value);
      },edit: function(state) {
        this.editable = state;

        this.el.querySelector('[name="'+this.name+'"]').disabled = !state;
    },

    show: function(state) {
      this.el.style.display = state ? "block" : "none";
    },
      get: function() {
          return this.options[this.el.querySelector('input[name="' + this.name + '"]').checked?1:0].value;
      },satisfied: function(value) {

        value = value||this.value;
        return value == this.options[1].value;
      },
      toString: function(name,report){
        if(!report){
            return '<dt>'+(this.label||this.name)+'</dt> <dd>'+(this.display||'<span class="text-muted">(empty)</span>')+'</dd><hr>'
        }else{
            return this.value
        }
    }
  },
  'collection':{

    base:'collection',
      defaults:{format:{label: '{{{label}}}',  value: function(item){
          if(item.value !== 'undefined'){
            return item.value;
          }else{
            return (item.label || item.index).toLowerCase().split(' ').join('_');
          }
	}}},
      toString: function(name,report){
        if(!report){
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        if(typeof lookup !== 'undefined'){
                            returnVal+='<dd>'+lookup.label+'</dd>'                        
                        }
                        return returnVal;
                    }.bind(this),'<dt>'+this.label+'</dt> ')+'<hr>'
                }else{
                    return '<dt>'+this.label+'</dt> <dd><span class="text-muted">(no selection)</span></dd><hr>';
                }
            }else{
                return '<dt>'+this.label+'</dt> <dd>'+((_.find(this.list,{value:this.value})||{label:""}).label||'<span class="text-muted">(no selection)</span>')+'</dd><hr>';
            }
        }else{
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        returnVal.push(lookup.label)
                        return returnVal;
                    }.bind(this),[])+'<hr>'
                }else{
                    return '';
                }
            }else{
                return (_.find(this.list,{value:this.value})||{label:""}).label;
            } 
        }
      },
      display: function(){
            if(this.multiple){
                if(this.value.length){
                    return '<ul>'+_.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        if(typeof lookup !== 'undefined'){
                            returnVal+='<li>'+lookup.label+'</li>'                        
                        }
                        return returnVal;
                    }.bind(this),'')+'</ul>'
                }else{
                    return '(no selection)';
                }
            }else{
                return ((_.find(this.list,{value:this.value})||{label:""}).label||'(no selection)');
            }
      },
      render: function() {

        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){

                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions();
                if(!this.mapOptions.waiting){
                    if(this.multiple){
                        if(!_.isArray(this.value)){
                            this.value = [this.value]
                        }
                        // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                        _.each(this.value,function(value){
                            (_.find(this.list,{value:value})||{selected:null}).selected = true;
                        }.bind(this))
        
                    }else{
                        (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                        (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                    }
                }
                this.update();
            }.bind(this))

            this.mapOptions.on('collection',function(e){
                e.field.field.owner.trigger("collection",e.field.field)
            })
            }
            this.options = this.mapOptions.getobject();
            this.list = this.mapOptions.getoptions();

            if(!this.mapOptions.waiting){
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(this.other||false){
                            this.value = 'other';
                        }else{
                            // this.value = ""
                        }
                    }
                    if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                        this.options.push({label:"Other", value:'other',})
                    }
        
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
            }
            return gform.render(this.type, this);        
      },
      setup:function(){

        if(this.multiple && typeof this.limit !== 'undefinded'){
            if(this.get().length >= this.limit){
                this.maxSelected = true;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = !item.selected;
                })
            }else if (this.maxSelected) {
                this.maxSelected = false;
                _.each(this.el.querySelector('select').options,function(item){
                    item.disabled = false;
                })  
            }
            if(this.el.querySelector('.count') != null){
                var text = this.get().length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
              }
          }
          this.labelEl = this.el.querySelector('label');
          gform.types[this.type].setLabel.call(this)
          this.infoEl = this.el.querySelector('.gform-info');
      },
      initialize: function() {       
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();

            //   (_.find(this.list,{selected:true})||{selected:null}).selected = false;
            //   (_.find(this.list,{value:this.value})||{selected:null}).selected = true;

            if(this.multiple){
                if(!_.isArray(this.value)){
                    this.value = [this.value]
                  }
                // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                _.each(this.value,function(value){
                    (_.find(this.list,{value:value})||{selected:null}).selected = true;
                }.bind(this))

            }else{
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
            }


            if(this.el.querySelector('.count') != null){
                var text = this.value.length;
                if(this.limit>1){text+='/'+this.limit;}
                this.el.querySelector('.count').innerHTML = text;
            }

            gform.types[this.type].setup.call(this);
            this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));

          gform.types[this.type].set.call(this,this.value);
        //   gform.types[this.type].setLabel.call(this);

          gform.types[this.type].setup.call(this);

      },
      get: function() {
          var value = this.el.querySelector('select').value;
          search = _.find(this.list,{i:parseInt(value,10)});
          if(typeof search == 'undefined'){
            if(this.other){
                value = "other";
            }else{
                value = null;
            }
          }else{
            value = search.value;
          }
          
         
          if(this.multiple){
            var that = this;
            value = _.transform(this.el.querySelector('select').options,function(orig,opt){
                if(opt.selected){
                    var option = _.find(that.list,{i:parseInt(opt.value)});
                    if(typeof option !== 'undefined'){
                        orig.push(option.value)
                    }
                }
            },[])
          }
        //   this.option = _.find()
          return value;
      },
      set: function(value) {

        //   _.each(this.options.options, function(option, index){
        //       if(option.value == value || parseInt(option.value) == parseInt(value)) this.el.querySelector('[name="' + this.name + '"]').selectedIndex = index;
        //   }.bind(this))
        if(this.multiple){
            if(!_.isArray(value)){
                value = [value]
            }
          if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
          _.each(this.el.querySelector('select').options, function(option){
            //  option.selected = (value.indexOf(option.value)>=0)
             var search = _.find(this.list,{i:parseInt(option.value)})
             option.selected =  (typeof search !== 'undefined' && value.indexOf(search.value)>=0);
          }.bind(this))
        }else{
            var search = _.find(this.list,{value:value});
            if(typeof search !== 'undefined'){
                this.el.querySelector('select').value = search.i;
            }else{
                this.el.querySelector('select').value = null;
            }
        }
        if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
        
      },
      focus:function() {

        var search = this.name;
        if(this.multiple){search+='[]'}
          this.el.querySelector('[name="'+search+'"]').focus();
      },edit: function(state) {
        this.editable = state;

        var search = this.name;
        if(this.multiple){search+='[]'}

        // this.editable = state||this.editable||true;

        if(typeof this.mapOptions !== 'undefined' && this.mapOptions.waiting){
          this.el.querySelector('[name="'+search+'"]').disabled = !this.editable;

        }else{
          this.el.querySelector('[name="'+search+'"]').disabled = !this.editable;

        }
      },
      show: function(state) {
        this.el.style.display = state ? "block" : "none";
      }
  },
  'section':{

    base:'section',
    filter: function(search,depth){
        return gform.filter.call(this,search,depth);
    },
    setLabel:function(){
        // if(!!this.item.label){
            var label = gform.renderString(this.item.label||this.label, this);
            if(this.required){
                label+=this.requiredText+this.suffix;
            }
            var labelEl = this.el.querySelector('fieldset#'+this.id+'>legend,fieldset#'+this.id+'>label')
            if(labelEl !== null){
                labelEl.innerHTML = label
            }
        // }
      },
      create: function() {
          var tempEl = gform.create(this.render());
          gform.addClass(tempEl,gform.columnClasses[this.columns])
          gform.addClass(tempEl,gform.offsetClasses[this.offset])
          gform.toggleClass(tempEl,'gform_isArray',!!this.array)

          return tempEl;
      },
      initialize: function() {
        //handle rows
        this.rows = [];
        this.initialValue = this.value
        Object.defineProperty(this, "value",{
            get: function(){
                // return true;
                return this.get();
            },
            enumerable: true
        });
        gform.types[this.type].setLabel.call(this);
      },        
      render: function() {
          if(this.section){
              return gform.render(this.owner.options.sections+'_fieldset', this);                
          }else{
              return gform.render('_fieldset', this);                
          }
      },      
      update: function(item, silent) {

        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        // this.label = gform.renderString((item||{}).label||this.item.label, this);

        // var oldDiv = document.getElementById(this.id);
        // var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
        //   this.el.style.display = this.visible ? "block" : "none";
          gform.types[this.type].show.call(this,this.visible);

          gform.types[this.type].edit.call(this,this.editable);

          this.container =  this.el.querySelector('fieldset')|| this.el || null;
          this.reflow();
          if(!silent) {
            //   this.parent.trigger('change:'+this.name, this);
            //   this.parent.trigger('change', this);
              this.parent.trigger(['change'], this);
          }
        },
      get: function(name) {
          //this is not right ----
          if(typeof name !== 'undefined'){
              return gform.toJSON.call(this, name);
          }
          return _.selectPath(gform.toJSON.call(this),this.map)

        //   var value = gform.toJSON.call(this)[this.name];
        //   return !this.array || typeof value == 'undefined'?value:value[this.index];
       
        //   return gform.toJSON.call(this, name)[this.name]
      },
      toString: function(name, report) {
          if(!report){
              return gform.m('<h4>{{#label}}{{{label}}}{{/label}}</h4><hr><dl style="margin-left:10px">{{{value}}}</dl>',{label:this.label,value:gform.toString.call(this, name)})
            // return '<h4>'+this.label+'</h4><hr><dl style="margin-left:10px">'+gform.toString.call(this, name)+'</dl>';
          }else{
            return gform.toString.call(this, name,report);
          }
      },
    //   display: function() {
    //     return gform.toString.call(this, name);
    //   },

    display: function() {
        return '<div class="list-group-item ">'+this.toString()+'</div>';              
      },
      set: function(value){
        if(value == null || value == ''){
            gform.each.call(this, function(field) {
                field.set('');
            })
            this.update({},true);
        }else{
            _.each(value,function(item,index){
                var field = this.find(index);
                if(field.array && _.isArray(item)){
                    var list = this.filter({array:{ref:field.array.ref}},1)

                    if(list.length > 1){
                        _.each(list.slice(1),function(field){
                            var index = _.findIndex(field.parent.fields,{id:field.id});
                            field.parent.fields.splice(index, 1);
                        })
                    }

                    var testFunc = function(selector,status, button){
                        gform.toggleClass(button.querySelector(selector),'hidden', status)
                    }
                    if(_.isArray(item)){
                        field.set(item[0]);
                    }

                    // if(!this.owner.options.strict){
                        // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
                    // }else{
                        var attr = {};
                        attr[field.name] = item;
                        gform.inflate.call(this.owner,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
                    // }
                    var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                    _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                    _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
         
                    field.operator.reflow();



                }else{
                    // gform.inflate.bind(this, this.options.data||{})
                    if(typeof field !== 'undefined'){
                        field.set(item);
                    }
                }
            }.bind(this))
        }
        this.render();
        return true;

      },
      find: function(name) {
          return gform.find.call(this, name)
      },
      reflow: function() {
          gform.reflow.call(this)
      },
      focus:function() {
          if(typeof this.fields !== 'undefined' && this.fields.length){
            gform.types[this.fields[0].type].focus.call(this.fields[0]);
          }
      },
      satisfied: function(value) {
          value = value||this.get();
          return (typeof value !== 'undefined' && value !== null && value !== '' && !(typeof value == 'object' && _.isEmpty(value)));            
      },
      trigger: function(a,b,c){
        // if(typeof a == 'string' && typeof b == 'object') {
        //     this.parent.dispatch(a+b.name,b,c);
        //     this.parent.dispatch(a,b,c);
        // }else{
        //     this.dispatch(a,b,c);
        // }
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        _.each(a, function(item){
            if(item.indexOf(':') == '-1'){
                events.unshift(item+':'+this.name)
            }
        }.bind(this))
        // a.unshift(a+':'+this.name)
        this.parent.trigger(_.uniq(events),b,c);

      },
      show: function(state) {
          if(this.owner.options.sections && this.section){
              return true;
          }
        this.el.style.display = state ? "block" : "none";
      }
  },
  'button':{
    base:'button',
    setLabel:function(){
        var label = gform.renderString((this.format||{title:null}).title||this.item.title|| this.item.label||this.label, this);
        if(this.required){
            label+=this.requiredText+this.suffix;
        }
        var labelEl = this.el;//.querySelector('button,.btn');
        if(labelEl !== null){
            labelEl.innerHTML = label
        }
      },
    toString: function(){return ''},
      defaults:{parse:false, columns:2, target:".gform-footer",map:false},
      create: function() {
          var tempEl = gform.create(this.render());
          tempEl.setAttribute("id", "el_"+this.id);
          // tempEl.setAttribute("class", tempEl.className+' '+gform.columnClasses[this.columns]);
          return tempEl;
      },
      initialize: function() {
          this.action = this.action || (this.label||'').toLowerCase().split(' ').join('_'), 
          this.onclickEvent = function(){
              if(this.editable) {
                  this.parent.trigger(this.action, this);
              }
          }.bind(this)
          this.el.addEventListener('click',this.onclickEvent );	
          gform.types[this.type].setLabel.call(this);

      },        
      render: function() {
          return gform.render('button', this);
      },
      satisfied: function(value) {
          return this.editable && this.visible;
      },
      update: function(item, silent) {
          
          if(typeof item === 'object') {
              _.extend(this, this.item, item);
          }
        //   this.label = gform.renderString(this.item.label, this);
        // this.label = gform.renderString((item||{}).label||this.item.label, this);

        //   var oldDiv = document.getElementById(this.id);
        //   var oldDiv = this.owner.el.querySelector('#'+this.id);
        var oldDiv = this.el;

          this.destroy();
          this.el = gform.types[this.type].create.call(this);
          oldDiv.parentNode.replaceChild(this.el, oldDiv);
          gform.types[this.type].initialize.call(this);
          gform.types[this.type].show.call(this,this.visible);
          gform.types[this.type].edit.call(this,this.editable);


      },        
      destroy:function() {		
          this.el.removeEventListener('click', this.onclickEvent);
      },
      get: function(name) {
          return null
      },
      set: function(value) {
      },
      edit: function(state) {
          this.editable = state;
          this.el.disabled = !state;
          gform.toggleClass(this.el,'disabled',!state)

      },
      show: function(state) {
        this.el.style.display = state ? "block" : "none";
      },
      focus:function() {
        this.el.focus();
      }
  }
};

// remove the added classes
gform.types['text'] = gform.types['password'] = gform.types['color'] = gform.types['input'];
gform.types['number']= _.extend({}, gform.types['input'],{get:function(){
    return parseFloat(this.el.querySelector('input[name="' + this.name + '"]').value,10);
}, render: function(){
    return gform.render(this.type, this).split('value=""').join('value="'+this.value+'"')
},});
gform.types['hidden']   = _.extend({}, gform.types['input'], {defaults:{columns:false},toString: function(name, report){

          if(!report){
            return '';
          }else{
              return this.value
          }
}});
gform.types['output']   = _.extend({}, gform.types['input'], {
    focus:function(){},
    toString: function(name, report){

        if(!report){
          return '';
        }else{
            return this.value
        }
},
    display: function(){
        return gform.renderString((this.format|| {}).value||'{{{value}}}', _.pick(this, "value",
        'name',
        'id',
        'inline',
        'valid',
        'map',
        'path',
        'parsable',
        'reportable',
        'visible',
        'parent',
        'owner',
        'data',
        'editable',
        'parent',
        'fillable',
        'array',
        'columns',
        'offset',
        'ischild','pre','post'
        ) );
    },
    render: function(){
        return gform.render(this.type, this);
    },
    get: function() {
        return this.value;
    },
    set: function(value) {
        this.value = value;
        // this.display = gform.renderString((this.format|| {}).value||'{{{value}}}', this);
        // gform.renderString(this.template, this);
        this.el.querySelector('output').innerHTML = this.display;

    },
});

gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{validate: [{ type:'valid_email' }]}});

gform.types['textarea'] = _.extend({}, gform.types['input'], {
      set: function(value) {
          this.el.querySelector('textarea[name="' + this.name + '"]').value = value;
      },
      get: function() {
          return this.el.querySelector('textarea[name="' + this.name + '"]').value;
      },
      render: function(){
        //   return gform.render(this.type, this);
          return gform.render(this.type, this).split('></textarea>').join('>'+_.escape(this.value)+'</textarea>')

      },focus:function(timeout) {
        //   .focus();
        window.setTimeout(function(){
            if(this.el.querySelector('textarea[name="' + this.name + '"]') !== null && typeof this.el.querySelector('textarea[name="' + this.name + '"]').focus == "function"){


                this.el.querySelector('textarea[name="'+this.name+'"]').focus();
                var temp = this.value;
                this.set('');
                this.set(temp);
            }
        }.bind(this), timeout||0); 

         
        //   this.el.querySelector('[name="'+this.name+'"]').select();
      }
  });
gform.types['switch'] = gform.types['checkbox'] = _.extend({}, gform.types['input'], gform.types['bool']);

gform.types['select']   = _.extend({}, gform.types['input'], gform.types['collection'],{
    render: function() {
        //   this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){
          this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
          this.mapOptions.on('change', function(){

            this.options = this.mapOptions.getobject()
            this.list = this.mapOptions.getoptions()

            if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                this.options.push({label:"Other", value:'other'})
                this.list.push({label:"Other", value:'other'})
            }
    
            if(typeof this.placeholder == 'string'){
                // this.value = this.value || -1
                this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
                this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
            }
            if(!this.mapOptions.waiting){

                if(this.multiple){

                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    // (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(typeof this.placeholder == 'string'){
                            this.value = '';
                        }else{
                            this.value = (this.list[0]||{value:""}).value
                            if(this.list.length){
                            this.list[0].selected = true;
                            }
                        }
                    }else{
                        search.selected = true;
                    }
                }
            }
              this.update();
          }.bind(this))
          this.mapOptions.on('collection',function(e){
            e.field.field.owner.trigger("collection",e.field.field)
          })
        //   this.mapOptions.on('collection',function(e){
        //     console.log(this.mapOptions.waiting)
        //   }.bind(this))
        }
        this.options = this.mapOptions.getobject();
        this.list = this.mapOptions.getoptions()

        // var search = _.find(this.list,{value:this.value});
        // if(typeof search == 'undefined'){
        //     if(this.other||false){
        //         this.value = 'other';
        //     }else{
        //         if(typeof this.placeholder == 'string'){
        //             this.value = '';
        //         }else{
        //             this.value = (this.list[0]||{value:""}).value
        //         }
        //     }
        // }
        
        // if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
        //     this.options.push({label:"Other", value:'other'})
        //     this.list.push({label:"Other", value:'other'})
        // }

        if(typeof this.placeholder == 'string'){
            // this.value = this.value || -1
            this.options.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
            this.list.unshift({label:this.placeholder, value:'',i:-1,editable:false,visible:false,selected:true})
        }

        // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
        // (_.find(this.list,{value:this.value})||{value:""}).selected = true;
        if(!this.mapOptions.waiting){
            if(this.multiple){
                if(!_.isArray(this.value)){
                    this.value = [this.value]
                }
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                _.each(this.value,function(value){
                    (_.find(this.list,{value:value})||{selected:null}).selected = true;
                }.bind(this))

            }else{
    
                if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                    this.options.push({label:"Other", value:'other'})
                    this.list.push({label:"Other", value:'other'})
                }
                (_.find(this.list,{selected:true})||{selected:null}).selected = false;

                var search = _.find(this.list,{value:this.value});
                if(typeof search == 'undefined'){
                    if(this.other||false){
                        this.value = 'other';
                    }else{
                        if(typeof this.placeholder == 'string'){
                            this.value = '';
                        }else{
                            this.value = (this.list[0]||{value:""}).value
                            if(this.list.length){
                            this.list[0].selected = true;
                            }
                        }
                    }
                }else{
                    search.selected = true;
                }
            }
        }
        return gform.render('select', this);
    }
});
gform.types['range']   = _.extend({}, gform.types['input'], gform.types['collection'],{
  get: function(){
      return (this.el.querySelector('[type=range]')||{value:''}).value; 
  },
  set:function(value){
      this.el.querySelector('[type=range]').value = value;   
  }
});

gform.types['radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
  setup: function(){
    if(this.multiple && typeof this.limit !== 'undefinded'){        
        if(this.get().length>= this.limit){
            this.maxSelected = true;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = !item.checked;
            })
        }else if (this.maxSelected) {
            this.maxSelected = false;
            _.each(this.el.querySelectorAll('[type=checkbox]'),function(item){
                item.disabled = false;
            })  
        }
        if(this.el.querySelector('.count') != null){
          var text = this.get().length;
          if(this.limit>1){text+='/'+this.limit;}
          this.el.querySelector('.count').innerHTML = text;
        }
    }
    
        // if(this.other){
        //     this.el.querySelector('input').style.display = (this.value == 'other')?"inline-block":"none";
        // }

        this.labelEl = this.el.querySelector('label');
        gform.types[this.type].setLabel.call(this)
        this.infoEl = this.el.querySelector('.gform-info');
    },      
    render: function() {
        if(typeof this.item.size !== 'undefined'){
            this.size = Math.floor(((gform.columns || 12)/this.item.size))
        }
        if(typeof this.mapOptions == 'undefined'){
            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            this.mapOptions.on('change', function(){
                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions()
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                      }
                    // (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))
    
                }else{
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
                this.update();
            }.bind(this))

            this.mapOptions.on('collection',function(e){
                e.field.field.owner.trigger("collection",e.field.field)
            })
            }
            this.options = this.mapOptions.getobject();
            this.list = this.mapOptions.getoptions()
            if(!this.mapOptions.waiting){
                if(this.multiple){
                    if(!_.isArray(this.value)){
                        this.value = [this.value]
                    }
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    _.each(this.value,function(value){
                        (_.find(this.list,{value:value})||{selected:null}).selected = true;
                    }.bind(this))

                }else{
                    var search = _.find(this.list,{value:this.value});
                    if(typeof search == 'undefined'){
                        if(this.other||false){
                            this.value = 'other';
                        }else{
                            // this.value = ""
                        }
                    }
                    if((this.other||false) && typeof _.find(this.list,{value:'other'}) == 'undefined'){
                        this.options.push({label:"Other", value:'other',})
                    }
        
                    (_.find(this.list,{selected:true})||{selected:null}).selected = false;
                    (_.find(this.list,{value:this.value})||{value:""}).selected = true;    
                }
            }

            return gform.render(this.type, this);        
      },
  get: function(){
      if(this.multiple){

        var that = this;
          return _.transform(this.el.querySelectorAll('[type="checkbox"]:checked'),function(value,item){
              value.push(_.find(that.list,{i:parseInt(item.value)}).value).bind
            },[])
      }else{
        return (_.find(this.list,{i:parseInt((this.el.querySelector('[type="radio"]:checked')||{value:null}).value)}) ||{value:''}).value;
        // return (this.el.querySelector('[type="radio"]:checked')||{value:''}).value; 
      }
  },
  set:function(value){
    if(this.multiple){
        if(!_.isArray(value)){
          value = [value]
        }
        if(typeof this.limit !== 'undefinded' && (value.length > this.limit)){return true}
        _.each(this.el.querySelectorAll('[type=checkbox]'), function(option){
        //    option.checked = (value.indexOf(option.value)>=0)
           var search = _.find(this.list,{i:parseInt(option.value)})
           option.selected =  (typeof search !== 'undefined' && value.indexOf(search.value)>=0);
           option.checked =  (typeof search !== 'undefined' && value.indexOf(search.value)>=0);

           
        }.bind(this))
      
      }else{
        (this.el.querySelector('[value="'+(_.find(this.list,{value:this.value})||{i:''}).i+'"]')||{}).checked = false

        var option = _.find(this.list,{value:value});
        if(typeof option !== 'undefined'){
            var el = this.el.querySelector('[value="'+option.i+'"]');
            if(el !== null){
                value = value;
                el.checked = 'checked';
            }
        }else{

            value = this.default||null
            var option = _.find(this.list,{value:value});
            if(typeof option == 'undefined' && typeof this.defaultIndex !== 'undefined'){
                option = _.find(this.list,{index:''+this.defaultIndex});
            }
            if(typeof option !== 'undefined'){
                debugger;
                var el = this.el.querySelector('[value="'+option.i+'"]');
                if(el !== null){ el.checked = 'checked'; }
            }
        }
      }
      if(typeof gform.types[this.type].setup == 'function') {gform.types[this.type].setup.call(this);}
  },
  edit: function(state) {
    this.editable = state;

      _.each(this.el.querySelectorAll('input'),function(item){
          item.disabled = !state;            
      })
  },	
  focus: function(){
    this.el.querySelector('[type="radio"],[type="checkbox"]').focus();
  }
});

gform.types['scale']    = _.extend({}, gform.types['radio']);
gform.types['checkboxes']    = _.extend({}, gform.types['radio'],{multiple:true});
gform.types['_grid_row'] = _.extend({}, gform.types['hidden'],{
    toString: function(name,report){
        if(!report){
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        if(typeof lookup !== 'undefined'){
                            returnVal+='<span>'+lookup.label+'</span>'                        
                        }
                        return returnVal;
                    }.bind(this),'<tr><td style="width:20%">'+this.label+'</td><td>')+'</td><tr>'
                }else{
                    return '<tr><td style="width:20%">'+this.label+'</td> <td><span class="text-muted">(no selection)</span></td></tr>';
                }
            }else{
                return '<tr><td style="width:20%">'+this.label+'</td> <td>'+((_.find(this.parent.list,{value:this.parent.value[this.name]})||{label:""}).label||'<span class="text-muted">(no selection)</span>')+'</td></tr>';
            }
        }else{
            if(this.multiple){
                if(this.value.length){
                    return _.reduce(this.value,function(returnVal,item){
                        var lookup = _.find(this.list,{value:item});
                        returnVal.push(lookup.label)
                        return returnVal;
                    }.bind(this),[])+'<hr>'
                }else{
                    return '';
                }
            }else{
                return (_.find(this.list,{value:this.value})||{label:""}).label;
            } 
        }
      },
})
gform.types['grid'] = _.extend({}, gform.types['input'], gform.types['section'], gform.types['collection'],{
    toString: function(name, report) {
        if(!report){
          return '<dt>'+this.label+'</dt><dd><table class="table table-bordered">'+gform.toString.call(this, name)+'</table></dd><hr>';
        }else{
          return gform.toString.call(this, name,report);
        }
    },
    render: function() {
        // this.options = gform.mapOptions.call(this,this, this.value);
        if(typeof this.mapOptions == 'undefined'){

            this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
            
            this.mapOptions.on('change',function(){
                this.options = this.mapOptions.getobject()
                this.list = this.mapOptions.getoptions()
                this.update();
            }.bind(this))
        }
        this.options = this.mapOptions.getobject()
        this.list = this.mapOptions.getoptions()

        this.fields = _.map(this.fields, function(field){
            return _.assignIn({
                name: (gform.renderString(field.label)||'').toLowerCase().split(' ').join('_'), 
                id: gform.getUID(), 
                label: field.id||field.name,     
            }, field)
    
        })

        return gform.render(this.type, this);
    },
    setup: function(){
        if(this.multiple && typeof this.limit !== 'undefinded'){
            _.each(this.fields,function(field){
                var value = this.value[field.name]||[];
                if(value.length >= this.limit){
                    field.maxSelected = true;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = !item.checked;
                    })
                }else if (field.maxSelected) {
                    field.maxSelected = false;
                    _.each(this.el.querySelectorAll('[type=checkbox][name="' + field.id + '"]'),function(item){
                        item.disabled = false;
                    })
                }
            }.bind(this))
        }else{
            _.each(this.fields,function(field){
                var el = this.el.querySelector('[name="' + field.id + '"][value="'+(this.value[field.name]||'')+'"]');
                if(el !== null){
                    el.checked = 'checked';
                }
            }.bind(this))
        }
        this.labelEl = this.el.querySelector('label');
        gform.types[this.type].setLabel.call(this)
        this.infoEl = this.el.querySelector('.gform-info');
    },
    initialize: function() {
        //   if(this.onchange !== undefined){ this.el.addEventListener('change', this.onchange);}
          this.el.addEventListener('change', function(){
              this.value =  this.get();
              gform.types[this.type].setup.call(this);
              this.parent.trigger(['change','input'], this,{input:this.value});

          }.bind(this));
          gform.types[this.type].setup.call(this);
          this.rows = [];
          this.fields = _.map(this.fields,function(item){item.type='_grid_row';return item;})
          gform.types[this.type].setLabel.call(this);

      },
    get: function(){
        if(this.multiple){
            return _.transform(this.fields,function(result,field){
                result[field.name]= _.transform(this.el.querySelectorAll('[type="checkbox"][name="' + field.id + '"]:checked'),function(value,item){value.push(item.value)},[])
            }.bind(this),{})

        }else{
            return _.transform(this.fields,function(result,field){result[field.name]=(this.el.querySelector('[type="radio"][name="' + field.id + '"]:checked')||{value:''}).value}.bind(this),{})
        }
    },
    set:function(value){
        if(this.multiple){
            _.each(this.fields,function(value,field){
                if(typeof this.limit !== 'undefinded' && value != null && (value.length > this.limit)){return true}
                _.each(this.el.querySelectorAll('[name="' + field.id + '"][type=checkbox]'), function(value,option){
                option.checked = (value.indexOf(option.value)>=0)
                }.bind(this,value[field.name]))

            }.bind(this,value))
        }else{
            _.each(this.fields,function(field){
                var el = this.el.querySelector('[name="' + field.id + '"][value="'+value[field.name]+'"]');
                if(el !== null) {
                    el.checked = 'checked';
                }
            }.bind(this))
        }
        this.value = value;
        gform.types['grid'].setup.call(this)
    },
    focus:function() {
        // this.fields[0].name
        this.el.querySelector('[name="'+this.fields[0].id+'"]').focus();
    }
});
gform.types['fieldset'] = _.extend({}, gform.types['input'], gform.types['section'],{
    // row:function(){
    //     if(this.array){
    //         return gform.render('fieldset_array',this);
    //     }
    // },
    // rowSelector:".gform-template_row",
    // array:{max:5,min:1,duplicate:{enable:'auto'},remove:{enable:'auto'},append:{enable:false}}
    
});
gform.types['template'] = _.extend({}, gform.types['input'], gform.types['section'],{
    row:function(){
        return gform.render('template',this);
    },
    // set: function(value){
    //     if(value == null || value == ''){
    //         gform.each.call(this, function(field) {
    //             field.set('');
    //         })
    //         this.update({},true);
    //     }else{
    //         _.each(value,function(item,index){
    //             var field = this.find(index);
    //             if(field.array && _.isArray(item)){
    //                 var list = this.filter({array:{ref:field.array.ref}},1)

    //                 if(list.length > 1){
    //                     _.each(list.slice(1),function(field){
    //                         var index = _.findIndex(field.parent.fields,{id:field.id});
    //                         field.parent.fields.splice(index, 1);
    //                     })
    //                 }

    //                 var testFunc = function(selector,status, button){
    //                     gform.toggleClass(button.querySelector(selector),'hidden', status)
    //                 }
    //                 if(_.isArray(item)){
    //                     field.set(item[0]);
    //                 }

    //                 // if(!this.owner.options.strict){
    //                     // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
    //                 // }else{
    //                     var attr = {};
    //                     attr[field.name] = item;
    //                     gform.inflate.call(this.owner,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
    //                 // }
    //                 var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

    //                 _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
    //                 _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
         
    //                 field.operator.reflow();



    //             }else{
    //                 // gform.inflate.bind(this, this.options.data||{})
    //                 if(typeof field !== 'undefined'){
    //                     field.set(item);
    //                 }
    //             }
    //         }.bind(this))
    //     }
    //     return true;

    //   },
    rowSelector:".gform-template_row",
    array:
        {max:5,min:1,duplicate:{enable:false},remove:{enable:true},append:{enable:true}}
    ,
    initialize: function() {
        this.rows = [];
        this.initialValue = this.value

        this.owner.on('appended', function(id,e){
            if(id == e.field.id){
                e.field.el.click();
            }
        }.bind(null,this.id));
        this.owner.on('close', function(id,e){
            if(typeof e.field !== 'undefined' && id == e.field.id){
                e.field.modal('hide')
                e.field.modalEl.querySelector('.gform-modal_body').removeChild(e.field.container);
                e.field.container.removeEventListener('click', e.form.listener)

                e.field.value = e.field.get();
                e.field.update();
                e.form.trigger('done', this);   
            }
        }.bind(null,this.id));
        Object.defineProperty(this, "value",{
            get: function(){
                // return true;
                return this.get();
            }
        });
        gform.types[this.type].setLabel.call(this);

    },    
    display: function() {
        // return gform.m((this.format||{template:"{{{value}}}"}).template,_.extend({}, gform.stencils, this));
        return gform.renderString((this.format||{template:"{{{value}}}"}).display, _.pick(this, "value",
        'label',
        'name',
        'id',
        'inline',
        'valid',
        'map',
        'path',
        'parsable',
        'reportable',
        'visible',
        'parent',
        'editable',
        'parent',
        'fillable',
        'array',
        'columns',
        'offset',
        'ischild','pre','post'
        ) );
    },
    render: function() {
        return gform.m(gform.render('template_item',this),this)
    },
    edit: function(e){
        var target = (e.target.classList.value.indexOf('gform-')<0 && e.target.parentElement.classList.value.indexOf('gform-')>=0)?e.target.parentElement:e.target;
        
        if(!target.classList.contains('gform-minus') && !target.classList.contains('gform-add') && (this.el.querySelector('.gform-edit') == null || (this.el.querySelector('.gform-edit') && target.classList.contains('gform-edit') || this.el.querySelector('.gform-edit').contains(target)))){
            e.preventDefault();


            this.modalEl = gform.create(gform.render("modal_container",{body:'<div class="gform-modal_body"></div>',footer:gform.render('child_modal_footer'),legend:this.label,name:"preview"}))

            // document.body.appendChild(this.modalEl);
            this.container.addEventListener('click', this.owner.listener)
            // gform.removeClass(this.modalEl,'modal-hide');
            // gform.prototype.modal.call(this)
            this.modalEl.querySelector('.gform-modal_body').appendChild(this.container);

            this.modal = gform.prototype.modal.bind(this);
            this.modal();
            this.find({visible:true}).focus(this.owner.modalDelay);
            // window.setTimeout(gform.types[this.find({visible:true}).type].focus.bind(this.find({visible:true})), 0); 

            // var closeFunc = function(){
            //     e.stopPropagation();
            //     e.preventDefault();
            //     gform.prototype.modal.call(this,'hide')

            //     this.modalEl.querySelector('.gform-modal_body').removeChild(this.container);
            //     this.container.removeEventListener('click', this.owner.listener)

            //     this.value = this.get();
            //     this.update();
            //     this.owner.trigger('done', this);                
            // }.bind(this);

            // this.modalEl.querySelector('.close').addEventListener('click', closeFunc);
            // this.modalEl.querySelector('.modal-background').addEventListener('click', closeFunc);
            // this.modalEl.querySelector('.done').addEventListener('click', closeFunc);
                
            this.modalEl.querySelector('.done').addEventListener('click', function(e){
                this.owner.trigger('close',this);
            }.bind(this));
            this.modalEl.querySelector('.gform-footer .gform-minus').addEventListener('click', function(){
                e.stopPropagation();
                e.preventDefault();
                // gform.prototype.modal.call(this,'hide')
                this.modal('hide');

                this.modalEl.querySelector('.gform-modal_body').removeChild(this.container);
                this.container.removeEventListener('click', this.owner.listener)
                gform.removeField.call(this.owner,this);
            }.bind(this));
        }
    },
    create: function() {
        var tempEl = gform.create(this.render());
        gform.toggleClass(tempEl,'gform_isArray',!!this.array)
        this.container = gform.create('<fieldset></fieldset>');

        tempEl.addEventListener('click', gform.types.template.edit.bind(this))

        return tempEl;
    },
    update: function(item, silent) {
        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        // this.label = gform.renderString((item||{}).label||this.item.label, this);
        gform.types[this.type].setLabel.call(this);

        
        this.el.querySelector('.gform-template_container').innerHTML = gform.types[this.type].display.call(this);// gform.m(this.format.template, _.extend({}, gform.stencils, this))
        if(!silent) {
            this.parent.trigger(['change'], this);
        }
    }
});

gform.types['table'] = _.extend({}, gform.types['input'], gform.types['section'],{
    row:function(){
        this.labels =_.filter(this.fields,function(item){
            return !item.sibling
        });//_.uniq(_.map(this.fields,'label'))
        return gform.render('table',this);
    },
    toString: function(name, report) {
        if(!report){
          if(this.sibling){
            return "";
          }else{
              var mystring = _.reduce(this.parent.filter(this.name),function(initial, field){
                var mynode = document.createElement("tr");
                field.render(mynode);
                initial+= mynode.outerHTML
                return initial;
              },""
              )
            return gform.m('<h4>{{#label}}{{{label}}}{{/label}}</h4><dl style="margin-left:10px"><table class="table"><thead><tr>{{#field.fields}}<th>{{{label}}}</th>{{/field.fields}}</tr></thead><tbody>{{{value}}}</tbody></table></dl>',{label:this.label,value:mystring,field:this})
          }

        }else{
          return gform.toString.call(this, name,report);
        }
    },
    rowSelector:"tbody",
    array:{max:5,min:1,duplicate:{enable:false},remove:{enable:false},append:{enable:true},sortable:{enable:true}},
    initialize: function() {
        this.rows = [];
        this.initialValue = this.value

        this.owner.on('appended', function(id,e){
            if(id == e.field.id){
                e.field.el.click();
            }
        }.bind(null,this.id));

        this.owner.on('close', function(id,e){
  
            if(typeof e.field !== 'undefined' && id == e.field.id){
                e.field.owner.valid = true;
                e.field.owner.validate.call(e.field,true)
                if(e.field.owner.valid){
                    e.field.modal('hide')
                    e.field.modalEl.querySelector('.gform-modal_body').removeChild(e.field.container);
                    e.field.container.removeEventListener('click', e.form.listener)
    
                    e.field.value = e.field.get();
                    e.field.update();
                    if(e.field.array.sortable.enable && typeof $ !== 'undefined' && typeof $.bootstrapSortable !== 'undefined'){
                        $.bootstrapSortable({ applyLast: true });
                    }
    
                    e.form.trigger('done', this);   
                }
            }
 
        }.bind(null,this.id));

        Object.defineProperty(this, "value",{
            get: function(){
                // return true;
                return this.get();
            }
        });
        gform.types[this.type].setLabel.call(this);


      },     
    render: function(el) {
        el = el||this.el;

        el.innerHTML = "";

        /* Edit button on row*/
        // var cell = document.createElement("td");
        // var cellText = gform.create('<button class="btn btn-info btn-xs gform-edit"><i class="fa fa-pencil"></i> Edit</button>');
        // cell.appendChild(cellText);
        // el.appendChild(cell);

        _.each(this.fields,function(field){
            var renderable = "";
            if(typeof (this.value||{})[field.name] !== 'undefined' && (this.value||{})[field.name] !== ''){
                renderable = (this.value||{})[field.name];
            }else if(typeof field.value !== 'undefined' && field.value !== ''){
                renderable = field.value;
            }
            var cellText = document.createTextNode(renderable);

            // if(typeof field.display !== 'undefined'){
                if(typeof field.display == 'string'){
                    cellText = gform.create(field.display);
                }else if(typeof field.display == 'function'){
                    cellText = gform.create(field.display.call(this));
                }
            // }

            if(field.sibling){
                el.querySelector('#'+field.array.ref).appendChild(cellText);
            }else{
                var cell = document.createElement("td");
                if(typeof field.array !== 'undefined'){
                    cell.setAttribute("id", field.array.ref);
                }

                cell.appendChild(cellText);

                el.appendChild(cell);
            }

        }.bind(this))

    },     
    display: function(){
           return this.toString();
    },
    edit:function(e){
            if(
                !e.target.classList.contains('gform-minus') && 
                !e.target.classList.contains('gform-add')
            ){
                e.preventDefault();
                this.modalEl = gform.create(gform.render("modal_container",{body:'<div class="gform-modal_body"></div>',footer:gform.render('child_modal_footer'),legend:this.label,name:"preview"}))
                this.container.addEventListener('click', this.owner.listener)
                // gform.removeClass(this.modalEl,'modal-hide');
                // gform.prototype.modal.call(this)
                this.modalEl.querySelector('.gform-modal_body').appendChild(this.container);
    
                this.modal = gform.prototype.modal.bind(this);
                this.modal();
                this.find({visible:true}).focus(this.owner.modalDelay);

                // this.modalEl.querySelector('.close').addEventListener('click', closeFunc);
                // this.modalEl.querySelector('.modal-background').addEventListener('click', closeFunc);
                // this.modalEl.querySelector('.done').addEventListener('click', closeFunc);
                this.modalEl.querySelector('.done').addEventListener('click', function(e){
                    this.owner.trigger('close',this);
                }.bind(this));

                this.modalEl.querySelector('.gform-footer .gform-minus').addEventListener('click', function(){
                    e.stopPropagation();
                    e.preventDefault();
                    this.modal('hide');
                    this.modalEl.querySelector('.gform-modal_body').removeChild(this.container);
                    this.container.removeEventListener('click', this.owner.listener)
                    gform.removeField.call(this.owner,this);
                }.bind(this));
            }
        },
    create: function() {
        var tempEl = document.createElement("tr");
        gform.addClass(tempEl,'gform-edit');
        this.render(tempEl);
        tempEl.setAttribute("id", "el_"+this.id);
        gform.toggleClass(tempEl,'gform_isArray',!!this.array)
        this.container = gform.create('<fieldset></fieldset>');

        tempEl.removeEventListener('click', gform.types.table.edit.bind(this))
        tempEl.addEventListener('click', gform.types.table.edit.bind(this))

        return tempEl;
    },
    update: function(item, silent) {
        if(typeof item === 'object') {
            _.extend(this.item,item);
        }
        // this.label = gform.renderString((item||{}).label||this.item.label, this);
        gform.types[this.type].setLabel.call(this);

        this.render();
        if(!silent) {
            this.parent.trigger(['change'], this);
        }
    }
});


gform.types['custom_radio'] = _.extend({}, gform.types['input'], gform.types['collection'], {
    set: function(value) {
        var target = this.el.querySelector('[data-value="'+value+'"]');
        if(target !== null){
            target.click();
        }
    },		
    defaults: {
        selectedClass: 'btn btn-success',
        defaultClass: 'btn btn-default',
    },
    get: function() {
        return (this.el.querySelector('.' +  this.selectedClass.split(' ').join('.'))||({dataset:{value:""}})).dataset.value;
    },
    toggle:function(e){
        var elem = this.el.querySelector('.' + this.selectedClass.split(' ').join('.'));
        gform.toggleClass(elem, this.selectedClass, false)
        gform.toggleClass(elem, this.defaultClass, true)
        gform.toggleClass(e.target, this.defaultClass, false)
        gform.toggleClass(e.target, this.selectedClass, true)
        this.owner.trigger('change', this);
        this.owner.trigger('input', this);
    },
    initialize: function() {
        var anchors = this.el.querySelectorAll('a');
        for (const anchor of anchors) {
            anchor.removeEventListener('click', gform.types[this.type].toggle.bind(this));
            anchor.addEventListener('click', gform.types[this.type].toggle.bind(this));
            
          }
        // this.el.querySelectorAll('a').removeEventListener('click', gform.types[this.type].toggle.bind(this));
        gform.types[this.type].setLabel.call(this);

    }
  });

//   gform.types['custom_check'] = _.extend({}, gform.types['input'], gform.types['bool'], {
//     set: function(value) {
//         this.el.querySelector('[data-value="'+value+'"]').click();
//     },		
//     defaults: {
//         selectedClass: 'btn btn-success ',
//         defaultClass: 'btn btn-default',
//     },
//     get: function() {
//         return (this.el.querySelector('.' +  this.selectedClass.split(' ').join('.'))||({dataset:{value:""}})).dataset.value;
//     },
//     initialize: function() {
//         this.$el = $(this.el.querySelector('.custom-group'));
//         this.$el.children('a').off();
//         // this.el.addEventListener('input', this.onchangeEvent.bind(null,true));

//         this.$el.children('a').on('click', function(e){
//             this.$el.children('.' + this.selectedClass.split(' ').join('.')).toggleClass(this.selectedClass + ' ' + this.defaultClass);
//             $(e.target).closest('a').toggleClass(this.selectedClass + ' ' + this.defaultClass);


//             this.owner.trigger('change', this);
//             this.owner.trigger('input', this);
//         }.bind(this));
//     }
//   });



//tags
//upload
//base64
