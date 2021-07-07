var gform = function(optionsIn, el){
    "use strict";
    //event management        
    this.updateActions = function(field){
        var fieldCount = field.parent.filter({array:{ref:field.array.ref}},1).length

        var testFunc = function(selector,status, button){
        gform.toggleClass(button.querySelector(selector),'hidden', status)
        }
        if(field.array.duplicate.enable == "auto"){
            _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        }
        if(field.array.remove.enable == "auto"){
            _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
        }        
        if(field.array.append.enable == "auto"){
            testFunc.call(null,'[data-ref="'+field.array.ref+'"].gform-append',(fieldCount >= (field.array.max || 5) ) ,field.operator.container)
        }
          
    }

    var data = _.merge({},optionsIn)

    this.methods = data.methods||{};

    this.eventBus = new gform.eventBus({owner:'form',item:'field',handlers:data.events||{}}, this)
    this.on = this.eventBus.on;
    this.errors = {};

    // this.sub = this.on;
    this.popin = function(){
        
    }
	this.trigger = function(a,b,c){
        if(typeof a == 'string'){ 
            a = [a];
        }
        var events = _.extend([],a);

        if(typeof b == 'object' && 'owner' in b && b.owner instanceof gform) {
            _.each(a, function(item){
                if(item.indexOf(':') == '-1'){
                    events.unshift(item+':'+b.name)
                    events.unshift(item+':'+b.path)
                    events.unshift(item+':'+b.relative)

                    var search = b;
                    while('parent' in search && search.parent !== false){
                        search = search.parent;
                        events.push(item+':'+search.name)
                        events.push(item+':'+search.path)
                        events.push(item+':'+search.relative)
                    }
                    // if(id){
                    // b = this.find({id:id})
                    // }
                }
            }.bind(this))
        }
        this.dispatch(_.uniq(events),b,c);
    }.bind(this)
	this.dispatch = this.eventBus.dispatch;
    // _.map(data.events,function(event,index){
    //     if(!_.isArray(event)){
    //         this.eventBus.handlers[index]=[event];
    //     }
    // }.bind(this))
    this.on('reset', function(e){
        e.form.set(e.form.options.data);
    });
    this.on('clear', function(e){
        e.form.set();
    });
    if(typeof data.collections == 'object'){
        this.collections = data.collections;
    }else{
        this.collections = gform.collections;
    }
    // this.sub = function (event, handler, delay) {
    //     delay = delay || 0;
    //     this.on(event, _.debounce(handler, delay));
    //     return this;
    // }.bind(this);
    
    //initalize form
    this.options = _.assignIn({fields:[], legend: '',strict:true, default:gform.default, data:'search', columns:gform.columns,name: gform.getUID()},this.opts, data);
    if(typeof this.options.onSet == 'function'){
        data = this.options.onSet(data)
    }
    this.options.fields = (this.options.fields||[]).concat(this.options.actions)
    if (typeof this.options.data == 'string') {
        if(typeof window.location[this.options.data] !== 'undefined'){
            this.options.data = window.location[this.options.data].substr(1).split('&').map(function(val){return val.split('=');}).reduce(function ( total, current ) {total[ current[0] ] = decodeURIComponent(current[1]);return total;}, {});
        }else{
            gform.ajax({path: (gform.options.rootpath||'')+this.options.data, success:function(data) {
                this.set(data)
            }.bind(this)})
        }
    }

    //set flag on all root fieldsets as a section
    if(this.options.sections){
        _.each(_.filter(this.options.fields,{type:'fieldset'}),function(item,i){
            item.index = i;
            item.section = true;
            item.id = item.id||gform.getUID();
        return item})
    }
    
    this.el = el || data.el;
    if(typeof this.el == 'string'){
        this.selector = this.el+'';
        this.el = document.querySelector(this.el);
    }else if(typeof this.el == 'object'){
        this.el;
    }else{
        el = '';
    }

  
    this.trigger('initialize',this);
    this.add = gform.createField.bind(this, this, this.options.data||{}, null, null);

    var create = function(){
        if(typeof this.el == 'undefined'){
            this.options.renderer = 'modal';
            this.el = gform.create(gform.render(this.options.template || 'modal_container', this.options))
            // document.querySelector('body').appendChild(this.el)
            // gform.addClass(this.el, 'active')

            this.on('close', function(e){
                if(typeof e.field == 'undefined'){
                    e.form.modal('hide')
                }
            });
            // this.sub('cancel', function(e){
            //     gform.removeClass(e.form.el, 'active')
            //     // e.form.destroy();
            //     // document.body.removeChild(e.form.el);
            //     // delete this.el;
            // });
            // this.on('save', function(e){
            //     // console.log(e.form.toJSON())
            //     gform.removeClass(e.form.el, 'active')
            // });
            this.el.querySelector('.close').addEventListener('click', function(e){
                this.trigger('cancel', this)}.bind(this)
            )
            document.addEventListener('keyup',function(e) {
                if (e.key === "Escape") { // escape key maps to keycode `27`
                    this.trigger('cancel', this)
                }
            }.bind(this));
        }
        if(this.options.clear && !(this.options.renderer == 'modal')){
            this.el.innerHTML = gform.render(this.options.sections+'_container', this.options);
        }
        this.container = this.el.querySelector('form') || this.el;

        this.rows = [];

        this.fields = [];
        this.fields =_.map(this.options.fields, this.add)

        _.each(_.extend([],this.fields), gform.inflate.bind(this, this.options.data||{}))

        this.reflow()
        // _.each(this.fields, function(field) {
        //     field.owner.trigger('change:' + field.name,field.owner, field);
        // })
        gform.each.call(this, gform.addConditions)
        gform.each.call(this, function(field) {
            field.owner.trigger('change', field);
        })
        if(!this.options.private){
            if(typeof gform.instances[this.options.name] !== 'undefined' && gform.instances[this.options.name] !== this){
                gform.instances[this.options.name].destroy();
            }
            gform.instances[this.options.name] = this;
        }
    }
    this.infoEl = gform.create(gform.render('_tooltip'))
    this.infoEl.querySelector('.info-close').addEventListener('click',function(e){
        this.el.removeChild(this.infoEl)
        this.popper.destroy()
        this.popper = null;
    }.bind(this));
    this.popper = null;

    this.restore = create.bind(this);
    this.toJSON = gform.toJSON.bind(this);
    // if(typeof this.options.onGet == 'function'){
    //     this.get = function(name){
    //         return this.options.onGet(this.toJSON(null, arguments));
    //     }.bind(this)
    // }else{
        this.get = this.toJSON;
    // }
    this.toString = gform.toString.bind(this)
    this.reflow = gform.reflow.bind(this)
    this.find = gform.find.bind(this)
    this.filter = gform.filter.bind(this)

    this.set = function(name, value) {
        if(typeof this.options.onSet == 'function'){
            value = this.options.onSet(value)
        }
        if(typeof name == 'string'){
            this.find(name).set(value)
        }
        if(typeof name == 'object'){
            _.each(name,function(item,index){
                var field = this.find(index);
                if(typeof field !== 'undefined' && field.fillable){
                    if(field.array && _.isArray(item)){
                        var list = this.filter({array:{ref:field.array.ref}},1)

                        if(list.length > 1){
                            _.each(list.slice(1),function(field){
                                var index = _.findIndex(field.parent.fields,{id:field.id});
                                field.parent.fields.splice(index, 1);
                            })
                        }

                        if(_.isArray(item)){
                            field.set(item[0]);
                        }

                        // if(!this.owner.options.strict){
                            // _.each(field.fields, gform.inflate.bind(this.owner, atts[field.name]|| field.owner.options.data[field.name] || {}) );
                        // }else{
                            var attr = {};
                            attr[field.name] = item;
                            gform.inflate.call(this.owner||this,attr,field,_.findIndex(field.parent.fields,{id:field.id}),field.parent.fields);
                        // }

                        this.updateActions(field);
                        // var fieldCount = this.filter({array:{ref:field.array.ref}},1).length

                        // var testFunc = function(selector,status, button){
                        //     gform.toggleClass(button.querySelector(selector),'hidden', status)
                        // }
                        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
                        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
            
                        field.operator.reflow();



                    }else{
                        // gform.inflate.bind(this, this.options.data||{})
                        if(typeof field !== 'undefined'){
                            field.set(item);
                        }
                    }
                }
            }.bind(this))
        }
        // if(typeof name == 'undefined'){
        if(name == null){
            gform.each.call(this, function(field) {
                field.set('');
            })
        }
        this.trigger('set');
        return this;
        // _.find(this.fields, {name: name}).set(value);
    }.bind(this),

    this.isActive = false;

    this.destroy = function() {
        this.isActive = false;
		this.trigger(['close','destroy']);
        this.el.removeEventListener('click',this.listener)
		//pub the destroy methods for each field
		// _.each(function() {if(typeof this.destroy === 'function') {this.destroy();}});
		//Clean up affected containers
		this.el.innerHTML = "";
		// for(var i = this.fieldsets.length-1;i >=0; i--) { $(this.fieldsets[i]).empty(); }

		//Dispatch the destroy method of the renderer we used
		// if(typeof this.renderer.destroy === 'function') { this.renderer.destroy(); }

		//Remove the global reference to our form
		delete gform.instances[this.options.name];

        this.trigger('destroyed');
        delete this.eventBus;

    };
    create.call(this)

    
    var tabs = this.el.querySelector('ul.tabs')
    if(tabs !== null){
        tabs.addEventListener('click',function(e){
            if(e.target.nodeName == 'LI'){
            e.preventDefault();
            gform.removeClass(this.el.querySelector('ul.tabs .active'), 'active')
            gform.removeClass(this.el.querySelector('.tab-pane.active'), 'active')
            gform.addClass(e.target,'active')
            gform.addClass(this.el.querySelector(e.target.parentElement.attributes.href.value),'active')
            }
        }.bind(this))
    }
    if(typeof this.options.autoFocus == 'undefined'){
        this.options.autoFocus = gform.options.autoFocus;
    }
    if(this.options.autoFocus && this.fields.length){
        var field = this.find({visible:true})
        if(field){
            window.setTimeout(gform.types[this.find({visible:true}).type].focus.bind(this.find({visible:true})), 0); 
        }
        // gform.types[this.fields[0].type].focus.call(this.fields[0])
    }





    this.listener = function(e){
        var field;
        var target = e.target;
        if(e.target.classList.value.indexOf('gform-')<0 && e.target.parentElement.classList.value.indexOf('gform-')>=0){
            target = e.target.parentElement;
        }
        if(typeof target.dataset.id !== 'undefined') {
            // console.error('ID not set on element'); return false;
        
            field = gform.findByID.call(this,target.dataset.id)
            if(typeof field == 'undefined'){console.error('Field not found with id:'+target.dataset.id); return false;}
        }

        if(target.classList.contains('gform-add')){
            e.stopPropagation();
            e.preventDefault();
            var newField = gform.addField.call(this,field);
            if(newField.array.duplicate.clone == true){
                newField.set(field.get())
                // if(gform.types[newField].base == "section"){
                //     newField.trigger(['change','input'],newField)
                // }
            }
        }
        if(target.classList.contains('gform-minus')){
            e.stopPropagation();
            e.preventDefault();
            gform.removeField.call(this,field);
        }
        if(target.classList.contains('gform-append')){
            e.stopPropagation();
            e.preventDefault();
            var field = gform.addField.call(this,
                _.last((this.find({id:target.dataset.parent}) || this).filter({array:{ref:target.dataset.ref}},10))
            )
            this.trigger('appended', field);
        }
        if(target.classList.contains('gform-info')){
            e.stopPropagation();
            e.preventDefault();

            if(field.infoEl){
                var show = true;
                if(this.popper !== null){
                    show = (this.popper.state.elements.reference != target)
                    this.el.removeChild(this.infoEl)
                    this.popper.destroy()
                    this.popper = null;
                }

                if(show){
                    this.infoEl.querySelector('.tooltip-body').innerHTML = gform.render('_info',field);
                    this.popper = Popper.createPopper(e.target, this.infoEl, {
                        placement: 'top-end',
                        modifiers: [{name: 'offset', options: {offset: [0, 8]}}]
                    });
                    this.el.appendChild(this.infoEl)
                }
              }
        }
    }.bind(this)
    this.el.addEventListener('click', this.listener)
    this.trigger('initialized',this);
    this.isActive = true;
    this.reflow();
    return this;
}
gform.addField = function(field){
    // var fieldCount = _.filter(field.parent.fields, 
    //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
    // ).length
    field.parent = field.parent || this;
    var fieldCount = field.parent.filter({array:{ref:field.array.ref}}).length

    var newField;
    if(field.editable && fieldCount < (field.array.max || 5)){
        var index = _.findIndex(field.parent.fields, {id: field.id});
        var atts = {};
        atts[field.name] = [field.item.value || null];
        
        newField = gform.createField.call(this, field.parent, atts, field.el ,null, _.extend({},field.item,{array:field.array}),null,null,fieldCount);
        field.parent.fields.splice(index+1, 0, newField)
        gform.addConditions.call(this,newField);
        //add conditions to child fields
        gform.each.call(newField, gform.addConditions)

        field.operator.reflow();
        _.each(_.filter(field.parent.fields, 
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        ),function(item,index){
            item.index = index;
            gform.types[item.type].setLabel.call(item)
        })

        gform.each.call(field.owner, function(field) {
            field.owner.trigger('change', field);
        })

        gform.types[newField.type].focus.call(newField);
        field.parent.trigger(['change','input', 'create', 'inserted'],field)

        fieldCount++;
    }
    this.updateActions(field);
    // var testFunc = function(selector,status, button){
    // gform.toggleClass(button.querySelector(selector),'hidden', status)
    // }
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))
    return newField;
}
gform.removeField = function(field){
    // var fieldCount =  _.filter(field.parent.fields, 
    //     function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
    // ).length;
    var fieldCount = field.parent.filter({array:{ref:field.array.ref}}).length

    if(field.editable && fieldCount > (field.array.min || 1)) {
        // Clean up events this field created as part of conditionals
        if(typeof field.eventlist !== 'undefined'){
            _.each(field.owner.eventBus.handlers,function(event,index,events){
                _.each(event,function(handler,a,b,c){
                    _.each(field.eventlist,function(a,b,search){
                        if(handler == search){
                            delete b[a];
                        }
                    }.bind(null,a,b))
                })
                events[index] =_.compact(events[index])
            })
        }
        var index = _.findIndex(field.parent.fields,{id:field.id});
        field.parent.fields.splice(index, 1);
        
        field.operator.reflow();
        _.each(_.filter(field.parent.fields, 
            function(o) { return (o.name == field.name) && (typeof o.array !== "undefined") && !!o.array; }
        ),function(item,index){
            item.index = index;
            gform.types[item.type].setLabel.call(item)

        })
        field.parent.trigger(['change','input','removed'],field)
        fieldCount--;
    }else{
        if(field.editable)field.set(null);
        field.parent.trigger(['input'],field)

    }           
    this.updateActions(field);
    // var testFunc = function(selector,status, button){
    // gform.toggleClass(button.querySelector(selector),'hidden', status)
    // }
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
    // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))

}
gform.addConditions = function(field) {

    gform.processConditions.call(field, field.show, function(result){
        var events = (this.visible !== result);
        this.visible = result;

        // this.el.style.display = result ? "block" : "none";
        gform.types[this.type].show.call(this,this.visible);

    
        if(events){
            this.operator.reflow();
            this.owner.trigger('change', this);
        }

    })

    gform.processConditions.call(field, field.edit, function(result){
        this.editable = result;        
        gform.types[this.type].edit.call(this,this.editable);
    })

    //should be able to reduce the number of times the process gets called using objectDefine
    if(!('parse' in field)){
        field.parse = field.show;
    }
    gform.processConditions.call(field, field.parse, function(result){
        this.parsable = result
    })
    if(!('report' in field)){
        field.report = field.show;
    }
    gform.processConditions.call(field, field.report, function(result){
        this.reportable = result
    })


    if(field.required){
        gform.processConditions.call(field, field.required, function(result,e){
            if(this.required !== result){
                this.required = result;
                gform.types[this.type].setLabel.call(this);
                // this.update({required:result},(e.field == this));
            }
        })
    }


}
gform.each = function(func){
    _.each(this.fields, function(field){
        func(field);
        if('fields' in field){
            gform.each.call(field,func);
        }
    })
}
gform.reduce = function(func,object,filter){
    var object = object ||{};
    _.reduce(this.filter(filter,1),function(object, field){
        var temp = func(object,field);

        if('fields' in field){
            temp = gform.reduce.call(field,func,temp,filter);
        }
        return temp;
    },object)
    return object;
}
gform.find = function(oname,depth){
    var name;
    var temp;
    if(typeof oname == 'string'){
        name = oname.split('.');
        temp = _.find(this.fields, {name: name.shift()})
    }else if(typeof oname == 'number'){
        // temp =this.fields[oname];// _.find(this.fields, {name: name.shift()})
        // name = oname;
    }else if(typeof oname == 'object'){
        return  gform.filter.call(this, oname,depth)[0] || false;
    }
    if(typeof temp !== 'undefined'){
        if('find' in temp){
            if(temp.name == oname || typeof oname == 'number'){
                return temp;
            }
            return temp.find(name.join('.'));
        }else{
            return temp;
        }
    }else{
        if(typeof this.parent !== 'undefined' && typeof this.parent.find == 'function'){
            return this.parent.find(oname);
        }
    }
}
gform.findByID = function(id){
    return  gform.filter.call(this, {id:id},10)[0] || false;
}

