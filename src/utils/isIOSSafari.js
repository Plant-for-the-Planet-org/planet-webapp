export default function isIOSSafari() {
  /*
        Returns (true/false) whether device agent is iOS Safari
    */
  var ua = navigator.userAgent;
  var iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
  var webkitUa = !!ua.match(/WebKit/i);

  return (
    typeof webkitUa !== 'undefined' && iOS && webkitUa && !ua.match(/CriOS/i)
  );
}
