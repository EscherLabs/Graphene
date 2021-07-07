gform.prototype.validate = function(force){
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
	// debugger;
	var value = item.get();
	if(force || !item.valid || item.required || item.satisfied(value)){
		item.valid = true;
		item.errors = '';
		if(item.parsable && typeof item.validate === 'object'){
			var errors = [];
			if(item.required){
				var type = (item.satisfied(item.get()) ? false : '{{label}} is required')
				if(type) {
					errors.push(gform.renderString(item.required.message || type, {label:item.label,value:value, args:item.required}));
				}
			}
			if(!errors.length){
				errors = gform.validation.call(item,item.validate);
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
	decimal: /^\-?[0-9]*\.?[0-9]*$/,
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
		
		args.min = (typeof parseFloat(this.min) == 'number')?parseFloat(this.min):(typeof parseFloat(args.min) == 'number')?parseFloat(args.min):null
		if(args.min !== null && parseFloat(value) < parseFloat(args.min)){
			return '{{label}} must contain a number not less than {{args.min}} '
		}

		args.max =  (typeof parseFloat(this.max) == 'number')?parseFloat(this.max):(typeof parseFloat(args.max) == 'number')?parseFloat(this.max):null
		if(args.max !== null && parseFloat(value) > parseFloat(args.max)){
			return '{{label}} must contain a number not more than {{args.max}}'
		}
		// if((typeof args.step == 'number' || typeof this.step == 'number') && parseFloat(value) > parseFloat(args.max)){
		// 	return '{{label}} must contain a number less than {{args.max}}'
		// }
	}
};