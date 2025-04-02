import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from '../module/User';
import { God } from '../modules/Dieux';
import { Follower } from '../modules/Follower';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api_url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }


  //Inscription
  inscription(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/auth/register`, body);
  }

  //Connexion
  connexion(body: any): Observable<any> {
    return this.http.post<any>(`${this.api_url}/auth/login`, body, { withCredentials: true });
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');

    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Utilisateur[]>(`${this.api_url}/users`, { headers, withCredentials: true });
  }
  
  getMe(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Utilisateur[]>(`${this.api_url}/users/me`, { headers, withCredentials: true });
  }

  getGods(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<God[]>(`${this.api_url}/god`, { headers, withCredentials: true });
  }
  
  getFollowing(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Follower[]>(`${this.api_url}/follow/following`, { headers, withCredentials: true });
  }
  getFollower(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Follower[]>(`${this.api_url}/follow/follower`, { headers, withCredentials: true });
  }

  getPostsMe(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Follower[]>(`${this.api_url}/post`, { headers, withCredentials: true }); 
  }
}
