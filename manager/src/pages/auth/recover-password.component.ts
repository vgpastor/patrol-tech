import {Component, Inject} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {IAuthService} from "../../services/auth/domain/IAuthService";
import {ApiAuthService} from "../../services/auth/infrastructure/ApiAuthService";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatError, MatFormField, MatHint, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    MatSnackBarModule,
    FormsModule,
    MatButton,
    MatError,
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.scss'
})
export class RecoverPasswordComponent {
  form: FormGroup;

  constructor(
    private snackBar: MatSnackBar,
    @Inject(ApiAuthService) private authService: IAuthService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.snackBar.open('Please fill in the email field', 'Close', {
        duration: 3000
      });
    }
    this.authService.recoverPassword(this.form.value.email).subscribe({
      next: () => {
        this.snackBar.open('An email has been sent to your email address', 'Close');
      },
      error: () => {
        this.snackBar.open('An error occurred', 'Close');
      }
    })
  }
}
