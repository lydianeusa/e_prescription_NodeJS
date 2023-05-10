const patients = require('../mock-patients');
const pharmacies = require('../mock-pharmacies');
const physicians = require('../mock-physicians');
const prescriptions = require('../mock-prescriptions');

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

PatientModel.hasMany(PrescriptionModel, {
    foreignKey: {
        allowNull: false
    }
  });
PrescriptionModel.belongsTo(PatientModel); 

PhysicianModel.hasMany(PrescriptionModel, {
    foreignKey: {
        allowNull: false
    }
  });
PrescriptionModel.belongsTo(PhysicianModel); 

PharmacyModel.hasMany(PrescriptionModel, {
    foreignKey: {
        allowNull: false
    }
  });
PrescriptionModel.belongsTo(PharmacyModel); 


const initDb = () => {
    return sequelize.sync({force: true}) 
    .then(() => {
            patients.forEach((element) => {
                PatientModel.create({
                    first_name: element.first_name,
                    last_name: element.last_name,
                    birth_date: element.birth_date,
                    email: element.email,
                })
            });
            pharmacies.forEach((element) => {
                PharmacyModel.create({
                    name: element.name,
                    address: element.address,
                    zipcode: element.zipcode,
                    city: element.city,
                    phone_number: element.phone_number,
                    email: element.email,
                })
            });
            physicians.forEach((element) => {
                PhysicianModel.create({
                  first_name: element.first_name,
                    last_name: element.last_name,
                    specialty: element.specialty,
                    address: element.address,
                    zipcode: element.zipcode,
                    city: element.city,
                    phone_number: element.phone_number,
                    email: element.email,
                })
            });
            prescriptions.forEach((element) => {
                PrescriptionModel.create({
                  medicine_name: element.medicine_name,
                    dosage: element.dosage,
                    duration: element.duration,
                    frequency: element.frequency,
                    PhysicianId: element.PhysicianId,
                    PharmacyId: element.PharmacyId,
                    PatientId: element.PatientId
                })
            });
        })
    .catch(error => console.log(error))
}

sequelize.authenticate()
    .then(() => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


module.exports = {
    sequelize, PatientModel, PharmacyModel, PhysicianModel, PrescriptionModel,  initDb
}