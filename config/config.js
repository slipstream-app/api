module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: "127.0.0.1",
        port: 3307,
        dialect: "mysql",
    },
};