gform.filter = function(search,depth){
    var temp = [];
    if(typeof search == 'string'){
        search = {name: search}
    }
    var depth = (depth||10);
    depth--;

    _.each(this.fields, function(depth,field){
        if(_.isMatch(field, search)){
            temp.push(field)
        }
        if(!!depth && 'fields' in field){
            temp = temp.concat(gform.filter.call(field,search,depth));
        }
    }.bind(null,depth))
    return temp;
}

//parse form values into JSON object
gform.toJSON = function(name) {
    if(typeof name == 'string' && name.length>0) {
        var field = this.find({map:name},_.toPath(name).length)
        if(!field){
            field = this.find({name:name},_.toPath(name).length)
            if(!field){return undefined;}
        }
        return field.get()
    }
    return gform.reduce.call(this,gform.patch,{},{parsable:true})
}

gform.toString = function(name,report){
    if(!report){
        if(typeof name == 'string' && name.length>0) {
            name = name.split('.');
            return _.find(this.fields, {name: name.shift()}).toString(name.join('.'));
        }
        var obj = "";
        _.each(this.fields, function(field) {
            if(field.reportable){
                // var fieldString = field.toString();
                obj += field.toString();
            }
        })
        return obj;
    }else{
        if(typeof name == 'string' && name.length>0) {
            name = name.split('.');
            return _.find(this.fields, {name: name.shift()}).toString(name.join('.'),report);
        }
        var obj = {};
        _.each(this.fields, function(field) {
            if(field.visible||field.reportable){
                if(field.array){
                    obj[field.name] = obj[field.name]||[];
                    obj[field.name].push(field.toString(name,true))
                }else{
                    obj[field.name] = field.toString(name,true);
                }
            }
        })
        return obj;
    }
}
//  gform.m = function(l,a,m,c){function h(a,b){b=b.pop?b:b.split(".");a=a[b.shift()]||"";return 0 in b?h(a,b):a}var k= gform.m,e="";a=Array.isArray(a)?a:a?[a]:[];a=c?0 in a?[]:[1]:a;for(c=0;c<a.length;c++){var d="",f=0,n,b="object"==typeof a[c]?a[c]:{},b=Object.assign({},m,b);b[""]={"":a[c]};l.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(a,c,l,m,p,q,g){f?d+=f&&!p||1<f?a:c:(e+=c.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(a,c,e,f,g,d){return c?h(b,c):f?h(b,d):g?k(h(b,d),b):e?"":(new Option(h(b,d))).innerHTML}),n=q);p?--f||(g=h(b,g),e=/^f/.test(typeof g)?e+g.call(b,d,function(a){return k(a,b)}):e+k(d,g,b,n),d=""):++f})}return e}
 gform.m = function (n,t,e,r){var i,o= gform.m,a="";function f(n,t){return n=null!=(n=n[(t=t.pop?t:t.split(".")).shift()])?n:"",0 in t?f(n,t):n}t=Array.isArray(t)?t:t?[t]:[],t=r?0 in t?[]:[1]:t;for(i=0;i<t.length;i++){var s,l="",p=0,g="object"==typeof t[i]?t[i]:{};(g=Object.assign({},e,g))[""]={"":t[i]},n.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,function(n,t,e,r,i,c,u){p?l+=p&&!i||1<p?n:t:(a+=t.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(.*?)}}/g,function(n,t,e,r,i,c){return t?f(g,t):r?f(g,c):i?o(f(g,c),g):e?"":new Option(f(g,c)).innerHTML}),s=c),i?--p||(u=f(g,u),/^f/.test(typeof u)?a+=u.call(g,l,function(n){return o(n,g)}):a+=o(l,u,g,s),l=""):++p})}return a}

