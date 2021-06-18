import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-communities-container',
  templateUrl: './communities-container.component.html',
  styleUrls: ['./communities-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitiesContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
