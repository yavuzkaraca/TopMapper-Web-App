import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ConfigurationComponent} from "./components/simulation/configuration/configuration.component";
import {ResultsComponent } from './components/simulation/results/results.component';  // Import ResultsComponent
import {AboutComponent} from './components/about/about.component';
import {LoginComponent} from './components/auth/login/login.component';
import {RegisterComponent} from './components/auth/register/register.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'simulation',
    component: ConfigurationComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'results',
    component: ResultsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  }
];
