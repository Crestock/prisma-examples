import { intArg, queryType, stringArg } from '@nexus/schema'
import { getUserId } from '../utils'
import { prismaVersion } from '@prisma/client'
import { createLexer } from 'graphql'

export const Query = queryType({
  definition(t) {
    t.field('me', {
      type: 'User',
      nullable: true,
      resolve: (parent, args, ctx) => {
        const userId = getUserId(ctx)
        return ctx.prisma.user.findOne({
          where: {
            id: Number(userId),
          },
        })
      },
    })
    t.list.field('allUsers', {
      type: 'User',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.user.findMany()
      },
    })

    t.list.field('feed', {
      type: 'Post',
      resolve: (parent, args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              {
                title: {
                  contains: searchString,
                },
              },
              {
                content: {
                  contains: searchString,
                },
              },
            ],
          },
        })
      },
    })

    t.field('post', {
      type: 'Post',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.post.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })

    /// NEW RESOLVERS TO STAY

    t.list.field('filterMaterials', {
      type: 'Material',
      args: {
        searchString: stringArg({ nullable: true }),
      },
      resolve: (parent, { searchString }, ctx) => {
        return ctx.prisma.material.findMany({
          where: {
            name: {
              contains: searchString,
            },
          },
        })
      },
    })

    t.field('material', {
      type: 'Material',
      nullable: true,
      args: { id: intArg() },
      resolve: (parent, { id }, ctx) => {
        return ctx.prisma.material.findOne({
          where: {
            id: Number(id),
          },
        })
      },
    })
  },
})
