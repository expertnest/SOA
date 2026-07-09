import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/backend";

const http = httpRouter();

http.route({
  path: "/clerk-users-webhook",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const event = await validate(req);

    if (!event) {
      return new Response("Invalid webhook", { status: 400 });
    }

    switch (event.type) {
      case "user.created":
      case "user.updated":
        await ctx.runMutation(
          internal.users.upsertFromClerk,
          { data: event.data }
        );
        break;

      case "user.deleted":
        await ctx.runMutation(
          internal.users.deleteFromClerk,
          { clerkUserId: event.data.id! }
        );
        break;
    }

    return new Response(null, { status: 200 });
  }),
});

async function validate(req: Request): Promise<WebhookEvent | null> {
  const payload = await req.text();

  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

    return wh.verify(payload, {
      "svix-id": req.headers.get("svix-id")!,
      "svix-timestamp": req.headers.get("svix-timestamp")!,
      "svix-signature": req.headers.get("svix-signature")!,
    }) as unknown as WebhookEvent;
  } catch {
    return null;
  }
}

export default http;