import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Chat } from '../model/classes/chat';

@Injectable({
  providedIn: 'root'
})
export class CChatService {
  API_URL: string = 'https://localhost:7201/api';
  TOKEN_ITEM: string = 'C-ChatToken';
  isUserLogged: boolean = localStorage.getItem(this.TOKEN_ITEM) ? true : false;

  constructor(private httpClient: HttpClient) { }

  /**
   * test
   */
  public test(): void {
    console.log(localStorage.getItem(this.TOKEN_ITEM))
  }

  public async postSignUp(userData: any): Promise<string> {
    const formData = new FormData();
    formData.append('Name', userData.userName);
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);
    formData.append('PasswordBis', userData.passwordBis);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.post<string>(
        `${this.API_URL}/Auth/SignUp`,
        formData,
        options
      );
      const response: any = await lastValueFrom(request);
      return response;
    } catch (error) {
      throw error;
    }
  }

  public async postLogIn(userData: any): Promise<boolean> {
    const formData = new FormData();
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.post<string>(
        `${this.API_URL}/Auth/Login`,
        formData,
        options
      );
      const response: any = await lastValueFrom(request);

      this.isUserLogged = true;
      localStorage.setItem(this.TOKEN_ITEM, response);
      return this.isUserLogged;
    } catch (error) {
      this.isUserLogged = false;
      throw error;
    }
  }

  public logOut(): void {
    this.isUserLogged = false;
    localStorage.removeItem(this.TOKEN_ITEM)
  }

  public async getUserChatList(): Promise<Chat[]> {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const request = this.httpClient.get(`${this.API_URL}/Chat/MyChats`, { headers }).pipe(
      map((response: any) => response.map(this.mapToChat))
    );

    return await lastValueFrom(request);
  }

  private mapToChat(item: any): Chat {
    return {
      chatId: item.chatId,
      name: item.name,
      creationDate: item.creationDate
    }
  }
}
