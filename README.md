# 📸 Event Photo Gallery

A modern, real-time photo sharing application built with React, Convex, and Convex Auth. Users can create events, upload photos, and engage with others through comments.

![Built with Convex](https://img.shields.io/badge/Built%20with-Convex-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-blue)

## ✨ Features

### 🔐 Authentication

- Secure email/password authentication powered by Convex Auth
- Sign up and sign in functionality
- Protected routes for authenticated users
- User session management

### 📅 Event Management

- Create multiple events with name, date, and description
- Switch between different events seamlessly
- View all created events
- Event-based photo organization

### 📷 Photo Sharing

- Upload photos to specific events
- Secure image storage with Convex file storage
- Real-time photo gallery updates
- Responsive grid layout for photo display
- Track who uploaded each photo

### 💬 Comments System

- Add comments to any photo
- Real-time comment updates
- View commenter usernames and timestamps
- Scrollable comment sections
- Multi-user engagement

### 🎨 Modern UI

- Beautiful, responsive design with TailwindCSS
- Dark mode support
- Smooth animations and transitions
- Mobile-friendly interface

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Convex account (free at [convex.dev](https://convex.dev))

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd photo-gallery
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Convex**

   ```bash
   npx convex dev
   ```

   This will:
   - Create a new Convex project (or link to existing)
   - Set up your `.env.local` file with deployment URL
   - Generate necessary authentication keys

4. **Configure authentication**

   ```bash
   npx @convex-dev/auth
   ```

   - Enter your local dev URL (default: `http://localhost:5173`)
   - This generates JWT keys and configures auth settings

5. **Start the development server**

   ```bash
   npm run dev
   ```

   This runs both the Vite frontend and Convex backend concurrently.

6. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

## 📁 Project Structure

```bash
photo-gallery/
├── convex/                 # Convex backend
│   ├── _generated/        # Auto-generated Convex types
│   ├── auth.config.ts     # Auth configuration
│   ├── auth.ts           # Auth setup
│   ├── http.ts           # HTTP routes for auth
│   ├── myFunctions.ts    # Backend queries and mutations
│   └── schema.ts         # Database schema
├── src/
│   ├── components/
│   │   ├── AuthProvider.tsx    # Auth context provider
│   │   ├── CommentSection.tsx  # Photo comments component
│   │   ├── PhotoGallery.tsx    # Main gallery component
│   │   └── PhotoUpload.tsx     # Photo upload component
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── .env.local           # Environment variables (auto-generated)
├── package.json         # Dependencies
└── vite.config.ts       # Vite configuration
```

## 🔧 Configuration

### Environment Variables

The `.env.local` file is automatically created by Convex and includes:

```env
CONVEX_DEPLOYMENT=dev:your-deployment-name
VITE_CONVEX_URL=https://your-deployment.convex.cloud
```

### Database Schema

The app uses the following Convex tables:

- **authAccounts** - User authentication data (managed by Convex Auth)
- **authSessions** - User sessions
- **authRefreshTokens** - Token refresh data
- **users** - User profiles
- **events** - Event information (name, date, description)
- **photos** - Photo metadata and storage references
- **comments** - Photo comments with user info and timestamps

## 🎯 Usage

### For Users

1. **Sign Up / Sign In**
   - Create an account with email and password
   - Or sign in if you already have an account

2. **Create an Event**
   - Click "Create Event" button
   - Fill in event name, date, and description
   - Submit to create the event

3. **Upload Photos**
   - Select an event from the event selector
   - Click "Choose File" and select an image
   - Click "Upload Photo" to add it to the event

4. **View & Comment**
   - Browse photos in the gallery grid
   - Scroll down to view comments on each photo
   - Add your own comments to engage with others

5. **Switch Events**
   - Use the event buttons at the top to switch between different events
   - Each event maintains its own photo collection

### For Developers

#### Adding New Features

1. **Backend (Convex)**
   - Define schema in `convex/schema.ts`
   - Create queries/mutations in `convex/myFunctions.ts`
   - Run `npx convex dev` to deploy changes

2. **Frontend (React)**
   - Add components in `src/components/`
   - Use Convex hooks: `useQuery`, `useMutation`
   - Style with TailwindCSS classes

#### Available Convex Functions

**Queries:**

- `getEvents` - Fetch all events
- `getEventPhotos` - Fetch photos for a specific event (includes URLs)
- `getCommentsForPhoto` - Fetch comments for a specific photo
- `getImageUrl` - Get URL for a storage ID
- `getViewer` - Get current authenticated user

**Mutations:**

- `createEvent` - Create a new event
- `addPhoto` - Add a photo to an event
- `addComment` - Add a comment to a photo
- `generateUploadUrl` - Generate URL for file upload

#### Example: Adding a Like Feature

**1. Update Schema:**

```typescript
// convex/schema.ts
likes: defineTable({
  photoId: v.id("photos"),
  userId: v.string(),
}).index("by_photo", ["photoId"]),
```

**2. Add Functions:**

```typescript
// convex/myFunctions.ts
export const getLikes = query({
  args: { photoId: v.id("photos") },
  handler: async (ctx, { photoId }) => {
    return await ctx.db
      .query("likes")
      .filter((q) => q.eq(q.field("photoId"), photoId))
      .collect();
  },
});

export const toggleLike = mutation({
  args: { photoId: v.id("photos"), userId: v.string() },
  handler: async (ctx, { photoId, userId }) => {
    const existing = await ctx.db
      .query("likes")
      .filter((q) =>
        q.and(
          q.eq(q.field("photoId"), photoId),
          q.eq(q.field("userId"), userId),
        ),
      )
      .first();

    if (existing) {
      await ctx.db.delete(existing._id);
    } else {
      await ctx.db.insert("likes", { photoId, userId });
    }
  },
});
```

**3. Use in Component:**

```tsx
const likes = useQuery(api.myFunctions.getLikes, { photoId });
const toggleLike = useMutation(api.myFunctions.toggleLike);

<button onClick={() => toggleLike({ photoId, userId })}>
  ❤️ {likes?.length || 0}
</button>;
```

## 📦 Built With

- **[React 19](https://react.dev/)** - UI framework
- **[Convex](https://convex.dev/)** - Backend-as-a-Service platform
- **[Convex Auth](https://labs.convex.dev/auth)** - Authentication solution
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS
- **[Vite](https://vitejs.dev/)** - Build tool and dev server

## 🛠️ Development Scripts

```bash
# Start development (frontend + backend)
npm run dev

# Start frontend only
npm run dev:frontend

# Start backend only
npm run dev:backend

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 🚀 Deployment

### Deploy to Production

1. **Create a production deployment:**

   ```bash
   npx convex deploy
   ```

2. **Build the frontend:**

   ```bash
   npm run build
   ```

3. **Deploy to your hosting provider:**

   **Vercel:**

   ```bash
   npm i -g vercel
   vercel
   ```

   **Netlify:**

   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

4. **Update environment variables:**
   - Set `VITE_CONVEX_URL` to your production Convex URL
   - Configure authentication for your production domain
   - Run `npx @convex-dev/auth` with your production URL

## 🐛 Troubleshooting

### Authentication Issues

If you encounter authentication errors:

1. Ensure JWT keys are configured: `npx @convex-dev/auth`
2. Verify your SITE_URL matches your dev server URL
3. Check that `convex/schema.ts` imports `authTables` correctly

### Photo Upload Issues

If photos don't upload:

1. Check browser console for errors
2. Verify `generateUploadUrl` mutation is working
3. Ensure file size is within limits (default: 20MB)

### Images Not Displaying

If images don't show:

1. Verify storage URLs are being generated correctly
2. Check network tab for failed image requests
3. Ensure `getEventPhotos` includes URL generation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE.txt](LICENSE.txt) file for details.

## 🙏 Acknowledgments

- Convex team for the amazing backend platform and authentication library
- Tailwind Labs for the utility-first CSS framework
- React team for the incredible UI library
- The open-source community for inspiration and support

## 📞 Support

If you have any questions or run into issues:

1. Check the [Convex Documentation](https://docs.convex.dev/)
2. Visit the [Convex Discord](https://convex.dev/community)
3. Review [Convex Auth Docs](https://labs.convex.dev/auth)
4. Open an issue in this repository

---

Made with ❤️ using Convex and React
