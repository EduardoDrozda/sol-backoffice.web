import { Injectable } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {
  private updateAvailable$ = new BehaviorSubject<boolean>(false);
  private isOnline$ = new BehaviorSubject<boolean>(navigator.onLine);

  constructor(
    private swUpdate: SwUpdate,
    private swPush: SwPush
  ) {
    this.initializeServiceWorker();
    this.initializeOnlineStatus();
  }

  private initializeServiceWorker(): void {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          this.updateAvailable$.next(true);
        }
      });

      setInterval(() => {
        this.swUpdate.checkForUpdate();
      }, 6 * 60 * 60 * 1000);
    }
  }

  private initializeOnlineStatus(): void {
    window.addEventListener('online', () => {
      this.isOnline$.next(true);
    });

    window.addEventListener('offline', () => {
      this.isOnline$.next(false);
    });
  }

  get updateAvailable(): Observable<boolean> {
    return this.updateAvailable$.asObservable();
  }

  async applyUpdate(): Promise<void> {
    if (this.swUpdate.isEnabled) {
      await this.swUpdate.activateUpdate();
      window.location.reload();
    }
  }

  get isOnline(): Observable<boolean> {
    return this.isOnline$.asObservable();
  }

  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.warn('Permissão de notificação negada');
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
        console.log('PWA instalado com sucesso');
      }
      (window as any).deferredPrompt = null;
    }
  }

  isPWAInstalled(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;
  }

  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches;
  }
}
