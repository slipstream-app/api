var DataTypes = require("sequelize").DataTypes;
var _circuits = require("./circuits");
var _comments = require("./comments");
var _invitations = require("./invitations");
var _laps = require("./laps");
var _pilots = require("./pilots");
var _races = require("./races");
var _user_race = require("./user_race");
var _users = require("./users");

function initModels(sequelize) {
    var circuits = _circuits(sequelize, DataTypes);
    var comments = _comments(sequelize, DataTypes);
    var invitations = _invitations(sequelize, DataTypes);
    var laps = _laps(sequelize, DataTypes);
    var pilots = _pilots(sequelize, DataTypes);
    var races = _races(sequelize, DataTypes);
    var user_race = _user_race(sequelize, DataTypes);
    var users = _users(sequelize, DataTypes);

    races.belongsToMany(users, {
        as: "users1",
        through: comments,
        foreignKey: "race_id",
        otherKey: "user_id",
    });
    races.belongsToMany(users, {
        as: "users2",
        through: invitations,
        foreignKey: "race_id",
        otherKey: "user_id",
    });
    races.belongsToMany(users, {
        through: user_race,
        foreignKey: "race_id",
        otherKey: "user_id",
    });
    users.belongsToMany(races, {
        as: "racesCommented",
        through: comments,
        foreignKey: "user_id",
        otherKey: "race_id",
    });

    races.belongsToMany(users, {
        through: pilots,
        as: "drivers",
        foreignKey: "race_id",
        otherKey: "user_id",
    });
    users.belongsToMany(races, {
        as: "racesDriven",
        through: pilots,
        foreignKey: "user_id",
        otherKey: "race_id",
    });

    users.belongsToMany(races, {
        as: "racesInvited",
        through: invitations,
        foreignKey: "user_id",
        otherKey: "race_id",
    });
    users.belongsToMany(races, {
        through: user_race,
        foreignKey: "user_id",
        otherKey: "race_id",
    });
    races.belongsTo(circuits, {
        as: "circuit",
        foreignKey: "circuit_id",
    });
    circuits.hasMany(races, {
        as: "races3",
        foreignKey: "circuit_id",
    });
    laps.belongsTo(pilots, {
        as: "pilots",
        foreignKey: "pilot_uuid",
    });
    pilots.hasMany(laps, {
        as: "laps",
        foreignKey: "pilot_uuid",
    });
    comments.belongsTo(races, {
        as: "race",
        foreignKey: "race_id",
    });
    races.hasMany(comments, {
        as: "comments",
        foreignKey: "race_id",
    });
    invitations.belongsTo(races, {
        as: "race",
        foreignKey: "race_id",
    });
    races.hasMany(invitations, {
        as: "invitations",
        foreignKey: "race_id",
    });
    laps.belongsTo(races, {
        as: "raceLapped",
        foreignKey: "race_id",
    });
    races.hasMany(laps, {
        as: "laps",
        foreignKey: "race_id",
    });
    pilots.belongsTo(races, {
        as: "race",
        foreignKey: "race_id",
    });
    races.hasMany(pilots, {
        as: "pilotsRaced",
        foreignKey: "race_id",
    });
    user_race.belongsTo(races, {
        as: "race2",
        foreignKey: "race_id",
    });
    races.hasMany(user_race, {
        as: "user_races",
        foreignKey: "race_id",
    });
    comments.belongsTo(users, {
        as: "user",
        foreignKey: "user_id",
    });
    users.hasMany(comments, {
        as: "comments",
        foreignKey: "user_id",
    });
    invitations.belongsTo(users, {
        as: "userInvited",
        foreignKey: "user_id",
    });
    users.hasMany(invitations, {
        as: "invitations",
        foreignKey: "user_id",
    });
    pilots.belongsTo(users, {
        as: "user",
        foreignKey: "user_id",
    });
    users.hasMany(pilots, {
        as: "pilotsRedeemed",
        foreignKey: "user_id",
    });
    races.belongsTo(users, {
        as: "leader",
        foreignKey: "leader_id",
    });
    users.hasMany(races, {
        foreignKey: "leader_id",
    });
    user_race.belongsTo(users, {
        as: "userRace",
        foreignKey: "user_id",
    });
    users.hasMany(user_race, {
        as: "user_racesx",
        foreignKey: "user_id",
    });

    return {
        circuits,
        comments,
        invitations,
        laps,
        pilots,
        races,
        user_race,
        users,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
