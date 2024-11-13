import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

const API_URL = "http://127.0.0.1:5000/"

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getUserResults(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/user/${userId}/results`);
  }

  getResultById(resultId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/result/${resultId}`);
  }
}
