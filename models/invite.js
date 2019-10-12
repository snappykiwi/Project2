module.exports = function (sequelize, DataTypes) {
    return Invite = sequelize.define("invite", {
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

};