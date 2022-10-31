import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private baseUrl = 'http://localhost:8080/api/hospital/doctor';

  constructor(private http: HttpClient) { }

  getDoctor(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/${hospitalID}`)
  }

  patientRecords(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/records/${id}/${hospitalID}`)
  }

  getRecordById(staffID: String, hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/records/${staffID}/${hospitalID}/${id}`)
  }

  allAppointments(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments/${id}/${hospitalID}`)
  }

  startAppointment(hospitalID: number, staffID: String, id: number, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/appointment/start/${hospitalID}/${staffID}/${id}`, status)
  }

  endAppointment(hospitalID: number, staffID: String, id: number, data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointment/end/${hospitalID}/${staffID}/${id}`, data)
  }

  allVisits(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visits/${id}/${hospitalID}`)
  }

  getVisitById(hospitalID: number, staffID: String, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visit/${hospitalID}/${staffID}/${id}`)
  }

  startVisit(hospitalID: number, staffID: String, id: number, status: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/visit/start/${hospitalID}/${staffID}/${id}`, status)
  }

  endVisit(hospitalID: number, staffID: String, id: number, data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/visit/end/${hospitalID}/${staffID}/${id}`, data)
  }

  getPrescriptions(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/prescriptions/${id}/${hospitalID}`)
  }

}
