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
            <div id="form"></div>
            @if($mode == 'db')
            <h4 class="text-danger">Graphene is unable to connect to your database.</h4>
            Please make sure you have set this up in your .env file or server configuration ($_SERVER). You may need to restart the php server before changes are seen.
            <br>
            <br>
            @if(env('APP_DEBUG') == 1)

            The current configuration is:            <br>
            <br>

            <table class="table">
            <tr><td style="width:120px"><b>DB_HOST</b></td><td>{{ config('database.connections.mysql.host') }}</td></tr>
            <tr><td><b>DB_PORT</b></td><td>{{ config('database.connections.mysql.port') }}</td></tr>
            <tr><td><b>DB_DATABASE</b></td><td>{{ config('database.connections.mysql.database') }}</td></tr>
            <tr><td><b>DB_USERNAME</b></td><td>{{ config('database.connections.mysql.username') }}</td></tr>
            <tr><td><b>DB_PASSWORD</b></td><td>***</span></div>
            </table>
            @endif
            @endif
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
