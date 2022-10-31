import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private baseUrl = 'http://localhost:8080/api/patient';

  constructor(private http: HttpClient) { }


  register(data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  forgotPassword(data:Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgotPassword`,data);
  }

  getPatient(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${hospitalID}/${id}`);
  }

  updatePatient(id: string, hospitalID: number, data: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${hospitalID}/${id}`, data);
  }

  updatePassword(id: String, hospitalID: number, data: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/changePass/${hospitalID}/${id}`, data);
  }

  bookAppointment(data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/appointment/book`, data);
  }

  getAllAppointments(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/list/${hospitalID}/${id}`);
  }

  getUpcomingAppointment(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/upcoming/${hospitalID}/${id}`);
  }

  getAppointmentById(id: number, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/${hospitalID}/${id}`);
  }

  updateAppointment(id: number, hospitalID: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/appointment/${hospitalID}/${id}`, data);
  }

  getAllRecords(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/record/${hospitalID}/${id}`)
  }

  getAllResults(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/lab/results/${hospitalID}/${id}`)
  }

  matchPassword(id: string, hospitalID: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/matchPassword/${hospitalID}/${id}`, data)
  }

  uploadImage(id: string, hospitalID: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/logo/${hospitalID}/${id}`, data)
  }

  getImage(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/logo/${hospitalID}/${id}`)
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
