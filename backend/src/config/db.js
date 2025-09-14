// src/config/db.js
import { Sequelize } from "sequelize";

// const sequelize = new Sequelize("projeto_mobile_unisuam", "postgres", "crase", {
//   host: "1.0.90.90",
//   dialect: "postgres",
//   port: 5432,
//   logging: false,
// });

// export default sequelize;


const sequelize = new Sequelize("projeto_mobile_unisuam", "postgres", "123456", {
  host: "localhost",
  dialect: "postgres",
  port: 5432,
  logging: false,
});

export default sequelize;
