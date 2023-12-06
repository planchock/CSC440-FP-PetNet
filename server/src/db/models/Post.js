module.exports = class Post {
    id = null;
    content = null;
    caption = null;
    mediaId = null;
    groupId = null;
    petId = null;
    userId = null;

    constructor(data) {
        this.id = data.post_id;
        this.content = data.text;
        this.caption = data.caption;
        this.mediaId = data.media_id;
        this.groupId = data.group_id;
        this.petId = data.pet_id;
        this.userId = data.user_id;
    }

    toJSON() {
        return {
            id: this.id,
            content: this.content,
            caption: this.caption,
            mediaId: this.mediaId,
            groupId: this.groupId,
            petId: this.petId,
            userId: this.userId,
        }
    }
}