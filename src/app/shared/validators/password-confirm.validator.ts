import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para confirmação de senha
 * Verifica se a senha e a confirmação de senha são iguais
 *
 * @param passwordControlName - Nome do controle da senha
 * @param confirmPasswordControlName - Nome do controle da confirmação de senha
 * @returns ValidatorFn
 */
export function passwordConfirmValidator(
  passwordControlName: string,
  confirmPasswordControlName: string
): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const passwordControl = formGroup.get(passwordControlName);
    const confirmPasswordControl = formGroup.get(confirmPasswordControlName);

    if (!passwordControl || !confirmPasswordControl) {
      return null;
    }

    const password = passwordControl.value;
    const confirmPassword = confirmPasswordControl.value;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password !== confirmPassword) {
      // Adiciona o erro ao controle de confirmação de senha
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    // Remove o erro se as senhas coincidem
    if (confirmPasswordControl.hasError('passwordMismatch')) {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}

/**
 * Validador para confirmação de senha (versão simplificada)
 * Para ser usado diretamente no FormGroup
 */
export function passwordConfirmValidatorSimple(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  };
}
