import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import { IS_DEVELOPMENT } from "@/constants/client";
import type { RequestData as ContactMeRequestData } from "@/pages/api/contact-me";
import { GTM_CustomEventDispatcher, GTM_Events } from "@/lib/integrations/GTM/client";
import { FloatingPanel } from "./FloatingPanel";
import { cn } from "@/lib/utils/cn";
// import { wait } from "../utils/wait";


// main component

export const ContactMe = ({
  isVisible,
  onCloseClick
}: {
  isVisible: boolean;
  onCloseClick: () => void;
}) => (
  <FloatingPanel
    as="section"
    isVisible={isVisible}
    onCloseClick={onCloseClick}
  >
    <FloatingPanel.Header>
      <FloatingPanel.HeaderBackButton onClick={onCloseClick}>
        Close
      </FloatingPanel.HeaderBackButton>
    </FloatingPanel.Header>
    <FloatingPanel.Content>
      <TheForm />
    </FloatingPanel.Content>
  </FloatingPanel>
);


// form


// form schema
const formSchema = z.object({
  contact__name: z.string().min(1, { message: 'Name is required' }),
  contact__email: z.string().min(1, { message: 'Email is required' }).email('Invalid email address'),
  contact__message: z.string().min(1, { message: 'Message is required' }),
});
type FormValues = z.infer<typeof formSchema>;
const initialFormValues: FormValues = IS_DEVELOPMENT ? {
  contact__name: 'Test in Dev User',
  contact__email: 'jacopo.marrone.dev.test.user@gmail.com',
  contact__message: 'Demo message',
} : {
  contact__name: '',
  contact__email: '',
  contact__message: ''
};

async function submitFormToServer(formValues: FormValues) {
  const date = new Date();

  const data: ContactMeRequestData = {
    contact_name: formValues.contact__name,
    contact_email: formValues.contact__email,
    contact_message: formValues.contact__message,
    source_key: "portfolio-contact-form",
    source_href: window.location.href,
    date_iso_string: date.toISOString(),
    date_locale_string: date.toLocaleString(),
  };

  try {
    // DEBUG
    // const response = await wait(1000, { status: 200 }); // test success
    // const response = await wait(1000, { status: 400 }); // test fail
    // REAL
    const response = await axios.post('/api/contact-me', data);

    if (response?.status === 200) {

      // trigger a GoogleTagManager custom event
      // that register the submitted form event
      GTM_CustomEventDispatcher.fire({
        event: GTM_Events.contact_form_submit_success,
        payload: { request_data: data },
      });

      return {
        success: true,
        request_data: data,
      };
    }

    throw new Error(`Status Code: ${response?.status}`);

  } catch (error) {

    // trigger a GoogleTagManager custom event
    // that register the submitted form event
    GTM_CustomEventDispatcher.fire({
      event: GTM_Events.contact_form_submit_error,
      payload: { request_data: data, error }
    });

    return {
      success: false,
      request_data: data,
      error: error instanceof Error ? error.message : 'Please retry! An unexpected error happened!'
    };
  }
}


const TheForm = () => {

  // local state
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialFormValues,
  });
  const [submitResult, setSubmitResult] = useState<(
    | { status: 'success', message: string; }
    | { status: 'error'; errorMessage: string; }
  ) | null>(null);

  // event handlers
  const handleSubmit = form.handleSubmit(
    async (data) => {
      if (IS_DEVELOPMENT) {
        console.log(data);
      }

      try {
        setSubmitResult(null);
        const { success, error } = await submitFormToServer(data);
        if (!success) throw new Error(error);
        form.reset();
        setSubmitResult({
          status: 'success',
          message: "Successfully submitted. I will reply you back as soon as possible !"
        });
      } catch (error) {
        setSubmitResult({
          status: 'error',
          errorMessage: IS_DEVELOPMENT
            ? (
              error instanceof Error ? `${error.message}` : 'Please retry! An unexpected error happened!'
            ) : (
              'Ops something went wrong! Please retry or contact directly at jacopo.marrone27@gmail.com'
            )
        });
      }
    }
  );

  return (
    <form
      className="form contact-form"
      id="contact-form"
      onSubmit={handleSubmit}
      onReset={() => {
        form.reset();
        form.clearErrors();
        setSubmitResult(null);
      }}
    >
      <h2 className="form__heading">
        <span>Contact Me</span>
      </h2>
      <div className="form__section">
        {/* Form Field - Name */}
        <div className={`form-field ${form.formState.errors['contact__name'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__name">Name</label>
          <input {...form.register('contact__name')} className="form-field__input" type="text" id="contact__name" name="contact__name" placeholder="Your name" />
          <span className="form-field__helper-text">{form.formState.errors['contact__name']?.message ?? ' '}</span>
        </div>
        {/* Form Field - Email */}
        <div className={`form-field ${form.formState.errors['contact__email'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__email">Email</label>
          <input {...form.register('contact__email')} className="form-field__input" type="text" id="contact__email" name="contact__email" placeholder="Your email" />
          <span className="form-field__helper-text">{form.formState.errors['contact__email']?.message ?? ' '}</span>
        </div>
        {/* Form Field - Message */}
        <div className={`form-field ${form.formState.errors['contact__message'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__message">Message</label>
          <textarea {...form.register('contact__message')} className="form-field__input" id="contact__message" name="contact__message" placeholder="Tell me about your project in just a few words ..." rows={6}></textarea>
          <span className="form-field__helper-text">{form.formState.errors['contact__message']?.message ?? ' '}</span>
        </div>
      </div>
      <div className="form__section form__section--actions">
        {/* Form Butto - Submit */}
        <button className="button" type="submit">
          <span>
            {form.formState.isSubmitting ? 'Sending...' : 'Send'}
          </span>
        </button>
        {/* Form Button - Reset */}
        <button className="button button--naked" type="reset">
          <span>Reset</span>
        </button>
      </div>
      {form.formState.isSubmitting
        ? null
        : submitResult?.status === 'success' ? (
          <div className="form__section">
            <AlertMessage variant="success" message={submitResult.message} />
          </div>
        ) : submitResult?.status === 'error' ? (
          <div className="form__section">
            <AlertMessage variant="error" message={submitResult.errorMessage} />
          </div>
        ) : null}
    </form>
  );

};


const AlertMessage = ({
  variant,
  message,
}: {
  variant: 'success' | 'error',
  message: string;
}) => {
  return (
    <div
      className={cn(
        "block p-4 border border-solid text-sm",
        variant === 'success' && 'border-green-300 bg-green-300/40 text-green-800',
        variant === 'error' && 'border-red-300 bg-red-300/30 text-red-600',
      )}
    >
      <span>{message}</span>
    </div>
  );
};
