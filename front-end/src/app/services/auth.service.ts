import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of, tap} from 'rxjs';

const API_URL = "http://127.0.0.1:5000/auth"

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<boolean> {
    const newUser = { username, password };
    console.log(newUser)
    return this.http.post<User>(`${API_URL}/register`, newUser).pipe(
      tap((user) => console.log('User registered:', user)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  login(username: string, password: string): Observable<boolean> {
    const loginData = { username, password };
    console.log(loginData)
    return this.http.post<User>(`${API_URL}/login`, loginData).pipe(
      tap((user) => {
        this.currentUser = user;
        localStorage.setItem('userId', user.id.toString());
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('userId');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('userId') != null;
  }

  getCurrentUser(): Observable<User | null> {
    const userId = localStorage.getItem('userId');
    if (!userId) return of(null);

    return this.http.get<User>(`${API_URL}/${userId}`).pipe(
      tap((user) => (this.currentUser = user)),
      catchError(() => of(null))
    );
  }
}
