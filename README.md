# 📌 Bookmark App

A full-stack Bookmark Management Application built using:

- Next.js (App Router)
- Supabase (Database + Authentication)
- Google OAuth
- Tailwind CSS
- Vercel (Deployment)

---

## 🚀 Live Demo

Deployed on Vercel:
👉 https://your-vercel-link.vercel.app

---

## 🧠 Project Overview

This application allows users to:

- Sign in with Google
- Create bookmarks
- Edit bookmarks
- Delete bookmarks
- View only their own bookmarks
- See updates instantly in the UI

---

## 🏗 Tech Stack

Frontend:
- Next.js 14 (App Router)
- Tailwind CSS

Backend:
- Supabase (PostgreSQL)
- Supabase Auth (Google OAuth)
- Supabase Realtime

Deployment:
- Vercel

---

## 🔐 Authentication & Privacy

- Authentication is handled using Supabase Google OAuth.
- Each bookmark is linked to a specific `user_id`.
- Row Level Security (RLS) policies ensure:
  - Users can only view their own bookmarks.
  - Users can only insert/update/delete their own records.
- Environment variables are securely stored in Vercel.

---

## ⚡ Real-time Updates

Real-time updates are implemented using Supabase Realtime subscriptions.

The application listens for:
- INSERT
- UPDATE
- DELETE

events and updates the UI instantly without requiring a page refresh.

---

## 📁 Folder Structure

