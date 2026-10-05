// State Variables
let isChatOpen = false;
let isTypingResponse = false;
let hasUnreadMessage = true; // Initial badge alert

// DOM Elements
const bodyEl = document.body;
const tabIzmir = document.getElementById('tab-izmir');
const tabBartin = document.getElementById('tab-bartin');
const sectionIzmir = document.getElementById('section-izmir');
const sectionBartin = document.getElementById('section-bartin');
const chatWidget = document.getElementById('chat-widget');
const chatTrigger = document.getElementById('chat-trigger');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const statusIndicator = document.getElementById('status-indicator');
const apiModeText = document.getElementById('api-mode-text');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Quick status check to see if backend has real OpenAI API Key
    checkAPIStatus();
    
    // Setup scroll behavior for chat
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// City Theme and Section Switcher
function switchCity(city) {
    if (city === 'izmir') {
        bodyEl.className = 'theme-izmir';
        tabIzmir.classList.add('active');
        tabBartin.classList.remove('active');
        
        sectionIzmir.classList.add('active');
        sectionBartin.classList.remove('active');
    } else if (city === 'bartin') {
        bodyEl.className = 'theme-bartin';
        tabBartin.classList.add('active');
        tabIzmir.classList.remove('active');
        
        sectionBartin.classList.add('active');
        sectionIzmir.classList.remove('active');
    }
    
    // Scroll to top of content smoothly
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Toggle Chatbot Widget
function toggleChat(forceState = null) {
    const nextState = forceState !== null ? forceState : !isChatOpen;
    
    if (nextState === isChatOpen) return;
    
    isChatOpen = nextState;
    
    if (isChatOpen) {
        chatWidget.style.display = 'flex';
        chatTrigger.style.display = 'none';
        chatInput.focus();
        
        // Hide badge notification when chat is opened
        const badge = chatTrigger.querySelector('.badge');
        if (badge) badge.style.display = 'none';
        hasUnreadMessage = false;
    } else {
        chatWidget.style.display = 'none';
        chatTrigger.style.display = 'flex';
    }
}

// Ask predefined question helper
function askQuickQuestion(questionText) {
    if (isTypingResponse) return;
    chatInput.value = questionText;
    // Programmatically trigger form submit
    const submitEvent = new Event('submit', { cancelable: true });
    chatForm.dispatchEvent(submitEvent);
}

// Handle chat submission
async function handleChatSubmit(event) {
    event.preventDefault();
    
    const messageText = chatInput.value.trim();
    if (!messageText || isTypingResponse) return;
    
    // Clear Input
    chatInput.value = '';
    
    // Append User Message
    appendMessage(messageText, 'user');
    
    // Add typing indicator
    const typingIndicatorEl = appendTypingIndicator();
    
    isTypingResponse = true;
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText })
        });
        
        // Remove typing indicator
        removeTypingIndicator(typingIndicatorEl);
        
        if (response.ok) {
            const data = await response.json();
            // Stream the response with realistic letter by letter typing effect
            await streamResponse(data.response, data.source);
            
            // If the backend indicates key is active, ensure indicator is green
            updateStatusLabel(data.source);
        } else {
            const errData = await response.json().catch(() => ({}));
            appendMessage(`Hata: Yanıt alınamadı. ${errData.error || 'Lütfen sunucunun çalıştığından emin olun.'}`, 'bot', 'Sistem');
            isTypingResponse = false;
        }
    } catch (error) {
        removeTypingIndicator(typingIndicatorEl);
        appendMessage('Bağlantı Hatası: Sunucu ile iletişim kurulamadı. Lütfen backend sunucusunun (server.js) çalıştığından emin olun.', 'bot', 'Sistem');
        console.error('API Error:', error);
        isTypingResponse = false;
    }
}

