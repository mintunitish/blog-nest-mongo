import { Controller, Get, Res, HttpStatus, Param, NotFoundException, Post, Body, Query, Put, Delete } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ValidateObjectId } from './shared/pipes/validate-object-id.pipes';

@Controller('blog')
export class BlogController {
    constructor(private blogService: BlogService) {}

    @Get('posts')
    async getPosts(@Res() res) {
        const posts = await this.blogService.getPosts();
        return posts;
    }

    @Get('post/:postID')
    async getPost(@Res() res, @Param('postID', new ValidateObjectId()) postID) {
        const post = await this.blogService.getPost(postID);
        if (!post) {
            throw new NotFoundException('Post does not exist!');
        }
        return res.status(HttpStatus.OK).json(post);
    }

    @Post('/post')
    async addPost(@Res() res, @Body() createPostDTO: CreatePostDto) {
        const newPost = await this.blogService.addPost(createPostDTO);
        return res.status(HttpStatus.OK).json({
            message: 'Post has been submitted successfully!',
            post: newPost,
        });
    }

    @Put('/edit')
    async editPost(@Res() res, @Query('postId', new ValidateObjectId()) postId, @Body() createPostDto: CreatePostDto) {
        const editedPost = await this.blogService.editPost(postId, createPostDto);
        if (!editedPost) {
            throw new NotFoundException('Post Does Not Exists!');
        }

        return res.status(HttpStatus.OK).json({
            message: 'Post Edited Successfully!',
            post: editedPost,
        });
    }

    @Delete('/delete')
    async deletePost(@Res() res, @Query('postId', new ValidateObjectId()) postId) {
        const deletedPost = await this.blogService.deletePost(postId);
        if (!deletedPost) {
            throw new NotFoundException('Post Does Not Exists!');
        }
        return res.status(HttpStatus.OK).json({
            message: 'Post has been deleted successfully!',
            post: deletedPost,
        });
    }
}
