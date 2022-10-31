import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HospitalService } from 'src/app/hospital/hospital.service';
import { Staff } from 'src/app/hospital/staff';
import { Logs } from '../../logs/logs';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-non-med',
  templateUrl: './non-med.component.html',
  styleUrls: ['./non-med.component.css']
})
export class NonMedComponent implements OnInit {
  staffs: Staff[];
  staff = new Staff();
  hospitalID: number;
  modal = false;
  editModal = false;
  mustSelect = false;
  selected: string[] = [];
  selectedDays: string;
  count: number = 0;
  isUpdated = false;
  updateFailed = false;
  selectedImage: File;
  invalid = false;
  image: any;
  addModal = false;
  registered = false;
  registerFailed = false;
  exists = false;
  logs: Logs[];
  logModal = false;
  notAuthorised = false;

  constructor(private router: Router, private settingsService: SettingsService, private hospitalService: HospitalService) { }

  ngOnInit(): void {
    localStorage.setItem("title","Staff - Non-Medical")   
    if (String(localStorage.getItem("title")) != "Staff - Non-Medical") {
      let currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      })
    }
    this.hospitalID = Number(localStorage.getItem("hospitalID"));
    if (this.hospitalID && (localStorage.getItem("admin") == "true" || localStorage.getItem("superadmin") == "true")) {
      this.dismissAlert();
      this.closeModal();
      this.getStaff();
    } else {
      this.router.navigate(['hospital']);
    }
  }

  dismissAlert() {
    this.mustSelect = false;
    this.isUpdated = false;
    this.updateFailed = false;
    this.invalid = false;
    this.registerFailed = false;
    this.registered = false;
    this.exists = false;
    this.notAuthorised = false;
  }

  closeModal() {
    this.staff = new Staff();
    this.selected = [];
    this.selectedDays = '';
    this.modal = false;
    this.editModal = false;
    this.addModal = false;
    this.logModal = false;
  }

  getStaff() {
    this.settingsService.allNonMedStaff(this.hospitalID).subscribe(data => {
      this.staffs = data;
    })
  }

  getStaffLogs(staffID: string) {
    this.settingsService.getStaffLogs(staffID, this.hospitalID).subscribe(data => {
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

  closeLogs() {
    this.logModal = false;
  }

  viewDetails(id: string) {
    this.dismissAlert();
    this.hospitalService.getStaff(id, this.hospitalID).subscribe(data => {
      this.staff = data;
      this.modal = true;
    })
  }

  editDetails(id: string) {
    this.dismissAlert();
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      this.hospitalService.getStaff(id, this.hospitalID).subscribe(data => {
        this.staff = data;
        this.selected = this.staff.onDuty.split(",");
        this.selectedDays = this.selected.toString();
        this.getImage(id);
        this.editModal = true;
      })
    } else {
      this.notAuthorised = true;
    }
  }

  onChange(day: string, event) {
    this.mustSelect = false;
    const checked = (<HTMLInputElement>event.target).checked;

    if (checked) {
      this.selected.push(day);
      this.selectedDays = this.selected.toString();
    } else {
      const index = this.selected.indexOf(day);
      this.selected.splice(index, 1);
    }
    const count = this.selected.length;
    this.count = count;
    this.selectedDays = this.selected.toString();
  }

  onFileChanged(event) {
    this.selectedImage = event.target.files[0];
  }

  onUpload(id: string) {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      const imageData = new FormData();
      imageData.append('logo', this.selectedImage, this.selectedImage.name);

      this.settingsService.updateStaffPic(id, this.hospitalID, imageData).subscribe(data => {
        if (data == null) {
          this.isUpdated = false;
          this.updateFailed = false;
          this.invalid = true;
        } else {
          this.invalid = false;
          this.updateFailed = false;
          this.isUpdated = true;
          this.getImage(id);
        }
      }, error => {
        this.invalid = false;
        this.isUpdated = false;
        this.updateFailed = true;
      })
    } else {
      this.notAuthorised = true;
    }
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
      this.staff.logo == null;
    })
  }

  updateForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    date: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    rank: new FormControl('', Validators.required),
    disable: new FormControl('')
  })

  get name() {
    return this.updateForm.get('name');
  }

  get email() {
    return this.updateForm.get('email');
  }

  get date() {
    return this.updateForm.get('date');
  }

  get phone() {
    return this.updateForm.get('phone');
  }

  get role() {
    return this.updateForm.get('role');
  }

  get rank() {
    return this.updateForm.get('rank');
  }

  get disable() {
    return this.updateForm.get('disable');
  }

  update(id: string) {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      if (this.selectedDays == null) {
        this.mustSelect = true;
      } else {
        this.mustSelect = false;
        this.staff.name = this.name?.value;
        this.staff.dob = this.date?.value;
        this.staff.email = this.email?.value;
        this.staff.phone = this.phone?.value;
        this.staff.role = this.role?.value;
        this.staff.rank = this.rank?.value;
        this.staff.type = "regular";
        this.staff.onDuty = this.selectedDays;
        this.staff.deactivate = this.disable?.value;

        this.settingsService.updateStaff(id, this.hospitalID, this.staff).subscribe(data => {
          this.updateFailed = false;
          this.invalid = false;
          this.mustSelect = false;
          this.isUpdated = true;
          this.getStaff();
        }, error => {
          this.mustSelect = false;
          this.invalid = false;
          this.isUpdated = false;
          this.updateFailed = true;
        })
      }
    } else {
      this.closeModal();
      this.notAuthorised = true;
    }
  }

  add() {
    this.dismissAlert();
    this.addModal = true;
  }

  addForm = new FormGroup({
    id: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    date: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    rank: new FormControl('', Validators.required)
  })

  get id() {
    return this.addForm.get('id');
  }

  get gender() {
    return this.addForm.get('gender');
  }

  get Aname() {
    return this.addForm.get('name');
  }

  get Aemail() {
    return this.addForm.get('email');
  }

  get Adate() {
    return this.addForm.get('date');
  }

  get Aphone() {
    return this.addForm.get('phone');
  }

  get Arole() {
    return this.addForm.get('role');
  }

  get Arank() {
    return this.addForm.get('rank');
  }

  addStaff() {
    if (localStorage.getItem("superadmin")) {
      this.notAuthorised = false;
      if (this.count == 0) {
        this.mustSelect = true;
      } else {
        this.mustSelect = false;
        this.staff = new Staff();
        this.staff.staffID = this.id?.value;
        this.staff.gender = this.gender?.value;
        this.staff.name = this.Aname?.value;
        this.staff.dob = this.Adate?.value;
        this.staff.hospitalID = this.hospitalID;
        this.staff.email = this.Aemail?.value;
        this.staff.phone = this.Aphone?.value;
        this.staff.role = this.Arole?.value;
        this.staff.rank = this.Arank?.value;
        this.staff.type = "regular";
        this.staff.onDuty = this.selectedDays;

        this.settingsService.staffRegister(this.hospitalID, this.staff).subscribe(data => {
          this.registerFailed = false;
          if (data == null) {
            this.registered = false;
            this.exists = true;
          } else {
            this.exists = false;
            this.registered = true;
            this.addForm.reset();
            this.getStaff();
          }
        }, error => {
          this.registered = false;
          this.exists = false;
          this.registerFailed = true;
        })
      }
    } else {
      this.closeModal();
      this.notAuthorised = true;
    }
  }

}
