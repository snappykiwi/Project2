module.exports = function (sequelize, DataTypes) {
    let Invite = sequelize.define("invite", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100]
            }
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        time: {
            type: DataTypes.TIME,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
        },
        status: {
            type: DataTypes.BOOLEAN,
        },
    });

    // Invite.associate = function(models) {

    //     Invite.belongsTo(models.User, {

    //     });

    // };

    // Invite.associate = function(models) {

    //     Invite.belongsTo(models.Event, {

    //     });

    // };

    return Invite;

};