const axios = require('axios')

let stationList = [];
let updatedStationList = [];

exports.station_information_list = {
    method: 'GET',
    path: '/stationinformation',
    handler: async (request, h) => {
        stationList = await getListOfStations();
        stationList.forEach((station) => {
            //Rename:: external_id, station_id, and legacy_id into externalId, stationId, and legacyId.legacy ID is not presented in an object.
            // Remove rental_methods and rental_uris from the output.Updated data will get in `updatedStationList`.

            let { external_id: externalId, station_id: stationId, rental_methods, rental_uris, ...newStationData } = station;
            station = { externalId, stationId, ...newStationData }
            updatedStationList.push(station)
        });
        return updatedStationList;
    }
}
async function getListOfStations() {
    const response = await axios({
        url: "https://gbfs.divvybikes.com/gbfs/en/station_information.json",
        method: "get",
    })
        .then(response => {
            return response.data.data.stations
        })
        .catch((err) => {
            console.log(err)
        });
    return response;
}