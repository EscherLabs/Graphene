#!/usr/bin/env bash

## This is a post deployment script which is intended to run on 
## Elastic Beanstalk: Amazon Linux 2.  It copies the Elastic Beanstalk
## Environment Variables into a local .env file in the production
## app deployment directory, and allows command-line based commands
## like php artisan to function correctly.

# Target .env file location: 
DOTENV_FILE="/var/app/current/.env"

# Extract the Elastic Beanstalk Environment Configuration Data
ENVIRONMENT_JSON=`/opt/elasticbeanstalk/bin/get-config environment`

# Clear out any existing .env file data
cat /dev/null > $DOTENV_FILE

# Convert the ENVIRONMENT_JSON to .env file format
while read -rd $'' line
do
    echo "$line" >> $DOTENV_FILE
done < <(jq -r <<< $ENVIRONMENT_JSON \
         'to_entries|map("\(.key)=\"\(.value)\"\u0000")[]')

# Run Graphene Compilation Script and Update .env
cd /var/app/current
/usr/bin/php artisan compile