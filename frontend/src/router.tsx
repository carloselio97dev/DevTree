import {BrowserRouter, Routes,Route} from 'react-router-dom';
import { LoginVIew } from './Views/LoginVIew';
import { RegisterView } from './Views/RegisterView';
import { AuthLayouth } from './Layouts/AuthLayouth';
import AppLayout from './Layouts/AppLayouth';
import { LinkTreeView } from './Views/LinkTreeView';
import { ProfileView } from './Views/ProfileView';
import { HandelView } from './Views/HandelView';
import { NotFoundView } from './Views/NotFoundView';
import { HomeView } from './Views/HomeView';


export default function Router(){
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AuthLayouth/>}>
                    <Route path='/auth/login' element={<LoginVIew/>}/>
                    <Route path='/auth/register' element={<RegisterView/>}/>
                </Route>
            <Route path='/admin' element={<AppLayout/>}>
                    <Route index={true} element={<LinkTreeView/>}/>
                    <Route path='profile' element={<ProfileView/>}/>
            </Route>
            
            <Route path='/:handle' element={<AuthLayouth/>}>
                <Route element={<HandelView/>} index={true}/>
            </Route>
            <Route path='/' element={<HomeView/>}/>

            <Route path='/404' element={<AuthLayouth/>}>
                <Route element={<NotFoundView/>} index={true}>
                </Route>
            </Route>
            
            </Routes>
        </BrowserRouter>
    )
}