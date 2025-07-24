import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthLayoutComponent } from '@features/auth/components/auth-layout';
import { LoadingComponent, LoadingService } from '@shared/modules/loading';
import { ToastService } from '@shared/modules/toast/toast.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, AuthLayoutComponent, LoadingComponent],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  readonly loading = inject(LoadingService);

  form: FormGroup = this.formBuilder.group({
    email: ['admin@email.com', [Validators.required, Validators.email]],
    password: ['password123', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.loading.start('sign-in');
    this.authService
      .signIn(this.form.value)
      .pipe(finalize(() => this.loading.stop('sign-in')))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Login realizado com sucesso');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.toast.showError('Erro ao fazer login');
        }
      });
  }
}
