import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { EmployeeListComponent } from './employee/employee-list/employee-list.component';
import { EmployeeAddComponent } from './employee/employee-add/employee-add.component';
import { EmployeeDetailsComponent } from './employee/employee-details/employee-details.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'employees', 
    component: EmployeeListComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'employees/add', 
    component: EmployeeAddComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'employees/:id', 
    component: EmployeeDetailsComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '/login' }
];
