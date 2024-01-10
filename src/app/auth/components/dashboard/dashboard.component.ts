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
  message: string = ''
  count: number = 0
  arr: Array<number> = []

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
    if (this.count < 3 && message !== '') {
      const dynamicComponent = this.hostView.createComponent(TooltipComponent)

      this.arr.push(dynamicComponent.location.nativeElement['__ngContext__'])

      if (fill !== undefined) dynamicComponent.instance.fill = fill
      if (borderLeft !== undefined) dynamicComponent.instance.borderLeft = borderLeft
      dynamicComponent.instance.message = message

      dynamicComponent.instance.closeTooltip = (): void => {
        --this.count

        const index = this.arr.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);
        if (index !== -1) this.arr.splice(index, 1);

        console.log(this.arr)
        dynamicComponent.instance.hide = true

        setTimeout(() => {
          dynamicComponent.destroy()
        }, 800)
      }

      setTimeout(() => {
        const result = this.arr.includes(dynamicComponent.location.nativeElement['__ngContext__'])
        console.log(result)
        if (result) --this.count
        const index = this.arr.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);
        if (index !== -1) this.arr.splice(index, 1);
        dynamicComponent.destroy()
        console.log(this.arr)
      }, 15000)

      ++this.count
      // console.log(this.count)
    }
  }
}
