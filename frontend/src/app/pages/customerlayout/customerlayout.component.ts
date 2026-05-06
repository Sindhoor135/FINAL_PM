import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CustomersidebarComponent } from '../../components/customersidebar/customersidebar.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customerlayout',
  imports: [RouterOutlet, CustomersidebarComponent],
  templateUrl: './customerlayout.component.html',
  styleUrl: './customerlayout.component.css'
})
export class CustomerlayoutComponent {
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
        console.log(response);
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
