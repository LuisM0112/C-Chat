import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CChatService } from '../../services/c-chat.service';
import * as strings from "../../../assets/data/strings.json";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  strings: any = strings;

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

  public reset(): void {
    this.userData = {
      userName: '',
      email: '',
      password: '',
      passwordBis: ''
    };
  }
}
