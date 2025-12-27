# Video Chat - Spectator Site

A read-only spectator viewer for watching video chat sessions.

## Setup Instructions

### 1. Supabase Configuration

Same Supabase project as the participant site. In `config.js`, replace:
- `YOUR_SUPABASE_URL` with your Supabase project URL
- `YOUR_SUPABASE_ANON_KEY` with your Supabase anon key

### 2. Deploy to GitHub Pages

1. Create a GitHub repository named `spectators-videochat`
2. Clone locally: `git clone https://github.com/YOUR_USERNAME/spectators-videochat.git`
3. Copy all files from this folder to the repo
4. Push to GitHub: `git push origin main`
5. In GitHub repo settings, enable GitHub Pages with `main` branch

## Features

- View live video chat streams
- Read-only spectator mode
- Token-based access with 24-hour expiry
- Real-time participant status
- Support for multiple spectators per room

## Spectator URL Format

Participants generate shareable links in format:
```
https://spectators.yourdomain.com/?roomCode=ABC123&token=xyz789
```

Spectators can also join with just the room code if configured to allow it.
