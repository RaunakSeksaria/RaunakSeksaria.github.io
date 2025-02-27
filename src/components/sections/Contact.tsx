'use client';

import { useState, useRef } from 'react';
import { FiSend } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import ResumeButton from '@/components/ResumeButton';
import { emailjsConfig } from '@/config/emailjs';

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Send email using EmailJS
      const result = await emailjs.sendForm(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formRef.current,
        emailjsConfig.publicKey
      );
      
      // Show success message
      setSubmitSuccess(true);
      setFormData({
        from_name: '',
        reply_to: '',
        message: '',
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error: any) {
      // More specific error message based on the type of error
      let errorMessage = 'Failed to send message. Please try again later or contact me directly.';
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section-container">
      <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[var(--textLight1)]">
        Contact Me
      </h2>
      
      <div className="max-w-3xl mx-auto bg-[var(--bgLight2)] p-6 rounded-lg shadow-md">
        {submitSuccess ? (
          <div className="text-green-600 text-center py-8">
            <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
            </svg>
            <p className="text-xl font-medium">Thank you for your message!</p>
            <p>I'll get back to you as soon as possible.</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="from_name" className="block text-[var(--textLight1)] mb-2">Name</label>
              <input
                type="text"
                id="from_name"
                name="from_name"
                value={formData.from_name}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--bgLight3)] rounded-md bg-[var(--bgLight1)] text-[var(--textLight1)]"
              />
            </div>
            
            <div>
              <label htmlFor="reply_to" className="block text-[var(--textLight1)] mb-2">Email</label>
              <input
                type="email"
                id="reply_to"
                name="reply_to"
                value={formData.reply_to}
                onChange={handleChange}
                required
                className="w-full p-3 border border-[var(--bgLight3)] rounded-md bg-[var(--bgLight1)] text-[var(--textLight1)]"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-[var(--textLight1)] mb-2">Message</label>
              <textarea
                id="message"
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full p-3 border border-[var(--bgLight3)] rounded-md bg-[var(--bgLight1)] text-[var(--textLight1)]"
              ></textarea>
            </div>
            
            {submitError && (
              <div className="text-red-500 p-3 bg-red-50 rounded-md">
                <p>{submitError}</p>
                <p className="text-sm mt-2">
                  If you continue to experience issues, please email me directly at{' '}
                  <a href="mailto:seksariaraunak@gmail.com" className="underline">
                    seksariaraunak@gmail.com
                  </a>
                </p>
              </div>
            )}
            
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full md:w-auto"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <FiSend className="mr-2" />
                    Send Message
                  </span>
                )}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-10 pt-8 border-t border-[var(--bgLight3)]">
          <h3 className="text-xl font-semibold mb-4 text-center text-[var(--textLight1)]">
            Other Ways To Reach Me
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="mailto:seksariaraunak@gmail.com" 
              className="flex items-center p-3 bg-[var(--bgLight1)] rounded-lg hover:bg-[var(--bgLight3)] transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-[var(--accentColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              seksariaraunak@gmail.com
            </a>
            
            <a 
              href="mailto:raunak.seksaria@research.iiit.ac.in" 
              className="flex items-center p-3 bg-[var(--bgLight1)] rounded-lg hover:bg-[var(--bgLight3)] transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-[var(--accentColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              raunak.seksaria@research.iiit.ac.in
            </a>
            
            <a 
              href="tel:+917003121509" 
              className="flex items-center p-3 bg-[var(--bgLight1)] rounded-lg hover:bg-[var(--bgLight3)] transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-[var(--accentColor)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
              +91 7003121509
            </a>
            
            <a 
              href="https://www.linkedin.com/in/raunak-seksaria-60435a210/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center p-3 bg-[var(--bgLight1)] rounded-lg hover:bg-[var(--bgLight3)] transition-colors"
            >
              <svg className="w-6 h-6 mr-3 text-[var(--accentColor)]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
              LinkedIn
            </a>
          </div>
          
          <div className="mt-8 text-center">
            <h4 className="font-medium mb-3 text-[var(--textLight1)]">Want to see my resume?</h4>
            <ResumeButton size="lg" className="mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
