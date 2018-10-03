@extends('default.guest')

@section('content')
        <div style="text-align:center;">
            <div style="text-shadow:2px 2px 5px rgba(0,0,0,.8);font-size:200px;text-align:center;">503</div>
                <h1 style="margin:25px;" >
                    <span data-toggle="collapse" data-target="#stack-trace">
                        Oops! An Error Occurred!
                    </span>
                </h1>
            <a class="btn btn-default" style="font-size:20px;" href="/">
                <i class="fa fa-fw fa-home"></i> Go Back to Home Page
            </a>
        </div>
        @isset($exception)
        <div class="row" style="margin-top:15px">
            <div class="col-sm-offset-2 col-sm-8 collapse" id="stack-trace">
                <pre style="max-height:200px">{{ $exception }}</pre>
            </div>
        </div>
        @endisset
@endsection
