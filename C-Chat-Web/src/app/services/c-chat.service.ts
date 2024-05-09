import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom, map } from 'rxjs';
import { Chat } from '../model/classes/chat';
import { UserChatInsert } from '../model/classes/user-chat-insert';

@Injectable({
  providedIn: 'root'
})
export class CChatService {
  private API_URL: string = 'https://localhost:7201/api';
  private TOKEN_ITEM: string = 'C-ChatToken';
  isUserLogged: boolean = localStorage.getItem(this.TOKEN_ITEM) ? true : false;

  private chatCreatedSource = new BehaviorSubject<boolean>(false);
  chatCreated$ = this.chatCreatedSource.asObservable();

  private _selectedChat: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  selectedChat = this._selectedChat.asObservable();

  private _chats: BehaviorSubject<Chat[]> = new BehaviorSubject<Chat[]>([]);
  chats$ = this._chats.asObservable();

  constructor(private httpClient: HttpClient) { }

  public setSelectedChat(chat: Chat): void {
    this._selectedChat.next(chat);
  }

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

  public async getUserChatList(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const request = this.httpClient.get(`${this.API_URL}/Chat/MyChats`, { headers }).pipe(
      map((response: any) => response.map(this.mapToChat))
    );
    
    const chats: Chat[] = await lastValueFrom(request);
    this._chats.next(chats);
  }

  private mapToChat(item: any): Chat {
    return {
      chatId: item.chatId,
      name: item.name,
      creationDate: item.creationDate
    }
  }

  public async postCreateChat(chatName: string): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_ITEM);

    const formData = new FormData();
    formData.append('Name', chatName);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
        Authorization: `Bearer ${token}`
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Chat`, formData, options);
      await lastValueFrom(request);
      await this.getUserChatList();

      this.chatCreatedSource.next(true);

    } catch (error) {
      throw error;
    }
  }

  public async postAddUserToChat(userToAdd: UserChatInsert): Promise<string> {
    const token = localStorage.getItem(this.TOKEN_ITEM);

    const formData = new FormData();
    formData.append('ChatId', userToAdd.chatId);
    formData.append('UserName', userToAdd.userName);
    console.log(userToAdd.chatId);
    console.log(userToAdd.userName);
    
    

    const headers = new HttpHeaders({
      Accept: 'text/html, application/xhtml+xml, */*',
      Authorization: `Bearer ${token}`
    });

    const options: any = {
      headers,
      responseType: 'text',
    };

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Chat/AddUserToChat`, formData, options)
        .pipe(map((response) => {
          if (typeof response === 'string') {
            return response;
          } else {
            throw new Error('Response is not a string');
          }
        }));
      
      return await lastValueFrom(request);

    } catch (error) {
      throw error;
    }
  }

  /* ---------- Utility ---------- */
  public toggleModalForm(selector: string, open: boolean): void {
    const dialog = document.getElementById(selector) as HTMLDialogElement;
    open ? dialog.showModal() : dialog.close();
  }
}
