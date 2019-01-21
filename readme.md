<h1>Graphene</h1>

## About Graphene

Graphene is a fully featured 'Low Code Development' and 'Content Management' Platform built on top of Laravel 5.

### Videos / Tutorials
[Introduction to Graphene](https://www.youtube.com/watch?v=qaTPaJ3DFmM)

## Dependencies
 - MySQL 5.7.8 or Later
 - PHP 7.1 or Later 
 - Composer (Latest)
## Installation Instructions
### Clone the Code:
     git clone https://github.com/EscherLabs/Graphene.git

### Install All Dependencies
From within the root directory of the Graphene application run:

    composer install

### Modify your /etc/hosts File
For a production installation of Graphene, you will want to create a 'CNAME' or an 'A' DNS record
which resolves back to the appropriate IP.  For a local installation, however (and simiplicty),
add the following to your /etc/hosts file:

    # Add the following line
    127.0.0.1       graphenedev.local

### Serve up the Application with Artisan
For a production installation of Graphene, you will want to use a proper webserver. 
(for example: Apache)  For a local installation, however (and simplicity), run the following command
from within the root Graphene directory:

    php artisan serve --host=graphenedev.local

### Visit the site in your Web Browser
1. Open up a web browser and navigate to http://graphenedev.local:8000/
2. Follow the steps to create the Graphene Database and configure your .env file
3. Follow the steps to create your Graphene Site
4. Follow the steps to create the initial Graphene user / Site Admin

## License

The Graphene Framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT).
