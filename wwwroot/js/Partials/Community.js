const columnsAll = document.querySelectorAll(".community-main-cntr-clmn")
const columnButtons = document.querySelectorAll(".community-btn-cntrbt")


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

    fetch(url + `/${id}`, {
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
                        margin-bottom:auto;
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
function populateInitialTopic(data){

    const bodyTopic = document.querySelector(".bodyTopic");

    const formattedTopicBody = data.topicBody.replace(/\n/g, "<br>");


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
    if (data.comments.length > 0) {
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
            collapseComment.style.cssText = 'bottom: 1rem; display: flex; justify-content: center; align-items:center; height:2rem; border:2px solid #1abc9c; padding: 1rem; border-radius: 50%; margin: 0px; padding: 0px; cursor: pointer; width: 2rem; position:absolute; color:teal; right: 1rem;';
            const comment = commentParagraph.querySelector(".comment-item-inner")
            comment.appendChild(collapseComment)

    }

    return commentParagraph;
}
function commentTopicMain(value, id){

    const submitButton = document.querySelector(".submitButton")
    const comment = document.querySelector(".commentArea")
    const exitButton = document.querySelector(".exitbutton")

    const currentPath = window.location.href;

    submitButton.addEventListener("mousedown", (e) => {

        const data = 
        {
            Id: id,
            Author: "John Doe",
            CommentBody: comment.value
        }

        fetch(currentPath + `/comment`, {
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

            fetch(currentPath + `/comment`, {
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

    submitButton.addEventListener("mousedown", (e) => {
        if(e.key === "Enter"){


            const data = 
            {
                Id: id,
                Author: "John Doe",
                CommentBody: comment.value
            }

            fetch(currentPath + `/comment`, {
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
            console.log(data)
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
            
                    // Show the second child (assuming it's the comment or content to expand)
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

    inputHeader.tabIndex = 1
    inputContent.tabIndex = 2
    inputButton.tabIndex = 3
    exitButton.tabIndex = 4

    mainContent.appendChild(header)
    mainContent.appendChild(inputHeader)
    mainContent.appendChild(inputContent)
    mainContent.appendChild(inputButton)
    mainContent.appendChild(exitButton)

    document.body.appendChild(mainContent)

    exitButton.addEventListener("mousedown", (e) => {
        mainContent.remove()
    })

    exitButton.addEventListener("keydown", (e) => {
        if(e.key === "Enter"){
            mainContent.remove()
        }
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

        if(headerValue.value.length < 5){
            alert("Please enter a proper header, min 5 letters")
            return 
        }

        if(bodyValue.value.length < 10){
            alert("Please enter a proper topic body, min 10 letters")
            return
        }

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
        if(headerValue.value.length < 5){
            alert("Please enter a proper header, min 5 letters")
            return 
        }

        if(bodyValue.value.length < 10){
            alert("Please enter a proper topic body, min 10 letters")
            return
        }


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
// ACTIVATE SUBMIT TOPIC END


// Responsible for activating submitform (topic)
columnButtons.forEach((item, index) => {
    item.addEventListener("mousedown", (e) => {
        const topic = document.querySelectorAll(".community-main-clmn-header");
        const topicContainer = document.querySelectorAll(".community-main-cntr-clmn")

        topicContainer.forEach((containers, indexes) => {
            const computedStyle = getComputedStyle(containers);

            if (computedStyle.display === "flex") {
                const headerText = topic[indexes].innerText.trim().toLowerCase();

                if (headerText === "recipes") {
                    populateSubmitTopicCommunity("Recipes");
                } else if (headerText === "tips & tricks") {
                    populateSubmitTopicCommunity("Tips & Tricks");
                } else if (headerText === "cookware") {
                    populateSubmitTopicCommunity("Utensils & Cookware");
                } else if (headerText === "general chat") {
                    populateSubmitTopicCommunity("General chat");
                }
            }
        });
    });
});

// Responsible for activating read/Submitform (activeTopics)

const topic = document.querySelectorAll(".community-cntr-toappend")

topic.forEach((item) => {
    item.addEventListener("mousedown", (e) => {
        item.querySelectorAll(".cntr-header").forEach((heading) => {

            GlobalTopicText = heading.innerText
            GlobalTopicId = heading.querySelector("p").innerText

            showTopic(heading.innerText, heading.querySelector("p").innerText)

        })
    })
})
    

// ON TOGGLE COMMUNITY TITLES SHOW THE THREADS FOR THAT TOPIC
const communityTopics = document.querySelectorAll(".menu-items")
const mainWrapper = document.querySelector(".community-main-cntr")
const communityWrapper = document.querySelector(".community-main-wrapper")
const columnsCommunity = document.querySelectorAll(".community-main-cntr-clmn")
const buttonsMenu = document.querySelectorAll(".community-navbar-items")

const wrapperListItems = document.querySelectorAll(".wrapper-div-items")
const listItems = document.querySelectorAll(".community-cntr-toappend")

window.onload = () => {

        setTimeout(() => {

                communityWrapper.style.transitionDuration = "1s"
                communityWrapper.style.opacity = "1"
            
         
        }, 200);

        columnsCommunity[0].style.display = "flex"

}
const colors = ['#ff8f7d', '#b19cd9', '#66d6a2', '#f3c1a1'];

buttonsMenu.forEach((item, index) => {

    item.addEventListener("mousedown", (e) => {

        columnsCommunity.forEach((columns) => {
            columns.style.display = "none"
        });

        columnsCommunity[index].style.display  = "flex"

    })
});

// ON SCROLL COLUMN TOPIC APPLY BOX SHADOW 

wrapperListItems.forEach((item, index) => {
    item.addEventListener("scroll", function() {
    const topDiv = document.querySelectorAll(".community-main-clmn-header");

    if (item.scrollTop > 10) {
        console.log("tangerine")
        topDiv[index].style.boxShadow = "0 2px 10px rgba(189, 195, 199, 0.41)";
        item.style.borderTop = "1px solid rgba(0, 0, 0, 0.2)"
        
    } else {
      topDiv[index].style.boxShadow = "none";
      item.style.border = "none"
    }
  });
})

const latesColumn = document.querySelector(".clm-two-general")

// ON SCROLL COLUMN LATEST APPLY BOX SHADOW
latesColumn.addEventListener("scroll", function() {
    const topDiv = document.querySelector(".community-latest-header");

    if (latesColumn.scrollTop > 10) {
        console.log("tangerine")
        topDiv.style.boxShadow = "0 2px 10px rgba(189, 195, 199, 0.41)";
        latesColumn.style.borderTop = "1px solid rgba(0, 0, 0, 0.2)"
        
    } else {
        topDiv.style.boxShadow = "none";
        latesColumn.style.border = "none"
    }

});


// ANOTHER ACTIVATE FOR LATEST CONVERSATIONS

const latestConvosItems = document.querySelectorAll(".index-latest-convos");

latestConvosItems.forEach((item) => {

    item.addEventListener("mousedown", (e) => {
        const itemID = item.querySelector("p").innerText;
        const topicName = item.querySelector("#index-topic");
        showTopic(topicName.innerText.trim(), itemID.trim());
    });
});


// BELOW LOAD MORE TOPICS!!!!

let IndexTopic = 0

let TopicCategory = "cookandcrap"

const LoadMoreBtn = document.querySelectorAll(".load-more-btn")

// Remove buttons if there is no more than ten topics preloaded!

LoadMoreBtn.forEach((item) => {
    let element = item.parentNode.parentNode
    let indexCount = element.querySelector(".wrapper-div-items")

    if(indexCount.childNodes.length < 23){
        item.remove()
    }
})

LoadMoreBtn.forEach((item) => {

    item.addEventListener("mousedown", (e) => {

        let element = item.parentNode.parentNode

        let header = element.querySelector(".community-main-clmn-header")

        let headerText = header.querySelector("p")

        let column = headerText.innerText.trim()

        if(column == "Recipes")
            TopicCategory = "ColumnRecipes"

        if(column == "Tips & Tricks")
            TopicCategory = "ColumnTipsTricks"

        if(column == "Cookware")
            TopicCategory = "ColumnCookware"

        if(column == "General chat")
            TopicCategory = "ColumnGeneral"


        let indexCount = element.querySelector(".wrapper-div-items")
        let count = indexCount.querySelectorAll(".community-cntr-toappend")

        fetch(window.location.href + `/${count.length + 1}/more/${TopicCategory}`)
            .then(response => {
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                return response.json();
                })
            .then(data => {

                if(data.length == 0){
                    item.remove()
                    return
                }

                var result = generateTopicContent(data)

                result.forEach((item) => {

                    item.addEventListener("mousedown", (e) => {
                        item.querySelectorAll(".cntr-header").forEach((heading) => {
                
                            GlobalTopicText = heading.innerText
                            GlobalTopicId = heading.querySelector("p").innerText
                
                            showTopic(heading.innerText, heading.querySelector("p").innerText)
                
                        })
                    })

                    indexCount.insertBefore(item, indexCount.children[indexCount.children.length - 2]);

                });

            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });

    })
});

function generateTopicContent(data) {

    let arrayOfTopics = []

    data.forEach(item => {

        const communityCntr = document.createElement('div');
        communityCntr.classList.add('community-cntr-toappend');

        const cntrHeader = document.createElement('div');
        cntrHeader.classList.add('cntr-header');

        const idParagraph = document.createElement('p');
        idParagraph.style.display = 'none';
        idParagraph.textContent = item.id;

        const topicParagraph = document.createElement('p');
        topicParagraph.classList.add('community-topic-data');
        topicParagraph.textContent = item.topic;

        const topicSubParagraph = document.createElement('p');
        topicSubParagraph.classList.add('community-topic-sub');
        topicSubParagraph.textContent = item.topicBody.substring(0, Math.min(50, item.topicBody.length)) + (item.topicBody.length > 50 ? "..." : "");

        cntrHeader.appendChild(idParagraph);
        cntrHeader.appendChild(topicParagraph);
        cntrHeader.appendChild(topicSubParagraph);

        const cntrInteractions = document.createElement('div');
        cntrInteractions.classList.add('cntr-interactions');

        const viewCountParagraph = document.createElement('p');
        viewCountParagraph.classList.add('cmnt-data');
        viewCountParagraph.innerHTML = `<i class="fa-solid fa-eye"></i> <span>${item.viewCount}</span>`;

        const commentsCountParagraph = document.createElement('p');
        commentsCountParagraph.classList.add('cmnt-data');
        commentsCountParagraph.innerHTML = `<i class="fa-solid fa-comment"></i> <span>${item.comments.length}</span> <span>&nbsp;comments</span>`;

        const latestReplyParagraph = document.createElement('p');
        latestReplyParagraph.classList.add('cmnt-data');
        const latestReplyAuthor = item.comments.length > 0 ? item.comments[0].author : "none";
        latestReplyParagraph.innerHTML = `<i class="fa-solid fa-reply"></i> <span class="latest-reply">Latest reply from <b><span>${latestReplyAuthor}</span></b></span>`;

        cntrInteractions.appendChild(viewCountParagraph);
        cntrInteractions.appendChild(commentsCountParagraph);
        cntrInteractions.appendChild(latestReplyParagraph);

        communityCntr.appendChild(cntrHeader);
        communityCntr.appendChild(cntrInteractions);

        arrayOfTopics.push(communityCntr);


    })

    return arrayOfTopics

}
