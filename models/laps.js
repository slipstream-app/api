const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('laps', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    time: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Lap time must be an integer'
        },
        min: {
          args: [1],
          msg: "Lap time must be greater than 0 ms"
        }
      }
    },
    race_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'races',
        key: 'id'
      }
    },
    pilot_uuid: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: 'pilots',
        key: 'uuid'
      }
    },
    best_lap_distance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Best lap distance must be an integer'
        },
        min: {
          args: [1],
          msg: "Best lap distance must be greater than 0 ms"
        }
      }
    },
    best_leader_lap_distance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Best leader lap must be an integer'
        },
        min: {
          args: [1],
          msg: "Best leader lap must be greater than 0 ms"
        }
      }
    },
    total_time: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Total time must be an integer'
        },
        min: {
          args: [1],
          msg: "Total time Must be greater than 0 ms"
        }
      }
    },
    avg_speed: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isFloat: {
          msg: 'Average speed must be a float number'
        },
        min: {
          args: [1],
          msg: "Average speed must be greater than 0 ms"
        }
      }
    },
    lap_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'Lap number must be an integer'
        },
        min: {
          args: [1],
          msg: "Lap number must be greater than 0"
        }
      }
    },
  }, {
    sequelize,
    tableName: 'laps',
    timestamps: false,
    indexes: [{
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [{
          name: "id"
        }, ]
      },
      {
        name: "fk_laps_pilot1_idx",
        using: "BTREE",
        fields: [{
          name: "pilot_uuid"
        }, ]
      },
      {
        name: "fk_laps_race1",
        using: "BTREE",
        fields: [{
          name: "race_id"
        }, ]
      },
    ]
  });
};