@extends('default.guest')

@section('welcome_name')
Guest
@endsection


@section('sidemenu')

@endsection

@section('content')
<div class="row">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">Setup Wizard</div>
            <div class="panel-body">
            <div id="user"></div>
            <div id="site"></div>
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
      $('#user').berry({actions:[""],legend:"Create a User",fields:[{name:'first_name',label:"First Name"},{name:'last_name',label:"Last Name"},{name:'password',label:"password"},{name:'unique_id',label:"Unique ID"}]})
      $('#site').berry({actions:[""],legend:"Create a site",fields:[{name:'domain',label:"Domain"},{name:'name',label:"Name"}]})
    </script>
@endsection
