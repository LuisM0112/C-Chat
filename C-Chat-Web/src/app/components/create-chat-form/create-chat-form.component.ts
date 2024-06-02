import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-create-chat-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './create-chat-form.component.html',
  styleUrl: './create-chat-form.component.css'
})
export class CreateChatFormComponent {

  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  chatName: string = '';
  
  constructor(public cchatService: CChatService){}

  public async createChat(): Promise<void> {
    await this.cchatService.postCreateChat(this.chatName);
    this.closeForm();
  }

  public closeForm(): void {
    this.closeDialog.emit();
  }
}
