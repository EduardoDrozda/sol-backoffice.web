import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { AuthLayoutComponent } from '@features/auth/components/auth-layout';
import { LoadingComponent, LoadingService } from '@shared/modules/loading';
import { ToastService } from '@shared/modules/toast/toast.service';
import { InputComponent } from '@shared/components/input';
import { finalize } from 'rxjs/operators';
import { RoutesEnum } from '@core/enums/routes.enum';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, AuthLayoutComponent, LoadingComponent, InputComponent, RouterModule],
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
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    this.loading.start('sign-in');
    this.authService
      .signIn(this.form.value)
      .pipe(finalize(() => this.loading.stop('sign-in')))
      .subscribe({
        next: () => {
          this.toast.showSuccess('Login realizado com sucesso');
          this.router.navigate([RoutesEnum.DASHBOARD]);
        },
        error: () => {
          this.toast.showError('Erro ao fazer login');
        }
      });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control?.touched) return '';

    if (control.errors['required']) {
      return fieldName === 'email' ? 'E-mail é obrigatório' : 'Senha é obrigatória';
    }

    if (control.errors['email']) {
      return 'E-mail inválido';
    }

    if (control.errors['minlength']) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    return 'Campo inválido';
  }
}
