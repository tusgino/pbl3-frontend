// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        register: resolve(__dirname, 'register.html'),
        courses: resolve(__dirname, 'course.html'),
        detail: resolve(__dirname, 'course/detail.html'),
        system: resolve(__dirname, 'admin/system.html'),
        profile: resolve(__dirname, 'profile.html'),
        checkout: resolve(__dirname, 'course/checkout.html'),
        lesson: resolve(__dirname, 'lesson/index.html'),
        profileExpert: resolve(__dirname, 'expert/index.html'),
        detailCourseExpert: resolve(__dirname, 'expert/detail.html'),
      },
    },
  },
})
