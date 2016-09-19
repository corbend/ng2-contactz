
import SignInForm from './sign-in';
import SignUpForm from './sign-up';
import UnauthPage from './unauth';


export const LoginRoutes = [
	{path: '', redirectTo: '/login', pathMatch: 'full'},
	{path: 'login', redirectTo: '/auth/signin', pathMatch: 'full'},
	{path: 'auth/signin', component: SignInForm},
	{path: 'auth/signup', component: SignUpForm}
]
