<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class SiteMember extends Model
{
    protected $fillable = ['site_id','user_id','site_admin','site_developer'];
    protected $primaryKey = ['user_id', 'site_id'];
    public $incrementing = false;

    public function site() {
      return $this->belongsTo(Site::class);
    }
    public function user() {
      return $this->belongsTo(User::class);
    }

}
