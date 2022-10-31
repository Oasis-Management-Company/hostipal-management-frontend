import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/dashboard/patient';
import { Record } from 'src/app/dashboard/record/record';
import { HospitalService } from 'src/app/hospital/hospital.service';
import { PharmacyService } from 'src/app/hospital/pharmacy/pharmacy.service';
import { Settings } from '../../settings/settings';
import { SettingsService } from '../../settings/settings.service';
import { Payment } from '../payment';

@Component({
  selector: 'app-payment-manage',
  templateUrl: './payment-manage.component.html',
  styleUrls: ['./payment-manage.component.css']
})
export class PaymentManageComponent implements OnInit {
  hospitalID: number;
  modal = false;
  payments: Payment[];
  payment = new Payment();
  record = new Record();
  patient = new Patient();

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService, private pharmacyService: PharmacyService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Payment Management")  
    if (String(localStorage.getItem("title")) != "Payment Management") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("role") == "pharmacist" || localStorage.getItem("superadmin") == "true")) {
      this.closeModal();
      this.getPayment();
    } else {
      this.router.navigate(['hospital']);
    }
  }

  closeModal() {
    this.modal = false;
  }

  getPayment() {
    this.settingsService.getPayment(this.hospitalID).subscribe(data => {
      this.payments = data;
    })
  }

  getRecord(id: number) {
    this.settingsService.getPaymentByRecordID(this.hospitalID, id).subscribe(data => {
      this.payment = data;
    })
    this.settingsService.getRecordById(id, this.hospitalID).subscribe(data => {
      this.record = data;
      this.settingsService.getPatient(this.record.patientID, this.hospitalID).subscribe(data => {
        this.patient = data;
        this.modal = true;
      })
    })
  }

}
