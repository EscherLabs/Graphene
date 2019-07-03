
var reset = function(){
  if(typeof Berries.modal !== 'undefined'){
    Berries.modal.destroy();
  }
  mymodal.ref.find('.modal-body').html('<center style="height:300px"><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>');
}
var selectGroup = function(e){
  mymodal.ref.find('.modal-body').berry({
    attributes:instanceData,
      name:"modal", fields:[
        {label: 'Group', name:'group_id', required: true, type:'select',satisfied:function(value){
          return (this.toJSON() !== "")
        },value:instanceData.group_id, choices: '/api/groups?limit=true', default:{"label":"Choose One","value":""}},
      ],actions:false
    })
  // myForm = new gform({name:"modal", attributes: instanceData, fields:[
  //   {label: 'Group', name:'group_id', required: true, type:'select',format:{label:"{{name}}",value:"id"},satisfied:function(value){
  //     return (this.toJSON() !== "")
  //   },value:instanceData.group_id, options: '/api/groups?limit=true', placeholder:{"name":"Choose One","id":""}}
  // ], actions: false},mymodal.ref.find('.modal-body')[0]);
}
var selectComposite = function(){
  $.ajax({
    url: '/api/groups/'+instanceData.group_id+'/composites',
    success: function(data) {
      if(data.length){
        composites = data;
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Limit Composite Groups', name: 'limit', type: 'checkbox', show:  {matches:{name:'public', value: 0},test: function(form){return composites.length >0;}} },
            {label: 'Composites', legend: 'Composites', name:'composites', type:'fieldset', 'show': {
                matches: {
                  name: 'limit',
                  value: true
                }
              },fields:[
                {label: false, multiple:{duplicate:true}, type:'fieldset', toArray:true, name: 'composite', fields:[
                  {label: false, name: 'groups', type: 'select', options: composites}
                ]}
              ],
              template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
            }
          ],actions:false
        })
      }else{
        mymodal.ref.find('.modal-body').html('There are no Composites for this group. This step is complete.');

      }
    }
  })
}
instanceData = {};
if(typeof group_id !== 'undefined'){
  instanceData.group_id = group_id;
}
if(typeof group !== 'undefined'){
  instanceData.group_id = group.id;
}
if(typeof loaded !== 'undefined' && typeof loaded.app !== 'undefined' ){
  instanceData.app_id = loaded.app.id;
}
var createEngine = function(e){
  // $('.btn-new').click();
  if(typeof Berries.modal !== 'undefined'){
      Berries.modal.destroy();
  }

  var options =  {
    init: 'start',
    complete:"Successfully Created",
    legend:'<span class="btn btn-default btn-sm" data-action="cancel"><i class="fa fa-th"></i></span> Create New',
    transitions: [
      //page
      { name: 'createpage',     from: '*',  to: 'pagegroup' },
      { name: 'next',     from: 'page',  to: 'pagecomposite' },
      { name: 'next',     from: 'pagegroup',  to: 'page' },
      { name: 'submit',   from: 'pagecomposite', to: 'submit'  },
      { name: 'previous', from: 'page', to: 'pagegroup'  },
      { name: 'previous', from: 'pagecomposite', to: 'page' },
      { name: 'complete', from: 'success', to: 'complete'  },
      //endpoint
      { name: 'createendpoint',     from: '*',  to: 'endpointgroup' },
      { name: 'next',     from: 'endpointgroup',  to: 'endpoint' },
      { name: 'submit', from: 'endpoint', to: 'submit'  },
      { name: 'previous', from: 'endpoint', to: 'endpointgroup'  },
      //link
      { name: 'createlink',     from: '*',  to: 'linkgroup' },
      { name: 'next',     from: 'linkgroup',  to: 'link' },
      { name: 'submit', from: 'link', to: 'submit'  },
      { name: 'previous', from: 'link', to: 'linkgroup'  },
      //image
      { name: 'createimage',     from: '*',  to: 'imagegroup' },
      { name: 'next',     from: 'imagegroup',  to: 'image' },
      { name: 'previous', from: 'image', to: 'imagegroup'  },
      //app
      { name: 'createapp',     from: 'start',  to: 'appCreate' },
      { name: 'submit', from: 'appCreate', to: 'submit'  },
      //group
      { name: 'creategroup',     from: 'start',  to: 'groupCreate' },
      { name: 'submit', from: 'groupCreate', to: 'submit'  },
      //user
      { name: 'createuser',     from: 'start',  to: 'userCreate' },
      { name: 'submit', from: 'userCreate', to: 'submit'  },
      //instance
      { name: 'createinstance',     from: '*',  to: 'instancegroup' },
      { name: 'next',     from: 'instancegroup',  to: 'app' },
      
      { name: 'next',     from: 'app',  to: 'instance' },
      { name: 'next',     from: 'instance',  to: 'instancecomposite' },
      { name: 'submit', from: 'instancecomposite', to: 'submit'  },
      { name: 'previous', from: 'instance', to: 'app' },
      { name: 'previous', from: 'app', to: 'instancegroup' },
      { name: 'previous', from: 'instancecomposite', to: 'instance'    },
      //all
      { name: 'cancel',     from: '*',  to: 'start' },
      { name: 'success',     from: '*',  to: 'success' },
      { name: 'other',     from: 'success',  to: 'start' },
    ],
    methods: {
      onStart: function(){
        mymodal.ref.find('.modal-body').html(startContent);
      },
      onAppCreate: function(){

        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', options: '/api/apps/developers', required: false, format:{label:'{{first_name}} {{last_name}}',value:'{{id}}'}},
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);

        options.url = '/api/apps';
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},
            {label: 'Description', name:'description', required: false, type:'textarea'},
            {label: 'Tags', name:'tags', required: false},
            {label: 'Lead Developer', name:'user_id', type:'select', choices: '/api/apps/developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false, value_key:'id',label_key:'email'},
              ],actions:false
        })
        
      },      
      onGroupCreate: function(){
        options.url = '/api/groups';
        options.complete = "Successfully Created a Group!<br><br> Here are some next steps you may want to take:"

        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //     {label: 'Name', name:'name', required: true},        
        //     {label: 'Slug', name:'slug', required: true}
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);

        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},        
            {label: 'Slug', name:'slug', required: true}
          ],actions:false
        })
      },
      onUserCreate: function(){
        options.url = '/api/users';
        options.complete = "Successfully Created a user!";

        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {name:'first_name',label:"First Name"},
            {name:'last_name',label:"Last Name"},
            {name:'email',label:"Email",required:true,type:'email'},
            {name:'password',label:"Password",type:"password"},
            {name:'unique_id',label:"Unique ID",required:true}
          ],actions:false
        })
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {name:'first_name',label:"First Name"},
        //   {name:'last_name',label:"Last Name"},
        //   {name:'email',label:"Email",required:true,type:'email'},
        //   {name:'password',label:"Password",type:"password"},
        //   {name:'unique_id',label:"Unique ID",required:true}
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);


      },
      onPage: function(){
        options.url = '/api/pages';
        options.complete = "Successfully Created a Page!<br><br> Here are some next steps you may want to take:"

        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},
            {label: 'Slug', name:'slug', required: true},
            {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
            {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },				
            {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
            {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
          ],actions:false
        })
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //   {label: 'Slug', name:'slug', required: true},
        //   {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
        //   {label: 'Unlisted', name:'unlisted', type: 'checkbox', options:[0,1] },				
        //   {label: 'Limit Device', name: 'device', format:{value:'{{index}}'}, value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},
        //   {label: 'Public', name:'public', type: 'checkbox', options:[0,1], enabled:  {matches:{name:'limit', value: false}}}

        // ], actions: false},mymodal.ref.find('.modal-body')[0]);

      },   
      onImage: function(){
        options.url = '/api/images';
        options.complete = "Successfully Created an Image!"

        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
          ],actions:false
        })
        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);

      },      
      onEndpoint: function(){
        options.url = '/api/endpoints';
        options.complete = "Successfully Created an Endpoint!"

        mymodal.ref.find('.modal-body').berry({
          flatten:false,
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},
            {label: 'Auth Type', name:'type', type: 'select', choices:[
              {label:'HTTP No Auth', value:'http_no_auth'}, 
              {label:'HTTP Basic Auth', value:'http_basic_auth'}, 
            ], required: true},
            {label: 'Configuration', name:'config', showColumn:false, fields:[
              {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
              {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
              {label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
              {label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
            ]}
          ],actions:false
        })

        // myForm = new gform({name:"modal", attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //   {label: 'Auth Type', name:'type', type: 'select', choices:[
        //     {label:'HTTP No Auth', value:'http_no_auth'}, 
        //     {label:'HTTP Basic Auth', value:'http_basic_auth'}, 
        //   ], required: true},
        //   {label: 'Configuration', name:'config', showColumn:false, fields:[
        //     {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
        //     {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
        //     {label:'Username', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
        //     {label:'Password', 'name':'secret', required: true,show:{matches:{name:'type',value:'http_basic_auth'}},parsable:'show'},
        //   ]}
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);
      },
      onInstance: function(){
        options.url = '/api/appinstances';
        options.complete = "Successfully Created an Instance!<br><br> Here are some next steps you may want to take:"

        $.ajax({
              url: '/api/apps/'+instanceData.app_id+'/versions',
              success: function(data) {
                console.log(data);
                data.unshift({id:0,label:'Latest Stable'})
                data.unshift({id:-1,label:'Latest (working or stable)'})
                mymodal.ref.find('.modal-body').berry({
                    attributes:instanceData,
                    name:"modal", fields:[
                    {label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
                    {label: 'Name', name:'name', required: true},
                    {label: 'Slug', name:'slug', required: true},
                    {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
                    {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
                    {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},				
                    {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}}
                  ],actions:false
                })

                // myForm = new gform({name:"modal", attributes: instanceData, fields:[
                //   {label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
                //   {label: 'Name', name:'name', required: true},
                //   {label: 'Slug', name:'slug', required: true},
                //   {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
                //   {label: 'Unlisted', name:'unlisted', type: 'checkbox', options:[0,1]},
                //   {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},				
                //   {label: 'Public', name:'public', type: 'checkbox', options:[0,1], enabled:  {matches:{name:'limit', value: false}}}
                // ], actions: false},mymodal.ref.find('.modal-body')[0]);
      
              }
            })
      },
      onPagegroup: selectGroup,
      onEndpointgroup: selectGroup,
      onLinkgroup: selectGroup,
      onImagegroup: selectGroup,
      onInstancegroup: selectGroup,
      
      onApp: function(){
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
            name:"modal", fields:[
              {label: 'App', name:'app_id', type:'select',satisfied:function(value){
                return (this.toJSON() !== "")
              },required:true, choices:'/api/apps', default:{"label":"Choose One","value":""}},
            ],actions:false
          })
      },     

      onInstancecomposite: selectComposite,
      onPagecomposite: selectComposite,
      onLink:function(){
        options.url = '/api/links';    
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
            name:"modal", fields:[
              {label: 'Title', name:'title', required: true},
              {label: 'Link', name:'link', required: true},
              {label: 'Image', name:'image'},
              {label: 'Icon', name:'icon', 
              type:'select', choices:'/assets/data/icons.json'},
              {label: 'Color', name:'color'},
            ],actions:false
          })

      } ,
      onComplete:function(){
        location.reload();
      },
      onAfterTransition: function(e){
        mymodal.ref.find('.modal-footer').find('[data-action]').each( function(item){
          item = mymodal.ref.find('.modal-footer').find('[data-action]')[item]
          if(this.transitions().indexOf($(item).attr('data-action')) == -1){
            $(item).hide();
          }else{
            $(item).show();
          } 
          }.bind(this) 
        )

      },
      onBeforeSubmit: function(e){
        if(typeof Berries.modal !== 'undefined'){
          if(Berries.modal.validate()){
            $.extend(instanceData,Berries.modal.toJSON())
          }else{
            return false;
          }
        }else if(typeof gform.instances.modal != 'undefined'){
          if(!gform.instances.modal.validate()){
            return false
          }else{
            $.extend(instanceData,gform.instances.modal.toJSON())
          }
        }
        $.ajax({url: options.url, type: 'POST', data: instanceData,
          success:function(e) {
            toastr.success('', 'Successfully Added')
            fsm.success(this,e);
          }.bind(e),
          error:function(e) {
            toastr.error(e.statusText, 'ERROR');
            fsm.success(this, e);
          }
        });
      },
      onSubmit:function(){
        reset();
      },
      onAfterSuccess:function(e,history,item){
        var link = "";
        if(item.responseJSON.error != ""){
            history.from = "error";
        }
        switch(history.from){
          case "error":
          options.complete = item.responseJSON.error;
          break;
          case "appCreate":
          // $.extend(instanceData,Berries.modal.toJSON())
          instanceData.app_id = item.id;
          // options.complete+=''
          options.complete = "Successfully Created an App!<br><br> Here are some next steps you may want to take<div>"+
          "<a href='#' style='border-left-color:#31708f' class='list-group-action' data-action='createinstance'><i class='fa fa-cubes'></i> Instanciate App</a>"+
          "<a href='/admin/apps/"+item.id+"' class='list-group-action'><i class='fa fa-cube'></i> Edit App</a>"+
          "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>"
          break;
          case "groupCreate":
          instanceData.group_id = item.id;
          options.complete = "Successfully Created an App!<br><br> Here are some next steps you may want to take:<div>"+
          startContent+
          "<a href='/admin/groups/"+item.id+"' class='list-group-action'><i class='fa fa-users'></i> Manage Group</a>"+
          "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>"
          break;
          case "pagecomposite":
          link = "<br><br> Here are some next steps you may want to take:<div><a href='/page/"+item.group_id+"/"+item.slug+"' class='list-group-action'><i class='fa fa-file'></i> Visit Page</a>";
          case "userCreate":
          //Don't overwrite the complete message on user.
          break;
          default:
          instanceData.group_id = item.group_id;
          options.complete = "Created Successfully!"+
          link+
          "<div>Create New</div>"
          startContent+
          "<a href='#' class='list-group-action' data-action='other'><i class='fa fa-gear'></i> Other</a></div>"
        }
        mymodal.ref.find('.modal-body').html(options.complete);
        mymodal.ref.find('.modal-body').find('[data-action]').each( function(item){
          item = mymodal.ref.find('.modal-body').find('[data-action]')[item]
          if(this.transitions().indexOf($(item).attr('data-action')) == -1){
            $(item).hide()
          }else{
            $(item).show()
          } 
          }.bind(this) 
        )
      },
      onBeforeNext: function(){
        if(typeof Berries.modal !== 'undefined'){
          if(!Berries.modal.validate()){
            return false
          }else{
            $.extend(instanceData,Berries.modal.toJSON())
          }
        }else if(typeof gform.instances.modal != 'undefined'){
          if(!gform.instances.modal.validate()){
            return false
          }else{
            $.extend(instanceData,gform.instances.modal.toJSON())
          }
        }
        reset();
      }, 
      onBeforePrevious: reset,
      onBeforeCancel: function(e){
        if(e.from !== e.to){
          reset();
        }
      },
      onBeforeOther: reset
    }
  };


    // options.legend = '<span class="text-primary"><i class="fa fa-file"></i> New Page</span>';
    // options.legend = '<span class="text-warning"><i class="fa fa-crosshairs"></i> New Endpoint</span>';
    // options.legend = '<span style="color:#444"><i class="fa fa-link"></i> New Link</span>';
    // options.legend = '<span style="color:#555"><i class="fa fa-file"></i> New Image</span>';
    // options.legend = '<span style="color:#d85e16"><i class="fa fa-cube"></i> New Micro App</span>';
    // options.legend = '<span style="color:#44a77f"><i class="fa fa-users"></i> New Group</span>';
    // options.legend = '<span style="color:#333"><i class="fa fa-user"></i> New User</span>';
    // options.legend = '<span class="text-info"><i class="fa fa-cubes"></i> New Micro App Instance</span>';

    mymodal = modal({title: options.legend,
      content:'<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>',
      footer:'<span class="btn btn-default" data-action="previous"><i class="fa fa-arrow-left"></i> Back</span><span class="btn btn-info" data-action="next"><i class="fa fa-arrow-right"></i> Next</span><span class="btn btn-success" data-action="submit"><i class="fa fa-check"></i> Create</span><span class="btn btn-primary" data-action="complete"><i class="fa fa-check"></i> Done</span>'
    })
    fsm = new StateMachine(options);
}
$('#new').on('click', createEngine)
$('body').on('click','[data-action]',function(e){
  fsm[e.currentTarget.dataset.action]()
})
