import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PharmacyService {

  private baseUrl = 'http://localhost:8080/api/hospital/pharmacy';

  constructor(private http: HttpClient) { }

  getPharmacist(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}/${hospitalID}`)
  }

  patientRecords(id: String, hospitalID: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/all/records/${id}/${hospitalID}`)
  }

  updateRecords(id: number, staffID: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/record/${staffID}/${id}`,data)
  }

  newPay(id: number, staffID: string, data: Object): Observable<any> {
    return this.http.post(`${this.baseUrl}/new/payment/${staffID}/${id}`, data)
  }

  getRecordById(id: number, staffID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/record/${staffID}/${id}`)
  }

  getDrugCost(id: number, staffID: string, drugs: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/drugs/${id}/${staffID}/${drugs}`)
  }

  getPaymentByRecordID(staffID:string,recordID:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/dispense/${staffID}/${recordID}`)
  }

}
