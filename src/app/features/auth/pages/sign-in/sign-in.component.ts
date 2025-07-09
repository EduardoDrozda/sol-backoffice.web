import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@shared/modules/toast/toast.service';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);

  form: FormGroup = this.formBuilder.group({
    email: ['email@email.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.authService.signIn(this.form.value).subscribe((response) => {
      console.log(response);
      this.toast.show({ message: 'Login berhasil', type: 'success' });
    });
  }
}
