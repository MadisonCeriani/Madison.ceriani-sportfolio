(function () {
  'use strict';

  var PAGE_KEY = location.pathname;
  var EDITABLE_SELECTOR = 'main h1, main h2, main h3, main p, main .eyebrow';

  function getStorageKey(index) {
    return PAGE_KEY + '|' + index;
  }

  function restoreContent() {
    document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el, i) {
      var saved = localStorage.getItem(getStorageKey(i));
      if (saved !== null) {
        el.innerHTML = saved;
      }
    });
  }

  function saveContent() {
    document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el, i) {
      localStorage.setItem(getStorageKey(i), el.innerHTML);
    });
  }

  function enableEditing() {
    document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el) {
      el.contentEditable = 'true';
    });
    document.body.classList.add('editing-mode');
  }

  function disableEditing() {
    document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el) {
      el.contentEditable = 'false';
    });
    document.body.classList.remove('editing-mode');
  }

  function createToolbar() {
    var bar = document.createElement('div');
    bar.className = 'editor-toolbar';
    bar.setAttribute('role', 'toolbar');
    bar.setAttribute('aria-label', 'Page editor');

    var editBtn = document.createElement('button');
    editBtn.className = 'editor-btn';
    editBtn.id = 'editor-toggle';
    editBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit page';

    var saveBtn = document.createElement('button');
    saveBtn.className = 'editor-btn editor-btn-save';
    saveBtn.id = 'editor-save';
    saveBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save changes';
    saveBtn.hidden = true;

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'editor-btn editor-btn-cancel';
    cancelBtn.id = 'editor-cancel';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.hidden = true;

    var snapshot = {};

    editBtn.addEventListener('click', function () {
      document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el, i) {
        snapshot[i] = el.innerHTML;
      });
      enableEditing();
      editBtn.hidden = true;
      saveBtn.hidden = false;
      cancelBtn.hidden = false;

      var firstEditable = document.querySelector(EDITABLE_SELECTOR);
      if (firstEditable) firstEditable.focus();
    });

    saveBtn.addEventListener('click', function () {
      saveContent();
      disableEditing();
      saveBtn.hidden = true;
      cancelBtn.hidden = true;
      editBtn.hidden = false;
      showToast('Changes saved!');
    });

    cancelBtn.addEventListener('click', function () {
      document.querySelectorAll(EDITABLE_SELECTOR).forEach(function (el, i) {
        if (snapshot[i] !== undefined) el.innerHTML = snapshot[i];
      });
      disableEditing();
      saveBtn.hidden = true;
      cancelBtn.hidden = true;
      editBtn.hidden = false;
    });

    bar.appendChild(editBtn);
    bar.appendChild(saveBtn);
    bar.appendChild(cancelBtn);
    document.body.appendChild(bar);
  }

  function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'editor-toast';
    toast.setAttribute('role', 'status');
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 2500);
  }

  document.addEventListener('DOMContentLoaded', function () {
    restoreContent();
    createToolbar();
  });
})();
