import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
import { DialogModalComponent } from './components/dialog-modal/dialog-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, AlertModalComponent, DialogModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
}
