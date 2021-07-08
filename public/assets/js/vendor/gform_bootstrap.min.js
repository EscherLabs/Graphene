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
			return collections[name];
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

              this.parent.trigger(['change','input'], this,{input:this.value});
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
    return parseInt(this.el.querySelector('input[name="' + this.name + '"]').value,10);
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
gform.processConditions = function(conditions, func) {
	if (typeof conditions === 'string') {
		if(conditions === 'show' || conditions === 'edit'  || conditions === 'parse') {
			conditions = this.item[conditions];
		}
		if(typeof conditions == 'string' && conditions.indexOf('method:') == 0){
			if(typeof this.owner.methods !== 'undefined' && typeof this.owner.methods[conditions.split('method:')[1]] == 'function'){
				func.call(this, this.owner.methods[conditions.split('method:')[1]].call(null,{form:this.owner,field:this}),{form:this.owner,field:this})
			}
		}
	}
	if (typeof conditions === 'boolean') {
		func.call(this, conditions,{form:this.owner,field:this})
	}
	if (typeof conditions === 'function') {
		func.call(this, conditions.call(null,{form:this.owner,field:this}),{form:this.owner,field:this})
	}
	if (typeof conditions === 'object') {
		var callback = function(rules,func,e){
			func.call(this, gform._rules.call(this, rules),e)
		}.bind(this, conditions, func)
		gform._subscribeByName.call(this, conditions, callback)
	}
	return true;
};

gform._subscribeByName = function(conditions, callback){
    if(!(this.owner instanceof gform))return;

	for(var i in conditions) {
		if(typeof conditions[i].conditions == 'object'){
			gform._subscribeByName.call(this, conditions[i].conditions, callback)
		}else{
			var temp = this.parent.find((conditions[i].name||this.name));
			if((conditions[i].name||this.name).indexOf('/')!==0 && typeof temp !== 'undefined'){

				
				// if(typeof temp !== "undefined"){
					this.eventlist = this.eventlist||[];

					this.owner.on('change:' + temp.path, callback, this.eventlist)

				// }else{
				// 	this.owner.on('change:' + (this.parent.find(conditions[i].name||this.name)||this.parent).path||(conditions[i].name||this.name), callback)
				// }
			}else{
				this.owner.on('change:' + (conditions[i].name||this.name), callback)
			}
		}
	}
}

gform._rules = function(rules, op){
	var op = op||'and';
	return _.reduce(rules,function(result, rule){
		var s;
		if(typeof rule.conditions !== 'undefined'){
			s = gform._rules.call(this, rule.conditions,rule.op);
		}else{
			s = gform.conditions[rule.type](this, rule);
		}
		if(op == 'or'){
			return result || s;
		}else{
			return result && s;
		}
	}.bind(this),(op == 'and'))
}

gform.conditions = {
	requires: function(field, args) {
		var looker;

		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}
		return looker.satisfied();
	},
	// valid_previous: function(gform, args) {},
	not_matches: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];

		if(typeof val== "object" && val !== null && localval !== null){
			return (val.indexOf(localval) == -1);
		}else{
			return (val !== localval);
		}
	},
	test: function(field, args) {
		return args.test.call(this, field, args);
	},
	contains: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args.value;
		var targetField = looker;
		var localval = null;
		if(typeof targetField !== 'undefined'){
			if(targetField.array != false){
				localval = field.parent.find(args.name).parent.get()[args.name]
			}else{
				localval = targetField.value;
			}
		}else{
			looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
			if(typeof looker == 'undefined'){
				return false;
			}
		}

		if(typeof val == "object" && val !== null && localval !== null){
			if(typeof localval == 'object'){
				return (_.intersection(val,localval).length >0)
			}else if(typeof localval == 'string'){
				return _.some(val, function(filter) { return (localval.indexOf(filter) >= 0); });				
			}
		}else{
			return (typeof localval !== 'undefined'  && localval.indexOf(val) !== -1 )
		}
	},
	matches: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];
		if(typeof val== "object" && val !== null && localval !== null){
			return (val.indexOf(localval) !== -1);
		}else{
			return (val == localval);
		}
	},

	matches_bool: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = looker[args.attribute||'value'];
		return (val == "false" || !val) == (localval == "false" || !localval)
	},
	matches_numeric: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = parseInt(looker[args.attribute||'value']);
		if(typeof val== "object" && val !== null && localval !== null){
			return (_.map(val,function(vals){return parseInt(vals);}).indexOf(localval) !== -1);
		}else{
			return (parseInt(val) == localval);
		}
	},
	numeric: function(field, args) {
		var looker;
		if(typeof args.name !== 'undefined' && !!args.name ){
			var matches = field.parent.filter({name:args.name,parsable:true},args.depth||10);
			if(matches.length >0){
				looker = matches[0];
			}else if(field.name == args.name){
				looker = field;
			}else{
				looker = field.parent.find(args.name)||field.owner.filter({path:args.name},args.depth||10)[0];
				if(typeof looker == 'undefined'){
					return false;
				}
			}
		}else{
			looker = field;
		}

		var val = args[args.attribute||'value'];
		var localval = parseInt(looker[args.attribute||'value']);






		if(!(gform.regex.decimal.test(value) || value === '')){
			return '{{label}} must contain only numbers';
		}
		
		args.min = (typeof this.min == 'number')?this.min:(typeof args.min == 'number')?args.min:null
		if(args.min !== null && parseFloat(value) < parseFloat(args.min)){
			return '{{label}} must contain a number not less than {{args.min}} '
		}

		args.max =  (typeof this.max == 'number')?this.max:(typeof args.max == 'number')?args.max:null
		if(args.max !== null && parseFloat(value) > parseFloat(args.max)){
			return '{{label}} must contain a number not more than {{args.max}}'
		}



		if(typeof val== "object" && val !== null && localval !== null){
			return (_.map(val,function(vals){return parseInt(vals);}).indexOf(localval) !== -1);
		}else{
			return (parseInt(val) == localval);
		}


		
	}
}; gform.prototype.validate = function(force){
	this.valid = true;
	_.each(this.fields, gform.validateItem.bind(null, force))
	if(!this.valid){
		this.trigger('invalid',{errors:this.errors});
	}else{
		this.trigger('valid');
	}
	this.trigger('validation');
	
	return this.valid;
};
gform.handleError = gform.update;

