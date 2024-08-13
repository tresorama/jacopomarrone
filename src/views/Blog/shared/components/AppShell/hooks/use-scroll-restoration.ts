import { useNextNavigationEvent } from 'use-next-navigation-event';
import { LocalStorage } from "../utils/utils.local-storage";

type PageUrl = string;
type ScrollPosition = { x: number, y: number; };
type PagesScrollPosition = Record<PageUrl, ScrollPosition>;
const _pagesScrollPosition = {
  getStorage: () => new LocalStorage<PagesScrollPosition>('app-shell-pagesScrollPosition'),
  getDomNode: () => window.document.getElementsByClassName('AppShell')[0],
  //
  persistScrollPositionSnapshot: (url: PageUrl) => {
    const node = _pagesScrollPosition.getDomNode();
    if (!node) return;
    const storage = _pagesScrollPosition.getStorage();
    const scrollPosition: ScrollPosition = {
      x: node.scrollLeft,
      y: node.scrollTop,
    };
    storage.save({
      ...storage.retrieve() ?? {},
      [url]: scrollPosition,
    });
  },
  restoreScrollPositionSnapshot: (url: PageUrl) => {
    const storage = _pagesScrollPosition.getStorage();
    const pagesScrollPosition = storage.retrieve();
    if (!pagesScrollPosition) return;
    if (!pagesScrollPosition[url]) return;
    const node = _pagesScrollPosition.getDomNode();
    if (!node) return;
    const { x, y } = pagesScrollPosition[url];
    setTimeout(() => {
      node.scrollTo({ left: x, top: y, behavior: 'auto' });
    }, 50);
  },
  scrollToTop: () => {
    const node = _pagesScrollPosition.getDomNode();
    if (!node) return;
    setTimeout(() => {
      node.scrollTo({ left: 0, top: 0, behavior: 'auto' });
    }, 50);
  },
  //
  forget: () => _pagesScrollPosition.getStorage().delete(),
};

export const useScrollRestoration = () => {
  useNextNavigationEvent({
    onRouteChangeStart: ({ oldUrl }) => {
      _pagesScrollPosition.persistScrollPositionSnapshot(oldUrl);
    },
    onRouteChangeComplete: ({ type, newUrl }) => {
      if (type === 'BACK_OR_FORWARD') {
        _pagesScrollPosition.restoreScrollPositionSnapshot(newUrl);
      }
      if (type === 'REGULAR_NAVIGATION') {
        _pagesScrollPosition.scrollToTop();
      }
    },
    onWindowBeforeUnload: () => _pagesScrollPosition.forget(),
  });
};