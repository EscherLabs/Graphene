$('.btn-new').popover({container:'body',html:true,title:"Create New",content:`<div class='list-group' style='width:250px'>
<a href='#' class='list-group-item' data-key='app'><i class='fa fa-cube' style='color:#d85e16'></i> Micro App</a>
<a href='#' class='list-group-item' data-key='group'><i class='fa fa-users' style='color:#44a77f'></i> Group</a>
<a href='#' class='list-group-item' data-key='instance'><i class='fa fa-cubes text-info'></i> App Instance</a>
<a href='#' class='list-group-item' data-key='page'><i class='fa fa-file text-primary'></i> Page</a>
<a href='#' class='list-group-item' data-key='endpoint'><i class='fa fa-crosshairs text-warning'></i> Endpoint</a>
<a href='#' class='list-group-item' data-key='image'><i class='fa fa-image' style='color:#555'></i> Image</a>
<a href='#' class='list-group-item' data-key='link'><i class='fa fa-link' style='color:#444'></i> Link</a>
<a href='#' class='list-group-item' data-key='user'><i class='fa fa-user' style='color:#333'></i> User</a>

</div>`})


var reset = function(){
  if(typeof Berries.modal !== 'undefined'){
    Berries.modal.destroy();
  }
  mymodal.ref.find('.modal-body').html('<center style="height:300px"r><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>');
}

instanceData = {};
if(typeof group !== 'undefined'){
  instanceData.group_id = group.id;
}
if(typeof loaded !== 'undefined' && typeof loaded.app !== 'undefined' ){
  instanceData.app_id = loaded.app.id;
}

$('body').on('click','[data-key]',function(e){
  $('.btn-new').click();
  if(typeof Berries.modal !== 'undefined'){
      Berries.modal.destroy();
  }

  var options =  {
    init: 'group',
    transitions: [],
    methods: {
      onAppCreate: function(){

        // myForm = new gform({attributes: instanceData, fields:[
        //   {label: 'Name', name:'name', required: true},
        //     {label: 'Description', name:'description', required: false, type:'textarea'},
        //     {label: 'Tags', name:'tags', required: false},
        //     {label: 'Lead Developer', name:'user_id', type:'select', options: '/api/apps/developers', required: false, format:{label:'{{first_name}} {{last_name}}',value:'{{id}}'}},
        // ], actions: false},mymodal.ref.find('.modal-body')[0]);


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
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},        
            {label: 'Slug', name:'slug', required: true}
          ],actions:false
        })
      },
      onUserCreate: function(){
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
      },
      onPage: function(){
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
      },   
      onImage: function(){
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
          name:"modal", fields:[
            {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
          ],actions:false
        })
      },      
      onEndpoint: function(){
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
      },
      onInstance: function(){
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
              }
            })
      },
      onGroup: function(){
        mymodal.ref.find('.modal-body').berry({
          attributes:instanceData,
            name:"modal", fields:[
              {label: 'Group', name:'group_id', required: true, type:'select',satisfied:function(value){
                return (this.toJSON() !== "")
              },value:instanceData.group_id, choices: '/api/groups?limit=true', default:{"label":"Choose One","value":""}},
            ],actions:false
          })
      },           
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


      onComposite: function(){
        $.ajax({
          url: '/api/groups/'+instanceData.group_id+'/composites',
          success: function(data) {
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
          }
        })
      },
      onLink:function(){
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
        location.reload()

      },
      onAfterTransition: function(){
        mymodal.ref.find('.modal-footer').find('[data-action]').each( function(item){
          item = mymodal.ref.find('.modal-footer').find('[data-action]')[item]
          if(this.transitions().indexOf($(item).attr('data-action')) == -1){
            $(item).hide()
          }else{
            $(item).show()
          } 
          }.bind(this) 
        ) 
      },
      onBeforeSubmit :function(){
        if(typeof Berries.modal !== 'undefined'){
          if(Berries.modal.validate()){
            $.extend(instanceData,Berries.modal.toJSON())
            $.ajax({url: options.url, type: 'POST', data: instanceData,
            success:function() {
              toastr.success('', 'Successfully Added')
              // Berries.modal.destroy();
              // mymodal.ref.modal('hide')
            },
            error:function(e) {
              toastr.error(e.statusText, 'ERROR');
            }
          });
          }else{
            return false;
          }
        }
      },
      onSubmit:function(){
        reset();
        mymodal.ref.find('.modal-body').html('<center>'+options.complete+'</center>');

      },
      onBeforeNext: function(){
        if(typeof Berries.modal !== 'undefined'){
          if(!Berries.modal.validate()){
            return false
          }else{
            $.extend(instanceData,Berries.modal.toJSON())
          }
        }
        reset();
      }, 
      onBeforePrevious: reset,
    }
  };

