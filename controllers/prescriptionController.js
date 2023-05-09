const { Op, UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize');
const { PrescriptionModel, sequelize } = require('../db/sequelize')

exports.findAllPrescriptions = (req, res) => {
  if(req.query.search){
      // notre recherche avec paramètres
      PrescriptionModel.findAll({ where: { medecine_name: {[Op.like] : `%${req.query.search}%`} } })
      .then((elements)=>{
          if(!elements.length){
              return res.json({message: "Aucune ordonnance ne correspond à votre recherche"})    
          }
          const msg = 'La liste des ordonnances a bien été récupérée en base de données.'
          res.json({message: msg, data: elements})
      })
      .catch((error) => {
          const msg = 'Une erreur est survenue.'
          res.status(500).json({message: msg})
      })
  } else {
      PrescriptionModel.findAll()
      .then((elements)=>{
          const msg = 'La liste des ordonnances a été récupérée en base de données.'
          res.json({message: msg, data: elements})
      })
      .catch((error) => {
          const msg = 'Une erreur est survenue pour la liste des ordonnances.'
          res.status(500).json({message: msg})
      })
  }
}

exports.createPrescription = (req, res) => {
    let newPrescription = req.body;

    PrescriptionModel.create({
        medicine_name: newPrescription.medicine_name,
        dosage: newPrescription.dosage,
        duration: newPrescription.duration,
        // PhysicianId: req.PhysicianId,
        // PatientId: req.PatientId,
        // PharmacyId: req.PharmacyId
    }).then((el) => {
        const msg = 'Une ordonnance a bien été ajoutée.'
        res.json({ message: msg, data: el })
    }).catch(error => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({message: error.message, data: error})
        } 
        res.status(500).json(error)
    })
}

exports.findPrescriptionByPk = (req, res) => {
    PrescriptionModel.findByPk(req.params.id)
        .then(element => {
            if (element === null) {
                const message = `L'ordonnance demandée n'existe pas.`
                res.status(404).json({ message })
            } else {
                const message = "Une ordonnance a bien été trouvée."
                res.json({ message, data: element });
            }
        })
        .catch(error => {
            const message = `La liste des ordonnances n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

exports.updatePrescription = (req, res) => {
    PrescriptionModel.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then((element) => {
        if(element === null){
            const msg = "L'ordonnance demandée n'existe pas."
            res.json({message: msg})
        } else {
            const msg = "L'ordonnance a bien été modifiée."
            res.json({message: msg, data: coworking})
        }
    }).catch((error) => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({message: error.message, data: error})
        } 
        const msg = "Impossible de mettre à jour l'ordonnance."
        res.status(500).json({message: msg})
    })
}

exports.deletePrescription = (req, res) => {
    CoworkingPrescription.findByPk(req.params.id)
        .then(element => {
            if (element === null) {
                const message = `L'ordonnance demandée n'existe pas.`
                return res.status(404).json({ message })
            }
            return PrescriptionModel.destroy({
                where: {
                    id: req.params.id
                }
            })
                .then(() => {
                    const message = `L'ordonnance a bien été supprimée.`
                    res.json({ message, data: element });
                })
        })
        .catch(error => {
            const message = `Impossible de supprimer l'ordonnance.`
            res.status(500).json({ message, data: error })
        })
}

