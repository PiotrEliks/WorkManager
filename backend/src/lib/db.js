import Sequelize from "sequelize";

const database_uri = "postgresql://neondb_owner:npg_bEFGUpDfI7Z6@ep-yellow-star-a5ix845j-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require";

const sequelize = new Sequelize(database_uri, {
    dialect: "postgres",
    dialectOprions: {
        ssl: true
    }
});

export const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("PostgreSQL connected");
    } catch (error) {
        console.error("PostgreSQL connection error: ", error);
    }
};

export default sequelize;