// gform.m = function(template, self, parent, invert) {
//   var render = gform.m
//   var output = ""
//   var i
//   //added to allow looking at opening tag instead of closing
//   var names=[]
// //   template = self[template]||template;

//   function get (ctx, path) {
//     path = path.pop ? path : _.toPath(path)
//     ctx = ctx[path.shift()]       
//     ctx = ctx != null ? ctx : ""

//     return (0 in path) ? get(ctx, path) : ctx


//     // if(path.indexOf(' this.index')!== -1)
//     // newpath = path.pop ? path : _.toPath(path)
//     // newctx = ctx[newpath.shift()]
//     // newctx = newctx != null ? newctx : ""

//     // if(newctx == ""){
//     //     try{
//     //         /*'+_.reduce(_.omit(ctx,''),function(decs,value,name){
//     //             if(typeof value == "string"){
//     //                 return decs+="var "+name+"='"+value+"';";
//     //             }
//     //             return decs+="var "+name+"="+value+';'
//     //         },'')+'*/
            
//     //         var token = 'function Run(){return ('+path.replace('if ','')+');}'
//     //         console.log(token)
//     //         eval(token);
//     //         newctx = Run.call(ctx)
//     //      }catch(e){
//     //          console.error(e)
//     //      }

//     // }
//     // return (0 in newpath) ? get(newctx, newpath) : newctx
//   }
//   self = Array.isArray(self) ? self : (self ? [self] : [])
//   self = invert ? (0 in self) ? [] : [1] : self
  
