import React from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useIsFirstRender, useIsomorphicLayoutEffect } from "usehooks-ts";
import type { RequestData as ContactMeRequestData } from "@/pages/api/contact-me";
import { getFloatingPanelAnimation } from "../animations/FloatingPanelAnimation";
import { wait } from "../utils/wait";
import { GTM_CustomEventDispatcher, GTM_Events } from "@/integrations/GTM/client";
import { ArrowLeft } from "@/views/Home/components/icons";


function useAnimation(nodeRef: React.MutableRefObject<HTMLDivElement | null>) {
  const animationRef = React.useRef<gsap.core.Timeline | null>(null);

  useIsomorphicLayoutEffect(() => {
    if (nodeRef.current) {
      animationRef.current = getFloatingPanelAnimation(nodeRef.current);
      return () => { animationRef.current?.kill(); };
    }
  }, []);

  return {
    FADE_IN: () => animationRef.current?.play(),
    FADE_OUT: () => animationRef.current?.reverse(),
  };
}

export const ContactMe = ({ isVisible, onCloseClick }: {
  isVisible: boolean;
  onCloseClick: () => void;
}) => {
  const nodeWrapperRef = React.useRef<HTMLDivElement>(null);
  const animation = useAnimation(nodeWrapperRef);
  const isFirstRender = useIsFirstRender();

  // on "isVisible" change, trigger the animation
  React.useEffect(() => {
    if (isFirstRender) return;
    if (!nodeWrapperRef.current) return;
    if (isVisible) animation.FADE_IN();
    if (!isVisible) animation.FADE_OUT();
  }, [isVisible]);

  // on "esc" key press close the panel
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // on "esc" press
      if (e.keyCode === 27) {
        if (isVisible) onCloseClick();
      }
    };
    document.addEventListener('keyup', handler);
    return () => { document.removeEventListener('keyup', handler); };
  }, [isVisible]);


  return (
    <>
      <div className="floating-panel contact" ref={nodeWrapperRef}>
        <div className="floating-panel__inner">
          <div className="floating-panel__header">
            <button className="floating-panel__close-panel" type="button" onClick={onCloseClick}>
              <ArrowLeft />
              <span className="floating-panel__close-panel-text">Close</span>
            </button>
            <div className="contact__headline"><span>Contact Me</span></div>
          </div>
          <div className="floating-panel__content">
            <TheForm />
          </div>
        </div>
      </div>
    </>
  );
};


const formValidatorSchema = yup.object().shape({
  contact__name: yup.string().required('Name is required'),
  contact__email: yup.string().email('Invalid email address').required('Email is required'),
  contact__message: yup.string().required('Message is required'),
});
type FormValues = {
  contact__name: string,
  contact__email: string,
  contact__message: string,
};
const initialFormValues: FormValues = {
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
    source_path: window.location.href,
    date_timestamp: date.valueOf(),
    date_iso_string: date.toISOString(),
    date_locale_string: date.toLocaleString(),
  };

  try {
    // const response = await wait(1000, { status: 200 }); // test success
    // const response = await wait(1000, {status: 401}); // test fail
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

    throw new Error('Form data not submitted to server. Something went wrong');

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
  const [submitResult, setSubmitResult] = React.useState<null | { success: boolean, error?: string; }>(null);
  const { register, handleSubmit, formState: { errors }, clearErrors, reset } = useForm<FormValues>({
    resolver: yupResolver(formValidatorSchema),
    defaultValues: initialFormValues,
  });
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    console.log(data);
    const { success, error } = await submitFormToServer(data);
    setSubmitResult({ success, error });
    if (success) {
      reset();
      await wait(10000);
      setSubmitResult(null);
    }
  };

  return (
    <form
      className="form contact-form"
      id="contact-form"
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => clearErrors()}
    >
      <div className="form__heading"><span>Contact Me</span></div>
      <div className="form__section">
        <div className={`form-field ${errors['contact__name'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__name">Name</label>
          <input {...register('contact__name')} className="form-field__input" type="text" id="contact__name" name="contact__name" placeholder="Your name" />
          <span className="form-field__helper-text">{errors['contact__name']?.message ?? ' '}</span>
        </div>
        <div className={`form-field ${errors['contact__email'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__email">Email</label>
          <input {...register('contact__email')} className="form-field__input" type="text" id="contact__email" name="contact__email" placeholder="Your email" />
          <span className="form-field__helper-text">{errors['contact__email']?.message ?? ' '}</span>
        </div>
        <div className={`form-field ${errors['contact__message'] ? "form-field--is-invalid" : ''}`}>
          <label className="form-field__label" htmlFor="contact__message">Message</label>
          <textarea {...register('contact__message')} className="form-field__input" id="contact__message" name="contact__message" placeholder="Tell me about your project in just a few words ..." rows={6}></textarea>
          <span className="form-field__helper-text">{errors['contact__message']?.message ?? ' '}</span>
        </div>
      </div>
      <div className="form__section form__section--actions">
        <button className="button" type="submit"><span>Send</span></button>
        <button className="button button--naked" type="reset"><span>Reset</span></button>

        {submitResult && submitResult.success && (<span>✅ Successfully submitted. I will reply you back as soon as possible !</span>)}
        {submitResult && !submitResult.success && (<span>❌ {submitResult.error}</span>)}
      </div>
    </form>
  );

};