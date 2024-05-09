import { Component, EventEmitter, Output } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Chat } from '../../model/classes/chat';
import { UserChatInsert } from '../../model/classes/user-chat-insert';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.css'
})
export class AddUserFormComponent {
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  selectedChat: Chat = new Chat();
  chatSubscription: Subscription | undefined;

  userName: string = '';
  
  constructor(public cchatService: CChatService){}

  public ngOnInit(): void {
    this.chatSubscription = this.cchatService.selectedChat.subscribe(chat => {
      this.selectedChat = chat;
    });
  }

  public async addUser(): Promise<void> {
    try {
      const userToAdd: UserChatInsert = new UserChatInsert(
        this.selectedChat.chatId.toString(),
        this.userName
      );
      await this.cchatService.postAddUserToChat(userToAdd);
      this.closeForm();
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public closeForm(): void {
    this.userName = ''
    this.closeDialog.emit();
  }
}
