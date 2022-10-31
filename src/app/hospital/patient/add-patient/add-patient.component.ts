import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { Patient } from 'src/app/dashboard/patient';
import { PatientService } from 'src/app/dashboard/patient.service';
import { HospitalService } from '../../hospital.service';
import { SettingsService } from '../../management/settings/settings.service';
import { Visit } from '../visit';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.component.html',
  styleUrls: ['./add-patient.component.css']
})
export class AddPatientComponent implements OnInit {
  private patient = new Patient();
  private visit = new Visit();
  appointments: Appointment[];
  visits: Visit[];
  details = new Patient();
  staffID: string;
  submitted = false;
  submitFailed = false;
  Vsubmitted = false;
  VsubmitFailed = false;
  emailExists = false;
  modal = false;
  notFound = false;
  date: any;
  hospitalID: number;

  constructor(private router: Router, private route: ActivatedRoute, private settingsService: SettingsService, private patientService: PatientService, private hospitalService: HospitalService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Patient - Create Account/Visit")    
    if (String(localStorage.getItem("title")) != "Patient - Create Account/Visit") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    if (this.hospitalID && this.staffID != "null") {
      this.dismissAlert();
      this.closeModal();
      this.todayDate();
      this.countAppointments();
      this.countVisits();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  visitForm = new FormGroup({
    id: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    specialist: new FormControl('', Validators.required)
  })

  get id() {
    return this.visitForm.get('id');
  }

  get time() {
    return this.visitForm.get('time');
  }

  get specialist() {
    return this.visitForm.get('specialist');
  }

  newVisit() {
    this.visit.patientID = this.id?.value;
    this.visit.hospitalID = this.hospitalID;
    this.visit.time = this.time?.value;
    this.visit.specialist = this.specialist?.value;

    this.hospitalService.createVisit(this.visit, this.staffID, this.hospitalID)
      .subscribe(data => {
        this.Vsubmitted = true;
        this.VsubmitFailed = false;
        this.visitForm.reset();
      }, error => {
        this.VsubmitFailed = true;
        this.Vsubmitted = false;
      })
  }

  createForm = new FormGroup({
    fname: new FormControl('', Validators.required),
    lname: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    id_type: new FormControl('', Validators.required),
    id_no: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    dob: new FormControl('', Validators.required)
  })

  get fname() {
    return this.createForm.get('fname');
  }

  get lname() {
    return this.createForm.get('lname');
  }

  get gender() {
    return this.createForm.get('gender');
  }

  get email() {
    return this.createForm.get('email');
  }

  get phone() {
    return this.createForm.get('phone');
  }

  get address() {
    return this.createForm.get('address');
  }

  get dob() {
    return this.createForm.get('dob');
  }

  get id_type() {
    return this.createForm.get('id_type');
  }

  get id_no() {
    return this.createForm.get('id_no');
  }

  create() {
    this.patient.hospitalID = this.hospitalID;
    this.patient.fname = this.fname?.value;
    this.patient.lname = this.lname?.value;
    this.patient.gender = this.gender?.value;
    this.patient.email = this.email?.value;
    this.patient.address = this.address?.value;
    this.patient.phone = this.phone?.value;
    this.patient.dob = this.dob?.value;
    this.patient.id_type = this.id_type?.value;
    this.patient.id_no = this.id_no?.value;

    this.save();
  }

  save() {
    this.patientService.register(this.patient)
      .subscribe(data => {
        if (data == null) {
          this.submitted = false;
          this.emailExists = true;
        } else {
          this.submitted = true;
          this.submitFailed = false;
          this.createForm.reset();
        }
      }, error => {
        this.submitFailed = true;
        this.submitted = false;
      })
  }

  dismissAlert() {
    this.submitted = false;
    this.submitFailed = false;
    this.VsubmitFailed = false;
    this.Vsubmitted = false;
    this.notFound = false;
  }

  countAppointments() {
    this.hospitalService.todayAppointment(this.staffID, this.hospitalID).subscribe(data => {
      this.appointments = data;
    });
  }

  countVisits() {
    this.hospitalService.allVisits(this.staffID, this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  searchForm = new FormGroup({
    sFname: new FormControl('', Validators.required),
    sLname: new FormControl('', Validators.required),
    sDob: new FormControl('', Validators.required)
  })

  get sFname() {
    return this.searchForm.get('sFname');
  }

  get sLname() {
    return this.searchForm.get('sLname');
  }

  get sDob() {
    return this.searchForm.get('sDob');
  }

  search() {
    this.details.fname = this.sFname?.value;
    this.details.lname = this.sLname?.value;
    this.details.dob = this.sDob?.value;
    this.details.hospitalID = this.hospitalID;
    this.hospitalService.getPatientDetails(this.details).subscribe(data => {
      this.details = data;
      if (this.details == null) {
        this.notFound = true
      } else {
        this.modal = true;
        this.notFound = false;
      }
    }, error => { this.notFound = true; })
  }

  closeModal() {
    this.modal = false;
  }

}
