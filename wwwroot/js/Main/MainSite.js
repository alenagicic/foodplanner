const wrapperMAIN = document.querySelector(".main-wrapper")

window.onload = () => {
        wrapperMAIN.style.transitionDuration = "1s"
        wrapperMAIN.style.opacity = "1"
}

// Account settings on index page, toggle pop

const buttonToggleIndex = document.querySelectorAll(".index-account-heading")
const notificationsDiv = document.querySelector(".index-notifications")
const accountsDiv = document.querySelector(".index-account")

// Below is for index account
buttonToggleIndex[0].addEventListener("mousedown", (e) => {

    if(notificationsDiv.style.display == "none")
        notificationsDiv.style.display = "flex"
    else{
        notificationsDiv.style.display = "none"
    }
})
buttonToggleIndex[1].addEventListener("mousedown", (e) => {
    if(accountsDiv.style.display == "none")
        accountsDiv.style.display = "flex"; 
    else{
        accountsDiv.style.display = "none";
    }
})

// BELOW IS FOR INDEX VIEW THE LATEST RECIPE & CONVOS
const communityPress = document.querySelectorAll(".index-latest-convos")
const generatorItems = document.querySelectorAll(".index-latest-recipes")

// Below is for index food latest
function loadPopupIndex(id) {
    fetch(window.location.origin + `/discover/getrecipe/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            createPopupIndex(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
function createPopupIndex(data) {
    // Create the popup container (previously pp-disc-pop-overlay)
    
    const popup = document.createElement('div');
    popup.classList.add('pp-disc-pop');
    
        // Create and add the heading
        const heading = document.createElement('div');
        const headingImage = document.createElement('img')
        const headingPara = document.createElement('h3')
        headingPara.innerText = `${data.heading}`
        const headingCreator = document.createElement('p')
        headingCreator.innerText = `Contributor: ${data.author}`
        headingImage.src = data.imageRecipe
        headingImage.classList.add('header-image-recipe')
        heading.classList.add('pp-disc-pop-head');
        heading.appendChild(headingPara)
        heading.appendChild(headingCreator)
        heading.appendChild(headingImage)
        popup.appendChild(heading);
    
    // Create the body content container
    const bodyWrap = document.createElement('div');
    bodyWrap.classList.add('pp-disc-pop-wrap-bdy');
    
    // Instructions section
    const instructions = document.createElement('p');
    instructions.classList.add('pp-disc-pop-bdy');
    instructions.innerHTML = `<label>Instructions:</label> ${data.bodyRecipe}`;
    bodyWrap.appendChild(instructions);
    
    // Ingredient section
    const Ingredient = document.createElement('p');
    Ingredient.classList.add('pp-disc-pop-ingr');
    Ingredient.innerHTML = `<label>Ingredients:</label> ${data.ingredientRecipe}`; 
    bodyWrap.appendChild(Ingredient);

    // Rating section
    const rating = document.createElement('p');
    rating.classList.add('pp-disc-pop-rate');
    rating.innerHTML = `<label>Rating:</label> ${data.ratingRecipe}`; 
    bodyWrap.appendChild(rating);
    
    // Tags section (only if tagsRecipe is populated)
    if (data.tagsRecipe && data.tagsRecipe.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.classList.add('pp-disc-pop-tag');
        tagsContainer.innerHTML = '<label>Tags:</label>';
        
        data.tagsRecipe.forEach(tag => {
            const tagElement = document.createElement('p');
            tagElement.textContent = tag.tag; 
            tagsContainer.appendChild(tagElement);
        });
        bodyWrap.appendChild(tagsContainer);
    }
    
    // Append the body container to the popup
    popup.appendChild(bodyWrap);
    
    // Hidden ID field
    const hiddenId = document.createElement('p');
    hiddenId.id = 'hidden-id';
    hiddenId.style.display = 'none';
    hiddenId.textContent = data.id; 
    popup.appendChild(hiddenId);
    
    // Button to cart
    const button = document.createElement('div');
    button.classList.add('pp-disc-pop-btn');
    button.textContent = 'Add';
    popup.appendChild(button);

    // Button to exit
    const buttonExit = document.createElement('div');
    buttonExit.classList.add('pp-disc-pop-btn-exit');
    buttonExit.textContent = 'Exit';
    popup.appendChild(buttonExit);
    
    // Append the popup to the body (no overlay div anymore)
    document.body.appendChild(popup);

    button.addEventListener("mousedown", (e) => {
        localStorage.setItem(`food${data.id}`, data.heading);
        popup.style.display = "none"

        const buttonConfirm = document.querySelectorAll(".header-button")
    
        setTimeout(() => {
            buttonConfirm[1].style.backgroundColor = "#1abc9c"
            buttonConfirm[1].style.color = "white"
        }, 100);
    
        setTimeout(() => {
            buttonConfirm[1].style.backgroundColor = "" 
            buttonConfirm[1].style.color = ""  
        }, 1000); 
    });

    buttonExit.addEventListener("mousedown", (e) => {
        popup.style.display = "none"
    })
}

// GLOBAL VARIABLES FOR THE CHAT

// String title
let GlobalTopicText = ""
// String comment
let GlobalTopicId = ""
// String reply press parent id 
let ParentReply = ""
// State of main window
let ParentState = null

// ACTIVATE SHOWTOPIC
function showTopic(value, id){

    const url = window.location.href
    // RETRIEVE DATA FROM DATABASE (SEE IF WE CAN REFACTOR THIS TO ONLY LOAD A FEW COMMENTS AT A TIME)

    fetch(url + `community/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
        })
        .then((data) => data.json())
        .then((data) => {

            // BEFORE LOADING NEW CHAT REMOVE OLD
            const mainChat = document.querySelector(".displayTopic-wrapper");
            if(mainChat){
                mainChat.remove();
            }
            
            // CREATE INITIAL GENERAL TOPIC CONTAINER
            createInitialTopicContainer(value)

            // POPULATE THREAD START/TOPIC
            populateInitialTopic(data)

            // POPULATE WITH THE INITIAL COMMENTS
            populateInitialComments(data)

            // TRIGGER SUBMITTING COMMENTS TO THE MAIN THREAD (COMMENT AT TOP OF HIERARCHY)
            commentTopicMain(value, id)

            // EVENT LISTENERS FOR REMOVING TOPIC ALTOGETHER
            setTimeout(() => {
                const exitButton = document.querySelector(".exitbutton")
                const topicWrapper = document.querySelector(".displayTopic-wrapper")
                exitButton.addEventListener("mousedown", (e) => {
                    topicWrapper.remove()
                })
                exitButton.addEventListener("keydown", (e) => {
                    if(e.key === "Enter"){
                        topicWrapper.remove()
                    }
                })
            }, 100);

            // EVENT LISTENERS FOR REPLY
            const paraReply = document.querySelectorAll(".comment-reply")
            paraReply.forEach((item) => {
                item.addEventListener("mousedown", (e) => {

                    // GRAB THE MAIN CONTAINER FOR COMMENT BUTTON
                    const divWithId = item.closest('div');
                    const paragraphs = divWithId.querySelectorAll('p');
                    
                    // EXTRACT THE ID VALUES FOR COMMENT ID AND THREAD ID
                    const [commentId, topicId] = divWithId.id.match(/comment(\S+)topic(\S+)/).slice(1, 3);

                    // REFERENCE TO THE PARENT DIV
                    ParentReply = divWithId.id
                    
                    // CREATE THE COMPONENTS
                    const returnButton = document.createElement('i')
                    returnButton.classList.add("fa-solid", "fa-arrow-left");
                    const newTextArea = document.createElement("textarea");
                    const newWrapperDiv = document.createElement("div");
                    const placeholder = document.createElement("p");

                    returnButton.tabIndex = "1"
                    newTextArea.tabIndex = "2"

                    // ASSIGN CLASSNAMES (IN _CHAT.SCSS)
                    const mainWrapperChats = document.querySelector(".displayTopic-wrapper")
                    mainWrapperChats.style.justifyContent = "normal"

                    // SET STYLES FOR THE REPLY FORM AND ALL AROUND
                    placeholder.style.cssText = `
                        background-color: #1abc9c;
                        color: #e74c3c;
                        margin: 0px;
                        padding: 0.5rem;
                        border-top-left-radius:0.2rem; 
                        border-top-right-radius:0.2rem;
                    `;
                    placeholder.innerHTML = `
                    <span style="color: whitesmoke; font-size: 0.9rem;">
                            Currently replying to: <span style="font-weight:600">${paragraphs[0].innerText}</span>
                            on message: <span style="font-weight:600">${paragraphs[1].innerText.slice(0, 25)}...</span>
                    </span>`;
                    newWrapperDiv.style.cssText = `
                        width: 100%;
                        min-height: 5rem;
                        margin-bottom: auto;
                    `;
                    newTextArea.style.cssText = `
                        width: 100%;
                        min-height: 10rem;
                        padding-left:0.5rem;
                        padding-top:0.5rem;
                        border-radius:0.2rem;
                    `;
                    newTextArea.addEventListener('focus', () => {
                        newTextArea.style.cssText = `
                            outline: none;
                            width:100%;
                            height:15rem;
                            box-sizing: border-box;
                            border:2px solid #1abc9c;
                            padding-left:0.5rem;
                            padding-top:0.5rem;
                            border-bottom-left-radius: 0.2rem;
                            border-bottom-right-radius: 0.2rem;

                        `;
                    });
                
                    // ASSEMBLE AND REPLACE COMPONENTS
                    newWrapperDiv.append(returnButton, placeholder, newTextArea);
                    document.querySelector(".commentArea").replaceWith(newWrapperDiv);
                
                    // FOCUS ON THE NEW TEXTAREA AFTER A SLIGHT DELAY
                    setTimeout(() => newTextArea.focus(), 100);
                
                    // REMOVE THE BODY TOPIC AND SEND THE COMMENT DATA
                    document.querySelector(".bodyTopic").remove();

                    const submitButton = document.querySelector(".submitButton")
                    const newSubmit = document.createElement("div")
                    newSubmit.tabIndex = "3"
                    newSubmit.classList.add("submitButton")
                    submitButton.replaceWith(newSubmit)
                    newSubmit.innerText = "Submit"

                    // SUBMIT RESPONSE COMMENT AND RELOAD WINDOW + SCROLL TO THE COMMENT SUBMITTED!
                    newSubmit.addEventListener("mousedown", (e) => {
                        commentComment(topicId, commentId, newTextArea.value);

                        setTimeout(() => {
                               showTopic(value, id)
                        }, 500);
                     
                        // AFTER COMMENT HAS BEEN SUBMITTED: RELOAD THE COMMENTS WINDOW AND SEARCH FOR THE SUBMITTED COMMENT: FOCUS ON IT!
                        const intervalId = setInterval(() => {
                            const itemElement = document.getElementById(ParentReply);

                            setTimeout(() => {
                             
                                    const collapseButtons = document.querySelectorAll(".collapse-button-cmnt");
  
                                    // EXPANDS THE PARENT WHERE THE COMMENT BELONGS TO!
                                    collapseButtons.forEach((button) => {
                                           
                                                if(button.closest('div').id.includes(divWithId.id)){
                                           
                                                    const parentContainer = button.closest("div");
                                                    const commentToCollapse = parentContainer.parentNode;
                                            
                                                    if (commentToCollapse.children[1]) {
                                                        commentToCollapse.children[1].style.display = "flex";
                                                        commentToCollapse.children[1].style.flexDirection = "column"
                                                        commentToCollapse.children[1].lastElementChild.scrollIntoView('smooth')
                                                    }
                                            
                                                    button.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
                                                } 
                                   
                                    })

                                    // CHECKS TO SEE IF ANY COMMENTS WITHIN THE MAIN COMMENT ARE EXPANDED: IF YES: EXPAND THEM ALL!
                                    setTimeout(() => {

                                        const innerItems = document.querySelectorAll(".fa-chevron-down");

                                        innerItems.forEach((item) => {
                                            const wrapperDiv = item.closest('div')
                                            const itemsToLookFor = wrapperDiv && wrapperDiv.parentNode ? wrapperDiv.parentNode.querySelectorAll('.fa-chevron-up') : null;
                                            const itemsToClickOn = wrapperDiv && wrapperDiv.parentNode ? wrapperDiv.parentNode.querySelectorAll('.fa-chevron-down') : null;
                                            
                                            if(itemsToLookFor === null){
                                                return
                                            }

                                            if (itemsToLookFor.length > 0) {

                                                itemsToClickOn.forEach((actualChevronUP) => {

                                                    const mouseDownEvent = new MouseEvent('mousedown', {
                                                        bubbles: true,     
                                                        cancelable: true,   
                                                        view: window  
                                                    });
                                        
                                                    actualChevronUP.dispatchEvent(mouseDownEvent);

                                                
                                            });
                                        }
                                        });
                                 
                                    }, 100);

                                    
                            }, 200);
                            
                            if (itemElement) {
                                clearInterval(intervalId);
                            }
                        }, 500);
  
                    })

                    newSubmit.addEventListener("keydown", (e) => {
                        if(e.key === "Enter"){
                            commentComment(topicId, commentId, newTextArea.value);

                            setTimeout(() => {
                                   showTopic(value, id)
                            }, 500);
                         
                            // AFTER COMMENT HAS BEEN SUBMITTED: RELOAD THE COMMENTS WINDOW AND SEARCH FOR THE SUBMITTED COMMENT: FOCUS ON IT!
                            const intervalId = setInterval(() => {
                                const itemElement = document.getElementById(ParentReply);
    
                                setTimeout(() => {
                                 
                                        const collapseButtons = document.querySelectorAll(".collapse-button-cmnt");
      
                                        // EXPANDS THE PARENT WHERE THE COMMENT BELONGS TO!
                                        collapseButtons.forEach((button) => {
                                               
                                                    if(button.closest('div').id.includes(divWithId.id)){
                                               
                                                        const parentContainer = button.closest("div");
                                                        const commentToCollapse = parentContainer.parentNode;
                                                
                                                        if (commentToCollapse.children[1]) {
                                                            commentToCollapse.children[1].style.display = "flex";
                                                            commentToCollapse.children[1].style.flexDirection = "column"
                                                            commentToCollapse.children[1].lastElementChild.scrollIntoView('smooth')
                                                        }
                                                
                                                        button.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
                                                    } 
                                       
                                        })
    
                                        // CHECKS TO SEE IF ANY COMMENTS WITHIN THE MAIN COMMENT ARE EXPANDED: IF YES: EXPAND THEM ALL!
                                        setTimeout(() => {
    
                                            const innerItems = document.querySelectorAll(".fa-chevron-down");
    
                                            innerItems.forEach((item) => {
                                                const wrapperDiv = item.closest('div')
                                                const itemsToLookFor = wrapperDiv && wrapperDiv.parentNode ? wrapperDiv.parentNode.querySelectorAll('.fa-chevron-up') : null;
                                                const itemsToClickOn = wrapperDiv && wrapperDiv.parentNode ? wrapperDiv.parentNode.querySelectorAll('.fa-chevron-down') : null;
                                                
                                                if(itemsToLookFor === null){
                                                    return
                                                }
    
                                                if (itemsToLookFor.length > 0) {
    
                                                    itemsToClickOn.forEach((actualChevronUP) => {
    
                                                        const mouseDownEvent = new MouseEvent('mousedown', {
                                                            bubbles: true,     
                                                            cancelable: true,   
                                                            view: window  
                                                        });
                                            
                                                        actualChevronUP.dispatchEvent(mouseDownEvent);
    
                                                    
                                                });
                                            }
                                            });
                                     
                                        }, 100);
    
                                        
                                }, 200);
                                
                                if (itemElement) {
                                    clearInterval(intervalId);
                                }
                            }, 500);
      
                        }
                    })

                    // JUST RELOAD COMMENT SECTION: NO SCROLL ANYWHERE
                    returnButton.addEventListener("mousedown", (e) => {
                        showTopic(value, id)
                    })
                    
                })
            })

            // EVENT LISTENERS FOR COLLAPSING COMMENTS
            appendEventToCollapse()

            // FOLD ALL COMMENTS ON LOADED
            const collapseButtons = document.querySelectorAll(".fa-chevron-up");
            collapseButtons.forEach((item) => {
            
                const mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,  
                    cancelable: true, 
                    view: window
                });
                
                item.dispatchEvent(mouseDownEvent);
            });

            // EVENT LISTENERS FOR COMMENTAREA: ONCLICK EXPAND!
            const comment = document.querySelector(".commentArea")
            comment.addEventListener("mousedown", (e) => {
                e.target.style.transitionDuration = "0.2s"
                e.target.style.height = "10rem"
            })
            document.addEventListener('mousedown', (e) => {
                if (!comment.contains(e.target)) {
                    comment.style.height = "3.5rem"
                }
            });
            
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error);
        });   
}
// BELOW ARE SUPPORTING FUNCTIONS FOR SHOWTOPIC (KIND OF THE HANDLER)
function createInitialTopicContainer(value){
    
    const topicWrapper = document.createElement("div");
    const topicTopic = document.createElement("p");
    const bodyTopicHeading = document.createElement("p")
    const bodyTopic = document.createElement("div");
    const commentHeading = document.createElement("p")
    const commentContainer = document.createElement("div");
    const commentArea = document.createElement("textarea");
    const submitButton = document.createElement("div");
    const exitButton = document.createElement("div")
    const topicId = document.createElement("p")


    commentArea.tabIndex = "1"
    submitButton.tabIndex = "2"
    exitButton.tabIndex = "3"


    topicId.classList.add("hidden-topic-id-field")
    // Above is a reference to the post!

    topicWrapper.classList.add("displayTopic-wrapper");
    topicTopic.classList.add("topicTopic");
    bodyTopic.classList.add("bodyTopic");
    commentContainer.classList.add("commentContainer");
    commentArea.classList.add("commentArea");
    submitButton.classList.add("submitButton");
    exitButton.classList.add("exitbutton")
    bodyTopicHeading.classList.add("header-styling-topic")
    commentHeading.classList.add("header-styling-topic")

    
    bodyTopicHeading.innerText = "Thread start: "
    commentHeading.innerText = "Comments: "
    topicTopic.innerText = value;
    
    commentArea.placeholder = "Any thoughts on this?";
    submitButton.innerText = "Contribute";
    exitButton.innerText = "Exit";
        
    topicWrapper.appendChild(topicTopic);  
    topicWrapper.appendChild(bodyTopic);
    commentContainer.prepend(commentHeading)
    topicWrapper.appendChild(commentArea);
    topicWrapper.appendChild(submitButton);
    topicWrapper.appendChild(exitButton);

    topicWrapper.appendChild(topicId)

    document.body.appendChild(topicWrapper);
}
function populateInitialTopic(data) {
    const bodyTopic = document.querySelector(".bodyTopic");

    const formattedTopicBody = data.topicBody ? data.topicBody.replace(/\n/g, "<br>") : "";

    let date = new Date();
    let localeDateTime = date.toLocaleString('en-GB');

    bodyTopic.innerHTML = `
        <div class="topic-chat">
            <p style="color:#1abc9c; font-weight:600;">Thread by: ${data.author}</p>
            <p style="color:black; font-weight:600">${data.topic}</p>
            <p style="font-size:0.8rem; font-style:italic;">Created: ${localeDateTime}</p>
            <p style="margin:0px; padding:0px; padding-bottom:0.5rem; white-space: pre-line;">
                ${formattedTopicBody}
            </p>
        </div>
    `;
}

