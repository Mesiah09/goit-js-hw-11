const axios = require('axios').default;

const KEY = '27155167-60085c6995a1a3a14bfd0e86b';
const BASE_URL = 'https://pixabay.com/api';
const PER_PAGE = 40;

async function fetchImg(name, page) {
  try {
    const response = await axios.get(
      `${BASE_URL}/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`,
    );

    return response;
  } catch (error) {
    console.error(error);
  }
}

export { fetchImg, PER_PAGE };
