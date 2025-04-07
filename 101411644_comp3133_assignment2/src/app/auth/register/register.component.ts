import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  errorMessage: string = '';
  successMessage: string = '';
  loading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const values = form.value;
    
    // Validate password match
    if (values['register-password'] !== values['register-confirm-password']) {
      this.errorMessage = "Passwords do not match";
      this.loading = false;
      return;
    }

    const username = values['register-username'];
    const email = values['register-email'];
    const password = values['register-password'];

    this.authService.register(username, email, password).subscribe({
      next: (response) => {
        this.successMessage = "Registration successful! Redirecting to login...";
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          const graphqlError = error.graphQLErrors[0].message;
          
          if (graphqlError.includes('User already exists')) {
            this.errorMessage = 'Username or email is already taken';
          } else {
            this.errorMessage = graphqlError;
          }
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
        
        this.loading = false;
      }
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
