const { Op, UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize');
const { PatientModel, sequelize } = require('../db/sequelize')

exports.findAllPatients = (req, res) => {
  if(req.query.search){
      // notre recherche avec paramètres
      PatientModel.findAll({ where: { last_name: {[Op.like] : `%${req.query.search}%`} } })
      .then((elements)=>{
          if(!elements.length){
              return res.json({message: "Aucun patient ne correspond à votre recherche"})    
          }
          const msg = 'La liste des patients a bien été récupérée en base de données.'
          res.json({message: msg, data: elements})
      })
      .catch((error) => {
          const msg = 'Une erreur est survenue.'
          res.status(500).json({message: msg})
      })
  } else {
      PatientModel.findAll()
      .then((elements)=>{
          const msg = 'La liste des patients a été récupérée en base de données.'
          res.json({message: msg, data: elements})
      })
      .catch((error) => {
          const msg = 'Une erreur est survenue pour la liste des patients.'
          res.status(500).json({message: msg})
      })
  }
}

exports.createPatient = (req, res) => {
  let newPatient = req.body;

  PatientModel.create({
      first_name: newPatient.first_name,
      last_name: newPatient.last_name,
      birth_date: newPatient.birth_date,
      phone_number: newPatient.phone_number,
      email: newPatient.email
  }).then((el) => {
      const msg = 'Un patient a bien été ajouté.'
      res.json({ message: msg, data: el })
  }).catch(error => {
      if(error instanceof UniqueConstraintError || error instanceof ValidationError){
          return res.status(400).json({message: error.message, data: error})
      } 
      res.status(500).json(error)
  })
}

exports.findPatientByPk = (req, res) => {
    PatientModel.findByPk(req.params.id)
        .then(element => {
            if (element === null) {
                const message = `Le patient demandé n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Un patient a bien été trouvé."
                res.json({ message, data: element });
            }
        })
        .catch(error => {
            const message = `La liste des patients n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}


