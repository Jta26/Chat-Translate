

const hamburgerMenu = document.querySelector('.m-hamburger');
const hamburgerClose = document.querySelector('.m-hamburger-close');
const toShow = document.querySelectorAll('#conversation-list, #search-container, #new-msg-container');
const toGrid = document.querySelectorAll('  #chat-title, #chat-message-list, #chat-form');
const mChatContainer = document.querySelector('#chat-container');
let mIsHamburgerOpen = false;

hamburgerMenu.addEventListener('click', () => toggleHamburger());
hamburgerClose.addEventListener('click', () => toggleHamburger());

const toggleHamburger = (e) => {
    console.log('test');
    mIsHamburgerOpen = !mIsHamburgerOpen;
    mChatContainer.style.display = mIsHamburgerOpen ? 'block' : 'grid';
    for (let elem of toGrid) {
        if (elem.id == 'chat-title' || elem.id == 'chat-form') {
            elem.style.display = mIsHamburgerOpen ? 'none' : 'flex';
        }
    }
    for (let elem of toShow) {
        elem.style.width = mIsHamburgerOpen ? '100vw' : '';
        if (elem.id == 'search-container') {
            if (mIsHamburgerOpen) {
                elem.style.height = '10vh';
                elem.style.display = 'flex';
            }
            else {
                elem.style.height = '';
                elem.style.display = ''
            }
        }
        else if (elem.id == 'conversation-list') {
            if (mIsHamburgerOpen) {
                elem.style.height = '75vh';
                elem.style.display =  'block';
                elem.style.padding = '20px';
            }
            else {
                elem.style.height = '';
                elem.style.display =  '';
                elem.style.padding = '';
            }
            
        }
        else {
            elem.style.height = mIsHamburgerOpen ? '15vh' : '';
            elem.style.display = mIsHamburgerOpen ? 'flex' : '';
        }
    }
}