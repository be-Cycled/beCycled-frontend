import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core'
import mapboxgl from 'mapbox-gl'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent implements OnInit {

  public map: mapboxgl.Map | null = null

  public ngOnInit(): void {
  }

}
