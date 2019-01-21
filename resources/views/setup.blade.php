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
            @if($mode == 'site')
            <div class="alert alert-danger">
                Note: Please read this page carefully before submitting the form below!  Submitting this form 
                without the correct DNS / Server Configuration in place could make this Graphene instance unreachable!
            </div>
            @endif

            <div id="form">

            @if($mode == 'db')
            <h3 class="text-danger">Graphene is unable to connect to your database.</h4>
            Your database may not be set up and / or your Graphene .env file may not be properly configured.<br>
            Please address these issues, restart your webserver, and refresh this page.
            <br><br>
            The current Graphene database configuration is as follows:<br>
            (Please make any necessary corrections)
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
      $('#form').berry({name:'form',actions:['save'],legend:"Create A Site",fields:[{name:'domain',label:"Domain",value:window.location.hostname,required:true},{name:'name',label:"Name",required:true},{name:'auth', label:'Authentication Type',required:true,type:'radio',options:['Default'],value:'Default'}]}).on('save',function(){
        if(this.validate()){
            $.post('/',this.toJSON(),function(response){
                if(response.site==Berries.form.toJSON().domain){
                    location.reload();
                }   
            });
        }
      }).on('change',function(){
        @verbatim
        //generate instructions here
        var config_help = `
<h4 class="text-info">Configure Domain / DNS</h3>
<div>You will need to configure your DNS such that "{{domain}}" resolves to the IP Address of the Graphene Web Server.  
You will also need to configure your Graphene Web Server to handle traffic coming from "{{domain}}" using
the Graphene Application.<br><br>
You should be able to confirm that everything is set up correctly by running the following commands:
</div>
<pre>
# Ensure that an the "dig" command below resolves to an 'A' record 
# with the correct IP
$ dig {{domain}}

# Ensure that the command below returns a 'HTTP/1.1 200 OK' response code.  
# Note that if you are using HTTPS or running on a nonstandard port, the 
# command below may need to be modified accordingly.
$ curl -I http://{{domain}}
</pre>
<div class="alert alert-info">
Note: If you are installing Graphene locally, you may be able to skip the steps above by adding the following
line to your /etc/hosts file and running the php artisan command:
</div>
<pre>
# Add to /etc/hosts
127.0.0.1       {{domain}}

# Run in the root Graphene Code directory from the command prompt:
php artisan serve --host={{domain}}
</pre>
`;
        $('#instructions').html(Hogan.compile(config_help).render(this.toJSON()));
        @endverbatim

      }).trigger('change')
      @endif
      @if($mode == 'user')
      $('#form').berry({name:'form',actions:['save'],legend:"Create a User (Site Admin)",fields:[{name:'first_name',label:"First Name"},{name:'last_name',label:"Last Name"},{name:'email',label:"Email",required:true},{name:'password',label:"Password",type:"password",required:true},{name:'unique_id',label:"Unique ID",required:true}]}).on('save',function(){
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
                    mysql.password = "";
                @endif
           @endif


      $('#form').berry({name:'form',attributes:mysql,actions:false,renderer:'inline',fields:[
        {label:'DB_HOST', name:'host', help:'This is the hostname of the mysql server.  If the mysql server is running on the same machine as the Graphene web server, this is typically "127.0.0.1" or "localhost"', validate: {required: true}},
        {label:'DB_PORT', name:'port', help:'This is the port that the mysql server listens on.  Unless you have reason to change this, keep it as "3306"',validate: {required: true}},
        {label:'DB_DATABASE', name:'database', help:'This is the name of the Graphene database', validate: {required: true}},
        {label:'DB_USERNAME', name:'username', help:'This is the username used to connect to the Graphene database', validate: {required: true}},
        {label:'DB_PASSWORD', name:'password', help:'This is the password used to connect to the Graphene database'}
        ]}).on('change',function(){
            if (this.validate()) {
                @verbatim
                //generate instructions here
                var config_help = `
    <h4 class="text-info">Create and Configure MySQL Database</h3>
    <div>If you have not already created and configured your mysql database, please run the following commands
    based on the form above:
    </div>
<pre>
$ mysql -u root
> CREATE DATABASE {{database}};
> GRANT ALL ON {{database}}.* TO '{{username}}'@'{{host}}' IDENTIFIED BY '{{#password}}{{password}}{{/password}}{{^password}}CHANGE TO VALID PASSWORD{{/password}}';
</pre>
    <div class="alert alert-warning">
    Note: This assumes you have a reachable mysql server installed and that you know the mysqld "root" password.
    </div>
    <h4 class="text-info">.env File Database Configuration</h3>
    <div>If you have not yet configured your environment ".env" file, please copy and paste the following
    lines into the ".env" file at the root of your "Graphene" installation.  If no such file exists, 
    create one now.
    </div>
<pre>
DB_HOST={{host}}
DB_PORT={{port}}
DB_DATABASE={{database}}
DB_USERNAME={{username}}
DB_PASSWORD={{#password}}{{password}}{{/password}}{{^password}}CHANGE TO VALID PASSWORD{{/password}}
</pre>
    <div class="alert alert-warning">Note: The use of the ".env" file is the <i>default</i> way to configure 
    Graphene configuration variables, but they may optionally be configured
    using web server environment variables.  Please consult the Graphene documentation for more info.
    </div>
    `;
                $('#instructions').html(Hogan.compile(config_help).render(this.toJSON()));
                @endverbatim
            }

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
