export const Validator = function (options) {
  // console.log(options);

  const selectorRules = {};

  const validate = (inputElement, rule) => {
    // const errorMessage = rule.test(inputElement.value);
    var errorMessage;
    const rules = selectorRules[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      // select form-group element with closest method
      const formGroup = inputElement.closest('.form-group');

      if (formGroup) {
        formGroup.classList.add('invalid');
        const formMessage = formGroup.querySelector(options.errorSelector);
        if (formMessage) {
          formMessage.innerText = errorMessage;
        }
      }
    }
  }
  // handle oninput event
  const handleOnInput = (inputElement) => {
    const formGroup = inputElement.closest('.form-group');
    if (formGroup) {
      formGroup.classList.remove('invalid');
      const formMessage = formGroup.querySelector(options.errorSelector);
      if (formMessage) {
        formMessage.innerText = '';
      }
    }
  }


  const formElement = document.querySelector(options.form);
  if (formElement) {
    options.rule.forEach((rule) => {


      const inputElement = formElement.querySelector(rule.selector);

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      if (inputElement) {
        // handle blur event
        inputElement.onblur = () => {
          validate(inputElement, rule);
        }
        // handle input event
        inputElement.oninput = () => {
          handleOnInput(inputElement);
        }
      }
    })
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || 'Vui lòng nhập đầy đủ thông tin!';
    }
  }
}

Validator.isChoose = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value !== 'default' ? undefined : message || 'Vui lòng chọn một giá trị!';
    }
  }
}

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      //
      const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(value) ? undefined : message || 'Trường này phải là email!';
    }
  }
}

Validator.minLength = function (selector, length, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= length ? undefined : message || `Vui lòng nhập tối thiểu ${length} ký tự!`;
    }
  }
}

Validator.isConfirmed = function (selector, getConfirmedValue, message) {
  return {
    selector: selector,
    test: function (value) {
      console.log(getConfirmedValue());
      return value === getConfirmedValue() ? undefined : message || 'Giá trị nhập vào không chính xác';
    }
  }
}