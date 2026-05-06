import { Component, OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

interface RegisterFormData {
  fullName: string;
  email: string;
  passwordHash: string;
  confirmPassword: string;
  mobile: string;
  address: string;
  role: string;
}

@Component({
  selector: 'app-register',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  submitted = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  private noDummyMobileValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const value = control.value.toString();
    if (value.length !== 10) return null;
    const firstDigit = value[0];
    if (value.split('').every((digit: string) => digit === firstDigit)) {
      return { dummyMobile: true };
    }
    return null;
  };

  private passwordStrengthValidator = (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const password = control.value;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      return { weakPassword: true };
    }
    return null;
  };

  private passwordMatchValidator = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('passwordHash')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  };

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      passwordHash: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/), this.noDummyMobileValidator]],
      address: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  onRegister(): void {
    this.submitted = true;
    this.successMessage = '';
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const formValue = this.registerForm.value;
    const payload = {
      fullName: formValue.fullName,
      email: formValue.email,
      passwordHash: formValue.passwordHash,
      mobile: formValue.mobile,
      address: formValue.address,
      role: 'CUSTOMER'
    };

    this.authService.register(payload).subscribe(
      (response) => {
        this.isLoading = false;
        this.successMessage = 'Registration successful! Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      (error) => {
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
      }
    );
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onReset(): void {
    this.registerForm.reset();
    this.submitted = false;
    this.successMessage = '';
    this.errorMessage = '';
  }
}
