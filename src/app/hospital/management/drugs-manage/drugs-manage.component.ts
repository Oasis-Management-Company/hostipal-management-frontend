import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DoctorService } from '../../doctor/doctor.service';
import { HospitalService } from '../../hospital.service';
import { Pharmacy } from '../../pharmacy/pharmacy';
import { Logs } from '../logs/logs';
import { LogsService } from '../logs/logs.service';
import { SettingsService } from '../settings/settings.service';

@Component({
  selector: 'app-drugs-manage',
  templateUrl: './drugs-manage.component.html',
  styleUrls: ['./drugs-manage.component.css']
})
export class DrugsManageComponent implements OnInit {
  drugs: Pharmacy[];
  drug = new Pharmacy();
  hospitalID: number;
  modal = false;
  createModal = false;
  registered = false;
  registerFailed = false;
  updated = false;
  updateFailed = false;
  staffID = String(localStorage.getItem("staffID"));
  notAuthorised = false;
  logs: Logs[];
  logModal = false;

  constructor(private router: Router, private settingsService: SettingsService, private logsService: LogsService, private hospitalService: HospitalService, private doctorService: DoctorService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Prescription Management")    
    if (String(localStorage.getItem("title")) != "Prescription Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("role") == "pharmacist" || localStorage.getItem("superadmin") == "true")) {
      this.dismissAlert();
      this.closeModal();
      this.closeLogs();
      this.getDrugs();
    } else {
      this.router.navigate(['hospital'])
    }
  }

  getDrugs() {
    this.settingsService.getPrescriptions(this.hospitalID).subscribe(data => {
      this.drugs = data;
    })
  }

  dispenseLog(name: string) {
    this.logsService.dispenseLog(this.hospitalID, "dispense", name).subscribe(data => {
      this.logs = data;
      for (let i = 0; i < this.logs.length; i++) {
        let log = new Logs();
        log = this.logs[i];
        let date: string[];
        date = log.date.split("T");
        log.date = date[0] +" "+ date[1].split(".")[0];
      }
      this.logModal = true;
    })
  }

  dismissAlert() {
    this.registered = false;
    this.registerFailed = false;
    this.updated = false;
    this.updateFailed = false;
    this.notAuthorised = false;
  }

  closeLogs() {
    this.logModal = false;
  }

  closeModal() {
    this.modal = false;
    this.createModal = false;
    this.createForm.reset();
  }

  add() {
    this.createModal = true;
  }

  createForm = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    uses: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required)
  })

  get name() {
    return this.createForm.get('name');
  }

  get Description() {
    return this.createForm.get('description');
  }

  get Uses() {
    return this.createForm.get('uses');
  }

  get Quantity() {
    return this.createForm.get('quantity');
  }

  get Cost() {
    return this.createForm.get('cost');
  }

  create() {
    if (localStorage.getItem("superadmin") || localStorage.getItem("role") == "pharmacist") {
      this.notAuthorised = false;
      this.drug = new Pharmacy();
      this.drug.drugName = this.name?.value;
      this.drug.description = this.Description?.value;
      this.drug.uses = this.Uses?.value;
      this.drug.cost = this.Cost?.value;
      this.drug.quantity = this.Quantity?.value;
      this.drug.hospitalID = this.hospitalID;

      this.settingsService.createPrescriptions(this.hospitalID, this.staffID, this.drug).subscribe(data => {
        this.registerFailed = false;
        this.registered = true;
        this.createForm.reset();
        this.getDrugs();
      }, error => {
        this.registered = false;
        this.registerFailed = true;
      })
    } else {
      this.closeModal();
      this.notAuthorised = true;
    }
  }

  editDrug(id: number) {
    this.getDrugByID(id);
    this.modal = true;
  }

  getDrugByID(id: number) {
    this.settingsService.getPrescriptionsById(this.hospitalID, id).subscribe(data => {
      this.drug = data;
    })
  }

  updateForm = new FormGroup({
    description: new FormControl('', Validators.required),
    uses: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    cost: new FormControl('', Validators.required)
  })

  get description() {
    return this.updateForm.get('description');
  }

  get uses() {
    return this.updateForm.get('uses');
  }

  get quantity() {
    return this.updateForm.get('quantity');
  }

  get cost() {
    return this.updateForm.get('cost');
  }

  update(id: number) {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      this.drug.description = this.description?.value;
      this.drug.uses = this.uses?.value;
      this.drug.quantity = this.quantity?.value;
      this.drug.cost = this.cost?.value;

      this.settingsService.updatePrescription(this.hospitalID, this.staffID, id, this.drug).subscribe(data => {
        this.updateFailed = false;
        this.updated = true;
        this.getDrugs();
      }, error => {
        this.updated = false;
        this.updateFailed = true;
      })
    } else {
      this.closeModal();
      this.notAuthorised = true;
    }
  }

}
