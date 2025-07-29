import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationRequestModel, PaginationResponseModel } from '@core/models/pagination.model';
import { UserModel } from '@core/models/user.model';
import { UserService } from '@core/services/user/user.service';
import { TableColumn } from '@shared/components/table/models/table-column.model';
import { TableComponent } from '@shared/components/table/table.component';
import { BooleanToStringHelper, DateHelper } from '@shared/helpers';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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
      key: 'created_at',
      label: 'Criado em',
      value: (user: UserModel) => DateHelper.format(user.created_at),
      sortable: true,
    },
    {
      key: 'updated_at',
      label: 'Atualizado em',
      value: (user: UserModel) => DateHelper.format(user.updated_at),
    },
    {
      key: 'is_active',
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
    sort: '' as string | null,
    order: 'asc' as 'asc' | 'desc' | null
  };

  users = signal<UserModel[]>([]);

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
          console.log(response);
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
}
