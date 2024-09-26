"use client";
import { createCheckoutSession } from "@/actions/actions";
import H1 from "@/components/h1";
import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type PaymentSearchProps = {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default function Payment({ searchParams }: PaymentSearchProps) {
  const [isPending, startTransition] = useTransition();

  const { update, status,data:session } = useSession();
  const router = useRouter();
  return (
    <main className="flex flex-col items-center space-y-10">
      <H1>Payment access requires payment</H1>
      {searchParams.success && (
        <Button
          onClick={async () => {
            await update(true);
            router.push("/app/dashboard");
          }}
          disabled={status === "loading" || session?.user.hasAccess}
        >
          Access PetSoft
        </Button>
      )}

      {!searchParams.success && (
        <Button
          disabled={isPending}
          onClick={async () => {
            startTransition(async () => {
              await createCheckoutSession();
            });
          }}
        >
          buy lifeTime acces for $299s
        </Button>
      )}
      {searchParams.success && (
        <p className="text-sm text-green-700">
          Payment success! You now have access to the app
        </p>
      )}

      {searchParams.cancelled && (
        <p className="text-sm text-red-700">
          Payment cancelled please try again
        </p>
      )}
    </main>
  );
}
