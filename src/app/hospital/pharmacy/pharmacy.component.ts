import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Patient } from 'src/app/dashboard/patient';
import { Record } from 'src/app/dashboard/record/record';
import { HospitalService } from '../hospital.service';
import { Payment } from '../management/drugs-manage/payment';
import { Settings } from '../management/settings/settings';
import { SettingsService } from '../management/settings/settings.service';
import { Staff } from '../staff';
import { Pharmacy } from './pharmacy';
import { PharmacyService } from './pharmacy.service';

@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent implements OnInit {
  records: Record[];
  record = new Record();
  staffID: string;
  modal = false;
  date: any;
  prescriptions = [];
  price: number;
  total = 0;
  extra: number;
  printModal = false;
  staff = new Staff();
  attendee = new Payment();
  hospitalID: number;
  hospital = new Settings();
  image: any;
  payment = new Payment();
  reference: string;
  success = false;
  failed = false;
  patient = new Patient();
  payFirst = false;

  constructor(private route: ActivatedRoute, private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService, private pharmacyService: PharmacyService) { }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  getStaff() {
    this.hospitalService.getStaff(this.staffID, this.hospitalID).subscribe(data => {
      this.staff = data;
    })
  }

  ngOnInit(): void {
    localStorage.setItem("title","Dispense & Pay")   
    if (String(localStorage.getItem("title")) != "Dispense & Pay") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    let role = localStorage.getItem("role");
    if (this.hospitalID && this.staffID && role == "pharmacist") {
      this.total = 0;
      this.dismissAlert();
      this.closeModal();
      this.getRecords();
      this.todayDate();
      this.getStaff();
      this.getImage();
      this.getHospital();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  dismissAlert() {
    this.success = false;
    this.failed = false;
    this.payFirst = false;
  }

  closeModal() {
    this.modal = false;
    this.total = 0;
    this.printModal = false;
    this.payForm.reset();
  }

  getRecords() {
    this.pharmacyService.patientRecords(this.staffID, this.hospitalID).subscribe(data => {
      this.records = data;
    })
  }

  dispense(id: number) {
    this.dismissAlert();
    this.total = 0;
    this.pharmacyService.getRecordById(id, this.staffID).subscribe(data => {
      this.record = data;
      this.pharmacyService.getDrugCost(this.hospitalID, this.staffID, this.record.prescriptions).subscribe(data => {
        this.prescriptions = data;
        for (let i = 0; i < this.prescriptions.length; i++) {
          if (i % 2 != 0) {
            this.total = this.total + this.prescriptions[i];
          }
        }
        this.modal = true;
      })
      this.hospitalService.getPatientDetailsById(this.record.patientID, this.hospitalID).subscribe(data => {
        this.patient = data;
      })
    })
  }

  print(id: number) {
    this.dismissAlert();
    this.pharmacyService.getRecordById(id, this.staffID).subscribe(data => {
      this.record = data;
      this.pharmacyService.getDrugCost(this.hospitalID, this.staffID, this.record.prescriptions).subscribe(data => {
        this.prescriptions = data;
        for (let i = 0; i < this.prescriptions.length; i++) {
          if (i % 2 != 0) {
            this.total = this.total + this.prescriptions[i];
          }
        }
        this.pharmacyService.getPaymentByRecordID(this.staffID, id).subscribe(data => {
          this.attendee = data;
        })
        this.extra = this.record.costOfTreatment - this.total;
        this.printModal = true;
      })
    })
  }

  getHospital() {
    this.settingsService.getSettings(this.hospitalID).subscribe(data => {
      this.hospital = data;
    })
  }

  getImage() {
    this.settingsService.getImage(this.hospitalID).subscribe(data => {
      this.image = data;
      this.image = 'data:image/jpeg;base64,' + this.image.logo;
    }, error => {
      this.image == null;
    })
  }

  payForm = new FormGroup({
    cost: new FormControl('', Validators.required),
    paymentType: new FormControl('', Validators.required)
  })

  get cost() {
    return this.payForm.get('cost');
  }

  get paymentType() {
    if (this.payForm.get('paymentType')?.value == 'card') {
      this.payFirst = true;
    } else {
      this.payFirst = false;
    }
    return this.payForm.get('paymentType');
  }

  pay(id: number) {
    this.reference = `${Math.ceil(Math.random() * 10e10)}`;
    this.payment.hospitalID = this.hospitalID;
    this.payment.patientID = this.record.patientID;
    this.payment.patientName = this.record.patientName;
    this.payment.recordID = id;
    this.payment.pharmacistID = this.staffID;
    this.payment.paymentType = this.paymentType?.value;
    this.payment.staffName = this.staff.name;
    this.payment.referenceID = this.reference;
    this.payment.status = 1;

    this.pharmacyService.newPay(this.hospitalID, this.staffID, this.payment).subscribe(data => {
      this.record.costOfTreatment = this.total + Number(this.cost?.value);
      this.record.paid = 1;
      this.pharmacyService.updateRecords(id, this.staffID, this.record).subscribe(data => {
        this.failed = false;
        this.success = true;
        this.getRecords();
      }, error => {
        this.success = false;
        this.failed = true;
      })
      this.modal = false;
    })
  }

}
