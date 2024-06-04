import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-confirmation-prompt',
  standalone: true,
  imports: [],
  templateUrl: './confirmation-prompt.component.html',
  styleUrl: './confirmation-prompt.component.css'
})
export class ConfirmationPromptComponent {
  
  @Output() closeDialog: EventEmitter<void> = new EventEmitter<void>();

  @Input() func!: () => Promise<void>;
  @Input() text: string = '';

  constructor(public cchatSevice: CChatService) {}

  public confirm(): void {
    this.func().then(() => {
      this.closeForm();
    });
  }

  public closeForm(): void {
    this.closeDialog.emit();
  }
}
