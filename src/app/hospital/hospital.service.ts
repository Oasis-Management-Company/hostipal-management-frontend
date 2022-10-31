import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  private baseUrl = 'http://localhost:8080/api/hospital';

  constructor(private http: HttpClient) { }

  staffLogin(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data)
  }

  getStaff(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/${hospitalID}`)
  }

  forgotPassword(data:Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgotPassword`,data);
  }

  matchPassword(hospitalID: number, staffID: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/matchPassword/${hospitalID}/${staffID}`, data)
  }

  updatePassword(hospitalID: number, staffID: string, data: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/changePass/${hospitalID}/${staffID}`, data);
  }

  getDoctor(id: number, specialisation: string, date: Date): Observable<any> {
    return this.http.get(`${this.baseUrl}/specialisation/${id}/${specialisation}/${date}`)
  }

  getPatientDetailsById(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${hospitalID}/${id}`)
  }

  getPatientDetails(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/patient/search`, data)
  }

  updatePatient(staffID: string, id: string, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/patient/${staffID}/${id}`, data)
  }

  allAppointments(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/list/${id}/${hospitalID}`)
  }

  todayAppointment(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/list/today/${id}/${hospitalID}`)
  }

  getAppointmentById(staffID: string, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/${staffID}/${id}`)
  }

  updateAppointment(hospitalID: number, staffID: string, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/appointment/${hospitalID}/${staffID}/${id}`, data)
  }

  postAppointment(staffID: string, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/post/${staffID}/${id}`)
  }

  updatePost(staffID: string, hospitalID: number, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/appointment/post/${hospitalID}/${staffID}/${id}`, data)
  }

  allVisits(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visits/${hospitalID}/${id}`)
  }

  getVisitById(hospitalID: number, staffID: string, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visit/${hospitalID}/${staffID}/${id}`)
  }

  updateVisit(staffID: string, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/visit/${staffID}/${id}`, data)
  }

  createVisit(data: Object, id: string, hospitalID: number): Observable<Object> {
    return this.http.post(`${this.baseUrl}/visit/${id}/${hospitalID}`, data);
  }

  getWaiting(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visit/waiting/${id}/${hospitalID}`)
  }

  getTests(staffID: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lab/${staffID}/${hospitalID}`)
  }

  getTestByID(staffID: string, hospitalID: number, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lab/${staffID}/${hospitalID}/${id}`)
  }

  updateTest(staffID: string, hospitalID: number, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/lab/${staffID}/${hospitalID}/${id}`, data)
  }

  createTest(staffID: string, hospitalID: number, data: any): Observable<Object> {
    return this.http.post(`${this.baseUrl}/lab/${staffID}/${hospitalID}`, data)
  }

  statisticsMon(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/mon/${hospitalID}/${id}`)
  }

  statisticsTue(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/tue/${hospitalID}/${id}`)
  }

  statisticsWed(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/wed/${hospitalID}/${id}`)
  }

  statisticsThur(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/thur/${hospitalID}/${id}`)
  }

  statisticsFri(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/fri/${hospitalID}/${id}`)
  }

  statisticsSat(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/sat/${hospitalID}/${id}`)
  }

  statisticsSun(hospitalID: number, id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/statistics/sun/${hospitalID}/${id}`)
  }

}
