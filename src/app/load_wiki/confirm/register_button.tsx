"use client";

import assertResponseOk from "@/app/_util/assert_response_ok";
import { useRouter } from "next/navigation";

/** wikiの曲情報読み込み確認ページの登録ボタン */
export default function RegisterButton({ disabled }: { disabled: boolean }) {
  const router = useRouter();

  // 登録ボタンイベント
  const handleRegister = async () => {
    // API呼び出しfetch
    assertResponseOk(
      await fetch("/api/load_wiki/register", {
        method: "POST",
      }),
    );

    await router.push("/tracks");
  };

  return (
    <button type="button" onClick={handleRegister} disabled={disabled}>
      登録
    </button>
  );
}
