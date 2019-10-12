module.exports = function (sequelize, DataTypes) {
  let Event = sequelize.define("Event", {
    eventTitle : {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 100]
      }
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    eventDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    attendee: {
      type: DataTypes.STRING
    }
  });

  // Event.associate = function(models) {

  //   Event.hasMany(models.Invite, {

  //   });

  // };

  Event.associate = function(models) {
    Event.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  }
  
  return Event;

};