import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@shared/modules/toast';
import { AuthLayoutComponent } from '@features/auth/components/auth-layout';
import { LoadingComponent, LoadingService } from '@shared/modules/loading';
import { InputComponent } from '@shared/components/input';
import { finalize } from 'rxjs/operators';
import { RoutesEnum } from '@core/enums/routes.enum';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayoutComponent, LoadingComponent, InputComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  readonly loading = inject(LoadingService);

  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]]
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.start('forgot-password');
    const { email } = this.form.value;

    this.authService.requestPasswordReset({ email })
      .pipe(finalize(() => this.loading.stop('forgot-password')))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Email de reset enviado com sucesso! Verifique sua caixa de entrada.');
          this.router.navigate([RoutesEnum.SIGN_IN]);
        },
        error: () => {
          this.toastService.showError('Erro ao enviar email de reset. Tente novamente.');
        }
      });
  }

  goToSignIn(): void {
    this.router.navigate([RoutesEnum.SIGN_IN]);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return 'Email é obrigatório';
      }

      if (control.errors['email']) {
        return 'Email inválido';
      }
    }

    return '';
  }
}
