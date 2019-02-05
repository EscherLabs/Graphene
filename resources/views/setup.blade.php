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
            <h4 class="text-danger">No Sites Detected</h4>
            <div class="alert alert-danger">
                This instance of Graphene does not have any sites.  Create one using the form below.<br><br>
                Note: Read this page carefully before submitting the form below!  Submitting this form 
                without the correct DNS / Server Configuration in place could make this Graphene instance unreachable!
            </div>
            @endif

            @if($mode == 'user')
            <h4 class="text-danger">No Users Detected</h4>
            <div class="alert alert-danger">
                This Graphene site does not have any Users or Admins.  Create one using the form below.
            </div>
            @endif


            @if($mode == 'environment')
            <h4 class="text-danger">No Application Key Detected</h4>
            <div class="alert alert-danger">
                You are seeing this page because you have not yet configured your APP_KEY cryptographic key.  <br>
                While you're setting the APP_KEY, please review / configure some of the other environment variables below.<br>
                Once you have configured these values, restart your webserver, and refresh this page.
            </div>
            @endif

            <div id="form">

            @if($mode == 'db')
            <h4 class="text-danger">Graphene Cannot Connect To The Database</h4>
            <div class="alert alert-danger">
                The database may not be set up and / or the Graphene .env file may not be properly configured.<br>
                Please review and update the configuration below.  Once you have addressed these issues, 
                restart your webserver, and refresh this page.
            </div>
            <table class="table">
                <tr><td style="width:120px"><b>DB_HOST</b></td><td data-inline="host"></td></tr>
                <tr><td><b>DB_PORT</b></td><td data-inline="port"></td></tr>
                <tr><td><b>DB_DATABASE</b></td><td data-inline="database"></td></tr>
                <tr><td><b>DB_USERNAME</b></td><td data-inline="username"></td></tr>
                <tr><td><b>DB_PASSWORD</b></td><td data-inline="password"></span></div>
            </table>
            @endif

            @if($mode == 'environment')
            <table class="table">
            <tr><td><b>APP_KEY</b></td><td data-inline="APP_KEY"></td></tr>
            <tr><td><b>APP_DEBUG</b></td><td data-inline="APP_DEBUG"></td></tr>
            <tr><td><b>APP_ENV</b></td><td data-inline="APP_ENV"></td></tr>
            <tr><td><b>APP_LOG</b></td><td data-inline="APP_LOG"></span></div>
            <tr><td><b>APP_LOG_LEVEL</b></td><td data-inline="APP_LOG_LEVEL"></span></div>
            <tr><td><b>APP_TIMEZONE</b></td><td data-inline="APP_TIMEZONE"></span></div>
            <tr><td><b>FILE_STORAGE_PATH</b></td><td data-inline="FILE_STORAGE_PATH"></span></div>
            <tr><td><b>FORCE_HTTPS</b></td><td data-inline="FORCE_HTTPS"></span></div>
            <tr><td><b>SESSION_LIFETIME</b></td><td data-inline="SESSION_LIFETIME"></span></div>
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
    _.findWhere = _.find;
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
      $('#form').berry({name:'form',actions:['save'],legend:"Create a User (Site Admin)",fields:[{name:'first_name',label:"First Name"},{name:'last_name',label:"Last Name"},{name:'email',label:"Email",required:true,type:'email'},{name:'password',label:"Password",type:"password",required:true},{name:'unique_id',label:"Unique ID",required:true}]}).on('save',function(){
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
        {label:'DB_HOST', name:'host', value:'127.0.0.1', help:'This is the hostname of the mysql server.  If the mysql server is running on the same machine as the Graphene web server, this is typically "127.0.0.1" or "localhost"', validate: {required: true}},
        {label:'DB_PORT', name:'port', value:'3306', help:'This is the port that the mysql server listens on.  Unless you have reason to change this, keep it as "3306"',validate: {required: true}},
        {label:'DB_DATABASE', name:'database', value:'graphene', help:'This is the name of the Graphene database', validate: {required: true}},
        {label:'DB_USERNAME', name:'username', value:'graphene', help:'This is the username used to connect to the Graphene database', validate: {required: true}},
        {label:'DB_PASSWORD', name:'password', placeholder:'Set me to something Secure!', help:'This is the password used to connect to the Graphene database'}
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
$ mysql -u root -h {{host}} -P {{port}}
> CREATE DATABASE {{database}};
> CREATE USER '{{username}}'@'{{host}}' IDENTIFIED BY '{{#password}}{{password}}{{/password}}{{^password}}CHANGE TO VALID PASSWORD{{/password}}';
> GRANT ALL PRIVILEGES ON {{database}}.* TO '{{username}}'@'{{host}}' WITH GRANT OPTION;
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
      @if($mode == 'environment')
            environment = {};
            @if(config('app.debug') == 1)
                environment.APP_DEBUG = "{{ config('app.debug') }}";
                environment.APP_ENV = "{{ config('app.env') }}";
                @if(config('app.key') === 'CHANGEMECHANGEMECHANGEMECHANGEME')
                    environment.APP_KEY = "base64:{{ base64_encode(md5(microtime())) }}";
                @else
                    environment.APP_KEY = "";
                @endif
                environment.APP_LOG = "{{ env('APP_LOG') }}";
                environment.APP_LOG_LEVEL = "{{ env('APP_LOG_LEVEL') }}";
                environment.APP_TIMEZONE = "{{ config('app.timezone') }}";
                environment.FILE_STORAGE_PATH = "{{ config('filesystems.disks.local.root') }}";
                environment.FORCE_HTTPS = "{{ env('FORCE_HTTPS') }}";
                environment.SESSION_LIFETIME = "{{ config('session.lifetime') }}";
           @endif


      $('#form').berry({name:'form',attributes:environment,actions:false,renderer:'inline',fields:[
        {label:'APP_DEBUG', name:'APP_DEBUG', type:'select', options:['1','0'], help:'Enable / Disable Debug.  Note: APP_DEBUG should never be enabled in production environments!', validate: {required: true}},
        {label:'APP_ENV', name:'APP_ENV', type:'select', options:['local','AWS'], help:'Unless you are using AWS (Amazon Web Services), select "local"', validate: {required: true}},
        {label:'APP_KEY', name:'APP_KEY', help:'This is a randomly generated 32 Character string used to encrypt sessions, endpoint credentials, and other data.  Once set, it cannot be (easily) changed!', validate: {required: true}},
        {label:'APP_LOG', name:'APP_LOG', type:'select', options:['stack','single','daily','slack','syslog','errorlog','monolog','custom'], help:'More Info: https://laravel.com/docs/5.7/logging', validate: {required: true}},
        {label:'APP_LOG_LEVEL', name:'APP_LOG_LEVEL', type:'select', options:['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug'], help:'More Info: https://laravel.com/docs/5.7/logging', validate: {required: true}},
        {label:'APP_TIMEZONE', name:'APP_TIMEZONE', help:'Enter the local timezone.  List of supported values here: http://php.net/manual/en/timezones.php', validate: {required: true}},
        {label:'FILE_STORAGE_PATH', name:'FILE_STORAGE_PATH', help:'This is the path to where images and other files are uploaded.  Note: This directory must be writeable by the web server process!', validate: {required: true}},
        {label:'FORCE_HTTPS', name:'FORCE_HTTPS', type:'select', options:['0','1'], help:'Enable / Disable Force HTTPS', validate: {required: true}},
        {label:'SESSION_LIFETIME', name:'SESSION_LIFETIME', help:'Length of Session in Minutes', validate: {required: true}}
        ]}).on('change',function(){
            if (this.validate()) {
                @verbatim
                //generate instructions here
                var config_help = `
                <h4 class="text-info">.env File Environment Config</h3>
                <div>Please copy and paste the following
                lines into the ".env" file at the root of your "Graphene" installation.  
                </div>
<pre>
APP_KEY={{#APP_KEY}}{{APP_KEY}}{{/APP_KEY}}{{^APP_KEY}}EXISTING_SECRET_KEY_CHANGE_ME{{/APP_KEY}}
APP_DEBUG={{APP_DEBUG}}
APP_ENV={{APP_ENV}}
APP_LOG={{APP_LOG}}
APP_LOG_LEVEL={{APP_LOG_LEVEL}}
APP_TIMEZONE={{APP_TIMEZONE}}
FILE_STORAGE_PATH={{FILE_STORAGE_PATH}}
FORCE_HTTPS={{FORCE_HTTPS}}
SESSION_LIFETIME={{SESSION_LIFETIME}}
</pre>
<div class="alert alert-warning">
    Note: This is the same file you created in the database configuration step!  Do not overwrite the Database Config!
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
