vue_v0001 = options => {
		partials = _.reduce(options.config.templates,(partials,_partial)=>{
			partials[_partial.name] = _partial.content;
			return partials
		},{})


	// if(typeof component == 'undefined'){
	// 	component = Ractive.extend(
	// 		{data: options.methods,css:options.config.css, template: partials[options.template || 'Main']|| partials['Main'] || partials['main'], partials: partials}
	// 	)
	// }
	// ractive = component({data: options.data, el: options.$el[0], on: options.methods});
	options.$el.html(partials[options.template || 'Main']|| partials['Main'] || partials['main'])
	//   var app = new Vue()
App =Vue.createApp(
	{
		data() {
		  return {
			counter: 0
		  }
		},  mounted() {
			setInterval(() => {
			  this.counter++
			}, 1000)
		  }
	  }
	).mount('.collapsible.panel-body')


return {App:App}
}
