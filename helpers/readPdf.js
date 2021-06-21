const fs = require("fs");
const pdfParse = require("pdf-parse");
const convertTime = require("./convert-time");
module.exports = {
    async readRacePdf(file) {
        //  const pdfFile = fs.readFileSync('helpers/test2.pdf');
        let data = await pdfParse(file);
        var myRegexp =
            /([0-9]{2},[0-9]{2})([0-9][0-9]?)\s([0-9]{1,2})([0-9]{2}\:[0-9]{2}\.[0-9]{3})([^0-9]+)([0-9]{1,2})([0-9]{2})[A-Z]{2}([0-9]{1,2}:[0-9]{2}\.[0-9]{3})([0-9]{1,2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})(-[0-9]\sVOLTA\(S\)|\-{3}|[0-9]{1,2}:[0-9]{2}\.[0-9]{3})(-[0-9]\sVOLTA\(S\)|\-{3}|[0-9]{1,2}:[0-9]{2}\.[0-9]{3})/;
        var lines = data.text.split("\n");
        let arr = [];
        lines.forEach((line) => {
            let strMatch = myRegexp.exec(line);
            if (strMatch) {
                arr.push(strMatch);
            }
        });

        let pilots = [];
        arr.forEach((element) => {
            let obj = {
                avg_speed: element[1].replace(",", "."),
                kart_number: element[2],
                position: element[3],
                last_lap: convertTime(element[4]),
                name: element[5],
                best_lap_number: element[6],
                number_of_laps: element[7],
                best_lap: convertTime(element[8]),
                total_time: convertTime(element[9]),
                leader_distance: convertTime(element[10]),
                previous_distance: convertTime(element[11]),
            };

            pilots.push(obj);
        });

        return pilots;
    },

    async readLapPdf() {
        const pdfFile = fs.readFileSync("helpers/test5.pdf");
        let data = await pdfParse(pdfFile);
        var regex1 =
            /([0-9]{1,2})([^0-9]+)([0-9]{1,2})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})/;
        var regex2 =
            /([0-9]{1,2})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})([0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{3})/;

        var lines = data.text.split("\n");
        // await fs.writeFileSync('helpers/test3.txt', data.text)
        let laps = [];
        let pilotName;
        let kartNumber;
        let startIndex;

        let lap;
        for (let index = 0; index < lines.length; index++) {
            const element = lines[index];

            let strMatch = regex1.exec(element);
            if (strMatch) {
                pilotName = strMatch[2].trim();
                kartNumber = strMatch[1];
                lap = {
                    lap_number: strMatch[3],
                    time: convertTime(strMatch[4]),
                    best_lap_distance: convertTime(strMatch[5]),
                    best_leader_lap_distance: convertTime(strMatch[6]),
                    total_time: convertTime(strMatch[7]),
                    avg_speed: lines[index + 1].trim().replace(",", "."),
                };
                laps.push(lap);
                startIndex = index + 2;
                break;
            }
        }

        for (let index = startIndex; index < lines.length; index += 2) {
            const element = lines[index];
            let strMatch = regex2.exec(element);
            if (strMatch) {
                lap = {
                    lap_number: strMatch[1],
                    time: convertTime(strMatch[2]),
                    best_lap_distance: convertTime(strMatch[3]),
                    best_leader_lap_distance: convertTime(strMatch[4]),
                    total_time: convertTime(strMatch[5]),
                    avg_speed: lines[index + 1].trim().replace(",", "."),
                };
                laps.push(lap);
            }
        }

        return {
            pilot: pilotName,
            kart_number: kartNumber,
            laps: laps,
        };
    },
};
