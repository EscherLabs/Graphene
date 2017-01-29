<?php

return [
    /*
    |----------------------------------------------------------------------------
    | Google application name
    |----------------------------------------------------------------------------
    */
    'application_name' => env('GOOGLE_APPLICATION_NAME', 'CrazyStairs'),

    /*
    |----------------------------------------------------------------------------
    | Google OAuth 2.0 access
    |----------------------------------------------------------------------------
    |
    | Keys for OAuth 2.0 access, see the API console at
    | https://developers.google.com/console
    |
    */
    'client_id'       => env('GOOGLE_CLIENT_ID', '820427137613-eg6d8e4v2b2nbacp75pr8vp1q9f2ag6o.apps.googleusercontent.com'),
    'client_secret'   => env('GOOGLE_CLIENT_SECRET', '5pp0biJD9nUgGQWaECuOKnA0'),
    'redirect_uri'    => env('GOOGLE_REDIRECT', 'http://127.0.0.1:8000/api/endpoints/google_callback'),
    'scopes'          => [Google_Service_Sheets::SPREADSHEETS_READONLY],
    'access_type'     => 'online',
    'approval_prompt' => 'auto',

    /*
    |----------------------------------------------------------------------------
    | Google developer key
    |----------------------------------------------------------------------------
    |
    | Simple API access key, also from the API console. Ensure you get
    | a Server key, and not a Browser key.
    |
    */
    'developer_key' => env('GOOGLE_DEVELOPER_KEY', 'AIzaSyAp_6TZs_tca0yMBhcg9f8WH0iSZ_xKh8I'),

    /*
    |----------------------------------------------------------------------------
    | Google service account
    |----------------------------------------------------------------------------
    |
    | Set the credentials JSON's location to use assert credentials, otherwise
    | app engine or compute engine will be used.
    |
    */
    'service' => [
        /*
        | Enable service account auth or not.
        */
        'enable' => env('GOOGLE_SERVICE_ENABLED', false),

        /*
        | Path to service account json file
        */
        'file' => env('GOOGLE_SERVICE_ACCOUNT_JSON_LOCATION', '')
    ],
];
