import Router from 'next/router';
import NProgress from 'nprogress';

let timer: ReturnType<typeof setTimeout>;
let state: string;
let activeRequests: number = 0;
const delay: number = 250;

const load = () => {
  if (state === 'loading') return;

  state = 'loading';

  timer = setTimeout(() => NProgress.start(), delay);
};

const stop = () => {
  if (activeRequests > 0) return;

  state = 'stop';

  clearTimeout(timer);
  NProgress.done();
};

Router.events.on('routerChangeStart', load);
Router.events.on('routerChangeComplete', stop);
Router.events.on('routerChangeError', stop);

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  if (activeRequests === 0) load();

  activeRequests += 1;

  try {
    const res = await originalFetch(...args);
    return res;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    activeRequests -= 1;

    if (activeRequests === 0) stop();
  }
};

const TopProgressBar = () => {
  return null;
};

export default TopProgressBar;
