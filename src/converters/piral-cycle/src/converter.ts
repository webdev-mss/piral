import type { BaseComponentProps, ForeignComponent } from 'piral-core';
import { makeDOMDriver } from '@cycle/dom';
import run, { MatchingMain, Main } from '@cycle/run';
import xs from 'xstream';
import { createExtension } from './extension';
import type { PiralDomDrivers } from './types';

export interface CycleConverterOptions {
  /**
   * The tag name of the root element into which a CycleExtension is rendered.
   * @default slot
   */
  rootName?: string;
}

export function createConverter(config: CycleConverterOptions = {}) {
  const { rootName = 'slot' } = config;
  const Extension = createExtension(rootName);
  const convert = <TProps extends BaseComponentProps, M extends MatchingMain<PiralDomDrivers<TProps>, M>>(
    main: M,
  ): ForeignComponent<TProps> => {
    let props$ = xs.create<TProps>();
    let dispose = () => {};

    return {
      mount(el, props) {
        // The Cycle DOM element is not directly rendered into parent, but into a nested container.
        // This is done because Cycle "erases" information on the host element. If parent was used,
        // Piral related properties like data-portal-id could be removed, leading to things not working.
        const host = el.appendChild(document.createElement('slot'));

        const drivers: PiralDomDrivers<TProps> = {
          DOM: makeDOMDriver(host),
          props: () => props$,
        };

        dispose = run(main as Main, drivers);
        props$.shamefullySendNext(props);
      },
      update(_, props) {
        props$.shamefullySendNext(props);
      },
      unmount() {
        props$.shamefullySendComplete();
        dispose();
        props$ = xs.create<TProps>();
      },
    };
  };

  convert.Extension = Extension;
  return convert;
}
