import {Component, ComponentRef, ViewChild, ViewContainerRef} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {HostDirective} from "../../directives/host.directive";
import {TooltipComponent} from "../../../shared/components/tooltip/tooltip.component";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  @ViewChild(HostDirective, {read: ViewContainerRef}) hostView!: ViewContainerRef
  avatar: string | undefined
  ID: string | undefined
  name: string | undefined
  message: string = ''
  arrayComponentId: Array<number> = []
  arrayComponent: Array<ComponentRef<TooltipComponent>> = []

  constructor(private route: ActivatedRoute) {
    route.queryParams.subscribe(
      (queryParam): void => {
        this.avatar = queryParam["avatar"]
        this.ID = queryParam["userId"]
        this.name = queryParam["userName"]
      }
    )
  }

  callTooltip(message: string, borderLeft?: string, fill?: string): void {
    if (this.arrayComponentId.length < 4 && message !== '') {
      const dynamicComponent: ComponentRef<TooltipComponent> = this.hostView.createComponent(TooltipComponent)

      this.arrayComponentId.push(dynamicComponent.location.nativeElement['__ngContext__'])
      this.arrayComponent.push(dynamicComponent)

      if (fill !== undefined) dynamicComponent.instance.fill = fill
      if (borderLeft !== undefined) dynamicComponent.instance.borderLeft = borderLeft
      dynamicComponent.instance.message = message

      if (this.arrayComponentId.length === 4) {
        let locationTooltip: number = this.arrayComponentId[0]

        this.arrayComponentId.forEach((item: number): void => {
          if (locationTooltip > item) locationTooltip = item
        })

        const index: number = this.arrayComponentId.indexOf(locationTooltip);

        this.arrayComponent.forEach((item: ComponentRef<TooltipComponent>): void => {
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
}
