import { Component, DestroyRef, inject, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationRequestModel, PaginationResponseModel } from '@core/models/pagination.model';
import { UserModel } from '@core/models/user.model';
import { UserService } from '@core/services/user/user.service';
import { UserModalComponent } from '@features/user/components/user-modal/user-modal.component';
import { TableColumn } from '@shared/components/table/models/table-column.model';
import { TableComponent } from '@shared/components/table/table.component';
import { DateHelper } from '@shared/helpers';
import { ModalService } from '@shared/modules/modal';
import { ToastService } from '@shared/modules/toast';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-user-list',
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  private readonly userService = inject(UserService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);

  readonly form = this.formBuilder.group({ search: [''] });

  readonly columns = signal<TableColumn<UserModel>[]>([
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
    },
    {
      key: 'role',
      label: 'Cargo',
      value: (user: UserModel) => user.role?.name || 'N/A',
      sortable: true,
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      value: (user: UserModel) => DateHelper.format(user.createdAt),
      sortable: true,
    },
    {
      key: 'updatedAt',
      label: 'Atualizado em',
      value: (user: UserModel) => DateHelper.format(user.updatedAt),
    },
    {
      key: 'isActive',
      label: 'Ativo',
      type: 'checkbox',
      onChange: (user: UserModel, checked: boolean) => this.toggleUserStatus(user, checked),
      sortable: true,
    },
    {
      key: 'actions' as any,
      label: 'Ações',
      type: 'actions',
      actions: [
        {
          label: 'Reenviar email de confirmação',
          callback: (user: UserModel) => this.resendConfirmationEmail(user)
        },
        {
          label: 'Resetar senha',
          callback: (user: UserModel) => this.resetPassword(user)
        }
      ]
    }
  ]);

  readonly pagination = signal<PaginationResponseModel<UserModel>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  readonly filter = signal({
    search: '' as string | null,
    sort: 'isActive' as string,
    order: 'desc' as 'asc' | 'desc'
  });

  readonly users = signal<UserModel[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.initializeSearchEffect();
    this.loadUsers();
  }

  private initializeSearchEffect(): void {
    this.form.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.filter.update(f => ({ ...f, search: value }));
      this.loadUsers();
    });
  }

  private loadUsers(): void {
    this.loading.set(true);

    const request: PaginationRequestModel = {
      page: this.pagination().page,
      limit: this.pagination().limit,
      search: this.filter().search,
      sort: this.filter().sort,
      order: this.filter().order
    };

    this.userService
      .getAll(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response && response.result) {
            this.pagination.set(response.result);
            this.users.set(response.result.data);
          }
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar usuários');
        }
      });
  }

  prevPage(): void {
    if (this.pagination().page > 1) {
      this.pagination.update(p => ({ ...p, page: p.page - 1 }));
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.pagination().page < this.pagination().totalPages) {
      this.pagination.update(p => ({ ...p, page: p.page + 1 }));
      this.loadUsers();
    }
  }

  onPageChange(page: number): void {
    this.pagination.update(p => ({ ...p, page }));
    this.loadUsers();
  }

  onSortChange(sort: { key: string, direction: 'asc' | 'desc' }): void {
    this.filter.update(f => ({ ...f, sort: sort.key, order: sort.direction }));
    this.loadUsers();
  }

  private toggleUserStatus(user: UserModel, checked: boolean): void {
    this.userService
      .toggleStatus(user.id, checked)
      .subscribe({
        next: () => {
          const message = checked ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso';
          this.toastService.showSuccess(message);
        }
      });
  }

  private resendConfirmationEmail(user: UserModel): void {
    // TODO: Implementar reenvio de email de confirmação
  }

  private resetPassword(user: UserModel): void {
    // TODO: Implementar reset de senha
  }

  openUserModal(user?: UserModel): void {
    const modalRef = this.modalService.open<UserModalComponent>(UserModalComponent, {
      data: {
        title: user ? 'Editar usuário' : 'Criar novo usuário',
        user: user ?? null
      },
      width: '1000px'
    });

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        // TODO: Implementar lógica quando modal é fechado com resultado
      }
    });
  }
}
