import { nanoid } from 'nanoid';
import { importLibrary, setOptions } from '@googlemaps/js-api-loader';

type latLonZoom = { lat: number; lon: number; zoom: number };

export class GoogleMaps {
  private _map?: google.maps.Map;
  private _marker?: google.maps.marker.AdvancedMarkerElement;
  private _circle?: google.maps.Circle;

  constructor({ token }: { token: string }) {
    setOptions({
      key: token,
      language: 'ja',
    });
  }

  async init(target: HTMLElement): Promise<void> {
    const { Map, Circle } = await importLibrary('maps');
    const { AdvancedMarkerElement } = await importLibrary('marker');

    const japanBounds = {
      north: 45.567,
      east: 145.818,
      south: 25.819,
      west: 127.565,
    };

    this._map = new Map(target, {
      center: {
        lat: 35.681167,
        lng: 139.767052,
      },
      zoom: 19,
      disableDefaultUI: true,
      clickableIcons: false,
      gestureHandling: 'greedy',
      headingInteractionEnabled: false,
      restriction: {
        latLngBounds: japanBounds,
        strictBounds: true,
      },
      mapId: nanoid(),
    });
    this._marker = new AdvancedMarkerElement({
      map: this._map,
    });
    this._circle = new Circle({
      fillColor: '#0000FF',
      fillOpacity: 0.1,
      strokeColor: '#0000FF',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      map: this._map,
    });

    console.log(this._map);
  }

  setView(options: latLonZoom, offsetY: number): void {
    if (!this._map) return;

    this._panTo(options, offsetY);
    this._map.setZoom(options.zoom);
  }

  private _panTo(options: latLonZoom, offsetY: number) {
    if (!this._map) return;

    const latLng = { lat: options.lat, lng: options.lon };
    const projection = this._map.getProjection();
    if (!projection) {
      this._map.panTo(latLng);
      return;
    }

    const worldPoint = projection.fromLatLngToPoint(latLng)!;
    const offsetPoint = new google.maps.Point(0, offsetY / 2 ** options.zoom);
    const newCenterWorld = new google.maps.Point(
      worldPoint.x - offsetPoint.x,
      worldPoint.y + offsetPoint.y,
    );

    const newCenterLatLng = projection.fromPointToLatLng(newCenterWorld)!;
    this._map.panTo(newCenterLatLng);
  }

  setMarker(options: { lat: number; lon: number; uncertainty: number }): void {
    if (!this._marker || !this._circle) return;

    this._marker.position = {
      lat: options.lat,
      lng: options.lon,
    };

    this._circle.setOptions({
      center: {
        lat: options.lat,
        lng: options.lon,
      },
      radius: options.uncertainty,
    });
  }
}
