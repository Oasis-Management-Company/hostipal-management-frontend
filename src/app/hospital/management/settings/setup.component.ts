import { Component, OnInit } from '@angular/core';
import { Settings } from './settings';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from './settings.service';


@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {
  private settings = new Settings();
  submitFailed = false;
  isSubmitted = false;
  notEqual = false;
  emailExists = false;
  hospitalID: number;
  signupPage = false;
  loginPage = false;
  loginError = false;
  forgotPass = false;
  error = false;
  success = false;

  constructor(private router: Router, private route: ActivatedRoute, private settingsService: SettingsService) { }

  ngOnInit(): void {
    localStorage.setItem("title", "System Authentication")
    if (String(localStorage.getItem("title")) != "System Authentication") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.router.navigate(['hospital/management', this.hospitalID]);
    } else {
      this.signupPage = true;
      this.loginPage = false;
      this.forgotPass = false;
    }
  }

  dismissAlert() {
    this.submitFailed = false;
    this.emailExists = false;
    this.isSubmitted = false;
    this.loginError = false;
    this.error = false;
    this.success = false;
  }

  settingsForm = new FormGroup({
    name: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    code: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirm: new FormControl('', Validators.required),
  });

  get name() {
    return this.settingsForm.get("name");
  }
  get address() {
    return this.settingsForm.get("address");
  }
  get phone() {
    return this.settingsForm.get("phone");
  }
  get email() {
    return this.settingsForm.get("email");
  }
  get code() {
    return this.settingsForm.get("code");
  }
  get confirm() {
    return this.settingsForm.get("confirm");
  }

  onSubmit() {
    if (this.code?.value != this.confirm?.value) {
      this.notEqual = true;
    } else {
      this.notEqual = false;
      this.settings.name = this.name?.value;
      this.settings.email = this.email?.value;
      this.settings.phone = this.phone?.value;
      this.settings.address = this.address?.value;
      this.settings.password = this.code?.value;
    }

    this.settingsService.setup(this.settings)
      .subscribe(data => {
        if (data == null) {
          this.submitFailed = false;
          this.emailExists = true;
        } else {
          this.submitFailed = false;
          this.isSubmitted = true;
          console.log(data);
        }
      }, error => {
        this.submitFailed = true
      })
  }

  forgotPassword() {
    this.signupPage = false;
    this.loginPage = false;
    this.forgotPass = true;
  }

  remember() {
    this.forgotPass = false;
    this.signupPage = false;
    this.loginPage = true;
  }

  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  })

  get Femail() {
    return this.forgotForm.get('email')
  }

  forgot() {
    this.settings = new Settings();
    this.settings.email = this.Femail?.value;
    this.settingsService.forgotPassword(this.settings).subscribe(data => {
      if (data == false) {
        this.success = false;
        this.error = true;
      } else {
        this.error = false;
        this.success = true;
      }
    })
  }

  login() {
    this.forgotPass = false;
    this.signupPage = false;
    this.loginPage = true;
  }

  register() {
    this.forgotPass = false;
    this.loginPage = false;
    this.signupPage = true;
  }

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })

  get Email() {
    return this.loginForm.get('email');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  onLogin() {
    this.settings.email = this.Email?.value;;
    this.settings.password = this.Password?.value;

    this.settingsService.login(this.settings).subscribe(data => {
      if (data == null) {
        this.loginError = true;
      } else {
        this.loginError = false;
        this.settings = data;
        localStorage.clear();
        localStorage.setItem("hospitalID", String(this.settings.hospitalID));
        localStorage.setItem("superadmin", "true");
        this.router.navigate(['hospital/management', this.settings.hospitalID]);
      }
    }, error => {
      this.loginError = true;
    })
  }

}