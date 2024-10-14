import { Routes } from '@angular/router';
import {HomeComponent} from "./components/home/home.component";
import {SimulationComponent} from "./components/simulation/simulation.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'simulation',
    component: SimulationComponent
  }
];
