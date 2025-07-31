import { Component, signal, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '@core/services/pwa/pwa.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-pwa-status',
  imports: [CommonModule],
  templateUrl: './pwa-status.component.html',
  styleUrl: './pwa-status.component.scss'
})
export class PwaStatusComponent {
  private readonly pwaService = inject(PwaService);
  private readonly destroyRef = inject(DestroyRef);

  // Signals para estado do PWA
  readonly showInstallPrompt = signal(false);
  readonly updateAvailable = signal(false);
  readonly isOnline = signal(navigator.onLine);
  readonly isPWAInstalled = signal(false);

  constructor() {
    this.initializePWAStatus();
    this.initializeServiceWorkerListeners();
    this.initializeInstallPrompt();
  }

  private initializePWAStatus(): void {
    // Verificar status inicial do PWA
    this.pwaService.isReallyInstalled().then((isInstalled) => {
      this.isPWAInstalled.set(isInstalled);
    });

    // Escutar mudanças no display mode
    window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
      this.isPWAInstalled.set(e.matches);
    });
  }

  private initializeServiceWorkerListeners(): void {
    // Escutar atualizações disponíveis
    this.pwaService.updateAvailable$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(available => {
        this.updateAvailable.set(available);
      });

    // Escutar status online/offline
    this.pwaService.isOnline$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(online => {
        this.isOnline.set(online);
      });
  }

  private initializeInstallPrompt(): void {
    // Escutar o evento beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;

      this.pwaService.isReallyInstalled().then((isInstalled) => {
        if (!isInstalled) {
          this.showInstallPrompt.set(true);
          this.isPWAInstalled.set(false);
        }
      });
    });

    // Escutar quando o PWA é instalado
    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt.set(false);
      this.isPWAInstalled.set(true);
    });
  }

  async installPWA(): Promise<void> {
    await this.pwaService.installPWA();
    this.showInstallPrompt.set(false);
  }

  dismissInstallPrompt(): void {
    this.showInstallPrompt.set(false);
  }

  async applyUpdate(): Promise<void> {
    await this.pwaService.applyUpdate();
  }
}
