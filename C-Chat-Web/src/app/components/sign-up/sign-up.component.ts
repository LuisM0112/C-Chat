import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CChatService } from '../../services/c-chat.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {

  userData = {
    userName: '',
    email: '',
    password: '',
    passwordBis: ''
  };

  constructor(public cchatService: CChatService){}

  public async signUp(): Promise<void> {
    const response = await this.cchatService.postSignUp(this.userData);
    console.log(response);
  }
}