//   for (i = 0; i < self.length; i++) {
//     var childCode = ''
//     var depth = 0
//     var inverted
//     var ctx = (typeof self[i] == "object") ? self[i] : {}
//     ctx = Object.assign({}, parent, ctx)
//     ctx[""] = {"": self[i]}
    
//     template.replace(/([\s\S]*?)({{((\/)|(\^)|#)(.*?)}}|$)/g,
//       function(match, code, y, z, close, invert, name) {
//         if (!depth) {
//           output += code.replace(/{{{(.*?)}}}|{{(!?)(&?)(>?)(@?)(=?)(.*?)}}/g,
//             function(match, raw, comment, isRaw, partial, time, equals, name) {
//               return raw ? get(ctx, raw)
//                 : isRaw ? get(ctx, name)
//                 : partial ? render(get(ctx, name), ctx)
//                 : time ? function(ctx, name) {
//                     var parts = name.split('|')
//                     var date=moment(get(ctx,parts.shift()));
//                     return (parts[0] == "fromNow")?date.fromNow():date.format(parts[0])
//                 }(ctx, name)
//                 : equals ? math.eval(name, _.omit(ctx,'toString'))
//                 : !comment ? new Option(get(ctx, name)).innerHTML
//                 : ""
//             }
//           )
//           inverted = invert
//         } else {
//           childCode += depth && !close || depth > 1 ? match : code
//         }
//         if (close) {
//           if (!--depth) {
//             name = get(ctx, names[depth])
//             if (/^f/.test(typeof name)) {
//               output += name.call(ctx, childCode, function (template) {
//                 return render(template, ctx)
//               })
//             } else {
//               output += render(childCode, name, ctx, inverted) 
//             }
//             childCode = ""
//           }
//         } else {
//           names[depth] = name
//           ++depth
//         }
//       }
//     )
//   }
//   return output;
// }

gform.instances = {};

//creates multiple instances of duplicatable fields if input attributes exist for them
gform.inflate = function(atts, fieldIn, ind, list) {
    var newList = list;
    //commented this out because I am not sure what its purpose is 
    // - may need it but it breaks if you have an array following two fields with the same name
    if(fieldIn.array){
        newList = _.filter(newList,function(item){return !item.index})
    }
    //newList[ind].name >> fieldIn.name should fix above comments
    var field = _.findLast(newList, {name: fieldIn.name});

    if(!field.array && field.fields){
        if(!this.options.strict){
            _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name]|| field.owner.options.data[field.name] || {}) );
        }else{
            _.each(_.extend([],field.fields), gform.inflate.bind(this, atts[field.name] || {}) );
        }
        // field.reflow()
    }
    if(field.array) {
        var fieldCount = field.array.min||0;

        if(!this.options.strict && typeof atts[field.name] !== 'object' && typeof field.owner.options.data[field.name] == 'object'){
            atts = field.owner.options.data;
        }
        if((typeof atts[field.name] == 'object' && atts[field.name] !== null && atts[field.name].length > 1)){
            if(atts[field.name].length> fieldCount){fieldCount = atts[field.name].length}
        }
        var initialCount = _.filter(field.parent.fields,
            function(o) { return (o.name == field.name) && ('array' in o) && !!o.array;}
        ).length
        
        for(var i = initialCount; i<fieldCount; i++) {
            var newfield = gform.createField.call(this, field.parent, atts, field.el, i, _.extend({},field.item,{array:field.array}), null, null,i);
            field.parent.fields.splice(_.findIndex(field.parent.fields, {id: field.id})+1, 0, newfield)
            gform.addConditions.call(this,newfield);
            field = newfield;
        }
        // var testFunc = function(status, button){
        //     gform.toggleClass(button,'hidden', status)
        // }
        // if(field.name == "options")
        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-add'),testFunc.bind(null,(fieldCount >= (field.array.max || 5)) ))

        // _.each(field.operator.container.querySelectorAll('[data-ref="'+field.array.ref+'"] .gform-minus'),testFunc.bind(null,!(fieldCount > (field.array.min || 1) ) ))
        this.updateActions(field);
        // var fieldCount = field.operator.filter({array:{ref:field.array.ref}},1).length

        // var testFunc = function(selector,status, button){
        //     gform.toggleClass(button.querySelector(selector),'hidden', status)
        // }
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-add',(fieldCount >= (field.array.max || 5)) ))
        // _.each(field.operator.container.querySelectorAll('.gform_isArray'),testFunc.bind(null,'[data-ref="'+field.array.ref+'"] .gform-minus',!(fieldCount > (field.array.min || 1) ) ))


    }
}
gform.normalizeField = function(fieldIn,parent){
    var parent = parent || this;
    fieldIn.type = fieldIn.type || this.options.default.type || 'text';
    if(!(fieldIn.type in gform.types)){
        console.warn('Field type "'+fieldIn.type+'" not supported - using text instead');
        fieldIn.type = 'text';
    }
    //work gform.default in here
    var field = _.assignIn({
        id: gform.getUID(), 
        // type: 'text', 
        label: fieldIn.legend || fieldIn.title || (gform.types[fieldIn.type]||gform.types['text']).defaults.label || fieldIn.name,
        validate: [],
        valid: true,
        parsable:true,
        reportable:true,
        visible:true,
        editable:true,
        parent: parent,
        fillable:true,
        array:false,
        columns: this.options.columns||gform.columns,
        offset: this.options.offset||gform.offset||0,
        ischild:!(parent instanceof gform)
    }, this.opts, gform.default,this.options.default,(gform.types[fieldIn.type]||gform.types['text']).defaults, fieldIn)
    if(typeof field.value == "function" || (typeof field.value == "string" && field.value.indexOf('=') === 0))delete field.value;

    //keep required separate
    //WRONG....WRONG....WRONG....
    if(field.array){
        if(typeof field.array !== 'object'){
            field.array = {};
        }
        field.array = _.defaultsDeep(field.array,(gform.types[field.type]||{}).array,{max:5,min:1,duplicate:{enable:'auto'},remove:{enable:'auto'},append:{enable:true}})
        field.array.ref = field.array.ref || gform.getUID();
    }
    
    // field.validate.required = field.validate.required|| field.required || false;
    if(!('multiple' in field) && 'limit' in field && field.limit>1)
    {
        field.multiple = true;
    }
    field.name = field.name || (gform.renderString(fieldIn.legend || fieldIn.label || fieldIn.title)||'').toLowerCase().split(' ').join('_');

    // if(typeof field.validate.required == 'undefined'){field.validate.required = false}
    if(field.name == ''){
        field.name = field.id;
    }
    // if((typeof fieldIn.label == 'undefined' || fieldIn.label == '') && (field.label == '' || typeof field.label == 'undefined') ){fieldIn.label = field.name;}
    field.item = _.extend(fieldIn,{});
    return field;
}