function populateInitialComments(data) {
    if (data.comments && data.comments.length > 0) {
        const bodyTopic = document.querySelector(".bodyTopic");
        
        // Create a padding paragraph and add it to the bodyTopic
        const paddingParagraph = document.createElement("p");
        paddingParagraph.style.cssText = "margin: 0px; padding: 0px; height: 0.5rem;";
        bodyTopic.appendChild(paddingParagraph);

        // Loop through the comments and create comment elements
        data.comments.forEach(comment => {
            const commentParagraph = createCommentElement(comment, data.id);
            bodyTopic.appendChild(commentParagraph);
        });
        
    } else {
        console.log("No comments available.");
    }
}
function createCommentElement(comment, topicId) {
    // Create a container for the comment
    const commentParagraph = document.createElement("div");
    commentParagraph.classList.add("comment-container-js");
    commentParagraph.style.cssText = `
        margin: 0px;
        padding-left:0.5rem;
        color: #333333;
        background-color: white;
        overflow: visible;
        width:100%;
        overflow-x: visible;
    `;

    // Add collaps as option on divs, to collapse messages!

    const formattedCommentBody = comment.commentBody.replace(/\n/g, "<br>");

    commentParagraph.innerHTML = `
        <div class="comment-item-inner" style="padding-bottom: 0.5rem; box-sizing:border-box; overflow:hidden; width: 100%; position:relative; min-height: 5rem; padding-top: 0.5rem; display: flex; flex-direction: column; justify-content: center; row-gap:0.5rem; padding-bottom:1rem;" id="comment${comment.id}topic${topicId}">
            <p style="margin: 0px; min-height: 1rem; padding: 0px; color: #1abc9c; font-weight: 600; font-size: 0.9rem">${comment.author}</p>
            <p class="comment-item-inner-cntnt" style="margin: 0px; min-height: 1rem; padding: 0px; padding-right:5rem;">${formattedCommentBody}</p>
            <p class="comment-reply" style="margin-bottom: 0px;background-color: #1abc9c; display:flex; justify-content:center; align-items:center; color:whitesmoke; height:2rem; padding: 1rem; cursor: pointer; width:4rem;">Reply</p>
        </div>
    `;


    // If the comment has replies, recursively create reply elements
    if (comment.reply && comment.reply.length > 0) {
        // Create a container for the replies
        const replyContainer = document.createElement("div");
        replyContainer.style.marginLeft = "1.4rem";
        
        // Loop through each reply and append it as a nested comment
        comment.reply.forEach(reply => {
            const replyCommentElement = createCommentElement(reply, topicId);   
            replyContainer.appendChild(replyCommentElement);
        });

        // Append the replies container to the main comment
        commentParagraph.appendChild(replyContainer);
    }

    // If commentParagraph (comment contains nested comments) append a collapse button!
    if(comment.reply && comment.reply.length > 0){
            const collapseComment = document.createElement('i')
            collapseComment.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`
            collapseComment.classList.add("collapse-button-cmnt")
            collapseComment.style.cssText = 'bottom: 1rem; display: flex; justify-content: center; align-items:center; height:2rem; border:2px solid #1abc9c; padding: 1rem; border-radius: 50%; margin: 0px; padding: 0px; cursor: pointer; width: 2rem; position:absolute; color:#1abc9c; right: 1rem;';
            const comment = commentParagraph.querySelector(".comment-item-inner")
            comment.appendChild(collapseComment)

    }

    return commentParagraph;
}
function commentTopicMain(value, id){

    const submitButton = document.querySelector(".submitButton")
    const comment = document.querySelector(".commentArea")

    const currentPath = window.location.href;

    submitButton.addEventListener("mousedown", (e) => {

        const data = 
        {
            Id: id,
            Author: "John Doe",
            CommentBody: comment.value
        }

        fetch(currentPath + `community/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
            })
            .then((data) => {
                showTopic(value, id)
                // Create function that moves to the comment

            })
            .catch((error) => {
                console.error("There was a problem with the fetch operation:", error);
            });
    })

    submitButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){


            const data = 
            {
                Id: id,
                Author: "John Doe",
                CommentBody: comment.value
            }

            fetch(currentPath + `community/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
                .then((data) => {
                    document.querySelector(".displayTopic-wrapper").remove()
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error);
                });
        }
    })


 
}
function commentComment(topicId, parentCommentId, textAreaValue){

    const data = 
    {
        Id: 0,
        Author: "",
        CommentBody: textAreaValue
    }

    const currentPath = window.location.origin

    fetch(currentPath + `/community/comment/reply/${topicId}/${parentCommentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        })
        .then((data) => {
           
        })
        .catch((error) => {
            console.error("There was a problem with the fetch operation:", error); 
        });

    return 
}
function appendEventToCollapse(){

    const collapseButtons = document.querySelectorAll(".collapse-button-cmnt");
  
    collapseButtons.forEach((button) => {
        button.addEventListener("mousedown", (e) => {

           
                if(button.querySelector("i").classList.contains('fa-chevron-up')){
                    const parentContainer = button.closest("div");
                    const commentToCollapse = parentContainer.parentNode;
            
                    if (commentToCollapse.children[1]) {
                        commentToCollapse.children[1].style.display = "none";
                    }
            
                    // Change the button text to "Collapse"
                    button.innerHTML = `<i class="fa-solid fa-chevron-down"></i>`;
                } 
                // If the button text is "Collapse"
                else if (button.querySelector("i").classList.contains('fa-chevron-down')) {
                    const parentContainer = button.closest("div");
                    const commentToCollapse = parentContainer.parentNode;
            
                    // Hide the second child (collapse the content)
                    if (commentToCollapse.children[1]) {
                        commentToCollapse.children[1].style.display = "block";
                        commentToCollapse.scrollIntoView('smooth')
                    }
            
                    // Change the button text back to "Expand"
                    button.innerHTML = `<i class="fa-solid fa-chevron-up"></i>`;
                }
        
            

    });
    
    })

}

