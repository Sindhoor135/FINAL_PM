import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { OfficersidebarComponent } from '../../components/officersidebar/officersidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-officerlayout',
  imports: [RouterOutlet, OfficersidebarComponent],
  templateUrl: './officerlayout.component.html',
  styleUrl: './officerlayout.component.css'
})
export class OfficerlayoutComponent {
  userName: string = 'Unknown';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    const authResponse = localStorage.getItem('authResponse');
    if (authResponse) {
      const parsed = JSON.parse(authResponse);
      this.userName = parsed.userName ?? 'Unknown';
    }
  }

  handleLogout() {
    this.authService.logoutAPI().subscribe(
      (response) => {
        this.authService.logout();
        this.router.navigate(['']);
      },
      (error) => {
        console.error('Logout error:', error);
        this.authService.logout();
        this.router.navigate(['']);
      }
    );
  }
}
