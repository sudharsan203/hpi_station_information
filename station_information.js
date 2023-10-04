const axios = require('axios')
const converter = require('json-2-csv')
const fs = require('fs')
var AWS = require('aws-sdk');

let stationList = [];
let updatedStationList = [];

exports.station_information_list = {
    method: 'GET',
    path: '/stationinformation',
    handler: async (request, h) => {
        stationList = await getListOfStations();
        return stationList;
    }
}
async function getListOfStations() {
    const response = await axios({
        url: "https://gbfs.divvybikes.com/gbfs/en/station_information.json",
        method: "get",
    })
        .then(response => {
            //Rename:: external_id, station_id, and legacy_id into externalId, stationId, and legacyId.legacy ID is not presented in an object.
            //Remove rental_methods and rental_uris from the output.Updated data will get in `updatedStationList`.
            response.data.data.stations.forEach((station) => {
                let { external_id: externalId, station_id: stationId, rental_methods, rental_uris, ...newStationData } = station;
                station = { externalId, stationId, ...newStationData }
                updatedStationList.push(station)
            });
            return { status: 'success', stationList: updatedStationList };
        })
        .catch((err) => {
            console.log(err)
        });
    if (response.status == 'success') {
        var resFromjsontocsv = await convertJSONToCSV(updatedStationList)
    }
    console.log("Response from csv=>", resFromjsontocsv)
    return resFromjsontocsv;
}

async function convertJSONToCSV(data) {
    const response = await converter
        .json2csv(data)
        .then(csv => {
            fs.writeFileSync('stationInformation.csv', csv);
            return { status: "success", response: "JSON file converted to CSV & downloaded successfully" }
        })
        .catch(err => console.log(err));
    console.log("response in convertJSONToCSV=>", response)
    if (response.status == 'success') {
        // var ress3Upload = await uploadCSVFileToS3()
    }
    return response
}

AWS.config.update({
    region: 'REGION',
    accessKeyId: "<Access Key Here>",
    secretAccessKey: "<Secret Access Key Here>"
});

// call S3 to retrieve upload file to specified bucket
function uploadCSVFileToS3() {

    var fileStream = fs.createReadStream('./stationInformation.csv');
    fileStream.on('error', function (err) {
        console.log('File Error', err);
    });
    var s3 = new AWS.S3();
    var uploadParams = { Bucket: '', Key: '', Body: '' };
    uploadParams.Body = fileStream;
    uploadParams.Key = Date.now() + "_" + path.basename('./stationInformation.csv')

    // call S3 to retrieve upload file to specified bucket
    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error", err);
        } if (data) {
            console.log("Upload Success", data.Location);
            var s3Response = { status: "Success", s3Data: data }
        }
    });
    return s3Response;
}