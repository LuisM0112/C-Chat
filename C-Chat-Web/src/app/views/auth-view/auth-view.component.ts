import { Component, OnInit } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { LogInComponent } from "../../components/log-in/log-in.component";

@Component({
  selector: 'app-auth-view',
  standalone: true,
  templateUrl: './auth-view.component.html',
  styleUrl: './auth-view.component.css',
  imports: [SignUpComponent, LogInComponent]
})
export class AuthViewComponent implements OnInit {

  showSignUpDialog: boolean = false;
  toggleDialogText: string = "I don't have an account, sign up";

  constructor(public cchatservice: CChatService){}

  public ngOnInit(): void {
    const dialog = document.getElementById("dialog-auth") as HTMLDialogElement;
    dialog.showModal();
  }
  
  public toggleDialog(): void {
    this.showSignUpDialog = !this.showSignUpDialog;
    this.showSignUpDialog ? this.toggleDialogText = "I already have an account, log in" : this.toggleDialogText = "I don't have an account, sign up"
  }
}
