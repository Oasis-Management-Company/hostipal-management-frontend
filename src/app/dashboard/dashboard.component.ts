import { Component, OnInit } from '@angular/core';
import { Patient } from './patient';
import { Appointment } from './appointment/appointment';
import { PatientService } from './patient.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Record } from './record/record';

declare const Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  appointments: Appointment[];
  patient = new Patient();
  id = String(this.route.snapshot.paramMap.get('id'));
  modal = false;
  updateFailure = false;
  isupdated = false;
  notEqual = false;
  isNotPassword = false;
  selectedImage: File;
  image: any;
  interval: any;
  passwordMatch: boolean;
  hospitalID: number;
  invalid = false;
  passChanged = false;
  changeFailed = false;
  mon: Record[];
  tue: Record[];
  wed: Record[];
  thur: Record[];
  fri: Record[];
  sat: Record[];
  sun: Record[];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(private route: ActivatedRoute, private router: Router, private patientService: PatientService) { }

  openModal(id: string) {
    this.updateFailure = false;
    this.isupdated = false;
    this.invalid = false;
    this.patientService.getPatient(id, this.hospitalID).subscribe(data => {
      this.patient = data;
      this.modal = true;
    });
  }

  closeModal() {
    this.modal = false;
    this.isupdated = false;
    this.updateFailure = false;
  }

  dismissAlert() {
    this.isupdated = false;
    this.updateFailure = false;
    this.invalid = false;
    this.passChanged = false;
    this.changeFailed = false;
  }

  getStatistics() {
    this.patientService.statisticsMon(this.hospitalID, this.id).subscribe(data => {
      this.mon = data;
    })
    this.patientService.statisticsTue(this.hospitalID, this.id).subscribe(data => {
      this.tue = data;
    })
    this.patientService.statisticsWed(this.hospitalID, this.id).subscribe(data => {
      this.wed = data;
    })
    this.patientService.statisticsThur(this.hospitalID, this.id).subscribe(data => {
      this.thur = data;
    })
    this.patientService.statisticsFri(this.hospitalID, this.id).subscribe(data => {
      this.fri = data;
    })
    this.patientService.statisticsSat(this.hospitalID, this.id).subscribe(data => {
      this.sat = data;
    })
    this.patientService.statisticsSun(this.hospitalID, this.id).subscribe(data => {
      this.sun = data;
    })
  }

  changePass = new FormGroup({
    password: new FormControl('', Validators.required),
    password1: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', Validators.required),
  })

  updateForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required)
  })

  get email() {
    return this.updateForm.get('email');
  }

  get password() {
    return this.changePass.get('password');
  }

  get password1() {
    return this.changePass.get('password1');
  }

  get password2() {
    return this.changePass.get('password2');
  }

  get phone() {
    return this.updateForm.get('phone');
  }

  get address() {
    return this.updateForm.get('address');
  }

  checkPassword() {
    this.matchPassword(this.id);
    if (this.password1?.value != this.password2?.value) {
      this.notEqual = true;
    } else {
      this.notEqual = false;
    }
    if (this.passwordMatch == true) {
      this.isNotPassword = false;
    } else {
      this.isNotPassword = true;
    }
  }

  matchPassword(id: string) {
    this.patient.password = this.password?.value;
    this.patientService.matchPassword(id, this.hospitalID, this.patient).subscribe(data => {
      this.passwordMatch = data;
    })
  }

  changePassword() {
    this.checkPassword();
    if (this.notEqual == true || this.isNotPassword == true) {
      this.passChanged = false;
      this.changeFailed = true;
    } else {
      this.changeFailed = false;
      this.patient.password = this.password1?.value;

      this.patientService.updatePassword(this.id, this.hospitalID, this.patient).subscribe(data => {
        this.changeFailed = false;
        this.passChanged = true;
      }, error => {
        this.passChanged = false;
        this.changeFailed = true;
      })
    }
  }

  update() {
    this.patient.email = this.email?.value;
    this.patient.address = this.address?.value;
    this.patient.phone = this.phone?.value;

    this.updatePatient(this.id);

  }

  updatePatient(id: string) {
    this.patientService.updatePatient(id, this.hospitalID, this.patient).subscribe(data => {
      this.updateFailure = false;
      this.isupdated = true;
    }, error => {
      this.isupdated = false;
      this.updateFailure = true;
    })
  }

  getPatientDetails() {
    this.patientService.getPatient(this.id, this.hospitalID).subscribe(data => {
      this.patient = data;
    });
  }

  getUpcomingAppointments() {
    this.patientService.getUpcomingAppointment(this.id, this.hospitalID).subscribe(data => {
      this.appointments = data;
      this.loadChart(this.mon.length, this.tue.length, this.wed.length, this.thur.length, this.fri.length, this.sat.length, this.sun.length);
    });
  }

  loadChart(a: number, b: number, c: number, d: number, e: number, f: number, g: number) {
    var month = this.months[new Date().getMonth()];
    const data = {
      labels: ["Mon", "Tue", "Wed", "Thur", "Fri", "Sat", "Sun"],
      datasets: [{
        label: "Monthly Visit Chart - " + month,
        data: [a, b, c, d, e, f, g],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)'
        ],
        borderWidth: 1,
        minBarLength: 4,
      }]
    };
    new Chart("myChart", {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            min: 0,
            suggestedMin: 0
          }
        }
      },
    });
  }

  ngOnInit(): void {
    localStorage.setItem("title","Patient Dashboard") 
    if (String(localStorage.getItem("title")) != "Patient Dashboard") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    if (this.id == localStorage.getItem("patientID")) {
      this.hospitalID = Number(localStorage.getItem("hospitalID"));
      this.isupdated = false;
      this.modal = false;
      this.updateFailure = false;
      this.getPatientDetails();
      this.getImage();
      this.getStatistics();
      this.getUpcomingAppointments();
    } else {
      this.router.navigate(['authentication'])
    }
  }

  goToAppointments() {
    this.router.navigate(['appointment', this.id])
  }

  onFileChanged(event) {
    this.selectedImage = event.target.files[0];
  }

  onUpload() {
    const imageData = new FormData();
    imageData.append('logo', this.selectedImage, this.selectedImage.name);

    this.patientService.uploadImage(this.id, this.hospitalID, imageData).subscribe(data => {
      if (data == null) {
        this.updateFailure = false;
        this.isupdated = false;
        this.invalid = true;
      } else {
        this.invalid = false;
        this.updateFailure = false;
        this.isupdated = true;
        this.getImage();
      }
    }, error => {
      this.invalid = false;
      this.isupdated = false;
      this.updateFailure = true;
    })
  }

  getImage() {
    this.patientService.getImage(this.id, this.hospitalID).subscribe(data => {
      this.image = data;
      this.image = 'data:image/jpeg;base64,' + this.image.logo;
    }, error => {
      this.image == null;
    })
  }
}
