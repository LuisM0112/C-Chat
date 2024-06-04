import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { ConfirmationPromptComponent } from "../confirmation-prompt/confirmation-prompt.component";

@Component({
  selector: 'app-header-menu',
  standalone: true,
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
  imports: [ConfirmationPromptComponent]
})
export class HeaderMenuComponent {

  constructor(public cchatService: CChatService){}

  public deleteUser = (): Promise<void> => {
    return this.cchatService.deleteUser();
  }
}
