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
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
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
      foreignKey: {
        allowNull: false
      }
    });

    Request.hasMany(models.Invite);
  };

  return Request
};