import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HospitalService } from './hospital.service';
import { Settings } from './management/settings/settings';
import { SettingsService } from './management/settings/settings.service';
import { Staff } from './staff';

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
  hospitals: Settings[];
  staff = new Staff();
  loginError = false;
  hospitalid: number;
  staffid: string;
  forgotPass = false;
  error = false;
  success = false;

  constructor(private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  ngOnInit(): void {
    localStorage.setItem("title", "Staff Login")
    if (String(localStorage.getItem("title")) != "Staff Login") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalid = Number(localStorage.getItem("hospitalID"));
    this.staffid = String(localStorage.getItem("staffID"));
    if (this.hospitalid && this.staffid != "null") {
      this.router.navigate(['hospital/dashboard', this.staffid]);
    } else {
      this.dismissAlert();
      this.forgotPass = false;
      this.getHospitals();
    }
  }

  getHospitals() {
    this.settingsService.allHospitals().subscribe(data => {
      this.hospitals = data;
    })
  }

  dismissAlert() {
    this.loginError = false;
    this.error = false;
    this.success = false;
  }

  forgotPassword() {
    this.forgotPass = true;
  }

  remember() {
    this.forgotPass = false;
  }

  forgotForm = new FormGroup({
    hospitalID: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email])
  })

  get FhospitalID() {
    return this.forgotForm.get('hospitalID');
  }

  get Femail() {
    return this.forgotForm.get('email')
  }

  forgot() {
    this.staff = new Staff();
    this.staff.hospitalID = this.FhospitalID?.value;
    this.staff.email = this.Femail?.value;
    this.hospitalService.forgotPassword(this.staff).subscribe(data => {
      if (data == false) {
        this.success = false;
        this.error = true;
      } else {
        this.error = false;
        this.success = true;
      }
    })
  }

  loginForm = new FormGroup({
    hospitalID: new FormControl('', Validators.required),
    staffID: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  get hospitalID() {
    return this.loginForm.get('hospitalID');
  }

  get staffID() {
    return this.loginForm.get('staffID');
  }

  get password() {
    return this.loginForm.get('password')
  }

  login() {
    this.staff.hospitalID = this.hospitalID?.value;
    this.staff.staffID = this.staffID?.value;
    this.staff.password = this.password?.value;

    this.hospitalService.staffLogin(this.staff).subscribe(data => {
      if (data == null) {
        this.loginError = true;
      } else {
        this.loginError = false;
        this.staff = data;
        localStorage.clear();
        localStorage.setItem("hospitalID", String(this.staff.hospitalID));
        localStorage.setItem("staffID", this.staff.staffID);
        localStorage.setItem("role", this.staff.role);
        if (this.staff.admin == true) {
          localStorage.setItem("admin", "true");
        }
        this.router.navigate(['hospital/dashboard', this.staff.staffID]);
      }
    }, error => {
      this.loginError = true;
    })
  }

}
