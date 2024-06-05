import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { ConfirmationPromptComponent } from "../confirmation-prompt/confirmation-prompt.component";
import * as strings from "../../../assets/data/strings.json";

@Component({
  selector: 'app-header-menu',
  standalone: true,
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css',
  imports: [ConfirmationPromptComponent]
})
export class HeaderMenuComponent {
  strings: any = strings;

  constructor(public cchatService: CChatService){}

  public deleteUser = (): Promise<void> => {
    return this.cchatService.deleteUser();
  }
}
