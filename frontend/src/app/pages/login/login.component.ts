import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    private router = inject(Router);
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);
    
    loginForm!: FormGroup;
    submitted = false;
    isLoading = false;
    errorMessage = '';

    ngOnInit() {
      this.initializeForm();
    }

    initializeForm() {
      this.loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        userType: ['officer']
      });
    }

    get email() {
      return this.loginForm.get('email');
    }

    get password() {
      return this.loginForm.get('password');
    }

    get userType() {
      return this.loginForm.get('userType')?.value || 'officer';
    }

    handleLogin() {
      this.submitted = true;
      this.errorMessage = '';

      if (this.loginForm.invalid) {
        return;
      }

      this.isLoading = true;

      const credentials = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login successful!', response);
          const type=response['role'];
          
          // Navigate based on user type
          if (type === 'ADMIN') {
            this.router.navigate(['/officer']);
          } else {
            this.router.navigate(['/customer']);
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Login failed:', error);
          // this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          this.errorMessage = 'Incorrect Credentials.';
        }
      });
    }
}
