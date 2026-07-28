import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.component.html',
})
export class AdminDashboardLayoutComponent {
  authService = inject(AuthService);

  user = computed(() => this.authService.user());

  activeIdx: number | null = 0;

  onToggle(index: number, event: Event) {
    const isOpen = (event.target as HTMLDetailsElement).open;
    if (isOpen) {
      this.activeIdx = index;
    } else if (this.activeIdx === index) {
      this.activeIdx = null;
    }
  }
}
