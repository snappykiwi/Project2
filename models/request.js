module.exports = function(sequelize, DataTypes) {
  let Request = sequelize.define("Request", {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },
    dateStart: {
      type: DataTypes.DATE,
      allowNull: false
    },
    dateEnd: {
      type: DataTypes.DATE,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME, 
      allowNull: true
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    duration: {
      type: DataTypes.FLOAT(4),
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      len: [1,20]
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
      allowNull: false
    }

  });

  Request.associate = function(models) {
    
    Request.belongsTo(models.User, {
      // as: 'Sender',
      constraints: false
    });

    Request.belongsToMany(models.User, {
      through: 'user_requests',
      constraints: false
    });

    Request.hasMany(models.Invite, {
      foreignKey: 'invitable_id',
      constraints: false,
      scope: {
        invitable: 'request'
      }
    });
  };

  return Request
};