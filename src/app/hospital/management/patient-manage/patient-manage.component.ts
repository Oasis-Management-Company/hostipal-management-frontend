import { Component, OnInit } from '@angular/core';
import { Patient } from 'src/app/dashboard/patient';
import { SettingsService } from '../settings/settings.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Record } from 'src/app/dashboard/record/record';

@Component({
  selector: 'app-patient-manage',
  templateUrl: './patient-manage.component.html',
  styleUrls: ['./patient-manage.component.css']
})
export class PatientManageComponent implements OnInit {
  hospitalID: number;
  patients: Patient[];
  patient = new Patient();
  isupdated = false;
  viewModal = false;
  editModal = false;
  updateFailure = false;
  recordModal = false;
  records: Record[];
  interval: any;
  notAuthorised = false;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService) { }

  getPatient() {
    this.settingsService.allPatients(this.hospitalID).subscribe(data => {
      this.patients = data;
    });
  }

  ngOnInit(): void {
    localStorage.setItem("title","Patient Management")       
    if (String(localStorage.getItem("title")) != "Patient Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.closeModal();
      this.dismissAlert();
      this.closeRecords();
      this.getPatient();
    } else {
      this.router
    }
  }

  viewDetails(id: string) {
    this.editModal = false;
    this.isupdated = false;
    this.updateFailure = false;
    this.recordModal = false;
    this.notAuthorised = false;
    this.settingsService.getPatient(id, this.hospitalID).subscribe(data => {
      this.patient = data;
      this.viewModal = true;
    })
  }

  editDetails(id: string) {
    this.viewModal = false;
    this.isupdated = false;
    this.updateFailure = false;
    this.recordModal = false;
    this.notAuthorised = false;
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      this.settingsService.getPatient(id, this.hospitalID).subscribe(data => {
        this.patient = data;
        if (this.patient.deactivate == true) {
          this.patient.deactivate = true;
        }
        this.editModal = true;
        this.getPatient();
      })
    } else {
      this.notAuthorised = true;
    }
  }

  closeRecords() {
    this.recordModal = false;
  }

  closeModal() {
    this.editModal = false;
    this.viewModal = false;
    this.isupdated = false;
    this.updateFailure = false;
  }

  dismissAlert() {
    this.isupdated = false;
    this.updateFailure = false;
    this.notAuthorised = false;
  }


  getRecords(id: string) {
    this.settingsService.getPatientRecordById(id, this.hospitalID).subscribe(data => {
      this.records = data;
      this.recordModal = true;
    })
  }

  updateForm = new FormGroup({
    fname: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    id_type: new FormControl('', Validators.required),
    id_no: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    disable: new FormControl('')
  })

  get fname() {
    return this.updateForm.get('fname');
  }

  get lname() {
    return this.updateForm.get('lname');
  }

  get gender() {
    return this.updateForm.get('gender');
  }

  get email() {
    return this.updateForm.get('email');
  }

  get phone() {
    return this.updateForm.get('phone');
  }

  get address() {
    return this.updateForm.get('address');
  }

  get dob() {
    return this.updateForm.get('date');
  }

  get id_type() {
    return this.updateForm.get('id_type');
  }

  get id_no() {
    return this.updateForm.get('id_no');
  }

  get disable() {
    return this.updateForm.get('disable');
  }

  update(id: string) {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      this.patient.fname = this.fname?.value;
      this.patient.lname = this.lname?.value;
      this.patient.gender = this.gender?.value;
      this.patient.email = this.email?.value;
      this.patient.address = this.address?.value;
      this.patient.phone = this.phone?.value;
      this.patient.dob = this.dob?.value;
      this.patient.id_type = this.id_type?.value;
      this.patient.id_no = this.id_no?.value;
      this.patient.deactivate = this.disable?.value;

      this.save(id);
    } else {
      this.closeModal();
      this.notAuthorised = true;
    }
  }

  save(id: string) {
    this.settingsService.updatePatient(id, this.hospitalID, this.patient)
      .subscribe(data => {
        this.isupdated = true;
        this.viewModal = false;
        this.editModal = false;
        this.updateFailure = false;
        this.getPatient();
      }, error => this.error)
  }

  error() {
    this.isupdated = false;
    this.updateFailure = true;
    this.viewModal = false;
    this.editModal = false;
  }

}
