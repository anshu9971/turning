"use client"
// import LoginBtn from "./login-btn";

// export default function Home() {
//   return (
//     <div>
//       <LoginBtn />
//     </div>
//   );
// }
import { SessionProvider, useSession } from 'next-auth/react';

export default function Home({ pageProps }) {
  return (
    <SessionProvider session={pageProps?.session}> {/* Wrap your app with SessionProvider */}
      <MyProtectedComponent />
    </SessionProvider>
  )
}

function MyProtectedComponent() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <div>
        Please <a href="/api/auth/signin">sign in</a> to continue.
      </div>
    );
  }

  return (
    <div>
      Welcome, {session.user.name}! <br/> (or other user data from the id_token)
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
}
