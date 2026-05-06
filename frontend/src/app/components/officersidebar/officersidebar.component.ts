import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-officersidebar',
  imports: [RouterLink],
  templateUrl: './officersidebar.component.html',
  styleUrl: './officersidebar.component.css'
})
export class OfficersidebarComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);

  async openPayment() {
    const id = await this.dialogService.prompt(
      'Enter Parcel ID to make payment',
      'Officer Payment',
      'Parcel ID'
    );
    if (id) {
      this.router.navigate([`officer/payment/${id}`]);
    }
  }
}
