import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Utilisateur } from '../modules/User';
import { God } from '../modules/Dieux';
import { Follower } from '../modules/Follower';
import { Posts } from '../modules/Posts';
import { SessionChat } from '../modules/SessionChat';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  getMe(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Utilisateur[]>(`${this.api_url}/users/me`, { headers, withCredentials: true });
  }

  getPostsMe(id: (string | number | number[] | (string | undefined)[] | ((val: number) => number) | (string[] | undefined)[] | { AUD: string[]; BYN: (string | undefined)[]; IDR: string[]; INR: string[]; JPY: string[]; PHP: (string | undefined)[]; THB: string[]; TWD: string[]; USD: string[]; XXX: never[]; } | undefined)[]) {
    throw new Error('Method not implemented.');
  }
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
    return this.http.get<Utilisateur[]>(`${this.api_url}/users`, { withCredentials: true });
  }
  getUserById(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Utilisateur[]>(`${this.api_url}/users/user/${id}`, { headers, withCredentials: true });
  }

  updateActiveUser(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Utilisateur[]>(`${this.api_url}/users/actif/${id}`, { headers, withCredentials: true });
  }

  getGods(): Observable<any> {
    return this.http.get<God[]>(`${this.api_url}/god`, { withCredentials: true });
  }
  deleteGod(god_id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<God[]>(`${this.api_url}/god/${god_id}`, { headers, withCredentials: true }); 
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
  getFollowingById(id: any): Observable<any> {
    return this.http.get<Follower[]>(`${this.api_url}/follow/following/${id}`);
  }
  getFollowerById(id: any): Observable<any> {
    return this.http.get<Follower[]>(`${this.api_url}/follow/follower/${id}`);
  }
  getPostsById(id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Posts[]>(`${this.api_url}/post/${id}`, { headers, withCredentials: true }); 
  }
  getPostsByUser(user_id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Posts[]>(`${this.api_url}/post/user/${user_id}`, { headers, withCredentials: true }); 
  }
  getCommentsByPost(post_id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Comment[]>(`${this.api_url}/comment/${post_id}`, { headers, withCredentials: true }); 
  }
  
  postComment(post_id: any, body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Comment[]>(`${this.api_url}/comment/${post_id}`, body, { headers, withCredentials: true });
  }
  deleteComment(comment_id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<Comment[]>(`${this.api_url}/comment/${comment_id}`, { headers, withCredentials: true });
  
  }
  putUser(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Utilisateur[]>(`${this.api_url}/users`, body, { headers, withCredentials: true }); 
  }
  createPost(body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Posts[]>(`${this.api_url}/post`, body, { headers, withCredentials: true }); 
  }
  deletePost(post_id: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<Posts[]>(`${this.api_url}/post/${post_id}`, { headers, withCredentials: true }); 
  }
  modifyPost(post_id: any, body: any): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put<Posts[]>(`${this.api_url}/post/${post_id}`, body, { headers, withCredentials: true }); 
  }
  getPosts(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) {
      throw new Error('Token not found');
    }
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Posts[]>(`${this.api_url}/post/all`, { headers, withCredentials: true }); 
  }
  postFollow(abonne_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) throw new Error('Token not found');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post(`${this.api_url}/follow/${abonne_id}`, {}, { headers, withCredentials: true });
  }
  deleteFollow(abonne_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) throw new Error('Token not found');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.api_url}/follow/${abonne_id}`, { headers, withCredentials: true });
  }

  isAlreadyFollowing(abonne_id: number): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) throw new Error('Token not found');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Follower>(`${this.api_url}/follow/${abonne_id}/status`, { headers, withCredentials: true });
  }
  getChatSessionsUserId(): Observable<any> {
    const token = localStorage.getItem('token');
    if(!token) throw new Error('Token not found');
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<SessionChat>(`${this.api_url}/chatSession/chat`, { headers, withCredentials: true });
  }

  deleteToken() {
    localStorage.removeItem('token');
  }
}
