import AuthGuard from './auth/guard';
import {UserArea} from './user-area';
import {ContactList} from './contact-list';
import {ContactCreateForm} from './contact-create-form';
import {ContactDetail} from './contact-detail';
import {ImportCsv} from './import-csv';
import {UserResolver, UserProfile} from './profile-form';


export const AppRoutes = [
	{path: '', component: UserArea},
	{
		path: 'contacts', component: UserArea,
		children: [
  			{path: 'list', component: ContactList, canActivate: [AuthGuard]},
  			{path: 'create', component: ContactCreateForm, canActivate: [AuthGuard]},
			{path: 'edit/:id', component: ContactDetail, canActivate: [AuthGuard]},
			{path: 'import', component: ImportCsv, canActivate: [AuthGuard]}
		]
	},
	{
		path: 'profile', component: UserProfile, canActivate: [AuthGuard], resolve: {
			user: UserResolver
		}
	}
]