gform.ajax = function(options){
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {

        if(request.readyState === 4) {
            if(request.status === 200) { 
                options.success(JSON.parse(request.responseText));
            } else {
                // console.log(request.responseText);
                if(typeof options.error == 'function'){options.error(request.responseText)};
            }
        }
    }
    request.open(options.verb || 'GET', options.path);
    request.send();
}

gform.default ={}; 
gform.options = {autoFocus:true,rootpath:''};
gform.prototype.opts = {
    actions:[{type:'cancel'},{type:'save'}],
    clear:true,
    sections:'',
    suffix: ':',
    rowClass: 'row',
    requiredText: '<span style="color:red">*</span>'
}

gform.eventBus = function(options, owner){
	this.options = options || {owner:'form',item:'field'};
    this.owner = owner||this;
    this.on = function (event, handler, ref) {
        if(typeof event != 'undefined'){

            var events = event.split(' ');
            // if (typeof this.handlers[event] !== 'object') {
            // this.handlers[event] = [];
            // }
            _.each(events,function(ref,event){
                this.handlers[event] = this.handlers[event] ||[];
                if(typeof handler == 'function'){
                    this.handlers[event].push(handler);
                    if(typeof ref == 'object'){
                        ref.push(handler);

                    }
                }else{
                    if(typeof this.owner.methods[handler] == 'function'){
                        this.handlers[event].push(this.owner.methods[handler]);
                    }
                }
            }.bind(this,ref))
        }
		return this.owner;
	}.bind(this);
    if(_.isArray(options.handlers)){
        this.handlers = {};
        _.each(options.handlers,function(item){
            if(item !== null && 'event' in item && 'handler' in item)this.on(item.event, item.handler)
        }.bind(this))
    }else{
        this.handlers = _.extend({},options.handlers);
    }

    _.each(this.handlers,function(a,b,c){
        if(typeof a == 'function'){
            c[b] = [a];
        }else if(typeof a == 'string'){
            if(typeof this[a] == 'function'){
                c[b] = [this[a]];
            }else{
              if(typeof this.owner[a] == 'function'){
                c[b] = [this.owner[a]];
              }else{
                if('methods' in this.owner && typeof this.owner.methods[a] == 'function'){
                  c[b] = [this.owner.methods[a]];
                }else{
                  if(typeof window[a] == 'function'){
                    c[b] = [window[a]];
                  }else{
                    c[b] = null;
                  }
                }
              }
            }
        }
    }.bind(this))

	this.dispatch = function (e,f,a) {
		a = a || {};
		a[this.options.owner] = this.owner;
		if(typeof f !== 'undefined'){
		    a[this.options.item] = f;
		}
        a.default = true;
        a.continue = true;
        a.preventDefault = function(){this.default = false;}.bind(a)
        a.stopPropagation = function(){this.continue = false;}.bind(a)
		var events = [];
		if(typeof e == 'string'){
		    events.push(e)
		}else{events = events.concat(e)}
		_.each(events, function(args,event){
            args.event = event;
            
            var f = function (handler) {
                if(a.continue){
                    if(typeof handler == 'function'){
                        handler.call(owner, args);
                    }
                }
            }.bind(this)
            
            _.each(this.handlers[event], f);
            _.each(this.handlers['*'], f);
		}.bind(this, a))
        return a;
        
	}.bind(this)

}

gform.mapOptions = function(optgroup, value, count,collections,waitlist){
    waitlist = waitlist||[];

    if(optgroup.owner instanceof gform){
        this.field = optgroup;
    }
    this.collections = collections;
    this.eventBus = new gform.eventBus({owner:'field',item:'option'}, this)
    this.optgroup = _.extend({},optgroup);
    count = count||0;
    var format = this.optgroup.format;

    function pArray(opts){
        return _.map(opts,function(item){
            if(typeof item === 'object' && item.type == 'optgroup'){
                item.map = new gform.mapOptions(_.extend({format:format},item),value,count,this.collections,waitlist);
                item.map.on('*',function(e){
                    this.eventBus.dispatch(e.event);
                }.bind(this))

                item.id = gform.getUID();

                gform.processConditions.call(this.field, item.edit, function(id, result,e){
                    // if(typeof e.field.el !== 'undefined'){
                    //     var op = e.field.el.querySelectorAll('[data-id="'+id+'"]');
                    //     for (var i = 0; i < op.length; i++) {
                    //         op[i].disabled = !result;
                    //     }
                    // }
                    _.find(this.optgroup.options,{id:id}).editable = result
                    this.eventBus.dispatch('change')

                }.bind(this,item.id))
                gform.processConditions.call(this.field, item.show, function(id, result,e,){
                    // if(typeof e.field.el !== 'undefined'){
                    //     var op = e.field.el.querySelectorAll('[data-id="'+id+'"]');
                    //     for (var i = 0; i < op.length; i++) {
                    //         op[i].hidden = !result;
                    //     }
                    // }
                    _.find(this.optgroup.options,{id:id}).visible = result
                    this.eventBus.dispatch('change')
                }.bind(this,item.id))

                // count += item.options.length;
                count += item.map.getoptions().length;
                return item;
            }else{
                var option = _.extend({},item)
                option.data = item;
                if(typeof item === 'string' || typeof item === 'number' || typeof item == 'boolean') {
                    option.label = option.value = item;
                }
                option.index = item.index || ""+count;

                if(typeof format !== 'undefined'){
                    option = _.reduce(['label','display','value'/*,'cleanlabel'*/],function(option,prop){
                        if(prop in format){
                            if(prop in option){
                                option.original = option.original||{};
                                option.original[prop] = option[prop]
                            }
                            option[prop] = (typeof format[prop] == 'string')? 
                                    gform.renderString(format[prop],option) 
                                : (typeof format[prop] == 'function')? 
                                    format[prop].call(this,option)
                                    : option[prop]
                        }
                        return option;
                    }.bind(this), option)
/*
                    if('label' in format){
                        if(typeof format.label == 'string'){
                            option.label = gform.renderString(format.label,option);
                          }else{
                              if(typeof format.label == 'function'){
                                  option.label = format.label.call(this.option);
                              }
                        }
                    }
                    if('display' in format){
                        if(typeof format.display == 'string'){
                            option.display = gform.renderString(format.display,option);
                          }else{
                              if(typeof format.display == 'function'){
                                  option.display = format.display.call(this.option);
                              }
                        }
                    }
                    if('value' in format){
                        if(typeof format.value == 'string'){
                          option.value = gform.renderString(format.value,option);
                        }else{
                            if(typeof format.value == 'function'){
                                option.value = format.value.call(this,option);
                            }
                        }
                    }
                    if('cleanlabel' in format){
                        if(typeof format.cleanlabel == 'string'){
                            option.label = gform.renderString(format.cleanlabel,option);
                          }else{
                              if(typeof format.cleanlabel == 'function'){
                                  option.label = format.cleanlabel.call(this.option);
                              }
                        }
                    }
                    */
                }
                if(option.value == value || (/*this.multiple && */typeof value !=='undefined' && value !== null && value.length && (value.indexOf(option.value)>=0) )) { option.selected = true;}

                count+=1;
                option.i = count;
                return option;
            }
        }.bind(this))
    }

    this.optgroup.options = this.optgroup.options || [];
    // optgroup.options = optgroup.options || optgroup.path || optgroup.action;
    
    switch(typeof this.optgroup.options){
        case 'string':
            this.optgroup.path = this.optgroup.path || this.optgroup.options;
            this.optgroup.options = []
        break;
        case 'function':
            this.optgroup.action = this.optgroup.options;
            this.optgroup.options = []
        break;
    }

    // If max is set on the field, assume a number set is desired. 
    // min defaults to 0 and the step defaults to 1.

	if('max' in this.optgroup && this.optgroup.max !== '') {
        for(var i = (this.optgroup.min || 0);i<=this.optgroup.max;i=i+(this.optgroup.step || 1)){
            this.optgroup.options.push(""+i);
        }
    }

    if(typeof this.optgroup.action == 'function'){
        this.optgroup.options = this.optgroup.options.concat(pArray.call(this,this.optgroup.action.call(this)));
    }

    if(_.isArray(this.optgroup.options)){
        this.optgroup.options = pArray.call(this,this.optgroup.options);
    }

    if(_.isString(this.optgroup.path) && this.optgroup.path){

        this.collections.on(this.optgroup.path,function(e){
            this.optgroup.options = pArray.call(this.optgroup.map, e.collection);
            if( waitlist.indexOf(e.event) >= 0){
                delete  waitlist[ waitlist.indexOf(e.event)];
            }
            this.eventBus.dispatch('change')
        }.bind(this))

        if(!this.collections.get(this.optgroup.path) || this.collections.get(this.optgroup.path) == 'waiting'){

            if( waitlist.indexOf(this.optgroup.path) == -1){
                waitlist.push(this.optgroup.path);
            }

            if(this.collections.get(this.optgroup.path)!== 'waiting'){
                this.collections.add(this.optgroup.path,'waiting')
                
                gform.ajax({path: (gform.options.rootpath||'')+this.optgroup.path, success:function(data) {
                    this.collections.update(this.optgroup.path,data)
                    if( waitlist.indexOf(this.optgroup.path) >= 0){
                        delete  waitlist[ waitlist.indexOf(this.optgroup.path)];
                    }

                    this.eventBus.dispatch('collection');
                    this.eventBus.dispatch('change',);

                }.bind(this)})
            }
        }else{
            this.optgroup.options = pArray.call(this.optgroup.map, this.collections.get(this.optgroup.path));
        }
    }



    var response = {getobject:function(){
        var temp = {};
        temp = _.map(this.optgroup.options,function(item){

            item.visible = ('visible' in item)?item.visible:true
            item.editable = ('editable' in item)?item.editable:true
            if('map' in item){
                item.options = item.map.getoptions();
                return {optgroup:{label:item.label||'',visible:item.visible,editable:item.editable,options:item.map.getoptions()}}
            }else{return item;}
        })
        return temp;
    }.bind(this),getoptions:function(search){
        var temp = [];
        _.each(this.optgroup.options,function(item){

            item.visible = ('visible' in item)?item.visible:true
            item.editable = ('editable' in item)?item.editable:true
            if('map' in item){
                temp = temp.concat(item.map.getoptions())
            }else{temp.push(item)}
        })
        if(typeof search !== 'undefined'){
            return _.find(temp,search)
        }
        return temp;
    }.bind(this),on:this.eventBus.on,handlers:this.handlers,optgroup:this.optgroup}

    Object.defineProperty(response, "waiting",{
        get: function(){
            // return true;
            return _.compact(waitlist).length>0;
        }
    });
    
    return response;
}
// gform.mapOptions.prototype.handlers = {initialize: []}
// gform.mapOptions.prototype.on = gform.prototype.sub;
// gform.mapOptions.prototype.trigger = gform.prototype.trigger;



