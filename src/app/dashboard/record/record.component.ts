import { Component, OnInit } from '@angular/core';
import { Record } from './record';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HospitalService } from 'src/app/hospital/hospital.service';
import { SettingsService } from 'src/app/hospital/management/settings/settings.service';
import { PharmacyService } from 'src/app/hospital/pharmacy/pharmacy.service';
import { Lab } from 'src/app/hospital/med-lab/lab';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  records: Record[];
  record = new Record();
  id = String(this.route.snapshot.paramMap.get('id'));
  hospitalID: number;
  modal = false;
  prescriptions: string[];
  labModal = false;
  labs: Lab[];
  lab = new Lab();

  constructor(private router: Router, private route: ActivatedRoute, private patientService: PatientService, private settingsService: SettingsService) { }

  getRecord() {
    this.patientService.getAllRecords(this.id, this.hospitalID).subscribe(data => {
      this.records = data;
    })
  }

  getRecordById(id: number) {
    this.settingsService.getRecordById(id, this.hospitalID).subscribe(data => {
      this.record = data;
      this.prescriptions = this.record.prescriptions.split(",");
      this.modal = true;
    })
  }

  getLab() {
    this.patientService.getAllResults(this.id, this.hospitalID).subscribe(data => {
      this.labs = data;
      for (let i = 0; i < this.labs.length; i++) {
        this.lab = this.labs[i];
        if (this.lab.testResult != null) {
          this.lab.testResult = 'data:application/pdf;base64,' + this.lab.testResult;
        }
      }
      this.labModal = true;
    })
  }

  closeModal() {
    this.modal = false;
    this.labModal = false;
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

  ngOnInit(): void {
    localStorage.setItem("title","Patient Records")   
    if (String(localStorage.getItem("title")) != "Patient Records") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    if (this.id == localStorage.getItem("patientID")) {
      this.hospitalID = Number(localStorage.getItem("hospitalID"));
      this.closeModal();
      this.getRecord();
    } else {
      this.router.navigate(['authentication']);
    }
  }


}
