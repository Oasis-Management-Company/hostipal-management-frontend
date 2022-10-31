import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalService } from '../../hospital.service';
import { Visit } from '../../patient/visit';
import { Staff } from '../../staff';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-waiting-list',
  templateUrl: './waiting-list.component.html',
  styleUrls: ['./waiting-list.component.css']
})
export class WaitingListComponent implements OnInit {
  visits: Visit[];
  hospitalID: number;
  modal = false;
  visit = new Visit();
  doctors: Staff[];
  cancelled = false;
  isupdated = false;
  updateFailure = false;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  getVisits() {
    this.settingsService.allVisits(this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  openModal(id: number) {
    this.settingsService.visitByID(id, this.hospitalID).subscribe(data => {
      this.visit = data;
      if (this.visit.status == 5) {
        this.cancelled = true;
      } else {
        this.cancelled = false;
      }
      this.modal = true;
    })
  }

  closeModal() {
    this.modal = false;
  }

  findDoctor(specialist: string, date: Date) {
    this.hospitalService.getDoctor(this.hospitalID, specialist, date).subscribe(data => {
      this.doctors = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title", "Walk-Ins Management")
    if (String(localStorage.getItem("title")) != "Walk-Ins Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.dismissAlert();
      this.closeModal();
      this.getVisits();
    } else {
      this.router.navigate(['hospital']);
    }
  }

  dismissAlert() {
    this.updateFailure = false;
    this.isupdated = false;
  }

  updateForm = new FormGroup({
    doctorName: new FormControl(''),
    specialist: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    time: new FormControl('', Validators.required),
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

  get cancel() {
    let cancel = this.updateForm.get('cancel')
    if (cancel?.value == true) {
      return 5;
    } else {
      return 1;
    }
  }

  update(id: number) {
    this.visit.doctorName = this.doctorName?.value;
    this.visit.specialist = this.specialist?.value;
    this.visit.date = this.date?.value;
    this.visit.time = this.time?.value;
    if (this.cancel == 5) {
      this.visit.status = this.cancel;
    }

    this.updateVisit(id);
  }

  updateVisit(id: number) {
    this.settingsService.updateVisit(this.hospitalID, id, this.visit).subscribe(data => {
      this.isupdated = true;
      this.modal = false;
      this.updateFailure = false;
      this.getVisits();
    }, error => {
      this.modal = false;
      this.updateFailure = true;
    });
  }

}
