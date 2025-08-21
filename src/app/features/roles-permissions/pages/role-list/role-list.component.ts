import { Component, DestroyRef, inject, signal, effect, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PaginationRequestModel, PaginationResponseModel } from '@core/models/pagination.model';
import { RoleModel } from '@core/models/role.model';
import { RoleService } from '@core/services/role/role.service';
import { RoleModalComponent } from '@features/roles-permissions/components/role-modal/role-modal.component';
import { TableColumn } from '@shared/components/table/models/table-column.model';
import { TableComponent } from '@shared/components/table/table.component';
import { DateHelper } from '@shared/helpers';
import { ModalService } from '@shared/modules/modal';
import { ToastService } from '@shared/modules/toast';
import { debounceTime, distinctUntilChanged, finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-role-list',
  standalone: true,
  imports: [TableComponent, ReactiveFormsModule],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})
export class RoleListComponent implements OnDestroy {
  private readonly roleService = inject(RoleService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly modalService = inject(ModalService);
  private readonly toastService = inject(ToastService);

  // Subject para gerenciar subscrições do modal
  private readonly modalDestroy$ = new Subject<void>();

  readonly form = this.formBuilder.group({ search: [''] });

  readonly columns = signal<TableColumn<RoleModel>[]>([
    {
      key: 'name',
      label: 'Nome',
      sortable: true,
      width: '200px'
    },
    {
      key: 'description',
      label: 'Descrição',
      sortable: true,
      width: '300px'
    },
    {
      key: 'permissions',
      label: 'Permissões',
      value: (role: RoleModel) => role.permissions?.length ? `${role.permissions.length} permissões` : 'Nenhuma permissão',
      width: '150px'
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      value: (role: RoleModel) => DateHelper.format(role.createdAt),
      sortable: true,
      width: '120px'
    },
    {
      key: 'updatedAt',
      label: 'Atualizado em',
      value: (role: RoleModel) => DateHelper.format(role.updatedAt),
      width: '120px'
    },
    {
      key: 'actions' as any,
      label: 'Ações',
      type: 'actions',
      width: '120px',
      actions: [
        {
          label: 'Editar',
          callback: (role: RoleModel) => this.openRoleModal(role)
        },
        {
          label: 'Excluir',
          callback: (role: RoleModel) => this.deleteRole(role)
        }
      ]
    }
  ]);

  readonly pagination = signal<PaginationResponseModel<RoleModel>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  readonly filter = signal({
    search: '' as string | null,
    sort: 'name' as string,
    order: 'asc' as 'asc' | 'desc'
  });

  readonly roles = signal<RoleModel[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.initializeSearchEffect();
    this.loadRoles();
  }

  private initializeSearchEffect(): void {
    this.form.get('search')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((value) => {
      this.filter.update(f => ({ ...f, search: value }));
      this.loadRoles();
    });
  }

  private loadRoles(): void {
    this.loading.set(true);

    const request: PaginationRequestModel = {
      page: this.pagination().page,
      limit: this.pagination().limit,
      search: this.filter().search,
      sort: this.filter().sort,
      order: this.filter().order
    };

    this.roleService
      .getAll(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response) {
            this.pagination.set(response);
            this.roles.set(response.data);
          }
        },
        error: (error) => {
          this.toastService.showError('Erro ao carregar cargos');
        }
      });
  }

  prevPage(): void {
    if (this.pagination().page > 1) {
      this.pagination.update(p => ({ ...p, page: p.page - 1 }));
      this.loadRoles();
    }
  }

  nextPage(): void {
    if (this.pagination().page < this.pagination().totalPages) {
      this.pagination.update(p => ({ ...p, page: p.page + 1 }));
      this.loadRoles();
    }
  }

  onPageChange(page: number): void {
    this.pagination.update(p => ({ ...p, page }));
    this.loadRoles();
  }

  onSortChange(sort: { key: string, direction: 'asc' | 'desc' }): void {
    this.filter.update(f => ({ ...f, sort: sort.key, order: sort.direction }));
    this.loadRoles();
  }

  private deleteRole(role: RoleModel): void {
    if (confirm(`Tem certeza que deseja excluir o cargo "${role.name}"?`)) {
      this.roleService.delete(role.id).subscribe({
        next: () => {
          this.toastService.showSuccess('Cargo excluído com sucesso');
          this.loadRoles();
        },
        error: () => {
          this.toastService.showError('Erro ao excluir cargo');
        }
      });
    }
  }

  openRoleModal(role?: RoleModel): void {
    this.modalDestroy$.next();

    const modalRef = this.modalService.open<RoleModalComponent>(RoleModalComponent, {
      data: {
        title: role ? 'Editar cargo' : 'Criar novo cargo',
        role: role ?? null
      },
      width: '600px'
    });

    modalRef.afterClosed()
      .pipe(takeUntil(this.modalDestroy$))
      .subscribe((result: RoleModel | null) => {
        if (!result) return;

        if (!result?.id) {
          this.createRole(result);
          return;
        }

        if (result?.id) {
          this.updateRole(result);
          return;
        }
      });
  }

  private createRole(role: Partial<RoleModel>): void {
    this.roleService.create(role).subscribe({
      next: () => {
        this.toastService.showSuccess('Cargo criado com sucesso');
        this.loadRoles();
      },
      error: (error) => {
        if (error?.error?.message?.includes('already exists')) {
          this.toastService.showError('Já existe um cargo com este nome');
        } else {
          this.toastService.showError('Erro ao criar cargo');
        }
      }
    });
  }

  private updateRole(role: RoleModel): void {
    this.roleService.update(role.id, role).subscribe({
      next: () => {
        this.toastService.showSuccess('Cargo atualizado com sucesso');
        this.loadRoles();
      },
      error: (error) => {
        if (error?.error?.message?.includes('already exists')) {
          this.toastService.showError('Já existe um cargo com este nome');
        } else {
          this.toastService.showError('Erro ao atualizar cargo');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.modalDestroy$.next();
    this.modalDestroy$.complete();
  }
}
