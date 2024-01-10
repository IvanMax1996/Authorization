import {Component, ViewChild, ViewContainerRef} from "@angular/core";
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
  message!: string
  count: number = 0

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
    if (this.count < 3 && message !== undefined) {
      const dynamicComponent = this.hostView.createComponent(TooltipComponent)

      dynamicComponent.instance.message = message
      if (fill !== undefined) dynamicComponent.instance.fill = fill
      if (borderLeft !== undefined) dynamicComponent.instance.borderLeft = borderLeft

      dynamicComponent.instance.closeTooltip = (): void => {
        dynamicComponent.instance.hide = true
        setTimeout(() => {
          dynamicComponent.destroy()
          --this.count
        }, 800)
      }

      setTimeout(() => {
        dynamicComponent.destroy()
        --this.count
      }, 15000)

      ++this.count
    }
  }
}
