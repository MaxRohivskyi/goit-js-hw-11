import ImgApiService from "./js/api-pixabay";
import refs from "./js/get-refs";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from "lodash.throttle";

const {searchForm, gallery } = refs;

const gallerySimpleLightbox = new SimpleLightbox('.gallery a', {
    scrollZoom: true,
    captions: true,
    captionsData: "alt",
    captionPosition: "bottom",
    captionDelay: 250,
});
 
searchForm.addEventListener('submit', onSearch);

const apiService = new ImgApiService();

function onSearch(e) {
    e.preventDefault();
    
    if (this.searchQuery.value === '') {
        return Notify.failure('Please fill in the input field!');
    };
     
    apiService.query = e.currentTarget.elements.searchQuery.value;
    apiService.resetPage();
    clearPageAfterNewSearchTitle();
    apiService.fetchImg().then(renderImageCard);
    apiService.fetchImg().then(totalHitsNotification);
};

function totalHitsNotification(response) {
    if (response.data.totalHits === 0) {
        return
    };
    
    Notify.info(`Hooray! We found ${response.data.totalHits} images.`);
};

function onLoadMore() {
    apiService.incrementPage();
    apiService.fetchImg().then(renderImageCard);
    gallerySimpleLightbox.refresh();
};

function renderImageCard(response) {
    if (response === undefined) {
        return
    };
    
    if (response.data.totalHits === 0) {
        
        Notify.failure(`Sorry, there are no images matching your search query. Please try again.`);
        
        return
    };
    
    const apiResponse = response.data.hits;
    const imgCard = apiResponse.map(
        ({
            largeImageURL,
            webformatURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        }) => {
            return `
            <div class="photo-card">
                <a  href="${largeImageURL}"><img class="photo-url" src="${webformatURL}" alt="${tags}" loading="lazy"/></a>
                <div class="info">
                    <p class="info-item">
                        <b>Likes:</b>
                        <span>${likes}</span> 
                    </p>
                    <p class="info-item">
                        <b>Views:</b>
                        <span>${views}</span> 
                    </p>
                    <p class="info-item">
                        <b>Comments:</b>
                        <span>${comments}</span>
                    </p>
                    <p class="info-item">
                        <b>Downloads:</b>
                        <span>${downloads}</span>
                    </p>
                </div>
            </div>
            `;
        }).join('');
    
    gallery.insertAdjacentHTML('beforeend', imgCard);
    gallerySimpleLightbox.refresh();
};

function clearPageAfterNewSearchTitle() {
    gallery.innerHTML = '';
};

window.addEventListener('scroll', throttle(infinityScroll, 250));

function infinityScroll() {
    const documentRect = document.documentElement.getBoundingClientRect()
    
    if (documentRect.bottom < document.documentElement.clientHeight + 1000) {
        onLoadMore();
    };
    
    if (window.innerHeight === Math.round(documentRect.bottom)) {
        Notify.failure(`We're sorry, but you've reached the end of search results.`);
    };
};