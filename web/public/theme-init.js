// Runs before React to apply the saved theme and avoid a flash of the wrong theme.
(function () {
  var t =
    localStorage.getItem('app-theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', t);
})();
