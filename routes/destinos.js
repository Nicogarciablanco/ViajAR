var express = require('express');
var router = express.Router();
var destinosModels = require('../models/destinosModels');
var cloudinary = require('cloudinary').v2;


router.get('/', async function(req, res, next) {

  var destinos = await destinosModels.getDestinos();

  destinos = destinos.map(destino =>{
    if(destino.img_id){
      const imagen = cloudinary.url(destino.img_id,{
        width: 600,
        height:300,
        //crop:'pad' 
      });
      return{
        ...destino,
        imagen
      }
    }else{
      return{
        ...destino,
        imagen:''
      }
    }
  })
  res.render('destinos',
  { isDestinos:true,
  destinos })
});




module.exports = router;
