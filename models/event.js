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
    }
  });

  Event.associate = function(models) {

    Event.belongsToMany(models.User, {as: 'events', through: 'user_events', constraints: false});
    Event.belongsTo(models.User, {constraints: false});

    Event.hasMany(models.Invite, {
      foreignKey: 'invitable_id',
      constraints: false,
      scope: {
        invitable: 'event'
      }
    });
  }

  return Event;

};