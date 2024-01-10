import {Component, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {PersistenceService} from "../../../shared/services/persistence.service";
import {CurrentUserInterface} from "../../types/currentUser.interface";
import {HostDirective} from "../../directives/host.directive";
import {TooltipComponent} from "../../../shared/components/tooltip/tooltip.component";
import {Router} from "@angular/router";

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent implements OnInit {
  @ViewChild(HostDirective, {read: ViewContainerRef}) hostView!: ViewContainerRef
  form!: FormGroup
  hidePassword: boolean = true
  response: CurrentUserInterface | undefined
  error: string | undefined
  count: number = 0

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private persistenceService: PersistenceService,
    private router: Router
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

        this.router.navigate(['dashboard'],
          {
            queryParams: {
              "avatar": this.response.userInfo.userAvatar,
              "userName": this.response.userInfo.userName,
              "userId": this.response.userInfo.userId
            }
          }).then();
      },
      error: error => {
        if (error.error.hasError) {
          this.error = error.error.errors[0]

          if (this.count < 3) {
            const dynamicComponent = this.hostView.createComponent(TooltipComponent)

            if (this.error !== undefined) dynamicComponent.instance.error = this.error

            dynamicComponent.instance.closeTooltip = (): void => {
              dynamicComponent.destroy()
              --this.count
            }

            setTimeout(() => {
              dynamicComponent.destroy()
              --this.count
            }, 15000)

            ++this.count
          }
        }
      }
    })
  }

  ngOnInit() {
    this.initializeForm()
  }
}
