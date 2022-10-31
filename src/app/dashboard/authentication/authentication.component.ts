import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../patient.service';
import { Patient } from '../patient';
import { SettingsService } from 'src/app/hospital/management/settings/settings.service';
import { Settings } from 'src/app/hospital/management/settings/settings';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  private patient = new Patient();
  registered = false;
  registerFailed = false;
  notEqual = false;
  loginFailed = false;
  emailExists = false;
  hospitalID: number;
  patientID: number;
  hospitals: Settings[];
  forgotPass = false;
  error = false;
  success = false;

  constructor(private router: Router, private route: ActivatedRoute, private patientService: PatientService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    localStorage.setItem("title", "Patient Authentication")
    if (String(localStorage.getItem("title")) != "Patient Authentication") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    const id = localStorage.getItem("patientID");
    if (localStorage.getItem("hospitalID") && id != null) {
      this.router.navigate(['dashboard', id]);
    } else {
      this.forgotPass = false;
      this.dismissAlert();
      this.getHospitals();
    }
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
    this.patient = new Patient();
    this.patient.hospitalID = this.FhospitalID?.value;
    this.patient.email = this.Femail?.value;
    this.patientService.forgotPassword(this.patient).subscribe(data => {
      if (data == false) {
        this.success = false;
        this.error = true;
      } else {
        this.error = false;
        this.success = true;
      }
    })
  }

  getHospitals() {
    this.forgotPass = false;
    this.settingsService.allHospitals().subscribe(data => {
      this.hospitals = data;
    })
  }

  dismissAlert() {
    this.registerFailed = false;
    this.registered = false;
    this.notEqual = false;
    this.loginFailed = false;
    this.success = false;
    this.error = false;
    this.emailExists = false;
  }

  registerForm = new FormGroup({
    hospitalID: new FormControl('', Validators.required),
    fname: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', Validators.required),
    id_type: new FormControl('', Validators.required),
    id_no: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required)
  });

  get ID() {
    return this.registerForm.get('hospitalID');
  }

  get fname() {
    return this.registerForm.get('fname');
  }

  get lname() {
    return this.registerForm.get('lname');
  }

  get gender() {
    return this.registerForm.get('gender');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPass() {
    return this.registerForm.get('confirmPassword');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get dob() {
    return this.registerForm.get('dob');
  }

  get id_type() {
    return this.registerForm.get('id_type');
  }

  get id_no() {
    return this.registerForm.get('id_no');
  }

  checkEqual() {
    if (this.password?.value != this.confirmPass?.value) {
      return this.notEqual = true;
    } else {
      return this.notEqual = false;
    }
  }

  register() {
    this.checkEqual();
    if (this.notEqual == false) {
      this.patient.hospitalID = this.ID?.value;
      this.patient.fname = this.fname?.value;
      this.patient.lname = this.lname?.value;
      this.patient.gender = this.gender?.value;
      this.patient.email = this.email?.value;
      this.patient.address = this.address?.value;
      this.patient.password = this.password?.value;
      this.patient.phone = this.phone?.value;
      this.patient.dob = this.dob?.value;
      this.patient.id_type = this.id_type?.value;
      this.patient.id_no = this.id_no?.value;

      this.save();
    } else {
      this.registerFailed = true;
    }
  }

  save() {
    this.patientService.register(this.patient)
      .subscribe(data => {
        if (data == null) {
          this.registered = false;
          this.emailExists = true;
        } else {
          this.emailExists = false;
          this.registerFailed = false;
          this.registered = true;
          this.registerForm.reset();
        }
      }, error => {
        this.registered = false;
        this.registerFailed = true;
      })
  }

  loginForm = new FormGroup({
    hospitalID: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required)
  })

  get loginId() {
    return this.loginForm.get('hospitalID');
  }

  get loginEmail() {
    return this.loginForm.get('email');
  }

  get loginPassword() {
    return this.loginForm.get('password');
  }

  login() {
    this.patient.hospitalID = this.loginId?.value;
    this.patient.email = this.loginEmail?.value;
    this.patient.password = this.loginPassword?.value;

    this.patientService.login(this.patient).subscribe(data => {
      if (data == null) {
        this.loginFailed = true;
      } else {
        this.patient = data;
        localStorage.clear();
        localStorage.setItem('hospitalID', String(this.patient.hospitalID));
        localStorage.setItem('patientID', this.patient.id);
        this.router.navigate(['dashboard', this.patient.id]);
      }
    }, error => {
      this.loginFailed = true;
    })
  }
}