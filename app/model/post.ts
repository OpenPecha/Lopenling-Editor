// create post

import { db } from "~/db.server";
import { getposts } from "~/services/discourseApi";
import { findReplyByPostId } from "./reply";

export async function createPostOnDB(
  id: string,
  type: string,
  avatar: string,
  topic_id: number,
  post_id: number,
  start: number,
  end: number,
  text_id: number,
  content: string,
  creatorUser_id: string
) {
  try {
    let createdPost = await db.post.create({
      data: {
        id,
        type,
        avatar,
        topic_id,
        post_id,
        start,
        end,
        text_id,
        content,
        creatorUser_id,
      },
    });
    console.log(createdPost);
    return createdPost;
  } catch (e) {
    throw new Error("post couldnot be created " + e);
  }
}

//find post
export async function findPostByTopicId(TopicId: number) {
  try {
    let posts = await db.post.findFirst({
      where: {
        topic_id: TopicId,
      },
    });
    return posts;
  } catch (e) {
    return "couldnot find the by TopicId" + e.message;
  }
}
export async function findPostByTextId(textId: number, domain = "") {
  let posts = await db.post.findMany({
    include: {
      creatorUser: true,
      likedBy: true,
    },
    where: {
      text_id: textId,
    },
  });
  let postWithReply = posts.map(async (post) => {
    let [replies, repliesFromDb] = await Promise.all([
      getposts(post?.topic_id),
      findReplyByPostId(post.id),
    ]);
    let isSolved = repliesFromDb.filter((l) => l.isAproved === true).length > 0;
    let postsResponse = replies?.post_stream?.posts;
    if (!postsResponse) return { ...post, isAvailable: false };
    return {
      ...post,
      replyCount: postsResponse?.length,
      isAvailable: true,
      isSolved: isSolved,
    };
  });
  let post = await Promise.allSettled(postWithReply);
  let filtered = post.filter((p) => p.status === "fulfilled");
  return filtered.map((v) => ({ ...v.value }));
}

export async function findPostByUserLiked(id: string, userId: string) {
  try {
    let f = await db.post.findFirst({
      where: {
        id: id,
        likedBy: {
          some: {
            id: userId,
          },
        },
      },
    });
    return f;
  } catch (e) {
    throw new Error("could not find post by userliked" + e.message);
  }
}
//update post

export async function updatePostLike(
  id: string,
  userId: string,
  payload: boolean
) {
  try {
    let response = await db.post.update({
      data: {
        likedBy: payload
          ? {
              connect: {
                id: userId,
              },
            }
          : {
              disconnect: {
                id: userId,
              },
            },
      },
      where: {
        id: id,
      },
      select: {
        likedBy: true,
      },
    });
    return response;
  } catch (e) {
    throw new Error("update post like error: " + e.message);
  }
}
