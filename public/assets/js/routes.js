    var fieldsets= {
      'users':[
        {label: 'Name', name:'name', required: true},
        {label: 'Email', name:'email', type: 'email', required: true}
      ],
      'apps':[
        {label: 'Name', name:'name', required: true},
        {name:'code', label: 'Code', showColumn:false, type: 'fieldset', fields:[
          {label: 'CSS', name:'css'},
          // {label:'Template',parsable:false,name:'tm', type:'fieldset',fields:[]},
          // {"multiple": {"duplicate": true},label: false, name: 'template', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content'}]},
          // {"multiple": {"duplicate": true},label: 'Script', name: 'script', type: 'fieldset', fields:[{label: 'Name',name: 'name'},{label: 'Content', name: 'content'}]},
          // {"multiple": {"duplicate": true},label: 'Resource', name: 'sources', type: 'fieldset', fields:[{label: 'Name',name: 'name'}]}
        ]}
      ],
      'appinstances':[
        {label: 'Name', name:'name', required: true},        
        {label: 'Slug', name:'slug', required: true}
      ],
      'groups':[
        {label: 'Name', name:'name', required: true},        
        {label: 'Slug', name:'slug', required: true}
      ],
      'endpoints':[
        {label: 'Name', name:'name', required: true},
        {label: 'Type', name:'type', required: true},
        {label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups'}
      ],
      'sites':[
        {label: 'Name', name:'domain', required: true},
        {label: 'Theme', name:'theme'}
      ]

    }

      var api = '/api/'+route
    
      $.ajax({
        url: api,
        success: function(data){
          $('#content').html('<h1 class="page-header">'+route+'</h1><div class="row "><div id="table"></div></div>');		
          fieldsets[route].push({name: 'id', type:'hidden'});
          bt = new berryTable({
            entries: [25, 50, 100],
            count: 25,
            autoSize: 10,
            container: '#table', 
            schema: fieldsets[route], 
            data: data,
            berry: {flatten: false},
            events:[
              {'name': 'go', 'label': '<i class="fa fa-cogs"></i> Manage', callback: function(model){
                window.location.href = '/admin/'+route+'/'+model.attributes.id
              }}
            ],
            // columns:['name'],
            click: function(model){window.location.href = '/app/'+model.attributes.slug},
            add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes});},
            edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes});},
            delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE'});}
          })
        }
      })