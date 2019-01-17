@extends('default.setup')

@section('welcome_name')
Guest
@endsection


@section('sidemenu')

@endsection

@section('content')
<div class="row">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">Graphene Setup Wizard</div>
            <div class="panel-body">
            <div id="form">
            @if($mode == 'db')
            <h4 class="text-danger">Graphene is unable to connect to your database.</h4>
            Please make sure you have set this up in your .env file or server configuration ($_SERVER). You may need to restart the php server before changes are seen.
            <br>
            <br>
            Also make sure that your database has been configured and is reachable.
            <br>
            <br>
            The current configuration is:            <br>
            <br>

            <table class="table">
            <tr><td style="width:120px"><b>DB_HOST</b></td><td data-inline="host"></td></tr>
            <tr><td><b>DB_PORT</b></td><td data-inline="port"></td></tr>
            <tr><td><b>DB_DATABASE</b></td><td data-inline="database"></td></tr>
            <tr><td><b>DB_USERNAME</b></td><td data-inline="username"></td></tr>
            <tr><td><b>DB_PASSWORD</b></td><td data-inline="password"></span></div>
            </table>
            @endif
            </div>
            <div id="instructions"></div>
            </div>
        </div>
    </div>
</div>
@endsection

@section('bottom_page_scripts')

    <script src='/assets/js/vendor/hogan.min.js'></script>
    <script src='/assets/js/vendor/lodash.min.js'></script>	

<script src='/assets/js/vendor/berry.full.js'></script> 
<script src='/assets/js/vendor/bootstrap.full.berry.js'></script> 
    <!-- <script src='/assets/js/vendor/berrytables.full.js'></script>  -->
    <script>
      @if($mode == 'site')
      $('#form').berry({name:'form',actions:['save'],legend:"Create a site",fields:[{name:'domain',label:"Domain",value:window.location.hostname,required:true},{name:'name',label:"Name",required:true},{name:'auth', label:'Authentication Type',required:true,type:'radio',options:['Default'],value:'Default'}]}).on('save',function(){
        if(this.validate()){
        $.post('/',this.toJSON(),function(response){
                if(response.site==Berries.form.toJSON().domain){
                    location.reload();
                }   
        });
        }
      })
      @endif
      @if($mode == 'user')
      $('#form').berry({name:'form',actions:['save'],legend:"Create a User",fields:[{name:'first_name',label:"First Name"},{name:'last_name',label:"Last Name"},{name:'email',label:"Email",required:true},{name:'password',label:"Password",required:true},{name:'unique_id',label:"Unique ID",required:true}]}).on('save',function(){
        if(this.validate()){
        $.post('/api/usersetup',this.toJSON(),function(response){
            location.reload();
        });
        }
      })
      @endif

      @if($mode == 'db')

            mysql = {};
            @if(env('APP_DEBUG') == 1)

                mysql.host = "{{ config('database.connections.mysql.host') }}";
                mysql.port = "{{ config('database.connections.mysql.port') }}";
                mysql.database = "{{ config('database.connections.mysql.database') }}";
                mysql.username = "{{ config('database.connections.mysql.username') }}";
                @if(config('database.connections.mysql.password') == 'crazystairs')
                    mysql.password = "crazystairs";
                @else
                    mysql.password = "***";
                @endif
           @endif


      $('#form').berry({name:'form',attributes:mysql,actions:false,renderer:'inline',fields:[
        {name:'host'},
        {name:'port'},
        {name:'database'},
        {name:'username'},
        {name:'password'}
        ]}).on('change',function(){
            @verbatim
            //generate instructions here
			// $('#instructions').html(Hogan.compile(`hello {{host}}`).render(this.toJSON()));
            @endverbatim

        }).trigger('change')
      
      @endif
        $('form').on('keydown', function(event) {
            try {
                if (event.keyCode == 13) {
                    Berries.form.trigger('save')
                }
                false;
            } catch (e) { };
            return true
        })


    </script>
@endsection
