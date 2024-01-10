import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.scss']
})
export class TooltipComponent {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() message: string = ''
  @Input() fill: string = '#FC5A5A'
  @Input() borderLeft: string = '6px solid #FC5A5A'
  @Input() hide: boolean = false
  closeTooltip(): void {
    this.close.emit();
  }
}
