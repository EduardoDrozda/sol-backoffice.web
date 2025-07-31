import { inject, Injectable, signal } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { ToastService } from '@shared/modules/toast';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly swPush = inject(SwPush);
  private readonly toastService = inject(ToastService);

  // Signals para estado do PWA
  private readonly _updateAvailable = signal(false);
  private readonly _isOnline = signal(navigator.onLine);

  // Observables derivados dos signals (para compatibilidade)
  readonly updateAvailable$ = toObservable(this._updateAvailable);
  readonly isOnline$ = toObservable(this._isOnline);

  constructor() {
    this.initializeServiceWorker();
    this.initializeOnlineStatus();
  }

  private initializeServiceWorker(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this._updateAvailable.set(true);
          this.toastService.showInfo('Atualização disponível');
        }
      });

      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }

  private initializeOnlineStatus(): void {
    window.addEventListener('online', () => {
      this._isOnline.set(true);
    });

    window.addEventListener('offline', () => {
      this._isOnline.set(false);
    });
  }

  get updateAvailable() {
    return this._updateAvailable.asReadonly();
  }

  get isOnline() {
    return this._isOnline.asReadonly();
  }

  async applyUpdate(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    }
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      this.toastService.showWarning('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      this.toastService.showWarning('Permissão de notificação negada');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  async sendNotification(title: string, options?: NotificationOptions): Promise<void> {
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }

  async installPWA(): Promise<void> {
    const deferredPrompt = (window as any).deferredPrompt;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        this.toastService.showSuccess('PWA instalado com sucesso');
      }
      (window as any).deferredPrompt = null;
    }
  }

  async isReallyInstalled(): Promise<boolean> {
    if ('getInstalledRelatedApps' in navigator) {
      const apps = await (navigator as any).getInstalledRelatedApps();
      return apps.length > 0;
    }

    return this.isPWAInstalled();
  }

  isPWAInstalled(): boolean {
    return this.isStandalone() || (window.navigator as any).standalone === true;
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}
