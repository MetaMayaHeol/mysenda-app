import { NextRequest, NextResponse } from "next/server";
import { createStaticClient } from "@/lib/supabase/static";

export async function POST(request: NextRequest) {
  try {
    const { email, locale } = await request.json();

    // Basic validation
    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Sanitize
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedLocale = ["es", "fr", "en"].includes(locale) ? locale : "es";

    const supabase = createStaticClient();

    // Check if already subscribed
    const { data: existing } = await supabase
      .from("newsletter_subscribers")
      .select("id, status")
      .eq("email", sanitizedEmail)
      .single();

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json(
          { message: "Already subscribed", alreadySubscribed: true },
          { status: 200 }
        );
      }
      // Re-activate if previously unsubscribed
      await supabase
        .from("newsletter_subscribers")
        .update({ status: "active", locale: sanitizedLocale, updated_at: new Date().toISOString() })
        .eq("id", existing.id);

      return NextResponse.json({ message: "Subscription reactivated" });
    }

    // Insert new subscriber
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({
        email: sanitizedEmail,
        locale: sanitizedLocale,
        status: "active",
        source: "blog",
      });

    if (error) {
      console.error("Newsletter subscription error:", error);
      
      // Handle unique constraint violation gracefully
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Already subscribed", alreadySubscribed: true },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Successfully subscribed!" });
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
