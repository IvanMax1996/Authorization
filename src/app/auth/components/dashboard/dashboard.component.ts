import {Component} from "@angular/core";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'dashboard',
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent {
  avatar: string | undefined
  ID: string | undefined
  name: string | undefined

  constructor(private route: ActivatedRoute) {
    route.queryParams.subscribe(
      (queryParam): void => {
        this.avatar = queryParam["avatar"]
        this.ID = queryParam["userId"]
        this.name = queryParam["userName"]
      }
    )
  }
}
