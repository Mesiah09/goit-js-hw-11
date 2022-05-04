import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { fetchImg, PER_PAGE } from './js/fetch';
import { formRef, galleryRef, btnLoadMore } from './js/refs';
import { markupCard } from './js/markup';

formRef.addEventListener('submit', onSearchForm);
btnLoadMore.addEventListener('click', onLoadMoreImg);

let numOfPage = 1;
let searchValue = '';

async function onSearchForm(e) {
  e.preventDefault();
  resetPages();
  resetRender();

  searchValue = e.target.elements.searchQuery.value.trim();

  if (!searchValue) {
    onHideBtn();
    formRef.reset();
    return;
  }

  fetchImg(searchValue, numOfPage).then(({ data }) => {
    const markup = markupCard(data.hits);

    if (markup.length === 0) {
      onHideBtn();
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    }

    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images. `);
    onShowBtn();

    renderMarkup(markup);
    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
    if (numOfPage * PER_PAGE >= data.totalHits) {
      onHideBtn();
      return;
    }
  });

  formRef.reset();
}

function renderMarkup(str = '') {
  galleryRef.insertAdjacentHTML('beforeend', str);
}

function onLoadMoreImg(e) {
  numOfPage += 1;
  fetchImg(searchValue, numOfPage).then(({ data }) => {
    if (numOfPage * PER_PAGE >= data.totalHits) {
      onHideBtn();
      Notiflix.Notify.warning(`We're sorry, but you've reached the end of search results.`);
    }
    const markup = markupCard(data.hits);

    renderMarkup(markup);

    let lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });

    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  });
}

function resetPages() {
  numOfPage = 1;
}

function resetRender() {
  galleryRef.innerHTML = '';
}

function onShowBtn() {
  btnLoadMore.classList.remove('visually-hidden');
}

function onHideBtn() {
  btnLoadMore.classList.add('visually-hidden');
}