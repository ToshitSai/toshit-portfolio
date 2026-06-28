"use client";

import { FormEvent, useState } from "react";
import { Mail, MapPin } from "lucide-react";

import { ScrollReveal } from "@/components/scroll-reveal";

const CONTACT_ENDPOINT =
  process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || "https://formsubmit.co/ajax/iamtoshitsai@gmail.com";

type SocialLink = {
  name: string;
  href: string;
  path: string;
};

type ContactSectionProps = {
  socialLinks: SocialLink[];
};

type SubmitState = "idle" | "sending" | "success" | "error";

function SocialIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d={path} />
    </svg>
  );
}

export function ContactSection({ socialLinks }: ContactSectionProps) {
  const [subject, setSubject] = useState("Internship Opportunity");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setSubmitState("sending");
    setFeedback("");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Unable to send the message right now.");
      }

      form.reset();
      setSubject("Internship Opportunity");
      setSubmitState("success");
      setFeedback("Thanks! Your message has been sent to my email.");
    } catch {
      setSubmitState("error");
      setFeedback("Message could not be sent right now. Please try again in a moment.");
    }
  };

  return (
    <section id="contact" className="border-t border-stone-200 pt-16">
      <ScrollReveal className="mx-auto max-w-3xl text-center" delay={120}>
        <div>
          <p className="section-eyebrow">Contact</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
            Let&apos;s Connect
          </h2>
          <p className="mt-4 text-base leading-8 text-stone-600">
            I&apos;m always open to discussing new opportunities, projects, or simply
            connecting with people who enjoy building on the web.
          </p>
          {submitState === "success" ? (
            <div className="contact-success mx-auto mt-6 max-w-2xl">{feedback}</div>
          ) : null}
          {submitState === "error" ? (
            <div className="contact-error mx-auto mt-6 max-w-2xl">{feedback}</div>
          ) : null}
        </div>
      </ScrollReveal>

      <ScrollReveal className="contact-grid mt-12" delay={160}>
        <form
          className="content-panel contact-form-panel"
          action={CONTACT_ENDPOINT}
          method="POST"
          onSubmit={handleSubmit}
        >
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
          <input type="hidden" name="_subject" value={`Portfolio Contact: ${subject}`} />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="false" />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="contact-field">
              <span>Name</span>
              <input name="name" type="text" placeholder="John Doe" required />
            </label>
            <label className="contact-field">
              <span>Email</span>
              <input name="email" type="email" placeholder="john@example.com" required />
            </label>
          </div>

          <label className="contact-field mt-5">
            <span>Subject</span>
            <input
              name="subject"
              type="text"
              placeholder="Internship Opportunity"
              required
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
          </label>

          <label className="contact-field mt-5">
            <span>Message</span>
            <textarea
              name="message"
              placeholder="Tell me about the opportunity..."
              required
              rows={6}
            />
          </label>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button className="primary-link contact-submit" type="submit" disabled={submitState === "sending"}>
              {submitState === "sending" ? "Sending..." : "Send Message"}
            </button>
          </div>
        </form>

        <div className="contact-side">
          <div className="content-panel">
            <h3 className="text-2xl font-semibold text-stone-950">Get in Touch</h3>
            <div className="mt-8 grid gap-5">
              <div className="contact-card-row">
                <div className="contact-icon-badge">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Email</p>
                  <a
                    className="mt-1 inline-block text-xl font-medium text-stone-950 hover:text-amber-700"
                    href="mailto:iamtoshitsai@gmail.com"
                  >
                    iamtoshitsai@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-card-row">
                <div className="contact-icon-badge">
                  <MapPin className="h-5 w-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm text-stone-500">Location</p>
                  <p className="mt-1 text-xl font-medium text-stone-950">India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="content-panel">
            <h3 className="text-2xl font-semibold text-stone-950">Follow Me</h3>
            <div className="mt-8 flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <ScrollReveal key={link.name} delay={220 + index * 60}>
                  <a
                    className="social-link social-link-icon"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.name}
                    title={link.name}
                  >
                    <SocialIcon path={link.path} />
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <div className="contact-note">
            <h3 className="text-2xl font-semibold text-stone-950">Looking for an intern?</h3>
            <p className="mt-4 text-base leading-8 text-stone-700">
              I&apos;m actively seeking internship and entry-level opportunities in web
              development where I can learn quickly, contribute to meaningful projects,
              and grow as an engineer.
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
