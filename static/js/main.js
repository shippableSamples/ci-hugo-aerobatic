// trigger a change
$(document).ready(function() {

  // HACKY way to replace https://!!baseurl!! with https://__baseurl__
  $('code:contains("https://!!baseurl!!"), span.code:contains("https://!!baseurl!!")').each(function(i, elem) {
    $(elem).contents().each(function(j, child) {
      if (child.nodeType === 3) {
        child.nodeValue = child.nodeValue.replace('https://!!baseurl!!', 'https://__baseurl__');
      } else {
        child.innerText = child.innerText.replace('https://!!baseurl!!', 'https://__baseurl__');
      }
    });
  });
});
