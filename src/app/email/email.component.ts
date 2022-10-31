import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../hospital/management/settings/settings.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})
export class EmailComponent implements OnInit {
  hospitalID = Number(this.route.snapshot.paramMap.get('hospitalID'));
  staffID = String(this.route.snapshot.paramMap.get('staffID'));
  patientID = String(this.route.snapshot.paramMap.get('id'));
  confirmed = false;
  failed = false;
  url: any;

  constructor(private settingsService: SettingsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem("title", "Email Confirmation")
    if (String(localStorage.getItem("title")) != "Email Confirmation") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    if (this.hospitalID != null) {
      this.url = null;
      if (this.staffID != "null") {
        this.settingsService.confirmStaff(this.staffID, this.hospitalID).subscribe(data => {
          this.confirmed = true;
          this.url = 'hospital/staff/login';
        }, error => {
          this.failed = true;
        })
      }
      if (this.patientID != "null") {
        this.settingsService.confirmPatient(this.patientID, this.hospitalID).subscribe(data => {
          this.confirmed = true;
          this.url = 'authentication';
        }, error => {
          this.failed = true;
        })
      } else if (this.hospitalID) {
        this.settingsService.confirmHospistal(this.hospitalID).subscribe(data => {
          this.confirmed = true;
          this.url = 'hospital';
        }, error => {
          this.failed = true;
        })
      }
    } else {
      this.failed = true;
    }
  }

}
