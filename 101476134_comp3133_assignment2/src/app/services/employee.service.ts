import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
  department: string;
  designation: string;
  date_of_joining: string;
  employee_photo?: string;
}

export interface EmployeeInput {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  salary: number;
  department: string;
  designation: string;
  date_of_joining: string;
  employee_photo?: string;
}

export interface EmployeeUpdateInput {
  first_name?: string;
  last_name?: string;
  email?: string;
  gender?: string;
  salary?: number;
  department?: string;
  designation?: string;
  date_of_joining?: string;
  employee_photo?: string;
}

export interface UploadResponse {
  url: string;
  filename: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = 'http://localhost:8081'; // Base URL for the backend API

  constructor(
    private apollo: Apollo,
    private http: HttpClient
  ) {}

  /**
   * Upload an image file to the server
   * @param file The image file to upload
   * @returns Observable with the upload response containing the URL
   */
  uploadImage(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('image', file);
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  getEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: gql`
        query GetAllEmployees {
          getAllEmployees {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `
    }).pipe(
      map(result => result.data.getAllEmployees)
    );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeById: Employee }>({
      query: gql`
        query SearchEmployeeById($id: ID!) {
          searchEmployeeById(id: $id) {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { id }
    }).pipe(
      map(result => result.data.searchEmployeeById)
    );
  }

  searchEmployees(department?: string, designation?: string): Observable<Employee[]> {
    console.log('Employee service searchEmployees called with:', { department, designation });
    
    return this.apollo.query<{ searchEmployeeByDesignationOrDepartment: Employee[] }>({
      query: gql`
        query SearchEmployeeByDesignationOrDepartment($designation: String, $department: String) {
          searchEmployeeByDesignationOrDepartment(designation: $designation, department: $department) {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { department, designation },
      fetchPolicy: 'network-only' // Force a network request instead of using cache
    }).pipe(
      map(result => {
        console.log('Search query result:', result);
        return result.data.searchEmployeeByDesignationOrDepartment;
      })
    );
  }

  createEmployee(employee: EmployeeInput): Observable<Employee> {
    return this.apollo.mutate<{ addEmployee: Employee }>({
      mutation: gql`
        mutation AddEmployee(
          $first_name: String!, 
          $last_name: String!, 
          $email: String, 
          $gender: String, 
          $designation: String!, 
          $salary: Float!, 
          $date_of_joining: String!, 
          $department: String!, 
          $employee_photo: String
        ) {
          addEmployee(
            first_name: $first_name, 
            last_name: $last_name, 
            email: $email, 
            gender: $gender, 
            designation: $designation, 
            salary: $salary, 
            date_of_joining: $date_of_joining, 
            department: $department, 
            employee_photo: $employee_photo
          ) {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { 
        ...employee
      },
      refetchQueries: [
        { 
          query: gql`
            query GetAllEmployees {
              getAllEmployees {
                id
                first_name
                last_name
                email
                gender
                salary
                department
                designation
                date_of_joining
                employee_photo
              }
            }
          `
        }
      ]
    }).pipe(
      map(result => result.data?.addEmployee as Employee)
    );
  }

  updateEmployee(id: string, updates: EmployeeUpdateInput): Observable<Employee> {
    return this.apollo.mutate<{ updateEmployee: Employee }>({
      mutation: gql`
        mutation UpdateEmployee(
          $id: ID!, 
          $first_name: String, 
          $last_name: String, 
          $email: String, 
          $gender: String, 
          $designation: String, 
          $salary: Float, 
          $date_of_joining: String, 
          $department: String, 
          $employee_photo: String
        ) {
          updateEmployee(
            id: $id, 
            first_name: $first_name, 
            last_name: $last_name, 
            email: $email, 
            gender: $gender, 
            designation: $designation, 
            salary: $salary, 
            date_of_joining: $date_of_joining, 
            department: $department, 
            employee_photo: $employee_photo
          ) {
            id
            first_name
            last_name
            email
            gender
            salary
            department
            designation
            date_of_joining
            employee_photo
          }
        }
      `,
      variables: { 
        id,
        ...updates
      },
      refetchQueries: [
        { 
          query: gql`
            query GetAllEmployees {
              getAllEmployees {
                id
                first_name
                last_name
                email
                gender
                salary
                department
                designation
                date_of_joining
                employee_photo
              }
            }
          `
        }
      ]
    }).pipe(
      map(result => result.data?.updateEmployee as Employee)
    );
  }

  deleteEmployee(id: string): Observable<Employee> {
    console.log(`Deleting employee with ID: ${id}`);
    
    return this.apollo.mutate<{ deleteEmployee: Employee }>({
      mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id) {
            id
            first_name
            last_name
          }
        }
      `,
      variables: { id },
      refetchQueries: [
        { 
          query: gql`
            query GetAllEmployees {
              getAllEmployees {
                id
                first_name
                last_name
                email
                gender
                salary
                department
                designation
                date_of_joining
                employee_photo
              }
            }
          `
        }
      ],
      fetchPolicy: 'no-cache' // Ensure we don't use cached data
    }).pipe(
      map(result => {
        console.log('Delete mutation result:', result);
        return result.data?.deleteEmployee as Employee;
      })
    );
  }
}
