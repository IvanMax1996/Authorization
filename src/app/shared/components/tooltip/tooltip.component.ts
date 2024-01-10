import {Component, EventEmitter, Input, Output} from "@angular/core";

@Component({
  selector: 'tooltip',
  templateUrl: 'tooltip.component.html',
  styleUrls: ['tooltip.component.scss']
})
export class TooltipComponent {
  @Output() close: EventEmitter<any> = new EventEmitter();
  @Input() error: string = ''
  @Input() fill: string = '#FC5A5A'
  closeTooltip(): void {
    this.close.emit();
  }
}
