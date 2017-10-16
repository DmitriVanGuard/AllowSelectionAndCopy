let extStatus = true;

function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, tabs => {
    var tab = tabs[0];
    var url = tab.url;

    let extURL = url.replace(/https?:\/\//g, '');
    extURL = extURL.slice(0, extURL.indexOf('/'));

    console.assert(typeof extURL == 'string', 'tab.url should be a string');

    callback(extURL, tab.id);
  });
}

function getExtensionStatus(url, callback) {
  chrome.storage.sync.get(url, items => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveExtensionStatus(url, status) {
  var items = {};
  items[url] = status;
  chrome.storage.sync.set(items);
}

function changeExtensionStatus(extStatus, tabId, elem) {
  if (extStatus) {
    chrome.tabs.sendMessage(tabId, { extStatus: false });
  } else {
    chrome.tabs.sendMessage(tabId, { extStatus: true });
  }

  extStatus = !extStatus;
  elem.checked = extStatus;
  return extStatus;
}

document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url, tabId) => {
    const extToggle = document.getElementById('extToggle');

    getExtensionStatus(url, savedStatus => {
      console.log(typeof savedStatus === 'undefined' || savedStatus.extStatus);
      extStatus = typeof savedStatus === 'undefined' || savedStatus.extStatus ? true : false;
      console.log(`extStatus ${extStatus}`);
      // extStatus = savedStatus.extStatus;
      extToggle.checked = extStatus;
    });

    console.log(url);

    extToggle.addEventListener('change', () => {
      extStatus = changeExtensionStatus(extStatus, tabId, extToggle);
      // const stat = { [url.slice(0, -1)]: { extStatus: { status: true, parent: url.slice(0, -1) } } };
      // saveExtensionStatus(url, extStatus);
      // console.log(stat);
      extStatus ? chrome.storage.sync.remove(url) : chrome.storage.sync.set({ [url]: { extStatus } });
    });
  });
});
