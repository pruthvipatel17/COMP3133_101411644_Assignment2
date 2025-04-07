import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { EmployeeService, Employee } from '../../services/employee.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  allEmployees: Employee[] = [];
  loading: boolean = true;
  errorMessage: string = '';
  searchDepartment: string = '';
  searchDesignation: string = '';

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchEmployees();
  }

  fetchEmployees(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.allEmployees = employees;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.errorMessage = 'Failed to load employees. Please try again.';
        this.loading = false;
      }
    });
  }

  deleteEmployee(employeeId: string): void {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.employeeService.deleteEmployee(employeeId).subscribe({
      next: (deletedEmployee) => {
        // If we get a response with an id, it means the deletion was successful
        if (deletedEmployee && deletedEmployee.id) {
          console.log('Employee deleted successfully:', deletedEmployee.id);
          this.fetchEmployees();
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

  viewEmployee(employeeId: string): void {
    this.router.navigate(['/employees', employeeId]);
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  filterEmployees(form: NgForm): void {
    const searchType = form.value['search-type'] || '';
    const searchString = form.value['search-string'] || '';

    if (!searchType || !searchString) {
      this.fetchEmployees();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    console.log(`Searching by ${searchType}: "${searchString}"`);

    // Create parameters based on search type
    let department = undefined;
    let designation = undefined;
    
    if (searchType === 'department') {
      department = searchString;
    } else if (searchType === 'designation') {
      designation = searchString;
    }

    this.employeeService.searchEmployees(department, designation).subscribe({
      next: (employees) => {
        console.log('Search results:', employees);
        this.employees = employees;
        this.loading = false;
        
        if (employees.length === 0) {
          console.log('No employees found matching the search criteria');
        }
      },
      error: (error) => {
        console.error('Error filtering employees:', error);
        this.errorMessage = 'Failed to filter employees. Please try again.';
        this.employees = this.allEmployees;
        this.loading = false;
      }
    });
  }

  clearSearch(): void {
    this.fetchEmployees();
  }

  logout(): void {
    this.authService.logout();
  }
}
