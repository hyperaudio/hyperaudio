/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
// https://dev.to/vvo/show-a-top-progress-bar-on-fetch-and-router-events-in-next-js-4df3
import Router from 'next/router';
import NProgress from 'nprogress';
import { listen } from 'quicklink';

window.NProgress = NProgress;

let timer;
let state;
let activeRequests = 0;
const delay = 250;

NProgress.configure({
  showSpinner: false,
});

let quicklink = null;

const load = () => {
  if (state === 'loading') {
    return;
  }

  // if (quicklink) {
  //   quicklink();
  // } else quicklink = listen();

  state = 'loading';

  timer = setTimeout(() => {
    NProgress.start();
  }, delay); // only show progress bar if it takes longer than the delay
};

const stop = () => {
  if (activeRequests > 0) {
    return;
  }

  state = 'stop';

  clearTimeout(timer);

  NProgress.done();
};

Router.events.on('routeChangeStart', load);
Router.events.on('routeChangeComplete', stop);
Router.events.on('routeChangeError', stop);

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  if (activeRequests === 0) {
    load();
  }

  activeRequests++;

  try {
    const response = await originalFetch(...args);
    return response;
  } catch (error) {
    return Promise.reject(error);
  } finally {
    activeRequests -= 1;
    if (activeRequests === 0) {
      stop();
    }
  }
};

const TopProgressBar = () => null;

export default TopProgressBar;
