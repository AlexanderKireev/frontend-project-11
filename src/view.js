import onChange from 'on-change';

const createNewElement = (name, classNames, textContent, attributes = {}) => {
  const newElement = document.createElement(name);
  newElement.classList.add(...classNames);
  newElement.textContent = textContent;
  Object.keys(attributes).forEach((key) => newElement.setAttribute(key, attributes[key]));
  return newElement;
};

const renderContentElements = (elements, i18n, { contentData }) => {
  if (elements.ulFeeds) { return; }

  Object.keys(contentData).forEach((contentName) => {
    const newHeadingElement = createNewElement('h2', ['card-title', 'h4'], i18n.t(`elements_names.${contentName}`));
    const newParentDivElement = createNewElement('div', ['card', 'border-0'], null);
    const newChildDivElement = createNewElement('div', ['card-body'], null);
    const newUlElement = createNewElement('ul', ['list-group', 'border-0', 'rounded-0'], null);

    newChildDivElement.append(newHeadingElement);
    newParentDivElement.append(...[newChildDivElement, newUlElement]);
    elements[contentName].append(newParentDivElement);
  });
};

const renderFeeds = ({ ulFeeds }, feeds, listId) => {
  feeds.forEach(({ id, title, description }) => {
    if (!listId.includes(id)) {
      const newHeadingElement = createNewElement('h3', ['h6', 'm-0'], title);
      const newPElement = createNewElement('p', ['m-0', 'small', 'text-black-50'], description);
      const newLiElement = createNewElement('li', ['list-group-item', 'border-0', 'border-end-0'], null);

      newLiElement.append(...[newHeadingElement, newPElement]);
      ulFeeds.prepend(newLiElement);
    }
  });
};

const addLinkHandler = (element) => {
  element.addEventListener('click', () => {
    element.classList.remove('fw-bold');
    element.classList.add('fw-normal', 'link-secondary');
  });
};

const addModalButtonHandler = (button, element, modalWindow, { title, link, description }) => {
  const { modalTitle, modalBody, modalLink } = modalWindow;
  button.addEventListener('click', () => {
    button.blur();
    element.classList.remove('fw-bold');
    element.classList.add('fw-normal', 'link-secondary');
    modalTitle.textContent = title;
    modalBody.textContent = description;
    modalLink.href = link;
  });
};

const renderPosts = ({ ulPosts, modalWindow }, posts, listId, i18n) => {
  posts.forEach((post) => {
    const { id, title, link } = post;
    if (!listId.includes(id)) {
      const newLiElement = createNewElement('li', [
        'list-group-item', 'd-flex', 'justify-content-between',
        'align-items-start', 'border-0', 'border-end-0',
      ], null);

      const newAElement = createNewElement('a', ['fw-bold'], title, {
        href: link, 'data-id': id, target: '_blank', rel: 'noopener noreferrer',
      });

      const newButtonElement = createNewElement('button', [
        'btn', 'btn-outline-primary', 'btn-sm',
      ], i18n.t('elements_names.view'), {
        type: 'button', 'data-id': id, 'data-bs-toggle': 'modal', 'data-bs-target': '#modal',
      });
      newLiElement.append(...[newAElement, newButtonElement]);
      ulPosts.prepend(newLiElement);
      addLinkHandler(newAElement);
      addModalButtonHandler(newButtonElement, newAElement, modalWindow, post);
    }
  });
};

const clearFeedbackForm = ({ inputForm, feedbackForm }) => {
  feedbackForm.textContent = '';
  inputForm.classList.remove('is-invalid');
};

const renderFeedbackError = ({ inputForm, feedbackForm }, i18n, { form: { errors } }) => {
  feedbackForm.classList.remove('text-success');
  feedbackForm.classList.add('text-danger');
  inputForm.classList.add('is-invalid');
  errors.forEach((error) => {
    feedbackForm.textContent = i18n.t(error.key);
  });
};

const renderSuccessFeedback = (elements, i18n) => {
  const { form, inputForm, feedbackForm } = elements;
  feedbackForm.textContent = i18n.t('feedback.success');
  feedbackForm.classList.remove('text-danger');
  feedbackForm.classList.add('text-success');
  inputForm.classList.remove('is-invalid');
  form.reset();
  inputForm.focus();
};

const getListId = (prevValue) => prevValue.map((item) => item.id);

const handleProcessState = (elements, processState, i18n, state) => {
  switch (processState) {
    case 'filling':
      elements.submitButton.disabled = false;
      renderSuccessFeedback(elements, i18n);
      renderContentElements(elements, i18n, state);
      break;
    case 'sending':
      elements.submitButton.disabled = true;
      clearFeedbackForm(elements);
      break;
    case 'sendingError':
      elements.submitButton.disabled = false;
      renderFeedbackError(elements, i18n, state);
      break;
    default:
      throw new Error(`Unknown process state: ${processState}`);
  }
};

export default (elements, i18n, state) => {
  const watchedState = onChange(state, (path, value, prevValue) => {
    switch (path) {
      case 'form.processState':
        handleProcessState(elements, value, i18n, state);
        break;
      case 'contentData.feeds':
        renderFeeds(elements, value, getListId(prevValue), i18n, state);
        break;
      case 'contentData.posts':
        renderPosts(elements, value, getListId(prevValue), i18n);
        break;
      default:
        break;
    }
  });

  return watchedState;
};
