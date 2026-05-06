(function() {
  var form = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var submitText = document.getElementById('submitText');
  var submitSpinner = document.getElementById('submitSpinner');
  var typeInput = document.getElementById('type');
  var charCount = document.getElementById('charCount');
  var messageEl = document.getElementById('message');

  // Type chips
  document.querySelectorAll('.form-chip').forEach(function(chip) {
    chip.addEventListener('click', function() {
      document.querySelectorAll('.form-chip').forEach(function(c) {
        c.classList.remove('form-chip--active');
      });
      chip.classList.add('form-chip--active');
      typeInput.value = chip.dataset.type;
    });
  });

  // Char counter
  if (messageEl && charCount) {
    messageEl.addEventListener('input', function() {
      charCount.textContent = messageEl.value.length + ' / 5000';
    });
  }

  // Validation
  function validate() {
    var ok = true;
    var name = document.getElementById('name');
    var email = document.getElementById('email');

    clearErrors();

    if (!name.value.trim() || name.value.trim().length < 2) {
      showError('nameError', form.dataset.errName);
      ok = false;
    }
    if (!email.value.trim() || !email.validity.valid) {
      showError('emailError', form.dataset.errEmail);
      ok = false;
    }
    if (!messageEl.value.trim() || messageEl.value.trim().length < 10) {
      showError('messageError', form.dataset.errMessage);
      ok = false;
    }
    return ok;
  }

  function showError(id, msg) {
    var el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = 'block'; }
  }

  function clearErrors() {
    document.querySelectorAll('.form-error').forEach(function(el) {
      el.textContent = '';
      el.style.display = 'none';
    });
  }

  // Submit
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (!validate()) return;

    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitSpinner.style.display = 'inline-block';

    var data = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      type: typeInput.value,
      message: messageEl.value.trim(),
      website: form.querySelector('[name="website"]').value
    };

    fetch('/api/contact.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(function(res) { return res.json().then(function(d) { return { ok: res.ok, data: d }; }); })
    .then(function(result) {
      submitBtn.disabled = false;
      submitText.style.display = '';
      submitSpinner.style.display = 'none';
      if (result.ok && result.data.ok) {
        form.reset();
        document.querySelectorAll('.form-chip').forEach(function(c) { c.classList.remove('form-chip--active'); });
        document.querySelector('[data-type="feedback"]').classList.add('form-chip--active');
        typeInput.value = 'feedback';
        charCount.textContent = '0 / 5000';
        showToast({ type: 'success', title: form.dataset.successTitle, msg: form.dataset.successDesc });
      } else {
        var msg = result.data.errors ? result.data.errors.join(' ') : (result.data.error || form.dataset.errServer);
        showToast({ type: 'error', title: 'Error', msg: msg });
      }
    })
    .catch(function() {
      submitBtn.disabled = false;
      submitText.style.display = '';
      submitSpinner.style.display = 'none';
      showToast({ type: 'error', title: 'Error', msg: form.dataset.errNetwork });
    });
  });
})();
