
import { SessionProvider } from "next-auth/react";
import Content from "./components/Content";
import { Header } from "./components/Header";

export default async function Home() {
  // const hello = await api.post.hello({
  //   text: "world"
  // });
  // const session = await auth();

  // if (session?.user) {
  //   void api.post.getLatest.prefetch();
  // }

  return (
    // <HydrateClient>
    <main>
      <SessionProvider>
        <Header />
        <Content />
      </SessionProvider>
    </main>
    // </HydrateClient>
  );
}

// type Topic = RouterOutputs["topic"]["getAll"][0];

