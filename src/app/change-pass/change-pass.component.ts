import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from '../dashboard/patient';
import { Settings } from '../hospital/management/settings/settings';
import { SettingsService } from '../hospital/management/settings/settings.service';
import { Staff } from '../hospital/staff';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.css']
})
export class ChangePassComponent implements OnInit {
  hospitalID = Number(this.route.snapshot.paramMap.get('hospitalID'));
  staffID = String(this.route.snapshot.paramMap.get('staffID'));
  patientID = String(this.route.snapshot.paramMap.get('id'));
  patient = new Patient();
  hospital = new Settings();
  staff = new Staff();
  passChanged = false;
  changeFailed = false;
  notEqual = false;
  url: any;

  constructor(private settingsService: SettingsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    localStorage.setItem("title", "Change Password")
    if (String(localStorage.getItem("title")) != "Change Password") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.dismissAlert();
  }

  dismissAlert() {
    this.passChanged = false;
    this.changeFailed = false;
  }

  changePass = new FormGroup({
    password1: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', Validators.required),
  })

  get password1() {
    return this.changePass.get('password1');
  }

  get password2() {
    return this.changePass.get('password2');
  }

  checkPassword() {
    if (this.password1?.value != this.password2?.value) {
      this.notEqual = true;
    } else {
      this.notEqual = false;
    }
  }

  changePassword() {
    this.checkPassword();
    if (this.notEqual == true) {
      this.passChanged = false;
      this.changeFailed = true;
    } else {
      this.changeFailed = false;
      if (this.hospitalID != null) {
        this.url = null;
        if (this.staffID != "null") {
          this.staff.password = this.password1?.value;

          this.settingsService.changeStaff(this.staffID, this.hospitalID, this.staff).subscribe(data => {
            this.changeFailed = false;
            this.passChanged = true;
          }, error => {
            this.passChanged = false;
            this.changeFailed = true;
          })
        }
        else if (this.patientID != "null") {
          this.patient.password = this.password1?.value;

          this.settingsService.changePatient(this.patientID, this.hospitalID, this.patient).subscribe(data => {
            this.changeFailed = false;
            this.passChanged = true;
          }, error => {
            this.passChanged = false;
            this.changeFailed = true;
          })
        }
        else if (this.hospitalID) {
          this.hospital.password = this.password1?.value;

          this.settingsService.changeHospistal(this.hospitalID, this.hospital).subscribe(data => {
            this.changeFailed = false;
            this.passChanged = true;
          }, error => {
            this.passChanged = false;
            this.changeFailed = true;
          })
        }
      }
    }
  }
}