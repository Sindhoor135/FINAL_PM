import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DialogService } from '../../services/dialog.service';

@Component({
  selector: 'app-customersidebar',
  imports: [RouterLink],
  templateUrl: './customersidebar.component.html',
  styleUrl: './customersidebar.component.css'
})
export class CustomersidebarComponent {
  private router = inject(Router);
  private dialogService = inject(DialogService);

  async openPayment() {
    const id = await this.dialogService.prompt(
      'Enter Parcel ID to make payment',
      'Customer Payment',
      'Parcel ID'
    );
    if (id) {
      this.router.navigate([`customer/payment/${id}`]);
    }
  }
}
