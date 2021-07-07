import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-single-container',
  templateUrl: './community-single-container.component.html',
  styleUrls: ['./community-single-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
