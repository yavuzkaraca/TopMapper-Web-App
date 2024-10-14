import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

const API_URL = "http://127.0.0.1:5000/"

@Injectable({
  providedIn: 'root'
})
export class SimulationService {

  constructor(private http: HttpClient) { }

  public getDefaultConfig() {
    return this.http.get(API_URL + 'default_configs');
  }

  public startSimulation(config: any) {
    console.log("started")
    const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    }

    return this.http.post(API_URL + 'start_simulation', config, httpOptions);
  }
}
