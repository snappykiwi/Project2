module.exports = function (sequelize, DataTypes) {
  return Event = sequelize.define("Event", {
    title: {
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

};