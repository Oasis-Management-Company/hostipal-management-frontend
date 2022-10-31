import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Appointment } from 'src/app/dashboard/appointment/appointment';
import { Visit } from './visit';
import { HospitalService } from '../hospital.service';
import { SettingsService } from '../management/settings/settings.service';
import { Staff } from '../staff';
import { Record } from 'src/app/dashboard/record/record';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare const Chart: any;

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  date: any;
  staff = new Staff();
  staffID: string;
  appointments: Appointment[];
  appointment = new Appointment();
  visits: Visit[];
  waiting: Visit[];
  hospitalID: number;
  image: any;
  passwordMatch = false;
  isNotPassword = false;
  passChanged = false;
  changeFailed = false;
  notEqual = false;
  modal = false;
  mon: Record[];
  tue: Record[];
  wed: Record[];
  thur: Record[];
  fri: Record[];
  sat: Record[];
  sun: Record[];
  months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  constructor(private route: ActivatedRoute, private router: Router, private hospitalService: HospitalService, private settingsService: SettingsService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Hospital Dashboard")  
    if (String(localStorage.getItem("title")) != "Hospital Dashboard") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    this.staffID = String(localStorage.getItem("staffID"));
    if (this.hospitalID && this.staffID != "null") {
      this.dismissAlert();
      this.closeModal();
      this.getStaff();
      this.todayDate();
      this.countAppointments();
      this.countVisits();
      this.getStatistics();
      this.countWaiting();
    } else {
      this.router.navigate(['hospital/staff/login']);
    }
  }

  getStatistics() {
    this.hospitalService.statisticsMon(this.hospitalID, this.staffID).subscribe(data => {
      this.mon = data;
    })
    this.hospitalService.statisticsTue(this.hospitalID, this.staffID).subscribe(data => {
      this.tue = data;
    })
    this.hospitalService.statisticsWed(this.hospitalID, this.staffID).subscribe(data => {
      this.wed = data;
    })
    this.hospitalService.statisticsThur(this.hospitalID, this.staffID).subscribe(data => {
      this.thur = data;
    })
    this.hospitalService.statisticsFri(this.hospitalID, this.staffID).subscribe(data => {
      this.fri = data;
    })
    this.hospitalService.statisticsSat(this.hospitalID, this.staffID).subscribe(data => {
      this.sat = data;
    })
    this.hospitalService.statisticsSun(this.hospitalID, this.staffID).subscribe(data => {
      this.sun = data;
    })
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

  getStaff() {
    this.hospitalService.getStaff(this.staffID, this.hospitalID).subscribe(data => {
      this.staff = data;
      this.getImage(this.staff.staffID);
    })
  }

  dismissAlert() {
    this.passChanged = false;
    this.changeFailed = false;
  }

  openModal() {
    this.modal = true;
  }

  closeModal() {
    this.modal = false;
    this.changePass.reset();
  }

  changePass = new FormGroup({
    password: new FormControl('', Validators.required),
    password1: new FormControl('', [Validators.required, Validators.minLength(8)]),
    password2: new FormControl('', Validators.required),
  })

  get password() {
    return this.changePass.get('password');
  }

  get password1() {
    return this.changePass.get('password1');
  }

  get password2() {
    return this.changePass.get('password2');
  }

  checkPassword() {
    this.matchPassword();
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

  matchPassword() {
    this.staff.password = this.password?.value;
    this.hospitalService.matchPassword(this.hospitalID, this.staffID, this.staff).subscribe(data => {
      this.passwordMatch = data;
    })
  }

  changePassword() {
    this.checkPassword();
    if (this.notEqual || this.isNotPassword) {
      this.passChanged = false;
      this.changeFailed = true;
    } else {
      this.changeFailed = false;
      this.staff.password = this.password1?.value;

      this.hospitalService.updatePassword(this.hospitalID, this.staffID, this.staff).subscribe(data => {
        this.changeFailed = false;
        this.passChanged = true;
      }, error => {
        this.passChanged = false;
        this.changeFailed = true;
      })
    }
  }

  todayDate() {
    this.settingsService.todaysDate().subscribe(data => {
      this.date = data;
    })
  }

  countAppointments() {
    this.hospitalService.todayAppointment(this.staffID, this.hospitalID).subscribe(data => {
      this.appointments = data;
    });
  }

  countVisits() {
    this.hospitalService.allVisits(this.staffID, this.hospitalID).subscribe(data => {
      this.visits = data;
    })
  }

  countWaiting() {
    this.hospitalService.getWaiting(this.staffID, this.hospitalID).subscribe(data => {
      this.waiting = data;
      this.loadChart(this.mon.length, this.tue.length, this.wed.length, this.thur.length, this.fri.length, this.sat.length, this.sun.length);
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

}
