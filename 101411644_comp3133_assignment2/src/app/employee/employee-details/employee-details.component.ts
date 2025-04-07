import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService, Employee, EmployeeUpdateInput } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent implements OnInit {
  employee: Employee | null = null;
  loading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';
  employeeId: string = '';
  isEditing: boolean = false;
  selectedFile: File | null = null;
  previewUrl: SafeUrl | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.fetchEmployeeDetails();
    });
  }

  fetchEmployeeDetails(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.employeeService.getEmployee(this.employeeId).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
        this.errorMessage = 'Failed to load employee details. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    this.errorMessage = '';
    this.successMessage = '';
    this.previewUrl = null;
    this.selectedFile = null;
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
    values.salary = Number(values.salary);

    // If a file was selected, upload it first
    if (this.selectedFile) {
      this.uploadFile(this.selectedFile, values);
    } else {
      // Otherwise, proceed with the employee update using the URL
      this.updateEmployee(values);
    }
  }

  uploadFile(file: File, formValues: any): void {
    this.employeeService.uploadImage(file).subscribe({
      next: (response) => {
        // Use the returned image URL for the employee photo
        formValues.employee_photo = response.url;
        this.updateEmployee(formValues);
      },
      error: (error) => {
        console.error('Error uploading file:', error);
        this.errorMessage = 'Failed to upload image. Please try again.';
        this.loading = false;
      }
    });
  }

  updateEmployee(values: any): void {
    const updateInput: EmployeeUpdateInput = {
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

    this.employeeService.updateEmployee(this.employeeId, updateInput).subscribe({
      next: (updatedEmployee) => {
        this.employee = updatedEmployee;
        this.successMessage = 'Employee updated successfully!';
        this.isEditing = false;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error updating employee:', error);
        
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          this.errorMessage = error.graphQLErrors[0].message;
        } else {
          this.errorMessage = 'An error occurred while updating the employee. Please try again.';
        }
        
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  deleteEmployee(): void {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(this.employeeId).subscribe({
      next: (success) => {
        if (success) {
          this.router.navigate(['/employees']);
        } else {
          this.errorMessage = 'Failed to delete employee. Please try again.';
        }
      },
      error: (error) => {
        console.error('Error deleting employee:', error);
        this.errorMessage = 'Failed to delete employee. Please try again.';
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