// ACTIVATE SUBMIT TOPIC
function populateSubmitTopicCommunity(heading){

    const mainContent = document.createElement("div")
    const inputHeader = document.createElement("input")
    const inputContent = document.createElement("textarea")
    const inputButton = document.createElement("button")
    const header = document.createElement("p")
    const exitButton = document.createElement("div")

    mainContent.classList.add("submitTopic-wrapper")
    inputHeader.classList.add("submitTopic-topic")
    inputContent.classList.add("submitTopic-textarea")
    inputButton.classList.add("submitTopic-btn")
    header.classList.add("submitTopic-header")
    exitButton.classList.add("submitTopic-btn-exit")

    header.innerText = `Submit to ${heading}`
    inputHeader.placeholder = "Whats on your mind?"
    inputContent.placeholder = "Why?"
    inputButton.innerText = "Contribute"
    exitButton.innerText = "Exit"

    mainContent.appendChild(header)
    mainContent.appendChild(inputHeader)
    mainContent.appendChild(inputContent)
    mainContent.appendChild(inputButton)
    mainContent.appendChild(exitButton)

    document.body.appendChild(mainContent)

    exitButton.addEventListener("mousedown", (e) => {
        mainContent.remove()
    })

    setTimeout(() => {
        inputHeader.focus()
    }, 100);

    submitTopicCommunity(heading)
}
function submitTopicCommunity(header){

    const buttonElement = document.querySelector(".submitTopic-btn")
    const headerValue = document.querySelector(".submitTopic-topic")
    const bodyValue = document.querySelector(".submitTopic-textarea")

    if(header.toLowerCase() == "recipes")
        header = "ColumnRecipes"
    if(header.toLowerCase() == "tips & tricks")
        header = "ColumnTipsTricks"
    if(header.toLowerCase() == "utensils & cookware")
        header = "ColumnCookware"
    if(header.toLowerCase() == "general chat")
        header = "ColumnGeneral"

    const currentPath = window.location.href

    buttonElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {

            const data = {
                Author: "general",
                Topic: headerValue.value ? headerValue.value : "",
                TopicBody: bodyValue.value ? bodyValue.value : "",
                Category: header,
                Comments: [],
                CommentPost: "",
                Rating: "5",
                ViewCount: 0,
            };

            fetch(currentPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
                .then((data) => {
                    document.querySelector(".submitTopic-wrapper").remove()
                    window.location.reload()
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error); 
                });
        }
    });
    
    buttonElement.addEventListener("mousedown", (e) => {
            const data = {
                Author: "general",
                Topic: headerValue.value ? headerValue.value : "",
                TopicBody: bodyValue.value ? bodyValue.value : "",
                Category: header,
                Comments: [],
                CommentPost: "",
                Rating: "5",
                ViewCount: 0,
            };

            fetch(currentPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
                })
                .then((data) => {
                    document.querySelector(".submitTopic-wrapper").remove()
                    window.location.reload()
                })
                .catch((error) => {
                    console.error("There was a problem with the fetch operation:", error); 
                });
        }
    )
}
// CONVOS
document.querySelectorAll('.index-latest-convos').forEach(item => {
    item.addEventListener('click', (e) => {
        const convosContainer = e.currentTarget;

        const title = convosContainer.querySelector('#index-topic').innerText;

        const id = convosContainer.querySelector('#index-com-id').innerText;
        showTopic(title, id);
    });
});
// FOOD
generatorItems.forEach((item) => {
    item.addEventListener("mousedown", (e) => {
        loadPopupIndex(item.querySelector("p").innerText)
    })
})

