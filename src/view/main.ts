import '@common/custom_elements/SvgLoader';
import { Api } from '@common/services/Api';
import { GoogleMaps } from '@common/services/GoogleMaps';
import '@common/services/adCheck';
import type { PhoneDataLocation } from '@common/types/api/PhoneData';
import { queryElem } from '@common/utils/query';
import { Header } from './services/Header';
import { LocationCard } from './services/LocationCard';
import './style.scss';

(async () => {
  const elem = queryElem(document.body, {
    header: '.js-header',
    maps: '.js-maps',
    locationCard: '.js-location-card',
    locationCardBody: '.js-location-card__body',
    locationCardLocationInfo: '.js-location-card__location-info',
    grabber: '.js-grabber',
    reloadButton: '.js-location-card__reload',
    locateButton: '.js-locate__button',
  });

  const googleMaps = new GoogleMaps({ token: env.GOOGLE_API_KEY! });
  await googleMaps.init(elem.maps);
  delete env['GOOGLE_API_KEY'];

  let lastLocation: PhoneDataLocation;

  const header = new Header(elem.header);
  const locationCard = new LocationCard(elem.locationCard);

  elem.reloadButton.addEventListener('click', () => {
    updatePhoneData();
    setReloadInterval();
  });
  elem.locateButton.addEventListener('click', locate);
  elem.grabber.addEventListener('click', shrinkGrabber);

  const intervalTime = 300;
  setInterval(updatePhoneData, intervalTime * 1000);
  updatePhoneData();

  async function updatePhoneData() {
    locationCard.setLoading();

    const phoneData = await Api.requestPhoneData();
    if (phoneData.success === false) {
      alert(
        '位置情報データが取得できませんでした。サーバがダウンしているか、データが削除された可能性があります。',
      );
      return;
    }

    lastLocation = phoneData.data.location;
    header.update(phoneData.data);
    locationCard.update(phoneData.data);
    setHeightForGrabber();

    const { lat, lon, uncertainty } = lastLocation;
    googleMaps.setMarker({ lat, lon, uncertainty });
    locate();
  }

  function setReloadInterval() {
    elem.reloadButton.setAttribute('disabled', '');

    const intervalTime = 5;
    setTimeout(() => {
      elem.reloadButton.removeAttribute('disabled');
    }, intervalTime * 1000);
  }

  function locate() {
    const { lat, lon } = lastLocation;
    const bodyHeight = elem.locationCardBody.clientHeight;
    googleMaps.setView({ lat, lon, zoom: 19 }, bodyHeight / 2);
  }

  function setHeightForGrabber() {
    const infoHeight = elem.locationCardLocationInfo.clientHeight;
    const infoOffsetHeight = 58;
    elem.locationCardBody.dataset['height'] = String(infoHeight + infoOffsetHeight);
  }

  function shrinkGrabber() {
    elem.locationCardBody.classList.toggle('location-card__body--shrink');
  }
})();
