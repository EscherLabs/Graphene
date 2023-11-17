<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ReportVersion extends Model
{
    protected $fillable = ['report_id','summary','description','stable','config','compiled','user_id'];
    protected $casts = ['config' => 'object','compiled' => 'object'];

    public function report() {
      return $this->belongsTo(App::class);
    }
    // public function report_instances() {
    //   return $this->hasOne(AppInstance::class);
    // }  
    // public function user() {
    //   return $this->belongsTo(User::class);
    // }
}
