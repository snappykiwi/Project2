module.exports = function(sequelize, DataTypes) {
  
  return User = sequelize.define("User", {

    name : {
      type : DataTypes.STRING,
      allowNull : false
    }

  });

};
