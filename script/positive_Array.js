let armStatment = [
  ["More Than Happy To Help",],
  ["More Than Happy To assist",],
  ["See What I Can Do",],
  ["Let Me Take A Look",],
  ["I Can Assist",],
  ["Certainly assist",],
  ["Certainly help",],
  ["Certainly understand",],
  ["Definitely assist",],
  ["Definitely Help",],
  ["Definitely understand",],
  ["Take Care Of",],
  ["See What's Going On",],
  ["Help With",],
  ["Investigate",],
]


let TEMPphrases = [  
  ["I have a lot of experience with [service issue], let me see if I can resolve that issue.",],
  ["I'm sorry to hear about your network [service issue]. Let me take a look and see what I can do.",],
  ["I certainly understand the inconvenience of [service issue]. Our support team is here to help.",],
  ["I apologize for the frustration you may be experiencing with your [service issue]. I'll do my best to resolve it.",],
  ["Our goal is to provide you with reliable service, let me take care of your [service issue].",],
  ["I appreciate your patience as we work to resolve your [service issue].",],
  ["I understand the importance of a functioning [service]. Let me assist you in resolving your [service issue].",],
  ["I'm here to help with your [service issue]. Let's get your services back to normal quickly.",],
  ["We believe in providing exceptional service. Let me investigate your [service issue].",],
  
  ["I'm here to assist you in resolving your network [service issue]. I'm definitely up for the challenge!",],
  ["I'm sorry that happened. Let's get your network [service issue] fixed and back to normal as soon as possible.",],
  ["We are a team of experts, I'm sure we can resolve your network [service issue] quickly and efficiently.",],
  ["Sorry to hear about your [service issue], let me see what I can do to help.",],
  ["I can understand how important it is to have reliable network services. Let's resolve your [service issue] together.",],
  ["I'm here to assist with your network [service issue] and provide a positive resolution.",],
  ["We understand how important it is to have network services running smoothly. Let me help resolve your [service issue].",],
  ["I'm confident that we can resolve your network [service issue]. I'll do everything I can to help.",],
  ["We're here to provide an outstanding network repair experience. Let's resolve your [service issue] together.",],
  ["Let's work together to resolve your network [service issue]. I'm here to assist you in any way I can.",],

  ["I appreciate the opportunity to assist with resolving the [service issue] you're facing.",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
  ["",],
]

let armDisplay = [
  ["I am more than happy to help you with any [Issue] you may be experiencing.",],
  ["I am more than happy to assist you in resolving any [Issue] you may be facing.",],
  ["I can certainly understand your concern, I'll investigate the [Issue] and take the necessary steps to resolve it.",],
  ["Let me take a look and see if I can diagnose and resolve the [Issue] you are having.",],
  ["I can assist you in troubleshooting and fixing any [Issue] you may be having.",],
  ["I can definitely help you resolve your [Issue].",],
  ["I can certainly assist you in resolving any [Issue] you may be experiencing.",],
  ["I Certainly understand the frustration of [Issue] and I will do my best to help you fix it.",],
  ["I definitely understand the importance of resolving your [Issue] and I will do everything I can to help.",],
  ["I will take care of any [Issue] you may be experiencing and get your services back to normal as soon as possible.",],
  ["Let me take a look and see what's going on with your [Issue] so we can resolve the issue.",],
  ["I am here to help with any [Issue] you may be facing and get your services back to normal quickly.",],
  ["Let me see what I can do to help fix your [Issue].",],
]

let negativeWords = [ 
  ["i can't","we can't",],
  ["i don't","we don't",],
  ["are unable","am unable","i'm unable","not able",],
  ["unfortunately",],
];

let empathyWords = [ //if you see words here with letters missing, that is intentions. It is to account for tences
  ["Apologize",],
  ["Approachable",],
  ["compassion",],
  ["Empath",],
  ["Encouraging",],
  ["Frustrat",], 
  ["Inconvenienc",],
  ["Our Support",],
  ["Patien",],
  ["reliabl",],
  ["Sorry to hear","Sorry you're having","Sorry that happened",],
  ["our services",],
  ["sympath",],
  ["Understanding",],
]




let positiveWords = [ // [0] is the base word. [1...] are alt words of the same sentiment i.e easy vs easily will be the same word
  ["Absolutely",],
  ["Amazing",],
  ["Accepted",],
  ["Appreciate",],
  ["Awesome",],
  ["Beautiful",],
  ["Believe",],
  ["Certain",],
  ["Completely",],
  ["Creative",],
  ["Definitely",],
  ["Delight",],
  ["Easy","easily",],//easily does not contain teh word easy, as to not punish the agent for using a modified version of the word, easily is added to an alt list
  ["Ecstatic",],
  ["Enjoy",], //since enjoying contains the word enjoy, there is no need to add enjoying to the alt list as the logic accounts for partial words
  ["Essential",],
  ["Excellent",],
  ["Exceptional",],
  ["Exciting","excit"],
  ["Expert",],
  ["Exquisite",],
  ["Fabulous",],
  ["Fantastic",],
  ["Fascinating","fascinat"],
  ["Favorite",],
  ["Familiar",],
  ["Friendly",],
  ["Generous",],
  ["Genius",],
  ["Great",],
  ["Ideal",],
  ["Impressive","impress"],
  ["Interesting","Intrest"],
  ["Marvelous",],
  ["Memorable",],
  ["Outstanding",],
  ["Opportunity",],
  ["Positive",],
  ["Quickly",],
  ["Recommend",],
  ["Renowend",],
  ["Resolve","Resolution"],
  ["Sensational",],
  ["Skillful",],
  ["Splendid",],
  ["Superb",],
  ["Terrific",],
  ["Thank You",],
  ["Very Good","Really Good"],//listed a secondary positive word for "Good" 
];







let phrases = [
  ["I'm here to help you with this issue. Let me see if I can find a solution.",],
  ["I'm going to take a closer look and see if I can identify the problem you're experiencing.",],
  ["I'm going to check a few things on my end and see if I can find a resolution.",],
  ["Don't worry, we'll get this issue sorted out together. Let's see what we can do.",],
  ["I appreciate your patience while I work on finding a solution for you.",],
  ["I'm committed to helping you resolve this issue. Let me see what I can do.",],
  ["I'm going to do some further investigation and get back to you with more information.",],
  ["I'm sorry for any delay. I'm actively working on finding a resolution for you now.",],
  ["Let me see if I can find a workaround for the problem you're experiencing.",],
  ["I'm going to check with my team and see if anyone has encountered this issue before.",],
  ["We're going to get this issue resolved as quickly as possible. Let me see what I can do.",],
  ["I apologize if this has caused any frustration. I'm going to do my best to find a solution.",],
  ["We want to make sure this issue is resolved as soon as possible. Let me see what I can do.",],
  ["I'm going to consult some resources and see if I can find a solution for you.",],
  ["I understand your concern. Let me see if I can find a way to resolve this for you.",],
  ["I'm going to check on the status of this issue and get back to you with an update.",],
  ["I appreciate your patience while I work on finding a resolution for you.",],
  ["I'm going to try a few different things to see if we can get this issue resolved for you.",],
  ["I understand how disruptive this can be. Let me see what I can do to help.",],
  ["I'm going to check our system logs and see if there's any information there that might be helpful in resolving this issue.",],
  ["I'm going to do some more digging and see if I can find a solution for you.",],
  ["I'm going to check with our support team and see if anyone has encountered this issue before and found a solution.",],
  ["I'm going to do some more research and get back to you as soon as I have more information.",],
  ["Absolutely, we can help you with that issue.",],
  ["Amazing, let's get that problem resolved for you.",],
  ["I completely understand your concern. We'll get it fixed.",],
  ["Don't worry, I'm here to help you. Let's get creative and find a solution.",],
  ["Definitely, I can assist you with that.",],
  ["I would be delighted to help you with any technical issues you're experiencing.",],
  ["I'll make this process as easy as i can for you.",],
  ["Excellent, I'll take care of that for you.",],
  ["We have exceptional skills in resolving technical issues.",],
  ["Exciting to help you with your technical troubles.",],
  ["Fantastic, we'll get that issue resolved for you.",],
  ["We're familiar with all types of technical issues, I'll be happy to help you.",],
];


//this is a list of words that should always be displayed such as Email, almost every call can benefit from an EHH
//the 1st index in each list will be the displayed word
//the items here will be added to boxes in reverse order starting with index 0,0 being added to teh last box
let defaultWords =[
  ["E-Mail","Email","Text Message"],
  ["Recap",],
  ["\"Empathy\" \"Phrase\"", "Apologize", "Approachable", "compassion", "Empath", "Encouraging", "Frustrat", "Inconvenienc", "Our Support", "Patien", "reliabl", "Sorry to hear", "Sorry you're having", "Sorry that happened", "our services", "sympath", "Understanding",],
]

let ignoreWords =[ //list of words to ignore a round reset if said in the same line as the word spectrum
  ".com",
  ".net",
  "app",
  "account",
  "box",
  "email",
  "location",
  "modem",
  "office",
  "receiver",
  "remote",
  "router",
  "store",
  "technician",
  "wifi",
  "wi-fi",
  ]