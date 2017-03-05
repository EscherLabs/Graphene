<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class GroupComposite extends Model
{
    protected $fillable = ['group_id','composite_group_id'];
    protected $primaryKey = ['group_id','composite_group_id'];
    public $incrementing = false;

    public function group() {
      return $this->belongsTo(Group::class);
    }

}
