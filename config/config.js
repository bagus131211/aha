const dotenv = require("dotenv");
const dotenvConfig = require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: Number(process.env.POOL_MAX),
      min: Number(process.env.POOL_MIN),
      acquire: Number(process.env.POOL_ACQUIRE),
      idle: Number(process.env.POOL_IDLE),
    },
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    pool: {
      max: Number(process.env.POOL_MAX),
      min: Number(process.env.POOL_MIN),
      acquire: Number(process.env.POOL_ACQUIRE),
      idle: Number(process.env.POOL_IDLE),
    },
  },
  production: {
    use_env_variable: "HEROKU_POSTGRESQL_CHARCOAL_URL",
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    pool: {
      max: Number(process.env.POOL_MAX),
      min: Number(process.env.POOL_MIN),
      acquire: Number(process.env.POOL_ACQUIRE),
      idle: Number(process.env.POOL_IDLE),
    },
  },
};
