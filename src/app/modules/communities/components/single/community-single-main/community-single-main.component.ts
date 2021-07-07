import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-community-single-main',
  templateUrl: './community-single-main.component.html',
  styleUrls: ['./community-single-main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CommunitySingleMainComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
