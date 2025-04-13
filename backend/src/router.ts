import { Router } from 'express';
import { body } from 'express-validator'
import { createAccount, getUser, getUserByHandle, login, searchByHandle, updatedProfile, uploadImage } from './handlers';
import { handleInputErrors } from './middleware/validation';
import { authenticate } from './middleware/auth';

const router = Router()

router.post('/auth/register',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
    body('name')
        .notEmpty()
        .withMessage('El Nombre no puede ir vacio'),
    body('email')
        .isEmail()
        .withMessage('El E-mail no valido'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('El Password es muy corto minimo 8 caracteres'),
    handleInputErrors,
    createAccount);
router.post('/auth/login',
    body('email')
        .isEmail()
        .withMessage('El E-mail no valido'),
    body('password')
        .notEmpty()
        .withMessage('El Password es Obligatorio'),
    handleInputErrors,
    login)

router.get('/user', authenticate, getUser)
router.patch('/user',
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio'),
        handleInputErrors,
    authenticate, updatedProfile
)

router.post('/user/image', authenticate, uploadImage)
router.get('/:handle', getUserByHandle)
router.post('/search',   body('handle')
.notEmpty()
.withMessage('El Handle no puede ir Vacio'),
handleInputErrors,
searchByHandle)

export default router;