import { clerkMiddleware, createRouteMatcher} from "@clerk/nextjs/server";


//Dashboard route protection

// basically we set the only public route to be / which is equivalent to home page
const isPublicRoute = createRouteMatcher(['/', '/api/webhook']);

export default clerkMiddleware(async (auth, request) => {
   
    if (!isPublicRoute(request)){
      // if not a public route and not logged in:
      await auth.protect() // request log in
    }
  }
);


export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for Clerk-specific frontend API routes
    '/__clerk/(.*)',
  ],
}