<?php 

namespace App\Libraries;

class HTTPHelper {

    public function http_fetch($url, $verb='GET', $request_data=[],$username=null,$password=null) {
        // Build HTTP Request
        $request_config = [];
        $request_config['method'] = $verb;
        $request_config['header'] = 'Content-type: application/x-www-form-urlencoded';
        if (!is_null($username)) {
            $request_config['header'] .= "\r\nAuthorization: Basic ".base64_encode($username.':'.$password);
        }
        if ($verb == 'GET') {
            $url_parts = parse_url($url);
            $url_parts_query = [];
            if(array_key_exists('query', $url_parts)){
                parse_str($url_parts['query'],$url_parts_query);
            }
            if(array_key_exists('scheme', $url_parts) && array_key_exists('host', $url_parts)) {
                $url = $url_parts['scheme'].'://'.$url_parts['host'];
                if(array_key_exists('port', $url_parts)) {
                    $url .= ':'+$url_parts['port'];
                }
                if(array_key_exists('path', $url_parts)) {
                    $url .= $url_parts['path'];
                }
                $url .= '?'.http_build_query(array_merge($request_data,$url_parts_query));
            }else{
                abort(400);             
            }
        } else {
            $request_config['content'] = http_build_query($request_data);
        }
        $context = stream_context_create(['http' =>$request_config]);
        $response = @file_get_contents($url, false, $context);
        if ($response === FALSE) {
            return error_get_last();
        }

        // Check if the data we got back was JSON Formatted
        foreach($http_response_header as $header) {
            if (stristr($header, 'Content-Type: application/json')) {
                $response = json_decode($response,true);
                break;
            }
        }
        return $response;
    }
}