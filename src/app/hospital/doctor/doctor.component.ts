import { Component, OnChanges, OnInit } from '@angular/core';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { DoctorService } from './doctor.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Visit } from '../patient/visit';
import { Staff } from '../staff';
import { Pharmacy } from '../pharmacy/pharmacy';
import { HospitalService } from '../hospital.service';
import { Record } from 'src/app/dashboard/record/record';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from '../management/settings/settings.service';
import { Lab } from '../med-lab/lab';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.css']
})
export class DoctorComponent implements OnInit {
  private record = new Record();
  staffID: string;
  doctor = new Staff();
  prescriptions: Pharmacy[];
  appointments: Appointment[];
  appointment = new Appointment();
  visits: Visit[];
  visit = new Visit();
  records: Record[];
  modal = false;
  recordModal = false;
  mustSelect = false;
  isadded = false;
  selected: string[] = [];
  selectedDrugs: string;
  count: number = 0;
  visitRecordModal = false;
  visitModal = false;
  visitAdded = false;
  date: any;
  hospitalID: number;
  image: any;
  lab = new Lab();

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private doctorService: DoctorService, private hospitalService: HospitalService) { }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title", "Assigned Patients")
    if (String(localStorage.getItem("title")) != "Assigned Patients") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    let role = localStorage.getItem("role");
    if (this.hospitalID && this.staffID && role == "doctor") {
      this.dismissAlert();
      this.closeModal();
      this.closeRecords();
      this.selected = [];
      this.selectedDrugs == null;
      this.todayDate();
      this.getDoctor();
      this.getAppointments();
      this.getVisits();
      this.getPrescriptions();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  getDoctor() {
    this.doctorService.getDoctor(this.staffID, this.hospitalID).subscribe(data => {
      this.doctor = data;
      this.getImage(this.doctor.staffID);
    })
  }

  getAppointments() {
    this.doctorService.allAppointments(this.staffID, this.hospitalID).subscribe(data => {
      this.appointments = data;
    })
  }

  getVisits() {
    this.doctorService.allVisits(this.staffID, this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  getPrescriptions() {
    this.doctorService.getPrescriptions(this.staffID, this.hospitalID).subscribe(data => {
      this.prescriptions = data;
    })
  }

  getImage(id: string) {
    this.settingsService.getStaffPic(id, this.hospitalID).subscribe(data => {
      if (data == null) {
        this.image = null;
      } else {
        this.image = data;
        this.image = 'data:image/jpeg;base64,' + this.image.logo;
      }
    }, error => {
      this.image = null;
    })
  }

  viewModal(id: number) {
    this.isadded = false;
    this.hospitalService.getAppointmentById(this.staffID, id).subscribe(data => {
      this.appointment = data;
      this.startAppointment(id);
    })
  }

  startAppointment(id: number) {
    this.doctorService.startAppointment(this.hospitalID, this.staffID, id, 4).subscribe(data => {
      this.modal = true;
    })
  }

  dismissAlert() {
    this.mustSelect = false;
    this.isadded = false;
    this.visitAdded = false;
  }

  closeModal() {
    this.modal = false;
    this.visitModal = false;
    this.selected = [];
    this.selectedDrugs == null;
    this.getAppointments();
    this.getVisits();
  }

  getRecords(id: string) {
    this.doctorService.getRecordById(this.staffID, this.hospitalID, id).subscribe(data => {
      this.records = data;
      this.recordModal = true;
    })
  }

  closeRecords() {
    this.recordModal = false;
    this.visitRecordModal = false;
  }

  onChange(name: string, event) {
    this.mustSelect = false;
    const checked = (<HTMLInputElement>event.target).checked;

    if (checked) {
      this.selected.push(name);
      this.selectedDrugs = this.selected.toString();
    } else {
      const index = this.selected.indexOf(name);
      this.selected.splice(index, 1);
    }
    const count = this.selected.length;
    this.count = count;
    this.selectedDrugs = this.selected.toString();
  }

  endForm = new FormGroup({
    patientID: new FormControl(''),
    patientName: new FormControl(''),
    observation: new FormControl('', Validators.required),
    diagnosis: new FormControl('', Validators.required),
    testRequest: new FormControl(''),
    testType: new FormControl('')
  })

  get patientID() {
    return this.endForm.get('patientID');
  }

  get patientName() {
    return this.endForm.get('patientName');
  }

  get observation() {
    return this.endForm.get('observation');
  }

  get diagnosis() {
    return this.endForm.get('diagnosis');
  }

  get request() {
    return this.endForm.get('testRequest');
  }

  get test() {
    if (this.request?.value == true) {
      this.endForm.get('testType')?.enable();
      this.endForm.get('testType')?.addValidators(Validators.required);
    } else {
      this.endForm.get('testType')?.reset();
      this.endForm.get('testType')?.disable();
    }
    return this.endForm.get('testType');
  }

  endAppointment(id: number) {
    const count = this.selected.length;

    if (count == 0) {
      this.mustSelect = true;
    }
    else {
      this.count = count;
      this.record.doctorID = this.staffID;
      this.record.hospitalID = this.hospitalID;
      this.record.patientID = this.patientID?.value;
      this.record.patientName = this.patientName?.value;
      this.record.observation = this.observation?.value;
      this.record.diagnosis = this.diagnosis?.value;
      this.record.prescriptions = this.selectedDrugs;
      this.record.specialist = this.doctor.specialisation;

      if (this.request?.value == true) {
        this.lab.hospitalID = this.hospitalID;
        this.lab.doctorName = this.doctor.name;
        this.lab.patientID = this.patientID?.value;
        this.lab.patientName = this.patientName?.value;
        this.lab.test = this.test?.value;
        this.hospitalService.createTest(this.staffID, this.hospitalID, this.lab).subscribe(data => {
          this.lab = new Lab();
        })
      }
      this.doctorService.endAppointment(this.hospitalID, this.staffID, id, this.record).subscribe(data => {
        this.record = new Record();
        this.visitAdded = false;
        this.isadded = true;
        this.refresh();
      })
    }
  }

  refresh() {
    this.getAppointments();
    this.getVisits();
    this.mustSelect = false;
    this.modal = false;
    this.recordModal = false;
    this.selected = [];
    this.selectedDrugs == null;
    this.visitRecordModal = false;
    this.visitModal = false;
    this.endForm.reset();
  }

  walkin(id: number) {
    this.visitAdded = false;
    this.doctorService.getVisitById(this.hospitalID, this.staffID, id).subscribe(data => {
      this.visit = data;
      this.startVisit(id);
    })
  }

  startVisit(id: number) {
    this.doctorService.startVisit(this.hospitalID, this.staffID, id, 2).subscribe(data => {
      this.visitModal = true;
    })
  }

  getVRecords(id: string) {
    this.doctorService.getRecordById(this.staffID, this.hospitalID, id).subscribe(data => {
      this.records = data;
      this.visitRecordModal = true;
    })
  }

  endVisit(id: number) {
    const count = this.selected.length;

    if (count == 0) {
      this.mustSelect = true;
    }
    else {
      this.count = count;
      this.record.doctorID = this.staffID;
      this.record.hospitalID = this.hospitalID;
      this.record.patientID = this.patientID?.value;
      this.record.patientName = this.patientName?.value;
      this.record.observation = this.observation?.value;
      this.record.diagnosis = this.diagnosis?.value;
      this.record.prescriptions = this.selectedDrugs;
      this.record.specialist = this.doctor.specialisation;

      if (this.request?.value == true) {
        this.lab.hospitalID = this.hospitalID;
        this.lab.doctorName = this.doctor.name;
        this.lab.patientID = this.patientID?.value;
        this.lab.patientName = this.patientName?.value;
        this.lab.test = this.test?.value;
        this.hospitalService.createTest(this.staffID, this.hospitalID, this.lab).subscribe(data => {
          this.lab = new Lab();
        })
      }

      this.doctorService.endVisit(this.hospitalID, this.staffID, id, this.record).subscribe(data => {
        this.record = new Record();
        this.isadded = false;
        this.visitAdded = true;
        this.refresh();
      })
    }
  }



}