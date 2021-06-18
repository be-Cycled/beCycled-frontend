import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core'
import mapboxgl from 'mapbox-gl'
import { Competition, SportType } from '../../../../domain'
import { ISO8601 } from '../../../../models'

@Component({
  selector: 'cy-competition',
  templateUrl: './competition.component.html',
  styleUrls: [ './competition.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompetitionComponent implements OnInit {

  public sportTypeMap: any = {
    [ SportType.bicycle ]: 'Велосипед',
    [ SportType.rollerblade ]: 'Роликовые коньки',
    [ SportType.run ]: 'Бег',
    [ SportType.ski ]: 'Лыжи'
  }

  public map: mapboxgl.Map | null = null

  @Input()
  public competition: Competition | null = null

  public geoJson: any = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [
          39.293288,
          44.517893
        ],
        [
          39.291926,
          44.526663
        ],
        [
          39.298331,
          44.541942
        ],
        [
          39.297548,
          44.548083
        ],
        [
          39.295896,
          44.548243
        ],
        [
          39.291059,
          44.546008
        ],
        [
          39.265421,
          44.544074
        ],
        [
          39.256895,
          44.541969
        ],
        [
          39.254587,
          44.547227
        ],
        [
          39.251734,
          44.549105
        ],
        [
          39.252181,
          44.555118
        ],
        [
          39.247456,
          44.555221
        ],
        [
          39.240413,
          44.552797
        ],
        [
          39.239056,
          44.555792
        ],
        [
          39.23331,
          44.559518
        ],
        [
          39.23053,
          44.568704
        ],
        [
          39.22845,
          44.568344
        ],
        [
          39.224435,
          44.569608
        ],
        [
          39.223859,
          44.571839
        ],
        [
          39.21301,
          44.569463
        ],
        [
          39.204562,
          44.571403
        ],
        [
          39.203478,
          44.577141
        ],
        [
          39.204883,
          44.581904
        ],
        [
          39.204145,
          44.585324
        ],
        [
          39.199924,
          44.59188
        ],
        [
          39.189854,
          44.600078
        ],
        [
          39.189864,
          44.606741
        ],
        [
          39.191716,
          44.609459
        ],
        [
          39.190354,
          44.612971
        ],
        [
          39.193547,
          44.614699
        ],
        [
          39.187401,
          44.630378
        ],
        [
          39.186263,
          44.638282
        ],
        [
          39.185192,
          44.638033
        ],
        [
          39.179831,
          44.643768
        ],
        [
          39.175176,
          44.641512
        ]
      ]
    }
  }

  public ngOnInit(): void {
  }

  public generateBounds(coordinates: any): any {
    return coordinates.reduce((bounds: mapboxgl.LngLatBounds, coord: any) => {
        return bounds.extend(coord)
      },
      new mapboxgl.LngLatBounds(coordinates[ 0 ], coordinates[ 0 ]))
  }

  public generateWorkoutStartTime(date: ISO8601): string {
    const parsedDate: Date = new Date(date)
    return new Intl.DateTimeFormat('ru-RU', { hour: 'numeric', minute: 'numeric' }).format(parsedDate)
  }
}
