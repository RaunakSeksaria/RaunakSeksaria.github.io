'use client';

import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '@/config/emailjs';

type Status = 'idle' | 'sending' | 'sent' | 'error';

/**
 * Framed as writing a commit message, because it suits the rest of the page.
 *
 * The `name` attributes are load-bearing: EmailJS matches template variables by
 * field name, so `from_name`, `reply_to` and `message` must not be renamed.
 * Only the visible labels are free.
 */
export default function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formRef.current) return;

    setStatus('sending');
    setError('');

    try {
      await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey,
      );
      setStatus('sent');
      formRef.current.reset();
    } catch (cause) {
      setStatus('error');
      setError(
        cause instanceof Error ? cause.message : 'Something went wrong sending that.',
      );
    }
  }

  const field =
    'mono w-full rounded border border-rule bg-canvas px-2.5 py-1.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-accent';
  const label = 'mono block text-[11px] uppercase tracking-wider text-faint';

  if (status === 'sent') {
    return (
      <div className="rounded border border-rule p-4">
        <p className="mono text-xs text-add">message sent</p>
        <p className="prose-block mt-1.5 text-sm text-dim">
          Thanks. I will get back to you at the address you gave.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mono mt-3 text-xs text-dim underline underline-offset-4 transition-colors hover:text-accent"
        >
          write another
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="from_name">
            author
          </label>
          <input
            id="from_name"
            name="from_name"
            type="text"
            required
            autoComplete="name"
            placeholder="your name"
            className={`${field} mt-1`}
          />
        </div>
        <div>
          <label className={label} htmlFor="reply_to">
            reply-to
          </label>
          <input
            id="reply_to"
            name="reply_to"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={`${field} mt-1`}
          />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="message">
          message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="what you would like to talk about"
          className={`${field} mt-1 resize-y`}
        />
      </div>

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="mono rounded border border-accent px-3 py-1.5 text-xs text-accent transition-colors hover:bg-accent hover:text-canvas disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-accent"
        >
          {status === 'sending' ? 'sending...' : 'send'}
        </button>

        {status === 'error' && (
          <p role="alert" className="mono text-xs text-del">
            {error || 'could not send'} - or just email me directly.
          </p>
        )}
      </div>
    </form>
  );
}
