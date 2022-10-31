import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  private baseUrl = 'http://localhost:8080/api/hospital/logs';

  constructor(private http: HttpClient) { }

  logs(id: number, type: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/type/${id}/${type}`)
  }

  allLogs(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/all/${id}`)
  }

  dispenseLog(id: number, type: string, drugName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/type/${id}/${type}/${drugName}`)
  }
}
