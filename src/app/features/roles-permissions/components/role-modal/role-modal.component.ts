import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal, viewChild, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { RoleModel } from '@core/models/role.model';
import { ModalComponent } from '@shared/modules/modal';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@shared/modules/toast/toast.service';
import { InputComponent } from '@shared/components';

@Component({
  selector: 'app-role-modal',
  standalone: true,
  imports: [ModalComponent, CommonModule, ReactiveFormsModule, InputComponent],
  templateUrl: './role-modal.component.html',
  styleUrl: './role-modal.component.scss'
})
export class RoleModalComponent implements OnInit, OnChanges {
  @Input({ required: true }) title!: string;
  @Input() role: RoleModel | null = null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly toastService = inject(ToastService);
  private readonly modal = viewChild<ModalComponent>('modal');

  readonly form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required]
  });


  ngOnInit(): void {
    this.patchFormValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['role'] && changes['role'].currentValue) {
      this.patchFormValues();
    }
  }

  private patchFormValues(): void {
    if (this.role) {
      this.form.patchValue({
        name: this.role.name,
        description: this.role.description
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    if (this.role) {
      const updatedRole = {
        ...formValue,
        id: this.role.id
      };
      this.modal()?.close(updatedRole);
      return;
    }

    this.modal()?.close(formValue);
  }

  onCancel(): void {
    this.close();
  }

  close(): void {
    this.modal()?.close();
  }
}
