import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-toast',
  imports: [CommonModule],
  template: `
    <div
      class="toast"
      [class.success]="type === 'success'"
      [class.error]="type === 'error'"
      [class.info]="type === 'info'"
      [class.warning]="type === 'warning'"
    >
      {{ message }}
    </div>
  `,
  styles: [`
    .toast {
      background: #333;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 4px;
      font-weight: bold;
      min-width: 250px;
      max-width: 400px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      transform: translateX(100%);
      animation: slideInRight 0.4s ease-out forwards;
      pointer-events: auto;
    }

    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    .success { background-color: #28a745; }
    .error   { background-color: #dc3545; }
    .info    { background-color: #17a2b8; }
    .warning { background-color: #ffc107; color: #000; }
  `]
})
export class ToastComponent {
  @Input({ required: true }) message!: string;
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'info';
}
