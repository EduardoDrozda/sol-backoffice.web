import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { UserModel } from '@core/models/user.model';
import { ModalComponent } from '@shared/modules/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordConfirmValidatorSimple } from '@shared/validators';
import { RoleService } from '@core/services/role';
import { RoleModel } from '@core/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-modal',
  imports: [ModalComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.scss'
})
export class UserModalComponent implements OnInit {
  @Input({ required: true }) title!: string;
  @Input() user: UserModel | null = null;

  private readonly roleService = inject(RoleService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  roles: RoleModel[] = [];

  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: passwordConfirmValidatorSimple()
  });

  ngOnInit() {
    this.roleService.getAllRoles().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (roles) => {
        this.roles = roles;
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.value);
  }
}
