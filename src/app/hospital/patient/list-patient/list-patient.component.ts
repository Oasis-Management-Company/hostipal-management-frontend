import { Component, OnInit } from '@angular/core';
import { Visit } from '../visit';
import { HospitalService } from '../../hospital.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../management/settings/settings.service';

@Component({
  selector: 'app-list-patient',
  templateUrl: './list-patient.component.html',
  styleUrls: ['./list-patient.component.css']
})
export class ListPatientComponent implements OnInit {
  visits: Visit[];
  date: any;
  staffID: string;
  hospitalID: number;

  constructor(private route: ActivatedRoute, private router: Router, private hospitalService: HospitalService, private settingsService: SettingsService) { }

  getVisits() {
    this.hospitalService.allVisits(this.staffID, this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title","Waiting List")    
    if (String(localStorage.getItem("title")) != "Waiting List") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    if (this.hospitalID && this.staffID !="null") {
      this.todayDate();
      this.getVisits();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

}
