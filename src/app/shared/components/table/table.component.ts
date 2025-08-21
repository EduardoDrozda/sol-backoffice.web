import { Component, Signal, HostListener, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './models/table-column.model';
import { LoadingComponent } from '@shared/modules/loading';

@Component({
  selector: 'sol-table',
  imports: [CommonModule, LoadingComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {
  readonly data = input.required<T[]>();
  readonly columns = input.required<TableColumn<T>[]>();
  readonly paginable = input(false);
  readonly pagination = input<{ page: number; totalPages: number }>();
  readonly loading = input(false);

  readonly pageChange = output<number>();
  readonly sortChange = output<{ key: string, direction: 'asc' | 'desc' }>();

  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(col: TableColumn<T>): void {
    if (!col.sortable) return;

    if (this.sortKey === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDirection = 'asc';
    }

    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  private openActionsRow: T | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.sol-table-actions')) {
      this.openActionsRow = null;
    }
  }

  onChange(col: TableColumn<T>, row: T, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (col.type === 'checkbox' && col.onChange) {
      col.onChange(row, input.checked);
    }
  }

  toggleActionsMenu(row: T): void {
    this.openActionsRow = this.openActionsRow === row ? null : row;
  }

  isActionsMenuOpen(row: T): boolean {
    return this.openActionsRow === row;
  }

  onActionClick(action: { label: string; icon?: string; callback: (row: T) => void }, row: T): void {
    action.callback(row);
    this.openActionsRow = null;
  }

  prevPage(type?: 'first'): void {
    if (!this.pagination()) return;
    if (type === 'first') {
      if (this.pagination()!.page > 1) this.pageChange.emit(1);
      return;
    }
    if (this.pagination()!.page > 1) this.pageChange.emit(this.pagination()!.page - 1);
  }

  nextPage(type?: 'last'): void {
    if (!this.pagination()) return;

    if (type === 'last') {
      if (this.pagination()!.page < this.pagination()!.totalPages) this.pageChange.emit(this.pagination()!.totalPages);
      return;
    }

    if (this.pagination()!.page < this.pagination()!.totalPages) this.pageChange.emit(this.pagination()!.page + 1);
  }

  goToPage(page: number): void {
    if (this.pagination() && page !== this.pagination()!.page) {
      this.pageChange.emit(page);
    }
  }

  getPagesArray(): number[] {
    if (!this.pagination()) return [];
    return Array.from({ length: this.pagination()!.totalPages }, (_, i) => i + 1);
  }
}