gform.collectionManager = function(refObject){
    var collections = refObject||{};
    this.eventBus = new gform.eventBus({owner:'manager',item:'collection',handlers:{}}, this)
    
	return {
		add: function(name, data){
            collections[name] = data;
            this.eventBus.dispatch('change',name);
		}.bind(this),
		get: function(name){
            return (typeof name == 'undefined')?collections:collections[name]
		},
		update: function(name, data){
            if(typeof data !== 'undefined'){
                collections[name] = data;
            }
            this.eventBus.dispatch(name,collections[name]);
            this.eventBus.dispatch('change',name);
		}.bind(this),
		on: this.eventBus.on
	}
}


gform.collections =  new gform.collectionManager()

gform.render = function(template, options) {
    return gform.renderString(gform.stencils[template || 'text'] || gform.stencils['text'], _.extend({}, gform.stencils, options))
    
  }
  gform.create = function(text) {
   return document.createRange().createContextualFragment(text).firstChild;
  }
  gform.renderString = function(string,options) {
    return gform.m(string || '', _.extend({math:function(ms,render){
        return math.eval(render(ms), _.omit(this,'toString'))},
        moment:function(name,render) {
            var parts = name.split('|')
            var date=moment(render(parts.shift()));
            return (parts[0] == "fromNow")?date.fromNow():date.format(parts[0])
        }
    },this.methods,options))
  }
  
  // add some classes. Eg. 'nav' and 'nav header'
  gform.addClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).union(classes.split(' ')).join(' ').value();
    }
    // return elem;
  };
  gform.hasClass = function(elem, classes) {
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
       return  (elem.className.indexOf(classes) !== -1);
    }
    // return elem;
  };
  gform.removeClass = function(elem, classes){
    if(typeof classes !== 'undefined' && classes.length && typeof elem !== 'undefined'&& !!elem){
        elem.className = _.chain(elem.className).split(/[\s]+/).difference(classes.split(' ')).join(' ').value();
    }
    // return elem
  };
  gform.toggleClass = function(elem, classes, status){
    //   if(typeof status == 'undefined'){
    //       if(typeof classes == 'string'){
    //           classes = classes.split(' ');
    //       }
    //     _.each(classes,function(c){
    //         gform.toggleClass(elem,!gform.hasClass(elem,c))
    //     })
    //   }else{
        if(status){
            gform.addClass(elem,classes)
        }else{
            gform.removeClass(elem,classes)
        }
    //  }
    // return elem
  };
  
gform.VERSION = '0.0.1.2';
gform.i = 0;
gform.getUID = function() {
    return 'f' + (gform.i++);
};
gform.about = function(){
    return _.extend({version:gform.VERSION},gform.THEME,{types:_.keys(gform.types)})
};