// SCROLL APPLY SHADING ON TOP OF SCROLLABLE DIVS!

const columnOne = document.querySelector(".clm-one-general")

const columnTwo = document.querySelector(".clm-two-general")
const columnThree = document.querySelector(".clm-three-general")

const columnOneHeading = document.querySelector(".index-clm-one-heading")
const columnTwoHeading = document.querySelector(".index-clm-two-heading")
const columnThreeHeading = document.querySelector(".index-clm-three-heading")

columnTwo.addEventListener("scroll", (e) => {
    if(columnTwo.scrollTop > 0){

        columnTwoHeading.style.boxShadow = "0 2px 10px rgba(189, 195, 199, 0.41)";
        columnTwo.style.borderTop = "1px solid rgba(0, 0, 0, 0.2)"

    }else {

        columnTwoHeading.style.boxShadow = "none";
        columnTwo.style.border = "none"
    }
})

columnThree.addEventListener("scroll", (e) => {
    if(columnThree.scrollTop > 0){

        columnThreeHeading.style.boxShadow = "0 2px 10px rgba(189, 195, 199, 0.41)";
        columnThree.style.borderTop = "1px solid rgba(0, 0, 0, 0.2)"

    }else {

        columnThreeHeading.style.boxShadow = "none";
        columnThree.style.border = "none"
    }
})

