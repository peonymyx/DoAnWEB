import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { User as UserModel, Post as PostModel } from '@prisma/client';

@Controller()
export class AppController {
    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService,
    ) { }

    @Get('post/:id')
    async getPostById(@Param('id') id: string): Promise<PostModel> {
        return this.postService.post({ id: Number(id) });
    }

    @Get('filtered-posts/:searchString')
    async getFilteredPostsByString(
        @Param('searchString') searchString: string,
    ): Promise<PostModel[]> {
        return this.postService.posts({
            where: {
                OR: [
                    {
                        title: { contains: searchString },
                    },
                    {
                        content: { contains: searchString },
                    },
                ],
            },
        });
    }

    @Post('post')
    async newPost(
        @Body() postData: { title: string; categoryId: number; content: string; format: string },
    ): Promise<PostModel> {
        const { title, categoryId, content, format } = postData;
        return this.postService.createPost({
            title,
            categoryPost: {
                connect: { id: categoryId },
            },
            content,
            format,
        });
    }

    @Post('user')
    async signupUser(
        @Body() userData: { email: string; name: string; phone: string; password: string },
    ): Promise<UserModel> {
        return this.userService.createUser(userData);
    }

    @Put('post/:id')
    async updatePost(
        @Param('id') id: string,
        @Param('newContent') newContent: string, 
    ): Promise<PostModel> {
        return this.postService.updatePost({
            where: { id: Number(id) },
            data: { content: newContent },
        })
    }

    @Delete('post/:id')
    async deletePost(@Param('id') id: string): Promise<PostModel> {
        return this.postService.deletePost({ id: Number(id) });
    }
}
