import { Link } from 'react-router-dom';

export const HomeNavigation = () => {
    return (
        <>
            <Link className='text-white p-2 font-black text-xs cursor-pointer' to='/auth/login'>Iniciar Sesion</Link>
            <Link className='bg-lime-500 text-slate-800  p-2 font-black text-xs cursor-pointer rounded-lg' to='/auth/register'>Registarme</Link>
        </>
    )
}
