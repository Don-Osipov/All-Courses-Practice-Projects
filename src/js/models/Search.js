import axios from 'axios';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResults() {
    const key = 'a1e358e27b3a24a19de20f27dbd42ddf';
    const ID = 'fe6a49e8';
    try {
      const res = await axios(
        `https://api.edamam.com/search?q=${this.query}&to=50&app_id=${ID}&app_key=${key}`
      ); // ? Automatically returns JSON and is more supported than 'fetch'
      this.result = res.data.hits;
      console.log(this.result);
    } catch (error) {
      // eslint-disable-next-line no-undef
      alert(error);
    }
  }
}
