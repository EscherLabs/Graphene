$('.btn-new').popover({container:'body',html:true,title:"Create New",content:`<div class='list-group' style='width:250px'>
<a href='#' class='list-group-item' data-key='app'><i class='fa fa-cube' style='color:#d85e16'></i> Micro App</a>
<a href='#' class='list-group-item' data-key='instance'><i class='fa fa-cubes text-info'></i> App Instance</a>
<a href='#' class='list-group-item' data-key='page'><i class='fa fa-file text-primary'></i> Page</a>
<a href='#' class='list-group-item' data-key='endpoint'><i class='fa fa-crosshairs text-warning'></i> Endpoint</a>
<a href='#' class='list-group-item' data-key='image'><i class='fa fa-image' style='color:#555'></i> Image</a>
</div>`})


var reset = function(){Berries.modal.destroy();mymodal.ref.find('.modal-body').html('<cente style="height:300px"r><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>');}
instanceData = {};


$('body').on('click','[data-key]',function(e){
  $('.btn-new').click();
  if(typeof Berries.modal !== 'undefined'){
      Berries.modal.destroy();
  }
  // var transitions = [];
  var options =  {
    init: 'group',
    transitions: [],
    methods: {
      onAppCreate: function(){
        mymodal.ref.find('.modal-body').berry({
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},
            {label: 'Description', name:'description', required: false, type:'textarea'},
            {label: 'Tags', name:'tags', required: false},
            {label: 'Lead Developer', name:'user_id', type:'select', choices: '/api/apps/developers', template:'{{attributes.user.first_name}} {{attributes.user.last_name}} - {{attributes.user.email}}', required: false, value_key:'id',label_key:'email'},
      
          // {name: 'id', type:'hidden'}
        ],actions:false
      })

      },
      onPage: function(){
        mymodal.ref.find('.modal-body').berry({
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
          name:"modal", fields:[
            // {label: 'Name', name:'name', required: true}
            // {label: 'Group', name:'group_id', type:'hidden',value:instanceData.group_id},
            {type: 'upload', label: false, path: '/api/images?group_id='+instanceData.group_id, name: 'image_filename'}
          ],actions:false
        }).on('uploaded:image_filename', function(){
          // var temp = Berries.modal.fields.image_filename.value;
          // bt.add(temp);
          // Berries.newimage.trigger('close');
      }.bind(this) )
      // .on('change:group_id', function(){	
      //   this.fields.image_filename.update({path:'/api/images?group_id='+instanceData.group_id}, true)
      // });

      },      
      onEndpoint: function(){
        mymodal.ref.find('.modal-body').berry({
          flatten:false,
          name:"modal", fields:[
            {label: 'Name', name:'name', required: true},
            {label: 'Auth Type', name:'type', type: 'select', choices:[
              {label:'HTTP No Auth', value:'http_no_auth'}, 
              {label:'HTTP Basic Auth', value:'http_basic_auth'}, 
              // {label:'Google Sheets', value:'google_sheets'},
            ], required: true},
            {label: 'Configuration', name:'config', showColumn:false, fields:[
              {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_basic_auth'}}},
              {label:'Url', required: false,parsable:'show', show:{matches:{name:'type',value:'http_no_auth'}}},
              // {label:'Sheet ID', name:'sheet_id', type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
              // {label:'Google Redirect URL', name:'google_redirect', enabled:false, type:'text',show:{matches:{name:'type',value:'google_sheets'}}},
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
                    name:"modal", fields:[
                    {label: 'Version', name:'app_version_id', required:true, options:data,type:'select', value_key:'id',label_key:'label'},
                    {label: 'Name', name:'name', required: true},
                    {label: 'Slug', name:'slug', required: true},
                    {label: 'Icon', name:'icon', required: false,template:'<i class="fa fa-{{value}}"></i>'},
                    {label: 'Unlisted', name:'unlisted', type: 'checkbox',truestate:1,falsestate:0 },
                    {label: 'Limit Device', name: 'device', value_key:'index', value:0, options: ['All', 'Desktop Only', 'Tablet and Desktop', 'Tablet and Phone', 'Phone Only']},				
                    // {name: 'app', type:'hidden'},
                    {label: 'Public', name:'public', type: 'checkbox',truestate:1,falsestate:0, enabled:  {matches:{name:'limit', value: false}}},
                    // {name: 'id', type:'hidden'}
                  ],actions:false
                })
              }
            })
      },
      onGroup: function(){
        mymodal.ref.find('.modal-body').berry({
            name:"modal", fields:[
              {label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
              // {label: 'App', name:'app_id', type:'select', choices:'/api/apps'},
              // {name: 'id', type:'hidden'}
            ],actions:false
          })
      },           
      onApp: function(){
        mymodal.ref.find('.modal-body').berry({
            name:"modal", fields:[
              // {label: 'Group', name:'group_id', required: true, type:'select', choices: '/api/groups?limit=true'},
              {label: 'App', name:'app_id', type:'select', choices:'/api/apps'},
              // {name: 'id', type:'hidden'}
            ],actions:false
          })
      },     


      onComposite: function(){
        $.ajax({
          url: '/api/groups/'+instanceData.group_id+'/composites',
          success: function(data) {
            composites = data;
            mymodal.ref.find('.modal-body').berry({
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
                      // {label: false, name: 'ids', type: 'select', options: composites}
                  ],
                  template:'{{#attributes.composites.composite}}{{groups}} {{/attributes.composites.composite}}'
                }
              ],actions:false
            })
          }

        })
      },     
      onComplete:function(){

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
      onBeforeComplete :function(){
        if(typeof Berries.modal !== 'undefined'){
          if(Berries.modal.validate()){
            $.extend(instanceData,Berries.modal.toJSON())
            $.ajax({url: options.url, type: 'POST', data: instanceData,
            success:function(data) {
              // model.set(data);
              // Berries.modal.trigger('close')
              toastr.success('', 'Successfully Added')
              Berries.modal.destroy();

              mymodal.ref.modal('hide')
            },
            error:function(e) {
              toastr.error(e.statusText, 'ERROR');
            }
          });
          }
        }



      },
      onBeforeNext: function(){
        if(typeof Berries.modal !== 'undefined'){
          if(!Berries.modal.validate()){
            return false
          }else{
            $.extend(instanceData,Berries.modal.toJSON())
            // Berries.modal.destroy();
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
      { name: 'next',     from: 'group',  to: 'page' },
      { name: 'next',     from: 'page',  to: 'composite' },
      { name: 'complete', from: 'composite', to: 'complete'  },
      { name: 'previous', from: 'page', to: 'group'  },
      { name: 'previous', from: 'composite', to: 'page' }
    ]
    options.url = '/api/pages';
    options.callback = function(){

    }
    break;
  case 'endpoint':
    options.legend = '<span class="text-warning"><i class="fa fa-crosshairs"></i> New Endpoint</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'endpoint' },
      { name: 'complete', from: 'endpoint', to: 'complete'  },
      { name: 'previous', from: 'endpoint', to: 'group'  }
    ]
    options.url = '/api/endpoints';
    options.callback = function(){

    }
    break;
  case 'image':
    options.legend = '<span style="color:#555"><i class="fa fa-file"></i> New Image</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'image' },
      // { name: 'complete', from: 'image', to: 'complete'  },
      { name: 'previous', from: 'image', to: 'group'  }
    ]
    options.url = '/api/images';
    options.callback = function(){

    }
    break;
  case 'app':
    options.legend = '<span style="color:#d85e16"><i class="fa fa-cube"></i> New Micro App</span>';
    options.init = 'appCreate';
    options.transitions = [
      { name: 'complete', from: 'appCreate', to: 'complete'  }
      // { name: 'condense', from: 'gas',    to: 'liquid' }
    ]
    options.url = '/api/apps';
    options.callback = function(){

    }
    break;
  case 'instance':
    options.legend = '<span class="text-info"><i class="fa fa-cubes"></i> New Micro App Instance</span>';
    options.transitions = [
      { name: 'next',     from: 'group',  to: 'app' },
      { name: 'next',     from: 'app',  to: 'instance' },
      { name: 'next',     from: 'instance',  to: 'composite' },
      { name: 'complete', from: 'composite', to: 'complete'  },
      { name: 'previous', from: 'instance', to: 'app' },
      { name: 'previous', from: 'app', to: 'group' },
      { name: 'previous', from: 'composite', to: 'instance'    }
    ]
    options.url = '/api/appinstances';
    options.callback = function(){

    }
    break;
}

    mymodal = modal({title: options.legend,content:'<center><i class="fa fa-spinner fa-spin" style="font-size:60px;margin:20px auto;color:#d8d8d8"></i></center>',
      footer:'<span class="btn btn-default pull-left" data-action="previous"><i class="fa fa-arrow-left"></i> Back</span><span class="btn btn-success" data-action="next"><i class="fa fa-arrow-right"></i> Next</span><span class="btn btn-danger" data-action="complete"><i class="fa fa-check"></i> Finish</span>'})


    fsm = new StateMachine(options);

    $('body').on('click','[data-action]',function(e){
      fsm[e.currentTarget.dataset.action]()
    })




  


})
