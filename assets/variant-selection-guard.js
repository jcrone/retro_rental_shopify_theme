/**
 * Variant selection guard
 *
 * When a variant picker renders with data-require-selection="true" (see
 * snippets/product-variant-picker.liquid), each dropdown gets a disabled
 * "Select one" placeholder instead of a preselected variant, and add-to-cart
 * stays disabled until the customer has chosen a value for every option.
 *
 * Only the markup present at initial page load is touched. Once every option
 * has a real value, the change event is allowed through to VariantSelects and
 * the normal ProductInfo re-render takes over (which restores the variant id
 * input, price, and button state from the server response).
 */
(() => {
  const initGuard = (variantSelects) => {
    if (variantSelects.dataset.selectionGuardApplied === 'true') return;
    if (new URLSearchParams(window.location.search).has('variant')) return;

    const selects = Array.from(variantSelects.querySelectorAll('select.select__select'));
    if (!selects.length) return;

    variantSelects.dataset.selectionGuardApplied = 'true';
    const prompt = variantSelects.dataset.selectPrompt || 'Select one';

    selects.forEach((select) => {
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = prompt;
      placeholder.disabled = true;
      select.querySelectorAll('option[selected]').forEach((option) => option.removeAttribute('selected'));
      placeholder.setAttribute('selected', 'selected');
      select.prepend(placeholder);
      select.value = '';
    });

    const productInfo = variantSelects.closest('product-info');
    const submitButton = productInfo?.querySelector('.product-form__submit');
    const variantIdInput = productInfo?.querySelector('form[data-type="add-to-cart-form"] input[name="id"]');
    const dynamicCheckout = productInfo?.querySelector('.shopify-payment-button');

    // An empty id makes any premature submit (e.g. dynamic checkout) a no-op;
    // ProductInfo.updateVariantInputs repopulates it after a full selection.
    if (variantIdInput) variantIdInput.value = '';
    submitButton?.setAttribute('disabled', 'disabled');
    if (dynamicCheckout) dynamicCheckout.style.display = 'none';

    variantSelects.addEventListener(
      'change',
      (event) => {
        const select = event.target;
        if (select.tagName !== 'SELECT') return;

        if (selects.every((el) => el.value !== '')) {
          if (dynamicCheckout) dynamicCheckout.style.display = '';
          return;
        }

        // Options are still missing: record this dropdown's choice, but stop
        // the event before VariantSelects triggers a server re-render that
        // would auto-fill the untouched dropdowns.
        event.stopPropagation();
        select.querySelectorAll('option[selected]').forEach((option) => option.removeAttribute('selected'));
        const chosen = select.selectedOptions[0];
        if (!chosen) return;
        chosen.setAttribute('selected', 'selected');

        const dropdownSwatch = select
          .closest('.product-form__input')
          ?.querySelector('[data-selected-value] > .swatch');
        if (dropdownSwatch) {
          const swatchValue = chosen.dataset.optionSwatchValue;
          dropdownSwatch.style.setProperty('--swatch--background', swatchValue || 'unset');
          dropdownSwatch.classList.toggle('swatch--unavailable', !swatchValue);
          dropdownSwatch.style.setProperty('--swatch-focal-point', chosen.dataset.optionSwatchFocalPoint || 'unset');
        }
      },
      true
    );
  };

  const init = () => {
    document.querySelectorAll('variant-selects[data-require-selection="true"]').forEach(initGuard);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('shopify:section:load', init);
})();
