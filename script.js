async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const chatBox = document.getElementById('chat-box');

    // User message
    const userMessage = document.createElement('div');
    userMessage.className = 'message user-message';
    userMessage.textContent = userInput;
    chatBox.appendChild(userMessage);

    // Clear input and focus
    const inputField = document.getElementById('user-input');
    inputField.value = '';
    inputField.focus();

    // Disable input temporarily
    inputField.disabled = true;

    // Show loading indicator
    const loadingMessage = showLoadingIndicator(chatBox);

    // Normalize input
    const normalizedInput = userInput.trim().toLowerCase();

    // Fetch country information
    const countryData = await fetchCountryData(normalizedInput);

    // Remove loading indicator
    chatBox.removeChild(loadingMessage);

    // Handle the bot response
    const botMessage = document.createElement('div');
    botMessage.className = 'message bot-message';

    if (countryData) {
        botMessage.innerHTML = formatCountryInfo(countryData);
    } else {
        botMessage.textContent = `Sorry, I couldn't find any information about "${userInput}".`;
    }

    chatBox.appendChild(botMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Re-enable input
    inputField.disabled = false;
}

// Fetch country data from REST Countries API
async function fetchCountryData(country) {
    const apiUrl = `https://restcountries.com/v3.1/name/${country}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data[0]; // Return the first country's data
    } catch (error) {
        console.error('Error fetching country data:', error);
        return null; // Return null in case of error
    }
}

// Format country information for display
function formatCountryInfo(data) {
    return `
        <strong>${data.name.common}</strong><br>
        <strong>Capital:</strong> ${data.capital ? data.capital[0] : 'N/A'}<br>
        <strong>Population:</strong> ${data.population.toLocaleString()}<br>
        <strong>Area:</strong> ${data.area.toLocaleString()} km²<br>
        <strong>Languages:</strong> ${Object.values(data.languages).join(', ')}<br>
        <strong>Currencies:</strong> ${Object.values(data.currencies).map(c => c.name).join(', ')}<br>
        <img src="${data.flags.svg}" alt="Flag of ${data.name.common}" style="width: 50px; height: auto;"><br>
    `;
}

// Show loading indicator
function showLoadingIndicator(chatBox) {
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'message bot-message';
    loadingMessage.textContent = "Loading...";
    chatBox.appendChild(loadingMessage);
    return loadingMessage;
}

// List of all countries from the REST Countries API
function getCountryList() {
    return `
        Afghanistan, Albania, Algeria, Andorra, Angola, Antigua and Barbuda, Argentina, Armenia, Australia, Austria, Azerbaijan,
        Bahamas, Bahrain, Bangladesh, Barbados, Belarus, Belgium, Belize, Benin, Bhutan, Bolivia, Bosnia and Herzegovina, 
        Botswana, Brazil, Brunei, Bulgaria, Burkina Faso, Burundi, Cabo Verde, Cambodia, Cameroon, Canada, Central African Republic,
        Chad, Chile, China, Colombia, Comoros, Congo (Congo-Brazzaville), Costa Rica, Croatia, Cuba, Cyprus, Czechia (Czech Republic),
        Democratic Republic of the Congo, Denmark, Djibouti, Dominica, Dominican Republic, Ecuador, Egypt, El Salvador, Equatorial Guinea,
        Eritrea, Estonia, Eswatini, Ethiopia, Fiji, Finland, France, Gabon, Gambia, Georgia, Germany, Ghana, Greece, Grenada, Guatemala,
        Guinea, Guinea-Bissau, Guyana, Haiti, Honduras, Hungary, Iceland, India, Indonesia, Iran, Iraq, Ireland, Israel, Italy, Ivory Coast,
        Jamaica, Japan, Jordan, Kazakhstan, Kenya, Kiribati, Kuwait, Kyrgyzstan, Laos, Latvia, Lebanon, Lesotho, Liberia, Libya, Liechtenstein,
        Lithuania, Luxembourg, Madagascar, Malawi, Malaysia, Maldives, Mali, Malta, Marshall Islands, Mauritania, Mauritius, Mexico, Micronesia,
        Moldova, Monaco, Mongolia, Montenegro, Morocco, Mozambique, Myanmar (formerly Burma), Namibia, Nauru, Nepal, Netherlands, New Zealand,
        Nicaragua, Niger, Nigeria, North Korea, North Macedonia, Norway, Oman, Pakistan, Palau, Panama, Papua New Guinea, Paraguay, Peru, Philippines,
        Poland, Portugal, Qatar, Romania, Russia, Rwanda, Saint Kitts and Nevis, Saint Lucia, Saint Vincent and the Grenadines, Samoa, San Marino,
        Sao Tome and Principe, Saudi Arabia, Senegal, Serbia, Seychelles, Sierra Leone, Singapore, Slovakia, Slovenia, Solomon Islands, Somalia,
        South Africa, South Korea, South Sudan, Spain, Sri Lanka, Sudan, Suriname, Sweden, Switzerland, Syria, Tajikistan, Tanzania, Thailand,
        Timor-Leste, Togo, Tonga, Trinidad and Tobago, Tunisia, Turkey, Turkmenistan, Tuvalu, Uganda, Ukraine, United Arab Emirates, United Kingdom,
        United States, Uruguay, Uzbekistan, Vanuatu, Vatican City, Venezuela, Vietnam, Yemen, Zambia, Zimbabwe
    `;
}

// Voice input feature
function startVoiceInput() {
    const recognition = new(window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('user-input').value = transcript;
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error:', event.error);
        alert("Sorry, I couldn't process your voice input. Please try again.");
    };
}

// Initial prompt
function askUserWhatToKnow() {
    const chatBox = document.getElementById('chat-box');
    const initialMessage = document.createElement('div');
    initialMessage.className = 'message bot-message';
    initialMessage.textContent = "You can ask me about countries, capitals, or populations.";
    chatBox.appendChild(initialMessage);
}

// Call the initial prompt when the page loads
window.onload = askUserWhatToKnow;