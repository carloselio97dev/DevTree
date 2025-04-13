
import User from "../models/User";
import { validationResult } from "express-validator";
import slug from 'slug';
import formidable from 'formidable';
import {v4 as uuid} from 'uuid'
import { Request, Response } from "express";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateJWT } from "../utils/jwt";
import cloudinary from "../config/cloudinary";


export const createAccount = async (req: Request, res: Response) => {
     //Se ingresa a la base de datos
     const { email, password } = req.body;

     const userExists = await User.findOne({ email });
     //Comprobando Usuario
     if (userExists) {
          const error = new Error('Un usuario con ese Email ya esta registrado');
          res.status(409).json({ error: error.message })
          return;
     }

     const handle = slug(req.body.handle, '');

     const handleExists = await User.findOne({ handle });
     //Comprobando Handle
     if (handleExists) {
          const error = new Error('Nombre de Usuario no Disponible');
          res.status(409).json({ error: error.message });
     }

     const user = new User(req.body);
     user.password = await hashPassword(password);
     user.handle = handle;

     console.log(slug(handle, ''))
     await user.save();
     res.status(201).send({
          msg: "Registro Creado Correctamente"
     })
}

export const login = async (req: Request, res: Response) => {
     //Manejar Errores
     let errors = validationResult(req);
     if (!errors.isEmpty()) {
          res.status(400).json({
               errors: errors.array()
          })
          return;
     }

     const { email, password } = req.body;
     //Revisar si el usuario esta registrado
     const user = await User.findOne({ email });

     if (!user) {
          const error = new Error("El Usuario no existe");
          res.status(404).json({ error: error.message });
          return;
     }
     //Comprobar password
     const isPasswordCorrect = await checkPassword(password, user.password)

     if (!isPasswordCorrect) {
          const error = new Error('Password Incorrecto');
          res.status(401).json({ error: error.message });
          return;
     }

     const token = generateJWT({ id: user.id });

     res.send(token);
}

export const getUser = async (req: Request, res: Response) => {
          res.json(req.user);
}



export const updatedProfile = async (req:Request, res:Response)=> {
     try {
          const {description , links }= req.body;

          const handle=slug(req.body.handle,'')
          const handleExists= await User.findOne({handle})
          if(handleExists && handleExists.email!==req.user.email){
               const error=new Error('Nombre de Usuario no Disponible')
               res.status(409).json({error:error.message})
               return;
          }
          //Actualizar el usuario
          req.user.description=description
          req.user.handle=handle
          req.user.links=links
          await req.user.save()
          res.send('Perfil actualizado correctamente')

     } catch (e) {
          const error=new Error('Error al actualizar el perfil');
          res.status(500).json({error:error.message})
          return;
     }
}

export const uploadImage = async ( req:Request, res:Response) => {
     const form = formidable({multiples:false})
     try {
        
          form.parse(req, (error,fields, files)=>{
                                        //Ruta de la imagen a subir a Cloudinary
           cloudinary.uploader.upload(files.file[0].filepath,{public_id:uuid()},async function(error,result) {
                  if(error){
                    const error=new Error("Hubo un error al subir la imagen");
                    res.status(500).json({error:error.message})
                  }
                  if(result){
                    //Asigna la url al modelo
                         req.user.image=result.secure_url
                    //Guarda el usuario al modelo
                         await req.user.save()
                    //Respuesta (Retorna la imagen )
                         res.json({image:result.secure_url})
                  }
               })       

          })

     } catch (e) {
               const error=new Error('Hubo un error');
               res.status(500).json({error:error.message})
     }
}

export const getUserByHandle = async (req:Request , res:Response) => {
      try {
          const { handle} = req.params
             // 1. Buscar usuario en MongoDB
          const user= await User.findOne({handle}).select('-_id -__v -email -password')
          if(!user){
               const error= new Error('El Usuario no existe')
                res.status(404).json({error:error.message})
                return;
          }

         res.json(user);
          return;
      } catch (e) {
               const error=new Error('Hubo un error');
               res.status(500).json({error:error.message})
          
      }
}


export const searchByHandle=  async (req:Request, res:Response) =>{
     try {     

          const {handle} = req.body;
          const userExist= await User.findOne({handle})
          if(userExist){
               const error = new Error(`${handle} ya esta registrado`)
               res.status(409).json({error:error.message})
               return;
          }

          res.send(`${handle} esta disponible`)
     } catch (e) {
          const error=new Error('Hubo un error');
          res.status(500).json({error:error.message})
     }
}