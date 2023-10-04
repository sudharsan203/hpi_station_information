'use strict';

const Hapi = require('@hapi/hapi');
const axios = require('axios')
const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {

            return 'Hello World!';
        }
    });
    // server.route({
    //     method: 'GET',
    //     path: '/stationinformation',
    //     handler: (request, h) => {
    //         return getListOfStations()
    //     }
    // });
    server.route(require('./station_information').station_information_list);
    server.route(require('./converttocsv').json_to_csv);
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

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

init();