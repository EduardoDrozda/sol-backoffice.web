import { Component, HostListener, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PwaStatusComponent } from '@core/components/pwa-status/pwa-status.component';
import { CommonModule } from '@angular/common';
import { RouteOptions } from '@core/models/route-options.model';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, PwaStatusComponent, CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  readonly isSidebarOpen = signal(true);
  readonly isMobile = signal(false);

  readonly routes: RouteOptions[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-gauge-high',
      path: '/dashboard'
    },
    {
      title: 'Usuários',
      icon: 'fa-solid fa-users',
      path: '/users'
    }
  ];

  readonly sidebarClasses = computed(() => {
    const classes = ['shell-layout__sidebar'];
    const sidebarClass = this.isSidebarOpen() ? 'sidebar-open' : 'sidebar-collapsed';
    classes.push(sidebarClass);
    return classes.join(' ');
  });

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile();
    const newIsMobile = window.innerWidth < 1024;
    this.isMobile.set(newIsMobile);

    if (!wasMobile && newIsMobile) {
      this.isSidebarOpen.set(false);
    }
    else if (wasMobile && !newIsMobile) {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }
}
