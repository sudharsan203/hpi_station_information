const axios = require('axios')
const converter = require('json-2-csv')
const fs = require('fs')
const data = require('./output.json');
var AWS = require('aws-sdk');
var path = require('path');
// Set the region 
AWS.config.update({
    region: 'REGION', accessKeyId: "<Access Key Here>",
    secretAccessKey: "<Secret Access Key Here>"
});

// Create S3 service object
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });

// call S3 to retrieve upload file to specified bucket
var uploadParams = { Bucket: '', Key: '', Body: '' };
var file = process.argv[3];

exports.json_to_csv = {
    method: 'GET',
    path: '/jsontocsv',
    handler: async (request, h) => {
        return convertJSONToCSV(data);
    }
}
function convertJSONToCSV(data) {
    const response = converter
        .json2csv(data)
        .then(csv => {
            console.log(csv)
            fs.writeFileSync('stationInformation.csv', csv);
            return "JSON file converted to CSV successfully"
        })
        .catch(err => console.log(err))
    return response
}

function uploadCSVFileToS3() {
    var fileStream = fs.createReadStream('./stationInformation.csv');
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    uploadParams.Body = fileStream;
    uploadParams.Key = Date.now() + "_" + path.basename('./stationInformation.csv')

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
        }
    });
}
