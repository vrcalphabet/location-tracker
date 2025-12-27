import { Params } from '@common/utils/Params';
import { query } from '@common/utils/query';

function getBanner(mutations: MutationRecord[]): HTMLElement | void {
  for (const mutation of mutations) {
    for (const addedNode of mutation.addedNodes) {
      if (addedNode instanceof HTMLElement && addedNode.id === 'vdbanner') {
        return addedNode;
      }
    }
  }
}

function moveBanner(banner: HTMLElement): void {
  const target = query('.js-ad__content');
  target.append(banner);
}

const observer = new MutationObserver((mutations) => {
  const banner = getBanner(mutations);
  if (!banner) return;

  moveBanner(banner);
  observer.disconnect();
});
observer.observe(document.body, { childList: true });

if (Params.get('ad') === '0') {
  query('.js-ad').hidden = true;
}
