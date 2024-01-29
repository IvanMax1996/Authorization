import {Component, ComponentRef, OnInit, ViewChild, ViewContainerRef} from "@angular/core";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
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
  response: any | undefined
  message: string | undefined
  arrayComponentId: Array<number> = []
  arrayComponent: Array<ComponentRef<TooltipComponent>> = []

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
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
    const url: string = "assets/data.json"
    const {checked, ...request} = this.form.value

    this.authService.login(url).subscribe({
      next: (data): void => {
        this.response = data

        if (this.response.login === request.login && this.response.password === request.password) this.router.navigate(['dashboard']).then();
        else this.message = 'Неправильный логин или пароль'

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
