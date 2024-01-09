import {Component, OnInit} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Observable} from "rxjs";
import {CurrentUserInterface} from "../../types/currentUser.interface";
import {PersistenceService} from "../../../shared/services/persistence.service";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup
  hidePassword: boolean = true

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private persistenceService: PersistenceService
  ) {}

  ngOnInit() {
    this.initializeForm()
  }

  initializeForm(): void {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s,-]{6,}')]],
      checked: false
    })
  }

  onSubmit(): void {
    const url: string = "http://51.158.107.27:82/api/login"
    const {checked, ...request} = this.form.value

    this.authService.login(url, request).subscribe({
      next: (data: any) => {
        if (checked) {
          const tokens = data.tokens
          this.persistenceService.setCookie('tokens', tokens)
        }
      },
      error: () => console.log(),
      complete: () => {}
    })
  }
}
