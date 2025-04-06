import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService, EmployeeInput } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-add.component.html',
  styleUrl: './employee-add.component.css'
})
export class EmployeeAddComponent implements OnInit {
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;
  
  // Default values for the form
  employee = {
    first_name: '',
    last_name: '',
    email: '',
    gender: 'Male',
    salary: 0,
    department: '',
    designation: '',
    date_of_joining: this.formatDate(new Date()),
    employee_photo: 'https://via.placeholder.com/150'
  };

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // No need to check login as auth guard handles this
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      
      // Create a preview URL for the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const values = form.value;
    
    // Convert salary to number
    values.salary = Number(values.salary);
    
    // If a file was selected, upload it first
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile, values, form);
    } else {
      // Otherwise, proceed with the employee creation using the URL
      this.createEmployee(values, form);
    }
  }

  uploadFile(file: File, formValues: any, form: NgForm): void {
    this.employeeService.uploadImage(file).subscribe({
      next: (response) => {
        // Use the returned image URL for the employee photo
        formValues.employee_photo = response.url;
        this.createEmployee(formValues, form);
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.errorMessage = 'Failed to upload image. Please try again.';
        this.loading = false;
      }
    });
  }

  createEmployee(values: any, form: NgForm): void {
    const employeeInput: EmployeeInput = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      gender: values.gender,
      salary: values.salary,
      department: values.department,
      designation: values.designation,
      date_of_joining: values.date_of_joining,
      employee_photo: values.employee_photo
    };

    this.employeeService.createEmployee(employeeInput).subscribe({
      next: (employee) => {
        this.successMessage = 'Employee added successfully!';
        
        // Reset form
        form.resetForm();
        
        // Redirect to employee list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/employees']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error adding employee:', error);
        
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          this.errorMessage = error.graphQLErrors[0].message;
        } else {
          this.errorMessage = 'An error occurred while adding the employee. Please try again.';
        }
        
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }

  logout(): void {
    this.authService.logout();
  }
}
