import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings/settings.service';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HospitalService } from '../../hospital.service';
import { Staff } from '../../staff';

@Component({
  selector: 'app-appointment-manage',
  templateUrl: './appointment-manage.component.html',
  styleUrls: ['./appointment-manage.component.css']
})
export class AppointmentManageComponent implements OnInit {
  appointments: Appointment[];
  appointment = new Appointment();
  isupdated = false;
  modal = false;
  updateFailure = false;
  doctors: Staff[];
  hospitalID: number;
  cancelled: boolean;
  arrive: boolean;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  openModal(id: number) {
    this.isupdated = false;
    this.updateFailure = false;
    this.settingsService.getAppointment(id).subscribe(data => {
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
      this.modal = true;
    });
  }

  closeModal() {
    this.modal = false;
    this.isupdated = false;
    this.updateFailure = false;
  }

  getAppointment() {
    this.settingsService.allAppointments(this.hospitalID).subscribe(data => {
      this.appointments = data;
    });
  }

  dismissAlert() {
    this.isupdated = false;
    this.updateFailure = false;
  }

  findDoctor(specialist: string, date: Date) {
    this.hospitalService.getDoctor(this.hospitalID, specialist, date).subscribe(data => {
      this.doctors = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title", "Appointments Management")  
    if (String(localStorage.getItem("title")) != "Appointments Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.dismissAlert();
      this.modal = false;
      this.getAppointment();
    }
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
    this.settingsService.updateAppointment(this.hospitalID, id, this.appointment).subscribe(data => {
      this.isupdated = true;
      this.modal = false;
      this.updateFailure = false;
      this.getAppointment();
    }, error => {
      this.modal = false;
      this.updateFailure = true;
    });
  }
}