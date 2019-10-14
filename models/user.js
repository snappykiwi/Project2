const bcrypt = require("bcryptjs");

module.exports = function (sequelize, DataTypes) {

  let User = sequelize.define("User", {

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }

  });

  User.prototype.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.addHook("beforeCreate", function(user) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
  });

  User.associate = function(models) {
    User.hasMany(models.Event);

    User.hasMany(models.Request);

    User.belongsToMany(models.Request, {through: 'user_requests', constraints: false});

    User.belongsToMany(models.Event, { as: 'attender', through: 'user_events', constraints: false});

    User.belongsToMany(models.Invite, {through: 'user_invites'});

  };

  return User;

};