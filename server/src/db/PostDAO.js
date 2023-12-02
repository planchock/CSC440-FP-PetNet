const db = require('./database');
const Post = require('./models/Post');
class PostDAO {
    async sendPost(post, userId, media) {
        try {
            if (media != '' && media !== null) {
                const {results: rows} = await db.query(
                    'INSERT INTO media (media_url) VALUES(?)', [media]
                );
                post.media_id = rows.insertId;
            }

            const {results: data} = await db.query(
                'INSERT INTO post SET ?',
                {
                    ...post,
                    user_id: userId,
                }
            );

            return null;
        } catch(err) {
            console.error(err);
            return null;
        }
    }
}


module.exports = PostDAO;