import DOMPurify from 'dompurify';
import { query } from '@common/utils/query';

class SvgLoader extends HTMLElement {
  static observedAttributes = ['name'];
  private _svgCache = new Map<string, SVGSVGElement>();
  private _shadow: ShadowRoot;

  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  attributeChangedCallback() {
    this.after(...this.childNodes);
    this._render();
  }

  private async _render(): Promise<void> {
    this._shadow.textContent = '';

    const name = this.getAttribute('name');
    if (!name) return;

    if (!this._svgCache.has(name)) {
      const content = await this._loadSvg(name);
      const svg = this._extractSvg(name, content);
      this._svgCache.set(name, svg);
    }

    const svg = this._svgCache.get(name)!;
    this._insertSvg(svg.cloneNode(true) as SVGSVGElement);
  }

  private async _loadSvg(name: string): Promise<string> {
    const svgPath = `/assets/icons/${encodeURIComponent(name)}.svg`;
    const res = await fetch(svgPath);
    if (!res.ok) {
      throw new Error(`SVG file not found, open '${name}.svg'`);
    }

    const content = await res.text();
    return content;
  }

  private _extractSvg(name: string, content: string): SVGSVGElement {
    const sanitizedText = DOMPurify.sanitize(content);
    const doc = new DOMParser().parseFromString(sanitizedText, 'image/svg+xml');
    const svg = query<SVGSVGElement>('svg', doc);

    if (svg === null) {
      throw new Error(`File does not contain <svg> tags, open '${name}.svg`);
    }

    return svg;
  }

  private _insertSvg(svg: SVGSVGElement): void {
    svg.style.display = 'flex';
    this._shadow.append(svg);

    const size = this.getAttribute('size');
    svg.style.width = size ?? '24';
    svg.style.height = size ?? '24';
  }
}

customElements.define('svg-loader', SvgLoader);
