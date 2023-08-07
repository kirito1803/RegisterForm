const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
//Confirm Button
const confirmBtn = $('.confirm-btn')
const confirmSection = confirmBtn.parentElement
let formState = []

checkFormState = function() {
    if(formState.every((object) => {
        return object.state == true ? true : false
    })) {
        Validator.showConfirmButton()
    }
    else {
        Validator.hideConfirmButton()
    }
}

//Define
Validator = function(data) {
    let formElement = $(data.form)
    formElement.onsubmit = function(e) {
        e.preventDefault()
        window.location.href = 'https://kirito1803.github.io/StarSkyEffect/'
    }
    if(formElement) {
        data.rule.forEach((object)=>{
            formState.push({
                selector: object.selector,
                state: 'empty'
            })
            let inputNode = formElement.querySelector(object.selector)
            inputNode.onblur = () => {
                let inputParent = formElement.querySelector(`${object.selector}`).parentElement
                let warnNode = inputParent.querySelector('.warning')
                if(typeof object.check(inputNode.value) === 'string') {
                    inputParent.classList.add('invalid')
                    warnNode.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                                        </svg>
                                        ${object.check(inputNode.value)}`
                    for(let i=0; i<formState.length; i++) {
                        if(formState[i].selector == object.selector) {
                            formState[i].state = false
                        }
                    }
                    checkFormState()
                }
                else {
                    if(inputParent.classList.contains('invalid')) {
                        inputParent.classList.remove('invalid')
                    }
                    warnNode.innerHTML = ''
                    for(let i=0; i<formState.length; i++) {
                        if(formState[i].selector == object.selector) {
                            formState[i].state = true
                        }
                    }
                    checkFormState()
                }
            }
        })
    }
}


// Check rule:
// Valid => true
// Invalid => error message
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        check: function(value) {
            return value.trim() ? true : `Traveler's name cannot be blank`
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        check: function(email) {
            let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(email) ? true : 'This is not a valid email format'
        }
    }
}

Validator.isPassword = function(selector, min = 6) {
    return {
        selector: selector,
        check: function(value) {
            if(!value.trim()) {
                return `Please enter a password`
            }
            else
                return value.length >= min ? true : `Password must be over 6 characters`
        }
    }
}

Validator.isCorrect = function(selector) {
    return {
        selector: selector, 
        check: function(value) {
            if(!value.trim()) {
                return `Please confirm password`
            }
            else 
                return value==document.querySelector('#password').value ? true : 'Confirm password is wrong'
        }
    }
}

Validator.showConfirmButton = function() {
    confirmBtn.style.display = 'block'
    if(confirmBtn.classList.contains('disappeared'))
        confirmBtn.classList.remove('disappeared')
    confirmBtn.classList.add('appeared')
}

Validator.hideConfirmButton = function() {
    if(confirmBtn.classList.contains('appeared'))
        confirmBtn.classList.remove('appeared')
    confirmBtn.classList.add('disappeared')
    setTimeout(()=>{
        confirmBtn.style.display = 'none'
    }, 2000)
}