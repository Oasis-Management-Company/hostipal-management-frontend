import { Component, OnInit } from '@angular/core';
import { Record } from 'src/app/dashboard/record/record';
import { DoctorService } from '../doctor.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../management/settings/settings.service';

@Component({
  selector: 'app-patient-record',
  templateUrl: './patient-record.component.html',
  styleUrls: ['./patient-record.component.css']
})
export class PatientRecordComponent implements OnInit {
  records: Record[];
  id: string;
  date: any;
  hospitalID: number;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private doctorService: DoctorService) { }

  getRecords() {
    this.doctorService.patientRecords(this.id, this.hospitalID).subscribe(data => {
      this.records = data;
    })
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title","Patient Records")   
    if (String(localStorage.getItem("title")) != "Patient Records") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.id = String(localStorage.getItem("staffID"));
    let role = localStorage.getItem("role");
    if (this.hospitalID && this.id && role == "doctor") {
      this.todayDate();
      this.getRecords();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

}
