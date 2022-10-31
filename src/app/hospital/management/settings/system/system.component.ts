import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Patient } from 'src/app/dashboard/patient';
import { Settings } from '../settings';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.css']
})
export class SystemComponent implements OnInit {
  settings = new Settings();
  hospitalID: number;
  isUpdated = false;
  updateFailed = false;
  notEqual = false;
  isPassword = false;
  selectedImage: File;
  invalid = false;
  notAuthorised = false;
  passwordMatch = false;
  isNotPassword = false;
  passChanged = false;
  changeFailed = false;

  constructor(private router: Router, private settingsService: SettingsService) { }

  ngOnInit(): void {
    localStorage.setItem("title","System Settings")        
    if (String(localStorage.getItem("title")) != "System Settings") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.dismissAlert();
      this.getDetails();
    }
  }

  getDetails() {
    this.settingsService.getSettings(this.hospitalID).subscribe(data => {
      this.settings = data;
    })
  }

  dismissAlert() {
    this.isUpdated = false;
    this.updateFailed = false;
    this.invalid = false;
    this.notAuthorised = false;
    this.passChanged = false;
    this.changeFailed = false;
  }

  changePass = new FormGroup({
    password: new FormControl('', Validators.required),
    password1: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', Validators.required),
  })

  get password() {
    return this.changePass.get('password');
  }

  get password1() {
    return this.changePass.get('password1');
  }

  get password2() {
    return this.changePass.get('password2');
  }

  checkPassword() {
    this.matchPassword();
    if (this.password1?.value != this.password2?.value) {
      this.notEqual = true;
    } else {
      this.notEqual = false;
    }
    if (this.passwordMatch == true) {
      this.isNotPassword = false;
    } else {
      this.isNotPassword = true;
    }
  }

  matchPassword() {
    this.settings.password = this.password?.value;
    this.settingsService.matchPassword(this.hospitalID, this.settings).subscribe(data => {
      this.passwordMatch = data;
    })
  }

  changePassword() {
    this.checkPassword();
    if (this.notEqual == true || this.isNotPassword == true) {
      this.passChanged = false;
      this.changeFailed = true;
    } else {
      this.changeFailed = false;
      this.settings.password = this.password1?.value;

      this.settingsService.updatePassword(this.hospitalID, this.settings).subscribe(data => {
        this.changeFailed = false;
        this.passChanged = true;
      }, error => {
        this.passChanged = false;
        this.changeFailed = true;
      })
    }
  }

  onFileChanged(event) {
    this.selectedImage = event.target.files[0];
  }

  onUpload() {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      const imageData = new FormData();
      imageData.append('logo', this.selectedImage, this.selectedImage.name);

      this.settingsService.uploadImage(this.hospitalID, imageData).subscribe(data => {
        if (data == null) {
          this.isUpdated = false;
          this.updateFailed = false;
          this.invalid = true;
        } else {
          let currentUrl = this.router.url;
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate([currentUrl]);
          });
        }
      }, error => {
        this.isUpdated = false;
        this.updateFailed = true;
      })
    } else {
      this.notAuthorised = true;
    }
  }

  updateForm = new FormGroup({
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })

  get phone() {
    return this.updateForm.get('phone');
  }

  get address() {
    return this.updateForm.get('address');
  }

  update() {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      this.settings.address = this.address?.value;
      this.settings.phone = this.phone?.value;

      this.settingsService.updateSettings(this.hospitalID, this.settings).subscribe(data => {
        this.updateFailed = false;
        this.isUpdated = true;
      }, error => {
        this.isUpdated = false;
        this.updateFailed = true;
      })
    }
  }

}
