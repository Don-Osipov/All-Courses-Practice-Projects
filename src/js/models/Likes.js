export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(uri, title, author, img) {
        const like = { uri, title, author, img };
        this.likes.push(like);
        return like;
    }

    deleteLike(uri) {
        const index = this.likes.findIndex(element => element.uri === uri);
        this.likes.splice(index, 1);
    }

    isLiked(uri) {
        return this.likes.findIndex(elem => elem.uri === uri) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }
}
