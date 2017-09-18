export function triggerDomEvent(
  eventType: string,
  target: HTMLElement | Element,
  eventData: Object = {}
): void {
  const event: Event = document.createEvent('Event');
  Object.assign(event, eventData);
  event.initEvent(eventType, true, true);
  target.dispatchEvent(event);
}
