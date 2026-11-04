import { Suspense } from "react";

import { SavedChatScreen } from "@/components/chat/SavedChatScreen";

/** /chat/<id>: un chat guardado. El id solo se conoce al abrir la página (por eso el Suspense). */
export default function SavedChatPage({ params }: PageProps<"/chat/[id]">) {
  return <Suspense fallback={null}>{params.then(({ id }) => <SavedChatScreen chatId={id} />)}</Suspense>;
}
