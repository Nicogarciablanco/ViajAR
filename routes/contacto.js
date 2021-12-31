var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.get('/', function(req, res, next) {
  res.render('contacto',
  { isContacto:true })
});

//funcionamiento del formulario
router.post('/', async function (req,res,next){
 //console.log(req.body);
 var nombre = req.body.nombre;
 var email = req.body.email;
 var tel = req.body.tel;
 var mensaje = req.body.comentarios;
 //console.log (req.body.tel)

 var obj={
   to: 'nicogarciablanco99@gmail.com',
   subject:'Contacto desde la web de viajes',
   html: nombre + ' se contacto a traves de la web y quiere saber mas info a este correo '
   + email + '.<br> Su tel es ' + tel + '.<br> y su comentario es: ' + mensaje + '.'
  }

   var transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  }); //cierra transport
 var info = await transport.sendMail(obj); //envio los datos
 
 res.render('contacto', {
   texto:'Mensaje enviado correctamente', 
   isContacto: true
 })
})

module.exports = router;
