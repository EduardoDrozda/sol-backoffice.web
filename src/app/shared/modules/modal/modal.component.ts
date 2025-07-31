import { Component, HostListener, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from './modal.service';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onBackdropClick($event)">
      <div class="modal-container" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="modal-title">{{ title() }}</h2>
          <button
            type="button"
            class="modal-close"
            (click)="close()"
            aria-label="Fechar modal"
          >
            <i class="fa fa-times"></i>
          </button>
        </div>

        <div class="modal-body">
          <ng-content></ng-content>
        </div>

        <div class="modal-footer" *ngIf="showFooter()">
          <ng-content select="[modal-footer]"></ng-content>
        </div>
      </div>
    </div>
  `
})
export class ModalComponent {
  readonly title = input<string>('');
  readonly showFooter = input<boolean>(true);
  readonly closeOnBackdrop = input<boolean>(true);
  readonly closeOnEscape = input<boolean>(true);

  private readonly modalService = inject(ModalService);

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.closeOnEscape()) {
      this.close();
    }
  }

  onBackdropClick(event: Event): void {
    if (this.closeOnBackdrop() && event.target === event.currentTarget) {
      this.close();
    }
  }

  public close(result?: any): void {
    this.modalService.close(result);
  }
}
