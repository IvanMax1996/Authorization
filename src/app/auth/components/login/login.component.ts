import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  hidePassword: boolean = true

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
    this.form = this.fb.group({
      email: '',
      password: '',
    })
  }

  onSubmit(): void {
    const request = this.form.value


  }
}