columnOne.addEventListener("scroll", (e) => {
    if(columnOne.scrollTop > 0){

        columnOneHeading.style.boxShadow = "0 2px 10px rgba(189, 195, 199, 0.41)";
        columnOne.style.borderTop = "1px solid rgba(0, 0, 0, 0.2)"

    }else {

        columnOneHeading.style.boxShadow = "none";
        columnOne.style.border = "none"
    }
})

// BELOW IS FOR TOGGLE ACTIVITY FEED INDEX

const newHeadingIndex = document.querySelectorAll(".heading-activities-text")
const colOne = document.querySelector(".main-clm-two")
const colTwo = document.querySelector(".main-clm-three")

newHeadingIndex[0].style.color = "#1abc9c"
newHeadingIndex[0].style.textDecoration = "underline"


newHeadingIndex[0].addEventListener("mousedown", (e) => {
    colOne.style.display = "block"
    colTwo.style.display = "none"
    newHeadingIndex[0].style.color = "#1abc9c"
    newHeadingIndex[0].style.textDecoration = "underline"
    newHeadingIndex[1].style.textDecoration = "none"
    newHeadingIndex[1].style.color = "black"
})
newHeadingIndex[1].addEventListener("mousedown", (e) => {
    colOne.style.display = "none"
    colTwo.style.display = "block"
    newHeadingIndex[0].style.color = "black"
    newHeadingIndex[1].style.color = "#1abc9c"
    newHeadingIndex[1].style.textDecoration = "underline"
    newHeadingIndex[0].style.textDecoration = "none"


})


