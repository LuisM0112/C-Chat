import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, WritableSignal, signal } from '@angular/core';
import { lastValueFrom, map } from 'rxjs';
import { Chat } from '../model/classes/chat';
import { UserChatInsert } from '../model/classes/user-chat-insert';
import { User } from '../model/classes/user';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class CChatService {
  private API_URL: string = 'https://localhost:7201/api';
  private TOKEN_ITEM: string = 'C-ChatToken';
  private USER_ITEM: string = 'C-ChatUserName';

  isUserLogged: boolean = localStorage.getItem(this.TOKEN_ITEM) ? true : false;
  isUserAdmin: boolean = false;

  chatList: WritableSignal<Chat[]> = signal([]);
  selectedChat: WritableSignal<Chat> = signal(new Chat);
  memberList: WritableSignal<User[]> = signal([]);

  userName: string = '';

  constructor(private httpClient: HttpClient, private toastr: ToastrService) { 
    this.userName = localStorage.getItem(this.USER_ITEM) ?? '';
  }
  
  /* |---------- Utility ----------| */

  public getOptions(): any {
    const token = localStorage.getItem(this.TOKEN_ITEM);
    return ({
      headers: new HttpHeaders({
        Accept: 'text/html, application/xhtml+xml, */*',
        Authorization: `Bearer ${token}`
      }),
      responseType: 'text',
    });
  }

  public toggleModalForm(selector: string, open: boolean): void {
    const dialog = document.getElementById(selector) as HTMLDialogElement;
    open ? dialog.showModal() : dialog.close();
  }

  public getListFiltered(list: any[], filter: string): any[] {
    return filter ? list.filter(item => item.name.toLowerCase().includes(filter)) : list;
  }

  /* |---------- Get ----------| */

  public async getUsers(): Promise<User[]> {
    try {
      const request = this.httpClient.get<boolean>(`${this.API_URL}/Auth`).pipe(
        map((response: any) => response.map(this.mapToUser))
      );
      const users: User[] = await lastValueFrom(request);
      return users;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      throw httpError.error;
    }
  }

  public async getChats(): Promise<Chat[]> {
    try {
      const request = this.httpClient.get<boolean>(`${this.API_URL}/Chat`).pipe(
        map((response: any) => response.map(this.mapToChat))
      );
      const chats: Chat[] = await lastValueFrom(request);
      return chats;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      throw httpError.error;
    }
  }

  public async getAmIAdmin(): Promise<void> {
    try {
      const request = this.httpClient.get<boolean>(`${this.API_URL}/Auth/AmIAdmin`, this.getOptions());
      const response: any = await lastValueFrom(request);
      
      this.isUserAdmin = response == 'true' ? true : false;
      
    } catch (error) {
      this.isUserAdmin = false;
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

  public async getUsersInChat(): Promise<void> {
    try {
      const chatId = this.selectedChat().chatId;
      const request = this.httpClient.get(`${this.API_URL}/Chat/UsersInChat/${chatId}`).pipe(
        map((response: any) => response.map(this.mapToUser))
      );
      const users: User[] = await lastValueFrom(request);
      this.memberList.set(users);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      throw httpError.error;
    }
  }
  private mapToUser(item: any): User {
    return {
      name: item.name,
      email: item.email
    }
  }

  public async getUserData(): Promise<void> {
    try {
      const request = this.httpClient.get<string>(`${this.API_URL}/Auth/UserData`, this.getOptions());
      const response: any = await lastValueFrom(request);
      this.userName = response;
      localStorage.setItem(this.USER_ITEM, response);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      throw httpError.error;
    }
  }

  /* |---------- Post ----------| */

  public async postSignUp(userData: any): Promise<string> {
    const formData = new FormData();
    formData.append('Name', userData.userName);
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);
    formData.append('PasswordBis', userData.passwordBis);

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Auth/SignUp`, formData, this.getOptions());
      const response: any = await lastValueFrom(request);
      this.toastr.success(response);
      return response;
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

  public async postLogIn(userData: any): Promise<boolean> {
    const formData = new FormData();
    formData.append('Email', userData.email);
    formData.append('Password', userData.password);

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Auth/Login`, formData, this.getOptions());
      const response: any = await lastValueFrom(request);
      
      this.isUserLogged = true;
      localStorage.setItem(this.TOKEN_ITEM, response);
      await this.getUserData();
      this.toastr.success("User logged in!");
      return this.isUserLogged;
    } catch (error) {
      this.isUserLogged = false;
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

  public async postCreateChat(chatName: string): Promise<void> {
    const formData = new FormData();
    formData.append('Name', chatName);

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Chat`, formData, this.getOptions());
      const response: any = await lastValueFrom(request);
      await this.getUserChatList();
      this.toastr.success(response);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

  public async postAddUserToChat(userToAdd: UserChatInsert): Promise<string> {
    const formData = new FormData();
    formData.append('ChatId', userToAdd.chatId);
    formData.append('UserName', userToAdd.userName);

    try {
      const request = this.httpClient.post<string>(`${this.API_URL}/Chat/AddUserToChat`, formData, this.getOptions());
      const response: any = await lastValueFrom(request);

      this.toastr.success(response);
      return response;

    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

  /* |---------- Delete ----------| */

  public logOut(): void {
    this.isUserLogged = false;
    this.chatList.set([]);
    this.selectedChat.set(new Chat);
    this.memberList.set([]);
    this.userName = '';
    localStorage.removeItem(this.TOKEN_ITEM);
    this.toastr.info('Logged out');
  }

  public async deleteUser(): Promise<void> {
    try {
      const request = this.httpClient.delete<string>(`${this.API_URL}/Auth`, this.getOptions());
      const response: any = await lastValueFrom(request);
      this.logOut();
      this.toastr.info(response);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      throw httpError.error;
    }
  }

  public async deleteLeaveChat(): Promise<void> {
    try {
      const chatId = this.selectedChat().chatId;
      const request = this.httpClient.delete<string>(`${this.API_URL}/Chat/LeaveChat/${chatId}`, this.getOptions());
      const response: any = await lastValueFrom(request);
      await this.getUserChatList();
      this.selectedChat.set(new Chat);
      this.toastr.info(response);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

  public async deleteChat(chatId: number): Promise<void> {
    try {
      const request = this.httpClient.delete<string>(`${this.API_URL}/Chat/${chatId}`, this.getOptions());
      const response: any = await lastValueFrom(request);
      await this.getUserChatList();
      this.selectedChat.set(new Chat);
      this.toastr.info(response);
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      this.toastr.error(httpError.error);
      throw httpError.error;
    }
  }

}
