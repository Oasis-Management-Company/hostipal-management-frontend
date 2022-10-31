import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { Patient } from 'src/app/dashboard/patient';
import { PatientService } from 'src/app/dashboard/patient.service';
import { HospitalService } from '../../hospital.service';
import { SettingsService } from '../../management/settings/settings.service';
import { Staff } from '../../staff';
import { Visit } from '../visit';

@Component({
  selector: 'app-post-patient',
  templateUrl: './post-patient.component.html',
  styleUrls: ['./post-patient.component.css']
})
export class PostPatientComponent implements OnInit {
  date: any;
  staffID: string;
  visits: Visit[];
  visit = new Visit();
  appointments: Appointment[];
  appointment = new Appointment();
  patient = new Patient();
  doctors: Staff[];
  modal = false;
  aModal = false;
  posted = false;
  postError = false;
  error = false;
  hospitalID: number;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  viewModal(id: number) {
    this.doctors = [];
    this.patient = new Patient();
    this.posted = false;
    this.postError = false;
    this.hospitalService.getAppointmentById(this.staffID, id).subscribe(data => {
      this.appointment = data;
      this.findDoctor(this.appointment.specialist, this.appointment.date);
      this.error = false;
      this.aModal = true;
      this.getPatientDetails(this.appointment.patientID);
      if (this.patient.age > 20) {
        this.postForm.get('bloodPressure')?.addValidators(Validators.required);
      }
    }, error => { this.error = true; })
  }

  visitModal(id: number) {
    this.doctors = [];
    this.patient = new Patient();
    this.posted = false;
    this.postError = false;
    this.hospitalService.getVisitById(this.hospitalID, this.staffID, id).subscribe(data => {
      this.visit = data;
      this.findDoctor(this.visit.specialist, this.visit.date);
      this.error = false;
      this.aModal = false;
      this.getPatientDetails(this.visit.patientID);
      if (this.patient.age > 20) {
        this.postForm.get('bloodPressure')?.addValidators(Validators.required);
      }
    }, error => {
      this.error = true;
    })
  }

  getPatientDetails(id: string) {
    this.hospitalService.getPatientDetailsById(id, this.hospitalID).subscribe(data => {
      this.modal = true;
      this.patient = data;
    })
  }

  closeModal() {
    this.modal = false;
  }

  dismissAlert() {
    this.postError = false;
    this.posted = false;
    this.error = false;
  }

  ngOnInit(): void {
    localStorage.setItem("title","Post Patients")   
    if (String(localStorage.getItem("title")) != "Post Patients") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    let role = localStorage.getItem("role");
    if (this.hospitalID && this.staffID && role == "nurse") {
      this.closeModal();
      this.dismissAlert();
      this.todayDate();
      this.allAppointments();
      this.allVisits();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  allAppointments() {
    this.hospitalService.postAppointment(this.staffID, this.hospitalID).subscribe(data => {
      this.appointments = data;
    })
  }

  allVisits() {
    this.hospitalService.getWaiting(this.staffID, this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  findDoctor(specialist: string, date: Date) {
    this.hospitalService.getDoctor(this.hospitalID, specialist, date).subscribe(data => {
      this.doctors = data;
    })
  }

  postForm = new FormGroup({
    bloodPressure: new FormControl(''),
    weight: new FormControl('', Validators.required),
    doctorName: new FormControl('', Validators.required),
    specialist: new FormControl('', Validators.required)
  })

  get bloodPressure() {
    return this.postForm.get('bloodPressure');
  }

  get weight() {
    return this.postForm.get('weight');
  }

  get doctorName() {
    return this.postForm.get('doctorName');
  }

  get specialist() {
    return this.postForm.get('specialist');
  }

  post(id: number) {
    if (this.postForm.invalid) {
      console.log(this.specialist?.value)
      this.postError = true;
    } else {
      this.visit.status = 1;
      this.visit.doctorName = this.doctorName?.value;
      this.visit.specialist = this.specialist?.value;
      this.hospitalService.updateVisit(this.staffID, id, this.visit).subscribe(data => {
        this.patient.bloodPressure = this.bloodPressure?.value;
        this.patient.weight = this.weight?.value;
        this.hospitalService.updatePatient(this.staffID, this.visit.patientID, this.patient).subscribe(data => {
          this.modal = false;
          this.posted = true;
          this.allAppointments();
          this.allVisits();
        }, error => {
          this.postError = true;
        })
      }, error => {
        this.postError = true;
      })
    }
  }

  send(id: number) {
    if (this.postForm.invalid) {
      this.postError = true;
    } else {
      this.appointment.status = 3;
      this.appointment.doctorName = this.doctorName?.value;
      this.appointment.specialist = this.specialist?.value;
      this.hospitalService.updatePost(this.staffID, this.hospitalID, id, this.appointment).subscribe(data => {
        this.patient.bloodPressure = this.bloodPressure?.value;
        this.patient.weight = this.weight?.value;
        this.hospitalService.updatePatient(this.staffID, this.appointment.patientID, this.patient).subscribe(data => {
          this.modal = false;
          this.posted = true;
          this.allAppointments();
          this.allVisits();
        }, error => {
          this.postError = true;
        })
      }, error => {
        this.postError = true;
      })
    }

  }

}
