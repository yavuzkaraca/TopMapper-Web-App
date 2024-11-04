import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {ConfigurationComponent} from "./components/simulation/configuration/configuration.component";
import {ResultsComponent } from './components/simulation/results/results.component';  // Import ResultsComponent
import {AboutComponent} from './components/about/about.component';

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
  }
];
