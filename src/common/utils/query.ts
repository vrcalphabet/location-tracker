export function query<T extends Element = HTMLElement>(
  selector: string,
  target?: ParentNode | Element,
): T {
  const elem = (target ?? document).querySelector<T>(selector)!;
  if (!elem) {
    throw new Error("Element not found");
  }
  
  return elem;
}

export type QueryElemType = {
  [key: string]: string | QueryElemType;
};

export type QueryElemResolve<T> = {
  [K in keyof T]: T[K] extends string ? HTMLElement : QueryElemResolve<T[K]>;
};

export function queryElem<T extends QueryElemType>(
  target: HTMLElement,
  elem: T,
): QueryElemResolve<T> {
  const result: any = {};

  for (const key in elem) {
    const value = elem[key];

    if (typeof value === 'string') {
      result[key] = target.querySelector<HTMLElement>(value)!;
    } else {
      result[key] = queryElem(target, value);
    }
  }

  return result as QueryElemResolve<T>;
}
