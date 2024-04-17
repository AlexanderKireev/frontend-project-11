import axios from 'axios';
import uniqueId from 'lodash.uniqueid';
import i18next from 'i18next';
import * as yup from 'yup';
import watch from './view.js';
import resources from './locales/index.js';
import parsingUrl from './parser.js';

export default () => {
  const defaultLanguage = 'ru';
  const i18n = i18next.createInstance();
  i18n.init({
    lng: defaultLanguage,
    debug: false,
    resources,
  });

  const elements = {
    form: document.querySelector('form'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
    inputForm: document.querySelector('#url-input'),
    feedbackForm: document.querySelector('.feedback'),
    body: document.querySelector('body'),
    submitButton: document.querySelector('button[type="submit"]'),
    modalWindow: {
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      modalLink: document.querySelector('.full-article'),
    },
  };

  const getProxyUrl = (link) => {
    const url = new URL('https://allorigins.hexlet.app/get?disableCache=true');
    url.searchParams.set('url', link);
    return url.href;
  };

  const state = {
    applicationState: 'initial', // 'changed'
    form: {
      processState: 'filling', // 'sending', 'sendingError'
      errors: [],
    },
    contentData: {
      posts: [],
      feeds: [],
    },
  };

  const watchedState = watch(elements, i18n, state);

  const addNewPosts = (feed) => {
    const addedPostTitles = state.contentData.posts.map((post) => post.title);
    const newPosts = feed.posts.filter((post) => !addedPostTitles.includes(post.title));
    newPosts.forEach((post) => {
      post.id = uniqueId();
      post.feedId = feed.feed.id;
    });
    watchedState.contentData.posts = [...state.contentData.posts, ...newPosts];
  };

  const autoUpdatePage = () => {
    if (state.contentData.feeds.length !== 0) {
      state.contentData.feeds.forEach((feed) => {
        axios.get(getProxyUrl(feed.link)).then((response) => {
          const newFeed = parsingUrl(response.data.contents);
          newFeed.feed.id = feed.id;
          newFeed.feed.link = feed.link;
          addNewPosts(newFeed);
        }).catch((error) => console.log(error));
      });
    }

    setTimeout(() => autoUpdatePage(), 5000);
  };

  const getResponse = (url) => {
    axios.get(getProxyUrl(url)).then((response) => {
      const newFeed = parsingUrl(response.data.contents);
      state.form.errors = [];
      watchedState.form.processState = 'filling';
      if (!elements.ulFeeds) {
        autoUpdatePage();
        elements.ulPosts = document.querySelector('.posts ul');
        elements.ulFeeds = document.querySelector('.feeds ul');
      }
      newFeed.feed.id = uniqueId();
      newFeed.feed.link = url;
      watchedState.contentData.feeds.push(newFeed.feed);
      addNewPosts(newFeed);
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        state.form.errors = [{ key: 'feedback.errors.noConnection' }];
      } else if (error.parsingError) {
        state.form.errors = [{ key: 'feedback.errors.parsingError' }];
      } else {
        state.form.errors = [{ key: 'feedback.errors.unknownError' }];
      }
      watchedState.form.processState = 'sendingError';
    });
  };

  yup.setLocale({
    mixed: {
      required: () => ({ key: 'feedback.errors.required' }),
      notOneOf: () => ({ key: 'feedback.errors.notOneOf' }),
    },
    string: {
      url: () => ({ key: 'feedback.errors.notUrl' }),
    },
  });

  const getValidation = (newUrl) => {
    const addedFeedsUrls = state.contentData.feeds.map((feed) => feed.link);
    const schema = yup.string().required().url().notOneOf(addedFeedsUrls);

    schema.validate(newUrl, { abortEarly: false }).then((url) => {
      getResponse(url);
    }).catch((error) => {
      state.form.errors = error.errors || [{ key: 'feedback.errors.unknownError' }];
      watchedState.form.processState = 'sendingError';
    });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    watchedState.form.processState = 'sending';
    const formData = new FormData(event.target);
    const newUrl = formData.get('url');

    getValidation(newUrl);
  });
};
