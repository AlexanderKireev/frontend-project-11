const convertDOMtoContetntData = (parsedDOM) => {
  const feed = {
    title: parsedDOM.querySelector('title').textContent,
    description: parsedDOM.querySelector('description').textContent,
  };

  const itemElements = parsedDOM.querySelectorAll('item');
  const items = Array.from(itemElements).reverse();
  const posts = items.map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      link: item.querySelector('link').textContent,
      description: item.querySelector('description').textContent,
    };
    return post;
  });
  return { feed, posts };
};

const parsingUrl = (xmlString) => {
  const parser = new DOMParser();
  const parsedDOM = parser.parseFromString(xmlString, 'application/xml');
  const errorNode = parsedDOM.querySelector('parsererror');
  if (errorNode) {
    const error = new Error(errorNode);
    error.parsingError = true;
    throw error;
  }
  return convertDOMtoContetntData(parsedDOM);
};

export default parsingUrl;
