import { Component, DestroyRef, inject, signal } from '@angular/core';
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

  form = this.formBuilder.group({ search: [''] });

  columns = signal<TableColumn<UserModel>[]>([
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

  pagination = signal<PaginationResponseModel<UserModel>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  filter = {
    search: '' as string | null,
    sort: 'isActive' as string,
    order: 'desc' as 'asc' | 'desc'
  };

  users = signal<UserModel[]>([]);
  loading = signal<boolean>(false);

  ngOnInit() {
    this.loadUsers();

    this.form.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.filter.search = value;
      this.loadUsers();
    });
  }

  private loadUsers() {
    this.loading.set(true);

    const request: PaginationRequestModel = {
      page: this.pagination().page,
      limit: this.pagination().limit,
      search: this.filter.search,
      sort: this.filter.sort,
      order: this.filter.order
    };

    this
      .userService
      .getAll(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response) {
            this.pagination.set(response);
            this.users.set(response.data);
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  prevPage() {
    if (this.pagination().page > 1) {
      this.pagination.update(p => ({ ...p, page: p.page - 1 }));
      this.loadUsers();
    }
  }

  nextPage() {
    if (this.pagination().page < this.pagination().totalPages) {
      this.pagination.update(p => ({ ...p, page: p.page + 1 }));
      this.loadUsers();
    }
  }

  onPageChange(page: number) {
    this.pagination.update(p => ({ ...p, page }));
    this.loadUsers();
  }

  onSortChange(sort: { key: string, direction: 'asc' | 'desc' }) {
    this.filter.sort = sort.key;
    this.filter.order = sort.direction;
    this.loadUsers();
  }

  private toggleUserStatus(user: UserModel, checked: boolean) {
    this
      .userService
      .toggleStatus(user.id, checked)
      .subscribe({
        next: (response) => {
          const message = checked ? 'Usuário ativado com sucesso' : 'Usuário desativado com sucesso';
          this.toastService.showSuccess(message);
        }
      });
  }

  private resendConfirmationEmail(user: UserModel) {
    console.log('Reenviar email de confirmação para', user);
    // Aqui você pode chamar o serviço correspondente
  }

  private resetPassword(user: UserModel) {
    console.log('Resetar senha para', user);
    // Aqui você pode chamar o serviço correspondente
  }

  openUserModal(user?: UserModel) {
    const modalRef = this.modalService.open<UserModalComponent>(UserModalComponent, {
      data: {
        title: user ? 'Editar usuário' : 'Criar novo usuário',
        user: user ?? null
      },
      width: '1000px'
    });

    modalRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Modal fechado com resultado:', result);
      } else {
        console.log('Modal fechado sem resultado');
      }
    });
  }

}