const contributors = document.querySelector(".trophy-heading")
let counterTrophy = 0

contributors.addEventListener("mousedown", (e) => {
    const trophyExpand = document.querySelector(".trophy-expand")
    const displayStyle = window.getComputedStyle(trophyExpand).display

    if (displayStyle === "flex") {
        trophyExpand.style.display = "none"
        return
    }

    if (counterTrophy === 1) {    
        trophyExpand.style.display = "flex"
        trophyExpand.style.height = "auto"
        return
    }

    if (trophyExpand.querySelector(".trophies")) {
        return
    }

    const currentPath = window.location.origin

    fetch(`${currentPath}/discover/topcontributors`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }
            return response.json()
        })
        .then(data => {

            const elementToExpand = document.querySelector(".trophy-expand")

            data.forEach((item) => {

                const trophy = document.createElement("p")
                const para = document.createElement("p")
                para.classList.add("contributor-trophy-name")
                const paraTwo = document.createElement("p")
                paraTwo.classList.add("contributor-trophy-value")

                para.innerText = `${item[0]}`
                paraTwo.innerText = `${item[1]}`

                const wrapper = document.createElement("div")
                wrapper.classList.add("trophies")

                wrapper.appendChild(trophy)
                wrapper.appendChild(para)
                wrapper.appendChild(paraTwo)
                elementToExpand.appendChild(wrapper)
            })

            elementToExpand.style.display = "flex"
            elementToExpand.style.height = "auto"

            counterTrophy = 1

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error)
        })
})


