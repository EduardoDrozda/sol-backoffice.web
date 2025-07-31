import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, input, signal } from '@angular/core';
import { UserModel } from '@core/models/user.model';
import { ModalComponent } from '@shared/modules/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordConfirmValidatorSimple } from '@shared/validators';
import { RoleService } from '@core/services/role';
import { RoleModel } from '@core/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '@shared/modules/toast/toast.service';

@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent {
  @Input({ required: true }) title!: string;
  @Input() user: UserModel | null = null;

  private readonly roleService = inject(RoleService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);

  readonly roles = signal<RoleModel[]>([]);

  readonly form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordConfirmValidatorSimple()
  });

  constructor() {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getAllRoles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (roles) => {
          this.roles.set(roles);
        },
        error: () => {
          this.toastService.showError('Erro ao carregar roles');
        }
      });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: Implementar lógica de envio do formulário
  }
}
