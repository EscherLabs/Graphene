<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    protected $fillable = ['group_id', 'name', 'slug', 'content', 'mobile_order','unlisted','public','icon','device','groups'];
    protected $casts = ['content' => 'object', 'mobile_order' => 'array','groups'=>'array'];
    protected $appends = ['hidden_xs', 'hidden_sm', 'hidden_md', 'hidden_lg', 'composite_limit'];
    // protected $hidden = ['groups'];

    /* Transient Properties not saved in the database */
    public $hidden_xs = false;
    public $hidden_sm = false;
    public $hidden_md = false;
    public $hidden_lg = false;
    public $composite_limit = false;

    public function group() {
      return $this->belongsTo(Group::class);
    }

    public function getHiddenXsAttribute()
    {
        return ($this->device === 1 || $this->device === 2);  
    }
    public function getHiddenSmAttribute()
    {
        return ($this->device === 1 || $this->device === 4);  
    }
    public function getHiddenMdAttribute()
    {
        return ($this->device === 3 || $this->device === 4);  
    }
    public function getHiddenLgAttribute()
    {
        return ($this->device === 3 || $this->device === 4);  
    }
    public function getCompositeLimitAttribute() {
        return (is_array($this->groups) && count($this->groups) > 0);
    }
}