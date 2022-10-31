import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl = 'http://localhost:8080/api/hospital/settings';

  constructor(private http: HttpClient) { }

  setup(data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/`, data);
  }

  login(data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data);
  }

  forgotPassword(data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgotPassword`, data);
  }

  changeStaff(id: string, hospitalID: number, data: Object): Observable<any> {
    return this.http.put(`${this.baseUrl}/changePass/staff/${hospitalID}/${id}`, data)
  }

  changeHospistal(hospitalID: number, data: Object): Observable<any> {
    return this.http.put(`${this.baseUrl}/changePass/hospital/${hospitalID}`, data)
  }

  changePatient(id: string, hospitalID: number, data: Object): Observable<any> {
    return this.http.put(`${this.baseUrl}/changePass/patient/${hospitalID}/${id}`, data)
  }

  getSettings(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`)
  }

  updateSettings(id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  matchPassword(hospitalID: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/matchPassword/${hospitalID}`, data)
  }

  updatePassword(hospitalID: number, data: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/changePass/${hospitalID}`, data);
  }

  allHospitals(): Observable<any> {
    return this.http.get(`${this.baseUrl}/hospital/list`)
  }

  staffRegister(id: number, data: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}/staff/register/${id}`, data);
  }

  updateStaff(id: string, hospitalID: number, data: Object): Observable<Object> {
    return this.http.put(`${this.baseUrl}/staff/update/${hospitalID}/${id}`, data);
  }

  updateStaffPic(id: string, hospitalID: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/staff/update/pic/${id}/${hospitalID}`, data)
  }

  getStaffPic(staffID: string, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/pic/${staffID}/${id}`)
  }

  getStaffLogs(staffID: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/logs/${staffID}/${hospitalID}`)
  }

  allAppointments(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointments/${id}`)
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/appointment/${id}`)
  }

  updateAppointment(hospitalID: number, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/appointment/${hospitalID}/${id}`, data);
  }

  todayAppointment(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/today/appointments/${id}`)
  }

  allPatients(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patients/${id}`)
  }

  getPatient(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/${hospitalID}/${id}`)
  }

  getPatientRecordById(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/patient/records/${hospitalID}/${id}`)
  }

  allVisits(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visits/${id}`)
  }

  visitByID(id: number, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/visit/${hospitalID}/${id}`)
  }

  updateVisit(hospitalID: number, id: number, data: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/visit/${hospitalID}/${id}`, data);
  }

  todayVisit(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/today/visits/${id}`)
  }

  updatePatient(id: string, hospitalID: number, data: Object): Observable<any> {
    return this.http.put(`${this.baseUrl}/patient/${hospitalID}/${id}`, data)
  }

  allMedicalStaff(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/medical/${id}`)
  }

  allDoctors(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/doctors/${id}`)
  }

  allStaff(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/${id}`)
  }

  allStaffByDay(id: number, day: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/schedule/${day}/${id}`)
  }

  availableStaff(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/today/staff/${id}`)
  }

  allNonMedStaff(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/staff/regular/${id}`)
  }

  todaysDate() {
    return this.http.get(`${this.baseUrl}/today/date`, { responseType: 'text' })
  }

  currentTime() {
    return this.http.get(`${this.baseUrl}/today/time`, { responseType: 'text' })
  }

  uploadImage(id: number, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/logo/${id}`, data)
  }

  getImage(id: number) {
    return this.http.get(`${this.baseUrl}/logo/${id}`)
  }

  createPrescriptions(hospitalID: number, staffID: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/prescriptions/create/${hospitalID}/${staffID}`, data)
  }

  getPrescriptions(hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/prescriptions/${hospitalID}`)
  }

  getPrescriptionsById(hospitalID: number, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/prescriptions/${hospitalID}/${id}`)
  }

  updatePrescription(hospitalID: number, staffID: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/prescriptions/${hospitalID}/${staffID}/${id}`, data)
  }

  getPayment(hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/payment/pending/${hospitalID}`)
  }

  getPaymentByRecordID(hospitalID: number, id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/payment/${hospitalID}/${id}`)
  }

  getRecordById(id: number, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/record/${hospitalID}/${id}`)
  }

  confirmStaff(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/confirm/staff/${hospitalID}/${id}`)
  }

  confirmHospistal(hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/confirm/hospital/${hospitalID}`)
  }

  confirmPatient(id: string, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/confirm/patient/${hospitalID}/${id}`)
  }

}