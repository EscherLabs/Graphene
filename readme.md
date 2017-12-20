<h1>Graphene</h1>

## About Graphene

Graphene is a fully featured Application Development and Content Management Engine built on top of Laravel 5.

Note: This project is in the process of merging with the Binghamton University Open Source "Graphene" project which runs the my.binghamton.edu user experience platform / portal.  (https://github.com/BinghamtonUniversity/Graphene) While the code is largely functional (though not quite production ready), it is not recommended for use outside of a development environment at this time. This merger effort (including proper documentation of installation, configuration, and general setup) is expected to be completed in the late first / early second quarter of 2018.

### Videos / Tutorials
[Introduction to Graphene](https://www.youtube.com/watch?v=qaTPaJ3DFmM)

## Dependencies
 - MySQL 5.7.8 or Later
 - PHP 7.0 or Later 
 - Composer (Latest)
## Installation Instructions
### Clone the Code:
     git clone https://github.com/EscherLabs/Graphene.git
### Setup the Database
From mysql, create the "crazystairs" database with the correct access permissions:

    create database crazystairs
    GRANT ALL ON crazystairs.* TO 'crazystairs'@'127.0.0.1' IDENTIFIED BY 'crazystairs';
Note: you can change the database name, username, and password, etc in the ".env" file in the root of the Graphene application.  The .env file does not exist by default, so you will need to create one if you want to change the following defaults::

    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=crazystairs
    DB_USERNAME=crazystairs
    DB_PASSWORD=crazystairs

### Install All Dependencies
From within the root directory of the Graphene application run:

     composer install
### Run All Database Migrations
From within the root directory of the Graphene application run:

     php artisan migrate:refresh --seed

### Update database defaults
From mysql (within the database you set up previously), run the following (substituting user@example.com with your email address):

    use crazystairs;
    update users set email = 'user@example.com' where id = 1;
    updates sites set auth = 'basic' where id = 1;
Note: This will set your username as the default user, and disable CAS Authentication (use basic authentication instead).
### Modify your /etc/hosts File
The default site for graphene (as created by the initial database seed) is graphenedev.local.  You will need to point this to 127.0.0.1 in your /etc/hosts file.  

    #Add the following line
    127.0.0.1       graphenedev.local

### Serve up the Application with Artisan
From within the root directory of the Graphene application run:

     php artisan serve --host=graphenedev.local

### Visit the site in your Web Browser
1. Open up a web browser and navigate to http://graphenedev.local:8000/
2. Log in with the email address you set up previously and the default password "crazystairs"

## License

The Graphene Framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
