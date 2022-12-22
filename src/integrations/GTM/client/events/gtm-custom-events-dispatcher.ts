interface GTM_CustomEvent {
  event: string;
  payload: any;
}

export class GTM_CustomEventDispatcher {
  static fire({ event, payload }: GTM_CustomEvent) {
    if (typeof window.dataLayer === 'undefined') {
      console.error('GTM is not loaded, cannot trigger Custom Events');
      return;
    };
    window.dataLayer.push({
      event,
      payload,
      payload_json_string: JSON.stringify(payload),
    });
  }
}