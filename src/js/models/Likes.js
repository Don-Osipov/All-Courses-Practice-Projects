export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(uri, title, author, img) {
        const like = { uri, title, author, img };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(uri) {
        const index = this.likes.findIndex(element => element.uri === uri);
        this.likes.splice(index, 1);

        // Persist data in localStorage
        this.persistData();
    }

    isLiked(uri) {
        return this.likes.findIndex(elem => elem.uri === uri) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restore likes from local storage
        if (storage) this.likes = storage;
    }
}
