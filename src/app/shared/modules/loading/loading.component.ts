import { Component, Input, computed, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div
      [class.overlay]="!inline()"
      [class.inline]="inline()"
    >
      <span
        class="spinner"
        [style.width]="sizeVar()"
        [style.height]="sizeVar()"
      ></span>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.7);
      z-index: 9999;
      pointer-events: none;
    }

    .inline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      border: 3px solid var(--color-primary-light);
      border-top-color: var(--color-primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent {
  inline = input<boolean>(false);
  size = input<4 | 6 | 8 | 10 | 12>(6);

  readonly sizeVar = computed(() => `var(--spacing-${this.size()})`);
}
