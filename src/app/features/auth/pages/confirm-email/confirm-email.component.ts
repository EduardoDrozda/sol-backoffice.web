import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { ToastService } from '@shared/modules/toast';
import { AuthLayoutComponent } from '@features/auth/components/auth-layout';
import { LoadingComponent, LoadingService } from '@shared/modules/loading';
import { InputComponent } from '@shared/components/input';
import { finalize } from 'rxjs/operators';
import { RoutesEnum } from '@core/enums/routes.enum';

// Validador personalizado para senhas iguais
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // Só validar se ambos os campos têm valor
  if (password && confirmPassword && password !== confirmPassword) {
    console.log('Senhas não coincidem:', { password, confirmPassword });
    return { passwordMismatch: true };
  }

  return null;
}

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AuthLayoutComponent, LoadingComponent, InputComponent],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss'
})
export class ConfirmEmailComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  readonly loading = inject(LoadingService);

  form: FormGroup = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
  }, { validators: passwordMatchValidator });

  token: string = '';
  tokenValid = false;

    ngOnInit(): void {
    this.getTokenFromRoute();
    this.validateToken();
  }

  private getTokenFromRoute(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';
    if (!this.token) {
      this.toastService.showError('Token de confirmação não encontrado');
      this.router.navigate([RoutesEnum.SIGN_IN]);
    }
  }

    private async validateToken(): Promise<void> {
    if (!this.token) return;

    try {
      // Aqui você pode adicionar uma validação do token se necessário
      this.tokenValid = true;
    } catch (error) {
      this.toastService.showError('Token de confirmação inválido ou expirado');
      this.router.navigate([RoutesEnum.SIGN_IN]);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading.start('confirm-email');

    this.authService
      .confirmEmailWithPassword({
        token: this.token,
        password: this.form.value.password,
        confirmPassword: this.form.value.confirmPassword
      })
      .pipe(finalize(() => this.loading.stop('confirm-email')))
      .subscribe({
        next: () => {
          this.toastService.showSuccess('Email confirmado com sucesso! Sua conta foi ativada.');
          this.router.navigate([RoutesEnum.SIGN_IN]);
        },
        error: () => {
          this.toastService.showError('Erro ao confirmar email');
        }
      });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);

    // Debug
    if (fieldName === 'confirmPassword') {
      console.log('getErrorMessage debug:', {
        fieldName,
        controlErrors: control?.errors,
        controlTouched: control?.touched,
        formErrors: this.form.errors,
        passwordMismatch: this.form.errors?.['passwordMismatch']
      });
    }

    // Verificar erros específicos do campo primeiro
    if (control?.errors && control?.touched) {
      if (control.errors['required']) {
        return fieldName === 'password' ? 'Senha é obrigatória' : 'Confirmação de senha é obrigatória';
      }

      if (control.errors['minlength']) {
        return fieldName === 'password' ? 'Senha deve ter pelo menos 6 caracteres' : 'Confirmação de senha deve ter pelo menos 6 caracteres';
      }
    }

    // Validação específica para confirmPassword (erro do formulário)
    if (fieldName === 'confirmPassword' && this.form.errors?.['passwordMismatch'] && control?.touched) {
      return 'As senhas não coincidem';
    }

    return '';
  }
}
