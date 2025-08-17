import { Component, HostListener, signal, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { PwaStatusComponent } from '@core/components/pwa-status/pwa-status.component';
import { CommonModule } from '@angular/common';
import { RouteOptions } from '@core/models/route-options.model';
import { AuthService } from '@core/services';
import { RoutesEnum } from '@core/enums/routes.enum';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, PwaStatusComponent, CommonModule, RouterLinkActive, RouterLink],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss'
})
export class ShellComponent {
  readonly isSidebarOpen = signal(true);
  readonly isMobile = signal(false);
  readonly expandedMenus = signal<Set<string>>(new Set());

  private readonly authService = inject(AuthService);

  readonly routes: RouteOptions[] = [
    {
      title: 'Dashboard',
      icon: 'fa-solid fa-gauge-high',
      path: RoutesEnum.DASHBOARD
    },
    {
      title: 'Usuários',
      icon: 'fa-solid fa-users',
      path: RoutesEnum.USERS
    },
    {
      title: 'Configurações',
      icon: 'fa-solid fa-cog',
      children: [
        {
          title: 'Cargos',
          icon: 'fa-solid fa-user-tie',
          path: RoutesEnum.ROLES
        },
        {
          title: 'Permissões',
          icon: 'fa-solid fa-shield-halved',
          path: RoutesEnum.PERMISSIONS
        }
      ]
    }
  ];

  readonly sidebarClasses = computed(() => {
    const classes = ['shell-layout__sidebar'];
    const sidebarClass = this.isSidebarOpen() ? 'sidebar-open' : 'sidebar-collapsed';
    classes.push(sidebarClass);
    return classes.join(' ');
  });

  readonly isSubmenuExpanded = computed(() => this.expandedMenus().size > 0);

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
    } else if (wasMobile && !newIsMobile) {
      this.isSidebarOpen.set(true);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  closeSidebar(): void {
    this.isSidebarOpen.set(false);
  }

  toggleSubmenu(menuTitle: string): void {
    const currentExpanded = this.expandedMenus();
    const newExpanded = new Set(currentExpanded);

    if (newExpanded.has(menuTitle)) {
      newExpanded.delete(menuTitle);
    } else {
      newExpanded.add(menuTitle);
    }

    this.expandedMenus.set(newExpanded);
  }

  logout(): void {
    this.authService.logout();
  }
}
