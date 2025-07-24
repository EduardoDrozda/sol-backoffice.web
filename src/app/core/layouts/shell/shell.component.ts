import { Component, HostListener } from '@angular/core';
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
  isSidebarOpen = true;
  isMobile = false;

  routes: RouteOptions[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-gauge-high',
      path: '/dashboard'
    }
  ];

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024;

    if (!wasMobile && this.isMobile) {
      this.isSidebarOpen = false;
    }
    else if (wasMobile && !this.isMobile) {
      this.isSidebarOpen = true;
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  get sidebarClasses(): string {
    const classes = ['shell-layout__sidebar'];

    const sidebarClass = this.isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed';
    classes.push(sidebarClass);
    return classes.join(' ');
  }
}
