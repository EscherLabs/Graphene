<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['group_id', 'name', 'slug', 'content', 'mobile_order','unlisted','public','icon','device'];

    protected $casts = ['content' => 'object', 'mobile_order' => 'object'];
    protected $appends = ['visible_xs', 'visible_sm', 'visible_md', 'visible_lg'];

    public function group() {
      return $this->belongsTo(Group::class);
    }

    public function getVisibleXsAttribute()
    {
        return ($this->device === 0 || $this->device === 3 || $this->device === 4);  
    }
    public function getVisibleSmAttribute()
    {
        return ($this->device === 0 || $this->device === 3 || $this->device === 4);  
    }
    public function getVisibleMdAttribute()
    {
        return ($this->device === 0 || $this->device === 2 || $this->device === 3);  
    }
    public function getVisibleLgAttribute()
    {
        return ($this->device === 0 || $this->device === 1 || $this->device === 2);  
    }
}