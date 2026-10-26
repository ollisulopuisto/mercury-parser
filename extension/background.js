/* eslint-disable */
chrome.action.onClicked.addListener(async tab => {
  if (
    !tab.id ||
    !tab.url ||
    tab.url.startsWith('chrome://') ||
    tab.url.startsWith('edge://') ||
    tab.url.startsWith('about:')
  ) {
    return;
  }

  try {
    await chrome.scripting.insertCSS({
      target: { tabId: tab.id },
      files: ['reader.css'],
    });

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['mercury.web.js', 'reader.js'],
    });
  } catch (err) {
    console.error('Selkokieli injection error:', err);
  }
});
