import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Chat } from '../model/classes/chat';
import { UserChatInsert } from '../model/classes/user-chat-insert';
import { User } from '../model/classes/user';

@Injectable({
  providedIn: 'root'
})
export class CChatService {
  private API_URL: string = 'https://localhost:7201/api';
  private TOKEN_ITEM: string = 'C-ChatToken';

  isUserLogged: boolean = localStorage.getItem(this.TOKEN_ITEM) ? true : false;

  chatList: WritableSignal<Chat[]> = signal([]);
  selectedChat: WritableSignal<Chat> = signal(new Chat);
  memberList: WritableSignal<User[]> = signal([]);

  constructor(private httpClient: HttpClient) { }

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

  public async deleteUser(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_ITEM);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
        Authorization: `Bearer ${token}`
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.delete<string>(`${this.API_URL}/Auth`, options);
      await lastValueFrom(request);
      this.logOut();
    } catch (error) {
      throw error;
    }
  }

  public async getUserChatList(): Promise<void> {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const request = this.httpClient.get(`${this.API_URL}/Chat/MyChats`, { headers }).pipe(
      map((response: any) => response.map(this.mapToChat))
    );
    
    const chats: Chat[] = await lastValueFrom(request);

    this.chatList.set(chats);
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
    } catch (error) {
      throw error;
    }
  }

  public async postAddUserToChat(userToAdd: UserChatInsert): Promise<string> {
    const token = localStorage.getItem(this.TOKEN_ITEM);

    const formData = new FormData();
    formData.append('ChatId', userToAdd.chatId);
    formData.append('UserName', userToAdd.userName);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
        Authorization: `Bearer ${token}`
      }),
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

  public async deleteLeaveChat(): Promise<void> {

    const chatId = this.selectedChat().chatId;
    const token = localStorage.getItem(this.TOKEN_ITEM);

    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
        Authorization: `Bearer ${token}`
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.delete<string>(`${this.API_URL}/Chat/LeaveChat/${chatId}`, options);
      await lastValueFrom(request);
      await this.getUserChatList();
      this.selectedChat.set(new Chat);
    } catch (error) {
      throw error;
    }
  }

  public async deleteChat(chatId: number): Promise<void> {
    const options: any = {
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*'
      }),
      responseType: 'text',
    };

    try {
      const request = this.httpClient.delete<string>(`${this.API_URL}/Chat/${chatId}`, options);
      await lastValueFrom(request);
      await this.getUserChatList();
      this.selectedChat.set(new Chat);
    } catch (error) {
      throw error;
    }
  }

  public async getUsersInChat(): Promise<void> {
    try {
      const chatId = this.selectedChat().chatId;
      const request = this.httpClient.get(`${this.API_URL}/Chat/UsersInChat/${chatId}`).pipe(
        map((response: any) => response.map(this.mapToUser))
      );
      const users: User[] = await lastValueFrom(request);
      this.memberList.set(users);
    } catch (error) {
      throw error;
    }
  }
  private mapToUser(item: any): User {
    return {
      name: item.name,
      email: item.email
    }
  }

  /* ---------- Utility ---------- */
  public toggleModalForm(selector: string, open: boolean): void {
    const dialog = document.getElementById(selector) as HTMLDialogElement;
    open ? dialog.showModal() : dialog.close();
  }
}