gform.rows = {
    add:function(parent){
            var temp = gform.getUID();
            cRow = {};
            cRow.used = 0;
            cRow.ref  = document.createElement("div");
            cRow.ref.setAttribute("id", temp);
            cRow.ref.setAttribute("class", this.options.rowClass);
            cRow.ref.setAttribute("style", "margin-bottom:0;");
            parent.rows[temp] = cRow;
            parent.container.appendChild(cRow.ref);
            return cRow
    },
    remove:function(){

    }
}
gform.layout = function(field){

    if(field.columns == 0 || !field.visible){return;}
    var search = {};
    var skipAppend = false;

    if('parent' in field && !!field.parent.container){
        var container = field.parent.container;

        field.operator = field.parent;

        if(typeof field.target == 'function'){
            field.target = field.target.call(field)
        }
        if(typeof field.target == 'string'){
            var temp = field.owner.el.querySelector(field.target);
            if(typeof temp !== 'undefined' && temp !== null){
                search ={target:field.target};
                container = temp;
                field.operator = field.owner;
            }else{
                if(field.owner.options.clear){
                    search.id = field.target
                }else{
                    skipAppend = true;
                }            
            }
        }
        if(field.sibling){
            search.id = field.operator.filter({array:{ref:field.array.ref}},1)[0].row;
        }
        var cRow  = _.findLast(field.operator.rows,search);
        if(!field.sibling ||field.forceRow == true || !('id' in search) || typeof cRow == 'undefined'){
            if(typeof cRow === 'undefined' || (cRow.used + parseInt(field.columns,10) + parseInt(field.offset,10)) > field.owner.options.columns || field.forceRow == true){
                cRow = search;
                cRow.id =gform.getUID();
                cRow.used = 0;
                var template = '<div></div>';
                if(typeof gform.types[field.type].row == 'function'){
                    template = gform.types[field.type].row.call(field)||template;
                }
                cRow.ref = gform.create(template)
                cRow.ref.setAttribute("id", cRow.id);
                cRow.ref.setAttribute("class", field.owner.options.rowClass);
                cRow.ref.setAttribute("style", "margin-bottom:0;");

                if(typeof gform.types[field.type].rowSelector == 'string'){
                    cRow.appender = cRow.ref.querySelector(gform.types[field.type].rowSelector);
                }
                if(!('appender' in cRow) || cRow.appender == null){
                    cRow.appender = cRow.ref;
                }
                field.operator.rows = field.operator.rows || [];
                field.operator.rows.push(cRow);
                cRow.container = container;
                container.appendChild(cRow.ref);
            }
            cRow.used += parseInt(field.columns, 10);
            cRow.used += parseInt(field.offset, 10);
        }
        if(!skipAppend){
            cRow.appender.appendChild(field.el);
        }
        field.row = cRow.id;
    }
    
}
gform.createField = function(parent, atts, el, index, fieldIn,i,j, instance) {
    var field = gform.normalizeField.call(this,fieldIn,parent) 
    field.owner = this;
    if(typeof this.options.data == 'object' && 'data' in this.options.data){
        Object.defineProperty(field, "data", {
            get: function(){
                return this.owner.options.data.data
            },
            enumerable: true
        });
    }

    if(field.columns > this.options.columns) { field.columns = this.options.columns; }

    if(field.fillable){
        if(!this.options.strict){
            if(field.array && typeof (atts[field.name] || field.owner.options.data[field.name]) == 'object'){
                field.value =  (atts[field.name] || field.owner.options.data[field.name])[index||0] || {};
            }else{
                // field.value =  atts[field.name] || field.owner.options.data[field.name] || field.value;
                field.value = _.defaults({value:_.selectPath(atts,field.item.map||field.name)},{value:field.owner.options.data[field.name]},field).value
            }
        }else{
            if(field.array && typeof atts[field.name] == 'object'){
                field.value =  atts[field.name] || {};
            }else{
                field.value =  _.defaults({value:_.selectPath(atts,field.item.map||field.name)},field).value                
            }    
        }
    }

    field.index = field.index||instance||0;
    field = _.reduce(['label','placeholder','help','info','pre','post','value'],function(field,attr){

        if(typeof field[attr] == 'string' && field.raw !== true){
            field[attr] = gform.renderString((typeof field.item[attr] == 'string')?field.item[attr]:field[attr],field)
        }
        return field;
    },field)

    if(field.array && field.fillable && typeof atts[field.name] == 'object' && !!atts[field.name] ){
        field.value =  atts[field.name][index||0];
    }else{

        // if(field.item.value !== 0){
       
            if(typeof field.item.value === 'function' || (typeof field.item.method === 'string' && typeof field.owner.methods[field.item.method] == 'function') ) {
                //uncomment this when ready to test function as value for input
                field.valueFunc = field.owner.methods[field.item.method] || field.item.value;
                field.derivedValue = function(e) {
                    return e.initial.valueFunc.call(null, e);
                };
                // field.item.value = field.item.value;// = field.derivedValue({form:field.owner,field:field});
                field.value =  field.valueFunc.call(null, {form:this.owner,field:field,initial:field});

                field.owner.on('initialized', function(f,e) {
                    e.field = e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));
                field.owner.on('input', function(f,e) {
                    e.initial = f;
                    var oldv = f.value;
                    var newv =  f.derivedValue.call(null,e);
                    if(newv != oldv && e.default){
                        f.set.call(null,newv);
                        if(e.field !== f && e.continue){
                            e.form.trigger("input",f)
                        }
                    }

                }.bind(null,field));

            } else if(typeof field.item.value === 'string' && field.item.value.indexOf('=') === 0) {
                field.derivedValue = function() {
                    var data = this.owner.get();
                    field.formula = gform.renderString(this.item.value.substr(1),data)
                    try {
                        if(field.formula.length){
                            if(typeof math !== 'undefined'){
                                var temp  = math.eval(field.formula, data);
                                if(typeof temp == 'object' && temp.entries !== 'undefined'){
                                    temp = _.last(temp.entries);
                                    if(typeof temp._data == 'object'){
                                        temp = temp._data;
                                    }
                                }
                                if(_.isFinite(temp)){
                                    field.formula = temp.toFixed((this.item.precision || 0));
                                }else if(_.isArray(temp)){
                                    field.formula = temp;
                                }else{
                                    field.formula = '';
                                }
                            }
                        }
                    }catch(e){field.formula = '';}
                    return field.formula;
                };
                field.value = field.derivedValue.call(f,{form:field.owner,field:field});
                field.owner.on('input', function(f,e) {
                    e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));
                field.owner.on('initialized', function(f,e) {
                    e.field = e.initial = f;
                    f.set.call(null,f.derivedValue.call(null,e));
                }.bind(null,field));

            }  else {
                //may need to search deeper in atts?
                // field.value =  atts[field.name] || field.value || '';
                // if(field.fillable){field.value = _.defaults({value:atts[field.name],},field,{value:''}).value;}
                // if('format' in field && 'field' in field.format && 'value' in field.format.field){
                //     field.value = gform.renderString(field.format.field.value,field)
                // }
                //remove once format added to builder
                // if(typeof field.value == 'string')field.value = gform.renderString(field.value,field)

                
    
                if(field.fillable){field.value =  _.defaults({value:_.selectPath(atts,field.item.map||field.name)},field,{value:''}).value}

            }
        // } else {
        //     field.value = 0;
        // }
    }

    // field.label = gform.renderString(field.item.label||field.label,field);
    // field.index = ;

    field.satisfied = (field.satisfied || gform.types[field.type].satisfied).bind(field);
    field.update = gform.types[field.type].update.bind(field);
    field.destroy = gform.types[field.type].destroy.bind(field);
    field.focus = gform.types[field.type].focus.bind(field);
    field.trigger = (gform.types[field.type].trigger) ? gform.types[field.type].trigger.bind(field) : field.owner.trigger;

    // if(gform.types[field.type].trigger){
    //     field.trigger = gform.types[field.type].trigger.bind(field);
    // }else{
    //     field.trigger = field.owner.trigger;
    // }
    if(gform.types[field.type].filter){
        field.filter = gform.types[field.type].filter.bind(field);
    }
    
    field.active = function() {
        return this.parent.active() && this.editable && this.parsable && this.visible;
    }
    field.set = function(value, silent){
        //not sure we should be excluding objects - test how to allow objects
        if('fields' in this && typeof value == 'object'){value = _.pick(value,_.map(this.fields,"name"))}

        if(this.value != value || value == null){// && typeof value !== 'object') {
            if(!gform.types[this.type].set.call(this,value)){
                this.value = value;

                if(!silent){
                    this.parent.trigger(['change'],this);
                    // this.parent.trigger('change',this);this.parent.trigger('change:'+this.name,this)
                };
            };
        }
    }.bind(field)

    field.get = field.get || gform.types[field.type].get.bind(field);
    field.toString = gform.types[field.type].toString.bind(field);

    Object.defineProperty(field, "display", {
        // get: (gform.types[field.type].display||function(){
        //     return this.toString();
        // })
        get: function(){
            //(gform.types[field.type].display.bind(this)||
            if('display' in gform.types[field.type]){
                return gform.types[field.type].display.call(this)
            }
            return this.toString();
        },
        enumerable: true
    });
    Object.defineProperty(field, "sibling",{
        get: function(){
            var types = this.parent.filter({array:{ref:this.array.ref}},1);
            return (types.length && types[0] !== this );
        },
        enumerable: true
    });

    Object.defineProperty(field, "isSatisfied",{
        get: function(){
            return this.satisfied(this.get())
        },
    });
    Object.defineProperty(field, "path",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.path + '.';
                // if(this.parent.array){
                //     path += this.parent.index + '.';
                // }
            }
            path += this.name
            if(this.array){
                path+='.'+this.index
            }
            return path;
            // return _.find(field.meta,{key:key}).value;
        }
    });
    Object.defineProperty(field, "map",{
        get: function(){            
            if(this.item.map === false){return this.item.map}
            var map = '';
            if(this.ischild) {

                map = this.parent.map + '.';
            }
            map += this.name
            if(this.array){
                map+='.'+this.index;
            }

            return this.item.map || map;
        },
        // enumerable: true
    });
    Object.defineProperty(field, "source",{
        get: function(){            
            if(this.item.source === false){return this.item.source}
            var source = '';
            if(this.ischild) {
                source = this.parent.source + '.';
            }
            source += this.name
            if(this.array){
                source+='.'+this.index;
            }

            return this.item.source  || source || this.map;
        },
        // enumerable: true
    });
    Object.defineProperty(field, "relative",{
        get: function(){
            var path = '/';
            if(this.ischild) {
                path = this.parent.relative + '.';
                // if(this.parent.array){
                //     path += this.parent.index + '.';
                // }
            }
            path += this.name
            return path;
            // return _.find(field.meta,{key:key}).value;
        }
    });
    Object.defineProperty(field, "toJSON",{
        get: function(){
            return this.get();
        }
    });
    // Object.defineProperty(field, "count",{
    //     get: function(){
    //         return (this.index||0)+1;
    //     },
    //     enumerable: true
    // });
    
    field.render = (field.render || gform.types[field.type].render).bind(field);
    
    field.el = gform.types[field.type].create.call(field);
    // gform.types[field.type].setLabel.call(field)

    switch(typeof field.container){
        case "string":
            field.container =  field.el.querySelector(field.container);
            break;
        case "undefined":
            field.container =  field.el.querySelector('fieldset')|| field.el || null;
            break;
    }

    field = _.reduce(['reflow','find','filter'],function(field,prop){
        if(prop in gform.types[field.type]){
            field[prop] = gform.types[field.type][prop].bind(field);// || null;
        }
        return field;
    },field)
    // if(typeof gform.types[field.type].reflow !== 'undefined'){
    //     field.reflow = gform.types[field.type].reflow.bind(field) || null;
    // }    
    // if(typeof gform.types[field.type].find !== 'undefined'){
    //     field.find = gform.types[field.type].find.bind(field) || null;
    // }    
    // if(typeof gform.types[field.type].filter !== 'undefined'){
    //     field.filter = gform.types[field.type].filter.bind(field) || null;
    // }

            //if(!this.options.clear) field.target = field.target;//||'[name="'+field.name+'"],[data-inline="'+field.name+'"]';

    if(!field.section){// && (this.options.clear || field.isChild)){
        gform.layout.call(this,field)
    }else{
        if(field.section){
            field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
        }
    }

    gform.types[field.type].initialize.call(field);
    field.isActive = true;

    if(field.fields){
        var newatts = {};
        if(!this.options.strict){
            if(field.array && typeof (atts[field.name]|| field.owner.options.data[field.name]) == 'object'){
                newatts =  (atts[field.name]|| field.owner.options.data[field.name])[index||0] || {};
            }else{
                newatts = atts[field.name]|| (field.owner.options.data||{})[field.name] ||{};
            }
        }else{
            if(field.array && typeof atts[field.name] == 'object'){
                newatts =  atts[field.name][index||0] || {};
            }else{
                newatts = atts[field.name] ||{};
            } 
        }

        field.fields = _.map(field.fields, gform.createField.bind(this, field, newatts, null, null) );
        if(field.array) {
            _.each(_.extend([],field.fields), gform.inflate.bind(this, newatts) );
            field.reflow()
        }
        field.update();
    }

    if(_.isArray(field.item.data)){
        field.meta = field.item.data;
        _.each(field.meta,function(i){
            if(typeof i.key == 'string' && i.key !== "" && !(i.key in field)){
                Object.defineProperty(field, i.key,{
                    get: function(key,field){
                        return _.find(field.meta,{key:key}).value;
                    }.bind(null,i.key,field),
                    set: function(key,field,value){
                        _.find(field.meta,{key:key}).value = value;
                        field.parent.trigger(i.key,field);
                    }.bind(null,i.key,field),
                    configurable: true,            
                    enumerable: true
                });
            }
        })
    }

    return field;
}



