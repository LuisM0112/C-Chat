import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  userData = {
    email: '',
    password: ''
  };

  constructor(public cchatService: CChatService){}

  public async logIn(): Promise<void> {
    try {
      const response = await this.cchatService.postLogIn(this.userData);
    } catch (error) {
      console.error('Error: ', error);
    }
  }
}
