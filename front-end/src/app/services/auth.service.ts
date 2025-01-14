import { Injectable } from '@angular/core';
import {User} from '../models/user.model';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, catchError, map, Observable, of, tap} from 'rxjs';
import { environment } from '../../environment';  // Adjust path as necessary

const API_URL = environment.apiUrl + 'auth'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false); // BehaviorSubject to track login state
  isLoggedIn$ = this.isLoggedInSubject.asObservable(); // Observable for components to subscribe

  constructor(private http: HttpClient) {
    // Set the initial login state based on the presence of a userId in localStorage
    this.isLoggedInSubject.next(this.isLoggedIn());
  }

  register(email: string, password: string): Observable<boolean> {
    const newUser = { email, password };
    console.log(newUser)
    return this.http.post<User>(`${API_URL}/register`, newUser).pipe(
      tap((user) => console.log('User registered:', user)),
      map(() => true),
      catchError(() => of(false))
    );
  }

  login(email: string, password: string): Observable<boolean> {
    const loginData = { email, password };
    console.log(loginData)
    return this.http.post<User>(`${API_URL}/login`, loginData).pipe(
      tap((user) => {
        this.currentUser = user;
        localStorage.setItem('userId', user.id.toString());
        this.isLoggedInSubject.next(true);
      }),
      map(() => true),
      catchError(() => of(false))
    );
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('userId');
    this.isLoggedInSubject.next(false);
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('userId') != null;
  }

  getCurrentUserId(): number {
    const userId = localStorage.getItem('userId');

    if (userId) {
      return Number(userId);
    } else {
      return 0
    }
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