gform.reflow = function(){
    if(this.isActive || (typeof this.owner !== 'undefined' && this.owner.isActive)){
        _.each(this.rows,function(cRow,i){
            if(typeof cRow !== 'undefined'){
                try{cRow.container.removeChild(cRow.ref);}catch(e){}
            }
            // delete this.rows[i];
        }.bind(this))    
        this.rows = [];
        _.each(this.fields,function(field){
            if(!field.section){// && (this.options.clear || field.isChild)){
                gform.layout.call(this,field)
            }else{
                if(field.section){
                    field.owner.el.querySelector('.'+field.owner.options.sections+'-content').appendChild(field.el);
                }
            }
        }.bind(this))
    }
}


gform.patch = function(object,patch,action){

    if(!_.isArray(patch)){
        patch = [patch];
    }
    return _.reduce(patch,function(original, task){
        if(typeof task.map !== "string"){
            return original;
        }
        var stack = _.toPath(task.map);
        object = original;

        while(stack.length>1){
            var target = stack.shift();
            if(typeof object[target] !== 'object'){
                if(isFinite(stack[0])){
                    // stack[0] = parseInt(stack[0]);
                    if(!_.isArray(object[target])){
                        object[target] = [];
                    }
                }else{
                    object[target] = {};
                }
            }

            object = object[target];
            
        }
        var target = stack.shift()
        if(task.action == "delete"){
            if(_.isArray(object)){
                object.splice(target,1);
            }else{
                delete object[target];
                object = _.compact(object);
            }
        }else{
            if(typeof task.toJSON !== "undefined"){
                object[target] = task.toJSON
            }else{
                object[target] = task.value;
            }
            
        }

        return original;

    },object||{})
  }
  
  _.mixin({
    selectPath: function(object,path){
        var obj = object;
        if(typeof object.toJSON == "function"){
            obj = object.toJSON()
        }else{
            obj = _.extend({},obj)
        }
      return _.reduce(_.toPath(path),function(i,map){
        if(typeof i == 'object' && i !== null){
          return i[map];
        }else{
          return undefined;
        }
      },obj)
    }
  });
  

