// Fungsi yang dijalankan ketika DOM sepenuhnya dimuat
document.addEventListener('DOMContentLoaded', function() {
   
    const tweetInput = document.querySelector('.tweetbox-message-input-area-inner');
    const tweetButton = document.querySelector('.tweetbox-toolbar-area-right-col1-button');
    const imageButton = document.querySelector('.tweetbox-toolbar-area-left-col1 img');
    const col2 = document.querySelector('.col2');
    
   
    let tweetsContainer = document.querySelector('.tweets-container');
    if (!tweetsContainer) {
        tweetsContainer = document.createElement('div');
        tweetsContainer.className = 'tweets-container';
        tweetsContainer.style.maxHeight = '600px';
        tweetsContainer.style.overflowY = 'auto';
        tweetsContainer.style.marginTop = '20px';
        col2.appendChild(tweetsContainer);
    }
    
  
    tweetInput.contentEditable = true;
    tweetInput.style.minHeight = '50px';
    tweetInput.style.padding = '10px';
    tweetInput.style.border = '1px solid #e6ecf0';
    tweetInput.style.borderRadius = '5px';
    tweetInput.style.outline = 'none';
    tweetInput.setAttribute('placeholder', 'Apa yang sedang terjadi?');
    
   
    let selectedImage = null;
    let editingTweetId = null;
    
   
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    
    imageButton.addEventListener('click', function() {
        fileInput.click();
    });
    
   
    fileInput.addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(event) {
                selectedImage = event.target.result;
                
               
                let imagePreview = document.querySelector('.image-preview');
                if (!imagePreview) {
                    imagePreview = document.createElement('div');
                    imagePreview.className = 'image-preview';
                    imagePreview.style.marginTop = '10px';
                    tweetInput.parentNode.appendChild(imagePreview);
                }
                
                imagePreview.innerHTML = `
                    <img src="${selectedImage}" style="max-width: 100%; max-height: 200px; border-radius: 10px;" />
                    <button class="remove-image" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">✕</button>
                `;
                
                
                document.querySelector('.remove-image').addEventListener('click', function() {
                    imagePreview.remove();
                    selectedImage = null;
                });
            };
            
            reader.readAsDataURL(e.target.files[0]);
        }
    });
    
   
    function generateTweetId() {
        return Date.now().toString();
    }
    
    
    function loadTweets() {
        const tweets = JSON.parse(localStorage.getItem('tweets') || '[]');
        tweetsContainer.innerHTML = '';
        
        tweets.forEach(function(tweet) {
            displayTweet(tweet);
        });
    }
    
    
    function displayTweet(tweet) {
        const tweetElement = document.createElement('div');
        tweetElement.className = 'tweet';
        tweetElement.dataset.id = tweet.id;
        tweetElement.style.padding = '15px';
        tweetElement.style.borderBottom = '1px solid #e6ecf0';
        tweetElement.style.display = 'flex';
        
        
        const userIconPart = document.createElement('div');
        userIconPart.className = 'tweet-user-icon';
        userIconPart.style.marginRight = '10px';
        userIconPart.innerHTML = `<img src="/assets/user.jpg" style="width: 48px; height: 48px; border-radius: 50%;">`;
        
       
        const contentPart = document.createElement('div');
        contentPart.className = 'tweet-content';
        contentPart.style.flex = '1';
        
        // Informasi pengguna dan tanggal
        const userInfo = document.createElement('div');
        userInfo.className = 'tweet-user-info';
        userInfo.style.marginBottom = '5px';
        userInfo.innerHTML = `
            <span style="font-weight: bold;">RayhanAurelia</span>
            <span style="color: #657786; margin-left: 5px;">@TepusingRPL</span>
            <span style="color: #657786; margin-left: 5px;">${new Date(parseInt(tweet.id)).toLocaleString()}</span>
        `;
        
        
        const tweetText = document.createElement('div');
        tweetText.className = 'tweet-text';
        tweetText.style.marginBottom = '10px';
        tweetText.innerHTML = tweet.text.replace(/\n/g, '<br>');
        
       
        const tweetImage = document.createElement('div');
        tweetImage.className = 'tweet-image';
        if (tweet.image) {
            tweetImage.innerHTML = `<img src="${tweet.image}" style="max-width: 100%; border-radius: 10px; margin-bottom: 10px;">`;
        }
        
       
        const actionButtons = document.createElement('div');
        actionButtons.className = 'tweet-actions';
        actionButtons.style.display = 'flex';
        actionButtons.style.gap = '10px';
        actionButtons.innerHTML = `
            <button class="edit-button" style="background: #1da1f2; color: white; border: none; padding: 5px 10px; border-radius: 20px; cursor: pointer;">Edit</button>
            <button class="delete-button" style="background: #e0245e; color: white; border: none; padding: 5px 10px; border-radius: 20px; cursor: pointer;">Hapus</button>
        `;
        
        
        contentPart.appendChild(userInfo);
        contentPart.appendChild(tweetText);
        contentPart.appendChild(tweetImage);
        contentPart.appendChild(actionButtons);
        
       
        tweetElement.appendChild(userIconPart);
        tweetElement.appendChild(contentPart);
        
        
        tweetsContainer.prepend(tweetElement);
        
     
        tweetElement.querySelector('.edit-button').addEventListener('click', function() {
            editTweet(tweet.id);
        });
        
        tweetElement.querySelector('.delete-button').addEventListener('click', function() {
            deleteTweet(tweet.id);
        });
    }
    
   
    function saveTweet(tweet) {
        const tweets = JSON.parse(localStorage.getItem('tweets') || '[]');
        
        if (editingTweetId) {
          
            const index = tweets.findIndex(t => t.id === editingTweetId);
            if (index !== -1) {
                tweets[index] = tweet;
            }
            editingTweetId = null;
        } else {
           
            tweets.unshift(tweet);
        }
        
        localStorage.setItem('tweets', JSON.stringify(tweets));
        loadTweets();
    }
    

    function deleteTweet(id) {
        if (confirm('Yakin Nih?')) {
            const tweets = JSON.parse(localStorage.getItem('tweets') || '[]');
            const updatedTweets = tweets.filter(tweet => tweet.id !== id);
            localStorage.setItem('tweets', JSON.stringify(updatedTweets));
            loadTweets();
        }
    }
    
    
    function editTweet(id) {
        const tweets = JSON.parse(localStorage.getItem('tweets') || '[]');
        const tweet = tweets.find(t => t.id === id);
        
        if (tweet) {
            tweetInput.innerHTML = tweet.text;
            editingTweetId = id;
            tweetButton.textContent = 'Simpan';
            
      
            if (tweet.image) {
                selectedImage = tweet.image;
                
                let imagePreview = document.querySelector('.image-preview');
                if (!imagePreview) {
                    imagePreview = document.createElement('div');
                    imagePreview.className = 'image-preview';
                    imagePreview.style.marginTop = '10px';
                    tweetInput.parentNode.appendChild(imagePreview);
                }
                
                imagePreview.innerHTML = `
                    <img src="${selectedImage}" style="max-width: 100%; max-height: 200px; border-radius: 10px;" />
                    <button class="remove-image" style="position: absolute; top: 5px; right: 5px; background: rgba(0,0,0,0.7); color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer;">✕</button>
                `;
                
                document.querySelector('.remove-image').addEventListener('click', function() {
                    imagePreview.remove();
                    selectedImage = null;
                });
            }
            
           
            tweetInput.scrollIntoView({ behavior: 'smooth' });
            tweetInput.focus();
        }
    }
    
    // Mengatur tombol tweet/simpan
    tweetButton.addEventListener('click', function() {
        const text = tweetInput.innerText.trim();
        
        if (text || selectedImage) {
            const tweetId = editingTweetId || generateTweetId();
            const tweet = {
                id: tweetId,
                text: text,
                image: selectedImage,
                timestamp: new Date().toISOString()
            };
            
            saveTweet(tweet);
            
            // Mereset formulir
            tweetInput.innerHTML = '';
            selectedImage = null;
            const imagePreview = document.querySelector('.image-preview');
            if (imagePreview) {
                imagePreview.remove();
            }
            
            tweetButton.textContent = 'Tweet';
        }
    });
    
    // Memuat tweet yang ada saat halaman dimuat
    loadTweets();
});
