import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'

@Component({
  selector: 'cy-posts-container',
  templateUrl: './posts-container.component.html',
  styleUrls: ['./posts-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PostsContainerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
