const convertTime = require("./convert-time");
module.exports = {
    handlePilotPayload(payload) {
        var distanceRegex = /(-[0-9])\svolta\(S\)/i;

        if (payload.uuid) delete payload.uuid;
        if (payload.last_lap) payload.last_lap = convertTime(payload.last_lap);
        if (payload.best_lap) payload.best_lap = convertTime(payload.best_lap);
        if (payload.leader_distance) {
            let strMatch = distanceRegex.exec(payload.leader_distance);
            if (strMatch) {
                payload.leader_distance = strMatch[1];
            } else {
                payload.leader_distance = convertTime(payload.leader_distance);
            }
        }
        if (payload.previous_distance) {
            let strMatch = distanceRegex.exec(payload.previous_distance);
            if (strMatch) {
                payload.previous_distance = strMatch[1];
            } else {
                payload.previous_distance = convertTime(
                    payload.previous_distance
                );
            }
        }
        return payload;
    },

    handleLapPayload(payload) {
        var distanceRegex = /(-[0-9])\sVOLTA\(S\)/i;

        if (payload.time) payload.time = convertTime(payload.time);

        if (payload.best_lap_distance) {
            let strMatch = distanceRegex.exec(payload.best_lap_distance);
            if (strMatch) {
                payload.best_lap_distance = strMatch[1];
            } else {
                payload.best_lap_distance = convertTime(
                    payload.best_lap_distance
                );
            }
        }

        if (payload.best_leader_lap_distance) {
            let strMatch = distanceRegex.exec(payload.best_leader_lap_distance);
            if (strMatch) {
                payload.best_leader_lap_distance = strMatch[1];
            } else {
                payload.best_leader_lap_distance = convertTime(
                    payload.best_leader_lap_distance
                );
            }
        }

        if (payload.total_time)
            payload.total_time = convertTime(payload.total_time);
        return payload;
    },
};
