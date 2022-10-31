import { Component, OnInit } from '@angular/core';
import { Appointment } from './appointment';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HospitalService } from 'src/app/hospital/hospital.service';
import { Staff } from 'src/app/hospital/staff';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[];
  appointment = new Appointment();
  id = String(this.route.snapshot.paramMap.get('id'));
  updateFailure = false;
  isupdated = false;
  modal = false;
  bookModal = false;
  submitted = false;
  submitFailed = false;
  doctors: Staff[];
  hospitalID: number;
  cancelled: boolean;
  notAvailable = false;

  constructor(private router: Router, private route: ActivatedRoute, private patientService: PatientService, private hospitalService: HospitalService) { }

  book() {
    this.modal = false;
    this.updateFailure = false;
    this.isupdated = false;
    this.submitFailed = false;
    this.submitted = false;
    this.bookModal = true;
  }

  openModal(id: number) {
    this.bookModal = false;
    this.updateFailure = false;
    this.isupdated = false;
    this.submitFailed = false;
    this.submitted = false;
    this.modal = true;
    this.patientService.getAppointmentById(id, this.hospitalID).subscribe(data => {
      this.appointment = data;
      if (this.appointment.status == 2) {
        this.cancelled = true;
      } else {
        this.cancelled = false;
      }
      this.findDoctor(this.appointment.specialist, this.appointment.date);
    });
  }

  closeModal() {
    this.modal = false;
    this.bookModal = false;
    this.isupdated = false;
    this.updateFailure = false;
    this.submitFailed = false;
    this.submitted = false;
    this.notAvailable = false;
  }

  getAppointment() {
    this.patientService.getAllAppointments(this.id, this.hospitalID).subscribe(data => {
      this.appointments = data;
    });
  }

  dismissAlert() {
    this.isupdated = false;
    this.updateFailure = false;
    this.submitFailed = false;
    this.submitted = false;
    this.notAvailable = false;
  }

  ngOnInit(): void {
    localStorage.setItem("title", "Appointment Management")
    if (String(localStorage.getItem("title")) != "Appointment Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    if (this.id == localStorage.getItem("patientID")) {
      this.hospitalID = Number(localStorage.getItem("hospitalID"));
      this.closeModal();
      this.dismissAlert();
      this.getAppointment();
    } else {
      this.router.navigate(['authentication']);
    }
  }

  bookForm = new FormGroup({
    BdoctorName: new FormControl(''),
    Bspecialist: new FormControl('', Validators.required),
    Bdate: new FormControl('', Validators.required),
    Btime: new FormControl('', Validators.required),
    Bcomplaint: new FormControl('', Validators.required)
  });

  get BdoctorName() {
    return this.bookForm.get("BdoctorName");
  }
  get Bspecialist() {
    return this.bookForm.get("Bspecialist");
  }
  get Bdate() {
    return this.bookForm.get("Bdate");
  }
  get Btime() {
    return this.bookForm.get("Btime");
  }
  get Bcomplaint() {
    return this.bookForm.get("Bcomplaint");
  }

  onSubmit() {
    this.appointment = new Appointment();
    this.appointment.patientID = this.id;
    this.appointment.doctorName = this.BdoctorName?.value;
    this.appointment.date = this.Bdate?.value;
    this.appointment.time = this.Btime?.value;
    this.appointment.specialist = this.Bspecialist?.value;
    this.appointment.complaint = this.Bcomplaint?.value;
    this.appointment.hospitalID = this.hospitalID;

    this.patientService.bookAppointment(this.appointment).subscribe(data => {
      if (data == null) {
        this.submitFailed = false;
        this.submitted = false;
        this.notAvailable = true;
      } else {
        this.submitted = true;
        this.bookForm.reset();
        this.getAppointment();
      }
    }, error => {
      this.submitFailed = true;
    })
  }

  updateForm = new FormGroup({
    doctorName: new FormControl(''),
    specialist: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    complaint: new FormControl('', Validators.required),
    cancel: new FormControl('')
  })

  get doctorName() {
    return this.updateForm.get('doctorName');
  }

  get specialist() {
    return this.updateForm.get('specialist');
  }

  get date() {
    return this.updateForm.get('date');
  }

  get time() {
    return this.updateForm.get('time');
  }

  get complaint() {
    return this.updateForm.get('complaint');
  }

  get cancel() {
    let cancel = this.updateForm.get('cancel')
    if (cancel?.value == true) {
      return 2;
    } else {
      return 1;
    }
  }

  update(id: number) {
    this.appointment.doctorName = this.doctorName?.value;
    this.appointment.specialist = this.specialist?.value;
    this.appointment.date = this.date?.value;
    this.appointment.time = this.time?.value;
    this.appointment.complaint = this.complaint?.value;
    this.appointment.status = this.cancel;

    this.updateAppointment(id);
  }

  updateAppointment(id: number) {
    this.patientService.updateAppointment(id, this.hospitalID, this.appointment).subscribe(data => {
      this.refresh();
    }, error => {
      this.modal = false;
      this.updateFailure = true;
    });
  }

  findDoctor(specialist: string, date: Date) {
    this.hospitalService.getDoctor(this.hospitalID, specialist, date).subscribe(data => {
      this.doctors = data;
    })
  }

  refresh() {
    this.isupdated = true;
    this.modal = false;
    this.updateFailure = false;
    this.getAppointment();
  }
}
