const axios = require('axios').default;

const API_KEY = '29839584-3a38ab7cf912f63d406c8dc49'
const BASE_URL = 'https://pixabay.com/api/'

export default class ImgApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    };

    async fetchImg() {
        const URL = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&safesearch=true&orientation=horizontal&page=${this.page}&per_page=40`;
        try {
            const response = await axios.get(URL);
            return response;
        }
        catch (error) {
            console.log(error.message);
        };
    };

    incrementPage() {
        this.page += 1;
    };

    resetPage() {
        this.page = 1;
    };

    get query() {
        return this.searchQuery;  
    };

    set query (newQuery) {
        this.searchQuery = newQuery
    };
};