gform.validateItem = function(force,item){
	var value = item.get();
	if(force || !item.valid || item.required || item.satisfied(value)){
		item.valid = true;
		item.errors = '';
		if(item.parsable && typeof item.validate === 'object'){
			var errors = gform.validation.call(item,item.validate);
			if(item.required){
				var type = (item.satisfied(item.get()) ? false : '{{label}} is required')
				if(type) {
					errors.push(gform.renderString(item.required.message || type, {label:item.label,value:value, args:item.required}));
				}
			}
			errors = _.compact(errors);
			if((typeof item.display === 'undefined') || item.visible) {
				item.valid = !errors.length;
				item.errors = errors.join('<br>')
				gform.handleError(item);
			}

		}
		
	}
	if(item.parsable){
		//validate sub fields
		if(typeof item.fields !== 'undefined'){
			_.each(item.fields, gform.validateItem.bind(null,force))
		}
	}
	if(item.errors) {
		item.owner.trigger('invalid:'+item.name, {errors:item.errors});
	}else{
		item.owner.trigger('valid:'+item.name);
	}
	item.owner.errors[item.name] = item.errors;
	item.owner.errors = _.pickBy(item.owner.errors);
	item.owner.valid = item.valid && item.owner.valid;
	// return item.valid;

};

gform.validation = function(rules, op){
	var op = op||'and';
	var value = this.get();
	var errors =  _.map(rules, function(v, it){
		if(typeof it.type == 'string'){
			if(typeof it.conditions == 'undefined' || gform._rules.call(this, it.conditions)){
					var type = v[it.type].call(this, value, it);
					if(type){	
						return gform.renderString(it.message || type, {label:this.label,value:value, args:it});
					}
			}
		}else if(typeof it.tests !== 'undefined'){
			return gform.validation.call(this,it.tests,it.op).join('<br>');
		}
	}.bind(this, gform.validations))
	if(op == 'and' || _.compact(errors).length == rules.length){
		return errors;
	}else{
		return [];
	}
}

gform.regex = {
	numeric: /^[0-9]+$/,
	decimal: /^\-?[0-9]*\.?[0-9]+$/,
	url: /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
	date: /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/,
	email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i
};

