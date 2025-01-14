import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { environment } from '../../environment';

const API_URL = environment.apiUrl

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
