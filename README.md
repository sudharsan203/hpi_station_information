# Building a  with Node.js, Hapi #
## We’ll be building a RESTful API with Node.js, Hapi. ##

*Hapi.js* (shorthand for Http-API, pronounced happy and also known as hapi) is an open-source Node.js framework used to build powerful and scalable web applications.


### Installation ###
```
$ npm install
```
### Start App ###
```
$ npm start
```
### Start App using Nodemon ###
```
$ npm run dev
```
### PG&E - MRAD Node.js Coding Challenge ###

You need to create an AWS lambda function to do the following:
Create a RESTful API which executes the following steps for every request

a. Pull data from this url (Microsoft edge): https://gbfs.divvybikes.com/gbfs/en/station_information.json

b. Make some changes to the output from the url above:
    1. Remove rental_methods and rental_uris from the output.
    2. Rename: external_id, station_id, and legacy_id into externalId, stationId, and legacyId.
    3. Return the data when the capacity is less than 12.

c. Convert your JSON output into CSV.
d. Write your output into a filesystem as a .csv file.
e. Upload your file to S3. (overwrite or create a new file)
