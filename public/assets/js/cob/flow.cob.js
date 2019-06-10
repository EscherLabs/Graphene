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
    // 'User Options':{name:'user_edit',type:'checkbox'}
	}
	return {
    container:container,
		fields: fields,
		render: function() {
      var temp = get();
      temp.workflow_admin = group_admin;
      // this.id = gform.getUID();
      // temp.id = this.id;
      // return templates['widgets_microapp'].render(temp, templates);
      return gform.renderString(`
      <div class="btn-group pull-right slice-actions parent-hover">
	{{#enable_min}}<span class="btn btn-default btn-sm min-item fa fa-toggle" data-event="min" title="Minimize"></span>{{/enable_min}}
</div>

      {{#container}}
      <div class="panel panel-default">
      <div class="panel-heading{{^titlebar}} hide{{/titlebar}}" style="position:relative">
	<h3 class="panel-title">{{title}}{{^title}}{{{widgetType}}}{{/title}}</h3>
</div>
      {{>widgets__header}}
        <div class="collapsible panel-body">
        
        <h3 class="form-title" style="margin-top: 0;padding-bottom: 5px;border-bottom: solid 1px #eee;"></h3>
        <div class="g_{{guid}}">
        <center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:40px auto;color:#eee"></i></center>
        </div>
        </div>
      </div>
      {{/container}}
      {{^container}}

        <div class="collapsible">
        <h3 class="form-title" style="margin-top: 0;padding-bottom: 5px;border-bottom: solid 1px #eee;"></h3>
        <div class="g_{{guid}}"></div>
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
          this.container.elementOf(this).querySelector('.form-title').innerText = data.workflow.name;
          // debugger;
          this.form = new gform(
            {
              "data":{},
              "actions": [
                {
                  "type": "save",
                  "name": "submit",
                  "label": "<i class='fa fa-check'></i> Submit"
                },
                {
                  "type": "cancel",
                  "name": "submitted",
                  "action":"canceled",
                  // "label": "<i class='fa fa-check'></i> Submit"
                }
              ],
              "fields":[
                  {"name":"_state","type":"fieldset","fields":            JSON.parse(_.find(data.version.code.forms,{name:'Initial Form'}).content).fields
                }
                  ]
            }
            
            ,'.g_'+get().guid);
          this.form.on('save',function(e){
            e.field.update({label:'<i class="fa fa-spinner fa-spin"></i> Saveing',"modifiers": "btn btn-warning"})
            gform.types.fieldset.edit.call(e.form.find('_state'),false)
            e.form.find('_state').el.style.opacity = .7
            gform.types.button.edit.call(e.field,false)

            $.ajax({
              url:'/api/workflow/'+group_id+'/'+this.get().workflow_id,
              dataType : 'json',
              type: 'POST',
              data: e.form.toJSON(),
              success  : function(data){
                e.form.find('_state').el.style.opacity = 1
                e.form.destroy();
                document.querySelector('.g_'+this.get().guid).innerHTML = gform.renderString('Thanks for your submission! <br> Track your results <a href="/api/workflow/{{id}}">here</a>',data)
                // gform.types.fieldset.edit.call(e.form.find('_state'),true)
                // gform.types.button.edit.call(e.form.find('submit'),true)
                // e.form.find('submit').update({label:'<i class="fa fa-check"></i> Submit',"modifiers": "btn btn-success"})
              }.bind(this)
            })

          }.bind(this)).on('canceled',function(e){
            e.form.trigger('clear')
          })
          // .on('submitted',function(e){
          //   e.form.find('_state').el.style.opacity = 1
          //   gform.types.fieldset.edit.call(e.form.find('_state'),true)
          //   gform.types.button.edit.call(e.form.find('submit'),true)
          //   e.form.find('submit').update({label:'<i class="fa fa-check"></i> Submit',"modifiers": "btn btn-success"})
          //   e.form.set({_state:{first_name:"hello"}})
          // })
        }.bind(this)
      })
		}
	}
}