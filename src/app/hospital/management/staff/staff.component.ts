import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HospitalService } from '../../hospital.service';
import { Staff } from '../../staff';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent implements OnInit {
  staffs: Staff[];
  hospitalID: number;
  day = "Monday";

  constructor(private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Staff Schedules")    
    if (String(localStorage.getItem("title")) != "Staff Schedules") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.getStaff();
    } else {
      this.router.navigate(['hospital']);
    }
  }

  getStaff() {
    this.settingsService.allStaffByDay(this.hospitalID, this.day).subscribe(data => {
      this.staffs = data;
    })
  }

  getStaffByDay(day: string) {
    this.settingsService.allStaffByDay(this.hospitalID, day).subscribe(data => {
      this.staffs = data;
      this.day = day;
    })
  }

}
