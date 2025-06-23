import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.POSTGRESQL_URI, {
    dialect: "postgres",
    dialectOprions: {
        ssl: true
    }
});

export default sequelize;