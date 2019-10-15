module.exports = function(sequelize, DataTypes) {
  let Invite = sequelize.define("Invite", {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME, 
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      allowNull: false
    }
  }, {
    scopes: {
      pending: {
        where: {
          status: "pending"
        }
      },
      accepted: {
        where: {
          status: "accepted"
        }
      },
    }
  });

  Invite.associate = function(models) {
    
    Invite.belongsTo(models.Request, {
      foreignKey: 'invitable_id',
      constraints: false,
      as: 'request'
    });
    
    Invite.belongsTo(models.Event, {
      foreignKey: 'invitable_id',
      as: 'event'
    });

    Invite.belongsTo(models.User, {
      
    });

  };

  return Invite


};