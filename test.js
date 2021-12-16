    var attachmentForUser = <user_information>;
    
    function setConciergeAttachment(attachment) {
        if (window.capacityConcierge) {
            window.capacityConcierge.set_attachment(attachment);
        }
    }
    document.addEventListener("DOMContentLoaded", function () {
        setConciergeAttachment(attachmentForUser);
    });

    var targetResponsePartial = "The agent has ended the chat."; // Response text for the script to listen to, only needs to be a partial match
    var inquiry = "live chat survey"; // Inquiry to trigger
    var isSilentInquiry = true; // Whether the inquiry chat bubble should be displayed
    var delayMs = 0; // Add a delay (in ms) before inquiry is triggered, if desired
    var bodyObserver = new MutationObserver(function() {
        var element = document.querySelector("#ais-concierge .ajc_root");
        if (element) {
            bodyObserver.disconnect();
            if (window.capacityConcierge) {
                try { 
                    window.capacityConcierge.bind_event_hooks({
                        message_event: function message_event(event) {
                          if (event.event === "MESSAGE:RECEIVE:RESPONSE") {
                            if (event.value.indexOf(targetResponsePartial) !== -1) {
                              if (event.state && !event.state.isBusy) {
                                window.capacityConcierge.ask(
                                  inquiry,
                                  isSilentInquiry,
                                  delayMs,
                                  false,
                                  "CUSTOM_INQUIRY"
                                );
                              } else {
                                console.warn(
                                  "CAPACITY_CONCIERGE:CUSTOM_SCRIPT: Conversation session is busy, ignoring custom inquiry."
                                );
                              }
                            }
                          }
                        }
                    });
                } 
                catch (error) {
                    console.error(error);
                }
            }
        }
    });
            
    bodyObserver.observe(document.body, {
        childList: true
    });
