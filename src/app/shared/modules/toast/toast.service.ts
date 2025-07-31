import {
  ApplicationRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  inject
} from '@angular/core';
import { ToastComponent } from './toast.component';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastParams {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private appRef = inject(ApplicationRef);
  private envInjector = inject(EnvironmentInjector);
  private wrapper = this.ensureWrapper();

  showSuccess(message: string) {
    this.show({ message, type: 'success', title: 'Sucesso' });
  }

  showError(message: string) {
    this.show({ message, type: 'error', title: 'Erro' });
  }

  showInfo(message: string) {
    this.show({ message, type: 'info', title: 'Informação' });
  }

  showWarning(message: string) {
    this.show({ message, type: 'warning', title: 'Atenção' });
  }

  private show({
    message,
    type = 'info',
    duration = 3000,
    title = 'Atenção'
  }: ToastParams) {
    const toastRef = createComponent(ToastComponent, {
      environmentInjector: this.envInjector,
    });

    // Definir os inputs usando a nova API
    toastRef.setInput('title', title);
    toastRef.setInput('message', message);
    toastRef.setInput('type', type);

    this.appRef.attachView(toastRef.hostView);
    const domElem = (toastRef.hostView as any).rootNodes[0] as HTMLElement;
    this.wrapper.appendChild(domElem);

    setTimeout(() => {
      this.appRef.detachView(toastRef.hostView);
      toastRef.destroy();
    }, duration);
  }

  private ensureWrapper(): HTMLElement {
    const existing = document.querySelector('.toast-wrapper');
    if (existing) return existing as HTMLElement;

    const wrapper = document.createElement('div');
    wrapper.classList.add('toast-wrapper');
    Object.assign(wrapper.style, {
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      gap: '0.5rem',
      zIndex: '9999',
      pointerEvents: 'none',
    });
    document.body.appendChild(wrapper);
    return wrapper;
  }
}
