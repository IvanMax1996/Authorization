import {Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {PersistenceService} from "../../../shared/services/persistence.service";
import {CurrentUserInterface} from "../../types/currentUser.interface";
import {HostDirective} from "../../directives/host.directive";
import {TooltipComponent} from "../../../shared/components/tooltip/tooltip.component";
import {Router} from "@angular/router";
import {TokenInterface} from "../../types/token.interface";

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
  message: string | undefined
  arrayComponentId: Array<number> = []
  arrayComponent: Array<ComponentRef<TooltipComponent>> = []

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
      next: (data: CurrentUserInterface): void => {
        this.response = data

        if (checked) {
          const tokens: TokenInterface = data.tokens
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
        switch(error.status) {
          case 400:
            this.message = error.error.errors[0]
            break
          case 429:
            this.message = error.error.Message
            break
          case 0:
            this.message = 'Неизвестная ошибка'
            break
        }

        if (this.arrayComponentId.length < 4) {
          const dynamicComponent: ComponentRef<TooltipComponent> = this.hostView.createComponent(TooltipComponent)
          this.arrayComponentId.push(dynamicComponent.location.nativeElement['__ngContext__'])
          this.arrayComponent.push(dynamicComponent)

          if (this.message !== undefined) dynamicComponent.instance.message = this.message

          if (this.arrayComponentId.length === 4) {
            let locationTooltip: number = this.arrayComponentId[0]

            this.arrayComponentId.forEach((item: number): void => {
              if (locationTooltip > item) locationTooltip = item
            })

            const index: number = this.arrayComponentId.indexOf(locationTooltip);

            this.arrayComponent.forEach((item: any): void => {
              if (item.location.nativeElement['__ngContext__'] === locationTooltip) {
                item.instance.hide = true
              }
            })

            setTimeout((): void => {
              this.arrayComponent.forEach((item: any): void => {
                if (item.location.nativeElement['__ngContext__'] === locationTooltip) {
                  item.destroy()
                }
              })

              this.arrayComponentId.splice(index, 1);
              this.arrayComponent.splice(index, 1)
            }, 300)
          }

          dynamicComponent.instance.closeTooltip = (): void => {
            const index: number = this.arrayComponentId.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);

            if (index !== -1) {
              this.arrayComponent.splice(index, 1)
              this.arrayComponentId.splice(index, 1);
            }

            dynamicComponent.instance.hide = true

            setTimeout((): void => {
              dynamicComponent.destroy()
            }, 300)
          }

          setTimeout((): void => {
            const index: number = this.arrayComponentId.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);

            if (index !== -1) {
              this.arrayComponent.splice(index, 1)
              this.arrayComponentId.splice(index, 1);
            }

            dynamicComponent.destroy()
          }, 15000)
        }
      }
    })
  }

  ngOnInit() {
    this.initializeForm()
  }
}
