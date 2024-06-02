import { Component, EffectRef, EventEmitter, OnDestroy, Output, effect } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { FormsModule } from '@angular/forms';
import { Chat } from '../../model/classes/chat';
import { UserChatInsert } from '../../model/classes/user-chat-insert';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-user-form.component.html',
  styleUrl: './add-user-form.component.css'
})
export class AddUserFormComponent implements OnDestroy {
  
  private effectRef: EffectRef;

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  selectedChat: Chat = new Chat();
  userName: string = '';
  
  constructor(public cchatService: CChatService){
    this.effectRef = effect(() => {
      this.selectedChat = cchatService.selectedChat();
    });
  }

  public async addUser(): Promise<void> {
    const userToAdd: UserChatInsert = new UserChatInsert(
      this.selectedChat.chatId.toString(),
      this.userName
    );
    await this.cchatService.postAddUserToChat(userToAdd);
    this.closeForm();
    this.userName = ''
    this.cchatService.getUsersInChat();
  }

  public closeForm(): void {
    this.closeDialog.emit();
  }

  public ngOnDestroy(): void {
    this.effectRef.destroy();
  }
}
