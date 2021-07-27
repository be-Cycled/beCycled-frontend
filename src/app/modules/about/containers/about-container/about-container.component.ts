import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-about-container',
  templateUrl: './about-container.component.html',
  styleUrls: [ './about-container.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutContainerComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