switch(e.currentTarget.dataset.key){
  case 'page':
    options.legend = '<span class="text-primary"><i class="fa fa-file"></i> New Page</span>';
    options.transitions = [
      { name: 'next',     from: 'page',  to: 'composite' },
      { name: 'next',     from: 'group',  to: 'page' },
      { name: 'submit', from: 'composite', to: 'submit'  },
      { name: 'previous', from: 'page', to: 'group'  },
      { name: 'previous', from: 'composite', to: 'page' },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/pages';
    options.complete = "Successfully Created a page!"
    break;
  case 'endpoint':
    options.legend = '<span class="text-warning"><i class="fa fa-crosshairs"></i> New Endpoint</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'endpoint' },
      { name: 'submit', from: 'endpoint', to: 'submit'  },
      { name: 'previous', from: 'endpoint', to: 'group'  },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/endpoints';
    options.complete = "Successfully Created an Endpoint!"

    break;

  case 'link':
    options.legend = '<span style="color:#444"><i class="fa fa-link"></i> New Link</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'link' },
      { name: 'submit', from: 'link', to: 'submit'  },
      { name: 'previous', from: 'link', to: 'group'  },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/links';    
    options.complete = "Successfully Created a link!"

    break;
  case 'image':
    options.legend = '<span style="color:#555"><i class="fa fa-file"></i> New Image</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'image' },
      { name: 'previous', from: 'image', to: 'group'  },
      { name: 'complete', from: 'image', to: 'complete'  }
    ]
    options.url = '/api/images';
    options.complete = "Successfully Created an image!"
    break;
  case 'app':
    options.legend = '<span style="color:#d85e16"><i class="fa fa-cube"></i> New Micro App</span>';
    options.init = 'appCreate';
    options.transitions = [
      { name: 'submit', from: 'appCreate', to: 'submit'  },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/apps';    
    options.complete = "Successfully Created an app!"

    break;
  case 'group':
    options.legend = '<span style="color:#44a77f"><i class="fa fa-users"></i> New Group</span>';
    options.init = 'groupCreate';
    options.transitions = [
      { name: 'submit', from: 'groupCreate', to: 'submit'  },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/groups';
    options.complete = "Successfully Created a group!"

    break;
  case 'user':
    options.legend = '<span style="color:#333"><i class="fa fa-user"></i> New User</span>';
    options.init = 'userCreate';
    options.transitions = [
      { name: 'submit', from: 'userCreate', to: 'submit'  },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.complete = "Successfully Created a user!"

    options.url = '/api/users';
  break;
  case 'instance':
    options.legend = '<span class="text-info"><i class="fa fa-cubes"></i> New Micro App Instance</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'app' },
      { name: 'next',     from: 'app',  to: 'instance' },
      { name: 'next',     from: 'instance',  to: 'composite' },
      { name: 'submit', from: 'composite', to: 'submit'  },
      { name: 'previous', from: 'instance', to: 'app' },
      { name: 'previous', from: 'app', to: 'group' },
      { name: 'previous', from: 'composite', to: 'instance'    },
      { name: 'complete', from: 'submit', to: 'complete'  }
    ]
    options.url = '/api/appinstances';
    options.complete = "Successfully Created an app instance!"

    break;
}

    mymodal = modal({title: options.legend,
      content:'<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>',
      footer:'<span class="btn btn-default pull-left" data-action="previous"><i class="fa fa-arrow-left"></i> Back</span><span class="btn btn-info" data-action="next"><i class="fa fa-arrow-right"></i> Next</span><span class="btn btn-success" data-action="submit"><i class="fa fa-check"></i> Submit</span><span class="btn btn-danger" data-action="complete"><i class="fa fa-times"></i> Complete</span>'
    })
    fsm = new StateMachine(options);
})

$('body').on('click','[data-action]',function(e){
  fsm[e.currentTarget.dataset.action]()
})