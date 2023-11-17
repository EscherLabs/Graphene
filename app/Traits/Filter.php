<?php
namespace App\Traits;

trait Filter {

    protected $defaultRoot = "data";
    protected $defaultRootSearchables = ['id','created_at','updated_at'];
    // public function scopeDataFilter($query, $q)
    // {
    //   if(!empty($q)){
    //     $queries = explode(' ',$q);
    //     foreach($queries as $search){

    //       $subquery = explode('=', $search);

    //       $query->where(
    //         implode('->', 
    //         array_filter(
    //           array_merge(
    //             explode('.', $this->filterRoot??$this->defaultRoot),//if $this->filterRoot is not defined on the model then use "data"
    //             explode('.', $subquery[0])
    //           )
    //           )
    //         ), 
    //         'LIKE', 
    //         $subquery[1]
    //       );
    //     }
    //   }
    //   return $query;
    // }



    protected function scopeFilter($query, $filter){
      if(empty($filter)) return $query;

      $filters = explode('||',$filter);
      // $filters = explode('&&',$filter); //look to add anding funcionallity 

      $operators = ['>=','<=','>','<','!=','=','LIKE','*', null];

      foreach($filters as $index=>$current_filter) {

          foreach($operators as $operator) {

              if (stristr($current_filter, $operator) && !is_null($operator)) {
                  $filter_parts = explode($operator,$current_filter);
                  switch($operator){                      
                    case '^':
                      $filter_parts[1] = $filter_parts[1].'%';
                      break;
                    case '$':
                      $filter_parts[1] = '%'.$filter_parts[1];
                      break;
                    case '*':
                      //if its an array use contains for this
                    case 'LIKE':
                      $filter_parts[1] = '%'.$filter_parts[1].'%';
                      break;
                  }
                  break;
              }
          }
          if (is_null($operator)) {
              continue; // Invalid Operator -- Ignore it and continue
          }

          if (!in_array($filter_parts[0], $this->filterRootSearchables??$this->defaultRootSearchables)) {
              $$filter_parts[0] = implode('->', 
                array_filter(
                  array_merge(
                    explode('.', $this->filterRoot??$this->defaultRoot),//if $this->filterRoot is not defined on the model then use "data"
                    explode('.', $filter_parts[0])
                  )
                  )
                );
          }
          if($index>0){
            $query->orWhere($filter_parts[0], $operator, $filter_parts[1]);
          }else{
            $query->where($filter_parts[0], $operator, $filter_parts[1]);
          }
      
      }
    } 




}