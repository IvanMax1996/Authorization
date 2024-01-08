import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  hidePassword: boolean = true
  check: boolean = false

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
    this.form = this.fb.group({
      login: '',
      password: '',
      checked: true
    })
  }

  onSubmit(): void {
    const url: string = "http://51.158.107.27:82/api/login"
    const {checked, ...request} = this.form.value

    this.authService.login(url, request).subscribe(console.log)
  }

}
