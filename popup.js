function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, tabs => {
    var tab = tabs[0];
    var url = tab.url;

    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, tab.id);
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
    let extStatus = false;

    getExtensionStatus(url, savedStatus => {
      if (savedStatus) {
        extStatus = savedStatus;
      }
      console.log(savedStatus);
    });

    extToggle.checked = extStatus;

    extToggle.addEventListener('change', () => {
      extStatus = changeExtensionStatus(extStatus, tabId, extToggle);
      saveExtensionStatus(url, extStatus);
    });
  });
});