// Notification system on INDEX

const notificationContainer = document.querySelector(".index-notifications")

function LoadNotifications(){

    const pathCommentOnComments = "/community/comment/replies/notifications"
    const pathCommentOnThreadStart = "/community/thread/replies/notifications"


    // FETCH COMMENT ON COMMENT
    fetch(window.location.origin + pathCommentOnComments, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
    })
    .then(response => response.json())
    .then(data => {

        data.forEach((item) => {
            const array = ["CommentComment", item.id, item.commentBody, item.topicId]
            populateNotifications(array)
        })
      
    })
    .catch(error => console.error('Error:', error));

    // FETCH REPLIES TO THREADSTART
    fetch(window.location.origin + pathCommentOnThreadStart, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach((item) => {
                const array = ["Thread", item[0], item[1]]
            populateNotifications(array)
        })
        })
        .catch(error => console.error('Error:', error)); 

}

function populateNotifications(data){

    // Array like [Type, Id thread, Heading Thread]

    // Wrapper for entire thing
    const elementContainer = document.createElement('div')
    elementContainer.classList.add('notification-elm-wrap')

    // Wrapper for notificationbell
    const iconWrapper = document.createElement('div')
    iconWrapper.classList.add('notification-icon-wrap')
    iconWrapper.innerHTML = `<i class="fa-solid fa-bell"></i>`

    // Actual thread name
    const para = document.createElement('p')
    para.classList.add('paraNotification')
    para.style.margin = "0px"
    para.style.padding = "0px"

    // Hidden ID for thread
    const paraID = document.createElement('p')
    paraID.classList.add("id")
    paraID.innerText = data[1]
    paraID.style.display = "none"

    elementContainer.appendChild(iconWrapper)
    elementContainer.appendChild(para)
    elementContainer.appendChild(paraID)

    if (data[0] === "Thread") {
        iconWrapper.style.backgroundColor = "orangered";
        para.innerText = `Replies in Thread: ${data[2]}`;

        NotifyUserNotification("You have new messages!")
    }
    
    if (data[0] === "CommentComment") {
        iconWrapper.style.backgroundColor = "mediumpurple";
        para.innerText = `Replies on Comment: ${data[2]}`;

        NotifyUserNotification("You have new messages!")

    }

    notificationContainer.appendChild(elementContainer)

    // Remove element after click!
    elementContainer.addEventListener("mousedown", (e) => {
     
        elementContainer.remove()

        var result = notificationContainer.querySelector(".notification-elm-wrap")
        
        if(result == null){
                NotifyUserNotification("Notifications")
            
        }
    
    })

    triggerEventListenerNotify(data)

}

