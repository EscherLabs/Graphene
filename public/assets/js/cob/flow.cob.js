Cobler.types.Workflow = function(container){
	function get() {
		item.widgetType = 'Workflow';
		return item;
	}
	var item = {
		guid: generateUUID()}
	var fields = {
		Title: {},
		'Workflow ID': {type: 'select', choices: '/api/groups/'+group_id+'/workflowinstances'},
    'User Options':{name:'user_edit',type:'checkbox'}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      // return templates['widgets_microapp'].render(temp, templates);
      return gform.renderString(`
      <h2></h2>
      {{#container}}
      <div class="panel panel-default">
      {{>widgets__header}}
        <div class="collapsible panel-body">
          <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
      </div>
      {{/container}}
      {{^container}}
        <div class="collapsible">
        </div>
      {{/container}}`,temp);

		},
		edit: berryEditor.call(this, container),
		toJSON: get,
		get: get,
		set: function (newItem) {
			$.extend(item, newItem);
		},
		initialize: function(el){
    if(typeof this.get().workflow_id == 'undefined'){return false;};
      this.fields['Workflow ID'].enabled = false;
      if(this.container.owner.options.disabled && this.get().enable_min){
          var collapsed = (Lockr.get(this.get().guid) || {collapsed:this.get().collapsed}).collapsed;
          this.set({collapsed:collapsed});
          $(el).find('.widget').toggleClass('cob-collapsed',collapsed)
      }
      $.ajax({
        url:'/api/workflowinstances/'+this.get().workflow_id,
        dataType : 'json',
        type: 'GET',
    //     data: (Lockr.get('/api/apps/instances/'+this.get().app_id+'/user_options')|| {options:{}}),
        success  : function(data){
          loaded = data;
          this.container.elementOf(this).querySelector('h2').innerText = data.workflow.name;
          this.form = new gform(
            {
              "actions": [
                {
                  "type": "save",
                  "name": "submit",
                  "label": "<i class='fa fa-check'></i> Submit"
                },
                {
                  "type": "cancel",
                  "name": "submitted",
                  "action":"submitted",
                  // "label": "<i class='fa fa-check'></i> Submit"
                }
              ],
              "fields":[
                  {"name":"container","type":"fieldset","fields":            JSON.parse(_.find(data.version.code.forms,{name:'Initial Form'}).content).fields
                }
                  ]
            }
            
            ,'.collapsible');
          this.form.on('save',function(e){
            e.field.update({label:'<i class="fa fa-spinner fa-spin"></i> Saveing',"modifiers": "btn btn-warning"})
            gform.types.fieldset.edit.call(gform.instances.f0.find('container'),false)
            gform.instances.f0.find('container').el.style.opacity = .7
            gform.types.button.edit.call(e.field,false)
          }).on('submitted',function(e){
            e.form.find('container').el.style.opacity = 1
            gform.types.fieldset.edit.call(e.form.find('container'),true)
            gform.types.button.edit.call(e.form.find('submit'),true)
            e.form.find('submit').update({label:'<i class="fa fa-check"></i> Submit',"modifiers": "btn btn-success"})
            e.form.set({container:{first_name:"hello"}})

          })
        }.bind(this)
      })
		}
	}
}