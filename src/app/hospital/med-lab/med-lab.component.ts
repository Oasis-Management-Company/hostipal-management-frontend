import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HospitalService } from '../hospital.service';
import { SettingsService } from '../management/settings/settings.service';
import { Lab } from './lab';

@Component({
  selector: 'app-med-lab',
  templateUrl: './med-lab.component.html',
  styleUrls: ['./med-lab.component.css']
})
export class MedLabComponent implements OnInit {
  hospitalID: number;
  staffID: string;
  labs: Lab[];
  lab = new Lab();
  date: any;
  selectedImage: File;
  isUpdated = false;
  updateFailed = false;
  modal = false;
  submitted = false;
  notSubmitted = false;
  createModal = false;
  invalid = false;

  constructor(private router: Router, private hospitalService: HospitalService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Medical Laboratory")   
    if (String(localStorage.getItem("title")) != "Medical Laboratory") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    let role = localStorage.getItem("role");
    if (this.hospitalID && this.staffID && role == "medLab") {
      this.getTests();
      this.dismissAlert();
      this.closeModal();
      this.todayDate();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  download(file: any, uploadName) {
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', file);
    link.setAttribute('download', uploadName);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  getTests() {
    this.hospitalService.getTests(this.staffID, this.hospitalID).subscribe(data => {
      this.labs = data;
      for (let i = 0; i < this.labs.length; i++) {
        this.lab = this.labs[i];
        if (this.lab.testResult != null) {
          this.lab.testResult = 'data:application/pdf;base64,' + this.lab.testResult;
        }
      }
    })
  }

  getTestByID(id: number) {
    this.dismissAlert();
    this.hospitalService.getTestByID(this.staffID, this.hospitalID, id).subscribe(data => {
      this.lab = data;
      this.modal = true;
    })
  }

  onFileChanged(event) {
    this.selectedImage = event.target.files[0];
  }

  onUpload(id) {
    const imageData = new FormData();
    imageData.append('logo', this.selectedImage, this.selectedImage.name);

    this.hospitalService.updateTest(this.staffID, this.hospitalID, id, imageData).subscribe(data => {
      if (data == null) {
        this.updateFailed = false;
        this.isUpdated = false;
        this.invalid = true;
      } else {
        this.updateFailed = false;
        this.invalid = false;
        this.isUpdated = true;
        this.getTests();
      }
    }, error => {
      this.isUpdated = false;
      this.invalid = false;
      this.updateFailed = true;
    })
  }

  createForm = new FormGroup({
    patientID: new FormControl('', Validators.required),
    doctorName: new FormControl('', Validators.required),
    test: new FormControl('', Validators.required)
  })

  get patientID() {
    return this.createForm.get('patientID');
  }

  get doctorName() {
    return this.createForm.get('doctorName');
  }

  get test() {
    return this.createForm.get('test');
  }

  openModal() {
    this.dismissAlert();
    this.createModal = true;
  }

  create() {
    this.lab = new Lab();
    this.lab.hospitalID = this.hospitalID;
    this.lab.staffID = this.staffID;
    this.lab.doctorName = this.doctorName?.value;
    this.lab.patientID = this.patientID?.value;

    this.hospitalService.createTest(this.staffID, this.hospitalID, this.lab).subscribe(data => {
      this.notSubmitted = false;
      this.submitted = true;
      this.createForm.reset();
      this.getTests();
    }, error => {
      this.submitted = false;
      this.notSubmitted = true;
    })
  }

  dismissAlert() {
    this.isUpdated = false;
    this.updateFailed = false;
    this.submitted = false;
    this.notSubmitted = false;
    this.invalid = false;
  }

  closeModal() {
    this.modal = false;
    this.createModal = false;
  }

}
