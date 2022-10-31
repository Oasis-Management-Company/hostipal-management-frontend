import { Component, OnInit } from '@angular/core';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { HospitalService } from '../hospital.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PatientService } from 'src/app/dashboard/patient.service';
import { SettingsService } from '../management/settings/settings.service';
import { Staff } from '../staff';
@Component({
  selector: 'app-hospital-appointment',
  templateUrl: './hospital-appointment.component.html',
  styleUrls: ['./hospital-appointment.component.css']
})
export class HospitalAppointmentComponent implements OnInit {
  appointments: Appointment[];
  appointment = new Appointment();
  staffID: string;
  bookModal = false;
  isupdated = false;
  modal = false;
  updateFailure = false;
  submitted = false;
  submitFailed = false;
  today: any;
  doctors: Staff[];
  hospitalID: number;
  cancelled: boolean;
  notAvailable = false;
  arrive: boolean;

  constructor(private router: Router, private route: ActivatedRoute, private settingsService: SettingsService, private hospitalService: HospitalService, private patientService: PatientService) { }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.today = data;
    })
  }

  openModal(id: number) {
    this.modal = true;
    this.isupdated = false;
    this.updateFailure = false;
    this.hospitalService.getAppointmentById(this.staffID, id).subscribe(data => {
      this.appointment = data;
      if (this.appointment.status == 2) {
        this.cancelled = true;
      } else {
        this.cancelled = false;
      }
      if (this.appointment.status == 3) {
        this.arrive = true;
      } else {
        this.arrive = false;
      }
      this.findDoctor(this.appointment.specialist, this.appointment.date);
    });
  }

  book() {
    this.bookModal = true;
  }

  closeModal() {
    this.modal = false;
    this.bookModal = false;
    this.isupdated = false;
    this.updateFailure = false;
    this.submitted = false;
    this.submitFailed = false;
    this.notAvailable = false;
  }

  getAppointment() {
    this.hospitalService.allAppointments(this.hospitalID, this.staffID).subscribe(data => {
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
    localStorage.setItem("title","Appointments Management")
    if (String(localStorage.getItem("title")) != "Appointments Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    if (this.hospitalID && this.staffID != "null") {
      this.closeModal();
      this.dismissAlert();
      this.todayDate();
      this.getAppointment();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  bookForm = new FormGroup({
    patientID: new FormControl('', Validators.required),
    BdoctorName: new FormControl(''),
    Bspecialist: new FormControl('', Validators.required),
    Bdate: new FormControl('', Validators.required),
    Btime: new FormControl('', Validators.required),
    Bcomplaint: new FormControl('', Validators.required),
  });

  get patientID() {
    return this.bookForm.get("patientID");
  }
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
    this.appointment.hospitalID = this.hospitalID;
    this.appointment.patientID = this.patientID?.value;
    this.appointment.doctorName = this.BdoctorName?.value;
    this.appointment.date = this.Bdate?.value;
    this.appointment.time = this.Btime?.value;
    this.appointment.specialist = this.Bspecialist?.value;
    this.appointment.complaint = this.Bcomplaint?.value;

    this.patientService.bookAppointment(this.appointment).subscribe(data => {
      if (data == null) {
        this.submitFailed = false;
        this.submitted = false;
        this.notAvailable = true
      } else {
        this.notAvailable = false;
        this.submitted = true;
        this.updateFailure = false;
        this.isupdated = false;
        this.bookForm.reset();
        this.getAppointment();
      }
    }, error => {
      this.submitFailed = true
    })
  }

  findDoctor(specialist: string, date: Date) {
    this.hospitalService.getDoctor(this.hospitalID, specialist, date).subscribe(data => {
      this.doctors = data;
    })
  }

  updateForm = new FormGroup({
    doctorName: new FormControl(''),
    specialist: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
    complaint: new FormControl('', Validators.required),
    cancel: new FormControl(''),
    arrived: new FormControl('')
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

  get arrived() {
    let arrived = this.updateForm.get('arrived')
    if (arrived?.value == true) {
      return 3;
    } else {
      return 1;
    }
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
    if (this.arrived == 3) {
      this.appointment.status = this.arrived;
    } else if (this.cancel == 2) {
      this.appointment.status = this.cancel;
    } else {
      this.appointment.status = 1;
    }

    this.updateAppointment(id);
  }

  updateAppointment(id: number) {
    this.hospitalService.updateAppointment(this.hospitalID, this.staffID, id, this.appointment).subscribe(data => {
      this.isupdated = true;
      this.modal = false;
      this.updateFailure = false;
      this.getAppointment();
    }, error => this.error());
  }

  error() {
    this.modal = false;
    this.updateFailure = true;
  }
}
