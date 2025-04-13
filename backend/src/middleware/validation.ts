import { validationResult } from 'express-validator';
import type { Request,Response, NextFunction } from "express";

export const handleInputErrors = (req:Request, res:Response, next:NextFunction) => {

    let errors = validationResult(req)
    if (!errors.isEmpty()) {
         res.status(400).json({
              errors: errors.array()
         })
        
    }
    next();   
}