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
  count: number = 0
  arrayComponent: Array<number> = []
  arrayTwo: Array<ComponentRef<TooltipComponent>> = []

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
    if (this.arrayComponent.length < 4 && message !== '') {


      const dynamicComponent = this.hostView.createComponent(TooltipComponent)
      this.arrayComponent.push(dynamicComponent.location.nativeElement['__ngContext__'])

      this.arrayTwo.push(dynamicComponent)
      if (fill !== undefined) dynamicComponent.instance.fill = fill
      if (borderLeft !== undefined) dynamicComponent.instance.borderLeft = borderLeft
      dynamicComponent.instance.message = message

      if (this.arrayComponent.length === 4) {
        let count = 0
        let min = this.arrayComponent[0]
        // console.log(min)
        this.arrayComponent.forEach((item, index, arr) => {
          if (min > item) min = item
          count = min
          // console.log(count)
        })
        const index = this.arrayComponent.indexOf(count);

        setTimeout(() => {
          this.arrayTwo.forEach((item: any) => {
            if (item.location.nativeElement['__ngContext__'] === count) {
              item.destroy()
            }
          })
          // this.arrayTwo[0].destroy()
          // dynamicComponent.destroy()
          this.arrayComponent.splice(index, 1);
          this.arrayTwo.splice(index, 1)
          console.log('При исчезновении ', this.arrayComponent)
          console.log('При исчезновении ', this.arrayTwo)
        }, 800)




        // dynamicComponent.instance.hide = true


      }

      dynamicComponent.instance.closeTooltip = (): void => {

        const index = this.arrayComponent.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);
        if (index !== -1) {
          this.arrayTwo.splice(index, 1)
          this.arrayComponent.splice(index, 1);
        }
        dynamicComponent.instance.hide = true

        setTimeout(() => {
          dynamicComponent.destroy()
        }, 800)

        console.log('После удаления ', this.arrayTwo)
        console.log('После удаления ', this.arrayComponent)
      }

      // setTimeout(() => {
      //   const result = this.arrayComponent.includes(dynamicComponent.location.nativeElement['__ngContext__'])
      //   if (result) --this.count
      //   const index = this.arrayComponent.indexOf(dynamicComponent.location.nativeElement['__ngContext__']);
      //   if (index !== -1) this.arrayComponent.splice(index, 1);
      //   dynamicComponent.destroy()
      // }, 15000)

      // ++this.count
      console.log('В конце ', this.arrayTwo)
      console.log('В конце ', this.arrayComponent)
    }
  }
}
