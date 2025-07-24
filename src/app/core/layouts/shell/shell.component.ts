import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PwaStatusComponent } from '@core/components/pwa-status/pwa-status.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, PwaStatusComponent, CommonModule],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  isSidebarOpen = true;
  isMobile = false;

  constructor() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  private checkScreenSize(): void {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth < 1024; // Breakpoint lg (1024px)

    // Se mudou de desktop para mobile, fecha o sidebar
    if (!wasMobile && this.isMobile) {
      this.isSidebarOpen = false;
    }
    // Se mudou de mobile para desktop, abre o sidebar
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

    if (this.isSidebarOpen) {
      classes.push('sidebar-open');
    } else {
      classes.push('sidebar-collapsed');
    }

    return classes.join(' ');
  }
}
