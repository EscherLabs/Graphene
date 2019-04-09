<?php
chdir(dirname(__file__));

// This code is provided as a reference for developing a Graphene Group
// Sync with with some local data source.  The code below relies on
// hard coded groups and group memberships, but it is anticipated that
// that code would be substituted for Active Directory or database driven 
// group populations.  Please copy / update / modify this code and generally
// use it as you see fit.
// Additional documentation regarding the group sync APIs is available here:
// https://github.com/EscherLabs/Graphene/wiki/Graphene-Group-Sync

// HTTPHelper is a helpful wrapper around file_get_contents
// and is useful for interfacing with 3rd party APIs
// This could all be done with PHP cURL, however.
include_once('../app/Libraries/HTTPHelper.php');
use App\Libraries\HTTPHelper;

class GrapheneGroupSync
{
  static private $users = [
    [
        'unique_id'=>1,
        'first_name'=>'John',
        'last_name'=>'Doe',
        'email'=>'jdoe1@example.com',
    ],
    [
        'unique_id'=>2,
        'first_name'=>'John',
        'last_name'=>'Doe',
        'email'=>'jdoe2@example.com',
    ],
    [
        'unique_id'=>3,
        'first_name'=>'Tony',
        'last_name'=>'Stark',
        'email'=>'tony.stark@avengers.com',
    ],
    [
        'unique_id'=>4,
        'first_name'=>'I Am',
        'last_name'=>'Groot',
        'email'=>'groot@groot.com',
    ],
];

static private $groups = [
    'STUDENTS'=>[1,2],
    'STAFF'=>[2,3,4],
  ];

  static private $graphene_url = 'http://timatwork.escherlabs.com:8000';
  static private $graphene_username = 'test';
  static private $graphene_password = 'test';
 
  static public function unique_ids_to_users($unique_ids) {
      $users = [];
      foreach(self::$users as $user) {
          if (in_array($user['unique_id'],$unique_ids)) {
            $users[] = $user;
          }
      }
      return $users;
  }

  static public function sync() {
    $httphelper = new HTTPHelper();
    foreach(self::$groups as $group_name => $correct_unique_ids) {
      echo('GROUP: '.$group_name."\n");
      echo('Looking Up Existing Members... '."\n");
      $graphene_response = $httphelper->http_fetch(self::$graphene_url.'/api/public/groups/members/'.$group_name,'GET',['status'=>'external'],self::$graphene_username,self::$graphene_password);
      if ($graphene_response['code'] == 200) {
        echo($group_name.' currently has '.count($graphene_response['content']).' members'."\n");
        
        $current_graphene_unique_ids = [];
        foreach($graphene_response['content'] as $user_index => $user) {
            $current_graphene_unique_ids[] = $user['unique_id'];
        }
        echo('Looking Up Correct Members... '."\n");
        // We already have this from existing loop

        echo($group_name.' should have '.count($correct_unique_ids).' members'."\n");
        $unique_ids_to_add = array_diff($correct_unique_ids, $current_graphene_unique_ids);
        $unique_ids_to_remove = array_diff($current_graphene_unique_ids, $correct_unique_ids);
        $members_to_add = self::unique_ids_to_users($unique_ids_to_add);
        $members_to_remove = self::unique_ids_to_users($unique_ids_to_remove);

        if (count($members_to_add) > 0) {
          echo('Attempting to add '.count($members_to_add).' new users to '.$group_name.'...'."\n");
          $graphene_response_add_users = $httphelper->http_fetch(self::$graphene_url.'/api/public/groups/members/'.$group_name,'POST',['members'=>$members_to_add],self::$graphene_username,self::$graphene_password);
          if ($graphene_response_add_users['code'] == 200) {
            echo('Successfully Added '.count($members_to_add).' new users to '.$group_name."\n");          
          } else {
            echo('Failed to Add '.count($members_to_add).' new users to '.$group_name.' with ERROR: '.$graphene_response_add_users['content']."\n");
          }
        } else {
          echo('No members to Add'."\n");
        }
        if (count($members_to_remove) > 0) {
          echo('Attempting to remove '.count($members_to_remove).' users from '.$group_name.'...'."\n");          
          $graphene_response_remove_users = $httphelper->http_fetch(self::$graphene_url.'/api/public/groups/members/'.$group_name,'DELETE',['members'=>$members_to_remove],self::$graphene_username,self::$graphene_password);
          if ($graphene_response_remove_users['code'] == 200) {
            echo('Successfully Removed '.count($members_to_remove).' users from '.$group_name."\n");          
          } else {
            echo('Failed to Remove '.count($members_to_remove).' users from '.$group_name."\n");//.' with ERROR: '.$graphene_response_remove_users['content']);
          }
        } else {
          echo('No members to Remove'."\n");
        } 
      } else {
        echo("Unable to Retrieve Members from Graphene.  Does Group Exist?\n");
      }
      echo('');
    }
  }

}

GrapheneGroupSync::sync();