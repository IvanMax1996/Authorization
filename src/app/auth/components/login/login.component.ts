import {Component, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {PersistenceService} from "../../../shared/services/persistence.service";
import {CurrentUserInterface} from "../../types/currentUser.interface";
import {HostDirective} from "../../directives/host.directive";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild(HostDirective, {read: ViewContainerRef}) hostView!: ViewContainerRef
  form!: FormGroup
  hidePassword: boolean = true
  response!: CurrentUserInterface | undefined
  error!: string | undefined

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private persistenceService: PersistenceService
  ) {}

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
      next: (data: CurrentUserInterface) => {
        this.response = data

        if (checked) {
          const tokens = data.tokens
          this.persistenceService.setCookie('tokens', tokens)
        }
      },
      error: error => {
        if (error.error.hasError) {
          this.error = error.error.errors[0]
          console.log(this.error)
        }
      }
    })
  }

  ngOnInit() {
    this.initializeForm()
  }
}
