import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenExpiryTimer: any;

  constructor(
    private apollo: Apollo,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    // Only attempt to access localStorage if we're in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      const userJson = localStorage.getItem('user');
      
      if (token && userJson) {
        try {
          const user = JSON.parse(userJson);
          this.currentUserSubject.next(user);
          this.setAutoLogout();
        } catch (error) {
          this.logout();
        }
      }
    }
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.apollo.mutate<{ signup: User }>({
      mutation: gql`
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            id
            username
            email
          }
        }
      `,
      variables: {
        username,
        email,
        password
      }
    }).pipe(
      map(result => result.data?.signup as User)
    );
  }

  login(usernameOrEmail: string, password: string): Observable<AuthResponse> {
    return this.apollo.query<{ login: AuthResponse }>({
      query: gql`
        query Login($usernameOrEmail: String!, $password: String!) {
          login(usernameOrEmail: $usernameOrEmail, password: $password) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        usernameOrEmail,
        password
      }
    }).pipe(
      map(result => result.data.login),
      tap(response => this.handleAuthentication(response))
    );
  }

  private handleAuthentication(authResponse: AuthResponse): void {
    const { token, user } = authResponse;
    
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    this.currentUserSubject.next(user);
    this.setAutoLogout();
  }

  private setAutoLogout(): void {
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
    
    // Auto logout after 24 hours (matching the token expiry time)
    this.tokenExpiryTimer = setTimeout(() => {
      this.logout();
    }, 24 * 60 * 60 * 1000);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    
    this.currentUserSubject.next(null);
    
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
    
    this.apollo.client.resetStore();
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
