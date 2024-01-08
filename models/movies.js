const helper = require("../services/helper");

module.exports = function model(sequelize, types) {
  const Movies = sequelize.define(
    "movies",
    {
      movie_id: {
        type: types.UUID,
        defaultValue: types.UUIDV4,
        primarykey: true,
        unique: true,
      },
      image: {
        type: types.STRING,
        allowNull: false,
      },
      movie_name: {
        type: types.STRING,
        allowNull: false,
      },
      release_year: {
        type: types.INTEGER,
        allowNull: false,
      },
      movie_desc: {
        type: types.STRING,
        allowNull: false,
      },
      user_id: {
        type: types.UUID,
        references: {
          model: {
            tableName: "users",
          },
          key: "user_id",
        },
      },
    },

    {
      tableName: "movies",
      timestamps: false,
    }
  );

  Movies.associate = function (models) {
    Movies.hasMany(models.ratings, {
      as: "ratings",
      foreignKey: "movie_id",
      sourceKey: "movie_id",
    });
    Movies.belongsTo(models.users, {
      as: "addedBy",
      foreignKey: "user_id",
      targetKey: "user_id",
    });
  };
  return Movies;
};
