/* CCivics source detection for inscripcionscc.com. */
CCivics.source = {
  supports(location = window.location) { return /(^|\.)inscripcionscc\.com$/i.test(location.hostname); },
  name: 'inscripcionscc'
};
