// stores/posts.js
import { defineStore } from 'pinia'
import * as api from '../api'

export const usePostsStore = defineStore('posts', {
  state: () => ({
    posts: [],
    post: null,
    isLoading: true,
    currentPage: 1,
    numberOfPages: 1,
  }),

  actions: {
    async getPosts(page = 1) {
      this.isLoading = true
      try {
        const {
          data: { data, currentPage, numberOfPages },
        } = await api.fetchPosts(page)
        this.posts = data
        this.currentPage = currentPage
        this.numberOfPages = numberOfPages
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async getPost(id) {
      this.isLoading = true
      try {
        const { data } = await api.fetchPost(id)
        this.post = data
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async getPostsBySearch(searchQuery) {
      this.isLoading = true
      try {
        const {
          data: { data },
        } = await api.fetchPostsBySearch(searchQuery)
        this.posts = data
      } catch (err) {
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async createPost(post, router) {
      this.isLoading = true
      try {
        const { data } = await api.createPost(post)
        this.posts.push(data)
        router.push('/posts')
      } catch (err) {
        console.error(err.message)
      } finally {
        this.isLoading = false
      }
    },

    async updatePost(id, post) {
      try {
        const { data } = await api.updatePost(id, post)
        this.posts = this.posts.map((p) => (p._id === data._id ? data : p))
      } catch (err) {
        console.error(err)
      }
    },

    async likePost(id) {
      try {
        const { data } = await api.likePost(id)
        this.posts = this.posts.map((p) => (p._id === data._id ? data : p))
      } catch (err) {
        console.error(err)
      }
    },

    async deletePost(id) {
      this.isLoading = true
      try {
        await api.deletePost(id)
        this.posts = this.posts.filter((p) => p._id !== id)
      } catch (err) {
        console.error(err.message)
      } finally {
        this.isLoading = false
      }
    },

    async commentPost(value, id) {
      try {
        const { data } = await api.comment(value, id)
        this.posts = this.posts.map((p) => (p._id === data._id ? data : p))
        return data.comments
      } catch (err) {
        console.error(err.message)
      }
    },

    async getOwnPosts(username, router) {
      try {
        const { data } = await api.getOwnPosts(username)
        this.posts = data
        return data
      } catch (err) {
        console.log(err)
        router.push('/not-found')
      }
    },

    async getLikedPosts(username, router) {
      try {
        const { data } = await api.getLikedPosts(username)
        this.posts = data
        return data
      } catch (err) {
        console.log(err)
        router.push('/not-found')
      }
    },
  },
})
