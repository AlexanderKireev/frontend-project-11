import axios from 'axios';
import uniqueId from 'lodash.uniqueid';
import i18next from 'i18next';
import * as yup from 'yup';
import watch from './view.js';
import resources from './locales/index.js';

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
    modal: document.querySelector('#modal'),
    body: document.querySelector('body'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
    // ulPosts = document.querySelector('.posts ul');
    // ulFeeds = document.querySelector('.feeds ul');
    // fields: {},
    // errorFields: {},
  };

  const getProxyUrl = (link) => {
    const url = new URL('https://allorigins.hexlet.app/get?disableCache=true');
    url.searchParams.set('url', link);
    return url.href;
  };

  const state = {
    clearContentPage: true,
    form: {
      // status: null,
      // valid: false,
      errors: null,
    },
    contentData: {
      posts: [],
      // {
      //   id: '',
      //   feedId: '',
      //   title: '',
      //   link: '',
      //   description: '',
      // },
      // ],
      feeds: [],
      // {
      //   id: '',
      //   title: '',
      //   description: '',
      //   link: '',
      // },
      // ],
    },
  };

  const watchedState = watch(elements, i18n, state);

  const convertDOMtoContetntData = (parsedDOM, link) => {
    const feed = {
      id: uniqueId(),
      title: parsedDOM.querySelector('title').textContent,
      link,
      description: parsedDOM.querySelector('description').textContent,
    };

    const itemElements = parsedDOM.querySelectorAll('item');
    const items = Array.from(itemElements).reverse();
    const posts = items.map((item) => {
      const post = {
        id: uniqueId(),
        feedId: feed.id,
        title: item.querySelector('title').textContent,
        link: item.querySelector('link').textContent,
        description: item.querySelector('description').textContent,
      };
      return post;
    });
    const re = { feed, posts };
    // console.log(re);
    return re;
  };

  const parsingUrl = (xmlString, feedUrl) => {
    const parser = new DOMParser();
    const parsedDOM = parser.parseFromString(xmlString, 'application/xml');
    const errorNode = parsedDOM.querySelector('parsererror');
    if (errorNode) {
      const error = new Error(errorNode);
      error.parsingError = true;
      throw error;
    }
    return convertDOMtoContetntData(parsedDOM, feedUrl);
  };

  const getResponse = (url) => {
    axios.get(getProxyUrl(url)).then((response) => {
      // state.resp = response.data.contents;
      // console.log(state.resp);
      const newFeed = parsingUrl(response.data.contents, url);
      // console.log(obj.posts);
      if (state.clearContentPage) {
        watchedState.clearContentPage = false;
        // elements.ulPosts = document.querySelector('.posts ul');
        // elements.ulFeeds = document.querySelector('.feeds ul');
        // console.log(elements);
      }
      // watchedState.form.valid = true;
      // state.form.valid = false;
      watchedState.form.errors = [];
      watchedState.contentData.feeds.push(newFeed.feed);
      // const updatedPosts = [...state.contentData.posts, ...obj.posts];
      // // console.log(updatePosts);
      watchedState.contentData.posts = [...state.contentData.posts, ...newFeed.posts];
      // console.log(elements);
      // console.log(state);
    }).catch((error) => {
      if (axios.isAxiosError(error)) {
        watchedState.form.errors = [{ key: 'feedback.errors.noConnection' }];
      } else if (error.parsingError) {
        // console.log('fff');
        watchedState.form.errors = [{ key: 'feedback.errors.parsingError' }];
      } else {
        watchedState.form.errors = [{ key: 'feedback.errors.unknownError' }];
      }
      // watchedState.form.errors = ;
      // console.log(err);
      // console.log(axios.isAxiosError(err));
    });
  };

  // console.log(state.resp);

  // const x = doc1.querySelector('warning');
  // console.log(x.textContent);

  //   console.log(r.then(console.log));

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
      // watchedState.addedFeedsUrls.unshift(url);
      // console.log(url);
    }).catch((error) => {
    // console.log(error.inner);
    // console.log(error.errors);
      watchedState.form.errors = error.errors || [{ key: 'feedback.errors.unknownError' }];
      // console.log(state.form.errors);
      // const validationErrors = error.errors.map((err) => {
      //   return err;

      // }
      // );
      // console.log(validationErrors);
      // const validationErrors = error.inner.reduce((acc, cur) => {
      //   const { path, message } = cur;
      //   const errorData = acc[path] || [];
      //   return { ...acc, [path]: [...errorData, message] };
      // }, {});
      // console.log(validationErrors);
      // watchedState.form.errors = validationErrors;

      // // const errors = {};
    });
  };

  // const upd = () => {
  //   axios.get(getProxyUrl('https://lorem-rss.hexlet.app/feed')).then((response) => {
  //     console.log(response);
  //   });

  //   setTimeout(() => upd(), 3000);

  //   //  upd();
  // };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newUrl = formData.get('url');

    getValidation(newUrl);
    // upd();
    // console.log(state);

    // watchedState.form.errors = [];
    // watchedState.form.valid = true;
  // } catch (err) {
  //   console.log('errrr');
  //   console.log(err);
    // const validationErrors = err.inner.reduce((acc, cur) => {
    //   const { path, message } = cur;
    //   const errorData = acc[path] || [];
    //   return { ...acc, [path]: [...errorData, message] };
    // }, {});
  // }
  //   watchedState.form.errors = validationErrors;
  // }
  });
};
