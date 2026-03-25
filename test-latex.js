
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const Blog = mongoose.model('Blog', new mongoose.Schema({
        slug: String,
        content: String,
        title: String,
        published: Boolean
    }));

    const post = await Blog.findOne({ published: true });
    if (post) {
        console.log('Found post:', post.slug);
        const originalContent = post.content;
        const testContent = `
# LaTeX Test Post

Here is the Attention formula:
$$
\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right) V
$$
`;
        post.content = testContent;
        await post.save();
        console.log('Updated post for testing');
    } else {
        console.log('No published posts found');
    }
    await mongoose.disconnect();
}
run();
