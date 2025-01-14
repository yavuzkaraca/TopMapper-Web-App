import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { environment } from '../../environment';

const API_URL = environment.apiUrl

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private http: HttpClient) {
  }

  public getDefaultConfig() {
    return this.http.get(API_URL + 'default_configs');
  }

  public startSimulation(config: any, userId: number) {
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    const payload = {
      userId: userId,
      config: config
    };

    return this.http.post(API_URL + 'start_simulation', payload, httpOptions);
  }

  public getSimulationResults()  {
    return this.http.get(API_URL + 'simulation_results');
  }

  public getProgress() {
    return this.http.get(API_URL + 'progress');
  }

}
