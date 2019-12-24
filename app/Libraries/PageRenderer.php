<?php 

namespace App\Libraries;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use App\Group;

class PageRenderer {

    private function set_defaults(&$data) {
        $data['site'] = config('app.site');
        $data['logged_in'] = Auth::check();
        $data['user'] = Auth::user();
        $data['user_md5_email'] = (null !== Auth::user())?md5(Auth::user()->email):'';
        $data['is_admin'] = (null !== Auth::user())?Auth::user()->can('visit_admin','App\User'):false;
        $data['url'] = [
            'root' => url('/'),
            'logout' => url('/logout'),
            'admin' => url ('/admin'),
            'login' => url ('/login'),
        ];
    }

    private function build_menu() {
        if (Auth::check()) { /* User is Authenticated */
            $menu_data = Group::MenuData()->where('unlisted','=',0)->orderBy('order')->get();
        } else {
            $menu_data = Group::publicMenuData()->where('unlisted','=',0)->orderBy('order')->get();
        }
        return $menu_data->toArray();
        dd($menu_data);
    }

    public function render($data) {
        $this->set_defaults($data);
        return $this->build_menu();
    }
}