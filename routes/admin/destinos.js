var express = require('express');
var router = express.Router();
var destinosModel = require('../../models/destinosModels');
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function(req,res,next){

    var destinos = await destinosModel.getDestinos(); //query

    destinos = destinos.map(destino =>{
        if(destino.img_id){
            const imagen = cloudinary.image(destino.img_id,{
                width:100,
                height:100,
                crop:'fill',
                radius:'max'
            });
            return{
                ...destino,
                imagen
            }
        }else{
            return{
                ...destino,
                imagen:'imagen/noimagen.jpg'
            }
        }
    });

    res.render('admin/destinos',{
        layout:'admin/layout',
        usuario:req.session.nombre,
        destinos
    });
});

/* vista del formulario de agregar */

router.get('/agregar', function (req,res,next){
    res.render('admin/agregar',{
        layout:'admin/layout'
    });
});

router.post('/agregar', async (req,res,next) =>{
    try{
        //console.log(req.body);
        var img_id ='';
        if(req.files && Object.keys(req.files).length > 0){
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
        }

        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.link != "" ){
            await destinosModel.insertDestino({
                ...req.body,
                img_id
            })
            res.redirect('/admin/destinos');
        } else {
            res.render('admin/agregar',{
                layout:'admin/layout',
                error:true,
                message:'Todos los campos son requeridos'
            })
        }
        
    } catch (error){
        console.log(error);
        res.render('admin/agregar', {
          layout: 'admin/layout',
          error:true,
          message: 'No se cargo el destino'
        })
    }
  })

//funcionamiento de eliminar

router.get('/eliminar/:id', async (req,res,next) =>{
    var id = req.params.id;

    let destino = await destinosModel.getDestinosByID(id);
        if(destino.img_id){
            await(destroy(destino.img_id))
        }

    await destinosModel.deleteDestinoByID(id);
    res.redirect('/admin/destinos');
});

// funcionamiento de modificar

router.get('/modificar/:id', async(req,res,next) =>{
    var id = req.params.id;
    var destinos = await destinosModel.getDestinosByID(id);
    res.render('admin/modificar', {
        layout:'admin/layout',
        destinos
    })
})

router.post('/modificar', async(req,res,next)=>{
    //console.log(req.body)
    try{

        let img_id = req.body.img_original;
        let borrar_img_vieja = false;
        if(req.body.img_delete === "1"){
            img_id= null;
            borrar_img_vieja = true;
        }else{
            if(req.files && Object.keys(req.files).length > 0){
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }

        if (borrar_img_vieja && req.body.img_original){
            await (destroy(req.body.img_original));
        }

        var obj={
            titulo:req.body.titulo,
            subtitulo:req.body.subtitulo,
            link:req.body.link,
            img_id
        }
        await destinosModel.modificarDestinoByID(obj, req.body.id);
        res.redirect('/admin/destinos');
    }catch (error) {
        console.log(error);
        res.render('admin/modificar',{
            layout:'admin/layout',
            error:true,
            message: 'No se modifico el destino'
        })
    }
})
module.exports = router