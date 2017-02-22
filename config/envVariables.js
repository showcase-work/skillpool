module.exports = {
mysql: {
        username: process.env.SP_DB_USERNAME,
        password: process.env.SP_DB_PASSWORD,
        database: process.env.SP_DB_NAME,
        options:{
            host: process.env.SP_DB_HOST,
            timezone: '+05:30'
        } 
    }
}