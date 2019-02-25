<?php

//This is variable is an example - Just make sure that the urls in the 'idp' config are ok.
$idp_host = env('SAML2_IDP_HOST', 'https://securetest.binghamton.edu');

return $settings = array(

    /**
     * If 'useRoutes' is set to true, the package defines five new routes:
     *
     *    Method | URI                      | Name
     *    -------|--------------------------|------------------
     *    POST   | {routesPrefix}/acs       | saml_acs
     *    GET    | {routesPrefix}/login     | saml_login
     *    GET    | {routesPrefix}/logout    | saml_logout
     *    GET    | {routesPrefix}/metadata  | saml_metadata
     *    GET    | {routesPrefix}/sls       | saml_sls
     */
    'useRoutes' => true,

    'routesPrefix' => '/saml2',

    /**
     * which middleware group to use for the saml routes
     * Laravel 5.2 will need a group which includes StartSession
     */
    'routesMiddleware' => [],

    /**
     * Indicates how the parameters will be
     * retrieved from the sls request for signature validation
     */
    'retrieveParametersFromServer' => false,

    /**
     * Where to redirect after logout
     */
    'logoutRoute' => '/',

    /**
     * Where to redirect after login if no other option was provided
     */
    'loginRoute' => '/',


    /**
     * Where to redirect after login if no other option was provided
     */
    'errorRoute' => '/',




    /*****
     * One Login Settings
     */



    // If 'strict' is True, then the PHP Toolkit will reject unsigned
    // or unencrypted messages if it expects them signed or encrypted
    // Also will reject the messages if not strictly follow the SAML
    // standard: Destination, NameId, Conditions ... are validated too.
    'strict' => false, //@todo: make this depend on laravel config

    // Enable debug mode (to print errors)
    'debug' => env('APP_DEBUG', true),

    // If 'proxyVars' is True, then the Saml lib will trust proxy headers
    // e.g X-Forwarded-Proto / HTTP_X_FORWARDED_PROTO. This is useful if
    // your application is running behind a load balancer which terminates
    // SSL.
    'proxyVars' => false,

    // Service Provider Data that we are deploying
    'sp' => array(

        // Specifies constraints on the name identifier to be used to
        // represent the requested subject.
        // Take a look on lib/Saml2/Constants.php to see the NameIdFormat supported
        'NameIDFormat' => 'urn:oasis:names:tc:SAML:2.0:nameid-format:persistent',

        // Usually x509cert and privateKey of the SP are provided by files placed at
        // the certs folder. But we can also provide them with the following parameters
        'x509cert' => env('SAML2_SP_x509','
        MIICfDCCAeWgAwIBAgIBADANBgkqhkiG9w0BAQ0FADBaMQswCQYDVQQGEwJ1czEL
        MAkGA1UECAwCTlkxGTAXBgNVBAoMEEVzY2hlciBMYWJzLCBJbmMxIzAhBgNVBAMM
        Gmh0dHBzOi8vd3d3LmVzY2hlcmxhYnMuY29tMCAXDTE5MDIyNTIxNDEyOFoYDzIy
        OTIxMjEwMjE0MTI4WjBaMQswCQYDVQQGEwJ1czELMAkGA1UECAwCTlkxGTAXBgNV
        BAoMEEVzY2hlciBMYWJzLCBJbmMxIzAhBgNVBAMMGmh0dHBzOi8vd3d3LmVzY2hl
        cmxhYnMuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCj5VSfKKmTcw/F
        /dQQAj/25R/5sg2fGsSWHl4hlBfX41uNpdakwxTdnuY+KWV7q5ze6IHU4lXo53fK
        ogSb5hueC7E5NSQKDLx335b7rGEh9M9GK+9mRO8Z2aPJwJ4lR9FBI2pwKTyTIo4M
        ElfdpCoAYOqyekRW1isE2j/82zDq/wIDAQABo1AwTjAdBgNVHQ4EFgQUYR1E5wEg
        41oVrxpBBLMXvOkxrCYwHwYDVR0jBBgwFoAUYR1E5wEg41oVrxpBBLMXvOkxrCYw
        DAYDVR0TBAUwAwEB/zANBgkqhkiG9w0BAQ0FAAOBgQAXgD+9rOq/3mHOORI1KWja
        kc2jbtGJIfhElbLuFTRwyYqoWD+xJpH/qcrULdDnFwVUECJTsfGe0jCJAp0cZHJk
        DLpmr/So1/oKuep9VAgDPZODLx3XMy+HuwKLswFK/dNs+XFQQgYMUPJ1a3VyKpt+
        pau2XHxLOFTsMKEoA+nuOg==
        '),
        'privateKey' => env('SAML2_SP_PRIVATEKEY','
        MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKPlVJ8oqZNzD8X9
        1BACP/blH/myDZ8axJYeXiGUF9fjW42l1qTDFN2e5j4pZXurnN7ogdTiVejnd8qi
        BJvmG54LsTk1JAoMvHfflvusYSH0z0Yr72ZE7xnZo8nAniVH0UEjanApPJMijgwS
        V92kKgBg6rJ6RFbWKwTaP/zbMOr/AgMBAAECgYEAnxRKFY3HQooNBlUAD2XPphnw
        9lB/bi3yH+9r2FXA6tgQFiWgeB2t1AqWWkGd8fK5eZbd5b6mOkDpAfJOXO91X1z/
        /Q9SM08P5P4qajbzq2M5yjz9YZHpZC1jrZdpIneDs+Y7wyGPNXVDrC2j4qXsXPp8
        CuJbgL4IZ/dye4AOfFECQQDUSabT/pSFGgoQUEZWoLeO9n2BffXZIlsTIakdtvWi
        13vrUWlnx/YuqK2AR4BB6tsGJPD0vKeMISfotLMFkAQpAkEAxaTKqhKR3GiwlVKD
        u2TVZ5e8D+OlpsY+z33SRpQ58s7dK0DHTwrxWAEA7JLkmz/EHbzHqESCDVdMN2k0
        mWka5wJBAKIKij5doC6tPqtPKzGqwhJtUkXKySNyFwTWd8mHw54GT7/Cx+uA9giN
        lspJSbyHMaJSBl85tca/9D+r1s7TLGkCQARBVwewXKmVK3AblbB8LEgNsUPaT9+2
        VvXarKNOX60FnSdoPqJKBwYxB1cQlpFtHwjQ3q+VwgMNhRuQTUycQbMCQEr0Fy4a
        /c37BF4D7+QIo6/mig6XIgqirFIlEkiZD8NI7v9zq04gdi1/eKqPiSaBOdBtZjTw
        KoVmnAs4iu3s+cI=
        '),

        // Identifier (URI) of the SP entity.
        // Leave blank to use the 'saml_metadata' route.
        'entityId' => env('SAML2_SP_ENTITYID',''),

        // Specifies info about where and how the <AuthnResponse> message MUST be
        // returned to the requester, in this case our SP.
        'assertionConsumerService' => array(
            // URL Location where the <Response> from the IdP will be returned,
            // using HTTP-POST binding.
            // Leave blank to use the 'saml_acs' route
            'url' => '',
        ),
        // Specifies info about where and how the <Logout Response> message MUST be
        // returned to the requester, in this case our SP.
        // Remove this part to not include any URL Location in the metadata.
        'singleLogoutService' => array(
            // URL Location where the <Response> from the IdP will be returned,
            // using HTTP-Redirect binding.
            // Leave blank to use the 'saml_sls' route
            'url' => '',
        ),
    ),

    // Identity Provider Data that we want connect with our SP
    'idp' => array(
        // Identifier of the IdP entity  (must be a URI)
        'entityId' => env('SAML2_IDP_ENTITYID', $idp_host . '/idp/shibboleth'),
        // SSO endpoint info of the IdP. (Authentication Request protocol)
        'singleSignOnService' => array(
            // URL Target of the IdP where the SP will send the Authentication Request Message,
            // using HTTP-Redirect binding.
            'url' => $idp_host . '/idp/profile/SAML2/Redirect/SSO',
        ),
        // SLO endpoint info of the IdP.
        'singleLogoutService' => array(
            // URL Location of the IdP where the SP will send the SLO Request,
            // using HTTP-Redirect binding.
            'url' => $idp_host . '/idp/profile/SAML2/Redirect/SLO',
        ),
        // Public x509 certificate of the IdP
        'x509cert' => env('SAML2_IDP_x509', 'MIIDPzCCAiegAwIBAgIUNGqshJMfDRUUamC/0judzWfXRzMwDQYJKoZIhvcNAQELBQAwIDEeMBwGA1UEAwwVaWRwLmNjLmJpbmdoYW10b24uZWR1MB4XDTE2MDExNzAxNDk1NloXDTM2MDExNzAxNDk1NlowIDEeMBwGA1UEAwwVaWRwLmNjLmJpbmdoYW10b24uZWR1MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmHJJsNq34KLbeCFXoLuyWFE8WeCRfagWHcU9cJhA26IoscpS031mgj+KdnZIGKBG8Qvm2ob8giNRC9A6dblsbmMgGbEXgugFXHzh7BL4THE/5vCoVXyT8cEcpneA51Cy1OK3hqv2OKD6QgIRgbovElJeJB/M2V/2cpD9eq7klxkHgvSdm0/QYhpqx50cFcB0WHXE8Mpr2tneHkl9tyBjbcXTYU3Bl6IfgJMFJ+DF70gVSu/hQz6eOzV1ZGTKd+k2iqyZqQaCfIL+c1suMSFtk4wKLkBQDP9JsSayvyKngLcbmc4/V3fV/HquxNpxuAjHUv8LUbDgAN3q0OWbuy4OIwIDAQABo3EwbzAdBgNVHQ4EFgQURTv5CG3wzpfj/BDoWcL3UncfFWAwTgYDVR0RBEcwRYIVaWRwLmNjLmJpbmdoYW10b24uZWR1hixodHRwczovL2lkcC5jYy5iaW5naGFtdG9uLmVkdS9pZHAvc2hpYmJvbGV0aDANBgkqhkiG9w0BAQsFAAOCAQEAiCk13WUgaVpymalSbihawWqgkIxiiMclpWaWSY807rZFuIEUWJbnopgedt6H+BSIxX7A7w+GJfF4fS13mRRlEL2h9ONj4EwbznDNprCxcs+EG7FBpW6VKJd/gnj/VDss4JT6ZOLQodl3wQ5LvwZ1zEeu811FQxSQaEpf69GyaQ/FCs57MDOHqMiAWGux6mhUpGwo9S0bk2C8D6SapD1ZGWmqcyxudsabKDupSUKU2cwslxj8XVinRTx8zZuc6VkzTV9Rc4vzes6atMo8AD8L2+As/e7vxBbR8pu40t9LlPe7f2MalA8yCCxPOlEnljahXnbPNzvZc18kx0CUWRMMJQ=='),
        /*
         *  Instead of use the whole x509cert you can use a fingerprint
         *  (openssl x509 -noout -fingerprint -in "idp.crt" to generate it)
         */
        // 'certFingerprint' => '',
    ),



    /***
     *
     *  OneLogin advanced settings
     *
     *
     */
    // Security settings
    'security' => array(

        /** signatures and encryptions offered */

        // Indicates that the nameID of the <samlp:logoutRequest> sent by this SP
        // will be encrypted.
        'nameIdEncrypted' => false,

        // Indicates whether the <samlp:AuthnRequest> messages sent by this SP
        // will be signed.              [The Metadata of the SP will offer this info]
        'authnRequestsSigned' => false,

        // Indicates whether the <samlp:logoutRequest> messages sent by this SP
        // will be signed.
        'logoutRequestSigned' => false,

        // Indicates whether the <samlp:logoutResponse> messages sent by this SP
        // will be signed.
        'logoutResponseSigned' => false,

        /* Sign the Metadata
         False || True (use sp certs) || array (
                                                    keyFileName => 'metadata.key',
                                                    certFileName => 'metadata.crt'
                                                )
        */
        'signMetadata' => false,


        /** signatures and encryptions required **/

        // Indicates a requirement for the <samlp:Response>, <samlp:LogoutRequest> and
        // <samlp:LogoutResponse> elements received by this SP to be signed.
        'wantMessagesSigned' => false,

        // Indicates a requirement for the <saml:Assertion> elements received by
        // this SP to be signed.        [The Metadata of the SP will offer this info]
        'wantAssertionsSigned' => false,

        // Indicates a requirement for the NameID received by
        // this SP to be encrypted.
        'wantNameIdEncrypted' => false,

        // Authentication context.
        // Set to false and no AuthContext will be sent in the AuthNRequest,
        // Set true or don't present thi parameter and you will get an AuthContext 'exact' 'urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport'
        // Set an array with the possible auth context values: array ('urn:oasis:names:tc:SAML:2.0:ac:classes:Password', 'urn:oasis:names:tc:SAML:2.0:ac:classes:X509'),
        'requestedAuthnContext' => true,
    ),

    // Contact information template, it is recommended to suply a technical and support contacts
    'contactPerson' => array(
        'technical' => array(
            'givenName' => 'Tim Cortesi',
            'emailAddress' => 'tim@escherlabs.com'
        ),
        'support' => array(
            'givenName' => 'Tim Cortesi',
            'emailAddress' => 'tim@escherlabs.com'
        ),
    ),

    // Organization information template, the info in en_US lang is recomended, add more if required
    'organization' => array(
        'en-US' => array(
            'name' => 'Escher Labs, Inc',
            'displayname' => 'Escher Labs, Inc',
            'url' => 'https://www.escherlabs.com'
        ),
    ),

/* Interoperable SAML 2.0 Web Browser SSO Profile [saml2int]   http://saml2int.org/profile/current

   'authnRequestsSigned' => false,    // SP SHOULD NOT sign the <samlp:AuthnRequest>,
                                      // MUST NOT assume that the IdP validates the sign
   'wantAssertionsSigned' => true,
   'wantAssertionsEncrypted' => true, // MUST be enabled if SSL/HTTPs is disabled
   'wantNameIdEncrypted' => false,
*/

);