// Append a message to the chat window
function appendMessage(text, sender, source = null) {
    const msgEl = document.createElement('div');
    msgEl.className = `message ${sender}-msg animate-msg`;
    
    const timeString = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    const sourceLabel = source ? `<span class="msg-source">${source}</span>` : '';
    
    msgEl.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
        <div class="msg-content-wrapper">
            <div class="msg-content">${sender === 'user' ? escapeHTML(text) : parseMarkdown(text)}</div>
            <span class="msg-time">${timeString} ${sourceLabel}</span>
        </div>
    `;
    
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Stream bot response with a letters-typing animation
function streamResponse(fullText, source) {
    return new Promise((resolve) => {
        const msgEl = document.createElement('div');
        msgEl.className = 'message bot-msg animate-msg';
        
        const timeString = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
        const sourceLabel = `<span class="msg-source" style="opacity: 0.7; font-size: 0.7rem; margin-left: 5px;">(${source})</span>`;
        
        msgEl.innerHTML = `
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-content-wrapper">
                <div class="msg-content"></div>
                <span class="msg-time">${timeString} ${sourceLabel}</span>
            </div>
        `;
        
        chatMessages.appendChild(msgEl);
        const contentEl = msgEl.querySelector('.msg-content');
        
        // Typing animation details
        let i = 0;
        const speed = 7; // milliseconds per character
        
        // For streaming, we construct the text step-by-step
        // We will output plain text, then once complete, render the parsed markdown.
        // This is safe and looks like real streaming text typing.
        function type() {
            if (i < fullText.length) {
                // Peek a bit of text to show progress
                contentEl.textContent = fullText.substring(0, i + 1);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(type, speed);
            } else {
                // Done writing. Apply final markdown formatting!
                contentEl.innerHTML = parseMarkdown(fullText);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                isTypingResponse = false;
                resolve();
            }
        }
        
        type();
    });
}

// Typing Indicator Helpers
function appendTypingIndicator() {
    const indicatorEl = document.createElement('div');
    indicatorEl.className = 'message bot-msg animate-msg typing-container';
    indicatorEl.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-content-wrapper">
            <div class="msg-content" style="padding: 0.5rem 1rem;">
                <div class="typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        </div>
    `;
    chatMessages.appendChild(indicatorEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicatorEl;
}

function removeTypingIndicator(indicatorEl) {
    if (indicatorEl && indicatorEl.parentNode) {
        indicatorEl.parentNode.removeChild(indicatorEl);
    }
}

// Clear Chat History
function clearChat() {
    if (isTypingResponse) return;
    
    // Preserve only the welcome message
    chatMessages.innerHTML = `
        <div class="message bot-msg animate-msg">
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-content-wrapper">
                <div class="msg-content">
                    Sohbet geçmişi temizlendi. 🧹
                    <br><br>
                    Bartın, Amasra veya İzmir hakkında sormak istediğiniz soruları buraya yazabilirsiniz. Size nasıl yardımcı olabilirim?
                </div>
                <span class="msg-time">Şimdi</span>
            </div>
        </div>
    `;
}

// Simple Local API status check on startup
async function checkAPIStatus() {
    try {
        // We can just ask a quick mock message or check if server is active.
        // Let's call /api/chat with a simple ping to see if server responds and what mode it is in.
        // To avoid polluting the chat log, we make a stealth request or check server configuration.
        // Since we don't have a status endpoint, let's create a placeholder or check status.
        // Let's perform a lightweight check by requesting status. We'll add `/api/status` in server.js.
        const res = await fetch('/api/status').catch(() => null);
        if (res && res.ok) {
            const data = await res.json();
            updateStatusLabel(data.mode);
        } else {
            // Fallback status if /api/status is not yet updated
            updateStatusLabel('Simulated OpenAI API (Offline Mode)');
        }
    } catch (e) {
        updateStatusLabel('Bağlantı Yok');
    }
}

function updateStatusLabel(modeText) {
    if (!statusIndicator || !apiModeText) return;
    
    apiModeText.textContent = modeText;
    
    if (modeText.includes('Gerçek') || modeText.includes('OpenAI API') && !modeText.includes('Simulated')) {
        statusIndicator.className = 'status-indicator';
        apiModeText.textContent = 'Gerçek OpenAI (Çevrimiçi)';
    } else if (modeText.includes('Bağlantı Yok')) {
        statusIndicator.className = 'status-indicator offline';
        apiModeText.textContent = 'Sunucu Bağlantısı Yok';
    } else {
        statusIndicator.className = 'status-indicator simulated';
        apiModeText.textContent = 'Yapay Zeka Simülatörü (Çevrimdışı)';
    }
}

// Helpers
function escapeHTML(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Lightweight Regex Markdown Parser for Rich Visual Output
function parseMarkdown(text) {
    let html = text;

    // Headings: ### Heading Text
    html = html.replace(/^### (.*?)$/gim, '<h3>$1</h3>');
    
    // Bold: **Text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Bullet lists: - List item
    html = html.replace(/^\s*[-*]\s+(.*?)$/gim, '<li>$1</li>');
    
    // Combine consecutive <li> elements in a <ul> list
    // A clean regex replacement to group list items
    html = html.replace(/(<li>.*?<\/li>)+/gs, (match) => {
        return `<ul>${match}</ul>`;
    });

    // Replace line breaks with HTML breaks, except inside tag brackets
    html = html.replace(/\n/g, '<br>');
    
    // Clean up empty line double breaks
    html = html.replace(/(<br>\s*){2,}/g, '<br><br>');
    
    return html;
}
