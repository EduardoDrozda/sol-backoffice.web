import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PwaService } from '@core/services/pwa/pwa.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-pwa-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwa-status.component.html',
  styleUrl: './pwa-status.component.scss'
})
export class PwaStatusComponent implements OnInit, OnDestroy {
  showInstallPrompt = false;
  updateAvailable = false;
  isOnline = true;
  isPWAInstalled = false;

  private subscriptions: Subscription[] = [];

  constructor(private pwaService: PwaService) {}

  ngOnInit(): void {
    this.subscriptions.push(

      this.pwaService.updateAvailable.subscribe(available => {
        this.updateAvailable = available;
      }),

      this.pwaService.isOnline.subscribe(online => {
        this.isOnline = online;
      })
    );

    this.isPWAInstalled = this.pwaService.isPWAInstalled();
    this.setupInstallPrompt();

    if (!this.isPWAInstalled) {
      setTimeout(() => {
        this.showInstallPrompt = true;
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private setupInstallPrompt(): void {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      (window as any).deferredPrompt = e;
      this.showInstallPrompt = true;
    });

    window.addEventListener('appinstalled', () => {
      this.showInstallPrompt = false;
      this.isPWAInstalled = true;
    });
  }

  async installPWA(): Promise<void> {
    await this.pwaService.installPWA();
    this.showInstallPrompt = false;
  }

  dismissInstallPrompt(): void {
    this.showInstallPrompt = false;
  }

  async applyUpdate(): Promise<void> {
    await this.pwaService.applyUpdate();
  }
}
