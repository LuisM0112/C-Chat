import { Component } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-header-menu',
  standalone: true,
  imports: [],
  templateUrl: './header-menu.component.html',
  styleUrl: './header-menu.component.css'
})
export class HeaderMenuComponent {

  constructor(public cchatservice: CChatService){}
  
  public deleteUser(): void {
    this.cchatservice.deleteUser();
  }
}
