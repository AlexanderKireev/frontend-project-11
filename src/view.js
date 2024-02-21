// import '../vendor/bootstrap/bootstrap.min.css';
import onChange from 'on-change';

const renderContentElements = (elements, i18n, state) => {
  Object.keys(state.contentData).forEach((contentName) => {
    const element = elements[contentName];
    const div = document.createElement('div');
    div.classList.add('card', 'border-0');
    element.append(div);

    const divTitle = document.createElement('div');
    divTitle.classList.add('card-body');
    div.append(divTitle);

    const headingEl = document.createElement('h2');
    headingEl.classList.add('card-title', 'h4');
    headingEl.textContent = i18n.t(`elements_names.${contentName}`);
    divTitle.append(headingEl);

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'border-0', 'rounded-0');
    div.append(ul);
  });
};

const getContentElements = (elements) => {
  elements.ulPosts = document.querySelector('.posts ul');
  elements.ulFeeds = document.querySelector('.feeds ul');
};

const renderFeeds = (elements, value, listId) => {
  value.forEach((feed) => {
    if (!listId.includes(feed.id)) {
      const ulEl = elements.ulFeeds;
      const liEl = document.createElement('li');
      ulEl.prepend(liEl);
      liEl.classList.add('list-group-item', 'border-0', 'border-end-0');
      const headingEl = document.createElement('h3');
      headingEl.classList.add('h6', 'm-0');
      liEl.append(headingEl);
      headingEl.textContent = feed.title;
      const pEl = document.createElement('p');
      pEl.classList.add('m-0', 'small', 'text-black-50');
      pEl.textContent = feed.description;
      liEl.append(pEl);
    }
  });
};

const renderPosts = (elements, value, listId, i18n) => {
  value.forEach((post) => {
    if (!listId.includes(post.id)) {
      const ulEl = elements.ulPosts;
      const liEl = document.createElement('li');
      ulEl.prepend(liEl);
      liEl.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
      const aEl = document.createElement('a');
      liEl.append(aEl);
      aEl.href = post.link;
      aEl.classList.add('fw-bold');
      aEl.dataset.id = post.id;
      aEl.textContent = post.title;
      aEl.target = '_blank';
      aEl.rel = 'noopener noreferrer';

      const button = document.createElement('button');
      liEl.append(button);
      button.type = 'button';
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
      button.textContent = i18n.t('elements_names.view');
      button.dataset.id = post.id;
      button.dataset.bsToggle = 'modal';
      button.dataset.bsTarget = '#modal';

      aEl.addEventListener('click', () => {
        aEl.classList.remove('fw-bold');
        aEl.classList.add('fw-normal', 'link-secondary');
      });

      button.addEventListener('click', () => {
        aEl.classList.remove('fw-bold');
        aEl.classList.add('fw-normal', 'link-secondary');
      });
    }
  });
};

const renderErrors = (elements, i18n, value) => {
  const { form, inputForm, feedbackForm } = elements;
  if (value.length === 0) {
    feedbackForm.textContent = i18n.t('feedback.success');
    feedbackForm.classList.remove('text-danger');
    feedbackForm.classList.add('text-success');
    inputForm.classList.remove('is-invalid');
    form.reset();
    inputForm.focus();
  } else {
    feedbackForm.classList.remove('text-success');
    feedbackForm.classList.add('text-danger');
    inputForm.classList.add('is-invalid');
    value.forEach((error) => {
      feedbackForm.textContent = i18n.t(error.key);
    });
  }
};

const getListId = (prev) => prev.map((item) => item.id);

export default (elements, i18n, state) => {
  const watchedState = onChange(state, (path, value, prev) => {
    // console.log(path);
    switch (path) {
      case 'clearContentPage':
        renderContentElements(elements, i18n, state);
        getContentElements(elements);
        break;
      case 'contentData.feeds':
        renderFeeds(elements, value, getListId(prev));
        break;
      case 'contentData.posts':
        renderPosts(elements, value, getListId(prev), i18n);
        break;
      case 'form.errors':
        renderErrors(elements, i18n, value);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
