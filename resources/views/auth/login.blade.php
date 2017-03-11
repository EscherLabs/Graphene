@extends('default.guest')

@section('welcome_name')
Guest
@endsection

@section('body_classes')
    @if(Request::get('sidemenu') !== 'false' && count($apps)>0)
        sidemenu
    @endif
@endsection

@section('sidemenu')
    @if( Request::get('sidemenu') !== 'false' && count($links)>0))
    <div class="col-sm-3 col-md-2 sidebar">
      <ul class="nav nav-sidebar">
        @if(isset($links))
        @foreach ($links as $app)
          <li><a href="#">{{ $app->name }}</a></li>
          <ul>
          @foreach ($app->app_instances as $instance)
                    <li><a href="/app/{{ $instance->slug }}{{ (Request::get('topbar') !== 'false') ? '' : '?topbar=false' }}"><i class="fa fa-{{ (!is_null($instance->icon)&&$instance->icon!='')?$instance->icon:'cube' }} fa-fw"></i>&nbsp; {{ $instance->name }}</a></li>
          @endforeach
          @foreach ($app->pages as $page)
                    <li><a href="/page/{{ $app->slug }}/{{ $page->slug }}{{ (Request::get('topbar') !== 'false') ? '' : '?topbar=false' }}"><i class="fa fa-{{ (!is_null($page->icon)&&$page->icon!='')?$page->icon:'cube' }} fa-fw"></i>&nbsp; {{ $page->name }}</a></li>
          @endforeach
          </ul>

        @endforeach
        @endif
      </ul>
    </div>
    @endif
@endsection

@section('content')
<div class="row">
    <div class="col-md-8 col-md-offset-2">
        <div class="panel panel-default">
            <div class="panel-heading">Login</div>
            <div class="panel-body">
                <form class="form-horizontal" role="form" method="POST" action="{{ url('/login') }}">
                    {{ csrf_field() }}

                    <div class="form-group{{ $errors->has('email') ? ' has-error' : '' }}">
                        <label for="email" class="col-md-4 control-label">E-Mail Address</label>

                        <div class="col-md-6">
                            <input id="email" type="email" class="form-control" name="email" value="{{ old('email') }}" required autofocus>

                            @if ($errors->has('email'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('email') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group{{ $errors->has('password') ? ' has-error' : '' }}">
                        <label for="password" class="col-md-4 control-label">Password</label>

                        <div class="col-md-6">
                            <input id="password" type="password" class="form-control" name="password" required>

                            @if ($errors->has('password'))
                                <span class="help-block">
                                    <strong>{{ $errors->first('password') }}</strong>
                                </span>
                            @endif
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-md-6 col-md-offset-4">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox" name="remember" {{ old('remember') ? 'checked' : ''}}> Remember Me
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-md-8 col-md-offset-4">
                            <button type="submit" class="btn btn-primary">
                                Login
                            </button>

                            <a class="btn btn-link" href="{{ url('/password/reset') }}">
                                Forgot Your Password?
                            </a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
