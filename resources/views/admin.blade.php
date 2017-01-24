
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <link rel="icon" href="../../favicon.ico">

    <title>V6</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">

    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<link href="../../assets/css/ie10-viewport-bug-workaround.css" rel="stylesheet">-->

    <!-- Custom styles for this template -->
    <link href="/assets/css/dashboard.css" rel="stylesheet">

    <!-- Just for debugging purposes. Don't actually copy these 2 lines! -->
    <!--[if lt IE 9]><script src="../../assets/js/ie8-responsive-file-warning.js"></script><![endif]-->
    <!--<script src="../../assets/js/ie-emulation-modes-warning.js"></script>-->

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>

  <body>

    <nav class="navbar navbar-inverse navbar-fixed-top">
      <div class="container-fluid">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#">V6</a>
        </div>
        <div id="navbar" class="navbar-collapse collapse">
          <ul class="nav navbar-nav navbar-right">
            <li><a href="#">Dashboard</a></li>
          </ul>
          <form class="navbar-form navbar-right">
            <input type="text" class="form-control" placeholder="Search...">
          </form>
        </div>
      </div>
    </nav>

    <div class="container-fluid">
      <div class="row">
        <div class="col-sm-3 col-md-2 sidebar">
          <ul class="nav nav-sidebar">
            <!--<li class="active"><a href="#">Overview <span class="sr-only">(current)</span></a></li>-->
            <li><a href="/admin/users">Users</a></li>
            <li><a href="/admin/apps">Apps</a></li>
            <li><a href="/admin/groups">Groups</a></li>
            <li><a href="/admin/endpoints">Endpoints</a></li>            
            <li><a href="/admin/sites">Sites</a></li>
          </ul>
        </div>
        <div class="col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2 main" id="content">
        </div>
      </div>
    </div>

    <!-- Bootstrap core JavaScript
    ================================================== -->
    <!-- Placed at the end of the document so the pages load faster -->

    <!-- jQuery -->
    <script type='text/javascript' src='https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js'></script>

    <!-- Bootstrap -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <!-- IE10 viewport hack for Surface/desktop Windows 8 bug -->
    <!--<script src="../../assets/js/ie10-viewport-bug-workaround.js"></script>-->
    <script type='text/javascript' src='//twitter.github.com/hogan.js/builds/3.0.1/hogan-3.0.1.js'></script>
		<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js'></script>		

    	 <script src='https://rawgit.com/Cloverstone/Berry/master/bin/full.berry.min.js'></script>
			 <script src='https://rawgit.com/Cloverstone/Berry/master/bin/bootstrap.full.berry.js'></script> 
			 <script src='https://rawgit.com/Cloverstone/berryTables/master/bin/js/berryTables.min.js'></script> 

		<!--<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/ace/1.1.3/ace.js" charset="utf-8"></script>-->
		<!--<script type='text/javascript' src='//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4/underscore-min.js'></script>		-->
		<!--<script type='text/javascript' src='//cdn.tinymce.com/4/tinymce.min.js'></script>-->
    <script>
    var fieldsets= {
      'users':[
        {label: 'Name', name:'name', required: true},
        {label: 'Email', name:'email', type: 'email', required: true}
      ],
      'apps':[
        {label: 'Name', name:'name', required: true},
        {name:'code', label: 'Code', type: 'fieldset', fields:[
          {label: 'CSS', name:'css'}
        ]}
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
      var api = '/api/{{ $resource }}'
      $.ajax({
        url: api,
        success: function(data){
          $('#content').html('<h1 class="page-header">{{ $resource }}</h1><div class="row "><div id="table"></div></div>');		
          fieldsets['{{ $resource }}'].push({name: 'id', type:'hidden'});
          bt = new berryTable({
            entries: [25, 50, 100],
            count: 25,
            autoSize: 10,
            container: '#table', 
            schema: fieldsets['{{ $resource }}'], 
            data: data,
            //click: function(model){window.location.href = '/admin/groups/'+model.attributes.id+'/members'},
            add: function(model){$.ajax({url: api, type: 'POST', data: model.attributes});},
            edit: function(model){$.ajax({url: api+'/'+model.attributes.id, type: 'PUT', data: model.attributes});},
            delete: function(model){ $.ajax({url: api+'/'+model.attributes.id, type: 'DELETE'});}
          })
        }
      })
    </script>
  </body>
</html>
