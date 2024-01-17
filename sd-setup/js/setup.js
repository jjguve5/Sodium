class Setup {
    constructor() {
        this.currentStep = 0;
        this.steps = document.querySelectorAll('.setup-step');

        const urlParams = new URLSearchParams(window.location.search);
        const stepParam = urlParams.get('step');

        if (stepParam !== null) {
            const step = parseInt(stepParam);
            if (!isNaN(step) && step >= 0 && step < this.steps.length) {
                this.goToStep(step);
            }
        }

    }

    goToNextStep() {
        this.goToStep(Math.min(this.steps.length - 1, this.currentStep + 1));
    }

    goToPreviousStep() {
        this.goToStep(Math.max(0, this.currentStep - 1));
    }

    setConfigParameters() {
        const databaseName = document.getElementById('databaseNameInput').value;
        const username = document.getElementById('usernameInput').value;
        const password = document.getElementById('passwordInput').value;
        const host = document.getElementById('hostInput').value;
        
        // Send data to setup_db.php via fetch or XMLHttpRequest
        fetch('backend/setup_db.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                database_name: databaseName,
                database_username: username,
                database_password: password,
                database_host: host
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Handle success or errors returned from setup_db.php
            if (data.errors) {
                // Handle errors - Show to the user or take appropriate action
                console.error('Setup errors:', data.errors);
            } else {
                // Success - Show success message or proceed to the next step
                console.log('Setup successful:', data.message);
                this.goToNextStep();
            }
        })
        .catch(error => {
            // Handle fetch errors
            console.error('Fetch error:', error);
        });
    }

    registerUser(){
        const email = document.getElementById('emailInput').value;
        const pass = document.getElementById('passInput').value;

        fetch('backend/register_user.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                pass: pass
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            // Handle registration success or errors from the backend
            if (data.errors) {
                console.error('Registration errors:', data.errors);
            } else {
                console.log('Registration successful:', data.message);
                this.goToNextStep();
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
    }

    sendToManager(){
        window.location.href = "../sd-admin";
    }

    hideAllSteps() {
        this.steps.forEach(step => {
            step.classList.remove('active');
        });
    }

    goToStep(step) {
        if (step === this.currentStep) return;

        this.hideAllSteps();

        this.steps[step].classList.add('active');
        this.currentStep = step;

        // Write step number into the URL as a query parameter
        const url = new URL(window.location.href);
        url.searchParams.set('step', step);
        window.history.pushState({ path: url.href }, '', url.href);
    }
}

const setupManager = new Setup();
