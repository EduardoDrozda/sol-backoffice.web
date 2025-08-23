import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, input, signal, viewChild } from '@angular/core';
import { UserModel } from '@core/models/user.model';
import { ModalComponent } from '@shared/modules/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoleService } from '@core/services/role';
import { RoleModel } from '@core/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastService } from '@shared/modules/toast/toast.service';
import { SelectComponent, SelectOption, InputComponent } from '@shared/components';

@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent, CommonModule, ReactiveFormsModule, SelectComponent, InputComponent],
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
  private readonly modal = viewChild<ModalComponent>('modal');


  readonly roles = signal<RoleModel[]>([]);
  readonly roleOptions = signal<SelectOption[]>([]);

  readonly form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    roleId: ['', Validators.required]
  });

  constructor() {
    this.loadRoles();
  }

  private loadRoles(): void {
    this.roleService.getAllSimple()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.roles.set(result || []);
          const options: SelectOption[] = this.roles().map(role => ({
            value: role.id,
            label: role.name
          }));

          this.roleOptions.set(options);
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

    this.modal()?.close(this.form.value);
  }

  onCancel(): void {
    this.form.reset();
    this.modal()?.close();
  }
}