// Trigger notification load on page INDEX
window.addEventListener('load', () => {
    LoadNotifications();
});

function NotifyUserNotification(value){
    const item = document.querySelector(".index-account-heading")
    const result = item.querySelector("span")
    result.innerText = value
    setTimeout(() => {
        result.style.animation = "fadeIn 1.5s ease-in-out forwards"
    }, 500);

}

function triggerEventListenerNotify(data){
    const elementNotification = document.querySelectorAll(".notification-elm-wrap")

    elementNotification.forEach((notification) => {
        notification.addEventListener("mousedown", (e) => {
    
            // Now disable notification for message reply and topic reply

            const id = notification.querySelector(".id").innerText
            const type = notification.querySelector(".paraNotification").innerText
            var resultSplit = type.split(":")
            
            if (resultSplit[0].toLowerCase().includes("thread")) {
                setTimeout(() => {
                    ThreadNotificationDisable(id)
                }, 1500);
                setTimeout(() => {
                    showTopic("", data[1])
                }, 500)
            }
            
            if (resultSplit[0].toLowerCase().includes("comment")) {
                setTimeout(() => {
                    CommentNotificationDisable(id)
                }, 1500);

                setTimeout(() => {

                    showTopic("", data[3])

                    setTimeout(() => {
                        const ScrollItem = document.getElementById(`comment${id}topic${data[3]}`)
                        const closestItem = ScrollItem.parentNode

                        let currentElement = closestItem

                        // Traverse up from current element and mousedown on all chevrons until we reach the body!
                        while (currentElement != null) {

                            if (currentElement.classList.contains("bodyTopic")) {
                                break;
                            }

                            currentElement.querySelectorAll('.fa-chevron-down').forEach((element) => {
                                const mousedownEvent = new MouseEvent('mousedown', {
                                    bubbles: true, 
                                    cancelable: true,
                                    view: window,
                                })

                                element.dispatchEvent(mousedownEvent)
                            });

                            currentElement = currentElement.parentElement
                        }

                        setTimeout(() => {
                            ScrollItem.scrollIntoView("smooth")
                        }, 200)


                    }, 200)

                }, 500)
            }
            
        })
    })
}

function ThreadNotificationDisable(value){

        fetch(window.location.origin + `/community/topic/update/notify/${value}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => console.log(response))
        .catch(error => console.error('Error:', error))

}

function CommentNotificationDisable(value){

    fetch(window.location.origin + `/community/comment/update/notify/${value}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => console.log(response))
    .catch(error => console.error('Error:', error))

}


// BELOW IS FOR VIEW MY RECIPE IN ACCOUNT

const myRecipeHeading = document.querySelector(".myrecipe-heading")
let myRecipeExpandToggle = 0

myRecipeHeading.addEventListener("mousedown", (e) => {
    const recipeExpand = document.querySelector(".myrecipe-expand")

    if(myRecipeExpandToggle === 1){

        recipeExpand.style.display = "none"
        myRecipeExpandToggle = 0

    }else if(myRecipeExpandToggle === 0){

        
        recipeExpand.style.display = "flex"
        myRecipeExpandToggle = 1

            fetch(window.location.origin + "/discover/myrecipes")
            .then(response => response.ok ? response.json() : Promise.reject(`Failed: ${response.status}`))
            .then(response => {
                
                recipeExpand.innerHTML = ""

                response.forEach((item) => {
                    const wrapperDiv = document.createElement("div")
                    wrapperDiv.classList.add("myrecipes-wrapper-item")

                    const createElement = document.createElement("p")
                    const createElementEye = document.createElement("i")

                    createElement.classList.add("myrecipe-headers")
                    let counterString = item.heading.length

                    let substring = ""
                    if(counterString >= 30){
                        substring = item.heading.substring(0, 30)
                        createElement.innerText = substring + ".."

                    }else {
                        substring = item.heading.substring(0, 30)
                        createElement.innerText = substring
                    }

                    createElementEye.innerHTML = `<i class="fa-solid fa-eye"></i>`
                    
                    wrapperDiv.append(createElement)
                    wrapperDiv.append(createElementEye)

                    recipeExpand.append(wrapperDiv)

                    setTimeout(() => {
                        wrapperDiv.addEventListener("mousedown", (e) => {
                            loadPopupIndex(response.id)
                        })
                    }, 100);

                });



                
            })
            .catch(console.error)

    }

})


