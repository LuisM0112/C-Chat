import { Component, OnInit } from '@angular/core';
import { CChatService } from '../../services/c-chat.service';
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { LogInComponent } from "../../components/log-in/log-in.component";
import * as strings from "../../../assets/data/strings.json";

@Component({
  selector: 'app-auth-view',
  standalone: true,
  templateUrl: './auth-view.component.html',
  styleUrl: './auth-view.component.css',
  imports: [SignUpComponent, LogInComponent]
})
export class AuthViewComponent implements OnInit {
  strings: any = strings;

  showSignUpDialog: boolean = false;

  constructor(public cchatservice: CChatService){}

  public ngOnInit(): void {
    const dialog = document.getElementById("dialog-auth") as HTMLDialogElement;
    dialog.showModal();
  }
  
  public toggleDialog(): void {
    this.showSignUpDialog = !this.showSignUpDialog;
  }
}
