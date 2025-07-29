import { Component, Input, Signal, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableColumn } from './models/table-column.model';

@Component({
  selector: 'sol-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
})
export class TableComponent<T> {
  @Input({ required: true }) data!: Signal<T[]>;
  @Input({ required: true }) columns!: Signal<TableColumn<T>[]>;
  @Input() paginable = false;
  @Input() pagination?: { page: number; totalPages: number };
  @Output() pageChange = new EventEmitter<number>();

  @Output() sortChange = new EventEmitter<{ key: string, direction: 'asc' | 'desc' }>();
  sortKey: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  onSort(col: TableColumn<T>) {
    if (!col.sortable) return;

    if (this.sortKey === col.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = col.key;
      this.sortDirection = 'asc';
    }
    console.log(this.sortKey, this.sortDirection);
    this.sortChange.emit({ key: this.sortKey, direction: this.sortDirection });
  }

  private openActionsRow: T | null = null;

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.sol-table-actions')) {
      this.openActionsRow = null;
    }
  }

  onChange(col: TableColumn<T>, row: T, event: Event) {
    const input = event.target as HTMLInputElement;

    if (col.type === 'checkbox' && col.onChange) {
      col.onChange(row, input.checked);
    }

    return;
  }

  toggleActionsMenu(row: T) {
    this.openActionsRow = this.openActionsRow === row ? null : row;
  }

  isActionsMenuOpen(row: T): boolean {
    return this.openActionsRow === row;
  }

  onActionClick(action: { label: string; icon?: string; callback: (row: T) => void }, row: T) {
    action.callback(row);
    this.openActionsRow = null;
  }

  prevPage(type?: 'first') {
    if (!this.pagination) return;
    if (type === 'first') {
      if (this.pagination.page > 1) this.pageChange.emit(1);
      return;
    }
    if (this.pagination.page > 1) this.pageChange.emit(this.pagination.page - 1);
  }

  nextPage(type?: 'last') {
    if (!this.pagination) return;

    if (type === 'last') {
      if (this.pagination.page < this.pagination.totalPages) this.pageChange.emit(this.pagination.totalPages);
      return;
    }

    if (this.pagination.page < this.pagination.totalPages) this.pageChange.emit(this.pagination.page + 1);
  }

  goToPage(page: number) {
    if (this.pagination && page !== this.pagination.page) {
      this.pageChange.emit(page);
    }
  }

  getPagesArray(): number[] {
    if (!this.pagination) return [];
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }
}