gform.validations = 
{	
	none:function(value) {
			return false;
	},

	required:function(value) {
		return (this.satisfied(value) ? false : '{{label}} is required');
	},
	unique:function(value) {
		return (this.parent.get()[this.name].indexOf(this.value)==this.index ? false : '{{label}} is a duplicate');
	},
	pattern: function(value, args) {
		var r = args.regex;
		if(typeof r == 'string'){
			if(typeof gform.regex[r] !== 'undefined'){
				r = gform.regex[r]
			}else{
				
				r = new RegExp(args.regex, args.flags);
			}
		}
		return r.test(value) || value === '' ? false : args.message;
	},
	custom: function(value, args) {

		if(typeof args.test === 'function' || (typeof args.test === 'string' && typeof this.owner.methods[args.test] == 'function') ) {
			args.test = this.owner.methods[args.test] || args.test;
		}
		// return args.test.call(this, value, args);
		args.field = this;
		args.form = this.owner;
		args.value = value
		return args.test.call(null, args);

	},
	matches:function(value, args) {
		if(typeof args.name !== 'undefined'){
			var temp = this.parent.find(args.name);
			if(typeof temp == 'undefined'){return "Matching field not defined";}
			args.label = temp.label;
			args.value = temp.get();
			return (value == args.value ? false : '"{{label}}" does not match the "{{args.label}}" field');
		}else if(typeof args.value !== 'undefined'){
			if(_.isArray(args.value)){
                return (args.value.indexOf(value) !== -1 ? false : '"{{label}}" does not match "{{args.value}}"');

            }else{
                return (value == args.value ? false : '"{{label}}" does not match "{{args.value}}"');
			}
		}
	},
	date: function(value) {
			return gform.regex.date.test(value) || value === '' ? false : '{{label}} should be in the format MM/DD/YYYY';
	},
	valid_url: function(value) {
		return gform.regex.url.test(value) || value === '' ? false : '{{label}} must contain a valid Url';
	},
	valid_email: function(value) {
			return gform.regex.email.test(value) || value === '' ? false : '{{label}} must contain a valid email address';
	},
	length:function(value, args){
		if (!gform.regex.numeric.test(args.max) && !gform.regex.numeric.test(args.min)) {
			return 'Invalid length requirement';
		}

		if(typeof args.max == 'number' && typeof args.min == 'number' && args.min == args.max){
			if(args.min == value.length){
				return false
			}else{
				return '{{label}} must be exactly '+args.min+' characters in length';
			}
		}
		if(typeof args.max == 'number' && value.length > args.max){
			return '{{label}} must not exceed '+args.max+' characters in length'
		}
		if(typeof args.min == 'number' && value.length>0 && value.length < args.min){
			return '{{label}} must be at least '+args.min+' characters in length'
		}
		return false
	},
	numeric: function(value, args) {
		if(!(gform.regex.decimal.test(value) || value === '')){
			return '{{label}} must contain only numbers';
		}
		
		args.min = (typeof this.min == 'number')?this.min:(typeof args.min == 'number')?args.min:null
		if(args.min !== null && parseFloat(value) < parseFloat(args.min)){
			return '{{label}} must contain a number not less than {{args.min}} '
		}

		args.max =  (typeof this.max == 'number')?this.max:(typeof args.max == 'number')?args.max:null
		if(args.max !== null && parseFloat(value) > parseFloat(args.max)){
			return '{{label}} must contain a number not more than {{args.max}}'
		}
		// if((typeof args.step == 'number' || typeof this.step == 'number') && parseFloat(value) > parseFloat(args.max)){
		// 	return '{{label}} must contain a number less than {{args.max}}'
		// }
	}
};gform.stencils = {
	_style:`
input + .falseLabel {
	display: inline;
}
input + .falseLabel+ .trueLabel {
	display: none;
}
input:checked + .falseLabel + .trueLabel {
	display: inline;
}
input:checked + .falseLabel {
	display: none;
}
.combobox-container .form-control[contenteditable="false"]
{
	background: #eee;
}
@media (min-width: 992px) {
	.row .col-md-Infinity:first-child{margin-left: 15px;}
	.col-md-Infinity{display:inline-block;padding:0 20px 0 0}
}

@media (max-width: 991px) {
	.row .col-md-Infinity:first-child{margin-top: 5px !important;}
	.row .col-md-Infinity{margin-left: 15px;}
}
/* The switch - the box around the slider */
.switch {
	position: relative;
	display: inline-block;
	width: 4rem;
	height: 2.2rem;
}

/* Hide default HTML checkbox */
.switch input {
	opacity: 0;
	width: 0;
	height: 0;
}

/* The slider */
.switch .slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #ccc;
	-webkit-transition: 0.2s;
	transition: 0.2s;
	border: solid 0.1rem #c8c8c8;
}

.switch .slider:before {
	position: absolute;
	content: "";
	height: 1.8rem;
	width: 1.8rem;
	left: 0.1rem;
	bottom: 0.1rem;
	background-color: white;
	-webkit-transition: 0.2s;
	transition: 0.2s;
}

input:checked + .slider {
	background-color: #1690d8;
}

input:focus + .slider {
	border-color: #1690d8;
	box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
}

input:checked + .slider:before {
	-webkit-transform: translateX(1.8rem);
	-ms-transform: translateX(1.8rem);
	transform: translateX(1.8rem);
}
input:disabled + .slider {
	background-color: #ddd;
}
/* Rounded sliders */
.switch .slider.round {
	border-radius: 2rem;
}

.switch .slider.round:before {
	border-radius: 50%;
}

.gform-info {
	position:absolute;
	right:10px;
	cursor: pointer;
	font-weight: bold;
	width: 2.2rem;
	height: 2.2rem;
	margin-right: 0.5rem;
	line-height: 2.2rem;
	color: #fff;
	text-align: center;
	background: rgba(0, 0, 0, 0.38);
	border-radius: 50%;
  }
  .gform-info:after {
	content: "?";
  }
  .gform-info:hover {
	box-shadow: 0px 0px 2px #000;
  }
  
  .info-close {
	float: right;
	cursor: pointer;
	border: solid 1px;
	border-radius: 0.5rem;
	font-weight: bold;
	padding: 0 0.7rem;
  }
  .info-close:after {
	content: "X";
  }
  #tooltip {
	background-color: #333;
	color: #fff;
	padding: 5px 10px;
	border-radius: 4px;
	font-size: 13px;
	max-width: 400px;
  }
  #tooltip .title {
	font-weight: bold;
	margin-right: 40px;
  }
  
  #tooltip hr,
  #tooltip .gform-add, #tooltip .gform-minus {
	display: none;
  }











  #arrow,
  #arrow::before {
	position: absolute;
	width: 8px;
	height: 8px;
	z-index: -1;
  }
  
  #arrow::before {
	content: "";
	transform: rotate(45deg);
	background: #333;
  }
 

  





  
  label.required:after,
	legend.required:after {
	content: "*";
	color: #f00;
	}

	html,body{
		-webkit-overflow-scrolling : touch !important;
		overflow: auto !important;
		height: 100% !important;
	}
	@media print {
		body {
			height: auto !important;
		}
	}
`,
	// _form:`<form id="{{name}}" style="overflow:hidden" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form>`,
_container: `<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{modifiers}}{{#options.horizontal}} form-horizontal{{/options.horizontal}} " {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}</form><div class="gform-footer"></div>`,
text: `<div class="row clearfix form-group {{modifiers}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
		{{#pre}}<div class="input-group col-xs-12"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
    {{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		<input {{^autocomplete}}autocomplete="off"{{/autocomplete}} class="form-control" {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}} min="{{min}}" {{#max}} max="{{max}}"{{/max}} {{#step}} step="{{step}}"{{/step}} placeholder="{{placeholder}}" type="{{elType}}{{^elType}}{{type}}{{/elType}}" name="{{name}}" id="{{name}}" value="" />
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
    {{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}

		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
output: `
<div class="row">
<div>
		{{>_label}}
		
	<div class="col-xs-12">
    <output name="{{name}}" id="{{id}}">{{{display}}}{{^display}}&nbsp;{{/display}}</output>
		{{>_addons}}
		{{>_actions}} 
		</div>
    </div>
    </div>
`,
grid: `<div class="row">
<fieldset id="{{id}}" name="{{name}}" class="row"  style="margin-bottom:20px">
    {{>_label}}
	<div class="col-xs-12">
    	<table class="table table-striped" style="margin-bottom:0">
			<thead>
				<tr>
					<th></th>
					{{#options}}
					<th><label>{{label}}</label></th>
					{{/options}}
				</tr>
			</thead>
			<tbody>
			{{#fields}}
				<tr>
					<td><label style="font-weight: 500;" for="{{id}}">{{{label}}}</label></td>
					{{#options}}
					<td>
					{{#multiple}}
						<div><input name="{{id}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}"/>
					{{/multiple}}
					{{^multiple}}
						<input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{value}}" type="radio">
					{{/multiple}}
					</td>
					{{/options}}
				</tr>
				{{/fields}}
			</tbody>
		</table>
		{{>_addons}}
		{{>_actions}}
	</div>
</fieldset>
</div>`,
switch:`<div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" style="margin: -10px 0 5px;"">
	{{/label}}
	<div>
	<span class="falseLabel">{{{options.0.label}}} </span>
		<label class="switch">
		<input name="{{name}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}} value="{{value}}" id="{{name}}" />
		<span class="slider round"></span>
		</label>
		<span class="trueLabel">{{{options.1.label}}}</span>
		</div>
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
// switch: `
// <div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
// {{>_label}}
// <div class="col-md-12" style="margin:0 0 5px">
// <label class="switch">
// <input name="{{name}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{value}}" id="{{name}}" />
// <span class="slider round"></span>
// </label>
// </div>
    
//     {{>_error}}
//     </div>
//     {{>_actions}}
// </div>`,
hidden: `<input type="hidden" name="{{name}}" value="{{value}}" />{{>_addons}}`,
    textarea: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}
		<textarea class="form-control"  {{^editable}}readonly disabled{{/editable}} {{#limit}}maxlength="{{limit}}"{{/limit}} style="width:100%;height:auto;min-height:20px" rows="{{size}}{{^size}}3{{/size}}" name="{{name}}" id="{{guid}}" placeholder="{{placeholder}}"></textarea>
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
		{{>_addons}}
			{{>_actions}}
	</div>
</div>`,

contenteditable :`<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" {{#advanced}}style="padding:0px 13px"{{/advanced}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#advanced}}style="padding:0px 13px"{{/advanced}}>
	{{/label}}

		<div class="formcontrol" style="height:auto"><div placeholder="{{placeholder}}" style="outline:none;border:solid 1px #cbd5dd;{{^unstyled}}background:#fff;padding:10px{{/unstyled}}" name="{{name}}">{{content}}{{value}}</div></div>
		{{#limit}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/limit}}
		{{>_addons}}
			{{>_actions}}
	</div>
</div>`,
    select: `<div class="row clearfix form-group {{modifiers}} {{#size}}size={{size}}{{/size}} {{#array}}isArray" data-min="{{array.min}}" data-max="{{array.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}		
	{{#limit}}{{#multiple}}<small class="count text-muted" style="display:block;text-align:right">0/{{limit}}</small>{{/multiple}}{{/limit}}

		{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}} 
		{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		{{#mapOptions.waiting}}<i class="fa fa-spinner fa-spin" style="font-size:20px;position:absolute;top:7px;left:22px;color:#666"></i>{{/mapOptions.waiting}}
			<select class="form-control test"  {{#multiple}}multiple=multiple{{/multiple}} {{#size}}size={{size}}{{/size}}  name="{{name}}{{#multiple}}[]{{/multiple}}" value="{{value}}" id="{{id}}" />
			{{#options}}
			{{^optgroup}}
			{{#visible}}<option {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}} value="{{i}}">{{{label}}}</option>{{/visible}}
			{{/optgroup}}
			{{#optgroup}}
			{{#visible}}{{#optgroup.label}}
			<optgroup label="{{label}}" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">
			{{/optgroup.label}}
					{{#options}}
					{{#visible}}<option data-id="{{optgroup.id}}" {{#selected}}selected='selected'{{/selected}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}  value="{{i}}">{{{label}}}</option>{{/visible}}
					{{/options}}
					{{#optgroup.label}}
			</optgroup>
			{{/optgroup.label}}{{/visible}}
			{{/optgroup}}
			{{/options}}
			</select>
		{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
    radio: `<div class="row clearfix form-group {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12 {{#size}}row{{/size}}" {{#size}}style="padding-top: 5px;"{{/size}}>{{/horizontal}}
	{{#horizontal}}<div class="col-md-8 {{#size}}row{{/size}}" {{#size}}style="padding-top: 5px;"{{/size}}>{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" {{#size}}style="padding-top: 5px;"{{/size}}>
	{{/label}}
	{{#limit}}{{#multiple}}<small class="count text-muted" style="display:block;text-align:left">0/{{limit}}</small>{{/multiple}}{{/limit}}

			{{#options}}
				{{^optgroup}}

					{{#multiple}}
					<div class="checkbox {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
						<label class="noselect"><input name="{{name}}_{{value}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{i}}"/> {{{label}}}</label>
					</div>
					{{/multiple}}
					{{^multiple}}
					<div class="radio {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
						<label {{^horizontal}}class="radio-inline"{{/horizontal}}><input style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="radio"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span></label>        
					</div>
					{{/multiple}}

				{{/optgroup}}
			{{#optgroup}}
			{{#optgroup.label}}
			<b class="text-muted" data-id="{{optgroup.id}} {{^editable}}disabled{{/editable}} {{^visible}}hidden{{/visible}}">{{label}}</b>
			{{/optgroup.label}}
					{{#options}}

					{{#multiple}}
					<div class="checkbox {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
						<label class="noselect"><input data-id="{{optgroup.id}}" name="{{name}}_{{value}}" type="checkbox" {{#selected}} checked {{/selected}} value="{{i}}"/> {{{label}}}</label>
					</div>
					{{/multiple}}
					{{^multiple}}
					<div class="radio {{#size}}col-md-{{size}}{{/size}}" {{#size}}style="margin-top: -5px;"{{/size}}>
						<label {{^horizontal}}class="radio-inline"{{/horizontal}}><input data-id="{{optgroup.id}}" style="margin-right: 5px;" name="{{id}}" {{#selected}} checked=selected {{/selected}}  value="{{i}}" type="radio"><span class="noselect" style="font-weight:normal">{{{label}}}{{^label}}&nbsp;{{/label}}</span></label>        
					</div>
					{{/multiple}}

					{{/options}}

			{{/optgroup}}
			{{/options}}






		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
custom_radio: `<div class="row clearfix form-group {{modifiers}} {{#multiple.duplicate}}dupable" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/multiple.duplicate}}" name="{{name}}" data-type="{{type}}">
{{>_label}}
{{#multiple.duplicate}}
<div class="duplicate add btn btn-default"><i class="fa fa-plus"></i></div>
<div class="btn btn-default remove"><i class="fa fa-minus"></i></div>
{{/multiple.duplicate}}
{{#label}}
{{^horizontal}}<div class="col-md-12">{{/horizontal}}
{{#horizontal}}<div class="col-md-8">{{/horizontal}}
{{/label}}
{{^label}}
<div class="col-md-12">
{{/label}}
	{{#pre}}<div class="input-group"><span class="input-group-addon">{{{pre}}}</span>{{/pre}}
	{{^pre}}{{#post}}<div class="input-group">{{/post}}{{/pre}}
		<div class="custom-group"  name="{{name}}" style="max-height:200px;overflow-y:scroll;">
		{{#options}}
			<a href="javascript:void(0);" class="{{^selected}} {{defaultClass}}{{/selected}}{{#selected}} {{selectedClass}}{{/selected}}" data-value="{{value}}">
				{{{label}}}
			</a>&nbsp;
		{{/options}}
		</div>
	{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
	{{^post}}{{#pre}}</div>{{/pre}}{{/post}}
	{{>_addons}}
	{{>_actions}}
</div>
</div>`,
fieldset_array:'<div><div class="col-xs-12">{{#array}}{{#append.enable}}<button data-ref="{{ref}}" data-parent="{{parent.id}}" class="gform-append btn btn-info btn-xs pull-right">{{{append.label}}}{{^append.label}}<i class="fa fa-plus"></i> Add {{{label}}}{{/append.label}}</button>{{/append.enable}}{{/array}}<legend>{{label}}</legend><div class="list-group gform-template_row"></div></div></div>',

_fieldset: `<div class="row"><fieldset data-type="fieldset" style="" name="{{name}}" id="{{id}}" class="{{modifiers}}" >
{{#array}}
<div data-name="{{name}}" data-ref="{{ref}}" class="btn-group hidden-print actions">
	{{#remove.enable}}
	<div data-id="{{id}}" class="btn btn-white gform-minus">{{{remove.label}}}{{^remove.label}}<i data-id="{{id}}"  class="fa fa-minus text-danger"></i>{{/remove.label}}</div>
	{{/remove.enable}}
	{{#duplicate.enable}}
	<div data-id="{{id}}" class="gform-add btn btn-white">{{{duplicate.label}}}{{^duplicate.label}}<i data-id="{{id}}"  class="fa fa-plus text-success"></i>{{/duplicate.label}}</div>
	{{/duplicate.enable}}
</div>
{{^section}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/section}}
{{/array}}
{{^section}}{{#label}}<legend>{{{label}}}</legend>{{/label}}{{/section}}
<div style="position:relative;top:-20px">{{>_addons}}</div>
</fieldset></div>`,
	_actions: `{{#array}}
	<div data-name="{{name}}" data-ref="{{ref}}" data-parent="{{parent.id}}" class="btn-group hidden-print actions pull-right">
	{{#remove.enable}}
	<div data-id="{{id}}" class="btn btn-white gform-minus">{{{remove.label}}}{{^remove.label}}<i class="fa fa-minus text-danger"></i>{{/remove.label}}</div>
	{{/remove.enable}}
	{{#duplicate.enable}}
	<div data-id="{{id}}" class="gform-add btn btn-white">{{{duplicate.label}}}{{^duplicate.label}}<i class="fa fa-plus text-success"></i>{{/duplicate.label}}</div>
	{{/duplicate.enable}}

	</div>
	{{/array}}`,
	_tooltip:`<div id="tooltip" role="tooltip">
<span class="info-close"></span>
<div class="tooltip-body"></div>
<div id="arrow" data-popper-arrow></div>
</div>`,
_info:`<div>
<div class="title">More&nbsp;Information</div>
<hr>
  <div>{{info}}</div>
</div> `,
	_label: `
	{{^hideLabel}}
    {{#label}}
	<label for="{{name}}" {{^horizontal}}style="text-align:left"{{/horizontal}} class="control-label {{^horizontal}}col-xs-12{{/horizontal}}{{#horizontal}}col-md-4{{/horizontal}}">
  {{{label}}}{{#required}}{{{requiredText}}}{{/required}}{{suffix}}
</label>{{/label}}
{{#info}}<b class="gform-info" data-id="{{id}}"></b>{{/info}}
{{/hideLabel}}
    `,
    _addons:`<span class="help-inline"> {{{help}}}</span>
<span class="font-xs text-danger" style="display:block;"></span>`,
    checkbox:`<div class="row clearfix {{modifiers}} {{#array}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/array}}" data-type="{{type}}">
	{{>_label}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12" style="margin:0 0 5px">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8" style="margin:0 0 15px">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12" style="margin: -10px 0 5px;"">
	{{/label}}
		<div class="checkbox">
			<label class="{{alt-display}}" for="{{id}}">
				<input name="{{name}}" id="{{id}}" type="checkbox" {{^editable}}disabled{{/editable}} {{#options.1.selected}}checked=checked{{/options.1.selected}}>{{^format.display}}<span class="falseLabel">{{{options.0.label}}}</span><span class="trueLabel">{{{options.1.label}}}</span>{{/format.display}}{{format.display}}&nbsp;
			</label>
		</div>
	{{#post}}<span class="input-group-addon">{{{post}}}</span></div>{{/post}}
		{{>_addons}}
		{{>_actions}}
	</div>
</div>`,
scale:`
<div class="row clearfix form-group {{modifiers}} {{#multiple.duplicate}}isArray" data-min="{{multiple.min}}" data-max="{{multiple.max}}{{/multiple.duplicate}}" name="{{name}}" data-type="{{type}}">
	{{>_label}}
	{{>_actions}}
	{{#label}}
	{{^horizontal}}<div class="col-md-12">{{/horizontal}}
	{{#horizontal}}<div class="col-md-8">{{/horizontal}}
	{{/label}}
	{{^label}}
	<div class="col-md-12">
	{{/label}}
			<table class="table table-striped">
				<thead>
				<tr>
					{{#format.low}}<th></th>{{/format.low}}
					{{#options}}
					<th><label for="{{name}}_{{i}}">{{{label}}}</label></th>
					{{/options}}
					{{#format.high}}<th></th>{{/format.high}}
				</tr>
				</thead>
				<tbody>
				<tr>
					{{#format.low}}<td><label style="font-weight: 500;" for="{{name}}_1">{{{format.low}}}</label></td>{{/format.low}}
					{{#options}}
					<td>
						<input data-label="{{label}}" id="{{name}}_{{i}}" name="{{id}}" value="{{i}}" {{^editable}}readonly disabled{{/editable}} type="radio" {{#selected}}checked=checked{{/selected}} >
					</td>
					{{/options}}
					{{#format.high}}<td><label style="font-weight: 500;" for="{{name}}_{{options.length}}">{{{format.high}}}</label></td>{{/format.high}}
				</tr>
		</tbody>
			</table>
		{{>_addons}}
	</div>
</div>`,
button:`<button class="btn btn-default hidden-print {{modifiers}}" type="button" style="margin:0 15px">{{{label}}}</button>`,
tab_container: `
<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>{{^legendTarget}}{{#legend}}<legend>{{{legend}}}</legend>{{/legend}}{{/legendTarget}}    
	<ul class="nav nav-tabs" style="margin-bottom:15px">
		{{#fields}}
			{{#section}}
			<li {{^index}}class="active"{{/index}}>
				<a href="#tabs{{id}}" data-toggle="tab">{{{legend}}}</a>
			</li>
			{{/section}}		
		{{/fields}}
	</ul></form>
	</form><div class="gform-footer"></div>`,
tab_fieldset: `{{#section}}<div class="tab-pane {{^index}}active{{/index}} " id="tabs{{id}}">{{/section}}{{>_fieldset}}{{#section}}</div>{{/section}}`,
modal_container:`<div class="modal fade gform {{modifiers}} {{#options.horizontal}} form-horizontal{{/options.horizontal}}" id="myModal" name="modal_{{name}}" data-update="{{update}}" data-append="{{append}}" {{#focus}}tabindex="-1"{{/focus}} role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header {{modal.header_class}}">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h4 class="modal-title" id="myModalLabel">{{#icon}}<i class="fa fa-{{icon}}"></i> {{/icon}}{{{title}}}{{{legend}}}&nbsp;</h4>
			</div>
			<div class="modal-body">
				{{{body}}}
				{{^sections}}
				<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}></form>
				{{/sections}}
				{{#sections}}
				<form id="{{name}}" {{^autocomplete}}autocomplete="false"{{/autocomplete}} name="{{name}}" class="gform tab-content {{#options.horizontal}} smart-form-horizontal form-horizontal{{/options.horizontal}} {{modifiers}}" {{#action}}action="{{action}}"{{/action}} onsubmit="return false;" {{#method}}method="{{method}}"{{/method}}>   
				<ul class="nav nav-tabs" style="margin-bottom:15px">
					{{#fields}}
					{{#section}}
					<li {{^index}}class="active"{{/index}}>
						<a href="#tabs{{id}}" data-toggle="tab">{{{legend}}}</a>
					</li>
					{{/section}}		
					{{/fields}}
				</ul></form>
				{{/sections}}
				
			</div>
			<div class="modal-footer gform-footer">
				{{{footer}}}
			</div>
		</div>
	</div>
</div>
`,
modal_fieldset:`{{>_fieldset}}`,
template:'<div><div class="col-xs-12">{{#array}}{{#append.enable}}<button data-ref="{{ref}}" data-parent="{{parent.id}}" class="gform-append btn btn-info btn-xs pull-right">{{{append.label}}}{{^append.label}}<i class="fa fa-plus"></i> Add {{{label}}}{{/append.label}}</button>{{/append.enable}}{{/array}}<legend>{{label}}</legend><div class="list-group gform-template_row"></div></div></div>',

template_item:`<div class="list-group-item"><div style="position:relative;top: -6px;">{{>_actions}}</div><div class="gform-template_container">{{{format.template}}}{{^format.template}}{{{value}}}{{/format.template}}</div></div>`,
child_modal_footer:`<button type="button" class="btn btn-danger hidden-print pull-left gform-minus"><i class="fa fa-times"></i> Delete</button><button class="btn btn-default hidden-print done" style="margin:0 15px"><i class="fa fa-check"></i> Done</button>`,
table:'<div><div class="col-xs-12" style="overflow:scroll"><legend>{{label}}</legend>{{#array}}{{#append.enable}}<button type="button" data-ref="{{ref}}" data-parent="{{parent.id}}" class="gform-append btn btn-info btn-xs" style="top: -10px;position: relative;">{{{append.label}}}{{^append.label}}<i class="fa fa-plus"></i> Add {{{label}}}{{/append.label}}</button>{{/append.enable}}{{/array}}<table class="table table-bordered table-striped table-hover table-fixed {{#array.sortable.enable}}sortable{{/array.sortable.enable}}"><thead>{{#labels}}<th>{{{label}}}</th>{{/labels}}</thead><tbody></tbody></table></div></div>'
};


gform.columns = 12;

gform.columnClasses = _.map(new Array(13),function(item, i){return 'col-xs-12 col-sm-'+i})
gform.offsetClasses = _.map(new Array(13),function(item, i){return 'col-xs-offset-0 col-sm-offset-'+i})
gform.default.inline = true;
gform.default.columns = 12;

gform.prototype.opts.suffix = "";

gform.handleError = function(field){
	var error_container = field.el.querySelector('.font-xs.text-danger')

	if(!field.valid){
		field.el.classList.add('has-error');
		if(!!error_container)error_container.innerHTML = field.errors;
	}else{
		field.el.classList.remove('has-error');
		// field.el.classList.add('has-success')
		// field.el.querySelector('.font-xs.text-danger').innerHTML = '';
		if(!!error_container)error_container.innerHTML = '';

	}
}

gform.types['reset']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Reset",
	"action":"reset",
	"modifiers": "btn btn-default"}});
gform.types['cancel']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Cancel",
	"action":"cancel",
	"modifiers": "btn btn-danger"}});
gform.types['save']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-check\"></i> Save",
	"action":"save",
	"modifiers": "btn btn-success"}});
gform.types['clear']   = _.defaultsDeep({toString: function(){return ''}},gform.types['button'], {defaults:{
	"label":"<i class=\"fa fa-times\"></i> Clear",
	"action":"clear",
	"modifiers": "btn btn-warning"}});

gform.types['color'] = _.extend({}, gform.types['input'], {
	defaults: {
		pre: '<i style="display: block;width:20px;height:20px;margin: 0 -5px;background-color:{{value}}"></i>' ,
		elType: 'text',
		value:"#000000"
	},
	toString: function(name,display){
		this.value = this.get();//shouldn't need this here - but we do for now
		if(!display){
			return '<dt>'+this.label+'</dt> <dd><div style="white-space:nowrap"><span style="width:20px;height:20px;display: inline-block;top: 5px;position: relative;background:'+this.value+';"></span> '+(this.value||'<span class="text-muted">(empty)</span>')+'</div></dd><hr>'
		}else{
              return this.value
		}
		  
},
  initialize: function(){
	// this.onchangeEvent = function(){
	// 	this.value = this.get();
	// 	this.parent.trigger(['change','input'], this,{input:this.value});
	// }.bind(this)


	this.onchangeEvent = function(input){
		//   this.input = input;
		  this.value = this.get();
		  if(this.el.querySelector('.count') != null){
			var text = this.value.length;
			if(this.limit>1){text+='/'+this.limit;}
			this.el.querySelector('.count').innerHTML = text;
		  }
		//   this.update({value:this.get()},true);
		//   gform.types[this.type].focus.call(this)
			gform.types[this.type].setup.call(this);
		  this.owner.trigger('change', this,{input:this.value});

		  if(input){
			this.owner.trigger('input', this,{input:this.value});
		  }
	  }.bind(this)


	  this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
	  this.el.querySelector('.input-group-addon i').addEventListener('click', function(){this.focus()}.bind(this));

	$(this.el.querySelector('input[name="' + this.name + '"]')).attr('type','text');
		this.el.querySelector('.input-group-addon i').style.backgroundColor = this.get()
	$(this.el.querySelector('input[name="' + this.name + '"]')).colorpicker({format: 'hex',container:$(this.el).find('.input-group')}).on('changeColor', function(ev){
		this.el.querySelector('.input-group-addon i').style.backgroundColor = this.get()
		this.parent.trigger('change',this);
		this.parent.trigger('input',this);
	}.bind(this));
	gform.types[this.type].setLabel.call(this);

  }
});

gform.types['contentEditable'] = gform.types['summernote'] = _.extend({}, gform.types['input'], {
	render: function(){
        //   return gform.render(this.type, this);
          return gform.render('contenteditable', this).split('value=""').join('value="'+_.escape(this.value)+'"')
      },
      set: function(value) {
        //   this.el.querySelector('textarea[name="' + this.name + '"]').value = value;


          	// if(typeof this.lastSaved === 'undefined'){
			// 	this.lastSaved = value;
			// }
			// this.editor.setContent(value)
			this.$el.summernote('code', value)
			// this.value = value;
			// this.$el.html(value)

			// return this.$el;
      },
      get: function() {
        //   return this.el.querySelector('textarea[name="' + this.name + '"]').value;
        return this.$el.summernote('code')

      },
		initialize: function() {
			this.$el = $(this.el).find('.formcontrol > div');
			this.$el.off();
			if(this.onchange !== undefined) {
				this.$el.on('input', this.onchange);
			}
			this.$el.summernote({
				disableDragAndDrop: true,
		    	dialogsInBody: true,
				toolbar: this.item.toolbar||[
					// [groupName, [list of button]]
					['style', ['bold', 'italic', 'underline', 'clear']],
			        ['link', ['linkDialogShow', 'unlink']],
					['font', ['strikethrough', 'superscript', 'subscript']],
					['fontsize', ['fontsize']],
					['color', ['color']],
					['para', ['ul', 'ol', 'paragraph']],
					['height', ['height']],
					['view', ['fullscreen']]
				]
			});
            gform.types[this.type].set.call(this,this.value, true)

			this.$el.on('summernote.change', function(){
				this.owner.trigger('change',this);

				this.owner.trigger('input',this);
			}.bind(this)
	  );
	  gform.types[this.type].setLabel.call(this);

		},satisfied: function(value){
			this.value = this.get()
			return (typeof this.value !== 'undefined' && this.value !== null && this.value !== '' && this.value !== "<p><br></p>");
		},	
        destroy: function() {
            this.$el.summernote('destroy');
            if(this.$el){
                this.$el.off();
            }
        }

  });


  $(document).on('focusin', function(e) {
    if ($(e.target).closest(".note-editable").length) {
        e.stopImmediatePropagation();
			
    }
});
$(document).on('click', function(e) {
    if ($(e.target).hasClass(".note-editor")) {
        e.stopImmediatePropagation();

			$(e.target).find('.open').removeClass('open')
    }
});



gform.types['email'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-envelope"></i>', validate: [{ type:'valid_email' }]}});
gform.types['url'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-link"></i>', validate: [{ type:'valid_url' }]}});
gform.types['tel'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-phone"></i>', placeholder: '+1'}});
gform.types['password'] = _.extend({}, gform.types['input'], {defaults:{pre: '<i class="fa fa-lock"></i>'}});
gform.types['address'] = _.extend({}, gform.types['input'], gform.types['section'], {
    defaults:{fields:[
        {type:"text",name:'street',label:"Street Address", validate:[{type:"length",max:"255"}]},
        {type:"text",name:'line2',label:"Address line 2", validate:[{type:"length",max:"150"}]},
        {type:"text",name:'city',label:"City", validate:[{type:"length",max:"255"}],columns:6},
        {type:"text",name:'state',label:"State/Province/Region", validate:[{type:"length",max:"255"}],columns:6},//,display:[{type:"not_matches",name:"country",value:"US"}]},
        // {type:"combo",name:'state',options:'../data/states.json',format:{label:'{{name}}'},label:"State/Province/Region",columns:6},
        {type:"text",name:'zip',label:"Postal/Zip Code", validate:[{type:"length",max:"15"}],columns:6},
        {type:"select",name:'country',options:'../data/countries.json',format:{label:'{{name}}',value:'{{code}}'},label:"Country", validate:[{type:"length",max:"15"}],columns:6}
    ]
}});






gform.THEME = {'bootstrap':'0.0.4.2'}

gform.types['datetime'] = _.extend({}, gform.types['input'], {
  defaults:{
	format:{input: "MM/DD/YYYY h:mm A"},
	elType:'text'
  },
  initialize: function(){
	this.onchangeEvent = function(){
		this.value = this.get();
		this.parent.trigger(['change','input'], this,{input:this.value});
	}.bind(this)
	
	// this.el.addEventListener('input', this.onchangeEvent.bind(null,true));
	// this.el.addEventListener('change', this.onchangeEvent.bind(null));
	var $el = $(this.el.querySelector('input[name="' + this.name + '"]'));

		// $el.attr('type','text');
	  $el.datetimepicker({format: this.format.input})
	//   $el.data("DateTimePicker").minDate(moment("1/1/1900"));
	  $el.on("dp.change", this.onchangeEvent.bind(null,true));
	  gform.types[this.type].setLabel.call(this);

  }
});
gform.types['date'] = _.extend({},gform.types['datetime'], {
	defaults:{
	  format:{input: "MM/DD/YYYY"},
		elType:'text'
	},
})
gform.types['time']= _.extend({}, gform.types['datetime'], {
	defaults:{
		format:{input: "h:mm A"},
		elType:'text'
	}
})
gform.prototype.modalDelay = 475;
gform.prototype.modal = function(data){
	// var el = this.modalEl||this.el;

	// if(!document.body.contains(el)){
    //     document.body.appendChild(el);
    //     this.modalEl.querySelector('.close').addEventListener('click', function(){
    //         this.modal('hide');
    //         (this.owner||this).trigger("modal:close");
    //     }.bind(this));
    // }



	// $(this.modalEl||this.el).modal(data)
	// return this;


	var el = this.modalEl||this.el;
    if(!document.body.contains(el)){
        document.body.appendChild(el);
        el.querySelector('.close').addEventListener('click', function(){
			// gform.prototype.modal.call(this,'hide');
			(this.owner||this).trigger('close',this);
        }.bind(this));
    }

    switch(data){
        case "hide":
            // if(typeof this.type !== 'undefined'){
            //     this.owner.trigger("close_child",this);
            // }else{
            //     this.trigger("close",this);
            // }
        default:
            $(el).modal(data)
    }
	// $(this.el).modal(data)
	$(this.el).on('hidden.bs.modal', function () {
		this.trigger("cancel",this);
	}.bind(this))

	return this;
}
document.body.appendChild(gform.create('<style>'+gform.render('_style',{},'all')+'</style>'));gform.stencils.smallcombo = `
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