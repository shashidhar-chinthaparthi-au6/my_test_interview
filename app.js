
var fs = require('fs');
var csv = require('fast-csv');
const pool = require('./pgdb');

pool.connect(function(err){
    if(err)
    {
        console.log(err);
    }
});

let counter = 0; 

// let header = [];
// let data = [];

let csvStream = csv.fromPath(".\\csv\\5m Sales Records.csv", { headers: true })
    .on("data", function(record){
        csvStream.pause();

        if(counter < 100)
        {
            let region = record.region;
            let country = record.country;
          

            pool.query("INSERT INTO FL_insurance_sample(region, country) \
            VALUES($1, $2, $3, $4, $5, $6, $7)", [region, country], function(err){
                if(err)
                {
                    console.log(err);
                }
            });
            ++counter;
        }

        csvStream.resume();

    }).on("end", function(){
        console.log("Job is done!");
    }).on("error", function(err){
        console.log(err);
    });