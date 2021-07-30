import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'cy-about-container',
  templateUrl: './about-container.component.html',
  styleUrls: [ './about-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutContainerComponent {
  public year: number = new Date().getFullYear()
}
