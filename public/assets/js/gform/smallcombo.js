gform.stencils.smallcombo = `
<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
	<div class="combobox-container">
		<div class="input-group" style="width:100%" contentEditable="false"> 
		{{#pre}}<span class="input-group-addon">{{{pre}}}</span>{{/pre}}
        <div style="overflow: hidden;white-space: nowrap;position: absolute;padding-right: 40px;border-radius: 5px;" {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control {{^editable}}readonly disabled{{/editable}}" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}}{{#min}} min="{{min}}"{{/min}}{{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" {{#editable}}contentEditable{{/editable}} type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="{{value}}" ></div>
        <ul class="typeahead typeahead-long dropdown-menu"></ul>
        <span class="input-group-addon dropdown-toggle" style="height: 34px;z-index: 10;position: relative;border-left: solid 1px #ccc;width: 38px;" data-dropdown="dropdown"> <span class="caret" data-dropdown="dropdown"></span> <span data-dropdown="" class="fa fa-times"></span> </span> 
		</div>
        </div>
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`;
		
gform.types['smallcombo'] = _.extend({}, gform.types['input'], {
	base:"collection",
    destroy:function(){
        this.el.removeEventListener('change',this.onchangeEvent );		
      //   this.el.removeEventListener('change',this.onchange );		
        this.el.removeEventListener('input', this.onchangeEvent);
        this.combo.removeEventListener('blur',  this.handleBlur)

    },
	toString: function(name,display){
		if(!display){
			if(typeof this.combo !== 'undefined'){
				return '<dt>'+this.label+'</dt> <dd>'+(this.combo.innerText||'(empty)')+'</dd><hr>'
			}else{
				return '<dt>'+this.label+'</dt> <dd>'+(this.get()||'(empty)')+'</dd><hr>'
			}
          }else{
			if(typeof this.combo !== 'undefined'){
				return this.combo.innerText
			}else{
				return this.get()
			}
		  }
	},
	focus:function() {
        var node = this.el.querySelector('[type='+this.type+']');
        if(node !== null){
            node.focus();
            var sel = window.getSelection();
            var focus = sel.focusNode;
            if(focus !== null){
                var range = document.createRange();
                range.selectNode(focus);            
                range.collapse(false);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

	},
    render: function() {
        if(typeof this.mapOptions == 'undefined'){
        	this.mapOptions = new gform.mapOptions(this, this.value,0,this.owner.collections)
        	this.mapOptions.on('change', function(){
            	this.options = this.mapOptions.getoptions()
				if(this.shown){
					this.renderMenu();
				}
				if(typeof this.value !== 'undefined'){
					gform.types[this.type].set.call(this, this.value);
				}
          	}.bind(this))
        }
		this.options = this.mapOptions.getoptions();
        this.value = this.value || "";
        return gform.render('smallcombo', this);
    },
    get: function() {
		if(this.strict){
			return (_.find(this.options,{value:this.value})||{value:""}).value;
		}else{
			return this.value;
		}
    },
    set: function(value,silent,input) {
		var item = _.find(this.options,{value:value})||_.find(this.options,{label:value})
		if(typeof item !== 'undefined') {
			if(!input){
				this.combo.innerText = item.label;
				gform.addClass(this.el.querySelector('.combobox-container'), 'combobox-selected');
			}
			this.value = item.value;
		}else{
            
            
			this.value = value||"";
			if(typeof value == 'undefined' || (typeof value !== 'undefined' && this.combo.innerText !== value)) {
				this.combo.innerText =  this.value||"";
				
                this.parent.trigger(['undefined'], this);
				
            }
            
			gform.toggleClass(this.el.querySelector('.combobox-container'), 'combobox-selected', this.value!=="");
		}
		gform.types[this.type].setLabel.call(this);
		if(!silent) {
			this.parent.trigger(['change'], this);
		}
    },
    // "display":function(){
    //         // return true;
    //         debugger;
    //         		var item = _.find(this.options,{value:this.value})||_.find(this.options,{label:this.value})
    //         if(typeof item !== 'undefined') {
    //         				return item.label;

    //         		}else{
    //         		    return this.value
    //         		}

    // },
    edit: function(state) {
        this.editable = state;
        this.el.querySelector('.form-control').setAttribute("contenteditable", state?"true":"false");
        gform.toggleClass(this.el,'disabled',!state)
    },
    initialize: function(){
        this.onchangeEvent = function(input){
			_.throttle(this.renderMenu,100).call(this);
            this.set(this.combo.innerText,false,true);
            this.parent.trigger(['input'], this, {input:this.value});
        }.bind(this)
        gform.types[this.type].setup.call(this);
		this.processOptions = function(item){

            item.visible = ('visible' in item)?item.visible:true
            item.editable = ('editable' in item)?item.editable:true
            
			if(typeof item.optgroup !== 'undefined'){
				if(typeof item.optgroup.options !== 'undefined' && item.optgroup.options.length){
					_.each(item.optgroup.options,this.processOptions.bind(this))
				}
			}else{
				if(this.filter !== false && (this.combo.innerText == ""  || _.score(item.label.toLowerCase(), this.combo.innerText.toLowerCase())>.6)){
					var li = document.createElement("li");
					li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>',item);
					this.menu.appendChild(li);
					item.filter = true;
				}else{
					item.filter = false;
				}
			}
		}
        this.renderMenu = function(){
            this.menu.style.display = 'none';
            this.shown = false;
            this.menu.innerHTML = "";
            this.options = this.mapOptions.getoptions();
            _.each(this.options,this.processOptions.bind(this))

            var first = this.menu.querySelector('li');
            if(first !== null){
                gform.addClass(first,'active')
                this.menu.style.display = 'block';
                this.shown = true;
            }
            if(typeof this.search == 'string'){
                gform.ajax({path: gform.renderString(this.search,{search:this.combo.innerText}), success:function(data) {
                    index = this.options.length;
                    this.options = this.options.concat( _.map(data,function(option){
                    option.i = (option.i||(++index));
                        if(typeof this.format !== 'undefined'){
                            if(typeof this.format.label !== 'undefined' ){
                                option.label = gform.renderString(this.format.label,option);
                            }
                            if(typeof this.format.display !== 'undefined' ){
                                option.display = gform.renderString(this.format.display,option);
                            }
                            if(typeof this.format.value == 'string' ){
                                option.value = gform.renderString(this.format.value,option);
                            }else if(typeof this.format.value == 'function' ){
                                option.value = this.format.value.call(this,option)
                            }
                        }
                        option.visible = ('visible' in option)?option.visible:true
                        option.editable = ('editable' in option)?option.editable:true
                        if(!this.filter || this.combo.innerText == ""  || _.score(option.label.toLowerCase(), this.combo.innerText.toLowerCase())>.1){

                            var li = document.createElement("li");
                            li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>', option);
                            this.menu.appendChild(li);
                            option.filter = true;
                        }
                        return option;
                    }.bind(this)))
                    
                    if(typeof this.custom == 'object'){

                        this.menu.style.display = 'block';
                        this.shown = true;
                        var li = document.createElement("li");
                        li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>', this);
                        this.menu.appendChild(li);
                    }

                    var first = this.menu.querySelector('li');
                    if(first !== null){
                        gform.addClass(first,'active')
                        this.menu.style.display = 'block';
                        this.shown = true;
                    }else{
                        this.value = null;
                    }
                    this.parent.trigger(['change'], this, {input:this.value});
                }.bind(this)})
            }else{
                if(typeof this.custom == 'object'){

                    this.menu.style.display = 'block';
                    this.shown = true;

                    var li = document.createElement("li");
                    li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{custom.name}}" class="dropdown-item">{{{custom.display}}}</a>', this);
                    this.menu.appendChild(li);
                }
            }

            // gform.types.smallcombo.focus.call(this);
        }
        this.shown = false;
        this.input = this.input || false;
        this.menu = this.el.querySelector('ul')
        this.combo = this.el.querySelector('.form-control');
        // this.owner.container.onresize = function(){
        //     this.combo.style.width = this.combo.offsetWidth+'px'
        // };
        // this.combo.style.width = this.combo.offsetWidth+'px'
        this.set = gform.types[this.type].set.bind(this);
        
        this.select = function(index){
            if(!isNaN(parseInt(index))){
                var item = _.find(this.options,{i:parseInt(index)})
                this.set(item.value);
                this.parent.trigger(['input'], this, {input:this.value});

                this.menu.style.display = 'none';
                this.shown = false;
                gform.types.smallcombo.focus.call(this);
            }else{
                if(typeof this.custom == 'object' && this.custom.name == index){
                    if(typeof this.custom.action == 'function'){
                        this.custom.action.call(this)

                    }
                    this.parent.trigger(index, this);

                }
            }
		}
        $(this.el).on('click',".dropdown-item",function(e){
            if(e.currentTarget.dataset.editable != "false" && e.currentTarget.dataset.editable != false)this.select(e.currentTarget.dataset.index);
            e.stopPropagation();
        }.bind(this))

        this.el.addEventListener('mouseup',function(e){
            if(typeof e.target.dataset.dropdown !== "undefined" && this.editable){

                e.stopPropagation();
                if(this.el.querySelector('.combobox-selected') !== null){
					this.set();
                    this.parent.trigger(['input'], this, {input:""});
					this.renderMenu();
                }else{
                    if(this.shown){
                        this.menu.style.display = 'none';
                        this.shown = false;
                    }else{
                        this.renderMenu();
                    }
                }
                gform.types.smallcombo.focus.call(this);
            }
            this.mousedropdown = false;
        }.bind(this))
        this.el.addEventListener('mousedown',function(e){
            if(typeof e.target.dataset.dropdown !== "undefined"){

                this.mousedropdown = true;
            }
        }.bind(this))

        this.el.addEventListener('keydown',function(e){
            if (!this.shown) {
                if(e.keyCode == 40){this.renderMenu();}                
                if(e.keyCode == 13){e.preventDefault();}                
                return;
            }
            switch(e.keyCode) {
                case 9: // tab
                case 13: // enter
                    e.preventDefault();
                    this.select(this.menu.querySelector('li.active a').dataset.index);   
                    break;
                case 27: // escape
                    e.preventDefault();
                    this.menu.style.display = 'none';
                    this.shown = false;
                    break;

                case 38: // up arrow
                    e.preventDefault();
                    var active = this.menu.querySelector('.active');
                    gform.removeClass(active,'active');

                    prev = active.previousElementSibling;

                    if (!prev) {
                        var list = this.menu.querySelectorAll('li');
                        prev =  list[list.length-1];
                    }
                                
                    gform.addClass(prev,'active')

                    var active = $(this.menu).find('.active');
                    //fixscroll
                    if(active.length){
                        var top = active.position().top;
                        var bottom = top + active.height();
                        var scrollTop = $(this.menu).scrollTop();
                        var menuHeight = $(this.menu).height();
                        if(bottom > menuHeight){
                            $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                        } else if(top < 0){
                            $(this.menu).scrollTop(scrollTop + top);
                        }
                    }
                    break;

                case 40: // down arrow
                    e.preventDefault();
                    var active = this.menu.querySelector('.active');
                    gform.removeClass(active,'active');
                    next = active.nextElementSibling;
                    if (!next) {
                        next = this.menu.querySelector('li')
                    }
                    gform.addClass(next,'active')
                    var active = $(this.menu.querySelector('.active'));
                    //fixscroll
                    if(active.length){
                        var top = active.position().top;
                        var bottom = top + active.height();
                        var scrollTop = $(this.menu).scrollTop();
                        var menuHeight = $(this.menu).height();
                        if(bottom > menuHeight){
                            $(this.menu).scrollTop(scrollTop + bottom - menuHeight);
                        } else if(top < 0){
                            $(this.menu).scrollTop(scrollTop + top);
                        }
                    }
                    break;
            }
			e.stopPropagation();
        }.bind(this))

        $(this.menu).on('mouseenter', 'li', function(e){
					this.mousedover = true;
					if(this.menu.querySelector('.active') !== null){
						gform.removeClass(this.menu.querySelector('.active'),'active')
					}
					gform.addClass(e.currentTarget,'active')            
        }.bind(this))

        $(this.menu).on('mouseleave','li',function(e){
          this.mousedover = false;            
        }.bind(this))

        /*look into clean up this way*/
        // this.combo.addEventListener('paste', function(e){})
 this.handleBlur = function(e){
    /*clean up value to just be a string*/
    var input = document.createElement("input");
    input.value = this.combo.innerText;
    this.combo.innerHTML = input.value
    
    
    if(!(
        gform.hasClass(e.relatedTarget,'dropdown-item') || 
        gform.hasClass(e.relatedTarget,'dropdown-toggle') || 
        this.mousedropdown 
    )){
        if(this.shown ){
        var list = _.filter(this.options,{filter:true});
        if(this.strict){
            if(list.length == 1){
                this.set(list[0].value);
            }else{
                list = _.filter(this.options,{label:this.combo.innerText});
                if(list.length){
                    this.set(list[0].value);
                }
            }
        }else{
            this.set(this.combo.innerText)
        }
        if (!this.mousedover && this.shown) {setTimeout(function () { 
            this.menu.style.display = 'none'; this.shown = false;}.bind(this), 200);
        }
        this.parent.trigger(['input'], this, {input:this.value});
        this.menu.style.display = 'none';
        this.shown = false;
    }else{}
    
    if(this.strict){
        this.set(this.value||this.combo.innerText)

        this.set(gform.types[this.type].get.call(this))
    }else{
        if(typeof _.find(this.options,{value:this.value}) !== "undefined"){
            this.set(this.value)
        }else{
            this.parent.trigger(['undefined'], this);
        }
    }
    }
}.bind(this);
        this.combo.addEventListener('blur',  this.handleBlur)
		this.options = this.mapOptions.getoptions();

        if(typeof this.search == 'string'){
            gform.ajax({path: gform.renderString(this.search,{value:this.value}), success:function(data) {
                index = this.options.length;
    


                
                this.options = this.options.concat( _.map(data,function(option){

                    option.index = (option.index||(++index))+"";
                    // if(typeof this.format !== 'undefined'){
                    //     if(typeof this.format.label !== 'undefined' ){
                    //         option.label = gform.renderString(this.format.label,option);
                    //     }
                    //     if(typeof this.format.display !== 'undefined' ){
                    //         option.display = gform.renderString(this.format.display,option);
                    //     }
                    //     if(typeof this.format.value !== 'undefined' ){
                    //         option.value = gform.renderString(this.format.value,option);
                    //     }
                    // }

                    if(typeof this.format !== 'undefined'){
                        if(typeof this.format.label !== 'undefined' ){
                            option.label = gform.renderString(this.format.label,option);
                        }
                        if(typeof this.format.display !== 'undefined' ){
                            option.display = gform.renderString(this.format.display,option);
                        }
                        if(typeof this.format.value == 'string' ){
                            option.value = gform.renderString(this.format.value,option);
                        }else if(typeof this.format.value == 'function' ){
                            option.value = this.format.value.call(this,option)
                        }
                    }

                    option.visible = ('visible' in option)?option.visible:true
                    option.editable = ('editable' in option)?option.editable:true

                    if(this.combo.innerText == ""  || _.score(option.label.toLowerCase(),this.combo.innerText.toLowerCase())>.1){
                        var li = document.createElement("li");
                        li.innerHTML = gform.renderString('<a {{^editable}}style="color:#ccc;"{{/editable}} href="javascript:void(0);" tabindex="0" data-editable={{editable}} data-index="{{i}}" class="dropdown-item">{{{display}}}{{^display}}{{{label}}}{{/display}}</a>',option);
                        this.menu.appendChild(li);
                    }
                    return option;
                }.bind(this)))
                if(typeof this.value !== 'undefined'){
                    this.set(this.value);
                }

            }.bind(this)})
        }else{
            if(typeof this.value !== 'undefined'){
                this.set(this.value);
            }
        }

        this.el.addEventListener('input', this.onchangeEvent.bind(null, true));
    }
});