
const { Sequelize, DataTypes } = require('sequelize');
const PrescriptionModelSequelize = require('../models/prescription');
const PatientModelSequelize = require('../models/patient');
const PharmacyModelSequelize = require('../models/pharmacy');
const PhysicianModelSequelize = require('../models/physician');


const sequelize = new Sequelize('e_prescription', 'root', '', {
    host: 'localhost',
    dialect: 'mariadb',
    logging: false
});

const PrescriptionModel = PrescriptionModelSequelize(sequelize, DataTypes)
const PatientModel = PatientModelSequelize(sequelize, DataTypes)
const PharmacyModel = PharmacyModelSequelize(sequelize, DataTypes)
const PhysicianModel = PhysicianModelSequelize(sequelize, DataTypes)

// PrescriptionModel.hasMany(PatientModel, {
//     foreignKey: {
//         allowNull: false
//     }
//   });
// PatientModel.belongsTo(PrescriptionModel); 

// PrescriptionModel.hasMany(PhysicianModel, {
//     foreignKey: {
//         allowNull: false
//     }
//   });
// PhysicianModel.belongsTo(PrescriptionModel);

// PrescriptionModel.hasMany(PharmacyModel, {
//     foreignKey: {
//         allowNull: false
//     }
//   });
// PharmacyModel.belongsTo(PrescriptionModel); 



const initDb = () => {
    return sequelize.sync() 
    .then(() => {
    })
    .catch(error => console.log('Erreur'))
}

sequelize.authenticate()
    .then(() => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


module.exports = {
    sequelize, initDb, PrescriptionModel, PatientModel, PharmacyModel, PhysicianModel
}