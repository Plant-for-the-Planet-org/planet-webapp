import { v1 } from 'uuid';

export default async function getsessionId() {
  let sessionId;
  if (typeof Storage !== 'undefined') {
    sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = v1();
      localStorage.setItem('sessionId', sessionId);
    }
  } else {
    sessionId = v1();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}
