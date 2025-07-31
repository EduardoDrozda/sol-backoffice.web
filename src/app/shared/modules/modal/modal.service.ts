import {
  Injectable,
  ComponentRef,
  Type,
  Injector,
  ApplicationRef,
  EmbeddedViewRef,
  createComponent,
  inject,
  signal,
} from '@angular/core';

import { Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

export interface ModalConfig {
  data?: any;
  width?: string;
  height?: string;
  backdrop?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export interface ModalRef {
  close: (result?: any) => void;
  afterClosed: () => Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private readonly injector = inject(Injector);
  private readonly appRef = inject(ApplicationRef);

  private modalRef: ComponentRef<any> | null = null;
  private readonly _result = signal<any>(null);
  readonly result$ = toObservable(this._result);

  open<T = any>(
    component: Type<T>,
    config: ModalConfig = {}
  ): ModalRef {
    if (this.modalRef) {
      this.close();
    }

    try {
      this.modalRef = createComponent(component, {
        environmentInjector: this.appRef.injector
      });

      if (config.data && this.modalRef.instance) {
        Object.assign(this.modalRef.instance, config.data);
      }

      this.appRef.attachView(this.modalRef.hostView);

      const domElem = (this.modalRef.hostView as EmbeddedViewRef<any>).rootNodes[0];
      document.body.appendChild(domElem);

      this.setupModal(config);

      return {
        close: (result?: any) => this.close(result),
        afterClosed: () => this.result$
      };
    } catch (error) {
      throw error;
    }
  }

  private setupModal(config: ModalConfig): void {
    if (!this.modalRef) return;

    const modalElement = this.modalRef.location.nativeElement;

    // Aplicar estilos se fornecidos
    if (config.width) {
      modalElement.style.setProperty('--modal-width', config.width);
    }
    if (config.height) {
      modalElement.style.setProperty('--modal-height', config.height);
    }

    // Adicionar classe de abertura
    requestAnimationFrame(() => {
      modalElement.classList.add('modal-open');
    });
  }

  close(result?: any): void {
    if (!this.modalRef) return;

    if (this.modalRef.location.nativeElement.classList.contains('modal-closing')) {
      return;
    }

    const modalElement = this.modalRef.location.nativeElement;
    modalElement.classList.add('modal-closing');

    setTimeout(() => {
      if (this.modalRef) {
        this.appRef.detachView(this.modalRef.hostView);
        this.modalRef.destroy();
        this.modalRef = null;
      }

      this._result.set(result);
    }, 300);
  }
}
